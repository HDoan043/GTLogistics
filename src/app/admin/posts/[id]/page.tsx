import React from "react";
import { notFound, redirect } from "next/navigation";
import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import { PostEditor } from "@/components/admin/PostEditor";

export default async function EditPostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  const { id } = await params;
  const post = await prisma.post.findUnique({
    where: { id },
  });

  if (!post) {
    notFound();
  }

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-brand-950 tracking-tight">
          Chỉnh Sửa Bài Viết
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Cập nhật nội dung, tiêu đề và hình ảnh của bài viết.
        </p>
      </div>

      <PostEditor
        initialData={{
          id: post.id,
          title: post.title,
          category: post.category,
          excerpt: post.excerpt,
          content: post.content,
          coverImage: post.coverImage,
          isPublished: post.isPublished,
        }}
        isEdit={true}
      />
    </div>
  );
}
