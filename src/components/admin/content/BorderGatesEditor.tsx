"use client";

import React, { useState } from "react";
import { Save, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import { savePageSectionContent } from "@/modules/content/actions";
import { DEFAULT_BORDER_GATES } from "@/modules/content/constants";

export function BorderGatesEditor({ initialData }: { initialData?: any }) {
  const [data, setData] = useState<any>(initialData || DEFAULT_BORDER_GATES);
  const [langTab, setLangTab] = useState<"vi" | "en" | "zh">("vi");
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const handleSave = async () => {
    setSaving(true);
    setStatus(null);
    const res = await savePageSectionContent(
      "content_border_gates",
      data,
      "Cập nhật Mạng Lưới Cửa Khẩu Chiến Lược"
    );
    setSaving(false);
    if (res.success) {
      setStatus({ type: "success", msg: "Đã lưu nội dung Mạng Lưới Cửa Khẩu thành công!" });
    } else {
      setStatus({ type: "error", msg: res.message || "Có lỗi xảy ra khi lưu!" });
    }
    setTimeout(() => setStatus(null), 4000);
  };

  const updateGate = (idx: number, field: string, value: string) => {
    setData((prev: any) => {
      const curGates = [...(prev.gates || DEFAULT_BORDER_GATES.gates)];
      curGates[idx] = { ...curGates[idx], [field]: value };
      return { ...prev, gates: curGates };
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Mạng Lưới Cửa Khẩu Chiến Lược (4 Cửa Khẩu Tuyến Bắc)</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Quản lý thông tin 4 cửa khẩu trọng điểm: Móng Cái, Hữu Nghị, Tân Thanh, Chi Ma.
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

      {/* Header section của cửa khẩu */}
      <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4">
        <h3 className="font-bold text-sm text-slate-900">Tiêu Đề & Lời Dẫn Chung</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>

        <div>
          <label className="text-xs font-bold text-slate-700 block mb-1">Mô tả dẫn nhập:</label>
          <textarea
            rows={2}
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

      {/* 4 Thẻ Cửa Khẩu Ma Trận 2x2 */}
      <div>
        <h3 className="font-bold text-sm text-slate-900 mb-3">4 Cửa Khẩu Trọng Điểm</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(data.gates || DEFAULT_BORDER_GATES.gates).map((gate: any, idx: number) => {
            const nameField = langTab === "zh" ? "nameZh" : langTab === "en" ? "nameEn" : "name";
            const descField = langTab === "zh" ? "descZh" : langTab === "en" ? "descEn" : "desc";

            return (
              <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200 space-y-3 relative shadow-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <span className="font-mono font-black text-azure-600 text-sm">{gate.code || `0${idx + 1}`}</span>
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-azure-50 text-azure-700">
                      {gate.province || "Cửa khẩu"}
                    </span>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Tên cửa khẩu:</label>
                  <input
                    type="text"
                    value={gate[nameField] || ""}
                    onChange={(e) => updateGate(idx, nameField, e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold focus:border-azure-500 focus:bg-white focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-xs font-bold text-slate-600 block mb-1">Mô tả năng lực & lợi thế:</label>
                  <textarea
                    rows={3}
                    value={gate[descField] || ""}
                    onChange={(e) => updateGate(idx, descField, e.target.value)}
                    className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-800 text-xs leading-relaxed focus:border-azure-500 focus:bg-white focus:outline-none"
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
