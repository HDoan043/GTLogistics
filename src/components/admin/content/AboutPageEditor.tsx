"use client";

import React, { useState } from "react";
import { Plus, Trash2, Image as ImageIcon, Save, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Image from "next/image";
import { MediaPickerModal } from "@/components/admin/MediaPickerModal";
import { savePageSectionContent } from "@/modules/content/actions";
import { DEFAULT_ABOUT_CONTENT } from "@/modules/content/constants";

interface ParagraphItem {
  vi: string;
  en?: string;
  zh?: string;
}

interface ValueItem {
  title: string;
  titleEn?: string;
  titleZh?: string;
  desc: string;
  descEn?: string;
  descZh?: string;
}

interface AboutData {
  title: string;
  titleEn?: string;
  titleZh?: string;
  subtitle: string;
  subtitleEn?: string;
  subtitleZh?: string;
  storyImage: string;
  paragraphs: ParagraphItem[];
  values: ValueItem[];
}

export function AboutPageEditor({ initialData }: { initialData?: AboutData }) {
  const [data, setData] = useState<AboutData>(initialData || DEFAULT_ABOUT_CONTENT);
  const [langTab, setLangTab] = useState<"vi" | "en" | "zh">("vi");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const addParagraph = () => {
    setData((prev) => ({
      ...prev,
      paragraphs: [
        ...prev.paragraphs,
        {
          vi: "Thêm đoạn văn bản mới giới thiệu về doanh nghiệp...",
          en: "New paragraph introducing the enterprise...",
          zh: "新增企业介绍段落...",
        },
      ],
    }));
  };

  const removeParagraph = (index: number) => {
    setData((prev) => ({
      ...prev,
      paragraphs: prev.paragraphs.filter((_, i) => i !== index),
    }));
  };

  const updateParagraph = (index: number, text: string) => {
    setData((prev) => {
      const next = [...prev.paragraphs];
      const cur = { ...next[index] };
      if (langTab === "vi") cur.vi = text;
      else if (langTab === "en") cur.en = text;
      else if (langTab === "zh") cur.zh = text;
      next[index] = cur;
      return { ...prev, paragraphs: next };
    });
  };

  const updateValue = (index: number, field: "title" | "desc", text: string) => {
    setData((prev) => {
      const next = [...prev.values];
      const cur = { ...next[index] };
      if (field === "title") {
        if (langTab === "vi") cur.title = text;
        else if (langTab === "en") cur.titleEn = text;
        else if (langTab === "zh") cur.titleZh = text;
      } else {
        if (langTab === "vi") cur.desc = text;
        else if (langTab === "en") cur.descEn = text;
        else if (langTab === "zh") cur.descZh = text;
      }
      next[index] = cur;
      return { ...prev, values: next };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus(null);
    const res = await savePageSectionContent(
      "content_about",
      data,
      "Nội dung Trang Giới Thiệu Doanh Nghiệp"
    );
    setSaving(false);
    if (res.success) {
      setStatus({ type: "success", msg: "Đã lưu thay đổi Trang Giới Thiệu thành công!" });
    } else {
      setStatus({ type: "error", msg: res.message });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
        <div>
          <h2 className="text-base font-bold text-white flex items-center gap-2">
            <span>Trang Giới Thiệu Doanh Nghiệp (/about)</span>
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-azure-950 text-azure-400 border border-azure-800">
              Trang Giới Thiệu
            </span>
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Chỉnh sửa câu chuyện hình thành, các đoạn văn năng lực, ảnh trụ sở và các giá trị cốt lõi.
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

      {/* Header title & subtitle */}
      <div className="space-y-4">
        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5">
            Tiêu Đề Chính Câu Chuyện ({langTab.toUpperCase()})
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
            placeholder="CÂU CHUYỆN & NĂNG LỰC GT LOGISTICS"
            className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-white font-bold focus:border-azure-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-300 mb-1.5">
            Tiêu Đề Phụ / Mô Tả Ngắn ({langTab.toUpperCase()})
          </label>
          <textarea
            rows={2}
            value={langTab === "vi" ? data.subtitle : langTab === "en" ? data.subtitleEn || "" : data.subtitleZh || ""}
            onChange={(e) => {
              const val = e.target.value;
              setData((prev) => ({
                ...prev,
                ...(langTab === "vi" ? { subtitle: val } : langTab === "en" ? { subtitleEn: val } : { subtitleZh: val }),
              }));
            }}
            className="w-full px-3 py-2 text-xs bg-slate-950 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:border-azure-500 focus:outline-none resize-none"
          />
        </div>
      </div>

      {/* Ảnh minh họa câu chuyện */}
      <div className="p-4 rounded-xl bg-slate-950/60 border border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-300">
            Ảnh Minh Họa Doanh Nghiệp (Trụ sở / Đội ngũ)
          </label>
          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-azure-400 hover:text-azure-300 rounded-lg text-xs font-semibold transition-colors"
          >
            <ImageIcon className="w-3.5 h-3.5" />
            <span>Thay đổi ảnh minh họa</span>
          </button>
        </div>

        <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full max-w-lg rounded-xl overflow-hidden border border-slate-800 bg-slate-950">
          <Image
            src={data.storyImage || "/images/vietphuc/hero_office_panoramic.webp"}
            alt="About Story Preview"
            fill
            className="object-cover"
          />
        </div>
      </div>

      {/* Các đoạn văn giới thiệu chi tiết */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <label className="text-xs font-bold text-white block">
              Các Đoạn Văn Giới Thiệu Năng Lực ({data.paragraphs.length} đoạn)
            </label>
            <span className="text-[11px] text-slate-400">
              Ngôn ngữ đang chỉnh sửa: <strong className="text-azure-400">{langTab.toUpperCase()}</strong>
            </span>
          </div>
          <button
            type="button"
            onClick={addParagraph}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-azure-600/90 hover:bg-azure-600 text-white rounded-lg text-xs font-bold transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm đoạn văn</span>
          </button>
        </div>

        <div className="space-y-3">
          {data.paragraphs.map((p, idx) => {
            const currentText =
              langTab === "vi" ? p.vi : langTab === "en" ? p.en || "" : p.zh || "";

            return (
              <div
                key={idx}
                className="flex items-start gap-2.5 p-3 rounded-xl bg-slate-950/80 border border-slate-800 group hover:border-slate-700 transition-colors"
              >
                <span className="w-6 h-6 rounded-full bg-azure-500/20 text-azure-400 flex items-center justify-center font-mono font-bold text-xs shrink-0 mt-1">
                  {idx + 1}
                </span>
                <div className="flex-1">
                  <textarea
                    rows={4}
                    value={currentText}
                    onChange={(e) => updateParagraph(idx, e.target.value)}
                    placeholder={`Nội dung đoạn văn thứ ${idx + 1} (${langTab.toUpperCase()})...`}
                    className="w-full px-3 py-2 text-xs bg-slate-900 border border-slate-700 rounded-lg text-slate-200 placeholder-slate-500 focus:border-azure-500 focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeParagraph(idx)}
                  className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-slate-900 rounded-lg transition-colors shrink-0 mt-1"
                  title="Xóa đoạn này"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            );
          })}
        </div>
      </div>

      {/* 3 Cam kết / Giá trị cốt lõi */}
      <div className="space-y-4 pt-4 border-t border-slate-800">
        <h3 className="text-xs font-bold text-white">
          3 Cam Kết & Giá Trị Cốt Lõi (Tầm Nhìn & Sứ Mệnh)
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {data.values.map((v, idx) => {
            const currentTitle =
              langTab === "vi" ? v.title : langTab === "en" ? v.titleEn || "" : v.titleZh || "";
            const currentDesc =
              langTab === "vi" ? v.desc : langTab === "en" ? v.descEn || "" : v.descZh || "";

            return (
              <div
                key={idx}
                className="p-4 rounded-xl bg-slate-950/80 border border-slate-800 space-y-3"
              >
                <span className="text-xs font-bold text-gold-400 block">
                  Giá trị #{idx + 1}
                </span>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Tiêu Đề ({langTab.toUpperCase()})
                  </label>
                  <input
                    type="text"
                    value={currentTitle}
                    onChange={(e) => updateValue(idx, "title", e.target.value)}
                    className="w-full px-3 py-1.5 text-xs bg-slate-900 border border-slate-700 rounded-lg text-white font-bold focus:border-azure-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-semibold text-slate-400 mb-1">
                    Mô Tả ({langTab.toUpperCase()})
                  </label>
                  <textarea
                    rows={3}
                    value={currentDesc}
                    onChange={(e) => updateValue(idx, "desc", e.target.value)}
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
              <span>Lưu Thay Đổi Trang Giới Thiệu</span>
            </>
          )}
        </button>
      </div>

      <MediaPickerModal
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        currentImage={data.storyImage}
        onSelect={(url) => setData({ ...data, storyImage: url })}
        title="Chọn ảnh minh họa cho Trang Giới Thiệu"
      />
    </div>
  );
}
