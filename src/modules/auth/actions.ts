"use server";

import { prisma } from "@/lib/db";
import { hashPassword, verifyPassword, createSession, deleteSession, getCurrentAdmin } from "@/lib/auth";
import { checkRateLimit } from "@/lib/rate-limit";
import { redirect } from "next/navigation";

export async function loginAdmin(formData: FormData, clientIp: string = "anon") {
  // 1. Chống Brute Force đăng nhập: tối đa 10 lần thử sai / 15 phút
  const limiter = checkRateLimit(`login_${clientIp}`, 10, 15 * 60 * 1000);
  if (!limiter.success) {
    return {
      success: false,
      message: "Bạn đã thử đăng nhập sai quá nhiều lần. Vui lòng quay lại sau 15 phút.",
    };
  }

  const email = (formData.get("email") as string)?.trim().toLowerCase();
  const password = formData.get("password") as string;

  if (!email || !password) {
    return { success: false, message: "Vui lòng nhập đầy đủ Email và Mật khẩu." };
  }

  try {
    let user = await prisma.adminUser.findUnique({
      where: { email },
    });

    // Tự động khôi phục tài khoản Admin nếu database mới khởi tạo lại
    const defaultEmail = (process.env.ADMIN_DEFAULT_EMAIL || "admin@htclogistics.vn").toLowerCase();
    if (!user && (email === defaultEmail || email === "admin@htclogistics.vn")) {
      try {
        const rawPassword = process.env.ADMIN_DEFAULT_PASSWORD || "Admin@HTC2026!";
        const passwordHash = await hashPassword(rawPassword);
        user = await prisma.adminUser.create({
          data: {
            email: defaultEmail,
            passwordHash,
            fullName: process.env.ADMIN_DEFAULT_NAME || "Quản Trị Viên HTC",
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

    const isValid = await verifyPassword(password, user.passwordHash);
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
