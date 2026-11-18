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
        (cur as any)[field] = value;
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
      setStatus({ type: "error", msg: res.message || "Có lỗi xảy ra khi lưu!" });
    }
    setTimeout(() => setStatus(null), 4000);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">4 Con Số Ấn Tượng (Big Numbers)</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Quản lý số liệu định lượng: quy mô đội xe, kinh nghiệm, thời gian thông quan và tỷ lệ đúng hẹn.
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
            <span>{saving ? "Đang lưu..." : "Lưu Số Liệu"}</span>
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {items.map((it, idx) => {
          const currentLabel = langTab === "vi" ? it.label : langTab === "en" ? it.labelEn || "" : it.labelZh || "";
          const currentSub = langTab === "vi" ? it.sub : langTab === "en" ? it.subEn || "" : it.subZh || "";

          return (
            <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 shadow-xs">
              <span className="text-xs font-bold text-azure-600 block">Chỉ số #{idx + 1}</span>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Con số:</label>
                  <input
                    type="text"
                    value={it.num}
                    onChange={(e) => updateItem(idx, "num", e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-black text-sm focus:border-azure-500 focus:bg-white focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-slate-600 block mb-1">Đơn vị:</label>
                  <input
                    type="text"
                    value={it.unit}
                    onChange={(e) => updateItem(idx, "unit", e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 font-bold text-sm focus:border-azure-500 focus:bg-white focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Tiêu đề chỉ số:</label>
                <input
                  type="text"
                  value={currentLabel}
                  onChange={(e) => updateItem(idx, "label", e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold focus:border-azure-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-[11px] font-bold text-slate-600 block mb-1">Mô tả phụ:</label>
                <input
                  type="text"
                  value={currentSub}
                  onChange={(e) => updateItem(idx, "sub", e.target.value)}
                  className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-600 text-[11px] focus:border-azure-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
