import React from "react";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import { PostEditor } from "@/components/admin/PostEditor";

export default async function NewPostPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-brand-950 tracking-tight">
          Tạo Bài Viết Tin Tức Mới
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Đăng bài viết mới lên website và tối ưu tiêu chuẩn SEO cho Google.
        </p>
      </div>

      <PostEditor />
    </div>
  );
}
