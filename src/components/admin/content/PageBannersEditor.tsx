"use client";

import React, { useState } from "react";
import { Save, CheckCircle2, AlertCircle, Loader2, Image as ImageIcon, Sliders } from "lucide-react";
import Image from "next/image";
import { savePageSectionContent } from "@/modules/content/actions";
import { DEFAULT_BANNERS_CONTENT } from "@/modules/content/constants";
import { MediaPickerModal } from "@/components/admin/MediaPickerModal";

const PAGE_NAMES: Record<string, string> = {
  about: "Trang Giới Thiệu (/about)",
  services: "Trang Tất Cả Dịch Vụ (/services)",
  news: "Trang Tin Tức & Cẩm Nang (/news)",
  quote: "Trang Yêu Cầu Báo Giá (/quote)",
  contact: "Trang Liên Hệ (/contact)",
};

export function PageBannersEditor({ initialData }: { initialData?: any }) {
  const [data, setData] = useState<any>(initialData || DEFAULT_BANNERS_CONTENT);
  const [langTab, setLangTab] = useState<"vi" | "en" | "zh">("vi");
  const [activePageKey, setActivePageKey] = useState<string>("about");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const activeBanner = data[activePageKey] || (DEFAULT_BANNERS_CONTENT as any)[activePageKey] || {};

  const updateActive = (field: string, value: any) => {
    setData((prev: any) => ({
      ...prev,
      [activePageKey]: {
        ...(prev[activePageKey] || {}),
        [field]: value,
      },
    }));
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus(null);
    const res = await savePageSectionContent(
      "content_banners",
      data,
      "Cập nhật cấu hình Banners toàn trang"
    );
    setSaving(false);
    if (res.success) {
      setStatus({ type: "success", msg: "Đã lưu cấu hình Banners thành công!" });
    } else {
      setStatus({ type: "error", msg: res.message || "Có lỗi xảy ra khi lưu!" });
    }
    setTimeout(() => setStatus(null), 4000);
  };

  const titleField = langTab === "zh" ? "titleZh" : langTab === "en" ? "titleEn" : "title";
  const subtitleField = langTab === "zh" ? "subtitleZh" : langTab === "en" ? "subtitleEn" : "subtitle";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Banners Toàn Trang</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Quản lý ảnh nền, độ rõ/mờ, vị trí và thu phóng banner cho tất cả các trang chức năng.
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
            <span>{saving ? "Đang lưu..." : "Lưu Banners"}</span>
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

      {/* Tabs chọn trang */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(PAGE_NAMES).map(([key, label]) => {
          const isActive = key === activePageKey;
          return (
            <button
              key={key}
              type="button"
              onClick={() => setActivePageKey(key)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-colors ${
                isActive
                  ? "bg-azure-600 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {/* Cấu hình banner của trang đang chọn */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-6 shadow-xs">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Tiêu Đề Banner:</label>
              <input
                type="text"
                value={activeBanner[titleField] || ""}
                onChange={(e) => updateActive(titleField, e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-bold focus:border-azure-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Mô Tả Phụ (Subtitle):</label>
              <textarea
                rows={3}
                value={activeBanner[subtitleField] || ""}
                onChange={(e) => updateActive(subtitleField, e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs leading-relaxed focus:border-azure-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>Ảnh Nền & Tùy Biến Hiển Thị</span>
              <Sliders className="w-4 h-4 text-azure-600" />
            </h3>

            <div className="relative h-40 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 group">
              {activeBanner.bgImage ? (
                <Image
                  src={activeBanner.bgImage}
                  alt="Banner preview"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                  Chưa có ảnh nền banner
                </div>
              )}
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <button
                  type="button"
                  onClick={() => setPickerOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-azure-600 text-white font-bold text-xs shadow-md"
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>Thay Đổi Ảnh Nền</span>
                </button>
              </div>
            </div>

            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Tỷ lệ thu phóng (Scale):</span>
                <span className="text-xs font-mono font-bold text-azure-600">{activeBanner.bgScale || 100}%</span>
              </div>
              <input
                type="range"
                min="100"
                max="250"
                step="5"
                value={activeBanner.bgScale || 100}
                onChange={(e) => updateActive("bgScale", parseInt(e.target.value, 10))}
                className="w-full accent-azure-600 cursor-pointer"
              />

              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Độ rõ ảnh nền (Opacity):</span>
                <span className="text-xs font-mono font-bold text-azure-600">{activeBanner.bgOpacity ?? 55}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="85"
                step="5"
                value={activeBanner.bgOpacity ?? 55}
                onChange={(e) => updateActive("bgOpacity", parseInt(e.target.value, 10))}
                className="w-full accent-azure-600 cursor-pointer"
              />

              <div>
                <span className="text-xs font-bold text-slate-700 block mb-1">Căn vị trí ảnh nền:</span>
                <div className="flex items-center gap-2">
                  {(["top", "center", "bottom"] as const).map((pos) => (
                    <button
                      key={pos}
                      type="button"
                      onClick={() => updateActive("bgPosition", pos)}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
                        (activeBanner.bgPosition || "center") === pos
                          ? "bg-azure-600 text-white shadow-xs"
                          : "bg-slate-100 text-slate-700 hover:bg-slate-200"
                      }`}
                    >
                      {pos === "top" ? "Đỉnh" : pos === "center" ? "Giữa" : "Đáy"}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <MediaPickerModal
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(url) => {
          updateActive("bgImage", url);
          setPickerOpen(false);
        }}
      />
    </div>
  );
}
