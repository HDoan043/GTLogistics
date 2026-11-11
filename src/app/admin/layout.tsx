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
} from "lucide-react";
import { getCurrentAdmin, deleteSession } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = await getCurrentAdmin();

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row">
      {/* Sidebar (Chỉ hiện khi đã đăng nhập) */}
      {admin && (
        <aside className="w-full md:w-64 bg-brand-950 text-slate-300 flex flex-col justify-between shrink-0 shadow-xl">
          <div>
            {/* Logo Admin GT */}
            <div className="p-6 border-b border-brand-900 flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-accent-500 text-white flex items-center justify-center font-black text-xl shadow-md">
                GT
              </div>
              <div>
                <span className="font-black text-white text-base block tracking-tight">
                  LOGISTICS GT
                </span>
                <span className="text-[10px] text-accent-400 font-semibold tracking-wider uppercase">
                  Cổng Quản Trị Hệ Thống
                </span>
              </div>
            </div>

            {/* Menu điều hướng */}
            <nav className="p-4 space-y-1.5 text-xs font-semibold">
              <Link
                href="/admin/dashboard"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-brand-900 hover:text-white transition-colors"
              >
                <LayoutDashboard className="w-4 h-4 text-accent-400" />
                <span>Bảng Tổng Quan</span>
              </Link>

              <Link
                href="/admin/posts"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-brand-900 hover:text-white transition-colors"
              >
                <FileText className="w-4 h-4 text-accent-400" />
                <span>Quản Lý Bài Viết</span>
              </Link>

              <Link
                href="/admin/leads"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-brand-900 hover:text-white transition-colors"
              >
                <Users className="w-4 h-4 text-accent-400" />
                <span>Khách Hàng (Leads)</span>
              </Link>

              <Link
                href="/admin/settings"
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-brand-900 hover:text-white transition-colors"
              >
                <Settings className="w-4 h-4 text-accent-400" />
                <span>Cấu Hình Website</span>
              </Link>
            </nav>
          </div>

          {/* Phần dưới cùng sidebar: Thông tin Admin & Đăng xuất */}
          <div className="p-4 border-t border-brand-900 space-y-3">
            <div className="px-3 py-2 bg-brand-900/60 rounded-xl flex items-center gap-2.5 text-xs">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <div className="overflow-hidden">
                <span className="text-white font-bold block truncate">
                  {admin.fullName}
                </span>
                <span className="text-[10px] text-slate-400 truncate block">
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
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}
