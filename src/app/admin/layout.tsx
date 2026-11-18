import React from "react";
import Link from "next/link";
import Image from "next/image";
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
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row">
      {/* Sidebar (Chỉ hiện khi đã đăng nhập) - Giao diện tối sang trọng tạo tương phản nổi bật */}
      {admin && (
        <aside className="w-full md:w-64 bg-slate-950 text-slate-300 flex flex-col justify-between shrink-0 shadow-lg border-r border-slate-800">
          <div>
            {/* Logo Admin GT Logistics chính thức trên nền tối */}
            <div className="p-4 border-b border-slate-800/80 flex items-center justify-between bg-slate-950">
              <Link href="/admin/dashboard" className="flex items-center gap-2">
                <div className="relative h-10 w-36">
                  <Image
                    src="/images/gt_logo.webp"
                    alt="GT Logistics"
                    fill
                    priority
                    className="object-contain object-left"
                  />
                </div>
              </Link>
            </div>

            {/* Menu điều hướng */}
            <nav className="p-4 space-y-1.5 text-xs font-semibold">
              <Link
                href="/admin/editor"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gradient-to-r from-azure-950/70 via-azure-900/40 to-gold-950/40 border border-gold-500/50 text-gold-300 hover:border-gold-400 hover:text-gold-200 transition-colors shadow-xs"
              >
                <Eye className="w-4 h-4 text-gold-400 shrink-0" />
                <span className="font-bold">Sửa Trực Quan (Live)</span>
                <span className="text-[9px] bg-gold-400 text-slate-950 font-black px-1.5 py-0.5 rounded ml-auto">
                  LIVE
                </span>
              </Link>

              <Link
                href="/admin/dashboard"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/80 hover:text-white transition-colors text-slate-300 border border-transparent hover:border-slate-700/60"
              >
                <LayoutDashboard className="w-4 h-4 text-azure-400" />
                <span>Bảng Tổng Quan</span>
              </Link>

              <Link
                href="/admin/posts"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/80 hover:text-white transition-colors text-slate-300 border border-transparent hover:border-slate-700/60"
              >
                <FileText className="w-4 h-4 text-azure-400" />
                <span>Quản Lý Bài Viết</span>
              </Link>

              <Link
                href="/admin/leads"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/80 hover:text-white transition-colors text-slate-300 border border-transparent hover:border-slate-700/60"
              >
                <Users className="w-4 h-4 text-azure-400" />
                <span>Khách Hàng (Leads)</span>
              </Link>

              <Link
                href="/admin/content"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/80 hover:text-white transition-colors text-slate-300 border border-transparent hover:border-slate-700/60"
              >
                <LayoutTemplate className="w-4 h-4 text-azure-400" />
                <span>Nội Dung & Giao Diện</span>
              </Link>

              <Link
                href="/admin/settings"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-800/80 hover:text-white transition-colors text-slate-300 border border-transparent hover:border-slate-700/60"
              >
                <Settings className="w-4 h-4 text-azure-400" />
                <span>Cấu Hình Website</span>
              </Link>
            </nav>
          </div>

          {/* Phần dưới cùng sidebar: Thông tin Admin & Đăng xuất */}
          <div className="p-4 border-t border-slate-800 space-y-3 bg-slate-950/90">
            <div className="px-3 py-2.5 bg-slate-900 rounded-xl flex items-center gap-2.5 text-xs border border-slate-800">
              <ShieldCheck className="w-4 h-4 text-azure-400 shrink-0" />
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
                className="text-slate-400 hover:text-azure-300 flex items-center gap-1 transition-colors font-medium"
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
      <div className="flex-1 overflow-y-auto bg-slate-50 text-slate-900">
        {children}
      </div>
    </div>
  );
}
