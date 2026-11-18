import { NextRequest, NextResponse } from "next/server";
import { getCurrentAdmin } from "@/lib/auth";
import fs from "fs";
import path from "path";

// GET: Lấy danh sách ảnh trong public/uploads và thư viện ảnh có sẵn
export async function GET() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const results: { url: string; name: string; size?: number; createdAt?: string }[] = [];

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
          });
        } catch {
          results.push({ url: `/uploads/${f}`, name: f });
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
        results.push({
          url: `/images/vietphuc/${f}`,
          name: f,
        });
      }
    }
  }

  return NextResponse.json({ success: true, images: results });
}

// POST: Tải ảnh mới lên public/uploads
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

    // Kiểm tra định dạng ảnh hợp lệ
    const validExtensions = [".png", ".jpg", ".jpeg", ".webp", ".svg", ".gif"];
    const ext = path.extname(file.name).toLowerCase();
    if (!validExtensions.includes(ext)) {
      return NextResponse.json(
        { error: "Định dạng file không hỗ trợ. Vui lòng chọn ảnh PNG, JPG, JPEG hoặc WEBP." },
        { status: 400 }
      );
    }

    // Giới hạn dung lượng 15MB
    if (file.size > 15 * 1024 * 1024) {
      return NextResponse.json(
        { error: "Dung lượng ảnh vượt quá giới hạn 15MB." },
        { status: 400 }
      );
    }

    const uploadsDir = path.join(process.cwd(), "public", "uploads");
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    // Chuẩn hóa tên file: loại bỏ ký tự đặc biệt, thêm timestamp
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

    return NextResponse.json({
      success: true,
      url: publicUrl,
      filename: fileName,
      message: "Tải ảnh lên thành công!",
    });
  } catch (error) {
    console.error("Lỗi upload ảnh:", error);
    return NextResponse.json(
      { error: "Lỗi hệ thống khi lưu ảnh: " + (error instanceof Error ? error.message : String(error)) },
      { status: 500 }
    );
  }
}
