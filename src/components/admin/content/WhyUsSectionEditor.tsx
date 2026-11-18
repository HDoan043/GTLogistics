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
    const res = await savePageSectionContent("content_home_why_us", data, "Nội dung Vì Sao Chọn GT Logistics");
    setSaving(false);
    if (res.success) {
      setStatus({ type: "success", msg: "Đã lưu thay đổi mục Vì Sao Chọn thành công!" });
    } else {
      setStatus({ type: "error", msg: res.message || "Có lỗi xảy ra khi lưu!" });
    }
    setTimeout(() => setStatus(null), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Vì Sao Khách Hàng Tin Chọn (Section 1.5)</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Chỉnh sửa tiêu đề chính, mô tả phụ và nội dung các thẻ ưu thế cạnh tranh.
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

      <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
        <h3 className="font-bold text-sm text-slate-900">Tiêu Đề & Lời Dẫn</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Badge phụ:</label>
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
              className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:border-azure-500 focus:bg-white focus:outline-none"
            />
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Tiêu đề chính:</label>
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
              className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:border-azure-500 focus:bg-white focus:outline-none"
            />
          </div>
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Mô tả dẫn nhập:</label>
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
            className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm focus:border-azure-500 focus:bg-white focus:outline-none"
          />
        </div>
      </div>

      {/* Danh sách 4 thẻ lợi thế */}
      <div className="space-y-4">
        <h3 className="font-bold text-sm text-slate-900">Các Thẻ Lợi Thế Cạnh Tranh</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.items.map((item, idx) => {
            const itemTitle = langTab === "vi" ? item.title : langTab === "en" ? item.titleEn || "" : item.titleZh || "";
            const itemDesc = langTab === "vi" ? item.desc : langTab === "en" ? item.descEn || "" : item.descZh || "";

            return (
              <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
                <span className="text-xs font-bold text-azure-600 block">Ưu thế #{idx + 1}</span>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Tiêu đề:</label>
                  <input
                    type="text"
                    value={itemTitle}
                    onChange={(e) => updateItem(idx, "title", e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold focus:border-azure-500 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Mô tả:</label>
                  <textarea
                    rows={2}
                    value={itemDesc}
                    onChange={(e) => updateItem(idx, "desc", e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-xs focus:border-azure-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
