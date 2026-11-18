"use client";

import React, { useState } from "react";
import { Plus, Trash2, Image as ImageIcon, Save, CheckCircle2, AlertCircle, Loader2, Sliders } from "lucide-react";
import Image from "next/image";
import { MediaPickerModal } from "@/components/admin/MediaPickerModal";
import { savePageSectionContent } from "@/modules/content/actions";
import { DEFAULT_HOME_HERO } from "@/modules/content/constants";

export function HeroSectionEditor({ initialData }: { initialData?: any }) {
  const [data, setData] = useState<any>(initialData || DEFAULT_HOME_HERO);
  const [langTab, setLangTab] = useState<"vi" | "en" | "zh">("vi");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const addBullet = () => {
    setData((prev: any) => ({
      ...prev,
      bullets: [
        ...(prev.bullets || []),
        {
          vi: "Nội dung năng lực trọng tâm mới...",
          en: "New highlight item...",
          zh: "新增重点内容...",
        },
      ],
    }));
  };

  const removeBullet = (index: number) => {
    setData((prev: any) => ({
      ...prev,
      bullets: (prev.bullets || []).filter((_: any, i: number) => i !== index),
    }));
  };

  const updateBullet = (index: number, text: string) => {
    setData((prev: any) => {
      const nextBullets = [...(prev.bullets || [])];
      const cur = { ...nextBullets[index] };
      if (langTab === "vi") cur.vi = text;
      else if (langTab === "en") cur.en = text;
      else if (langTab === "zh") cur.zh = text;
      nextBullets[index] = cur;
      return { ...prev, bullets: nextBullets };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus(null);
    const res = await savePageSectionContent("content_home_hero", data, "Nội dung Hero Section Trang Chủ");
    setSaving(false);
    if (res.success) {
      setStatus({ type: "success", msg: "Đã lưu thay đổi Hero Section thành công!" });
    } else {
      setStatus({ type: "error", msg: res.message || "Có lỗi xảy ra khi lưu!" });
    }
    setTimeout(() => setStatus(null), 4000);
  };

  const sloganField = langTab === "zh" ? "sloganZh" : langTab === "en" ? "sloganEn" : "slogan";
  const descField = langTab === "zh" ? "descriptionZh" : langTab === "en" ? "descriptionEn" : "description";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Hero Section (Đầu Trang Chủ)</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Tên công ty 2 dòng nhận diện thương hiệu, khẩu hiệu, mô tả ngắn, ảnh nền và tỷ lệ thu phóng.
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
            <span>{saving ? "Đang lưu..." : "Lưu Hero Section"}</span>
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

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cột trái: Tên 2 dòng, slogan, mô tả */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
            <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100">
              Tiêu Đề Thương Hiệu 2 Dòng (Xanh Hàng Trên / Vàng Hàng Dưới)
            </h3>

            <div>
              <label className="text-xs font-bold text-azure-700 block mb-1">
                Hàng Trên (Màu Xanh Thương Hiệu):
              </label>
              <input
                type="text"
                value={data.titleLine1 || "CÔNG TY TNHH"}
                onChange={(e) => setData({ ...data, titleLine1: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-azure-600 text-base font-black focus:border-azure-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-amber-600 block mb-1">
                Hàng Dưới (Màu Vàng Thương Hiệu):
              </label>
              <input
                type="text"
                value={data.titleLine2 || "LOGISTICS GT"}
                onChange={(e) => setData({ ...data, titleLine2: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-amber-600 text-base font-black focus:border-amber-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Khẩu hiệu / Slogan:</label>
              <input
                type="text"
                value={data[sloganField] || ""}
                onChange={(e) => setData({ ...data, [sloganField]: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-semibold focus:border-azure-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Mô tả ngắn gọn:</label>
              <textarea
                rows={3}
                value={data[descField] || ""}
                onChange={(e) => setData({ ...data, [descField]: e.target.value })}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs leading-relaxed focus:border-azure-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nút chính (Primary CTA):</label>
                <input
                  type="text"
                  value={data.ctaPrimaryText || "Nhận Báo Giá"}
                  onChange={(e) => setData({ ...data, ctaPrimaryText: e.target.value })}
                  className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold focus:border-azure-500 focus:bg-white focus:outline-none"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-700 block mb-1">Nút phụ (Secondary CTA):</label>
                <input
                  type="text"
                  value={data.ctaSecondaryText || "Hotline Tư Vấn"}
                  onChange={(e) => setData({ ...data, ctaSecondaryText: e.target.value })}
                  className="w-full p-2 rounded-lg bg-slate-50 border border-slate-200 text-slate-900 text-xs font-bold focus:border-azure-500 focus:bg-white focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Cột phải: Ảnh nền, Thu phóng & Năng lực */}
        <div className="space-y-4">
          <div className="p-5 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
            <h3 className="font-bold text-sm text-slate-900 pb-2 border-b border-slate-100 flex items-center justify-between">
              <span>Ảnh Nền Hero & Căn Chỉnh Hiển Thị</span>
              <Sliders className="w-4 h-4 text-azure-600" />
            </h3>

            <div className="relative h-44 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 group">
              {data.bgImage ? (
                <Image
                  src={data.bgImage}
                  alt="Hero Background"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                  Chưa có ảnh nền
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
                <span className="text-xs font-mono font-bold text-azure-600">{data.bgScale || 100}%</span>
              </div>
              <input
                type="range"
                min="100"
                max="250"
                step="5"
                value={data.bgScale || 100}
                onChange={(e) => setData({ ...data, bgScale: parseInt(e.target.value, 10) })}
                className="w-full accent-azure-600 cursor-pointer"
              />

              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700">Độ rõ ảnh nền (Opacity):</span>
                <span className="text-xs font-mono font-bold text-azure-600">{data.bgOpacity ?? 55}%</span>
              </div>
              <input
                type="range"
                min="10"
                max="85"
                step="5"
                value={data.bgOpacity ?? 55}
                onChange={(e) => setData({ ...data, bgOpacity: parseInt(e.target.value, 10) })}
                className="w-full accent-azure-600 cursor-pointer"
              />

              <div>
                <span className="text-xs font-bold text-slate-700 block mb-1">Căn vị trí ảnh nền:</span>
                <div className="flex items-center gap-2">
                  {(["top", "center", "bottom"] as const).map((pos) => (
                    <button
                      key={pos}
                      type="button"
                      onClick={() => setData({ ...data, bgPosition: pos })}
                      className={`flex-1 py-1.5 rounded-lg text-xs font-bold capitalize transition-colors ${
                        (data.bgPosition || "center") === pos
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
          setData((prev: any) => ({ ...prev, bgImage: url }));
          setPickerOpen(false);
        }}
      />
    </div>
  );
}
