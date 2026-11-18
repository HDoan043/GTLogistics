"use client";

import React, { useState } from "react";
import { Save, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { savePageSectionContent } from "@/modules/content/actions";
import { DEFAULT_HOME_STATS } from "@/modules/content/constants";

interface StatItem {
  num: string;
  unit: string;
  label: string;
  labelEn?: string;
  labelZh?: string;
  sub: string;
  subEn?: string;
  subZh?: string;
}

export function StatsCounterEditor({ initialData }: { initialData?: StatItem[] }) {
  const [items, setItems] = useState<StatItem[]>(initialData || DEFAULT_HOME_STATS);
  const [langTab, setLangTab] = useState<"vi" | "en" | "zh">("vi");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const updateItem = (index: number, field: keyof StatItem, value: string) => {
    setItems((prev) => {
      const next = [...prev];
      const cur = { ...next[index] };
      if (field === "label") {
        if (langTab === "vi") cur.label = value;
        else if (langTab === "en") cur.labelEn = value;
        else if (langTab === "zh") cur.labelZh = value;
      } else if (field === "sub") {
        if (langTab === "vi") cur.sub = value;
        else if (langTab === "en") cur.subEn = value;
        else if (langTab === "zh") cur.subZh = value;
      } else {
        cur[field] = value;
      }
      next[index] = cur;
      return next;
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus(null);
    const res = await savePageSectionContent(
      "content_home_stats",
      items,
      "Nội dung 4 Big Numbers Thông Số Ấn Tượng"
    );
    setSaving(false);
    if (res.success) {
      setStatus({ type: "success", msg: "Đã lưu 4 thông số ấn tượng thành công!" });
    } else {
      setStatus({ type: "error", msg: res.message });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>4 Con Số Ấn Tượng (Big Numbers)</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-azure-950 text-azure-400 border border-azure-800">
              Trang Chủ & Giới Thiệu
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Chỉnh sửa 4 con số khẳng định năng lực (kinh nghiệm, tấn hàng, doanh nghiệp, tỷ lệ đúng hạn).
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((it, idx) => {
          const currentLabel =
            langTab === "vi" ? it.label : langTab === "en" ? it.labelEn || "" : it.labelZh || "";
          const currentSub =
            langTab === "vi" ? it.sub : langTab === "en" ? it.subEn || "" : it.subZh || "";

          return (
            <div
              key={idx}
              className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-azure-400">
                  Thẻ #{idx + 1}
                </span>
                <input
                  type="text"
                  value={it.unit}
                  onChange={(e) => updateItem(idx, "unit", e.target.value)}
                  placeholder="ĐƠN VỊ"
                  className="w-24 px-2 py-0.5 text-[10px] bg-slate-900 border border-slate-700 rounded text-slate-400 font-mono text-right"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Giá trị số lớn
                </label>
                <input
                  type="text"
                  value={it.num}
                  onChange={(e) => updateItem(idx, "num", e.target.value)}
                  placeholder="10+, 99.8%..."
                  className="w-full px-3 py-1.5 text-base bg-slate-900 border border-slate-700 rounded-lg text-white font-black font-mono focus:border-azure-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Nhãn tiêu đề ({langTab.toUpperCase()})
                </label>
                <input
                  type="text"
                  value={currentLabel}
                  onChange={(e) => updateItem(idx, "label", e.target.value)}
                  placeholder="Năm Kinh Nghiệm..."
                  className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-gold-300 font-bold focus:border-azure-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                  Dòng chú thích ({langTab.toUpperCase()})
                </label>
                <textarea
                  rows={2}
                  value={currentSub}
                  onChange={(e) => updateItem(idx, "sub", e.target.value)}
                  placeholder="Mô tả phụ..."
                  className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-slate-300 focus:border-azure-500 focus:outline-none resize-none"
                />
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
              <span>Lưu Thay Đổi 4 Con Số</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
