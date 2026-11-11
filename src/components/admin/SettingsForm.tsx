"use client";

import React, { useState } from "react";
import { Save, Building2, Phone, Mail, MapPin, Clock, FileText, CheckCircle2, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { updateSiteSettings } from "@/modules/settings/actions";

interface SettingsFormProps {
  initialSettings: Record<string, string>;
}

export function SettingsForm({ initialSettings }: SettingsFormProps) {
  const [loading, setLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setFeedback(null);

    const formData = new FormData(e.currentTarget);
    const res = await updateSiteSettings(formData);
    setLoading(false);

    if (res.success) {
      setFeedback({ type: "success", text: res.message });
    } else {
      setFeedback({ type: "error", text: res.message });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {feedback && (
        <div
          className={`p-4 rounded-xl flex items-center gap-2.5 text-xs font-semibold ${
            feedback.type === "success"
              ? "bg-emerald-50 text-emerald-800 border border-emerald-200"
              : "bg-rose-50 text-rose-800 border border-rose-200"
          }`}
        >
          {feedback.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
          )}
          <span>{feedback.text}</span>
        </div>
      )}

      <div className="space-y-4">
        <h3 className="font-bold text-sm text-brand-950 uppercase tracking-wider border-b border-slate-100 pb-2">
          Thông Tin Doanh Nghiệp
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Tên Doanh Nghiệp *
            </label>
            <div className="relative">
              <Building2 className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                name="companyName"
                defaultValue={initialSettings.companyName}
                required
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 font-semibold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Mã Số Thuế
            </label>
            <div className="relative">
              <FileText className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                name="taxCode"
                defaultValue={initialSettings.taxCode}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 font-mono"
              />
            </div>
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Khẩu Hiệu / Slogan
          </label>
          <input
            type="text"
            name="tagline"
            defaultValue={initialSettings.tagline}
            className="w-full px-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-slate-100">
        <h3 className="font-bold text-sm text-brand-950 uppercase tracking-wider border-b border-slate-100 pb-2">
          Kênh Liên Hệ & Nút Nổi
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Số Hotline (Hiển thị & Gọi) *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                name="hotline"
                defaultValue={initialSettings.hotline}
                required
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Số Điện Thoại Zalo (Nút Chat Zalo) *
            </label>
            <div className="relative">
              <Phone className="w-4 h-4 text-blue-500 absolute left-3 top-2.5" />
              <input
                type="text"
                name="zaloPhone"
                defaultValue={initialSettings.zaloPhone}
                required
                placeholder="0904382268"
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500 font-bold"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Hòm Thư Email
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="email"
                name="email"
                defaultValue={initialSettings.email}
                className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-4 pt-4 border-t border-slate-100">
        <h3 className="font-bold text-sm text-brand-950 uppercase tracking-wider border-b border-slate-100 pb-2">
          Địa Chỉ Văn Phòng & Chi Nhánh
        </h3>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Địa Chỉ Trụ Sở Chính (Hải Phòng) *
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              name="headquarters"
              defaultValue={initialSettings.headquarters}
              required
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Địa Chỉ Chi Nhánh (Móng Cái / Quảng Ninh) *
          </label>
          <div className="relative">
            <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              name="branchQuangNinh"
              defaultValue={initialSettings.branchQuangNinh}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-700 mb-1">
            Thời Gian Làm Việc
          </label>
          <div className="relative">
            <Clock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              name="workingHours"
              defaultValue={initialSettings.workingHours}
              className="w-full pl-9 pr-3 py-2 text-xs bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-brand-500"
            />
          </div>
        </div>
      </div>

      <div className="pt-6 border-t border-slate-100 flex justify-end">
        <Button
          type="submit"
          variant="accent"
          size="lg"
          isLoading={loading}
          className="font-bold shadow-lg"
        >
          <Save className="w-4 h-4 mr-2" />
          <span>Lưu Cấu Hình Doanh Nghiệp</span>
        </Button>
      </div>
    </form>
  );
}
