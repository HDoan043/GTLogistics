"use client";

import React, { useState } from "react";
import { Save, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { savePageSectionContent } from "@/modules/content/actions";
import { DEFAULT_BANNERS_CONTENT } from "@/modules/content/constants";

interface BannerItem {
  title: string;
  titleEn?: string;
  titleZh?: string;
  subtitle: string;
  subtitleEn?: string;
  subtitleZh?: string;
}

type BannersData = Record<string, BannerItem>;

const PAGE_NAMES: Record<string, string> = {
  services: "Trang Tất Cả Dịch Vụ (/services)",
  tracking: "Trang Tra Cứu Vận Đơn (/tracking)",
  news: "Trang Tin Tức & Cẩm Nang (/news)",
  quote: "Trang Yêu Cầu Báo Giá (/quote)",
  contact: "Trang Liên Hệ (/contact)",
};

export function PageBannersEditor({ initialData }: { initialData?: BannersData }) {
  const [data, setData] = useState<BannersData>(initialData || DEFAULT_BANNERS_CONTENT);
  const [langTab, setLangTab] = useState<"vi" | "en" | "zh">("vi");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const updateBanner = (pageKey: string, field: "title" | "subtitle", text: string) => {
    setData((prev) => {
      const cur = { ...prev[pageKey] };
      if (field === "title") {
        if (langTab === "vi") cur.title = text;
        else if (langTab === "en") cur.titleEn = text;
        else if (langTab === "zh") cur.titleZh = text;
      } else {
        if (langTab === "vi") cur.subtitle = text;
        else if (langTab === "en") cur.subtitleEn = text;
        else if (langTab === "zh") cur.subtitleZh = text;
      }
      return { ...prev, [pageKey]: cur };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus(null);
    const res = await savePageSectionContent(
      "content_banners",
      data,
      "Nội dung Tiêu Đề Banners Các Trang Con"
    );
    setSaving(false);
    if (res.success) {
      setStatus({ type: "success", msg: "Đã lưu tiêu đề các trang con thành công!" });
    } else {
      setStatus({ type: "error", msg: res.message });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>Tiêu Đề & Phụ Đề Các Trang Con (Page Banners)</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-azure-950 text-azure-400 border border-azure-800">
              Toàn Trang
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Chỉnh sửa tiêu đề chính và phụ đề hiển thị ở đầu các trang chức năng.
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

      <div className="space-y-4">
        {Object.entries(PAGE_NAMES).map(([key, label]) => {
          const item = data[key] || { title: "", subtitle: "" };
          const currentTitle =
            langTab === "vi" ? item.title : langTab === "en" ? item.titleEn || "" : item.titleZh || "";
          const currentSubtitle =
            langTab === "vi" ? item.subtitle : langTab === "en" ? item.subtitleEn || "" : item.subtitleZh || "";

          return (
            <div
              key={key}
              className="p-4 sm:p-5 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3"
            >
              <span className="text-xs font-bold text-azure-400 block">
                {label}
              </span>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Tiêu Đề Đầu Trang ({langTab.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    value={currentTitle}
                    onChange={(e) => updateBanner(key, "title", e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white font-bold focus:border-azure-500 focus:outline-none"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Phụ Đề / Mô Tả Ngắn ({langTab.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    value={currentSubtitle}
                    onChange={(e) => updateBanner(key, "subtitle", e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-slate-200 focus:border-azure-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>

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
              <span>Lưu Thay Đổi Banners Các Trang</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
