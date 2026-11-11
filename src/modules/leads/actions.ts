"use server";

import { prisma } from "@/lib/db";
import { LeadSchema } from "./schema";
import { checkRateLimit } from "@/lib/rate-limit";
import { getCurrentAdmin } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function submitLead(rawInput: unknown, clientIp: string = "anon") {
  // 1. Kiểm tra Rate Limit chống spam (tối đa 5 lần gửi / 2 phút đối với 1 IP)
  const limiter = checkRateLimit(`lead_${clientIp}`, 5, 2 * 60 * 1000);
  if (!limiter.success) {
    return {
      success: false,
      message: "Bạn đã gửi quá nhiều yêu cầu liên tiếp. Vui lòng chờ ít phút hoặc gọi hotline trực tiếp.",
    };
  }

  // 2. Validate dữ liệu đầu vào bằng Zod
  const parsed = LeadSchema.safeParse(rawInput);
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.errors[0]?.message || "Thông tin gửi lên không hợp lệ.",
    };
  }

  const data = parsed.data;

  try {
    const lead = await prisma.lead.create({
      data: {
        fullName: data.fullName,
        phone: data.phone,
        email: data.email || null,
        company: data.company || null,
        serviceType: data.serviceType,
        routeOrigin: data.routeOrigin || null,
        routeDestination: data.routeDestination || null,
        cargoDetails: data.cargoDetails || null,
        message: data.message || null,
        status: "NEW",
      },
    });

    revalidatePath("/admin/leads");
    return {
      success: true,
      message: "Yêu cầu của bạn đã được gửi thành công! Đội ngũ Logistics GT sẽ liên hệ lại trong vòng 15 phút.",
      leadId: lead.id,
    };
  } catch (error) {
    console.error("Lỗi khi lưu Lead:", error);
    return {
      success: false,
      message: "Không thể gửi yêu cầu lúc này. Vui lòng thử lại hoặc kết nối qua Zalo.",
    };
  }
}

export async function getLeads(params?: { status?: string; limit?: number }) {
  const admin = await getCurrentAdmin();
  if (!admin) return [];

  try {
    const where: Record<string, unknown> = {};
    if (params?.status && params.status !== "ALL") {
      where.status = params.status;
    }

    return await prisma.lead.findMany({
      where,
      orderBy: { createdAt: "desc" },
      take: params?.limit || 50,
    });
  } catch (error) {
    console.error("Lỗi tải danh sách Leads:", error);
    return [];
  }
}

export async function updateLeadStatus(id: string, status: string, notes?: string) {
  const admin = await getCurrentAdmin();
  if (!admin) return { success: false, message: "Không có quyền quản trị." };

  try {
    await prisma.lead.update({
      where: { id },
      data: {
        status,
        ...(notes !== undefined ? { notes } : {}),
      },
    });

    revalidatePath("/admin/leads");
    return { success: true, message: "Cập nhật trạng thái khách hàng thành công!" };
  } catch (error) {
    console.error("Lỗi cập nhật trạng thái Lead:", error);
    return { success: false, message: "Không thể cập nhật trạng thái." };
  }
}
