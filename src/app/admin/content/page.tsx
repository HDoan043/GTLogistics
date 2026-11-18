import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { Eye } from "lucide-react";
import { getCurrentAdmin } from "@/lib/auth";
import { getAllPageContents } from "@/modules/content/actions";
import { getServices } from "@/modules/services/actions";
import { ContentManagerTabs } from "@/components/admin/content/ContentManagerTabs";

export default async function AdminContentPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  const [contents, services] = await Promise.all([
    getAllPageContents(),
    getServices(),
  ]);

  return (
    <div className="p-6 sm:p-10 max-w-6xl mx-auto space-y-6 bg-slate-50 text-slate-900">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-azure-50 text-azure-700 border border-azure-200">
              Content Studio
            </span>
            <span className="text-[11px] text-emerald-700 flex items-center gap-1 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
              Đồng Bộ Trực Tuyến
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            Quản Lý Nội Dung & Giao Diện
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Tùy biến toàn bộ câu chữ, khẩu hiệu, gạch đầu dòng và hình ảnh trên website mà không cần can thiệp vào code.
          </p>
        </div>

        <Link
          href="/admin/editor"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-slate-950 font-black text-xs transition-colors shadow-md shadow-gold-500/20 whitespace-nowrap self-start sm:self-center"
        >
          <Eye className="w-4 h-4" />
          <span>Mở Trình Sửa Trực Quan (Click-to-Edit)</span>
        </Link>
      </div>

      <ContentManagerTabs initialContents={contents} initialServices={services} />
    </div>
  );
}
