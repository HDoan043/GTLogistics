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
    <div className="p-6 sm:p-10 max-w-4xl mx-auto space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-black text-brand-950 tracking-tight">
          Cấu Hình Thông Tin Website
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Chỉnh sửa thông tin liên hệ, hotline, Zalo và địa chỉ hiển thị trên website mà không cần can thiệp vào code.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-6 sm:p-10">
        <SettingsForm initialSettings={settings} />
      </div>
    </div>
  );
}
