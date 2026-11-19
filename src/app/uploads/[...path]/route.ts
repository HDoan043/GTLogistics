import { NextRequest, NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: pathSegments } = await params;
  if (!pathSegments || pathSegments.length === 0) {
    return new NextResponse("File Not Found", { status: 404 });
  }

  // Chuẩn hóa tên file, triệt tiêu mọi ký tự ../ hoặc ./ chống Path Traversal (CWE-22)
  const safeFilename = path.basename(pathSegments.join("/"));
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  const filePath = path.join(uploadsDir, safeFilename);

  // Bảo vệ chống Path Traversal: Đường dẫn giải quyết bắt buộc phải nằm trong public/uploads
  if (!path.resolve(filePath).startsWith(path.resolve(uploadsDir))) {
    return new NextResponse("Access Denied", { status: 403 });
  }

  if (!fs.existsSync(filePath)) {
    return new NextResponse("File Not Found", { status: 404 });
  }

  try {
    const stat = await fs.promises.stat(filePath);
    if (!stat.isFile()) {
      return new NextResponse("File Not Found", { status: 404 });
    }

    const fileBuffer = await fs.promises.readFile(filePath);

    const ext = path.extname(safeFilename).toLowerCase();
    const mimeMap: Record<string, string> = {
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".webp": "image/webp",
      ".gif": "image/gif",
      ".svg": "image/svg+xml",
      ".pdf": "application/pdf",
    };

    const contentType = mimeMap[ext] || "application/octet-stream";

    const headers: Record<string, string> = {
      "Content-Type": contentType,
      "Content-Length": stat.size.toString(),
      "Cache-Control": "public, max-age=31536000, immutable",
      "X-Content-Type-Options": "nosniff",
    };

    // Nếu là file SVG, khóa mọi khả năng thực thi JavaScript bằng Content-Security-Policy (XSS Defense)
    if (ext === ".svg") {
      headers["Content-Security-Policy"] = "default-src 'none'; style-src 'unsafe-inline'";
    }

    return new NextResponse(fileBuffer, {
      status: 200,
      headers,
    });
  } catch (error) {
    console.error("Lỗi đọc file uploads:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}

export async function HEAD(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> }
) {
  const { path: pathSegments } = await params;
  if (!pathSegments || pathSegments.length === 0) {
    return new NextResponse(null, { status: 404 });
  }

  const safeFilename = path.basename(pathSegments.join("/"));
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  const filePath = path.join(uploadsDir, safeFilename);

  if (!path.resolve(filePath).startsWith(path.resolve(uploadsDir))) {
    return new NextResponse(null, { status: 403 });
  }

  if (!fs.existsSync(filePath)) {
    return new NextResponse(null, { status: 404 });
  }

  try {
    const stat = await fs.promises.stat(filePath);
    if (!stat.isFile()) {
      return new NextResponse(null, { status: 404 });
    }

    const ext = path.extname(safeFilename).toLowerCase();
    const mimeMap: Record<string, string> = {
      ".png": "image/png",
      ".jpg": "image/jpeg",
      ".jpeg": "image/jpeg",
      ".webp": "image/webp",
      ".gif": "image/gif",
      ".svg": "image/svg+xml",
      ".pdf": "application/pdf",
    };

    const contentType = mimeMap[ext] || "application/octet-stream";

    return new NextResponse(null, {
      status: 200,
      headers: {
        "Content-Type": contentType,
        "Content-Length": stat.size.toString(),
        "Cache-Control": "public, max-age=31536000, immutable",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    return new NextResponse(null, { status: 500 });
  }
}
