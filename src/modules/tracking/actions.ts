"use server";

import { prisma } from "@/lib/db";

export interface TimelineEvent {
  time: string;
  location: string;
  desc: string;
}

export async function trackOrder(trackingCode: string) {
  if (!trackingCode || trackingCode.trim().length === 0) {
    return { success: false, message: "Vui lòng nhập mã vận đơn" };
  }

  const cleanCode = trackingCode.trim().toUpperCase();

  try {
    const order = await prisma.trackingOrder.findUnique({
      where: { trackingCode: cleanCode },
    });

    if (!order) {
      return {
        success: false,
        message: `Không tìm thấy thông tin vận đơn với mã [${cleanCode}]. Quý khách vui lòng kiểm tra lại hoặc liên hệ hotline để được hỗ trợ trực tiếp.`,
      };
    }

    let timeline: TimelineEvent[] = [];
    try {
      timeline = JSON.parse(order.timelineJson);
    } catch {
      timeline = [];
    }

    return {
      success: true,
      order: {
        ...order,
        timeline,
      },
    };
  } catch (error) {
    console.error("Lỗi tra cứu vận đơn:", error);
    return {
      success: false,
      message: "Có lỗi xảy ra khi tra cứu dữ liệu. Vui lòng thử lại sau.",
    };
  }
}
