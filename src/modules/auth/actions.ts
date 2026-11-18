"use server";

import { prisma } from "@/lib/db";
import { hashPassword, verifyPassword, createSession, deleteSession, getCurrentAdmin } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function loginAdmin(formData: FormData, explicitIp?: string) {
  let clientIp = explicitIp;
  if (!clientIp) {
    try {
      const headerList = await headers();
      clientIp =
        headerList.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        headerList.get("x-real-ip") ||
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

  // 1. Chống Brute Force đăng nhập: tối đa 20 lần thử sai / 15 phút theo IP + email
  const limiter = checkRateLimit(`login_${clientIp}_${email}`, 20, 15 * 60 * 1000);
  if (!limiter.success) {
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

    // 2. Tự động khôi phục tài khoản Admin nếu database chưa có
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

    // 3. Cơ chế Tự Phục Hồi (Auto-Heal):
    // Nếu người dùng nhập đúng mật khẩu quản trị trong file môi trường (hoặc Admin@GT2026!),
    // nhưng mật khẩu hash lưu trong database bị cũ hoặc không khớp, hệ thống tự động cập nhật
    // hash mới vào DB và cho phép đăng nhập thành công ngay lập tức.
    const trimmedInput = password.trim();
    if (
      !isValid &&
      isMasterAdminEmail &&
      (trimmedInput === rawPassword || trimmedInput === "Admin@GT2026!")
    ) {
      try {
        const updatedHash = await hashPassword(trimmedInput);
        user = await prisma.adminUser.update({
          where: { id: user.id },
          data: { passwordHash: updatedHash },
        });
        isValid = true;
      } catch (err) {
        console.error("Lỗi tự động cập nhật mật khẩu:", err);
      }
    }

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
