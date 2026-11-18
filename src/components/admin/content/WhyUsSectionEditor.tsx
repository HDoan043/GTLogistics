"use client";

import React, { useState } from "react";
import { Image as ImageIcon, Save, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Image from "next/image";
import { MediaPickerModal } from "@/components/admin/MediaPickerModal";
import { savePageSectionContent } from "@/modules/content/actions";
import { DEFAULT_HOME_WHY_US } from "@/modules/content/constants";

interface WhyUsItem {
  icon: string;
  title: string;
  titleEn?: string;
  titleZh?: string;
  desc: string;
  descEn?: string;
  descZh?: string;
}

interface WhyUsData {
  badge: string;
  badgeEn?: string;
  badgeZh?: string;
  title: string;
  titleEn?: string;
  titleZh?: string;
  description: string;
  descriptionEn?: string;
  descriptionZh?: string;
  image: string;
  items: WhyUsItem[];
}

export function WhyUsSectionEditor({ initialData }: { initialData?: WhyUsData }) {
  const [data, setData] = useState<WhyUsData>(initialData || DEFAULT_HOME_WHY_US);
  const [langTab, setLangTab] = useState<"vi" | "en" | "zh">("vi");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const updateItem = (index: number, field: "title" | "desc", text: string) => {
    setData((prev) => {
      const nextItems = [...prev.items];
      const cur = { ...nextItems[index] };
      if (field === "title") {
        if (langTab === "vi") cur.title = text;
        else if (langTab === "en") cur.titleEn = text;
        else if (langTab === "zh") cur.titleZh = text;
      } else {
        if (langTab === "vi") cur.desc = text;
        else if (langTab === "en") cur.descEn = text;
        else if (langTab === "zh") cur.descZh = text;
      }
      nextItems[index] = cur;
      return { ...prev, items: nextItems };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus(null);
    const res = await savePageSectionContent(
      "content_home_why_us",
      data,
      "Nội dung Vì Sao Chọn GT Logistics"
    );
    setSaving(false);
    if (res.success) {
      setStatus({ type: "success", msg: "Đã lưu thay đổi mục 'Vì sao chọn GT' thành công!" });
    } else {
      setStatus({ type: "error", msg: res.message });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>Mục Vì Sao Chọn GT Logistics (Lợi Thế Cạnh Tranh)</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-azure-950 text-azure-400 border border-azure-800">
              Trang Chủ
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Chỉnh sửa tiêu đề chính, ảnh minh họa bên dưới và nội dung 4 thẻ ưu thế cạnh tranh.
          </p>
        </div>

        {/* Tab ngôn ngữ */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setLangTab("vi")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              langTab === "vi" ? "bg-azure-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Tiếng Việt (VI)
          </button>
          <button
            type="button"
            onClick={() => setLangTab("en")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              langTab === "en" ? "bg-azure-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            English (EN)
          </button>
          <button
            type="button"
            onClick={() => setLangTab("zh")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              langTab === "zh" ? "bg-azure-600 text-white shadow-sm" : "text-slate-400 hover:text-slate-200"
            }`}
          >
            中文 (ZH)
          </button>
        </div>
      </div>

      {status && (
        <div
          className={`p-4 rounded-xl flex items-center gap-2.5 text-xs font-semibold ${
            status.type === "success"
              ? "bg-emerald-950/80 text-emerald-300 border border-emerald-800/80"
              : "bg-rose-950/80 text-rose-300 border border-rose-800/80"
          }`}
        >
          {status.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          )}
          <span>{status.msg}</span>
        </div>
      )}

      {/* Header text & Badge */}
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Nhãn Badge ({langTab.toUpperCase()})
            </label>
            <input
              type="text"
              value={langTab === "vi" ? data.badge : langTab === "en" ? data.badgeEn || "" : data.badgeZh || ""}
              onChange={(e) => {
                const val = e.target.value;
                setData((prev) => ({
                  ...prev,
                  ...(langTab === "vi" ? { badge: val } : langTab === "en" ? { badgeEn: val } : { badgeZh: val }),
                }));
              }}
              placeholder="LỢI THẾ CẠNH TRANH CỐT LÕI"
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white font-semibold focus:border-azure-500 focus:outline-none"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Tiêu Đề Section ({langTab.toUpperCase()})
            </label>
            <input
              type="text"
              value={langTab === "vi" ? data.title : langTab === "en" ? data.titleEn || "" : data.titleZh || ""}
              onChange={(e) => {
                const val = e.target.value;
                setData((prev) => ({
                  ...prev,
                  ...(langTab === "vi" ? { title: val } : langTab === "en" ? { titleEn: val } : { titleZh: val }),
                }));
              }}
              placeholder="Vì Sao Khách Hàng Luôn Tin Chọn..."
              className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white font-bold focus:border-azure-500 focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5">
            Mô Tả Section ({langTab.toUpperCase()})
          </label>
          <textarea
            rows={2}
            value={langTab === "vi" ? data.description : langTab === "en" ? data.descriptionEn || "" : data.descriptionZh || ""}
            onChange={(e) => {
              const val = e.target.value;
              setData((prev) => ({
                ...prev,
                ...(langTab === "vi" ? { description: val } : langTab === "en" ? { descriptionEn: val } : { descriptionZh: val }),
              }));
            }}
            placeholder="Mô tả tóm tắt..."
            className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:border-azure-500 focus:outline-none resize-none"
          />
        </div>
      </div>

      {/* Ảnh minh họa bên dưới Header */}
      <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-300">
            Ảnh Minh Họa Bên Dưới Header (Accent Photo)
          </label>
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-azure-400 hover:text-azure-300 rounded-lg text-xs font-semibold transition-colors"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Thay đổi ảnh</span>
          </button>
        </div>

        <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full max-w-lg rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
          <Image
            src={data.image || "/images/vietphuc/boardroom_conference.webp"}
            alt="Why Us Preview"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* 4 Thẻ Ưu Thế Cạnh Tranh */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold text-white border-b border-slate-800 pb-2">
          Nội Dung 4 Thẻ Điểm Mạnh (Ưu Thế Cạnh Tranh)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {data.items.map((item, idx) => {
            const currentTitle =
              langTab === "vi" ? item.title : langTab === "en" ? item.titleEn || "" : item.titleZh || "";
            const currentDesc =
              langTab === "vi" ? item.desc : langTab === "en" ? item.descEn || "" : item.descZh || "";

            return (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-azure-400">
                    Thẻ số {idx + 1}
                  </span>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Icon: {item.icon}
                  </span>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Tiêu Đề Thẻ ({langTab.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    value={currentTitle}
                    onChange={(e) => updateItem(idx, "title", e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white font-bold focus:border-azure-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Mô Tả Chi Tiết ({langTab.toUpperCase()})
                  </label>
                  <textarea
                    rows={3}
                    value={currentDesc}
                    onChange={(e) => updateItem(idx, "desc", e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-slate-300 focus:border-azure-500 focus:outline-none resize-none"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Nút lưu */}
      <div className="pt-4 border-t border-slate-800 flex justify-end">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-slate-950 font-black text-xs transition-colors shadow-lg shadow-gold-500/10 disabled:opacity-50"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Đang lưu...</span>
            </>
          ) : (
            <>
              <Save className="w-4 h-4" />
              <span>Lưu Thay Đổi Mục &quot;Vì Sao Chọn GT&quot;</span>
            </>
          )}
        </button>
      </div>

      <MediaPickerModal
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        currentImage={data.image}
        onSelect={(url) => setData({ ...data, image: url })}
        title="Chọn ảnh minh họa cho mục Vì Sao Chọn GT Logistics"
      />
    </div>
  );
}
