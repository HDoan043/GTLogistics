import React from "react";
import Link from "next/link";
import Image from "next/image";
import { redirect } from "next/navigation";
import { PlusCircle, Edit, Trash2, ExternalLink, Calendar, Eye } from "lucide-react";
import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { deletePost } from "@/modules/posts/actions";

export default async function AdminPostsPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: { select: { fullName: true } },
    },
  });

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-6 bg-slate-950 text-slate-100">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-azure-950 text-azure-400 border border-azure-800/60">
              Editorial Desk
            </span>
            <span className="text-[11px] text-slate-400">
              <strong className="font-mono tabular-nums text-slate-200">{posts.length}</strong> bài đăng
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            Quản Lý Bài Viết & Tin Tức
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Đăng bài mới, chỉnh sửa nội dung đa ngôn ngữ và quản lý chuyên mục trên website.
          </p>
        </div>

        <Link href="/admin/posts/new">
          <Button variant="accent" size="md" className="font-bold tap-press shadow-md shadow-gold-500/10">
            <PlusCircle className="w-4 h-4 mr-2" />
            <span>Thêm Bài Viết Mới</span>
          </Button>
        </Link>
      </div>

      {/* Danh sách bài viết dạng bảng Night Ops */}
      <div className="bg-slate-900/90 rounded-2xl border border-slate-800 shadow-sm overflow-hidden">
        {posts.length === 0 ? (
          <div className="p-12 text-center text-slate-400 text-xs">
            Chưa có bài viết nào trong hệ thống. Hãy bấm &quot;Thêm Bài Viết Mới&quot; để tạo bài đầu tiên.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 text-xs font-semibold">
                <tr>
                  <th className="py-4 px-6">Bài viết</th>
                  <th className="py-4 px-6">Chuyên mục</th>
                  <th className="py-4 px-6">Trạng thái</th>
                  <th className="py-4 px-6">Lượt xem</th>
                  <th className="py-4 px-6">Ngày tạo</th>
                  <th className="py-4 px-6 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-800/40 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="relative w-14 h-10 rounded-lg overflow-hidden shrink-0 bg-slate-950 border border-slate-800">
                          <Image
                            src={post.coverImage}
                            alt={post.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="max-w-xs sm:max-w-md">
                          <div className="font-bold text-white line-clamp-1 text-sm">
                            {post.title}
                          </div>
                          <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                            {post.excerpt}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 text-azure-400 font-medium">
                      {post.category}
                    </td>
                    <td className="py-4 px-6">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          post.isPublished
                            ? "bg-emerald-950 text-emerald-300 border border-emerald-800/60"
                            : "bg-slate-800 text-slate-400 border border-slate-700"
                        }`}
                      >
                        {post.isPublished ? "Đã xuất bản" : "Bản nháp"}
                      </span>
                    </td>
                    <td className="py-4 px-6 font-mono font-bold text-slate-200 tabular-nums">
                      {post.viewCount}
                    </td>
                    <td className="py-4 px-6 text-slate-400 font-mono tabular-nums">
                      {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/news/${post.slug}`}
                          target="_blank"
                          title="Xem trước bài viết trên web"
                          className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/posts/${post.id}`}
                          title="Chỉnh sửa bài viết"
                          className="p-1.5 text-slate-400 hover:text-gold-400 rounded-lg hover:bg-slate-800 transition-colors"
                        >
                          <Edit className="w-4 h-4" />
                        </Link>
                        <form
                          action={async () => {
                            "use server";
                            await deletePost(post.id);
                          }}
                        >
                          <button
                            type="submit"
                            title="Xóa bài viết"
                            className="p-1.5 text-rose-400 hover:text-rose-300 rounded-lg hover:bg-rose-950/60 transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </form>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
