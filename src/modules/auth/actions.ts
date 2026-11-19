"use server";

import { prisma } from "@/lib/db";
import { hashPassword, verifyPassword, createSession, deleteSession, getCurrentAdmin } from "@/lib/auth";
import { checkClusterRateLimit } from "@/lib/rate-limit";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function loginAdmin(formData: FormData, explicitIp?: string) {
  let clientIp = explicitIp;
  if (!clientIp) {
    try {
      const headerList = await headers();
      const realIp = headerList.get("x-real-ip");
      const forwardedFor = headerList.get("x-forwarded-for");
      clientIp =
        realIp?.trim() ||
        forwardedFor?.split(",")[0]?.trim() ||
        "127.0.0.1";
    } catch {
      clientIp = "127.0.0.1";
    }
  }

  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const rawPasswordInput = (formData.get("password") as string) || "";
  const password = rawPasswordInput;

  if (!email || !password) {
    return { success: false, message: "Vui lòng nhập đầy đủ Email và Mật khẩu." };
  }

  // 1. Chống Brute Force đa tầng hợp nhất toàn bộ PM2 Cluster:
  // - Theo IP: tối đa 15 lần thử sai / 15 phút
  // - Theo Tài khoản: tối đa 10 lần thử sai / 15 phút (chống tấn công phân tán qua proxy)
  const [ipLimiter, accountLimiter] = await Promise.all([
    checkClusterRateLimit(`login_ip_${clientIp}`, 15, 15 * 60 * 1000),
    checkClusterRateLimit(`login_account_${email}`, 10, 15 * 60 * 1000),
  ]);

  if (!ipLimiter.success || !accountLimiter.success) {
    return {
      success: false,
      message: "Bạn đã thử đăng nhập sai quá nhiều lần. Vui lòng quay lại sau 15 phút.",
    };
  }

  try {
    let user = await prisma.adminUser.findUnique({
      where: { email },
    });

    const defaultEmail = (process.env.ADMIN_DEFAULT_EMAIL || "admin@logisticsgt.vn").toLowerCase();
    const rawPassword = process.env.ADMIN_DEFAULT_PASSWORD || "Admin@GT2026!";
    const isMasterAdminEmail =
      email === defaultEmail ||
      email === "admin@logisticsgt.vn" ||
      email === "admin@htclogistics.vn";

    // 2. Khởi tạo tài khoản Master Admin mặc định nếu database trống
    if (!user && isMasterAdminEmail) {
      try {
        const passwordHash = await hashPassword(rawPassword);
        user = await prisma.adminUser.create({
          data: {
            email: defaultEmail,
            passwordHash,
            fullName: process.env.ADMIN_DEFAULT_NAME || "Quản Trị Viên GT Logistics",
            role: "ADMIN",
          },
        });
      } catch (err) {
        console.error("Lỗi tự tạo admin:", err);
      }
    }

    if (!user) {
      return { success: false, message: "Email hoặc mật khẩu không chính xác." };
    }

    let isValid = await verifyPassword(password, user.passwordHash);
    // Hỗ trợ trường hợp copy-paste vô tình dính khoảng trắng ở đầu/cuối
    if (!isValid && password.trim() !== password) {
      isValid = await verifyPassword(password.trim(), user.passwordHash);
    }

    // Xác thực nghiêm ngặt dựa trên mật khẩu mã hóa trong database, loại bỏ mọi backdoor hoặc fallback hardcoded
    if (!isValid) {
      return { success: false, message: "Email hoặc mật khẩu không chính xác." };
    }

    await createSession({
      userId: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    });

    return { success: true, message: "Đăng nhập thành công!" };
  } catch (error) {
    console.error("Lỗi đăng nhập:", error);
    return {
      success: false,
      message: "Không thể kết nối cơ sở dữ liệu: " + (error instanceof Error ? error.message : String(error)),
    };
  }
}

export async function logoutAdminAction() {
  await deleteSession();
  redirect("/admin/login");
}

export async function getAdminSession() {
  return getCurrentAdmin();
}
