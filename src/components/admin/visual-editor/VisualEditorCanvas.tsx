"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Camera,
  Plus,
  Trash2,
  ArrowLeft,
  ExternalLink,
  Phone,
  ArrowRight,
  ShieldCheck,
  CheckCircle,
  Truck,
  Building,
  FileCheck,
  Eye,
  Code,
  Layout,
  Award,
  TrendingUp,
  Users,
  Compass,
  Target,
  ChevronRight,
} from "lucide-react";
import { MediaPickerModal } from "@/components/admin/MediaPickerModal";
import { savePageSectionContent } from "@/modules/content/actions";
import { updateServiceContent } from "@/modules/services/actions";

interface VisualEditorCanvasProps {
  initialHero: any;
  initialWhyUs: any;
  initialStats: any;
  initialAbout: any;
  initialServices: any[];
  settings: Record<string, string>;
}

interface ParsedServiceContent {
  mainHeading: string;
  introParagraph: string;
  subHeading: string;
  bullets: string[];
  extraParagraphs: string[];
}

function parseServiceHtml(html: string): ParsedServiceContent {
  if (!html) {
    return {
      mainHeading: "Thế mạnh và năng lực dịch vụ",
      introParagraph: "Thông tin chi tiết về năng lực thực hiện dịch vụ.",
      subHeading: "Năng lực chuyên tuyến:",
      bullets: ["Điểm mạnh 1", "Điểm mạnh 2"],
      extraParagraphs: [],
    };
  }

  const h3Match = html.match(/<h3[^>]*>([\s\S]*?)<\/h3>/i);
  const mainHeading = h3Match ? h3Match[1].trim() : "Thế mạnh chuyên tuyến";

  const h4Match = html.match(/<h4[^>]*>([\s\S]*?)<\/h4>/i);
  const subHeading = h4Match ? h4Match[1].trim() : "Năng lực dịch vụ:";

  const pMatches = [...html.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)].map((m) => m[1].trim());
  const introParagraph = pMatches.length > 0 ? pMatches[0] : "";
  const extraParagraphs = pMatches.length > 1 ? pMatches.slice(1) : [];

  const liMatches = [...html.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].map((m) => m[1].trim());
  const bullets =
    liMatches.length > 0
      ? liMatches
      : ["Năng lực vận chuyển và thông quan nhanh chóng tại Cửa khẩu Móng Cái."];

  return {
    mainHeading,
    introParagraph,
    subHeading,
    bullets,
    extraParagraphs,
  };
}

function serializeServiceHtml(parsed: ParsedServiceContent): string {
  const bulletsHtml = parsed.bullets
    .filter((b) => b.trim().length > 0)
    .map((b) => `    <li>${b.trim()}</li>`)
    .join("\n");

  const extraHtml = (parsed.extraParagraphs || [])
    .filter((p) => p.trim().length > 0)
    .map((p) => `  <p>${p.trim()}</p>`)
    .join("\n");

  return `
  <h3>${parsed.mainHeading}</h3>
  <p>${parsed.introParagraph}</p>
  <h4>${parsed.subHeading}</h4>
  <ul>
${bulletsHtml}
  </ul>
${extraHtml}
  `.trim();
}

export function VisualEditorCanvas({
  initialHero,
  initialWhyUs,
  initialStats,
  initialAbout,
  initialServices,
  settings,
}: VisualEditorCanvasProps) {
  // Page selector
  const [selectedPage, setSelectedPage] = useState<string>("home");
  const [locale, setLocale] = useState<"vi" | "en" | "zh">("vi");

  // State for all editable data
  const [hero, setHero] = useState(initialHero);
  const [whyUs, setWhyUs] = useState(initialWhyUs);
  const [stats, setStats] = useState(initialStats);
  const [about, setAbout] = useState(initialAbout);
  const [services, setServices] = useState<any[]>(initialServices);

  // Modal image picker
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [activeImageTarget, setActiveImageTarget] = useState<string>("");

  // Saving state
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Service Content Mode: visual vs code
  const [serviceContentMode, setServiceContentMode] = useState<"visual" | "code">("visual");

  // Active current service if page is service
  const currentService = services.find((s) => s.slug === selectedPage);

  // Active parsed service content
  const activeServiceContentRaw = currentService
    ? locale === "zh"
      ? currentService.fullContentZh || ""
      : locale === "en"
      ? currentService.fullContentEn || ""
      : currentService.fullContent || ""
    : "";

  const [parsedContent, setParsedContent] = useState<ParsedServiceContent>(() =>
    parseServiceHtml(activeServiceContentRaw)
  );

  // Sync parsed content when service or locale changes
  useEffect(() => {
    if (currentService) {
      const raw =
        locale === "zh"
          ? currentService.fullContentZh || ""
          : locale === "en"
          ? currentService.fullContentEn || ""
          : currentService.fullContent || "";
      setParsedContent(parseServiceHtml(raw));
    }
  }, [selectedPage, locale]);

  // Update parsed service content and sync raw HTML
  const updateParsedContent = (updater: (prev: ParsedServiceContent) => ParsedServiceContent) => {
    setParsedContent((prev) => {
      const next = updater(prev);
      const newHtml = serializeServiceHtml(next);

      setServices((prevServices) =>
        prevServices.map((s) => {
          if (s.slug === currentService?.slug) {
            if (locale === "zh") return { ...s, fullContentZh: newHtml };
            if (locale === "en") return { ...s, fullContentEn: newHtml };
            return { ...s, fullContent: newHtml };
          }
          return s;
        })
      );
      return next;
    });
  };

  // Save changes
  const handlePublish = async () => {
    setSaving(true);
    setNotification(null);

    try {
      if (selectedPage === "home") {
        await Promise.all([
          savePageSectionContent("content_home_hero", hero, "Nội dung Hero Section"),
          savePageSectionContent("content_home_why_us", whyUs, "Nội dung Why Us Section"),
          savePageSectionContent("content_home_stats", stats, "Nội dung 4 Big Numbers"),
        ]);
        setNotification({
          type: "success",
          text: "Đã lưu và xuất bản thay đổi Trang Chủ lên website chính!",
        });
      } else if (selectedPage === "about") {
        await Promise.all([
          savePageSectionContent("content_about", about, "Nội dung Trang Giới Thiệu"),
          savePageSectionContent("content_home_stats", stats, "Nội dung 4 Big Numbers"),
        ]);
        setNotification({
          type: "success",
          text: "Đã lưu và xuất bản thay đổi Trang Giới Thiệu lên website chính!",
        });
      } else if (currentService) {
        const res = await updateServiceContent(currentService.slug, {
          title: currentService.title,
          titleEn: currentService.titleEn,
          titleZh: currentService.titleZh,
          shortDesc: currentService.shortDesc,
          shortDescEn: currentService.shortDescEn,
          shortDescZh: currentService.shortDescZh,
          bannerImage: currentService.bannerImage,
          fullContent: currentService.fullContent,
          fullContentEn: currentService.fullContentEn,
          fullContentZh: currentService.fullContentZh,
        });

        if (res.success) {
          setNotification({
            type: "success",
            text: `Đã lưu và xuất bản dịch vụ "${currentService.title}" lên website chính!`,
          });
        } else {
          setNotification({ type: "error", text: res.message });
        }
      }
    } catch (err) {
      setNotification({
        type: "error",
        text: "Lỗi kết nối khi lưu: " + (err instanceof Error ? err.message : String(err)),
      });
    } finally {
      setSaving(false);
      setTimeout(() => setNotification(null), 5000);
    }
  };

  // Callback when an image is picked in MediaPickerModal
  const handleImageSelected = (url: string) => {
    if (activeImageTarget === "heroBg") {
      setHero({ ...hero, bgImage: url });
    } else if (activeImageTarget === "whyUsImg") {
      setWhyUs({ ...whyUs, image: url });
    } else if (activeImageTarget === "aboutImg") {
      setAbout({ ...about, storyImage: url });
    } else if (activeImageTarget.startsWith("service_")) {
      const slug = activeImageTarget.replace("service_", "");
      setServices((prev) =>
        prev.map((s) => (s.slug === slug ? { ...s, bannerImage: url } : s))
      );
    }
  };

  // Helper to open media picker for target
  const triggerImagePicker = (targetKey: string) => {
    setActiveImageTarget(targetKey);
    setImageModalOpen(true);
  };

  const statIcons = [Award, TrendingUp, Users, ShieldCheck];

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col">
      {/* 1. THANH ĐIỀU KHIỂN NỔI CỐ ĐỊNH Ở ĐỈNH (TOP COMMAND BAR) */}
      <header className="sticky top-0 z-50 bg-slate-950/95 backdrop-blur-md border-b border-slate-800 px-4 py-3 flex flex-wrap items-center justify-between gap-3 shadow-md">
        <div className="flex items-center gap-3">
          <Link
            href="/admin/content"
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-300 hover:text-white text-xs font-semibold transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Thoát Trình Sửa</span>
          </Link>

          {/* Bộ chọn trang cần chỉnh sửa */}
          <div className="flex items-center gap-2">
            <span className="text-[11px] font-bold text-slate-400 hidden sm:inline">Trang:</span>
            <select
              value={selectedPage}
              onChange={(e) => setSelectedPage(e.target.value)}
              className="px-3 py-1.5 bg-slate-900 border border-azure-700/60 rounded-xl text-xs font-bold text-azure-300 focus:outline-none focus:ring-2 focus:ring-azure-500 cursor-pointer shadow-xs"
            >
              <optgroup label="Các Trang Chính">
                <option value="home">Trang Chủ (Homepage)</option>
                <option value="about">Trang Giới Thiệu (/about)</option>
              </optgroup>
              <optgroup label="Từng Trang Dịch Vụ Cụ Thể">
                {services.map((s) => (
                  <option key={s.slug} value={s.slug}>
                    Dịch vụ: {s.title}
                  </option>
                ))}
              </optgroup>
            </select>
          </div>
        </div>

        {/* Chuyển đổi ngôn ngữ đang sửa */}
        <div className="flex items-center gap-1 bg-slate-900 p-1 rounded-xl border border-slate-800 text-xs">
          <button
            type="button"
            onClick={() => setLocale("vi")}
            className={`px-3 py-1 rounded-lg font-bold transition-colors ${
              locale === "vi" ? "bg-azure-600 text-white shadow-xs" : "text-slate-400 hover:text-white"
            }`}
          >
            Tiếng Việt
          </button>
          <button
            type="button"
            onClick={() => setLocale("en")}
            className={`px-3 py-1 rounded-lg font-bold transition-colors ${
              locale === "en" ? "bg-azure-600 text-white shadow-xs" : "text-slate-400 hover:text-white"
            }`}
          >
            English
          </button>
          <button
            type="button"
            onClick={() => setLocale("zh")}
            className={`px-3 py-1 rounded-lg font-bold transition-colors ${
              locale === "zh" ? "bg-azure-600 text-white shadow-xs" : "text-slate-400 hover:text-white"
            }`}
          >
            中文
          </button>
        </div>

        {/* Cụm nút hành động Lưu & Xem trước */}
        <div className="flex items-center gap-2">
          <Link
            href={
              selectedPage === "home"
                ? "/"
                : selectedPage === "about"
                ? "/about"
                : `/services/${selectedPage}`
            }
            target="_blank"
            className="hidden md:flex items-center gap-1 px-3 py-2 text-xs text-slate-400 hover:text-white transition-colors"
          >
            <span>Xem Web Thật</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            type="button"
            onClick={handlePublish}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gold-500 hover:bg-gold-400 text-slate-950 font-black text-xs transition-colors shadow-md disabled:opacity-50 whitespace-nowrap"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Đang xuất bản...</span>
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                <span>LƯU LÊN WEBSITE</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Thông báo kết quả lưu */}
      {notification && (
        <div
          className={`sticky top-[58px] z-40 px-6 py-2.5 flex items-center justify-center gap-2 text-xs font-bold shadow-md transition-colors ${
            notification.type === "success"
              ? "bg-emerald-600 text-white"
              : "bg-rose-600 text-white"
          }`}
        >
          {notification.type === "success" ? (
            <CheckCircle2 className="w-4 h-4 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 shrink-0" />
          )}
          <span>{notification.text}</span>
        </div>
      )}

      {/* Thanh nhắc nhở Click-to-Edit */}
      <div className="bg-azure-950/80 border-b border-azure-800/80 px-4 py-2 text-center text-xs text-azure-300 flex items-center justify-center gap-2">
        <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
        <span>
          <strong>Chế độ Trực Quan:</strong> Nhấp chuột trực tiếp vào dòng chữ bất kỳ để gõ sửa, nhấp vào nút máy ảnh để đổi hình ảnh.
        </span>
      </div>

      {/* MÔ PHỎNG HEADER CỦA WEBSITE CHÍNH */}
      <div className="bg-slate-950 border-b border-slate-800 text-white">
        {/* Topbar */}
        <div className="border-b border-slate-800/60 py-2 px-4 sm:px-8 text-xs text-slate-400 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1.5">
              <Phone className="w-3.5 h-3.5 text-gold-400" />
              <span>Hotline 24/7: {settings.hotline || "0904.382.268"}</span>
            </span>
            <span className="hidden md:inline">
              Văn phòng: KĐT Vinhomes Golden Avenue, Cửa khẩu Bắc Luân 2, TP. Móng Cái
            </span>
          </div>
          <span className="text-azure-400 font-semibold">Công ty TNHH Logistics GT</span>
        </div>

        {/* Navbar */}
        <div className="max-w-7xl mx-auto px-4 sm:px-8 py-3.5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-azure-600 text-white flex items-center justify-center font-black text-sm">
              GT
            </div>
            <div>
              <span className="font-black text-sm sm:text-base text-white tracking-tight block">
                GT LOGISTICS
              </span>
              <span className="text-[10px] text-slate-400 block -mt-1">
                MONG CAI BORDER GATE
              </span>
            </div>
          </div>

          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-300">
            <button
              type="button"
              onClick={() => setSelectedPage("home")}
              className={`hover:text-gold-400 transition-colors ${
                selectedPage === "home" ? "text-gold-400 font-black border-b-2 border-gold-400 pb-1" : ""
              }`}
            >
              Trang Chủ
            </button>
            <button
              type="button"
              onClick={() => setSelectedPage("about")}
              className={`hover:text-gold-400 transition-colors ${
                selectedPage === "about" ? "text-gold-400 font-black border-b-2 border-gold-400 pb-1" : ""
              }`}
            >
              Giới Thiệu
            </button>
            <div className="relative group">
              <span
                className={`cursor-pointer hover:text-gold-400 transition-colors ${
                  currentService ? "text-gold-400 font-black border-b-2 border-gold-400 pb-1" : ""
                }`}
              >
                Dịch Vụ
              </span>
            </div>
            <span className="text-slate-500">Tra Cứu Vận Đơn</span>
            <span className="text-slate-500">Tin Tức</span>
            <span className="text-slate-500">Liên Hệ</span>
          </nav>

          <div className="flex items-center gap-2">
            <span className="px-3 py-1.5 rounded-lg bg-azure-600 text-white text-xs font-bold">
              Báo Giá Nhanh
            </span>
          </div>
        </div>
      </div>

      {/* 2. MÀN HÌNH MÔ PHỎNG NGUYÊN BẢN GIAO DIỆN WEBSITE CHÍNH */}
      <main className="flex-1 bg-white text-slate-900 overflow-x-hidden">
        {/* ============================================================== */}
        {/* VIEW 1: TRANG CHỦ (HOMEPAGE)                                   */}
        {/* ============================================================== */}
        {selectedPage === "home" && (
          <div className="space-y-0">
            {/* HERO SECTION TRANG CHỦ */}
            <section className="relative bg-slate-950 text-white overflow-hidden py-20 sm:py-24 lg:py-28 border-b border-slate-800 group/hero">
              {/* Nút đổi ảnh nền Hero */}
              <div className="absolute top-4 right-4 z-20">
                <button
                  type="button"
                  onClick={() => triggerImagePicker("heroBg")}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900/90 hover:bg-azure-600 text-white text-xs font-bold border border-slate-700 shadow-sm transition-colors"
                >
                  <Camera className="w-4 h-4 text-gold-400" />
                  <span>Đổi ảnh nền Hero</span>
                </button>
              </div>

              {/* Ảnh nền */}
              <div
                className="absolute inset-0 z-0 opacity-35 bg-cover bg-center pointer-events-none"
                style={{
                  backgroundImage: `url('${hero.bgImage || "/images/vietphuc/hero_office_panoramic.webp"}')`,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/20 z-0 pointer-events-none" />

              <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl">
                  {/* Tiêu đề thương hiệu (Click-to-edit) */}
                  <div className="space-y-3">
                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none text-white flex items-center gap-3">
                      <input
                        type="text"
                        value={hero.titleGt || "GT"}
                        onChange={(e) => setHero({ ...hero, titleGt: e.target.value })}
                        className="bg-transparent text-azure-400 hover:outline hover:outline-dashed hover:outline-azure-400 rounded px-1 w-24 font-black"
                        title="Nhấp để sửa khối chữ 1"
                      />
                      <input
                        type="text"
                        value={hero.titleLogistics || "LOGISTICS"}
                        onChange={(e) => setHero({ ...hero, titleLogistics: e.target.value })}
                        className="bg-transparent text-gold-400 hover:outline hover:outline-dashed hover:outline-gold-400 rounded px-1 flex-1 font-black"
                        title="Nhấp để sửa khối chữ 2"
                      />
                    </h1>

                    {/* Slogan (Click-to-edit) */}
                    <div>
                      <input
                        type="text"
                        value={
                          locale === "zh"
                            ? hero.sloganZh || ""
                            : locale === "en"
                            ? hero.sloganEn || ""
                            : hero.slogan || ""
                        }
                        onChange={(e) => {
                          const val = e.target.value;
                          setHero((prev: any) => ({
                            ...prev,
                            ...(locale === "zh"
                              ? { sloganZh: val }
                              : locale === "en"
                              ? { sloganEn: val }
                              : { slogan: val }),
                          }));
                        }}
                        placeholder="Nhập khẩu hiệu doanh nghiệp..."
                        className="w-full bg-transparent text-lg sm:text-xl lg:text-2xl font-bold text-slate-100 tracking-wide hover:outline hover:outline-dashed hover:outline-azure-400 rounded px-1"
                        title="Nhấp để sửa khẩu hiệu"
                      />
                    </div>
                  </div>

                  <div className="my-8 sm:my-9 h-1 w-24 bg-gradient-to-r from-azure-400 to-gold-400 rounded-full" />

                  {/* Bullet points (Click-to-edit trực tiếp) */}
                  <div className="space-y-4">
                    <ul className="space-y-4 text-sm sm:text-base text-slate-200 leading-relaxed">
                      {hero.bullets.map((b: any, idx: number) => {
                        const currentText =
                          locale === "zh" ? b.zh || "" : locale === "en" ? b.en || "" : b.vi || "";

                        return (
                          <li key={idx} className="flex items-start gap-3 group/bullet">
                            <span className="w-2 h-2 rounded-full bg-gold-400 shrink-0 mt-2.5" />
                            <div className="flex-1 flex items-start gap-2">
                              <textarea
                                rows={2}
                                value={currentText}
                                onChange={(e) => {
                                  const text = e.target.value;
                                  setHero((prev: any) => {
                                    const nextB = [...prev.bullets];
                                    const cur = { ...nextB[idx] };
                                    if (locale === "zh") cur.zh = text;
                                    else if (locale === "en") cur.en = text;
                                    else cur.vi = text;
                                    nextB[idx] = cur;
                                    return { ...prev, bullets: nextB };
                                  });
                                }}
                                className="w-full bg-transparent text-slate-200 hover:outline hover:outline-dashed hover:outline-azure-400 rounded px-1.5 py-0.5 resize-none text-sm sm:text-base leading-relaxed"
                                title="Nhấp để sửa dòng này"
                              />
                              <button
                                type="button"
                                onClick={() => {
                                  setHero((prev: any) => ({
                                    ...prev,
                                    bullets: prev.bullets.filter((_: any, i: number) => i !== idx),
                                  }));
                                }}
                                className="opacity-0 group-hover/bullet:opacity-100 p-1 text-slate-500 hover:text-rose-400 transition-opacity"
                                title="Xóa dòng này"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </li>
                        );
                      })}
                    </ul>

                    {/* Nút thêm dòng bullet */}
                    <button
                      type="button"
                      onClick={() => {
                        setHero((prev: any) => ({
                          ...prev,
                          bullets: [
                            ...prev.bullets,
                            {
                              vi: "Thêm điểm mạnh năng lực mới tại Cửa khẩu Móng Cái...",
                              en: "New capability highlight...",
                              zh: "新增重点优势内容...",
                            },
                          ],
                        }));
                      }}
                      className="inline-flex items-center gap-1.5 text-xs text-gold-400 hover:text-gold-300 font-bold bg-slate-900/90 px-3 py-1.5 rounded-lg border border-slate-800 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm gạch đầu dòng mới</span>
                    </button>
                  </div>
                </div>
              </div>
            </section>

            {/* 4 BIG NUMBERS TRANG CHỦ (STATS COUNTER) */}
            <section className="bg-slate-950 text-white py-10 sm:py-12 border-b border-slate-800">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs font-bold text-gold-400 bg-gold-950/60 px-2.5 py-1 rounded-md border border-gold-800/60">
                    4 Con Số Năng Lực (Click-to-Edit trực tiếp số và chữ)
                  </span>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {stats.map((s: any, idx: number) => {
                    const Icon = statIcons[idx] || Award;
                    const labelVal =
                      locale === "zh" ? s.labelZh || "" : locale === "en" ? s.labelEn || "" : s.label || "";
                    const subVal =
                      locale === "zh" ? s.subZh || "" : locale === "en" ? s.subEn || "" : s.sub || "";

                    return (
                      <div
                        key={idx}
                        className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-gold-500/60 transition-colors flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="w-8 h-8 rounded-lg bg-azure-600/20 text-azure-400 flex items-center justify-center">
                              <Icon className="w-4 h-4" />
                            </div>
                            <input
                              type="text"
                              value={s.unit || ""}
                              onChange={(e) => {
                                const val = e.target.value;
                                setStats((prev: any[]) => {
                                  const next = [...prev];
                                  next[idx] = { ...next[idx], unit: val };
                                  return next;
                                });
                              }}
                              className="w-20 bg-transparent text-right font-mono text-[11px] text-slate-400 hover:outline hover:outline-dashed hover:outline-gold-400 rounded px-1"
                              title="Sửa đơn vị (unit)"
                            />
                          </div>
                          <input
                            type="text"
                            value={s.num || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setStats((prev: any[]) => {
                                const next = [...prev];
                                next[idx] = { ...next[idx], num: val };
                                return next;
                              });
                            }}
                            className="w-full bg-transparent text-2xl sm:text-3xl font-black text-white font-mono hover:outline hover:outline-dashed hover:outline-gold-400 rounded px-1"
                            title="Sửa con số chính"
                          />
                          <input
                            type="text"
                            value={labelVal}
                            onChange={(e) => {
                              const text = e.target.value;
                              setStats((prev: any[]) => {
                                const next = [...prev];
                                const cur = { ...next[idx] };
                                if (locale === "zh") cur.labelZh = text;
                                else if (locale === "en") cur.labelEn = text;
                                else cur.label = text;
                                next[idx] = cur;
                                return next;
                              });
                            }}
                            className="w-full bg-transparent text-xs font-bold text-azure-300 mt-1 hover:outline hover:outline-dashed hover:outline-azure-400 rounded px-1"
                            title="Sửa tiêu đề con số"
                          />
                        </div>
                        <input
                          type="text"
                          value={subVal}
                          onChange={(e) => {
                            const text = e.target.value;
                            setStats((prev: any[]) => {
                              const next = [...prev];
                              const cur = { ...next[idx] };
                              if (locale === "zh") cur.subZh = text;
                              else if (locale === "en") cur.subEn = text;
                              else cur.sub = text;
                              next[idx] = cur;
                              return next;
                            });
                          }}
                          className="w-full bg-transparent text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-800 hover:outline hover:outline-dashed hover:outline-azure-400 rounded px-1 truncate"
                          title="Sửa dòng mô tả phụ"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* WHY CHOOSE US (VÌ SAO CHỌN GT LOGISTICS) */}
            <section className="py-16 sm:py-24 bg-white text-slate-900 border-b border-slate-200/80">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
                  {/* Cột trái: 4 thẻ ưu thế cạnh tranh (Click-to-edit) */}
                  <div className="lg:col-span-7 order-2 lg:order-1 space-y-4">
                    <span className="text-xs font-bold text-azure-700 bg-azure-50 px-2.5 py-1 rounded-md border border-azure-200">
                      4 Thẻ Điểm Mạnh Cạnh Tranh (Nhấp trực tiếp để sửa)
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {whyUs.items.map((item: any, idx: number) => {
                        const titleVal =
                          locale === "zh"
                            ? item.titleZh || ""
                            : locale === "en"
                            ? item.titleEn || ""
                            : item.title || "";
                        const descVal =
                          locale === "zh"
                            ? item.descZh || ""
                            : locale === "en"
                            ? item.descEn || ""
                            : item.desc || "";

                        return (
                          <div
                            key={idx}
                            className="p-4 rounded-xl bg-slate-50 border border-slate-200 hover:border-azure-400 transition-colors space-y-1.5"
                          >
                            <div className="flex items-center gap-2">
                              <ShieldCheck className="w-4 h-4 text-azure-600 shrink-0" />
                              <input
                                type="text"
                                value={titleVal}
                                onChange={(e) => {
                                  const text = e.target.value;
                                  setWhyUs((prev: any) => {
                                    const nextI = [...prev.items];
                                    const cur = { ...nextI[idx] };
                                    if (locale === "zh") cur.titleZh = text;
                                    else if (locale === "en") cur.titleEn = text;
                                    else cur.title = text;
                                    nextI[idx] = cur;
                                    return { ...prev, items: nextI };
                                  });
                                }}
                                className="w-full bg-transparent font-bold text-xs sm:text-sm text-slate-900 hover:outline hover:outline-dashed hover:outline-azure-400 rounded px-1"
                                title="Nhấp để sửa tiêu đề thẻ"
                              />
                            </div>
                            <textarea
                              rows={2}
                              value={descVal}
                              onChange={(e) => {
                                const text = e.target.value;
                                setWhyUs((prev: any) => {
                                  const nextI = [...prev.items];
                                  const cur = { ...nextI[idx] };
                                  if (locale === "zh") cur.descZh = text;
                                  else if (locale === "en") cur.descEn = text;
                                  else cur.desc = text;
                                  nextI[idx] = cur;
                                  return { ...prev, items: nextI };
                                });
                              }}
                              className="w-full bg-transparent text-[11px] text-slate-600 leading-relaxed hover:outline hover:outline-dashed hover:outline-azure-400 rounded px-1 resize-none"
                              title="Nhấp để sửa mô tả thẻ"
                            />
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Cột phải: Tiêu đề & Ảnh minh họa (Click-to-edit) */}
                  <div className="lg:col-span-5 order-1 lg:order-2 space-y-6">
                    <div>
                      <div className="h-1 w-12 bg-gold-500 rounded-full mb-4" />
                      <input
                        type="text"
                        value={
                          locale === "zh"
                            ? whyUs.titleZh || ""
                            : locale === "en"
                            ? whyUs.titleEn || ""
                            : whyUs.title || ""
                        }
                        onChange={(e) => {
                          const val = e.target.value;
                          setWhyUs((prev: any) => ({
                            ...prev,
                            ...(locale === "zh"
                              ? { titleZh: val }
                              : locale === "en"
                              ? { titleEn: val }
                              : { title: val }),
                          }));
                        }}
                        className="w-full bg-transparent text-2xl sm:text-3xl font-black text-slate-950 tracking-tight hover:outline hover:outline-dashed hover:outline-azure-400 rounded px-1"
                        title="Nhấp để sửa tiêu đề section"
                      />
                      <textarea
                        rows={2}
                        value={
                          locale === "zh"
                            ? whyUs.descriptionZh || ""
                            : locale === "en"
                            ? whyUs.descriptionEn || ""
                            : whyUs.description || ""
                        }
                        onChange={(e) => {
                          const val = e.target.value;
                          setWhyUs((prev: any) => ({
                            ...prev,
                            ...(locale === "zh"
                              ? { descriptionZh: val }
                              : locale === "en"
                              ? { descriptionEn: val }
                              : { description: val }),
                          }));
                        }}
                        className="w-full bg-transparent mt-3 text-slate-600 text-sm leading-relaxed hover:outline hover:outline-dashed hover:outline-azure-400 rounded px-1 resize-none"
                        title="Nhấp để sửa mô tả section"
                      />
                    </div>

                    {/* Ảnh Minh Họa Trụ Sở (Nhấp để đổi ảnh) */}
                    <div
                      onClick={() => triggerImagePicker("whyUsImg")}
                      className="group/img relative h-64 sm:h-72 rounded-2xl overflow-hidden shadow-xs border-2 border-dashed border-azure-400 cursor-pointer"
                      title="Nhấp vào đây để đổi ảnh minh họa"
                    >
                      <Image
                        src={whyUs.image || "/images/vietphuc/boardroom_conference.webp"}
                        alt="Why us illustration"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-azure-600 text-white text-xs font-bold shadow-md">
                          <Camera className="w-4 h-4" />
                          <span>Nhấp để thay đổi ảnh này</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 2: TRANG GIỚI THIỆU (/about)                              */}
        {/* ============================================================== */}
        {selectedPage === "about" && (
          <div className="space-y-0">
            {/* Banner đầu trang chuẩn phong cách watermark GT Logistics */}
            <div className="relative bg-slate-950 text-white py-16 sm:py-20 px-4 sm:px-8 border-b border-slate-800 overflow-hidden">
              <div className="absolute right-4 sm:right-8 lg:right-16 top-1/2 -translate-y-1/2 w-64 sm:w-80 lg:w-96 h-40 sm:h-52 lg:h-60 pointer-events-none opacity-15 select-none">
                <Image
                  src="/images/gt_logo.webp"
                  alt="GT Logistics Watermark"
                  fill
                  className="object-contain object-right"
                  priority
                />
              </div>

              <div className="relative z-10 max-w-7xl mx-auto space-y-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
                  <span>Trang chủ</span>
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span className="text-azure-400 font-medium">Giới thiệu</span>
                </div>

                <input
                  type="text"
                  value={
                    locale === "zh"
                      ? about.titleZh || ""
                      : locale === "en"
                      ? about.titleEn || ""
                      : about.title || ""
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    setAbout((prev: any) => ({
                      ...prev,
                      ...(locale === "zh" ? { titleZh: val } : locale === "en" ? { titleEn: val } : { title: val }),
                    }));
                  }}
                  className="w-full bg-transparent text-2xl sm:text-4xl font-black text-white hover:outline hover:outline-dashed hover:outline-azure-400 rounded px-1"
                  title="Nhấp để sửa tiêu đề chính trang Giới thiệu"
                />
                <textarea
                  rows={2}
                  value={
                    locale === "zh"
                      ? about.subtitleZh || ""
                      : locale === "en"
                      ? about.subtitleEn || ""
                      : about.subtitle || ""
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    setAbout((prev: any) => ({
                      ...prev,
                      ...(locale === "zh"
                        ? { subtitleZh: val }
                        : locale === "en"
                        ? { subtitleEn: val }
                        : { subtitle: val }),
                    }));
                  }}
                  className="w-full bg-transparent text-xs sm:text-sm text-slate-300 hover:outline hover:outline-dashed hover:outline-azure-400 rounded px-1 resize-none"
                  title="Nhấp để sửa mô tả phụ"
                />
              </div>
            </div>

            {/* 4 BIG NUMBERS TRANG GIỚI THIỆU (ĐẨY LÊN ĐẦU TRANG THEO YÊU CẦU) */}
            <section className="bg-slate-950 text-white py-10 sm:py-12 border-b border-slate-800">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="mb-4 flex items-center justify-between">
                  <span className="text-xs font-bold text-gold-400 bg-gold-950/60 px-2.5 py-1 rounded-md border border-gold-800/60">
                    4 Con Số Năng Lực Đầu Trang (Click-to-Edit)
                  </span>
                </div>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                  {stats.map((s: any, idx: number) => {
                    const Icon = statIcons[idx] || Award;
                    const labelVal =
                      locale === "zh" ? s.labelZh || "" : locale === "en" ? s.labelEn || "" : s.label || "";
                    const subVal =
                      locale === "zh" ? s.subZh || "" : locale === "en" ? s.subEn || "" : s.sub || "";

                    return (
                      <div
                        key={idx}
                        className="p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-gold-500/60 transition-colors flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <div className="w-8 h-8 rounded-lg bg-azure-600/20 text-azure-400 flex items-center justify-center">
                              <Icon className="w-4 h-4" />
                            </div>
                            <input
                              type="text"
                              value={s.unit || ""}
                              onChange={(e) => {
                                const val = e.target.value;
                                setStats((prev: any[]) => {
                                  const next = [...prev];
                                  next[idx] = { ...next[idx], unit: val };
                                  return next;
                                });
                              }}
                              className="w-20 bg-transparent text-right font-mono text-[11px] text-slate-400 hover:outline hover:outline-dashed hover:outline-gold-400 rounded px-1"
                              title="Sửa đơn vị (unit)"
                            />
                          </div>
                          <input
                            type="text"
                            value={s.num || ""}
                            onChange={(e) => {
                              const val = e.target.value;
                              setStats((prev: any[]) => {
                                const next = [...prev];
                                next[idx] = { ...next[idx], num: val };
                                return next;
                              });
                            }}
                            className="w-full bg-transparent text-2xl sm:text-3xl font-black text-white font-mono hover:outline hover:outline-dashed hover:outline-gold-400 rounded px-1"
                            title="Sửa con số chính"
                          />
                          <input
                            type="text"
                            value={labelVal}
                            onChange={(e) => {
                              const text = e.target.value;
                              setStats((prev: any[]) => {
                                const next = [...prev];
                                const cur = { ...next[idx] };
                                if (locale === "zh") cur.labelZh = text;
                                else if (locale === "en") cur.labelEn = text;
                                else cur.label = text;
                                next[idx] = cur;
                                return next;
                              });
                            }}
                            className="w-full bg-transparent text-xs font-bold text-azure-300 mt-1 hover:outline hover:outline-dashed hover:outline-azure-400 rounded px-1"
                            title="Sửa tiêu đề con số"
                          />
                        </div>
                        <input
                          type="text"
                          value={subVal}
                          onChange={(e) => {
                            const text = e.target.value;
                            setStats((prev: any[]) => {
                              const next = [...prev];
                              const cur = { ...next[idx] };
                              if (locale === "zh") cur.subZh = text;
                              else if (locale === "en") cur.subEn = text;
                              else cur.sub = text;
                              next[idx] = cur;
                              return next;
                            });
                          }}
                          className="w-full bg-transparent text-[11px] text-slate-400 mt-3 pt-2 border-t border-slate-800 hover:outline hover:outline-dashed hover:outline-azure-400 rounded px-1 truncate"
                          title="Sửa dòng mô tả phụ"
                        />
                      </div>
                    );
                  })}
                </div>
              </div>
            </section>

            {/* Nội dung câu chuyện & Ảnh minh họa (Bố cục 2 cột cân bằng) */}
            <section className="py-16 bg-white border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                  {/* Cột trái: Các đoạn văn bản */}
                  <div className="lg:col-span-7 space-y-4">
                    <span className="text-xs font-bold text-azure-700 bg-azure-50 px-2.5 py-1 rounded-md border border-azure-200">
                      Các đoạn văn giới thiệu năng lực (Nhấp trực tiếp để sửa)
                    </span>

                    <div className="space-y-3">
                      {about.paragraphs.map((p: any, idx: number) => {
                        const currentText =
                          locale === "zh" ? p.zh || "" : locale === "en" ? p.en || "" : p.vi || "";

                        return (
                          <div key={idx} className="relative group/p flex items-start gap-2">
                            <span className="w-5 h-5 rounded-full bg-azure-500/20 text-azure-600 flex items-center justify-center font-bold text-xs shrink-0 mt-1">
                              {idx + 1}
                            </span>
                            <textarea
                              rows={3}
                              value={currentText}
                              onChange={(e) => {
                                const text = e.target.value;
                                setAbout((prev: any) => {
                                  const nextP = [...prev.paragraphs];
                                  const cur = { ...nextP[idx] };
                                  if (locale === "zh") cur.zh = text;
                                  else if (locale === "en") cur.en = text;
                                  else cur.vi = text;
                                  nextP[idx] = cur;
                                  return { ...prev, paragraphs: nextP };
                                });
                              }}
                              className="w-full bg-slate-50 hover:bg-white text-slate-700 hover:outline hover:outline-dashed hover:outline-azure-400 rounded p-2 text-sm leading-relaxed border border-slate-200"
                              title="Nhấp để sửa đoạn văn này"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setAbout((prev: any) => ({
                                  ...prev,
                                  paragraphs: prev.paragraphs.filter((_: any, i: number) => i !== idx),
                                }));
                              }}
                              className="opacity-0 group-hover/p:opacity-100 p-1 text-slate-400 hover:text-rose-500 transition-opacity"
                              title="Xóa đoạn này"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setAbout((prev: any) => ({
                          ...prev,
                          paragraphs: [
                            ...prev.paragraphs,
                            {
                              vi: "Thêm đoạn văn bản mới giới thiệu về năng lực vận tải và thông quan...",
                              en: "New paragraph...",
                              zh: "新增介绍段落...",
                            },
                          ],
                        }));
                      }}
                      className="inline-flex items-center gap-1.5 text-xs text-azure-600 hover:text-azure-700 font-bold bg-azure-50 px-3 py-1.5 rounded-lg border border-azure-200 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      <span>Thêm đoạn văn mới</span>
                    </button>
                  </div>

                  {/* Cột phải: Ảnh minh họa */}
                  <div className="lg:col-span-5">
                    <div
                      onClick={() => triggerImagePicker("aboutImg")}
                      className="group/img relative h-72 sm:h-80 rounded-2xl overflow-hidden shadow-xs border-2 border-dashed border-azure-400 cursor-pointer"
                      title="Nhấp vào đây để đổi ảnh minh họa trụ sở"
                    >
                      <Image
                        src={about.storyImage || "/images/vietphuc/hero_office_panoramic.webp"}
                        alt="About illustration"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-azure-600 text-white text-xs font-bold shadow-md">
                          <Camera className="w-4 h-4" />
                          <span>Nhấp để thay đổi ảnh này</span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 3: TRANG DỊCH VỤ CỤ THỂ (SERVICE DETAIL)                   */}
        {/* ============================================================== */}
        {currentService && (
          <div className="space-y-0">
            {/* Banner đầu trang Dịch vụ: Chuẩn Breadcrumbs + Watermark GT Logistics */}
            <div className="relative bg-slate-950 text-white py-10 sm:py-12 px-4 sm:px-8 border-b border-slate-800 overflow-hidden">
              <div className="absolute right-4 sm:right-8 lg:right-16 top-1/2 -translate-y-1/2 w-64 sm:w-80 lg:w-96 h-40 sm:h-52 lg:h-60 pointer-events-none opacity-15 select-none">
                <Image
                  src="/images/gt_logo.webp"
                  alt="GT Logistics Watermark"
                  fill
                  className="object-contain object-right"
                  priority
                />
              </div>

              <div className="relative z-10 max-w-7xl mx-auto space-y-2">
                {/* Breadcrumbs */}
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-1">
                  <span>Trang chủ</span>
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span>Dịch vụ</span>
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span className="text-azure-400 font-medium">{currentService.title}</span>
                </div>

                <div className="space-y-1">
                  <span className="text-[11px] font-bold text-azure-400 block">
                    Dịch vụ Logistics GT
                  </span>
                  <input
                    type="text"
                    value={
                      locale === "zh"
                        ? currentService.titleZh || ""
                        : locale === "en"
                        ? currentService.titleEn || ""
                        : currentService.title || ""
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      setServices((prev) =>
                        prev.map((s) =>
                          s.slug === currentService.slug
                            ? {
                                ...s,
                                ...(locale === "zh"
                                  ? { titleZh: val }
                                  : locale === "en"
                                  ? { titleEn: val }
                                  : { title: val }),
                              }
                            : s
                        )
                      );
                    }}
                    className="w-full bg-transparent text-2xl sm:text-4xl font-black text-white hover:outline hover:outline-dashed hover:outline-azure-400 rounded px-1"
                    title="Nhấp để sửa tiêu đề dịch vụ"
                  />

                  <textarea
                    rows={2}
                    value={
                      locale === "zh"
                        ? currentService.shortDescZh || ""
                        : locale === "en"
                        ? currentService.shortDescEn || ""
                        : currentService.shortDesc || ""
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      setServices((prev) =>
                        prev.map((s) =>
                          s.slug === currentService.slug
                            ? {
                                ...s,
                                ...(locale === "zh"
                                  ? { shortDescZh: val }
                                  : locale === "en"
                                  ? { shortDescEn: val }
                                  : { shortDesc: val }),
                              }
                            : s
                        )
                      );
                    }}
                    className="w-full bg-transparent text-xs sm:text-sm text-slate-300 hover:outline hover:outline-dashed hover:outline-azure-400 rounded px-1 resize-none"
                    title="Nhấp để sửa mô tả ngắn"
                  />
                </div>
              </div>
            </div>

            {/* Thân bài viết dịch vụ: 2 Cột giống 100% trang dịch vụ thật */}
            <section className="py-12 sm:py-16 bg-white text-slate-900 border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                  {/* Cột trái: Ảnh minh họa lớn + Nội dung chi tiết */}
                  <div className="lg:col-span-8 space-y-6">
                    {/* Ảnh lớn Banner của dịch vụ (Nhấp để đổi ảnh) */}
                    <div
                      onClick={() => triggerImagePicker(`service_${currentService.slug}`)}
                      className="group/svcimg relative h-72 sm:h-96 w-full rounded-2xl overflow-hidden shadow-xs border-2 border-dashed border-azure-400 cursor-pointer"
                      title="Nhấp vào đây để đổi hoặc tải ảnh mới lên cho dịch vụ này"
                    >
                      <Image
                        src={currentService.bannerImage || "/images/vietphuc/hero_office_panoramic.webp"}
                        alt={currentService.title}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                        <span className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-azure-600 text-white text-xs font-bold shadow-md">
                          <Camera className="w-4 h-4" />
                          <span>Nhấp để thay đổi ảnh dịch vụ này</span>
                        </span>
                      </div>
                    </div>

                    {/* Bộ chuyển chế độ biên tập bài viết: Trực quan vs HTML */}
                    <div className="flex items-center justify-between border-b border-slate-200 pb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-bold text-azure-700 bg-azure-50 px-2.5 py-1 rounded-md border border-azure-200">
                          Nội dung bài viết ({locale.toUpperCase()})
                        </span>
                      </div>

                      <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl text-xs">
                        <button
                          type="button"
                          onClick={() => setServiceContentMode("visual")}
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition-colors ${
                            serviceContentMode === "visual"
                              ? "bg-white text-slate-900 shadow-xs"
                              : "text-slate-500 hover:text-slate-900"
                          }`}
                        >
                          <Layout className="w-3.5 h-3.5 text-azure-600" />
                          <span>Chế độ trực quan</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => setServiceContentMode("code")}
                          className={`flex items-center gap-1.5 px-3 py-1 rounded-lg font-bold transition-colors ${
                            serviceContentMode === "code"
                              ? "bg-white text-slate-900 shadow-xs"
                              : "text-slate-500 hover:text-slate-900"
                          }`}
                        >
                          <Code className="w-3.5 h-3.5 text-azure-600" />
                          <span>Mã HTML</span>
                        </button>
                      </div>
                    </div>

                    {/* 1. CHẾ ĐỘ TRỰC QUAN (WYSIWYG ĐÚNG TYPOGRAPHY NGUYÊN BẢN CỦA WEB) */}
                    {serviceContentMode === "visual" ? (
                      <div className="rich-content space-y-6 pt-2">
                        {/* Tiêu đề mục chính (h3) */}
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-azure-700 block">
                            Tiêu đề chính bài viết (h3)
                          </span>
                          <input
                            type="text"
                            value={parsedContent.mainHeading}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateParsedContent((prev) => ({ ...prev, mainHeading: val }));
                            }}
                            className="w-full text-xl sm:text-2xl font-black text-slate-950 bg-slate-50 hover:bg-white border border-slate-200 hover:border-azure-400 rounded-xl p-2.5"
                            title="Sửa tiêu đề chính bài viết"
                          />
                        </div>

                        {/* Đoạn văn giới thiệu (p) */}
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-azure-700 block">
                            Đoạn văn mở đầu (p)
                          </span>
                          <textarea
                            rows={3}
                            value={parsedContent.introParagraph}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateParsedContent((prev) => ({ ...prev, introParagraph: val }));
                            }}
                            className="w-full text-sm leading-relaxed text-slate-700 bg-slate-50 hover:bg-white border border-slate-200 hover:border-azure-400 rounded-xl p-3 resize-none"
                            title="Sửa đoạn văn mở đầu"
                          />
                        </div>

                        {/* Tiêu đề phân mục năng lực (h4) */}
                        <div className="space-y-1">
                          <span className="text-xs font-bold text-azure-700 block">
                            Tiêu đề danh sách năng lực (h4)
                          </span>
                          <input
                            type="text"
                            value={parsedContent.subHeading}
                            onChange={(e) => {
                              const val = e.target.value;
                              updateParsedContent((prev) => ({ ...prev, subHeading: val }));
                            }}
                            className="w-full text-base sm:text-lg font-bold text-slate-900 bg-slate-50 hover:bg-white border border-slate-200 hover:border-azure-400 rounded-xl p-2.5"
                            title="Sửa tiêu đề danh sách"
                          />
                        </div>

                        {/* Danh sách các điểm mạnh gạch đầu dòng (ul > li) */}
                        <div className="space-y-3">
                          <span className="text-xs font-bold text-azure-700 block">
                            Các điểm mạnh năng lực (Gạch đầu dòng):
                          </span>
                          <ul className="space-y-2.5 pl-0">
                            {parsedContent.bullets.map((b, idx) => (
                              <li key={idx} className="flex items-start gap-2 group/bullet">
                                <span className="w-2 h-2 rounded-full bg-azure-600 shrink-0 mt-3" />
                                <div className="flex-1 flex items-start gap-2">
                                  <textarea
                                    rows={2}
                                    value={b}
                                    onChange={(e) => {
                                      const text = e.target.value;
                                      updateParsedContent((prev) => {
                                        const nextB = [...prev.bullets];
                                        nextB[idx] = text;
                                        return { ...prev, bullets: nextB };
                                      });
                                    }}
                                    className="w-full bg-slate-50 hover:bg-white text-slate-700 border border-slate-200 hover:border-azure-400 rounded-xl p-2.5 text-xs sm:text-sm leading-relaxed resize-none"
                                    title="Sửa gạch đầu dòng này"
                                  />
                                  <button
                                    type="button"
                                    onClick={() => {
                                      updateParsedContent((prev) => ({
                                        ...prev,
                                        bullets: prev.bullets.filter((_, i) => i !== idx),
                                      }));
                                    }}
                                    className="opacity-0 group-hover/bullet:opacity-100 p-1.5 text-slate-400 hover:text-rose-500 transition-opacity"
                                    title="Xóa gạch đầu dòng này"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </button>
                                </div>
                              </li>
                            ))}
                          </ul>

                          <button
                            type="button"
                            onClick={() => {
                              updateParsedContent((prev) => ({
                                ...prev,
                                bullets: [
                                  ...prev.bullets,
                                  "Thêm điểm mạnh năng lực mới cho dịch vụ...",
                                ],
                              }));
                            }}
                            className="inline-flex items-center gap-1.5 text-xs text-azure-600 hover:text-azure-700 font-bold bg-azure-50 px-3 py-1.5 rounded-lg border border-azure-200 transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5" />
                            <span>Thêm gạch đầu dòng năng lực</span>
                          </button>
                        </div>
                      </div>
                    ) : (
                      /* 2. CHẾ ĐỘ MÃ HTML CHO NGƯỜI DÙNG NÂNG CAO */
                      <div className="space-y-2">
                        <textarea
                          rows={14}
                          value={activeServiceContentRaw}
                          onChange={(e) => {
                            const val = e.target.value;
                            setServices((prev) =>
                              prev.map((s) =>
                                s.slug === currentService.slug
                                  ? {
                                      ...s,
                                      ...(locale === "zh"
                                        ? { fullContentZh: val }
                                        : locale === "en"
                                        ? { fullContentEn: val }
                                        : { fullContent: val }),
                                    }
                                  : s
                              )
                            );
                            setParsedContent(parseServiceHtml(val));
                          }}
                          className="w-full p-4 rounded-xl bg-slate-900 border border-slate-700 font-mono text-xs text-slate-200 leading-relaxed focus:border-azure-500 focus:outline-none"
                        />
                      </div>
                    )}

                    {/* Hộp Báo Giá Ngữ Cảnh Dành Riêng Cho Dịch Vụ Này (Mô phỏng đúng web thật) */}
                    <div className="mt-8 p-6 rounded-2xl bg-slate-950 text-white flex flex-col sm:flex-row items-start sm:items-center justify-between gap-5 border border-slate-800 shadow-xs">
                      <div>
                        <span className="text-[11px] font-bold text-gold-400 block mb-1">
                          Yêu cầu báo giá nhanh
                        </span>
                        <h4 className="text-base sm:text-lg font-bold text-white leading-snug">
                          Cần báo giá cước và phương án tối ưu cho {currentService.title}?
                        </h4>
                        <p className="text-xs text-slate-400 mt-1">
                          Đội ngũ phản hồi phương án vận chuyển và biểu phí trong vòng 15 phút.
                        </p>
                      </div>

                      <div className="flex items-center gap-2 shrink-0">
                        <a
                          href={`tel:${(settings.hotline || "0904382268").replace(/[^0-9]/g, "")}`}
                          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gold-500 text-slate-950 font-bold text-xs shadow-xs"
                        >
                          <Phone className="w-4 h-4" />
                          <span>Gọi Ngay</span>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Cột phải: Sidebar dịch vụ y như thật */}
                  <div className="lg:col-span-4 space-y-4">
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                      <h4 className="font-bold text-sm text-slate-900 mb-3 border-b border-slate-200 pb-2">
                        Tất Cả 5 Dịch Vụ GT Logistics
                      </h4>
                      <div className="space-y-2">
                        {services.map((s) => {
                          const isActive = s.slug === currentService.slug;
                          return (
                            <button
                              key={s.slug}
                              type="button"
                              onClick={() => setSelectedPage(s.slug)}
                              className={`w-full flex items-center justify-between p-3 rounded-xl text-xs font-semibold transition-colors text-left ${
                                isActive
                                  ? "bg-azure-600 text-white shadow-xs"
                                  : "bg-white text-slate-700 hover:bg-slate-100 border border-slate-200"
                              }`}
                            >
                              <span className="line-clamp-1">{s.title}</span>
                              <ArrowRight className="w-4 h-4 shrink-0" />
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-azure-50/80 border border-azure-200 text-xs text-azure-950 space-y-1">
                      <strong className="block">Lưu ý quản trị:</strong>
                      <p className="text-slate-600 leading-relaxed text-[11px]">
                        Bạn có thể bấm vào bất kỳ dịch vụ nào ở danh sách trên để chuyển sang sửa bài viết của dịch vụ đó ngay lập tức.
                      </p>
                    </div>

                    {/* Thông tin hỗ trợ */}
                    <div className="bg-slate-900 text-slate-300 p-5 rounded-2xl border border-slate-800 space-y-3 text-xs">
                      <span className="font-bold text-white block text-sm">Trợ Giúp Nhanh</span>
                      <p className="text-slate-400 text-[11px]">
                        Mọi nội dung sau khi sửa xong và bấm <strong>LƯU LÊN WEBSITE</strong> sẽ tự động cập nhật ngay lập tức trên máy chủ VPS.
                      </p>
                      <div className="pt-2 border-t border-slate-800 space-y-1 text-[11px]">
                        <div>Hotline: <strong className="text-white">{settings.hotline || "0904.382.268"}</strong></div>
                        <div>Email: <strong className="text-white">{settings.email || "contact@logisticsgt.vn"}</strong></div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}
      </main>

      {/* Modal chọn ảnh tập trung */}
      <MediaPickerModal
        isOpen={imageModalOpen}
        onClose={() => setImageModalOpen(false)}
        onSelect={handleImageSelected}
        title="Chọn hoặc tải ảnh mới từ máy lên VPS"
      />
    </div>
  );
}
