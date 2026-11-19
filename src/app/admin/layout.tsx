import React from "react";
import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { getCurrentAdmin, deleteSession } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

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

  const handleLogout = async () => {
    "use server";
    await deleteSession();
    redirect("/admin/login");
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col md:flex-row">
      {/* Sidebar Độc Lập Có Highlight Trang Hiện Tại */}
      {admin && (
        <AdminSidebar
          adminName={admin.fullName}
          adminEmail={admin.email}
          logoutAction={handleLogout}
        />
      )}

      {/* Main Content Area */}
      <div className="flex-1 overflow-y-auto bg-slate-50 text-slate-900">
        {children}
      </div>
    </div>
  );
}
