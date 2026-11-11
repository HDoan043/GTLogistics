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
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-950 tracking-tight">
            Quản Lý Bài Viết & Tin Tức
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Đăng bài mới, chỉnh sửa nội dung và quản lý chuyên mục trên website.
          </p>
        </div>

        <Link href="/admin/posts/new">
          <Button variant="accent" size="md" className="font-bold shadow-md">
            <PlusCircle className="w-4 h-4 mr-2" />
            <span>Thêm Bài Viết Mới</span>
          </Button>
        </Link>
      </div>

      {/* Danh sách bài viết dạng bảng */}
      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
        {posts.length === 0 ? (
          <div className="p-12 text-center text-slate-400">
            Chưa có bài viết nào trong hệ thống. Hãy bấm &quot;Thêm Bài Viết Mới&quot; để tạo bài đầu tiên.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 uppercase font-bold tracking-wider">
                <tr>
                  <th className="py-4 px-6">Bài Viết</th>
                  <th className="py-4 px-6">Chuyên Mục</th>
                  <th className="py-4 px-6">Trạng Thái</th>
                  <th className="py-4 px-6">Lượt Xem</th>
                  <th className="py-4 px-6">Ngày Tạo</th>
                  <th className="py-4 px-6 text-right">Thao Tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {posts.map((post) => (
                  <tr key={post.id} className="hover:bg-slate-50 transition-colors">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="relative w-14 h-10 rounded-lg overflow-hidden shrink-0 bg-slate-100">
                          <Image
                            src={post.coverImage}
                            alt={post.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div className="max-w-xs sm:max-w-md">
                          <div className="font-bold text-slate-900 line-clamp-1 text-sm">
                            {post.title}
                          </div>
                          <div className="text-[11px] text-slate-400 line-clamp-1 mt-0.5">
                            {post.excerpt}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <Badge variant="brand">{post.category}</Badge>
                    </td>
                    <td className="py-4 px-6">
                      <Badge
                        variant={post.isPublished ? "success" : "neutral"}
                      >
                        {post.isPublished ? "Đã xuất bản" : "Bản nháp"}
                      </Badge>
                    </td>
                    <td className="py-4 px-6 font-semibold text-slate-700">
                      {post.viewCount}
                    </td>
                    <td className="py-4 px-6 text-slate-500">
                      {new Date(post.createdAt).toLocaleDateString("vi-VN")}
                    </td>
                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Link
                          href={`/news/${post.slug}`}
                          target="_blank"
                          title="Xem trước bài viết trên web"
                          className="p-1.5 text-slate-400 hover:text-brand-700 rounded-lg hover:bg-slate-100"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </Link>
                        <Link
                          href={`/admin/posts/${post.id}`}
                          title="Chỉnh sửa bài viết"
                          className="p-1.5 text-slate-400 hover:text-accent-600 rounded-lg hover:bg-slate-100"
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
                            className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-slate-100"
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
