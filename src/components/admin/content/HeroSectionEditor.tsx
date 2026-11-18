"use client";

import React, { useState } from "react";
import { Plus, Trash2, Image as ImageIcon, Save, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Image from "next/image";
import { MediaPickerModal } from "@/components/admin/MediaPickerModal";
import { savePageSectionContent } from "@/modules/content/actions";
import { DEFAULT_HOME_HERO } from "@/modules/content/constants";

interface BulletItem {
  vi: string;
  en?: string;
  zh?: string;
}

interface HeroData {
  titleGt: string;
  titleLogistics: string;
  slogan: string;
  sloganEn?: string;
  sloganZh?: string;
  bgImage: string;
  bullets: BulletItem[];
}

export function HeroSectionEditor({ initialData }: { initialData?: HeroData }) {
  const [data, setData] = useState<HeroData>(initialData || DEFAULT_HOME_HERO);
  const [langTab, setLangTab] = useState<"vi" | "en" | "zh">("vi");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  // Thêm bullet mới
  const addBullet = () => {
    setData((prev) => ({
      ...prev,
      bullets: [
        ...prev.bullets,
        {
          vi: "Nội dung điểm nhấn mới...",
          en: "New highlight item...",
          zh: "新增重点内容...",
        },
      ],
    }));
  };

  // Xóa bullet
  const removeBullet = (index: number) => {
    setData((prev) => ({
      ...prev,
      bullets: prev.bullets.filter((_, i) => i !== index),
    }));
  };

  // Cập nhật nội dung bullet
  const updateBullet = (index: number, text: string) => {
    setData((prev) => {
      const nextBullets = [...prev.bullets];
      const cur = nextBullets[index] || { vi: "" };
      if (langTab === "vi") cur.vi = text;
      else if (langTab === "en") cur.en = text;
      else if (langTab === "zh") cur.zh = text;
      nextBullets[index] = cur;
      return { ...prev, bullets: nextBullets };
    });
  };

  // Lưu cấu hình
  const handleSave = async () => {
    setSaving(true);
    setStatus(null);
    const res = await savePageSectionContent("content_home_hero", data, "Nội dung Hero Section Trang Chủ");
    setSaving(false);
    if (res.success) {
      setStatus({ type: "success", msg: "Đã lưu thay đổi Hero Section thành công!" });
    } else {
      setStatus({ type: "error", msg: res.message });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>Hero Section (Đầu Trang Chủ)</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-azure-950 text-azure-400 border border-azure-800">
              Trang Chủ
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Tùy biến khẩu hiệu, ảnh nền và danh sách các gạch đầu dòng giới thiệu năng lực.
          </p>
        </div>

        {/* Tab chuyển đổi ngôn ngữ */}
        <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setLangTab("vi")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              langTab === "vi"
                ? "bg-azure-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            Tiếng Việt (VI)
          </button>
          <button
            type="button"
            onClick={() => setLangTab("en")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              langTab === "en"
                ? "bg-azure-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
            }`}
          >
            English (EN)
          </button>
          <button
            type="button"
            onClick={() => setLangTab("zh")}
            className={`px-3 py-1.5 rounded-lg font-bold transition-colors ${
              langTab === "zh"
                ? "bg-azure-600 text-white shadow-sm"
                : "text-slate-400 hover:text-slate-200"
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

      {/* 1. Tiêu đề thương hiệu & Slogan */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5">
            Tiêu Đề Thương Hiệu
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              value={data.titleGt}
              onChange={(e) => setData({ ...data, titleGt: e.target.value })}
              placeholder="GT"
              className="w-24 px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-azure-400 font-black"
            />
            <input
              type="text"
              value={data.titleLogistics}
              onChange={(e) => setData({ ...data, titleLogistics: e.target.value })}
              placeholder="LOGISTICS"
              className="flex-1 px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-gold-400 font-black"
            />
          </div>
          <span className="text-[10px] text-slate-500 mt-1 block">
            Mô phỏng màu sắc thương hiệu: Khối 1 màu Xanh Azure, Khối 2 màu Vàng Gold.
          </span>
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5">
            Khẩu Hiệu / Tiêu Đề Phụ ({langTab.toUpperCase()})
          </label>
          <input
            type="text"
            value={
              langTab === "vi"
                ? data.slogan
                : langTab === "en"
                ? data.sloganEn || ""
                : data.sloganZh || ""
            }
            onChange={(e) => {
              const val = e.target.value;
              setData((prev) => ({
                ...prev,
                ...(langTab === "vi"
                  ? { slogan: val }
                  : langTab === "en"
                  ? { sloganEn: val }
                  : { sloganZh: val }),
              }));
            }}
            placeholder="ĐỒNG HÀNH TIN CẬY - PHÁT TRIỂN BỀN VỮNG"
            className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white font-bold focus:border-azure-500 focus:outline-none"
          />
        </div>
      </div>

      {/* 2. Ảnh nền Hero */}
      <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-300">
            Ảnh Nền Hero (Background Photo)
          </label>
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-azure-400 hover:text-azure-300 rounded-lg text-xs font-semibold transition-colors"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Thay đổi ảnh nền</span>
          </button>
        </div>

        <div className="relative aspect-[21/9] sm:aspect-[28/9] w-full rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
          <Image
            src={data.bgImage || "/images/vietphuc/hero_office_panoramic.webp"}
            alt="Hero Background Preview"
            fill
            className="object-cover opacity-80"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-950/40 flex items-center p-6">
            <span className="text-xs text-slate-300 font-mono bg-slate-900/80 px-2 py-1 rounded border border-slate-700">
              Đường dẫn hiện tại: {data.bgImage}
            </span>
          </div>
        </div>
      </div>

      {/* 3. Danh sách gạch đầu dòng (Bullets) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-xs font-bold text-white block">
              Danh Sách Gạch Đầu Dòng Giới Thiệu ({data.bullets.length} dòng)
            </label>
            <span className="text-[11px] text-slate-400">
              Ngôn ngữ đang chỉnh sửa: <strong className="text-azure-400">{langTab.toUpperCase()}</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={addBullet}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-azure-600/90 hover:bg-azure-600 text-white rounded-lg text-xs font-bold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm dòng mới</span>
          </button>
        </div>

        <div className="space-y-2.5">
          {data.bullets.map((bullet, idx) => {
            const currentText =
              langTab === "vi"
                ? bullet.vi
                : langTab === "en"
                ? bullet.en || ""
                : bullet.zh || "";

            return (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800 group hover:border-slate-700 transition-colors"
              >
                <div className="w-6 h-6 rounded-full bg-gold-400/20 text-gold-400 flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-1">
                  {idx + 1}
                </div>
                <div className="flex-1">
                  <textarea
                    rows={2}
                    value={currentText}
                    onChange={(e) => updateBullet(idx, e.target.value)}
                    placeholder={`Nhập nội dung gạch đầu dòng thứ ${idx + 1} (${langTab.toUpperCase()})...`}
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:border-azure-500 focus:outline-none resize-none"
                  />
                  {langTab !== "vi" && !currentText && (
                    <span className="text-[10px] text-amber-400/90 block mt-0.5">
                      (Chưa có bản dịch {langTab.toUpperCase()} - Hệ thống sẽ tự động hiển thị bản Tiếng Việt)
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => removeBullet(idx)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-900 rounded-lg transition-colors shrink-0 mt-1"
                  title="Xóa dòng này"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
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
              <span>Lưu Thay Đổi Hero Section</span>
            </>
          )}
        </button>
      </div>

      {/* Modal chọn ảnh */}
      <MediaPickerModal
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        currentImage={data.bgImage}
        onSelect={(url) => setData({ ...data, bgImage: url })}
        title="Chọn ảnh nền cho Hero Section"
      />
    </div>
  );
}
