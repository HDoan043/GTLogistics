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
 * Kiểm tra giới hạn số lượt request của 1 IP / identifier
 * @param identifier Chuỗi nhận dạng (thường là IP người dùng)
 * @param limit Số lượng request tối đa trong cửa sổ thời gian
 * @param windowMs Thời gian của cửa sổ tính bằng milliseconds
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
