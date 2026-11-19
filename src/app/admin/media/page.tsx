import React from "react";
import { redirect } from "next/navigation";
import fs from "fs";
import path from "path";
import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import { getStorageStats } from "@/lib/storage";
import { MediaStorageManager, MediaItem, PostItem } from "@/components/admin/media/MediaStorageManager";

export const metadata = {
  title: "Kho Lưu Trữ & Quản Lý Media - HTC Logistics Admin",
  description: "Quản lý hình ảnh tải lên, dọn dẹp dung lượng máy chủ và lưu trữ bài viết",
};

export default async function AdminMediaPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  // 1. Lấy thông số dung lượng máy chủ
  const storage = await getStorageStats();

  // 2. Thu thập danh sách ảnh từ máy chủ
  const images: MediaItem[] = [];

  // Quét public/uploads
  const uploadsDir = path.join(process.cwd(), "public", "uploads");
  if (fs.existsSync(uploadsDir)) {
    try {
      const files = fs.readdirSync(uploadsDir);
      for (const f of files) {
        if (f === ".gitkeep") continue;
        if (/\.(jpe?g|png|webp|gif|svg)$/i.test(f)) {
          try {
            const stat = fs.statSync(path.join(uploadsDir, f));
            images.push({
              url: `/uploads/${f}`,
              name: f,
              size: stat.size,
              createdAt: stat.mtime.toISOString(),
              folder: "uploads",
            });
          } catch {
            images.push({ url: `/uploads/${f}`, name: f, folder: "uploads" });
          }
        }
      }
    } catch (err) {
      console.error("Lỗi đọc thư mục uploads:", err);
    }
  }

  // Quét public/images/vietphuc
  const vietphucDir = path.join(process.cwd(), "public", "images", "vietphuc");
  if (fs.existsSync(vietphucDir)) {
    try {
      const files = fs.readdirSync(vietphucDir);
      for (const f of files) {
        if (/\.webp$/i.test(f)) {
          try {
            const stat = fs.statSync(path.join(vietphucDir, f));
            images.push({
              url: `/images/vietphuc/${f}`,
              name: f,
              size: stat.size,
              createdAt: stat.mtime.toISOString(),
              folder: "vietphuc",
            });
          } catch {
            images.push({
              url: `/images/vietphuc/${f}`,
              name: f,
              folder: "vietphuc",
            });
          }
        }
      }
    } catch (err) {
      console.error("Lỗi đọc thư mục vietphuc:", err);
    }
  }

  // Sắp xếp ảnh mới nhất lên đầu
  images.sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

  // 3. Lấy danh sách bài viết
  const rawPosts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      excerpt: true,
      category: true,
      coverImage: true,
      isPublished: true,
      viewCount: true,
      createdAt: true,
    },
  });

  const posts: PostItem[] = rawPosts.map((p) => ({
    ...p,
    createdAt: p.createdAt.toISOString(),
  }));

  return (
    <MediaStorageManager
      initialStorage={storage}
      initialImages={images}
      initialPosts={posts}
    />
  );
}
