"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
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
  HardDrive,
  Menu,
  X,
} from "lucide-react";

interface AdminSidebarProps {
  adminName: string;
  adminEmail: string;
  logoutAction: () => Promise<void>;
}

export function AdminSidebar({ adminName, adminEmail, logoutAction }: AdminSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  const navItems = [
    {
      href: "/admin/editor",
      label: "Sửa Trực Quan (Live)",
      icon: Eye,
      isSpecialLive: true,
    },
    {
      href: "/admin/dashboard",
      label: "Bảng Tổng Quan",
      icon: LayoutDashboard,
    },
    {
      href: "/admin/leads",
      label: "Danh Sách Báo Giá",
      icon: Users,
    },
    {
      href: "/admin/posts",
      label: "Quản Lý Bài Viết",
      icon: FileText,
    },
    {
      href: "/admin/media",
      label: "Kho Lưu Trữ & Media",
      icon: HardDrive,
    },
    {
      href: "/admin/content",
      label: "Nội Dung & Giao Diện",
      icon: LayoutTemplate,
    },
    {
      href: "/admin/settings",
      label: "Cấu Hình Website",
      icon: Settings,
    },
  ];

  const checkIsActive = (href: string) => {
    if (href === "/admin/dashboard") {
      return pathname === "/admin/dashboard";
    }
    return pathname === href || pathname.startsWith(`${href}/`);
  };

  return (
    <>
      {/* Mobile Top Bar */}
      <div className="md:hidden bg-slate-950 text-white p-3.5 border-b border-slate-800 flex items-center justify-between sticky top-0 z-40">
        <Link href="/admin/dashboard" className="flex items-center gap-2">
          <div className="relative h-8 w-28">
            <Image
              src="/images/gt_logo.webp"
              alt="GT Logistics"
              fill
              priority
              className="object-contain object-left"
            />
          </div>
        </Link>
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white"
          aria-label="Toggle admin menu"
        >
          {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Main Sidebar */}
      <aside
        className={`${
          mobileOpen ? "block" : "hidden"
        } md:flex w-full md:w-64 bg-slate-950 text-slate-300 flex-col justify-between shrink-0 shadow-xl border-r border-slate-800 z-30 md:min-h-screen`}
      >
        <div>
          {/* Logo Brand trên nền tối */}
          <div className="hidden md:flex p-4 border-b border-slate-800/80 items-center justify-between bg-slate-950">
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

          {/* Danh mục menu điều hướng */}
          <nav className="p-3.5 space-y-1.5 text-xs font-semibold">
            {navItems.map((item) => {
              const isActive = checkIsActive(item.href);
              const Icon = item.icon;

              if (item.isSpecialLive) {
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileOpen(false)}
                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors duration-150 ${
                      isActive
                        ? "bg-gradient-to-r from-azure-800 via-azure-700 to-gold-600 text-white font-bold border border-gold-400 shadow-md shadow-gold-500/10"
                        : "bg-gradient-to-r from-azure-950/70 via-azure-900/40 to-gold-950/40 border border-gold-500/50 text-gold-300 hover:border-gold-400 hover:text-gold-200"
                    }`}
                  >
                    <Eye className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-gold-400"}`} />
                    <span className="font-bold">{item.label}</span>
                    <span className="text-[9px] bg-gold-400 text-slate-950 font-black px-1.5 py-0.5 rounded ml-auto">
                      LIVE
                    </span>
                  </Link>
                );
              }

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-3.5 py-2.5 rounded-xl transition-colors duration-150 ${
                    isActive
                      ? "bg-azure-600 text-white font-bold shadow-md shadow-azure-900/50 border border-azure-400/40"
                      : "text-slate-400 hover:text-white hover:bg-slate-900/90 border border-transparent hover:border-slate-800"
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? "text-white" : "text-azure-400"}`} />
                  <span className="flex-1">{item.label}</span>
                  {isActive && (
                    <span className="w-1.5 h-1.5 rounded-full bg-gold-400 ml-auto shrink-0 animate-pulse" />
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Thông tin Quản Trị Viên & Nút Thoát */}
        <div className="p-4 border-t border-slate-800 space-y-3 bg-slate-950/90">
          <div className="px-3 py-2.5 bg-slate-900 rounded-xl flex items-center gap-2.5 text-xs border border-slate-800">
            <ShieldCheck className="w-4 h-4 text-azure-400 shrink-0" />
            <div className="overflow-hidden">
              <span className="text-white font-bold block truncate">{adminName}</span>
              <span className="text-[10px] text-slate-400 truncate block font-mono">
                {adminEmail}
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

            <form action={logoutAction}>
              <button
                type="submit"
                className="text-rose-400 hover:text-rose-300 flex items-center gap-1 transition-colors font-bold cursor-pointer"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Thoát</span>
              </button>
            </form>
          </div>
        </div>
      </aside>
    </>
  );
}
