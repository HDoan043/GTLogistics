import React from "react";
import Link from "next/link";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import {
  LayoutDashboard,
  FileText,
  Users,
  Settings,
  LogOut,
  ExternalLink,
  ShieldCheck,
  LayoutTemplate,
  Eye,
} from "lucide-react";
import { getCurrentAdmin, deleteSession } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getCurrentAdmin();
  const headerList = await headers();
  const pathname = headerList.get("x-pathname") || "";
  const isVisualEditor = pathname.startsWith("/admin/editor");

  // Nếu đang ở Trình Sửa Trực Quan, cho phép hiển thị tràn viền toàn màn hình y như web thật
  if (isVisualEditor) {
    return <div className="min-h-screen bg-slate-900 text-slate-100">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col md:flex-row">
      {/* Sidebar (Chỉ hiện khi đã đăng nhập) - Wayfind Night Ops */}
      {admin && (
        <aside className="w-full md:w-64 bg-slate-900/90 text-slate-300 flex flex-col justify-between shrink-0 shadow-2xl border-r border-slate-800">
          <div>
            {/* Logo Admin GT - Operations Console */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-azure-600 text-white flex items-center justify-center font-black text-lg shadow-md font-mono">
                  GT
                </div>
                <div>
                  <span className="font-black text-white text-sm block tracking-tight">
                    GT LOGISTICS
                  </span>
                  <span className="text-[11px] text-azure-400 font-semibold block">
                    NIGHT OPS CONSOLE
                  </span>
                </div>
              </div>
              <span className="relative flex h-2 w-2">
                <span className="animate-transit-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
            </div>

            {/* Menu điều hướng */}
            <nav className="p-4 space-y-1.5 text-xs font-semibold">
              <Link
                href="/admin/editor"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gradient-to-r from-azure-900/60 to-gold-950/40 border border-gold-500/40 hover:border-gold-500 text-gold-300 hover:text-gold-200 transition-colors shadow-sm"
              >
                <Eye className="w-4 h-4 text-gold-400 shrink-0" />
                <span className="font-bold">Sửa Trực Quan (Click-to-Edit)</span>
                <span className="text-[9px] bg-gold-500 text-slate-950 font-black px-1.5 py-0.5 rounded ml-auto">
                  LIVE
                </span>
              </Link>

              <Link
                href="/admin/dashboard"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 hover:text-white transition-colors text-slate-300 border border-transparent hover:border-slate-700/80"
              >
                <LayoutDashboard className="w-4 h-4 text-azure-400" />
                <span>Bảng Tổng Quan</span>
              </Link>

              <Link
                href="/admin/posts"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 hover:text-white transition-colors text-slate-300 border border-transparent hover:border-slate-700/80"
              >
                <FileText className="w-4 h-4 text-azure-400" />
                <span>Quản Lý Bài Viết</span>
              </Link>

              <Link
                href="/admin/leads"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 hover:text-white transition-colors text-slate-300 border border-transparent hover:border-slate-700/80"
              >
                <Users className="w-4 h-4 text-azure-400" />
                <span>Khách Hàng (Leads)</span>
              </Link>

              <Link
                href="/admin/content"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 hover:text-white transition-colors text-slate-300 border border-transparent hover:border-slate-700/80"
              >
                <LayoutTemplate className="w-4 h-4 text-azure-400" />
                <span>Nội Dung & Giao Diện</span>
              </Link>

              <Link
                href="/admin/settings"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800 hover:text-white transition-colors text-slate-300 border border-transparent hover:border-slate-700/80"
              >
                <Settings className="w-4 h-4 text-azure-400" />
                <span>Cấu Hình Website</span>
              </Link>
            </nav>
          </div>

          {/* Phần dưới cùng sidebar: Thông tin Admin & Đăng xuất */}
          <div className="p-4 border-t border-slate-800 space-y-3">
            <div className="px-3 py-2 bg-slate-950/80 rounded-xl flex items-center gap-2.5 text-xs border border-slate-800/80">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="overflow-hidden">
                <span className="text-white font-bold block truncate">
                  {admin.fullName}
                </span>
                <span className="text-[10px] text-slate-400 truncate block font-mono">
                  {admin.email}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs px-2">
              <Link
                href="/"
                target="_blank"
                className="text-slate-400 hover:text-white flex items-center gap-1 transition-colors"
              >
                <span>Xem Website</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>

              <form
                action={async () => {
                  "use server";
                  await deleteSession();
                  redirect("/admin/login");
                }}
              >
                <button
                  type="submit"
                  className="text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors font-bold"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Thoát</span>
                </button>
              </form>
            </div>
          </div>
        </aside>
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-slate-950">
        {children}
      </div>
    </div>
  );
}
