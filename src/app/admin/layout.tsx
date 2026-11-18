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
      {/* Sidebar (Chỉ hiện khi đã đăng nhập) - Giao diện sáng theo bộ nhận diện Logo GT */}
      {admin && (
        <aside className="w-full md:w-64 bg-white text-slate-700 flex flex-col justify-between shrink-0 shadow-xs border-r border-slate-200">
          <div>
            {/* Logo Admin GT Logistics chính thức */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between bg-white">
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
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-transit-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
              </span>
            </div>

            {/* Menu điều hướng */}
            <nav className="p-4 space-y-1.5 text-xs font-semibold">
              <Link
                href="/admin/editor"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-gradient-to-r from-azure-50 via-azure-50/80 to-gold-50/70 border border-gold-400 text-azure-900 hover:border-gold-500 transition-colors shadow-xs"
              >
                <Eye className="w-4 h-4 text-gold-600 shrink-0" />
                <span className="font-bold">Sửa Trực Quan (Click-to-Edit)</span>
                <span className="text-[9px] bg-gold-500 text-slate-950 font-black px-1.5 py-0.5 rounded ml-auto">
                  LIVE
                </span>
              </Link>

              <Link
                href="/admin/dashboard"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-azure-50 hover:text-azure-700 transition-colors text-slate-700 border border-transparent hover:border-azure-200"
              >
                <LayoutDashboard className="w-4 h-4 text-azure-600" />
                <span>Bảng Tổng Quan</span>
              </Link>

              <Link
                href="/admin/posts"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-azure-50 hover:text-azure-700 transition-colors text-slate-700 border border-transparent hover:border-azure-200"
              >
                <FileText className="w-4 h-4 text-azure-600" />
                <span>Quản Lý Bài Viết</span>
              </Link>

              <Link
                href="/admin/leads"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-azure-50 hover:text-azure-700 transition-colors text-slate-700 border border-transparent hover:border-azure-200"
              >
                <Users className="w-4 h-4 text-azure-600" />
                <span>Khách Hàng (Leads)</span>
              </Link>

              <Link
                href="/admin/content"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-azure-50 hover:text-azure-700 transition-colors text-slate-700 border border-transparent hover:border-azure-200"
              >
                <LayoutTemplate className="w-4 h-4 text-azure-600" />
                <span>Nội Dung & Giao Diện</span>
              </Link>

              <Link
                href="/admin/settings"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-azure-50 hover:text-azure-700 transition-colors text-slate-700 border border-transparent hover:border-azure-200"
              >
                <Settings className="w-4 h-4 text-azure-600" />
                <span>Cấu Hình Website</span>
              </Link>
            </nav>
          </div>

          {/* Phần dưới cùng sidebar: Thông tin Admin & Đăng xuất */}
          <div className="p-4 border-t border-slate-200 space-y-3 bg-white">
            <div className="px-3 py-2.5 bg-slate-50 rounded-xl flex items-center gap-2.5 text-xs border border-slate-200/80">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <div className="overflow-hidden">
                <span className="text-slate-900 font-bold block truncate">
                  {admin.fullName}
                </span>
                <span className="text-[10px] text-slate-500 truncate block font-mono">
                  {admin.email}
                </span>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs px-2">
              <Link
                href="/"
                target="_blank"
                className="text-slate-500 hover:text-azure-700 flex items-center gap-1 transition-colors font-medium"
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
                  className="text-rose-600 hover:text-rose-700 flex items-center gap-1 transition-colors font-bold"
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
