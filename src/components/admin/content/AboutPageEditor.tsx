"use client";

import React, { useState } from "react";
import { Plus, Trash2, Image as ImageIcon, Save, CheckCircle2, AlertCircle, Loader2 } from "lucide-react";
import Image from "next/image";
import { MediaPickerModal } from "@/components/admin/MediaPickerModal";
import { savePageSectionContent } from "@/modules/content/actions";
import { DEFAULT_ABOUT_CONTENT } from "@/modules/content/constants";

export function AboutPageEditor({ initialData }: { initialData?: any }) {
  const [data, setData] = useState<any>(initialData || DEFAULT_ABOUT_CONTENT);
  const [langTab, setLangTab] = useState<"vi" | "en" | "zh">("vi");
  const [pickerOpen, setPickerOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);

  const addParagraph = () => {
    setData((prev: any) => ({
      ...prev,
      paragraphs: [
        ...(prev.paragraphs || []),
        {
          vi: "Thêm đoạn văn bản mới giới thiệu về doanh nghiệp...",
          en: "New paragraph introducing the enterprise...",
          zh: "新增企业介绍段落...",
        },
      ],
    }));
  };

  const removeParagraph = (index: number) => {
    setData((prev: any) => ({
      ...prev,
      paragraphs: (prev.paragraphs || []).filter((_: any, i: number) => i !== index),
    }));
  };

  const updateParagraph = (index: number, text: string) => {
    setData((prev: any) => {
      const next = [...(prev.paragraphs || [])];
      const cur = { ...next[index] };
      if (langTab === "vi") cur.vi = text;
      else if (langTab === "en") cur.en = text;
      else if (langTab === "zh") cur.zh = text;
      next[index] = cur;
      return { ...prev, paragraphs: next };
    });
  };

  const handleSave = async () => {
    setSaving(true);
    setStatus(null);
    const res = await savePageSectionContent(
      "content_about",
      data,
      "Nội dung Trang Giới Thiệu (About)"
    );
    setSaving(false);
    if (res.success) {
      setStatus({ type: "success", msg: "Đã lưu thay đổi Trang Giới Thiệu thành công!" });
    } else {
      setStatus({ type: "error", msg: res.message || "Có lỗi xảy ra khi lưu!" });
    }
    setTimeout(() => setStatus(null), 4000);
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-200">
        <div>
          <h2 className="text-xl font-bold text-slate-900">Trang Giới Thiệu (About Us)</h2>
          <p className="text-xs text-slate-500 mt-0.5">
            Quản lý toàn bộ 4 mục: Về chúng tôi, Quy mô & phạm vi, Tầm nhìn sứ mệnh và Hệ sinh thái.
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
            <span>{saving ? "Đang lưu..." : "Lưu Trang Giới Thiệu"}</span>
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

      {/* MỤC 1: VỀ CHÚNG TÔI */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-6 shadow-xs">
        <h3 className="font-bold text-base text-slate-950 pb-2 border-b border-slate-100">
          Mục 1: Về Chúng Tôi (Lời Dẫn & Đoạn Văn Bản)
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Tiêu đề chính:</label>
              <input
                type="text"
                value={langTab === "zh" ? data.titleZh || "" : langTab === "en" ? data.titleEn || "" : data.title || "VỀ CHÚNG TÔI"}
                onChange={(e) => {
                  const val = e.target.value;
                  setData((prev: any) => ({
                    ...prev,
                    ...(langTab === "zh" ? { titleZh: val } : langTab === "en" ? { titleEn: val } : { title: val }),
                  }));
                }}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-900 text-sm font-bold focus:border-azure-500 focus:bg-white focus:outline-none"
              />
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">Mô tả phụ:</label>
              <textarea
                rows={2}
                value={langTab === "zh" ? data.subtitleZh || "" : langTab === "en" ? data.subtitleEn || "" : data.subtitle || ""}
                onChange={(e) => {
                  const val = e.target.value;
                  setData((prev: any) => ({
                    ...prev,
                    ...(langTab === "zh" ? { subtitleZh: val } : langTab === "en" ? { subtitleEn: val } : { subtitle: val }),
                  }));
                }}
                className="w-full p-2.5 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 text-xs leading-relaxed focus:border-azure-500 focus:bg-white focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-slate-700 block mb-1">Ảnh minh họa trụ sở / hoạt động:</label>
            <div className="relative h-44 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 group">
              {data.storyImage ? (
                <Image
                  src={data.storyImage}
                  alt="About story"
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                  Chưa có ảnh minh họa
                </div>
              )}
              <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                <button
                  type="button"
                  onClick={() => setPickerOpen(true)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-azure-600 text-white font-bold text-xs shadow-md"
                >
                  <ImageIcon className="w-4 h-4" />
                  <span>Thay Đổi Ảnh Minh Họa</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Danh sách các đoạn văn bản */}
        <div className="space-y-3 pt-2">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-700">Các đoạn văn bản giới thiệu ({data.paragraphs?.length || 0} đoạn):</span>
            <button
              type="button"
              onClick={addParagraph}
              className="inline-flex items-center gap-1.5 text-xs text-azure-700 hover:text-azure-800 font-bold bg-azure-50 px-2.5 py-1 rounded-lg border border-azure-200"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Thêm đoạn mới</span>
            </button>
          </div>

          <div className="space-y-2">
            {(data.paragraphs || []).map((p: any, idx: number) => {
              const currentText = langTab === "zh" ? p.zh || "" : langTab === "en" ? p.en || "" : p.vi || "";
              return (
                <div key={idx} className="flex items-start gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200">
                  <span className="w-5 h-5 rounded-full bg-azure-100 text-azure-700 font-bold text-xs flex items-center justify-center shrink-0 mt-1">
                    {idx + 1}
                  </span>
                  <textarea
                    rows={3}
                    value={currentText}
                    onChange={(e) => updateParagraph(idx, e.target.value)}
                    className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded-lg p-2 focus:border-azure-500 focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() => removeParagraph(idx)}
                    className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                    title="Xóa đoạn này"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* MỤC 2: QUY MÔ VẬN TẢI & PHẠM VI PHỦ SÓNG */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-6 shadow-xs">
        <h3 className="font-bold text-base text-slate-950 pb-2 border-b border-slate-100">
          Mục 2: Quy Mô Vận Tải & Phạm Vi Phủ Sóng
        </h3>

        {/* 2.1 Phạm vi phủ sóng */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <span className="text-xs font-bold text-azure-700">2.1 Phạm Vi Phủ Sóng</span>
          <div className="space-y-2">
            {(data.scope?.bullets || DEFAULT_ABOUT_CONTENT.scope.bullets).map((b: string, idx: number) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={b}
                  onChange={(e) => {
                    const val = e.target.value;
                    setData((prev: any) => {
                      const cur = [...(prev.scope?.bullets || DEFAULT_ABOUT_CONTENT.scope.bullets)];
                      cur[idx] = val;
                      return { ...prev, scope: { ...(prev.scope || DEFAULT_ABOUT_CONTENT.scope), bullets: cur } };
                    });
                  }}
                  className="w-full p-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 focus:border-azure-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    setData((prev: any) => {
                      const cur = (prev.scope?.bullets || DEFAULT_ABOUT_CONTENT.scope.bullets).filter(
                        (_: any, i: number) => i !== idx
                      );
                      return { ...prev, scope: { ...(prev.scope || DEFAULT_ABOUT_CONTENT.scope), bullets: cur } };
                    });
                  }}
                  className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                  title="Xóa ý này"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              setData((prev: any) => {
                const cur = [...(prev.scope?.bullets || DEFAULT_ABOUT_CONTENT.scope.bullets), "Thêm tuyến/cửa khẩu phủ sóng mới..."];
                return { ...prev, scope: { ...(prev.scope || DEFAULT_ABOUT_CONTENT.scope), bullets: cur } };
              });
            }}
            className="inline-flex items-center gap-1.5 text-xs text-azure-700 hover:text-azure-800 font-bold bg-white px-2.5 py-1 rounded-lg border border-slate-300"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm gạch đầu dòng</span>
          </button>
        </div>

        {/* 2.2 Quy mô vận tải */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <span className="text-xs font-bold text-azure-700">2.2 Quy Mô Vận Tải (Đội xe 50 container)</span>
          <div className="space-y-2">
            {(data.fleetScale?.bullets || DEFAULT_ABOUT_CONTENT.fleetScale.bullets).map((b: string, idx: number) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={b}
                  onChange={(e) => {
                    const val = e.target.value;
                    setData((prev: any) => {
                      const cur = [...(prev.fleetScale?.bullets || DEFAULT_ABOUT_CONTENT.fleetScale.bullets)];
                      cur[idx] = val;
                      return { ...prev, fleetScale: { ...(prev.fleetScale || DEFAULT_ABOUT_CONTENT.fleetScale), bullets: cur } };
                    });
                  }}
                  className="w-full p-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 focus:border-azure-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    setData((prev: any) => {
                      const cur = (prev.fleetScale?.bullets || DEFAULT_ABOUT_CONTENT.fleetScale.bullets).filter(
                        (_: any, i: number) => i !== idx
                      );
                      return { ...prev, fleetScale: { ...(prev.fleetScale || DEFAULT_ABOUT_CONTENT.fleetScale), bullets: cur } };
                    });
                  }}
                  className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                  title="Xóa ý này"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              setData((prev: any) => {
                const cur = [...(prev.fleetScale?.bullets || DEFAULT_ABOUT_CONTENT.fleetScale.bullets), "Thêm phương tiện/đầu kéo mới..."];
                return { ...prev, fleetScale: { ...(prev.fleetScale || DEFAULT_ABOUT_CONTENT.fleetScale), bullets: cur } };
              });
            }}
            className="inline-flex items-center gap-1.5 text-xs text-azure-700 hover:text-azure-800 font-bold bg-white px-2.5 py-1 rounded-lg border border-slate-300"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm gạch đầu dòng</span>
          </button>
        </div>

        {/* 2.3 Thông quan hàng hóa */}
        <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
          <span className="text-xs font-bold text-azure-700">2.3 Thông Quan Hàng Hóa</span>
          <div className="space-y-2">
            {(data.customsCapability?.bullets || DEFAULT_ABOUT_CONTENT.customsCapability.bullets).map((b: string, idx: number) => (
              <div key={idx} className="flex items-center gap-2">
                <input
                  type="text"
                  value={b}
                  onChange={(e) => {
                    const val = e.target.value;
                    setData((prev: any) => {
                      const cur = [...(prev.customsCapability?.bullets || DEFAULT_ABOUT_CONTENT.customsCapability.bullets)];
                      cur[idx] = val;
                      return { ...prev, customsCapability: { ...(prev.customsCapability || DEFAULT_ABOUT_CONTENT.customsCapability), bullets: cur } };
                    });
                  }}
                  className="w-full p-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 focus:border-azure-500 focus:outline-none"
                />
                <button
                  type="button"
                  onClick={() => {
                    setData((prev: any) => {
                      const cur = (prev.customsCapability?.bullets || DEFAULT_ABOUT_CONTENT.customsCapability.bullets).filter(
                        (_: any, i: number) => i !== idx
                      );
                      return { ...prev, customsCapability: { ...(prev.customsCapability || DEFAULT_ABOUT_CONTENT.customsCapability), bullets: cur } };
                    });
                  }}
                  className="p-1 text-slate-400 hover:text-rose-600 transition-colors"
                  title="Xóa ý này"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={() => {
              setData((prev: any) => {
                const cur = [...(prev.customsCapability?.bullets || DEFAULT_ABOUT_CONTENT.customsCapability.bullets), "Thêm nghiệp vụ thông quan mới..."];
                return { ...prev, customsCapability: { ...(prev.customsCapability || DEFAULT_ABOUT_CONTENT.customsCapability), bullets: cur } };
              });
            }}
            className="inline-flex items-center gap-1.5 text-xs text-azure-700 hover:text-azure-800 font-bold bg-white px-2.5 py-1 rounded-lg border border-slate-300"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Thêm gạch đầu dòng</span>
          </button>
        </div>
      </div>

      {/* MỤC 3: TẦM NHÌN & SỨ MỆNH */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
        <h3 className="font-bold text-base text-slate-950 pb-2 border-b border-slate-100">
          Mục 3: Tầm Nhìn & Sứ Mệnh
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <label className="text-xs font-bold text-slate-700 block">Tầm nhìn chiến lược:</label>
            <textarea
              rows={3}
              value={data.visionMission?.visionDesc || DEFAULT_ABOUT_CONTENT.visionMission.visionDesc}
              onChange={(e) => {
                const val = e.target.value;
                setData((prev: any) => ({
                  ...prev,
                  visionMission: { ...(prev.visionMission || DEFAULT_ABOUT_CONTENT.visionMission), visionDesc: val },
                }));
              }}
              className="w-full p-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 leading-relaxed focus:border-azure-500 focus:outline-none"
            />
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2">
            <label className="text-xs font-bold text-slate-700 block">Sứ mệnh cốt lõi:</label>
            <textarea
              rows={3}
              value={data.visionMission?.missionDesc || DEFAULT_ABOUT_CONTENT.visionMission.missionDesc}
              onChange={(e) => {
                const val = e.target.value;
                setData((prev: any) => ({
                  ...prev,
                  visionMission: { ...(prev.visionMission || DEFAULT_ABOUT_CONTENT.visionMission), missionDesc: val },
                }));
              }}
              className="w-full p-2 rounded-lg bg-white border border-slate-200 text-xs text-slate-800 leading-relaxed focus:border-azure-500 focus:outline-none"
            />
          </div>
        </div>
      </div>

      {/* MỤC 4: HỆ SINH THÁI */}
      <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-4 shadow-xs">
        <h3 className="font-bold text-base text-slate-950 pb-2 border-b border-slate-100">
          Mục 4: Hệ Sinh Thái Khép Kín (3 Đơn Vị Thành Viên)
        </h3>

        <div className="space-y-4 pt-2">
          {(Array.isArray(data.ecosystem) ? data.ecosystem : DEFAULT_ABOUT_CONTENT.ecosystem).map((eco: any, idx: number) => (
            <div key={idx} className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-3">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 block mb-1">Tên đơn vị:</span>
                  <input
                    type="text"
                    value={eco.unit || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      setData((prev: any) => {
                        const cur = [...(Array.isArray(prev.ecosystem) ? prev.ecosystem : DEFAULT_ABOUT_CONTENT.ecosystem)];
                        cur[idx] = { ...cur[idx], unit: val };
                        return { ...prev, ecosystem: cur };
                      });
                    }}
                    className="font-bold text-sm text-slate-900 bg-white border border-slate-200 rounded p-1.5 w-full focus:border-azure-500 focus:outline-none"
                  />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-500 block mb-1">Vai trò / Phân cấp:</span>
                  <input
                    type="text"
                    value={eco.tag || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      setData((prev: any) => {
                        const cur = [...(Array.isArray(prev.ecosystem) ? prev.ecosystem : DEFAULT_ABOUT_CONTENT.ecosystem)];
                        cur[idx] = { ...cur[idx], tag: val };
                        return { ...prev, ecosystem: cur };
                      });
                    }}
                    className="text-xs text-slate-800 bg-white border border-slate-200 rounded p-1.5 w-full focus:border-azure-500 focus:outline-none"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <span className="text-[11px] font-bold text-slate-500 block mb-1">Vai trò trong hệ sinh thái:</span>
                  <textarea
                    rows={2}
                    value={eco.role || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      setData((prev: any) => {
                        const cur = [...(Array.isArray(prev.ecosystem) ? prev.ecosystem : DEFAULT_ABOUT_CONTENT.ecosystem)];
                        cur[idx] = { ...cur[idx], role: val };
                        return { ...prev, ecosystem: cur };
                      });
                    }}
                    className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded p-1.5 focus:border-azure-500 focus:outline-none"
                  />
                </div>
                <div>
                  <span className="text-[11px] font-bold text-slate-500 block mb-1">Thế mạnh trọng tâm:</span>
                  <textarea
                    rows={2}
                    value={eco.desc || ""}
                    onChange={(e) => {
                      const val = e.target.value;
                      setData((prev: any) => {
                        const cur = [...(Array.isArray(prev.ecosystem) ? prev.ecosystem : DEFAULT_ABOUT_CONTENT.ecosystem)];
                        cur[idx] = { ...cur[idx], desc: val };
                        return { ...prev, ecosystem: cur };
                      });
                    }}
                    className="w-full text-xs text-slate-800 bg-white border border-slate-200 rounded p-1.5 focus:border-azure-500 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <MediaPickerModal
        isOpen={pickerOpen}
        onClose={() => setPickerOpen(false)}
        onSelect={(url) => {
          setData((prev: any) => ({ ...prev, storyImage: url }));
          setPickerOpen(false);
        }}
      />
    </div>
  );
}
