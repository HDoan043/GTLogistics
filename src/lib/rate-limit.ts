import { prisma } from "@/lib/db";

interface RateLimitStore {
  count: number;
  resetTime: number;
}

const memoryStore = new Map<string, RateLimitStore>();

// Dọn dẹp các IP đã hết hạn định kỳ mỗi 5 phút để tránh rò rỉ bộ nhớ
if (typeof setInterval !== "undefined") {
  setInterval(() => {
    const now = Date.now();
    for (const [key, value] of memoryStore.entries()) {
      if (now > value.resetTime) {
        memoryStore.delete(key);
      }
    }
  }, 5 * 60 * 1000);
}

/**
 * Kiểm tra giới hạn số lượt request của 1 IP / identifier trong bộ nhớ cục bộ (In-Memory).
 * Thích hợp cho các trường hợp kiểm tra siêu tốc với chi phí 0ms.
 */
export function checkRateLimit(
  identifier: string,
  limit: number = 10,
  windowMs: number = 60 * 1000
): { success: boolean; remaining: number; reset: number } {
  const now = Date.now();
  const record = memoryStore.get(identifier);

  if (!record || now > record.resetTime) {
    memoryStore.set(identifier, {
      count: 1,
      resetTime: now + windowMs,
    });
    return { success: true, remaining: limit - 1, reset: now + windowMs };
  }

  if (record.count >= limit) {
    return { success: false, remaining: 0, reset: record.resetTime };
  }

  record.count += 1;
  return { success: true, remaining: limit - record.count, reset: record.resetTime };
}

/**
 * Kiểm soát tần suất truy cập hợp nhất cho toàn bộ hệ thống cluster (PM2 Cluster Mode).
 * Đảm bảo các tiến trình worker không bị phân mảnh bộ nhớ và kẻ tấn công không thể nhân số lượt thử
 * theo số lượng CPU Core.
 */
export async function checkClusterRateLimit(
  identifier: string,
  limit: number = 5,
  windowMs: number = 2 * 60 * 1000
): Promise<{ success: boolean; remaining: number; reset: number }> {
  // 1. Tầng chắn 1: Kiểm tra nhanh trong bộ nhớ worker cục bộ
  const localCheck = checkRateLimit(identifier, limit, windowMs);
  if (!localCheck.success) {
    return localCheck;
  }

  // 2. Tầng chắn 2: Kiểm tra hợp nhất qua cơ sở dữ liệu để chia sẻ trạng thái giữa các worker
  try {
    const now = new Date();
    const expiresAt = new Date(now.getTime() + windowMs);

    const record = await prisma.rateLimitRecord.findUnique({
      where: { key: identifier },
    });

    if (!record || record.expiresAt < now) {
      await prisma.rateLimitRecord.upsert({
        where: { key: identifier },
        update: { count: 1, expiresAt },
        create: { key: identifier, count: 1, expiresAt },
      });
      return { success: true, remaining: limit - 1, reset: expiresAt.getTime() };
    }

    if (record.count >= limit) {
      return { success: false, remaining: 0, reset: record.expiresAt.getTime() };
    }

    const updated = await prisma.rateLimitRecord.update({
      where: { key: identifier },
      data: { count: { increment: 1 } },
    });

    return {
      success: updated.count <= limit,
      remaining: Math.max(0, limit - updated.count),
      reset: record.expiresAt.getTime(),
    };
  } catch (err) {
    console.error("Lỗi đồng bộ DB Rate Limit (sử dụng fallback in-memory):", err);
    return localCheck;
  }
}
