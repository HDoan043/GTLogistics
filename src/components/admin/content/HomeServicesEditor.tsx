"use client";

import React, { useState } from "react";
import { Image as ImageIcon, Save, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Image from "next/image";
import { MediaPickerModal } from "@/components/admin/MediaPickerModal";
import { savePageSectionContent } from "@/modules/content/actions";
import { DEFAULT_HOME_SERVICES } from "@/modules/content/constants";

export function HomeServicesEditor({ initialData }: { initialData?: any }) {
  const [data, setData] = useState<any>(initialData || DEFAULT_HOME_SERVICES);
  const [langTab, setLangTab] = useState<"vi" | "en" | "zh">("vi");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setStatus(null);
    const res = await savePageSectionContent(
      "content_home_services",
      data,
      "Cập nhật Mục Dịch Vụ Trang Chủ"
    );
    setSaving(false);
    if (res.success) {
      setStatus({ type: "success", msg: "Đã lưu nội dung Dịch Vụ Trang Chủ thành công!" });
    } else {
      setStatus({ type: "error", msg: res.message || "Có lỗi xảy ra khi lưu!" });
    }
    setTimeout(() => setStatus(null), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Mục Dịch Vụ Trang Chủ (Section 1.3)</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Quản lý tiêu đề, khẩu hiệu và hình ảnh minh họa cho khối 4 dịch vụ trọng tâm trên trang chủ.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            {(["vi", "en", "zh"] as const).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => setLangTab(l)}
                className={`px-3 py-1 rounded-lg text-xs font-bold transition-colors ${
                  langTab === l
                    ? "bg-azure-600 text-white shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-azure-600 hover:bg-azure-500 text-white font-bold text-xs transition-colors shadow-sm disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{saving ? "Đang lưu..." : "Lưu Thay Đổi"}</span>
          </button>
        </div>
      </div>

      {status && (
        <div
          className={`p-4 rounded-xl text-xs font-semibold flex items-center gap-2 border ${
            status.type === "success"
              ? "bg-emerald-50 text-emerald-800 border-emerald-200"
              : "bg-rose-50 text-rose-800 border-rose-200"
          }`}
        >
          {status.type === "success" ? <CheckCircle2 className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          <span>{status.msg}</span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Badge phụ:</label>
            <input
              type="text"
              value={langTab === "zh" ? data.badgeZh || "" : langTab === "en" ? data.badgeEn || "" : data.badge || ""}
              onChange={(e) => {
                const val = e.target.value;
                setData((prev: any) => ({
                  ...prev,
                  ...(langTab === "zh" ? { badgeZh: val } : langTab === "en" ? { badgeEn: val } : { badge: val }),
                }));
              }}
              className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:border-azure-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Tiêu đề chính:</label>
            <input
              type="text"
              value={langTab === "zh" ? data.headingZh || "" : langTab === "en" ? data.headingEn || "" : data.heading || ""}
              onChange={(e) => {
                const val = e.target.value;
                setData((prev: any) => ({
                  ...prev,
                  ...(langTab === "zh" ? { headingZh: val } : langTab === "en" ? { headingEn: val } : { heading: val }),
                }));
              }}
              className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:border-azure-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Mô tả ngắn gọn:</label>
            <textarea
              rows={3}
              value={langTab === "zh" ? data.descriptionZh || "" : langTab === "en" ? data.descriptionEn || "" : data.description || ""}
              onChange={(e) => {
                const val = e.target.value;
                setData((prev: any) => ({
                  ...prev,
                  ...(langTab === "zh" ? { descriptionZh: val } : langTab === "en" ? { descriptionEn: val } : { description: val }),
                }));
              }}
              className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:border-azure-500 focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Ảnh minh họa dịch vụ đa phương thức:</label>
          <div className="relative h-56 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 group">
            {data.illustrationImage ? (
              <Image
                src={data.illustrationImage}
                alt="Services illustration"
                fill
                className="object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                Chưa có ảnh minh họa
              </div>
            )}
            <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
              <button
                type="button"
                onClick={() => setPickerOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-azure-600 text-white font-bold text-xs shadow-md"
              >
                <ImageIcon className="w-4 h-4" />
                <span>Chọn ảnh từ Thư viện</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <MediaPickerModal
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(url) => {
          setData((prev: any) => ({ ...prev, illustrationImage: url }));
          setPickerOpen(false);
        }}
      />
    </div>
  );
}
