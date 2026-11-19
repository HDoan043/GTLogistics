import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import { getStorageStats, deleteUploadedFile } from "@/lib/storage";
import fs from "fs";
import path from "path";

// GET: Lấy danh sách ảnh trong public/uploads và thư viện ảnh có sẵn kèm thông tin dung lượng
export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results: { url: string; name: string; size?: number; createdAt?: string; folder: string }[] = [];

  // 1. Quét thư mục public/uploads
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  if (fs.existsSync(uploadsDir)) {
    const files = fs.readdirSync(uploadsDir);
    for (const f of files) {
      if (f === ".gitkeep") continue;
      if (/\.(jpe?g|png|webp|gif|svg)$/i.test(f)) {
        try {
          const stat = fs.statSync(path.join(uploadsDir, f));
          results.push({
            url: `/uploads/${f}`,
            name: f,
            size: stat.size,
            createdAt: stat.mtime.toISOString(),
            folder: "uploads",
          });
        } catch {
          results.push({ url: `/uploads/${f}`, name: f, folder: "uploads" });
        }
      }
    }
  }

  // 2. Quét thư mục public/images/vietphuc
  const vietphucDir = path.join(process.cwd(), "public", "images", "vietphuc");
  if (fs.existsSync(vietphucDir)) {
    const files = fs.readdirSync(vietphucDir);
    for (const f of files) {
      if (/\.webp$/i.test(f)) {
        try {
          const stat = fs.statSync(path.join(vietphucDir, f));
          results.push({
            url: `/images/vietphuc/${f}`,
            name: f,
            size: stat.size,
            createdAt: stat.mtime.toISOString(),
            folder: "vietphuc",
          });
        } catch {
          results.push({
            url: `/images/vietphuc/${f}`,
            name: f,
            folder: "vietphuc",
          });
        }
      }
    }
  }

  const storage = await getStorageStats();

  return NextResponse.json({
    success: true,
    images: results,
    storage,
  });
}

// POST: Tải ảnh mới lên public/uploads (Có kiểm soát chặt chẽ giới hạn dung lượng máy chủ)
export async function POST(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Không tìm thấy file tải lên." }, { status: 400 });
    }

    // 1. Kiểm tra hạn mức lưu trữ máy chủ trước khi cho phép ghi file
    const currentStorage = await getStorageStats();
    if (currentStorage.usedBytes + file.size > currentStorage.maxBytes) {
      return NextResponse.json(
        {
          error: `Dung lượng máy chủ sắp vượt trần cho phép (${currentStorage.usedFormatted} / ${currentStorage.maxFormatted}). Vui lòng xóa bớt ảnh cũ trong Kho Lưu Trữ để giải phóng bộ nhớ trước khi tải tiếp.`,
          storage: currentStorage,
        },
        { status: 400 }
      );
    }

    // 2. Kiểm tra định dạng ảnh hợp lệ
    const validExtensions = [".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif"];
    const ext = path.extname(file.name).toLowerCase();
    if (!validExtensions.includes(ext)) {
      return NextResponse.json(
        { error: "Định dạng file không hỗ trợ. Vui lòng chọn ảnh PNG, JPG, JPEG, WEBP hoặc SVG." },
        { status: 400 }
      );
    }

    // 2.1 Kiểm tra an toàn chống Stored XSS đối với file SVG
    if (ext === ".svg") {
      const svgText = await file.text();
      const dangerousPatterns = [
        /<script\b/i,
        /onload\s*=/i,
        /onerror\s*=/i,
        /onclick\s*=/i,
        /onmouseover\s*=/i,
        /onfocus\s*=/i,
        /javascript\s*:/i,
        /<foreignObject\b/i,
        /<iframe\b/i,
        /<object\b/i,
        /<embed\b/i,
      ];
      const isDangerous = dangerousPatterns.some((pattern) => pattern.test(svgText));
      if (isDangerous) {
        return NextResponse.json(
          {
            error:
              "Tệp SVG chứa mã script hoặc thuộc tính không an toàn (XSS Protection). Vui lòng sử dụng tệp SVG đồ họa thuần túy hoặc chuyển đổi sang PNG/WebP.",
          },
          { status: 400 }
        );
      }
    }

    // Giới hạn từng file ảnh tối đa 15MB
    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Dung lượng ảnh vượt quá giới hạn cho phép 15MB/file." },
        { status: 400 }
      );
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Chuẩn hóa tên file an toàn: loại bỏ ký tự lạ, thêm timestamp
    const baseName = path
      .basename(file.name, ext)
      .toLowerCase()
      .replace(/[^a-z0-9]/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 40);
    const fileName = `${Date.now()}-${baseName || "image"}${ext}`;
    const filePath = path.join(uploadsDir, fileName);

    const buffer = Buffer.from(await file.arrayBuffer());
    await fs.promises.writeFile(filePath, buffer);

    const publicUrl = `/uploads/${fileName}`;
    const updatedStorage = await getStorageStats();

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: fileName,
      message: "Tải ảnh lên thành công!",
      storage: updatedStorage,
    });
  } catch (error) {
    console.error("Lỗi upload ảnh:", error);
    return NextResponse.json(
      { error: "Lỗi hệ thống khi lưu ảnh: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}

// DELETE: Xóa ảnh khỏi máy chủ để giải phóng dung lượng đĩa
export async function DELETE(req: NextRequest) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json().catch(() => ({}));
    const target = body.url || body.filename;

    if (!target) {
      return NextResponse.json({ error: "Thiếu thông tin file cần xóa." }, { status: 400 });
    }

    // Không cho phép xóa ảnh hệ thống /images/vietphuc
    if (String(target).includes("/images/vietphuc/")) {
      return NextResponse.json(
        { error: "Không thể xóa ảnh hệ thống mặc định của dự án." },
        { status: 400 }
      );
    }

    const result = await deleteUploadedFile(target);
    if (!result.success) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    const updatedStorage = await getStorageStats();
    return NextResponse.json({
      success: true,
      message: result.message,
      storage: updatedStorage,
    });
  } catch (error) {
    console.error("Lỗi xóa file:", error);
    return NextResponse.json(
      { error: "Lỗi hệ thống khi xóa file: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}
