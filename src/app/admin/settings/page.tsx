import React from "react";
import { redirect } from "next/navigation";
import { getCurrentAdmin } from "@/lib/auth";
import { getSiteSettings } from "@/modules/settings/actions";
import { SettingsForm } from "@/components/admin/SettingsForm";

export default async function AdminSettingsPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  const settings = await getSiteSettings();

  return (
    <div className="p-6 sm:p-10 max-w-4xl mx-auto space-y-6 bg-slate-50 text-slate-900">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-full bg-azure-50 text-azure-700 border border-azure-200">
              System Config
            </span>
            <span className="text-[11px] text-slate-500 font-medium">
              Environment & Brand
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            Cấu Hình Thông Tin Website
          </h1>
          <p className="text-xs sm:text-sm text-slate-600 mt-1">
            Chỉnh sửa thông tin liên hệ, hotline, Zalo và địa chỉ hiển thị trên website mà không cần can thiệp vào code.
          </p>
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-xs p-6 sm:p-8">
        <SettingsForm initialSettings={settings} />
      </div>
    </div>
  );
}
