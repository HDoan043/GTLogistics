"use server";

import { prisma } from "@/lib/db";
import { generateSlug, sanitizeHtml } from "@/lib/security";
import { getCurrentAdmin } from "@/lib/auth";
import { PostSchema } from "./schema";
import { revalidatePath } from "next/cache";

export async function getPosts(params?: {
  category?: string;
  limit?: number;
  publishedOnly?: boolean;
}) {
  try {
    const where: Record<string, unknown> = {};
    if (params?.publishedOnly ?? true) {
      where.isPublished = true;
    }
    if (params?.category && params.category !== "Tất cả") {
      where.category = params.category;
    }

    return await prisma.post.findMany({
      where,
      orderBy: { publishedAt: "desc" },
      take: params?.limit || 20,
      include: {
        author: {
          select: { fullName: true, email: true },
        },
      },
    });
  } catch (error) {
    console.error("Lỗi khi tải danh sách bài viết:", error);
    return [];
  }
}

export async function getPostBySlug(slug: string) {
  try {
    const post = await prisma.post.findUnique({
      where: { slug },
      include: {
        author: {
          select: { fullName: true },
        },
      },
    });

    if (post) {
      // Tăng lượt xem
      await prisma.post.update({
        where: { id: post.id },
        data: { viewCount: { increment: 1 } },
      });
    }

    return post;
  } catch (error) {
    console.error("Lỗi khi tải chi tiết bài viết:", error);
    return null;
  }
}

export async function createPost(rawInput: unknown) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { success: false, message: "Bạn cần đăng nhập quản trị viên để đăng bài." };
  }

  const parsed = PostSchema.safeParse(rawInput);
  if (!parsed.success) {
    return { success: false, message: parsed.error.errors[0]?.message || "Dữ liệu không hợp lệ" };
  }

  const data = parsed.data;
  let slug = data.slug ? generateSlug(data.slug) : generateSlug(data.title);

  // Đảm bảo slug không trùng lặp
  const existing = await prisma.post.findUnique({ where: { slug } });
  if (existing) {
    slug = `${slug}-${Date.now().toString().slice(-4)}`;
  }

  try {
    const newPost = await prisma.post.create({
      data: {
        title: data.title,
        slug,
        excerpt: data.excerpt,
        content: sanitizeHtml(data.content),
        coverImage: data.coverImage,
        category: data.category,
        isPublished: data.isPublished,
        authorId: admin.userId,
      },
    });

    revalidatePath("/news");
    revalidatePath("/admin/posts");
    return { success: true, message: "Đăng bài viết thành công!", post: newPost };
  } catch (error) {
    console.error("Lỗi tạo bài viết:", error);
    return { success: false, message: "Không thể lưu bài viết. Vui lòng thử lại." };
  }
}

export async function updatePost(id: string, rawInput: unknown) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { success: false, message: "Không có quyền thực hiện hành động này." };
  }

  const parsed = PostSchema.safeParse(rawInput);
  if (!parsed.success) {
    return { success: false, message: parsed.error.errors[0]?.message || "Dữ liệu không hợp lệ" };
  }

  const data = parsed.data;

  try {
    await prisma.post.update({
      where: { id },
      data: {
        title: data.title,
        excerpt: data.excerpt,
        content: sanitizeHtml(data.content),
        coverImage: data.coverImage,
        category: data.category,
        isPublished: data.isPublished,
      },
    });

    revalidatePath("/news");
    revalidatePath("/admin/posts");
    return { success: true, message: "Cập nhật bài viết thành công!" };
  } catch (error) {
    console.error("Lỗi cập nhật bài viết:", error);
    return { success: false, message: "Không thể cập nhật bài viết." };
  }
}

export async function deletePost(id: string) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    return { success: false, message: "Không có quyền xóa bài viết." };
  }

  try {
    await prisma.post.delete({ where: { id } });
    revalidatePath("/news");
    revalidatePath("/admin/posts");
    return { success: true, message: "Đã xóa bài viết thành công!" };
  } catch (error) {
    console.error("Lỗi xóa bài viết:", error);
    return { success: false, message: "Không thể xóa bài viết." };
  }
}
