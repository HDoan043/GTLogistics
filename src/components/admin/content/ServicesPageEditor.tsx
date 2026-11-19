"use client";

import React, { useState } from "react";
import { Save, CheckCircle2, AlertCircle, Loader2, Image as ImageIcon } from "lucide-react";
import Image from "next/image";
import { updateServiceContent } from "@/modules/services/actions";
import { MediaPickerModal } from "@/components/admin/MediaPickerModal";
import { RichTextEditor } from "@/components/admin/RichTextEditor";

interface ServiceItem {
  id: string;
  slug: string;
  title: string;
  titleEn?: string | null;
  titleZh?: string | null;
  shortDesc?: string | null;
  shortDescEn?: string | null;
  shortDescZh?: string | null;
  bannerImage?: string | null;
  fullContent?: string | null;
  fullContentEn?: string | null;
  fullContentZh?: string | null;
}

export function ServicesPageEditor({ initialServices = [] }: { initialServices: ServiceItem[] }) {
  const [services, setServices] = useState<ServiceItem[]>(initialServices.slice(0, 4));
  const [selectedSlug, setSelectedSlug] = useState<string>(services[0]?.slug || "");
  const [langTab, setLangTab] = useState<"vi" | "en" | "zh">("vi");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const activeService = services.find((s) => s.slug === selectedSlug) || services[0];

  const updateActive = (field: string, value: string) => {
    setServices((prev) =>
      prev.map((s) => (s.slug === activeService.slug ? { ...s, [field]: value } : s))
    );
  };

  const handleSave = async () => {
    if (!activeService) return;
    setSaving(true);
    setStatus(null);

    const res = await updateServiceContent(activeService.slug, {
      title: activeService.title,
      titleEn: activeService.titleEn || undefined,
      titleZh: activeService.titleZh || undefined,
      shortDesc: activeService.shortDesc || undefined,
      shortDescEn: activeService.shortDescEn || undefined,
      shortDescZh: activeService.shortDescZh || undefined,
      bannerImage: activeService.bannerImage || undefined,
      fullContent: activeService.fullContent || undefined,
      fullContentEn: activeService.fullContentEn || undefined,
      fullContentZh: activeService.fullContentZh || undefined,
    });

    setSaving(false);
    if (res.success) {
      setStatus({ type: "success", msg: `Đã lưu thay đổi cho dịch vụ "${activeService.title}" thành công!` });
    } else {
      setStatus({ type: "error", msg: res.message || "Có lỗi xảy ra khi lưu!" });
    }
    setTimeout(() => setStatus(null), 4000);
  };

  if (!activeService) {
    return <div className="p-6 text-sm text-slate-500">Chưa có dịch vụ nào trong hệ thống.</div>;
  }

  const titleField = langTab === "zh" ? "titleZh" : langTab === "en" ? "titleEn" : "title";
  const shortDescField = langTab === "zh" ? "shortDescZh" : langTab === "en" ? "shortDescEn" : "shortDesc";
  const contentField = langTab === "zh" ? "fullContentZh" : langTab === "en" ? "fullContentEn" : "fullContent";

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Quản Lý 4 Dịch Vụ Trọng Tâm</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Chỉnh sửa tiêu đề, tóm tắt, ảnh banner và chi tiết năng lực từng dịch vụ cốt lõi của GT Logistics.
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
            <span>{saving ? "Đang lưu..." : "Lưu Dịch Vụ Này"}</span>
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

      {/* Tabs chọn dịch vụ */}
      <div className="flex flex-wrap gap-2">
        {services.map((s, idx) => {
          const isActive = s.slug === activeService.slug;
          return (
            <button
              key={s.slug}
              type="button"
              onClick={() => setSelectedSlug(s.slug)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-colors text-left ${
                isActive
                  ? "bg-azure-600 text-white shadow-sm"
                  : "bg-white border border-slate-200 text-slate-700 hover:bg-slate-50"
              }`}
            >
              <span className="opacity-70 mr-1.5">0{idx + 1}.</span>
              <span>{s.title}</span>
            </button>
          );
        })}
      </div>

      {/* Form chỉnh sửa dịch vụ đang chọn */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-6 shadow-xs">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Tên Dịch Vụ:</label>
              <input
                type="text"
                value={(activeService as any)[titleField] || ""}
                onChange={(e) => updateActive(titleField, e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-bold focus:border-azure-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Tóm Tắt Dịch Vụ (Hiển thị thẻ ngoài):</label>
              <textarea
                rows={3}
                value={(activeService as any)[shortDescField] || ""}
                onChange={(e) => updateActive(shortDescField, e.target.value)}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs leading-relaxed focus:border-azure-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Ảnh Nền / Banner Dịch Vụ:</label>
            <div className="relative h-44 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 group">
              {activeService.bannerImage ? (
                <Image
                  src={activeService.bannerImage}
                  alt={activeService.title}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                  Chưa có ảnh banner
                </div>
              )}
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <button
                  type="button"
                  onClick={() => setPickerOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-azure-600 text-white font-bold text-xs shadow-md"
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>Thay Đổi Ảnh Banner</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <RichTextEditor
          label="Nội Dung Chi Tiết Năng Lực & Quy Trình Dịch Vụ (Soạn Thảo Trực Quan):"
          helperText="Hỗ trợ đầy đủ tiêu đề các cấp, in đậm, in nghiêng, căn lề, danh sách bullet và chèn ảnh minh họa kèm chú thích."
          value={(activeService as any)[contentField] || ""}
          onChange={(html) => updateActive(contentField, html)}
          minHeight="380px"
          placeholder="Nhập nội dung quy trình, năng lực và bảng cam kết tiến độ dịch vụ tại đây…"
        />
      </div>

      <MediaPickerModal
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(url) => {
          updateActive("bannerImage", url);
          setPickerOpen(false);
        }}
      />
    </div>
  );
}
