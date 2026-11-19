import fs from "fs";
import path from "path";

// Hạn mức dung lượng tối đa dành cho ảnh và file tải lên trên máy chủ: 5 GB (5.120 MB)
export const MAX_STORAGE_BYTES = 5 * 1024 * 1024 * 1024; // 5 GB
// Ngưỡng cảnh báo màu vàng: 80% (4 GB)
export const WARN_THRESHOLD_PERCENT = 80;
// Ngưỡng nghiêm trọng màu đỏ: 95% (4.75 GB)
export const CRITICAL_THRESHOLD_PERCENT = 95;

export interface StorageStats {
  usedBytes: number;
  maxBytes: number;
  usedFormatted: string;
  maxFormatted: string;
  percent: number;
  fileCount: number;
  isNearLimit: boolean;
  isFull: boolean;
}

export function formatBytes(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return "0 Bytes";
  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
}

/**
 * Tính toán dung lượng thực tế đang lưu trữ trong thư mục public/uploads
 */
export async function getStorageStats(): Promise<StorageStats> {
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  let usedBytes = 0;
  let fileCount = 0;

  if (fs.existsSync(uploadsDir)) {
    try {
      const files = await fs.promises.readdir(uploadsDir);
      for (const f of files) {
        if (f === ".gitkeep") continue;
        const filePath = path.join(uploadsDir, f);
        try {
          const stat = await fs.promises.stat(filePath);
          if (stat.isFile()) {
            usedBytes += stat.size;
            fileCount++;
          }
        } catch {
          // Bỏ qua nếu file bị lock hoặc đang thao tác
        }
      }
    } catch (err) {
      console.error("Lỗi đọc thư mục uploads:", err);
    }
  }

  const percent = Math.min(100, Math.round((usedBytes / MAX_STORAGE_BYTES) * 100));

  return {
    usedBytes,
    maxBytes: MAX_STORAGE_BYTES,
    usedFormatted: formatBytes(usedBytes),
    maxFormatted: formatBytes(MAX_STORAGE_BYTES),
    percent,
    fileCount,
    isNearLimit: percent >= WARN_THRESHOLD_PERCENT,
    isFull: percent >= CRITICAL_THRESHOLD_PERCENT,
  };
}

/**
 * Xóa an toàn một file ảnh trong public/uploads, chống tấn công Path Traversal (CWE-22)
 */
export async function deleteUploadedFile(filenameOrUrl: string): Promise<{ success: boolean; message: string }> {
  try {
    // Trích xuất tên file thuần túy
    let safeName = filenameOrUrl;
    if (safeName.startsWith("/uploads/")) {
      safeName = safeName.replace("/uploads/", "");
    }
    safeName = path.basename(safeName); // Triệt tiêu mọi ký tự ../ hoặc ./

    if (!safeName || safeName === ".gitkeep") {
      return { success: false, message: "Tên file không hợp lệ hoặc không được phép xóa." };
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    const targetPath = path.join(uploadsDir, safeName);

    // Xác minh đường dẫn tuyệt đối bắt buộc nằm trong thư mục uploads
    const resolvedPath = path.resolve(targetPath);
    if (!resolvedPath.startsWith(path.resolve(uploadsDir))) {
      return { success: false, message: "Truy cập đường dẫn bị từ chối (Security Violation)." };
    }

    if (!fs.existsSync(resolvedPath)) {
      return { success: false, message: "File không tồn tại trên hệ thống máy chủ." };
    }

    await fs.promises.unlink(resolvedPath);
    return { success: true, message: `Đã xóa file ${safeName} thành công và giải phóng dung lượng.` };
  } catch (error) {
    console.error("Lỗi xóa file ảnh:", error);
    return {
      success: false,
      message: "Không thể xóa file: " + (error instanceof Error ? error.message : String(error)),
    };
  }
}
