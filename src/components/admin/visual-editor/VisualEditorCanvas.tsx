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
  PhoneCall,
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
  ChevronDown,
  Sliders,
  ZoomIn,
  MoveVertical,
  X,
  MapPin,
  Clock,
  Mail,
  Search,
  Check,
} from "lucide-react";
import { MediaPickerModal } from "@/components/admin/MediaPickerModal";
import { savePageSectionContent } from "@/modules/content/actions";
import { updateServiceContent } from "@/modules/services/actions";
import {
  DEFAULT_ABOUT_CONTENT,
  DEFAULT_BORDER_GATES,
  DEFAULT_CONTACT_CONTENT,
} from "@/modules/content/constants";

interface VisualEditorCanvasProps {
  initialHero: any;
  initialWhyUs: any;
  initialStats: any;
  initialAbout: any;
  initialBanners: any;
  initialHomeServices?: any;
  initialBorderGates?: any;
  initialContact?: any;
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
  initialBanners,
  initialHomeServices,
  initialBorderGates,
  initialContact,
  initialServices,
  settings,
}: VisualEditorCanvasProps) {
  // Page selector: 'home' | 'about' | 'services' | 'tracking' | 'news' | 'contact' | 'quote' | service slug
  const [selectedPage, setSelectedPage] = useState<string>("home");
  const [locale, setLocale] = useState<"vi" | "en" | "zh">("vi");

  // State for all editable data
  const [hero, setHero] = useState(initialHero);
  const [whyUs, setWhyUs] = useState(initialWhyUs);
  const [stats, setStats] = useState(initialStats);
  const [about, setAbout] = useState(initialAbout);
  const [banners, setBanners] = useState(initialBanners || {});
  const [borderGates, setBorderGates] = useState(
    initialBorderGates || DEFAULT_BORDER_GATES
  );
  const [contactData, setContactData] = useState(
    initialContact || DEFAULT_CONTACT_CONTENT
  );
  const [homeServices, setHomeServices] = useState(
    initialHomeServices || {
      badge: "NĂNG LỰC DỊCH VỤ CỐT LÕI",
      heading: "Dịch Vụ Tiếp Vận Biên Mậu Nổi Bật Tại Cửa Khẩu Móng Cái",
      description:
        "Hệ sinh thái tiếp vận khép kín từ vận tải đường bộ, thông quan chính ngạch, C/O Form E và sang tải kho bãi tiêu chuẩn cao.",
      illustrationImage: "/images/vietphuc/presentation_multimodal.webp",
    }
  );
  const [services, setServices] = useState<any[]>(initialServices);

  // Navbar dropdown state
  const [navDropdownOpen, setNavDropdownOpen] = useState(false);

  // Background Control Toolbar active state
  const [bgControlOpen, setBgControlOpen] = useState(false);

  // Modal image picker
  const [imageModalOpen, setImageModalOpen] = useState(false);
  const [activeImageTarget, setActiveImageTarget] = useState<string>("");

  // Saving state
  const [saving, setSaving] = useState(false);
  const [notification, setNotification] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Service Content Mode: visual vs code
  const [serviceContentMode, setServiceContentMode] = useState<"visual" | "code">("visual");

  // Active current service if page is a service slug
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

  // Helper to get active banner configuration for current page
  const getActiveBannerConfig = () => {
    if (selectedPage === "home") {
      return {
        bgImage: hero.bgImage || "/images/vietphuc/hero_fleet_6k3a8950.webp",
        bgScale: hero.bgScale ?? 100,
        bgPosition: hero.bgPosition || "center",
        bgOpacity: hero.bgOpacity ?? 55,
      };
    }
    if (currentService) {
      return {
        bgImage: currentService.bannerImage || "/images/vietphuc/hero_fleet_6k3a8950.webp",
        bgScale: currentService.bgScale ?? 100,
        bgPosition: currentService.bgPosition || "center",
        bgOpacity: currentService.bgOpacity ?? 45,
      };
    }
    const pageKey = selectedPage;
    const b = banners[pageKey] || {};
    return {
      bgImage: b.bgImage || "/images/vietphuc/hero_fleet_6k3a8950.webp",
      bgScale: b.bgScale ?? 100,
      bgPosition: b.bgPosition || "center",
      bgOpacity: b.bgOpacity ?? 45,
    };
  };

  // Helper to update active banner configuration
  const updateActiveBannerConfig = (updates: Partial<{ bgImage: string; bgScale: number; bgPosition: string; bgOpacity: number }>) => {
    if (selectedPage === "home") {
      setHero((prev: any) => ({ ...prev, ...updates }));
      return;
    }
    if (currentService) {
      setServices((prev) =>
        prev.map((s) =>
          s.slug === currentService.slug
            ? {
                ...s,
                ...updates,
                ...(updates.bgImage ? { bannerImage: updates.bgImage } : {}),
              }
            : s
        )
      );
      return;
    }
    setBanners((prev: any) => ({
      ...prev,
      [selectedPage]: {
        ...(prev[selectedPage] || {}),
        ...updates,
      },
    }));
  };

  // Save changes
  const handlePublish = async () => {
    setSaving(true);
    setNotification(null);

    try {
      // 1. Lưu nội dung các section của Trang chủ & các trang chức năng
      await Promise.all([
        savePageSectionContent("content_home_hero", hero, "Nội dung Hero Section"),
        savePageSectionContent("content_home_why_us", whyUs, "Nội dung Why Us Section"),
        savePageSectionContent("content_home_services", homeServices, "Nội dung mục Dịch Vụ Trang Chủ"),
        savePageSectionContent("content_home_stats", stats, "Nội dung 4 Big Numbers"),
        savePageSectionContent("content_border_gates", borderGates, "Nội dung Mạng lưới cửa khẩu chiến lược"),
        savePageSectionContent("content_about", about, "Nội dung Trang Giới Thiệu"),
        savePageSectionContent("content_contact", contactData, "Nội dung Thông tin liên hệ & Điểm trực"),
        savePageSectionContent("content_banners", banners, "Nội dung Banners Các Trang"),
      ]);

      // 2. Lưu toàn bộ 5 dịch vụ đã được sửa đổi vào cơ sở dữ liệu
      await Promise.all(
        services.map((s) =>
          updateServiceContent(s.slug, {
            title: s.title,
            titleEn: s.titleEn,
            titleZh: s.titleZh,
            shortDesc: s.shortDesc,
            shortDescEn: s.shortDescEn,
            shortDescZh: s.shortDescZh,
            bannerImage: s.bannerImage,
            fullContent: s.fullContent,
            fullContentEn: s.fullContentEn,
            fullContentZh: s.fullContentZh,
          })
        )
      );

      setNotification({
        type: "success",
        text: "Đã lưu và xuất bản toàn bộ thay đổi lên website chính thành công!",
      });
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
      updateActiveBannerConfig({ bgImage: url });
    } else if (activeImageTarget === "bannerBg") {
      updateActiveBannerConfig({ bgImage: url });
    } else if (activeImageTarget === "whyUsImg") {
      setWhyUs({ ...whyUs, image: url });
    } else if (activeImageTarget === "aboutImg") {
      setAbout({ ...about, storyImage: url });
    } else if (activeImageTarget === "homeServicesImg") {
      setHomeServices({ ...homeServices, illustrationImage: url });
    } else if (activeImageTarget === "borderGatesImg") {
      setBorderGates({ ...borderGates, image: url });
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
  const activeBanner = getActiveBannerConfig();

  return (
    <div className="fixed inset-0 z-50 bg-slate-900 text-slate-100 flex flex-col overflow-y-auto">
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
                <option value="about">Giới Thiệu (/about)</option>
                <option value="services">Tất Cả Dịch Vụ (/services)</option>
                <option value="news">Tin Tức & Cẩm Nang (/news)</option>
                <option value="quote">Báo Giá (/quote)</option>
                <option value="contact">Liên Hệ (/contact)</option>
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
                : selectedPage === "services"
                ? "/services"
                : selectedPage === "news"
                ? "/news"
                : selectedPage === "contact"
                ? "/contact"
                : selectedPage === "quote"
                ? "/quote"
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

      {/* Thanh nhắc nhở Click-to-Edit & Bảng điều khiển ảnh nền / Zoom */}
      <div className="bg-azure-950/90 border-b border-azure-800/80 px-4 py-2 flex flex-wrap items-center justify-between gap-3 text-xs text-azure-300">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
          <span>
            <strong>Chế độ Trực Quan:</strong> Nhấp chuột trực tiếp vào dòng chữ bất kỳ để gõ sửa, bấm nút máy ảnh để đổi hình ảnh.
          </span>
        </div>

        {/* Nút bật/tắt bảng điều khiển phóng to / thu nhỏ ảnh nền Hero/Banner */}
        <button
          type="button"
          onClick={() => setBgControlOpen(!bgControlOpen)}
          className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-azure-900/80 hover:bg-azure-800 text-white text-xs font-bold border border-azure-700 transition-colors"
        >
          <Sliders className="w-3.5 h-3.5 text-gold-400" />
          <span>Tuỳ Chỉnh Ảnh Nền Banner & Thu Phóng</span>
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform ${bgControlOpen ? "rotate-180" : ""}`}
          />
        </button>
      </div>

      {/* BẢNG ĐIỀU KHIỂN PHÓNG TO / THU NHỎ / VỊ TRÍ ẢNH NỀN HERO & BANNER */}
      {bgControlOpen && (
        <div className="bg-slate-950 border-b border-slate-800 px-6 py-3 text-xs text-slate-300 animate-in fade-in duration-150">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="font-bold text-white flex items-center gap-1.5">
                <Camera className="w-4 h-4 text-gold-400" />
                <span>Ảnh nền trang hiện tại:</span>
              </span>
              <button
                type="button"
                onClick={() =>
                  triggerImagePicker(selectedPage === "home" ? "heroBg" : "bannerBg")
                }
                className="px-3 py-1 rounded-lg bg-azure-600 hover:bg-azure-500 text-white font-bold transition-colors shadow-xs"
              >
                Chọn / Tải Ảnh Mới
              </button>
              {activeBanner.bgImage && (
                <button
                  type="button"
                  onClick={() => updateActiveBannerConfig({ bgImage: "" })}
                  className="px-2.5 py-1 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-rose-400 transition-colors"
                >
                  Xóa Ảnh
                </button>
              )}
            </div>

            {/* Slider Phóng to / Thu nhỏ (Zoom Scale) */}
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-1 text-slate-400">
                <ZoomIn className="w-3.5 h-3.5 text-azure-400" />
                <span>Thu phóng:</span>
              </span>
              <input
                type="range"
                min="100"
                max="250"
                step="5"
                value={activeBanner.bgScale}
                onChange={(e) =>
                  updateActiveBannerConfig({ bgScale: parseInt(e.target.value, 10) })
                }
                className="w-28 sm:w-36 accent-gold-400 cursor-pointer"
              />
              <span className="font-mono text-gold-300 w-12 text-right">
                {activeBanner.bgScale}%
              </span>
            </div>

            {/* Vị trí hiển thị ảnh (Position) */}
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1 text-slate-400">
                <MoveVertical className="w-3.5 h-3.5 text-azure-400" />
                <span>Vị trí:</span>
              </span>
              <div className="flex items-center gap-1 bg-slate-900 p-0.5 rounded-lg border border-slate-800">
                {(["top", "center", "bottom"] as const).map((pos) => (
                  <button
                    key={pos}
                    type="button"
                    onClick={() => updateActiveBannerConfig({ bgPosition: pos })}
                    className={`px-2 py-0.5 rounded text-[11px] font-semibold capitalize transition-colors ${
                      activeBanner.bgPosition === pos
                        ? "bg-azure-600 text-white"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    {pos === "top" ? "Đỉnh" : pos === "center" ? "Giữa" : "Đáy"}
                  </button>
                ))}
              </div>
            </div>

            {/* Độ mờ ảnh nền (Opacity) */}
            <div className="flex items-center gap-3">
              <span className="text-slate-400">Độ rõ:</span>
              <input
                type="range"
                min="10"
                max="80"
                step="5"
                value={activeBanner.bgOpacity}
                onChange={(e) =>
                  updateActiveBannerConfig({ bgOpacity: parseInt(e.target.value, 10) })
                }
                className="w-20 sm:w-28 accent-azure-500 cursor-pointer"
              />
              <span className="font-mono text-azure-300 w-10 text-right">
                {activeBanner.bgOpacity}%
              </span>
            </div>
          </div>
        </div>
      )}

      {/* MÔ PHỎNG HEADER CỦA WEBSITE CHÍNH VỚI NAVBAR HOẠT ĐỘNG HOÀN TOÀN (FIX POINT 5) */}
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
          <div
            onClick={() => setSelectedPage("home")}
            className="flex items-center gap-3 cursor-pointer group"
          >
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

          {/* CÁC NÚT ĐIỀU HƯỚNG NAVBAR - BẤM VÀO LÀ CHUYỂN TRANG NGAY LẬP TỨC (FIX POINT 5) */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-bold text-slate-300">
            <button
              type="button"
              onClick={() => setSelectedPage("home")}
              className={`hover:text-gold-400 transition-colors py-1 ${
                selectedPage === "home" ? "text-gold-400 font-black border-b-2 border-gold-400" : ""
              }`}
            >
              Trang Chủ
            </button>

            <button
              type="button"
              onClick={() => setSelectedPage("about")}
              className={`hover:text-gold-400 transition-colors py-1 ${
                selectedPage === "about" ? "text-gold-400 font-black border-b-2 border-gold-400" : ""
              }`}
            >
              Giới Thiệu
            </button>

            {/* Mục Tất Cả Dịch Vụ kèm Menu Dropdown chọn từng dịch vụ cụ thể */}
            <div
              className="relative"
              onMouseEnter={() => setNavDropdownOpen(true)}
              onMouseLeave={() => setNavDropdownOpen(false)}
            >
              <button
                type="button"
                onClick={() => setSelectedPage("services")}
                className={`flex items-center gap-1 hover:text-gold-400 transition-colors py-1 ${
                  selectedPage === "services" || currentService
                    ? "text-gold-400 font-black border-b-2 border-gold-400"
                    : ""
                }`}
              >
                <span>Tất Cả Dịch Vụ</span>
                <ChevronDown className="w-3.5 h-3.5" />
              </button>

              {navDropdownOpen && (
                <div className="absolute top-full left-0 pt-2 z-50">
                  <div className="w-64 bg-slate-900 rounded-xl shadow-xl border border-slate-800 p-2 text-slate-200">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedPage("services");
                        setNavDropdownOpen(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-xs font-bold hover:bg-slate-800 text-azure-300 hover:text-white transition-colors border-b border-slate-800 mb-1"
                    >
                      Trang Tổng Hợp: Tất Cả Dịch Vụ
                    </button>
                    <div className="space-y-1">
                      {services.map((s) => (
                        <button
                          key={s.slug}
                          type="button"
                          onClick={() => {
                            setSelectedPage(s.slug);
                            setNavDropdownOpen(false);
                          }}
                          className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors flex items-center justify-between ${
                            selectedPage === s.slug
                              ? "bg-azure-600 text-white font-bold"
                              : "hover:bg-slate-800 text-slate-300"
                          }`}
                        >
                          <span className="truncate">{s.title}</span>
                          <ChevronRight className="w-3.5 h-3.5 shrink-0 opacity-60" />
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              type="button"
              onClick={() => setSelectedPage("news")}
              className={`hover:text-gold-400 transition-colors py-1 ${
                selectedPage === "news" ? "text-gold-400 font-black border-b-2 border-gold-400" : ""
              }`}
            >
              Tin Tức
            </button>

            <button
              type="button"
              onClick={() => setSelectedPage("quote")}
              className={`hover:text-gold-400 transition-colors py-1 ${
                selectedPage === "quote" ? "text-gold-400 font-black border-b-2 border-gold-400" : ""
              }`}
            >
              Báo Giá
            </button>

            <button
              type="button"
              onClick={() => setSelectedPage("contact")}
              className={`hover:text-gold-400 transition-colors py-1 ${
                selectedPage === "contact" ? "text-gold-400 font-black border-b-2 border-gold-400" : ""
              }`}
            >
              Liên Hệ
            </button>
          </nav>

          <button
            type="button"
            onClick={() => setSelectedPage("quote")}
            className="px-3.5 py-1.5 rounded-lg bg-azure-600 hover:bg-azure-500 text-white text-xs font-bold transition-colors"
          >
            Báo Giá Nhanh
          </button>
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
              {/* Nút Đổi Ảnh Nền Hero nổi bật trực tiếp tại góc trên phải */}
              <div className="absolute top-6 right-6 z-20 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => triggerImagePicker("heroBg")}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-azure-600/90 hover:bg-azure-500 text-white font-bold text-xs shadow-lg border border-azure-400 backdrop-blur-sm transition-colors cursor-pointer"
                  title="Nhấp để tải hoặc chọn ảnh nền Hero mới"
                >
                  <Camera className="w-4 h-4 text-gold-400" />
                  <span>Đổi Ảnh Nền Hero</span>
                </button>
                <button
                  type="button"
                  onClick={() => setBgControlOpen(!bgControlOpen)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-gold-300 font-bold text-xs shadow-lg border border-slate-700 backdrop-blur-sm transition-colors cursor-pointer"
                  title="Mở thanh tinh chỉnh thu phóng (Zoom Scale) & căn chỉnh vị trí ảnh nền"
                >
                  <Sliders className="w-4 h-4" />
                  <span>Thu Phóng / Vị Trí</span>
                </button>
              </div>

              {/* Ảnh nền có zoom / scale / position linh hoạt */}
              <div
                className="absolute inset-0 z-0 bg-no-repeat pointer-events-none transition-transform"
                style={{
                  backgroundImage: `url('${activeBanner.bgImage}')`,
                  backgroundSize: `${activeBanner.bgScale}%`,
                  backgroundPosition: activeBanner.bgPosition,
                  opacity: activeBanner.bgOpacity / 100,
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/30 z-0 pointer-events-none" />

              <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="max-w-3xl">
                  {/* Tiêu đề thương hiệu 2 dòng màu sắc nhận diện logo (Click-to-edit) */}
                  <div className="space-y-3">
                    <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight">
                      <div className="space-y-1">
                        <input
                          type="text"
                          value={hero.titleLine1 || "CÔNG TY TNHH"}
                          onChange={(e) => setHero({ ...hero, titleLine1: e.target.value })}
                          className="w-full bg-transparent text-azure-400 hover:outline hover:outline-dashed hover:outline-azure-400 rounded px-1 font-black block"
                          title="Hàng trên (Màu xanh thương hiệu) - Nhấp để sửa"
                          placeholder="CÔNG TY TNHH"
                        />
                        <input
                          type="text"
                          value={hero.titleLine2 || "LOGISTICS GT"}
                          onChange={(e) => setHero({ ...hero, titleLine2: e.target.value })}
                          className="w-full bg-transparent text-gold-400 hover:outline hover:outline-dashed hover:outline-gold-400 rounded px-1 font-black block"
                          title="Hàng dưới (Màu vàng thương hiệu) - Nhấp để sửa"
                          placeholder="LOGISTICS GT"
                        />
                      </div>
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

                  {/* Đoạn mô tả ngắn dưới dấu gạch (Click-to-edit trực tiếp) */}
                  <div className="space-y-4">
                    <textarea
                      rows={3}
                      value={
                        locale === "zh"
                          ? hero.subHeadlineZh || hero.subHeadline || ""
                          : locale === "en"
                          ? hero.subHeadlineEn || hero.subHeadline || ""
                          : hero.subHeadline ||
                            "Đơn vị tiên phong cung cấp giải pháp vận tải đường bộ liên vận Việt – Trung, thông quan chính ngạch tại hệ thống các cửa khẩu trọng điểm phía Bắc (Móng Cái, Hữu Nghị, Tân Thanh, Chi Ma) và khai thác chuyên tuyến Vận tải biển bằng tàu & sà lan đi khắp quần đảo Cô Tô."
                      }
                      onChange={(e) => {
                        const text = e.target.value;
                        setHero((prev: any) => ({
                          ...prev,
                          ...(locale === "zh"
                            ? { subHeadlineZh: text }
                            : locale === "en"
                            ? { subHeadlineEn: text }
                            : { subHeadline: text }),
                        }));
                      }}
                      className="w-full bg-transparent text-slate-200 hover:outline hover:outline-dashed hover:outline-azure-400 rounded px-2 py-1 resize-none text-sm sm:text-base lg:text-lg leading-relaxed font-normal"
                      title="Nhấp để sửa đoạn mô tả ngắn hero"
                    />

                    {/* Cụm 2 nút hành động (Click-to-edit) */}
                    <div className="pt-4 flex flex-wrap items-center gap-4">
                      <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-azure-600 text-white font-bold text-sm">
                        <input
                          type="text"
                          value={
                            locale === "zh"
                              ? hero.btnQuoteZh || ""
                              : locale === "en"
                              ? hero.btnQuoteEn || ""
                              : hero.btnQuote || "Nhận Báo Giá Trong 15 Phút"
                          }
                          onChange={(e) => {
                            const val = e.target.value;
                            setHero((prev: any) => ({
                              ...prev,
                              ...(locale === "zh"
                                ? { btnQuoteZh: val }
                                : locale === "en"
                                ? { btnQuoteEn: val }
                                : { btnQuote: val }),
                            }));
                          }}
                          className="bg-transparent text-white font-bold text-sm hover:outline hover:outline-dashed hover:outline-white/60 rounded px-1 w-52"
                          title="Sửa nút báo giá"
                        />
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </div>

                      <div className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-slate-700 bg-slate-900/80 text-slate-100 text-sm font-semibold">
                        <PhoneCall className="w-4 h-4 text-gold-400" />
                        <input
                          type="text"
                          value={hero.btnHotline || `Hotline Tư Vấn 24/7: ${settings?.hotline || "0904.382.268"}`}
                          onChange={(e) => setHero((prev: any) => ({ ...prev, btnHotline: e.target.value }))}
                          className="bg-transparent text-slate-100 font-semibold text-sm hover:outline hover:outline-dashed hover:outline-azure-400 rounded px-1 w-64"
                          title="Sửa nút hotline"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* MỤC DỊCH VỤ TRANG CHỦ KÈM 4 THẺ DỊCH VỤ (SO LE 50-50) */}
            <section className="py-16 sm:py-24 bg-slate-50/80 text-slate-900 border-b border-slate-200/80">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
                  {/* Cột Trái: Tiêu đề nửa màn hình & Ảnh minh họa */}
                  <div className="lg:col-span-6 space-y-6">
                    <div>
                      <div className="h-1 w-12 bg-azure-600 rounded-full mb-4" />
                      <input
                        type="text"
                        value={
                          locale === "zh"
                            ? homeServices.headingZh || ""
                            : locale === "en"
                            ? homeServices.headingEn || ""
                            : homeServices.heading || ""
                        }
                        onChange={(e) => {
                          const val = e.target.value;
                          setHomeServices((prev: any) => ({
                            ...prev,
                            ...(locale === "zh"
                              ? { headingZh: val }
                              : locale === "en"
                              ? { headingEn: val }
                              : { heading: val }),
                          }));
                        }}
                        className="w-full text-2xl sm:text-3xl font-black text-slate-950 tracking-tight bg-transparent hover:outline hover:outline-dashed hover:outline-azure-400 rounded px-1"
                        title="Nhấp để sửa tiêu đề mục dịch vụ"
                      />
                      <textarea
                        rows={3}
                        value={
                          locale === "zh"
                            ? homeServices.descriptionZh || ""
                            : locale === "en"
                            ? homeServices.descriptionEn || ""
                            : homeServices.description || ""
                        }
                        onChange={(e) => {
                          const val = e.target.value;
                          setHomeServices((prev: any) => ({
                            ...prev,
                            ...(locale === "zh"
                              ? { descriptionZh: val }
                              : locale === "en"
                              ? { descriptionEn: val }
                              : { description: val }),
                          }));
                        }}
                        className="w-full mt-3 text-slate-600 text-sm leading-relaxed bg-transparent hover:outline hover:outline-dashed hover:outline-azure-400 rounded px-1 resize-none"
                        title="Nhấp để sửa đoạn văn giới thiệu dịch vụ"
                      />
                    </div>

                    {/* Ảnh minh họa dưới Header */}
                    <div
                      onClick={() => triggerImagePicker("homeServicesImg")}
                      className="group/hsimg relative h-60 sm:h-64 rounded-2xl overflow-hidden shadow-xs border-2 border-dashed border-azure-400 cursor-pointer"
                      title="Nhấp vào đây để đổi ảnh minh họa mục dịch vụ"
                    >
                      <Image
                        src={
                          homeServices.illustrationImage ||
                          "/images/vietphuc/presentation_multimodal.webp"
                        }
                        alt="Service illustration"
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-slate-950/40 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity">
                        <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-azure-600 text-white text-xs font-bold shadow-md">
                          <Camera className="w-4 h-4" />
                          <span>Đổi ảnh minh họa này</span>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Cột Phải: Ma trận 2x2 gồm 4 Thẻ Dịch Vụ */}
                  <div className="lg:col-span-6 space-y-4">
                    <div className="flex items-center justify-between border-b border-slate-200 pb-2">
                      <span className="text-xs font-bold text-azure-700 bg-azure-50 px-2.5 py-1 rounded-md border border-azure-200">
                        Ma Trận 2x2: 4 Thẻ Dịch Vụ Chính (Sửa tên, mô tả và đổi ảnh sẽ đồng bộ toàn web)
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                      {services.slice(0, 4).map((s) => {
                        const titleVal =
                          locale === "zh"
                            ? s.titleZh || ""
                            : locale === "en"
                            ? s.titleEn || ""
                            : s.title || "";
                        const descVal =
                          locale === "zh"
                            ? s.shortDescZh || ""
                            : locale === "en"
                            ? s.shortDescEn || ""
                            : s.shortDesc || "";

                        return (
                          <div
                            key={s.slug}
                            className="p-4 rounded-2xl bg-white border-2 border-slate-300 hover:border-azure-600 transition-colors flex flex-col justify-between gap-3 shadow-xs"
                          >
                            <div className="space-y-2">
                              {/* Ảnh đại diện nhỏ của thẻ dịch vụ */}
                              <div
                                onClick={() => triggerImagePicker(`service_${s.slug}`)}
                                className="relative w-full h-24 rounded-xl overflow-hidden shrink-0 border border-slate-300 cursor-pointer group/th"
                                title="Bấm để đổi ảnh thẻ dịch vụ này"
                              >
                                <Image
                                  src={s.bannerImage || "/images/vietphuc/hero_office_panoramic.webp"}
                                  alt={s.title}
                                  fill
                                  className="object-cover"
                                />
                                <div className="absolute inset-0 bg-slate-950/50 opacity-0 group-hover/th:opacity-100 flex items-center justify-center transition-opacity">
                                  <Camera className="w-4 h-4 text-white" />
                                </div>
                              </div>

                              {/* Tiêu đề & Mô tả thẻ dịch vụ (Đồng bộ sang tab và bài viết dịch vụ) */}
                              <div className="space-y-1 w-full">
                              <input
                                type="text"
                                value={titleVal}
                                onChange={(e) => {
                                  const text = e.target.value;
                                  setServices((prev) =>
                                    prev.map((item) =>
                                      item.slug === s.slug
                                        ? {
                                            ...item,
                                            ...(locale === "zh"
                                              ? { titleZh: text }
                                              : locale === "en"
                                              ? { titleEn: text }
                                              : { title: text }),
                                          }
                                        : item
                                    )
                                  );
                                }}
                                className="w-full font-bold text-sm text-slate-900 bg-transparent hover:outline hover:outline-dashed hover:outline-azure-400 rounded px-1"
                                title="Nhấp để sửa tên dịch vụ (sẽ tự đổi ở cả bài viết và danh mục)"
                              />
                              <textarea
                                rows={2}
                                value={descVal}
                                onChange={(e) => {
                                  const text = e.target.value;
                                  setServices((prev) =>
                                    prev.map((item) =>
                                      item.slug === s.slug
                                        ? {
                                            ...item,
                                            ...(locale === "zh"
                                              ? { shortDescZh: text }
                                              : locale === "en"
                                              ? { shortDescEn: text }
                                              : { shortDesc: text }),
                                          }
                                        : item
                                    )
                                  );
                                }}
                                className="w-full text-xs text-slate-600 bg-transparent hover:outline hover:outline-dashed hover:outline-azure-400 rounded px-1 resize-none"
                                title="Nhấp để sửa tóm tắt dịch vụ"
                              />
                            </div>
                          </div>

                          {/* Nút chuyển nhanh vào trang chi tiết dịch vụ này */}
                          <button
                              type="button"
                              onClick={() => setSelectedPage(s.slug)}
                              className="px-3 py-1.5 rounded-lg bg-slate-100 hover:bg-azure-600 text-slate-700 hover:text-white text-xs font-bold transition-colors shrink-0 whitespace-nowrap self-end sm:self-center"
                              title="Chuyển sang sửa bài viết chi tiết"
                            >
                              Sửa Bài Viết
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* MẠNG LƯỚI CỬA KHẨU CHIẾN LƯỢC (MA TRẬN 2x2 CLICK-TO-EDIT) */}
            <section className="py-16 sm:py-24 bg-white text-slate-900 border-b border-slate-200/80 overflow-hidden">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                {/* Phần Header mục: Tiêu đề & mô tả chiến lược */}
                <div className="max-w-3xl mb-10 sm:mb-12">
                  <input
                    type="text"
                    value={
                      locale === "zh"
                        ? borderGates.badgeZh || ""
                        : locale === "en"
                        ? borderGates.badgeEn || ""
                        : borderGates.badge || "MẠNG LƯỚI CỬA KHẨU CHIẾN LƯỢC"
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      setBorderGates((prev: any) => ({
                        ...prev,
                        ...(locale === "zh"
                          ? { badgeZh: val }
                          : locale === "en"
                          ? { badgeEn: val }
                          : { badge: val }),
                      }));
                    }}
                    className="bg-transparent text-xs font-bold text-azure-700 block mb-2 hover:outline hover:outline-dashed hover:outline-azure-400 rounded px-1 w-full"
                    title="Nhấp để sửa nhãn đề mục"
                  />
                  <div className="h-1 w-16 bg-gradient-to-r from-azure-600 to-gold-500 rounded-full mb-4" />
                  <textarea
                    rows={2}
                    value={
                      locale === "zh"
                        ? borderGates.headingZh || ""
                        : locale === "en"
                        ? borderGates.headingEn || ""
                        : borderGates.heading ||
                          "Năng Lực Thông Quan Phủ Sóng Toàn Tuyến Biên Giới Phía Bắc"
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      setBorderGates((prev: any) => ({
                        ...prev,
                        ...(locale === "zh"
                          ? { headingZh: val }
                          : locale === "en"
                          ? { headingEn: val }
                          : { heading: val }),
                      }));
                    }}
                    className="w-full bg-transparent text-2xl sm:text-4xl font-black text-slate-950 tracking-tight leading-tight hover:outline hover:outline-dashed hover:outline-azure-400 rounded px-1 resize-none"
                    title="Nhấp để sửa tiêu đề chính mục cửa khẩu"
                  />
                  <textarea
                    rows={3}
                    value={
                      locale === "zh"
                        ? borderGates.descriptionZh || ""
                        : locale === "en"
                        ? borderGates.descriptionEn || ""
                        : borderGates.description || ""
                    }
                    onChange={(e) => {
                      const val = e.target.value;
                      setBorderGates((prev: any) => ({
                        ...prev,
                        ...(locale === "zh"
                          ? { descriptionZh: val }
                          : locale === "en"
                          ? { descriptionEn: val }
                          : { description: val }),
                      }));
                    }}
                    className="w-full bg-transparent mt-2 text-slate-600 text-sm sm:text-base leading-relaxed hover:outline hover:outline-dashed hover:outline-azure-400 rounded px-1 resize-none"
                    title="Nhấp để sửa mô tả chiến lược"
                  />
                </div>

                {/* Ma trận 2x2 cho 4 Cửa Khẩu Chiến Lược */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
                  {(borderGates.gates || []).map((g: any, gIdx: number) => {
                    const nameVal =
                      locale === "zh" && g.nameZh
                        ? g.nameZh
                        : locale === "en" && g.nameEn
                        ? g.nameEn
                        : g.name;
                    const descVal =
                      locale === "zh" && g.descZh
                        ? g.descZh
                        : locale === "en" && g.descEn
                        ? g.descEn
                        : g.desc;

                    return (
                      <div
                        key={g.code || gIdx}
                        className="bg-slate-50/80 rounded-2xl p-6 sm:p-7 border-2 border-slate-200 hover:border-azure-600 hover:bg-white transition-colors duration-150 shadow-xs flex flex-col justify-between group"
                      >
                        <div>
                          <div className="flex items-center justify-between gap-3 mb-4">
                            <input
                              type="text"
                              value={g.code || `0${gIdx + 1}`}
                              onChange={(e) => {
                                const val = e.target.value;
                                setBorderGates((prev: any) => {
                                  const nextG = [...prev.gates];
                                  nextG[gIdx] = { ...nextG[gIdx], code: val };
                                  return { ...prev, gates: nextG };
                                });
                              }}
                              className="w-14 h-12 rounded-xl bg-azure-600 text-white font-mono font-black text-base flex items-center justify-center text-center shadow-xs focus:ring-2 focus:ring-gold-400"
                              title="Sửa mã cửa khẩu"
                            />

                            <div className="flex items-center gap-2">
                              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-azure-100/90 text-azure-800 text-xs font-bold">
                                <MapPin className="w-3.5 h-3.5 text-azure-600 shrink-0" />
                                <input
                                  type="text"
                                  value={g.province || "Quảng Ninh"}
                                  onChange={(e) => {
                                    const val = e.target.value;
                                    setBorderGates((prev: any) => {
                                      const nextG = [...prev.gates];
                                      nextG[gIdx] = { ...nextG[gIdx], province: val };
                                      return { ...prev, gates: nextG };
                                    });
                                  }}
                                  className="w-24 bg-transparent font-bold text-azure-800 text-xs focus:outline-none"
                                  title="Sửa tỉnh/thành cửa khẩu"
                                />
                              </span>
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                                <Clock className="w-3 h-3 text-emerald-600 shrink-0" />
                                <span>Trực 24/7</span>
                              </span>
                            </div>
                          </div>

                          <input
                            type="text"
                            value={nameVal}
                            onChange={(e) => {
                              const val = e.target.value;
                              setBorderGates((prev: any) => {
                                const nextG = [...prev.gates];
                                const cur = { ...nextG[gIdx] };
                                if (locale === "zh") cur.nameZh = val;
                                else if (locale === "en") cur.nameEn = val;
                                else cur.name = val;
                                nextG[gIdx] = cur;
                                return { ...prev, gates: nextG };
                              });
                            }}
                            className="w-full bg-transparent font-black text-slate-950 text-base sm:text-lg leading-snug mb-2 hover:outline hover:outline-dashed hover:outline-azure-400 rounded px-1"
                            title="Nhấp để sửa tên cửa khẩu"
                          />

                          <textarea
                            rows={3}
                            value={descVal}
                            onChange={(e) => {
                              const val = e.target.value;
                              setBorderGates((prev: any) => {
                                const nextG = [...prev.gates];
                                const cur = { ...nextG[gIdx] };
                                if (locale === "zh") cur.descZh = val;
                                else if (locale === "en") cur.descEn = val;
                                else cur.desc = val;
                                nextG[gIdx] = cur;
                                return { ...prev, gates: nextG };
                              });
                            }}
                            className="w-full bg-transparent text-xs sm:text-sm text-slate-600 leading-relaxed hover:outline hover:outline-dashed hover:outline-azure-400 rounded px-1 resize-none"
                            title="Nhấp để sửa tóm tắt ưu thế cửa khẩu"
                          />
                        </div>

                        <div className="pt-4 mt-4 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500 font-medium">
                          <span className="text-azure-700 font-bold">
                            Chính ngạch • Giải phóng xe trong ngày
                          </span>
                          <span className="text-gold-600 font-bold flex items-center gap-1">
                            <ShieldCheck className="w-3.5 h-3.5" />
                            <span>Thường trực</span>
                          </span>
                        </div>
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
                  {/* Cột phải: 4 thẻ ưu thế cạnh tranh (Click-to-edit) */}
                  <div className="lg:col-span-6 order-2 lg:order-2 space-y-4">
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

                  {/* Cột trái: Tiêu đề nửa màn hình & Ảnh minh họa (Click-to-edit) */}
                  <div className="lg:col-span-6 order-1 lg:order-1 space-y-6">
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
            {/* Banner đầu trang có thu phóng ảnh nền */}
            <div className="relative bg-slate-950 text-white py-16 sm:py-20 px-4 sm:px-8 border-b border-slate-800 overflow-hidden">
              {/* Nút Đổi Ảnh Nền Banner & Thu phóng trực quan trên Banner */}
              <div className="absolute top-6 right-6 z-20 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => triggerImagePicker("bannerBg")}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-azure-600/90 hover:bg-azure-500 text-white font-bold text-xs shadow-lg border border-azure-400 backdrop-blur-sm transition-colors cursor-pointer"
                  title="Nhấp để tải hoặc chọn ảnh nền Banner mới"
                >
                  <Camera className="w-4 h-4 text-gold-400" />
                  <span>Đổi Ảnh Nền Banner</span>
                </button>
                <button
                  type="button"
                  onClick={() => setBgControlOpen(!bgControlOpen)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-gold-300 font-bold text-xs shadow-lg border border-slate-700 backdrop-blur-sm transition-colors cursor-pointer"
                  title="Mở thanh tinh chỉnh thu phóng (Zoom Scale) & căn chỉnh vị trí ảnh nền"
                >
                  <Sliders className="w-4 h-4" />
                  <span>Thu Phóng / Vị Trí</span>
                </button>
              </div>

              {activeBanner.bgImage && (
                <div
                  className="absolute inset-0 z-0 bg-no-repeat pointer-events-none transition-transform"
                  style={{
                    backgroundImage: `url('${activeBanner.bgImage}')`,
                    backgroundSize: `${activeBanner.bgScale}%`,
                    backgroundPosition: activeBanner.bgPosition,
                    opacity: activeBanner.bgOpacity / 100,
                  }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/40 z-0 pointer-events-none" />

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

            {/* BỐ CỤC 1 HÀNG DỌC CHUẨN MỰC THEO YÊU CẦU: KHÔNG BIG NUMBERS, KHÔNG BADGE, KHÔNG BẢNG */}
            <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 space-y-16">
              {/* MỤC 1: VỀ CHÚNG TÔI */}
              <section className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                  VỀ CHÚNG TÔI
                </h2>
                <div className="h-0.5 w-16 bg-slate-900" />

                <div className="space-y-3 pt-2">
                  <span className="text-xs font-bold text-azure-700 bg-azure-50 px-2.5 py-1 rounded-md border border-azure-200 inline-block mb-1">
                    Các đoạn văn giới thiệu (Nhấp trực tiếp để sửa)
                  </span>
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
                  <button
                    type="button"
                    onClick={() => {
                      setAbout((prev: any) => ({
                        ...prev,
                        paragraphs: [
                          ...prev.paragraphs,
                          {
                            vi: "Thêm đoạn văn bản mới giới thiệu về năng lực...",
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

                {/* Ảnh minh họa trụ sở */}
                <div
                  onClick={() => triggerImagePicker("aboutImg")}
                  className="group/img relative h-64 sm:h-80 rounded-2xl overflow-hidden shadow-xs border-2 border-dashed border-azure-400 cursor-pointer mt-4"
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
              </section>

              {/* MỤC 2: QUY MÔ VẬN TẢI & PHẠM VI PHỦ SÓNG (ĐẦY ĐỦ CLICK-TO-EDIT) */}
              <section className="space-y-6">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                    QUY MÔ VẬN TẢI & PHẠM VI PHỦ SÓNG
                  </h2>
                  <div className="h-0.5 w-16 bg-slate-900 mt-2" />
                  <p className="text-xs text-slate-500 mt-2 font-medium">
                    Nhấp vào từng tiêu đề hoặc gạch đầu dòng để chỉnh sửa trực tiếp nội dung năng lực.
                  </p>
                </div>

                {/* Tiểu mục 2.1: Phạm vi phủ sóng */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <input
                      type="text"
                      value={about.scope?.title || "Phạm vi phủ sóng"}
                      onChange={(e) => {
                        const title = e.target.value;
                        setAbout((prev: any) => ({
                          ...prev,
                          scope: { ...(prev.scope || DEFAULT_ABOUT_CONTENT.scope), title },
                        }));
                      }}
                      className="font-bold text-lg text-slate-950 bg-transparent hover:outline hover:outline-dashed hover:outline-azure-400 rounded px-1"
                      title="Nhấp để sửa tiêu đề mục Phạm vi phủ sóng"
                    />
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-azure-100 text-azure-800 shrink-0">
                      Mục 2.1
                    </span>
                  </div>

                  <ul className="space-y-2">
                    {(about.scope?.bullets || DEFAULT_ABOUT_CONTENT.scope.bullets).map((bullet: string, bIdx: number) => (
                      <li key={bIdx} className="group/bullet flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-azure-600 mt-2 shrink-0" />
                        <textarea
                          rows={2}
                          value={bullet}
                          onChange={(e) => {
                            const val = e.target.value;
                            setAbout((prev: any) => {
                              const curBullets = [...(prev.scope?.bullets || DEFAULT_ABOUT_CONTENT.scope.bullets)];
                              curBullets[bIdx] = val;
                              return {
                                ...prev,
                                scope: { ...(prev.scope || DEFAULT_ABOUT_CONTENT.scope), bullets: curBullets },
                              };
                            });
                          }}
                          className="w-full text-sm text-slate-700 bg-white border border-slate-200 hover:outline hover:outline-dashed hover:outline-azure-400 rounded-lg p-2 leading-relaxed"
                          title="Nhấp để sửa gạch đầu dòng"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setAbout((prev: any) => {
                              const curBullets = (prev.scope?.bullets || DEFAULT_ABOUT_CONTENT.scope.bullets).filter(
                                (_: any, i: number) => i !== bIdx
                              );
                              return {
                                ...prev,
                                scope: { ...(prev.scope || DEFAULT_ABOUT_CONTENT.scope), bullets: curBullets },
                              };
                            });
                          }}
                          className="opacity-0 group-hover/bullet:opacity-100 p-1 text-slate-400 hover:text-rose-500 transition-opacity"
                          title="Xóa ý này"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={() => {
                      setAbout((prev: any) => {
                        const curBullets = [...(prev.scope?.bullets || DEFAULT_ABOUT_CONTENT.scope.bullets), "Thêm tuyến/cửa khẩu phủ sóng mới..."];
                        return {
                          ...prev,
                          scope: { ...(prev.scope || DEFAULT_ABOUT_CONTENT.scope), bullets: curBullets },
                        };
                      });
                    }}
                    className="inline-flex items-center gap-1.5 text-xs text-azure-700 hover:text-azure-800 font-bold bg-white px-3 py-1.5 rounded-lg border border-slate-300 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm tuyến / cửa khẩu</span>
                  </button>
                </div>

                {/* Tiểu mục 2.2: Quy mô vận tải */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <input
                      type="text"
                      value={about.fleetScale?.title || "Quy mô vận tải"}
                      onChange={(e) => {
                        const title = e.target.value;
                        setAbout((prev: any) => ({
                          ...prev,
                          fleetScale: { ...(prev.fleetScale || DEFAULT_ABOUT_CONTENT.fleetScale), title },
                        }));
                      }}
                      className="font-bold text-lg text-slate-950 bg-transparent hover:outline hover:outline-dashed hover:outline-azure-400 rounded px-1"
                      title="Nhấp để sửa tiêu đề mục Quy mô vận tải"
                    />
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-azure-100 text-azure-800 shrink-0">
                      Mục 2.2
                    </span>
                  </div>

                  <ul className="space-y-2">
                    {(about.fleetScale?.bullets || DEFAULT_ABOUT_CONTENT.fleetScale.bullets).map((bullet: string, bIdx: number) => (
                      <li key={bIdx} className="group/bullet flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-azure-600 mt-2 shrink-0" />
                        <textarea
                          rows={2}
                          value={bullet}
                          onChange={(e) => {
                            const val = e.target.value;
                            setAbout((prev: any) => {
                              const curBullets = [...(prev.fleetScale?.bullets || DEFAULT_ABOUT_CONTENT.fleetScale.bullets)];
                              curBullets[bIdx] = val;
                              return {
                                ...prev,
                                fleetScale: { ...(prev.fleetScale || DEFAULT_ABOUT_CONTENT.fleetScale), bullets: curBullets },
                              };
                            });
                          }}
                          className="w-full text-sm text-slate-700 bg-white border border-slate-200 hover:outline hover:outline-dashed hover:outline-azure-400 rounded-lg p-2 leading-relaxed"
                          title="Nhấp để sửa gạch đầu dòng"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setAbout((prev: any) => {
                              const curBullets = (prev.fleetScale?.bullets || DEFAULT_ABOUT_CONTENT.fleetScale.bullets).filter(
                                (_: any, i: number) => i !== bIdx
                              );
                              return {
                                ...prev,
                                fleetScale: { ...(prev.fleetScale || DEFAULT_ABOUT_CONTENT.fleetScale), bullets: curBullets },
                              };
                            });
                          }}
                          className="opacity-0 group-hover/bullet:opacity-100 p-1 text-slate-400 hover:text-rose-500 transition-opacity"
                          title="Xóa ý này"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={() => {
                      setAbout((prev: any) => {
                        const curBullets = [...(prev.fleetScale?.bullets || DEFAULT_ABOUT_CONTENT.fleetScale.bullets), "Thêm phương tiện hoặc năng lực đội xe..."];
                        return {
                          ...prev,
                          fleetScale: { ...(prev.fleetScale || DEFAULT_ABOUT_CONTENT.fleetScale), bullets: curBullets },
                        };
                      });
                    }}
                    className="inline-flex items-center gap-1.5 text-xs text-azure-700 hover:text-azure-800 font-bold bg-white px-3 py-1.5 rounded-lg border border-slate-300 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm năng lực đội xe</span>
                  </button>
                </div>

                {/* Tiểu mục 2.3: Thông quan hàng hóa */}
                <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                  <div className="flex items-center justify-between gap-3">
                    <input
                      type="text"
                      value={about.customsCapability?.title || "Thông quan hàng hóa"}
                      onChange={(e) => {
                        const title = e.target.value;
                        setAbout((prev: any) => ({
                          ...prev,
                          customsCapability: { ...(prev.customsCapability || DEFAULT_ABOUT_CONTENT.customsCapability), title },
                        }));
                      }}
                      className="font-bold text-lg text-slate-950 bg-transparent hover:outline hover:outline-dashed hover:outline-azure-400 rounded px-1"
                      title="Nhấp để sửa tiêu đề mục Thông quan hàng hóa"
                    />
                    <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-azure-100 text-azure-800 shrink-0">
                      Mục 2.3
                    </span>
                  </div>

                  <ul className="space-y-2">
                    {(about.customsCapability?.bullets || DEFAULT_ABOUT_CONTENT.customsCapability.bullets).map((bullet: string, bIdx: number) => (
                      <li key={bIdx} className="group/bullet flex items-start gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-azure-600 mt-2 shrink-0" />
                        <textarea
                          rows={2}
                          value={bullet}
                          onChange={(e) => {
                            const val = e.target.value;
                            setAbout((prev: any) => {
                              const curBullets = [...(prev.customsCapability?.bullets || DEFAULT_ABOUT_CONTENT.customsCapability.bullets)];
                              curBullets[bIdx] = val;
                              return {
                                ...prev,
                                customsCapability: { ...(prev.customsCapability || DEFAULT_ABOUT_CONTENT.customsCapability), bullets: curBullets },
                              };
                            });
                          }}
                          className="w-full text-sm text-slate-700 bg-white border border-slate-200 hover:outline hover:outline-dashed hover:outline-azure-400 rounded-lg p-2 leading-relaxed"
                          title="Nhấp để sửa gạch đầu dòng"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setAbout((prev: any) => {
                              const curBullets = (prev.customsCapability?.bullets || DEFAULT_ABOUT_CONTENT.customsCapability.bullets).filter(
                                (_: any, i: number) => i !== bIdx
                              );
                              return {
                                ...prev,
                                customsCapability: { ...(prev.customsCapability || DEFAULT_ABOUT_CONTENT.customsCapability), bullets: curBullets },
                              };
                            });
                          }}
                          className="opacity-0 group-hover/bullet:opacity-100 p-1 text-slate-400 hover:text-rose-500 transition-opacity"
                          title="Xóa ý này"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </li>
                    ))}
                  </ul>

                  <button
                    type="button"
                    onClick={() => {
                      setAbout((prev: any) => {
                        const curBullets = [...(prev.customsCapability?.bullets || DEFAULT_ABOUT_CONTENT.customsCapability.bullets), "Thêm nghiệp vụ thông quan mới..."];
                        return {
                          ...prev,
                          customsCapability: { ...(prev.customsCapability || DEFAULT_ABOUT_CONTENT.customsCapability), bullets: curBullets },
                        };
                      });
                    }}
                    className="inline-flex items-center gap-1.5 text-xs text-azure-700 hover:text-azure-800 font-bold bg-white px-3 py-1.5 rounded-lg border border-slate-300 transition-colors"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Thêm nghiệp vụ thông quan</span>
                  </button>
                </div>
              </section>

              {/* MỤC 3: TẦM NHÌN & SỨ MỆNH (CLICK-TO-EDIT) */}
              <section className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                  TẦM NHÌN & SỨ MỆNH
                </h2>
                <div className="h-0.5 w-16 bg-slate-900" />

                <div className="space-y-4 pt-2 text-slate-700 text-sm sm:text-base leading-relaxed">
                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <input
                      type="text"
                      value={about.visionMission?.visionTitle || "Tầm nhìn"}
                      onChange={(e) => {
                        const visionTitle = e.target.value;
                        setAbout((prev: any) => ({
                          ...prev,
                          visionMission: { ...(prev.visionMission || DEFAULT_ABOUT_CONTENT.visionMission), visionTitle },
                        }));
                      }}
                      className="text-lg font-bold text-slate-950 bg-transparent hover:outline hover:outline-dashed hover:outline-azure-400 rounded px-1 w-full"
                      title="Sửa tiêu đề Tầm nhìn"
                    />
                    <textarea
                      rows={3}
                      value={about.visionMission?.visionDesc || DEFAULT_ABOUT_CONTENT.visionMission.visionDesc}
                      onChange={(e) => {
                        const visionDesc = e.target.value;
                        setAbout((prev: any) => ({
                          ...prev,
                          visionMission: { ...(prev.visionMission || DEFAULT_ABOUT_CONTENT.visionMission), visionDesc },
                        }));
                      }}
                      className="w-full text-sm text-slate-700 bg-white border border-slate-200 hover:outline hover:outline-dashed hover:outline-azure-400 rounded-lg p-2 leading-relaxed"
                      title="Sửa nội dung Tầm nhìn"
                    />
                  </div>

                  <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
                    <input
                      type="text"
                      value={about.visionMission?.missionTitle || "Sứ mệnh"}
                      onChange={(e) => {
                        const missionTitle = e.target.value;
                        setAbout((prev: any) => ({
                          ...prev,
                          visionMission: { ...(prev.visionMission || DEFAULT_ABOUT_CONTENT.visionMission), missionTitle },
                        }));
                      }}
                      className="text-lg font-bold text-slate-950 bg-transparent hover:outline hover:outline-dashed hover:outline-azure-400 rounded px-1 w-full"
                      title="Sửa tiêu đề Sứ mệnh"
                    />
                    <textarea
                      rows={3}
                      value={about.visionMission?.missionDesc || DEFAULT_ABOUT_CONTENT.visionMission.missionDesc}
                      onChange={(e) => {
                        const missionDesc = e.target.value;
                        setAbout((prev: any) => ({
                          ...prev,
                          visionMission: { ...(prev.visionMission || DEFAULT_ABOUT_CONTENT.visionMission), missionDesc },
                        }));
                      }}
                      className="w-full text-sm text-slate-700 bg-white border border-slate-200 hover:outline hover:outline-dashed hover:outline-azure-400 rounded-lg p-2 leading-relaxed"
                      title="Sửa nội dung Sứ mệnh"
                    />
                  </div>
                </div>
              </section>

              {/* MỤC 4: HỆ SINH THÁI (CLICK-TO-EDIT) */}
              <section className="space-y-4">
                <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                  HỆ SINH THÁI
                </h2>
                <div className="h-0.5 w-16 bg-slate-900" />

                <div className="space-y-4 pt-2 text-slate-700 text-sm sm:text-base leading-relaxed">
                  <p className="text-sm text-slate-600 leading-relaxed font-medium">
                    Sự liên kết chặt chẽ giữa 3 đơn vị tạo nên chuỗi cung ứng khép kín, chủ động hoàn toàn về phương tiện đường bộ lẫn đường biển:
                  </p>

                  <div className="space-y-4 pt-2">
                    {(Array.isArray(about.ecosystem) ? about.ecosystem : DEFAULT_ABOUT_CONTENT.ecosystem).map((eco: any, mIdx: number) => (
                      <div key={mIdx} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <span className="text-[11px] font-bold text-slate-500 block mb-1">Tên đơn vị:</span>
                            <input
                              type="text"
                              value={eco.unit || ""}
                              onChange={(e) => {
                                const unit = e.target.value;
                                setAbout((prev: any) => {
                                  const cur = [...(Array.isArray(prev.ecosystem) ? prev.ecosystem : DEFAULT_ABOUT_CONTENT.ecosystem)];
                                  cur[mIdx] = { ...cur[mIdx], unit };
                                  return { ...prev, ecosystem: cur };
                                });
                              }}
                              className="text-base font-bold text-slate-950 bg-white border border-slate-200 hover:outline hover:outline-dashed hover:outline-azure-400 rounded-lg p-2 w-full"
                              title="Sửa tên đơn vị thành viên"
                            />
                          </div>
                          <div>
                            <span className="text-[11px] font-bold text-slate-500 block mb-1">Vai trò / Phân cấp:</span>
                            <input
                              type="text"
                              value={eco.tag || ""}
                              onChange={(e) => {
                                const tag = e.target.value;
                                setAbout((prev: any) => {
                                  const cur = [...(Array.isArray(prev.ecosystem) ? prev.ecosystem : DEFAULT_ABOUT_CONTENT.ecosystem)];
                                  cur[mIdx] = { ...cur[mIdx], tag };
                                  return { ...prev, ecosystem: cur };
                                });
                              }}
                              className="text-xs text-slate-800 bg-white border border-slate-200 hover:outline hover:outline-dashed hover:outline-azure-400 rounded-lg p-2 w-full"
                              title="Sửa phân cấp"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                          <div>
                            <span className="text-xs font-bold text-slate-600 block mb-1">Vai trò trong hệ sinh thái:</span>
                            <textarea
                              rows={2}
                              value={eco.role || ""}
                              onChange={(e) => {
                                const role = e.target.value;
                                setAbout((prev: any) => {
                                  const cur = [...(Array.isArray(prev.ecosystem) ? prev.ecosystem : DEFAULT_ABOUT_CONTENT.ecosystem)];
                                  cur[mIdx] = { ...cur[mIdx], role };
                                  return { ...prev, ecosystem: cur };
                                });
                              }}
                              className="w-full text-xs text-slate-700 bg-white border border-slate-200 hover:outline hover:outline-dashed hover:outline-azure-400 rounded-lg p-2"
                              title="Sửa vai trò"
                            />
                          </div>
                          <div>
                            <span className="text-xs font-bold text-slate-600 block mb-1">Thế mạnh trọng tâm:</span>
                            <textarea
                              rows={2}
                              value={eco.desc || ""}
                              onChange={(e) => {
                                const desc = e.target.value;
                                setAbout((prev: any) => {
                                  const cur = [...(Array.isArray(prev.ecosystem) ? prev.ecosystem : DEFAULT_ABOUT_CONTENT.ecosystem)];
                                  cur[mIdx] = { ...cur[mIdx], desc };
                                  return { ...prev, ecosystem: cur };
                                });
                              }}
                              className="w-full text-xs text-slate-700 bg-white border border-slate-200 hover:outline hover:outline-dashed hover:outline-azure-400 rounded-lg p-2"
                              title="Sửa thế mạnh"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </section>
            </div>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 3: TRANG TẤT CẢ DỊCH VỤ (/services) (FIX POINT 4)         */}
        {/* ============================================================== */}
        {selectedPage === "services" && (
          <div className="space-y-0">
            {/* Banner Tất Cả Dịch Vụ */}
            <div className="relative bg-slate-950 text-white py-16 sm:py-20 px-4 sm:px-8 border-b border-slate-800 overflow-hidden">
              {/* Nút Đổi Ảnh Nền Banner & Thu phóng trực quan trên Banner */}
              <div className="absolute top-6 right-6 z-20 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => triggerImagePicker("bannerBg")}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-azure-600/90 hover:bg-azure-500 text-white font-bold text-xs shadow-lg border border-azure-400 backdrop-blur-sm transition-colors cursor-pointer"
                  title="Nhấp để tải hoặc chọn ảnh nền Banner mới"
                >
                  <Camera className="w-4 h-4 text-gold-400" />
                  <span>Đổi Ảnh Nền Banner</span>
                </button>
                <button
                  type="button"
                  onClick={() => setBgControlOpen(!bgControlOpen)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-gold-300 font-bold text-xs shadow-lg border border-slate-700 backdrop-blur-sm transition-colors cursor-pointer"
                  title="Mở thanh tinh chỉnh thu phóng (Zoom Scale) & căn chỉnh vị trí ảnh nền"
                >
                  <Sliders className="w-4 h-4" />
                  <span>Thu Phóng / Vị Trí</span>
                </button>
              </div>

              {activeBanner.bgImage && (
                <div
                  className="absolute inset-0 z-0 bg-no-repeat pointer-events-none transition-transform"
                  style={{
                    backgroundImage: `url('${activeBanner.bgImage}')`,
                    backgroundSize: `${activeBanner.bgScale}%`,
                    backgroundPosition: activeBanner.bgPosition,
                    opacity: activeBanner.bgOpacity / 100,
                  }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/40 z-0 pointer-events-none" />

              <div className="relative z-10 max-w-7xl mx-auto space-y-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
                  <span>Trang chủ</span>
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span className="text-azure-400 font-medium">Tất cả dịch vụ</span>
                </div>

                <input
                  type="text"
                  value={
                    locale === "zh"
                      ? banners?.services?.titleZh || ""
                      : locale === "en"
                      ? banners?.services?.titleEn || ""
                      : banners?.services?.title || "Tất Cả Dịch Vụ"
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    setBanners((prev: any) => ({
                      ...prev,
                      services: {
                        ...(prev.services || {}),
                        ...(locale === "zh"
                          ? { titleZh: val }
                          : locale === "en"
                          ? { titleEn: val }
                          : { title: val }),
                      },
                    }));
                  }}
                  className="w-full bg-transparent text-2xl sm:text-4xl font-black text-white hover:outline hover:outline-dashed hover:outline-azure-400 rounded px-1"
                  title="Nhấp để sửa tiêu đề chính trang Tất cả dịch vụ"
                />

                <textarea
                  rows={2}
                  value={
                    locale === "zh"
                      ? banners?.services?.subtitleZh || ""
                      : locale === "en"
                      ? banners?.services?.subtitleEn || ""
                      : banners?.services?.subtitle || ""
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    setBanners((prev: any) => ({
                      ...prev,
                      services: {
                        ...(prev.services || {}),
                        ...(locale === "zh"
                          ? { subtitleZh: val }
                          : locale === "en"
                          ? { subtitleEn: val }
                          : { subtitle: val }),
                      },
                    }));
                  }}
                  className="w-full bg-transparent text-xs sm:text-sm text-slate-300 hover:outline hover:outline-dashed hover:outline-azure-400 rounded px-1 resize-none"
                  title="Nhấp để sửa mô tả phụ trang Tất cả dịch vụ"
                />
              </div>
            </div>

            {/* Grid 4 Thẻ Dịch Vụ Lớn (Ảnh lớn, tiêu đề, mô tả và nút sửa) */}
            <section className="py-16 bg-slate-50/70 border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {services.slice(0, 4).map((s) => (
                    <div
                      key={s.slug}
                      className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-xs flex flex-col justify-between"
                    >
                      <div
                        onClick={() => triggerImagePicker(`service_${s.slug}`)}
                        className="relative h-56 w-full cursor-pointer group/cardimg"
                        title="Bấm để đổi ảnh banner của dịch vụ này"
                      >
                        <Image
                          src={s.bannerImage || "/images/vietphuc/hero_office_panoramic.webp"}
                          alt={s.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-slate-950/40 opacity-0 group-hover/cardimg:opacity-100 flex items-center justify-center transition-opacity">
                          <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-azure-600 text-white text-xs font-bold shadow-md">
                            <Camera className="w-4 h-4" />
                            <span>Đổi ảnh thẻ này</span>
                          </span>
                        </div>
                      </div>

                      <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                        <div className="space-y-2">
                          <input
                            type="text"
                            value={
                              locale === "zh"
                                ? s.titleZh || ""
                                : locale === "en"
                                ? s.titleEn || ""
                                : s.title || ""
                            }
                            onChange={(e) => {
                              const text = e.target.value;
                              setServices((prev) =>
                                prev.map((item) =>
                                  item.slug === s.slug
                                    ? {
                                        ...item,
                                        ...(locale === "zh"
                                          ? { titleZh: text }
                                          : locale === "en"
                                          ? { titleEn: text }
                                          : { title: text }),
                                      }
                                    : item
                                )
                              );
                            }}
                            className="w-full text-lg font-bold text-slate-900 bg-transparent hover:outline hover:outline-dashed hover:outline-azure-400 rounded px-1"
                            title="Sửa tiêu đề dịch vụ"
                          />
                          <textarea
                            rows={3}
                            value={
                              locale === "zh"
                                ? s.shortDescZh || ""
                                : locale === "en"
                                ? s.shortDescEn || ""
                                : s.shortDesc || ""
                            }
                            onChange={(e) => {
                              const text = e.target.value;
                              setServices((prev) =>
                                prev.map((item) =>
                                  item.slug === s.slug
                                    ? {
                                        ...item,
                                        ...(locale === "zh"
                                          ? { shortDescZh: text }
                                          : locale === "en"
                                          ? { shortDescEn: text }
                                          : { shortDesc: text }),
                                      }
                                    : item
                                )
                              );
                            }}
                            className="w-full text-xs text-slate-600 bg-transparent hover:outline hover:outline-dashed hover:outline-azure-400 rounded px-1 resize-none"
                            title="Sửa tóm tắt dịch vụ"
                          />
                        </div>

                        <button
                          type="button"
                          onClick={() => setSelectedPage(s.slug)}
                          className="w-full flex items-center justify-center gap-1.5 py-2 rounded-xl bg-azure-50 hover:bg-azure-600 text-azure-700 hover:text-white text-xs font-bold border border-azure-200 transition-colors"
                        >
                          <span>Sửa Chi Tiết Bài Viết Dịch Vụ Này</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        )}

        {/* VIEW 4: TRANG TRA CỨU VẬN ĐƠN (Đã chuyển hướng và loại bỏ) */}
        {false && (
          <div className="space-y-0">
            {/* Banner Tra Cứu */}
            <div className="relative bg-slate-950 text-white py-16 sm:py-20 px-4 sm:px-8 border-b border-slate-800 overflow-hidden">
              {activeBanner.bgImage && (
                <div
                  className="absolute inset-0 z-0 bg-no-repeat pointer-events-none transition-transform"
                  style={{
                    backgroundImage: `url('${activeBanner.bgImage}')`,
                    backgroundSize: `${activeBanner.bgScale}%`,
                    backgroundPosition: activeBanner.bgPosition,
                    opacity: activeBanner.bgOpacity / 100,
                  }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/40 z-0 pointer-events-none" />

              <div className="relative z-10 max-w-7xl mx-auto space-y-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
                  <span>Trang chủ</span>
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span className="text-azure-400 font-medium">Tra cứu vận đơn</span>
                </div>

                <input
                  type="text"
                  value={
                    locale === "zh"
                      ? banners?.tracking?.titleZh || ""
                      : locale === "en"
                      ? banners?.tracking?.titleEn || ""
                      : banners?.tracking?.title || "Tra Cứu Vận Đơn Trực Tuyến"
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    setBanners((prev: any) => ({
                      ...prev,
                      tracking: {
                        ...(prev.tracking || {}),
                        ...(locale === "zh"
                          ? { titleZh: val }
                          : locale === "en"
                          ? { titleEn: val }
                          : { title: val }),
                      },
                    }));
                  }}
                  className="w-full bg-transparent text-2xl sm:text-4xl font-black text-white hover:outline hover:outline-dashed hover:outline-azure-400 rounded px-1"
                  title="Nhấp để sửa tiêu đề trang tra cứu"
                />

                <textarea
                  rows={2}
                  value={
                    locale === "zh"
                      ? banners?.tracking?.subtitleZh || ""
                      : locale === "en"
                      ? banners?.tracking?.subtitleEn || ""
                      : banners?.tracking?.subtitle || ""
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    setBanners((prev: any) => ({
                      ...prev,
                      tracking: {
                        ...(prev.tracking || {}),
                        ...(locale === "zh"
                          ? { subtitleZh: val }
                          : locale === "en"
                          ? { subtitleEn: val }
                          : { subtitle: val }),
                      },
                    }));
                  }}
                  className="w-full bg-transparent text-xs sm:text-sm text-slate-300 hover:outline hover:outline-dashed hover:outline-azure-400 rounded px-1 resize-none"
                  title="Nhấp để sửa mô tả phụ trang tra cứu"
                />
              </div>
            </div>

            {/* Mô phỏng khung tra cứu vận đơn & 3 thẻ tính năng */}
            <section className="py-12 bg-slate-50 border-b border-slate-200">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                  <h3 className="font-bold text-lg text-slate-900">
                    Nhập mã vận đơn (GT-XXXX) để kiểm tra hành trình
                  </h3>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      disabled
                      placeholder="Ví dụ: GT-2026-MC01"
                      className="flex-1 px-4 py-2.5 rounded-xl border border-slate-300 bg-slate-50 text-slate-600 text-sm font-mono"
                    />
                    <button
                      type="button"
                      disabled
                      className="px-6 py-2.5 rounded-xl bg-azure-600 text-white font-bold text-xs"
                    >
                      Tra Cứu
                    </button>
                  </div>
                </div>

                {/* 3 Thẻ Năng Lực Giám Sát */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="p-4 rounded-xl bg-white border border-slate-200">
                    <Clock className="w-5 h-5 text-azure-600 mb-2" />
                    <h4 className="font-bold text-sm text-slate-900">Thời Gian Thực</h4>
                    <p className="text-xs text-slate-500 mt-1">Cập nhật từng mốc xuất bãi, thông quan và sang tải.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white border border-slate-200">
                    <MapPin className="w-5 h-5 text-azure-600 mb-2" />
                    <h4 className="font-bold text-sm text-slate-900">Định Vị GPS Đội Xe</h4>
                    <p className="text-xs text-slate-500 mt-1">Kiểm soát vị trí xe container trên cao tốc 24/7.</p>
                  </div>
                  <div className="p-4 rounded-xl bg-white border border-slate-200">
                    <ShieldCheck className="w-5 h-5 text-azure-600 mb-2" />
                    <h4 className="font-bold text-sm text-slate-900">Thông Quan Chuẩn Xác</h4>
                    <p className="text-xs text-slate-500 mt-1">Chứng từ hải quan điện tử và mã tờ khai đầy đủ.</p>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 5: TRANG TIN TỨC & CẨM NANG (/news) (FIX POINT 4)          */}
        {/* ============================================================== */}
        {selectedPage === "news" && (
          <div className="space-y-0">
            {/* Banner Tin Tức */}
            <div className="relative bg-slate-950 text-white py-16 sm:py-20 px-4 sm:px-8 border-b border-slate-800 overflow-hidden">
              {/* Nút Đổi Ảnh Nền Banner & Thu phóng trực quan trên Banner */}
              <div className="absolute top-6 right-6 z-20 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => triggerImagePicker("bannerBg")}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-azure-600/90 hover:bg-azure-500 text-white font-bold text-xs shadow-lg border border-azure-400 backdrop-blur-sm transition-colors cursor-pointer"
                  title="Nhấp để tải hoặc chọn ảnh nền Banner mới"
                >
                  <Camera className="w-4 h-4 text-gold-400" />
                  <span>Đổi Ảnh Nền Banner</span>
                </button>
                <button
                  type="button"
                  onClick={() => setBgControlOpen(!bgControlOpen)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-gold-300 font-bold text-xs shadow-lg border border-slate-700 backdrop-blur-sm transition-colors cursor-pointer"
                  title="Mở thanh tinh chỉnh thu phóng (Zoom Scale) & căn chỉnh vị trí ảnh nền"
                >
                  <Sliders className="w-4 h-4" />
                  <span>Thu Phóng / Vị Trí</span>
                </button>
              </div>

              {activeBanner.bgImage && (
                <div
                  className="absolute inset-0 z-0 bg-no-repeat pointer-events-none transition-transform"
                  style={{
                    backgroundImage: `url('${activeBanner.bgImage}')`,
                    backgroundSize: `${activeBanner.bgScale}%`,
                    backgroundPosition: activeBanner.bgPosition,
                    opacity: activeBanner.bgOpacity / 100,
                  }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/40 z-0 pointer-events-none" />

              <div className="relative z-10 max-w-7xl mx-auto space-y-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
                  <span>Trang chủ</span>
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span className="text-azure-400 font-medium">Tin tức & cẩm nang</span>
                </div>

                <input
                  type="text"
                  value={
                    locale === "zh"
                      ? banners?.news?.titleZh || ""
                      : locale === "en"
                      ? banners?.news?.titleEn || ""
                      : banners?.news?.title || "Tin Tức & Cẩm Nang Xuất Nhập Khẩu"
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    setBanners((prev: any) => ({
                      ...prev,
                      news: {
                        ...(prev.news || {}),
                        ...(locale === "zh"
                          ? { titleZh: val }
                          : locale === "en"
                          ? { titleEn: val }
                          : { title: val }),
                      },
                    }));
                  }}
                  className="w-full bg-transparent text-2xl sm:text-4xl font-black text-white hover:outline hover:outline-dashed hover:outline-azure-400 rounded px-1"
                  title="Nhấp để sửa tiêu đề trang tin tức"
                />

                <textarea
                  rows={2}
                  value={
                    locale === "zh"
                      ? banners?.news?.subtitleZh || ""
                      : locale === "en"
                      ? banners?.news?.subtitleEn || ""
                      : banners?.news?.subtitle || ""
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    setBanners((prev: any) => ({
                      ...prev,
                      news: {
                        ...(prev.news || {}),
                        ...(locale === "zh"
                          ? { subtitleZh: val }
                          : locale === "en"
                          ? { subtitleEn: val }
                          : { subtitle: val }),
                      },
                    }));
                  }}
                  className="w-full bg-transparent text-xs sm:text-sm text-slate-300 hover:outline hover:outline-dashed hover:outline-azure-400 rounded px-1 resize-none"
                  title="Nhấp để sửa mô tả phụ trang tin tức"
                />
              </div>
            </div>

            {/* Xem trước danh mục bài viết tin tức */}
            <section className="py-12 bg-white border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                  <span className="px-3 py-1.5 rounded-lg bg-azure-600 text-white text-xs font-bold">
                    Tất Cả Bài Viết
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium">
                    Chính Sách Biên Mậu
                  </span>
                  <span className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-600 text-xs font-medium">
                    Thủ Tục Hải Quan
                  </span>
                </div>
                <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 flex items-center justify-between">
                  <div>
                    <h4 className="font-bold text-slate-900 text-base">Quản lý bài viết tin tức</h4>
                    <p className="text-xs text-slate-500 mt-1">
                      Để thêm, xóa hoặc chỉnh sửa nội dung bài viết tin tức đầy đủ, bạn có thể truy cập mục Quản Lý Bài Viết.
                    </p>
                  </div>
                  <Link
                    href="/admin/posts"
                    className="px-4 py-2 rounded-xl bg-azure-600 hover:bg-azure-500 text-white font-bold text-xs transition-colors shrink-0"
                  >
                    Vào Quản Lý Bài Viết
                  </Link>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 6: TRANG LIÊN HỆ (/contact) (FIX POINT 4)                 */}
        {/* ============================================================== */}
        {selectedPage === "contact" && (
          <div className="space-y-0">
            {/* Banner Liên Hệ */}
            <div className="relative bg-slate-950 text-white py-16 sm:py-20 px-4 sm:px-8 border-b border-slate-800 overflow-hidden">
              {/* Nút Đổi Ảnh Nền Banner & Thu phóng trực quan trên Banner */}
              <div className="absolute top-6 right-6 z-20 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => triggerImagePicker("bannerBg")}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-azure-600/90 hover:bg-azure-500 text-white font-bold text-xs shadow-lg border border-azure-400 backdrop-blur-sm transition-colors cursor-pointer"
                  title="Nhấp để tải hoặc chọn ảnh nền Banner mới"
                >
                  <Camera className="w-4 h-4 text-gold-400" />
                  <span>Đổi Ảnh Nền Banner</span>
                </button>
                <button
                  type="button"
                  onClick={() => setBgControlOpen(!bgControlOpen)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-gold-300 font-bold text-xs shadow-lg border border-slate-700 backdrop-blur-sm transition-colors cursor-pointer"
                  title="Mở thanh tinh chỉnh thu phóng (Zoom Scale) & căn chỉnh vị trí ảnh nền"
                >
                  <Sliders className="w-4 h-4" />
                  <span>Thu Phóng / Vị Trí</span>
                </button>
              </div>

              {activeBanner.bgImage && (
                <div
                  className="absolute inset-0 z-0 bg-no-repeat pointer-events-none transition-transform"
                  style={{
                    backgroundImage: `url('${activeBanner.bgImage}')`,
                    backgroundSize: `${activeBanner.bgScale}%`,
                    backgroundPosition: activeBanner.bgPosition,
                    opacity: activeBanner.bgOpacity / 100,
                  }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/40 z-0 pointer-events-none" />

              <div className="relative z-10 max-w-7xl mx-auto space-y-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
                  <span>Trang chủ</span>
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span className="text-azure-400 font-medium">Liên hệ hợp tác</span>
                </div>

                <input
                  type="text"
                  value={
                    locale === "zh"
                      ? banners?.contact?.titleZh || ""
                      : locale === "en"
                      ? banners?.contact?.titleEn || ""
                      : banners?.contact?.title || "Liên Hệ Hợp Tác GT Logistics"
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    setBanners((prev: any) => ({
                      ...prev,
                      contact: {
                        ...(prev.contact || {}),
                        ...(locale === "zh"
                          ? { titleZh: val }
                          : locale === "en"
                          ? { titleEn: val }
                          : { title: val }),
                      },
                    }));
                  }}
                  className="w-full bg-transparent text-2xl sm:text-4xl font-black text-white hover:outline hover:outline-dashed hover:outline-azure-400 rounded px-1"
                  title="Nhấp để sửa tiêu đề trang liên hệ"
                />

                <textarea
                  rows={2}
                  value={
                    locale === "zh"
                      ? banners?.contact?.subtitleZh || ""
                      : locale === "en"
                      ? banners?.contact?.subtitleEn || ""
                      : banners?.contact?.subtitle || ""
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    setBanners((prev: any) => ({
                      ...prev,
                      contact: {
                        ...(prev.contact || {}),
                        ...(locale === "zh"
                          ? { subtitleZh: val }
                          : locale === "en"
                          ? { subtitleEn: val }
                          : { subtitle: val }),
                      },
                    }));
                  }}
                  className="w-full bg-transparent text-xs sm:text-sm text-slate-300 hover:outline hover:outline-dashed hover:outline-azure-400 rounded px-1 resize-none"
                  title="Nhấp để sửa mô tả phụ trang liên hệ"
                />
              </div>
            </div>

            {/* Thông tin pháp lý & các văn phòng chi nhánh (Click-to-edit) */}
            <section className="py-12 bg-white border-b border-slate-200">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  {/* Cột 1: Thông tin pháp lý & Trụ sở chính */}
                  <div className="space-y-6">
                    {/* Hộp Thông Tin Pháp Lý Doanh Nghiệp */}
                    <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-4">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                        <span className="text-xs font-bold text-azure-700">
                          Thông Tin Pháp Lý Doanh Nghiệp
                        </span>
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800">
                          Chính thức
                        </span>
                      </div>

                      <div className="space-y-3">
                        <div>
                          <label className="text-xs font-semibold text-slate-500 block mb-1">Tên Doanh Nghiệp:</label>
                          <input
                            type="text"
                            value={contactData.companyName || "CÔNG TY TNHH LOGISTICS GT"}
                            onChange={(e) => setContactData({ ...contactData, companyName: e.target.value })}
                            className="w-full text-base font-black text-slate-950 bg-white border border-slate-200 hover:outline hover:outline-dashed hover:outline-azure-400 rounded-lg p-2"
                            title="Sửa tên công ty"
                          />
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-semibold text-slate-500 block mb-1">Mã Số Thuế (MST):</label>
                            <input
                              type="text"
                              value={contactData.taxCode || "5702157588"}
                              onChange={(e) => setContactData({ ...contactData, taxCode: e.target.value })}
                              className="w-full text-sm font-bold text-slate-900 bg-white border border-slate-200 hover:outline hover:outline-dashed hover:outline-azure-400 rounded-lg p-2"
                              title="Sửa mã số thuế"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-slate-500 block mb-1">Đại Diện Pháp Luật:</label>
                            <input
                              type="text"
                              value={contactData.legalRep || "Ông Ngô Thế Hải"}
                              onChange={(e) => setContactData({ ...contactData, legalRep: e.target.value })}
                              className="w-full text-sm font-bold text-slate-900 bg-white border border-slate-200 hover:outline hover:outline-dashed hover:outline-azure-400 rounded-lg p-2"
                              title="Sửa người đại diện pháp luật"
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          <div>
                            <label className="text-xs font-semibold text-slate-500 block mb-1">Hotline Tư Vấn:</label>
                            <input
                              type="text"
                              value={contactData.phone || "0904.382.268"}
                              onChange={(e) => setContactData({ ...contactData, phone: e.target.value })}
                              className="w-full text-sm font-bold text-gold-600 bg-white border border-slate-200 hover:outline hover:outline-dashed hover:outline-azure-400 rounded-lg p-2"
                              title="Sửa hotline liên hệ"
                            />
                          </div>

                          <div>
                            <label className="text-xs font-semibold text-slate-500 block mb-1">Email Tiếp Nhận:</label>
                            <input
                              type="text"
                              value={contactData.email || "contact@logisticsgt.vn"}
                              onChange={(e) => setContactData({ ...contactData, email: e.target.value })}
                              className="w-full text-sm font-semibold text-slate-800 bg-white border border-slate-200 hover:outline hover:outline-dashed hover:outline-azure-400 rounded-lg p-2"
                              title="Sửa email liên hệ"
                            />
                          </div>
                        </div>

                        <div>
                          <label className="text-xs font-semibold text-slate-500 block mb-1">Giờ Làm Việc Hiện Trường:</label>
                          <input
                            type="text"
                            value={contactData.workingHours || "Thứ Hai - Chủ Nhật (07:30 - 18:30)"}
                            onChange={(e) => setContactData({ ...contactData, workingHours: e.target.value })}
                            className="w-full text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:outline hover:outline-dashed hover:outline-azure-400 rounded-lg p-2"
                            title="Sửa thời gian làm việc"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Trụ Sở Chính */}
                    <div className="p-6 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
                      <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                        <input
                          type="text"
                          value={contactData.headquarters?.title || "Trụ Sở Chính (Bắc Luân 2 - Móng Cái)"}
                          onChange={(e) =>
                            setContactData({
                              ...contactData,
                              headquarters: {
                                ...(contactData.headquarters || DEFAULT_CONTACT_CONTENT.headquarters),
                                title: e.target.value,
                              },
                            })
                          }
                          className="font-bold text-slate-950 text-sm bg-transparent hover:outline hover:outline-dashed hover:outline-azure-400 rounded px-1 w-full"
                          title="Sửa tiêu đề Trụ sở chính"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-500 block mb-1">Địa chỉ trụ sở chính:</label>
                        <textarea
                          rows={2}
                          value={contactData.headquarters?.address || DEFAULT_CONTACT_CONTENT.headquarters.address}
                          onChange={(e) =>
                            setContactData({
                              ...contactData,
                              headquarters: {
                                ...(contactData.headquarters || DEFAULT_CONTACT_CONTENT.headquarters),
                                address: e.target.value,
                              },
                            })
                          }
                          className="w-full text-xs font-medium text-slate-800 bg-white border border-slate-200 hover:outline hover:outline-dashed hover:outline-azure-400 rounded-lg p-2 leading-relaxed"
                          title="Sửa địa chỉ trụ sở chính"
                        />
                      </div>
                      <div>
                        <label className="text-xs font-semibold text-slate-500 block mb-1">Ghi chú năng lực túc trực:</label>
                        <input
                          type="text"
                          value={contactData.headquarters?.note || DEFAULT_CONTACT_CONTENT.headquarters.note}
                          onChange={(e) =>
                            setContactData({
                              ...contactData,
                              headquarters: {
                                ...(contactData.headquarters || DEFAULT_CONTACT_CONTENT.headquarters),
                                note: e.target.value,
                              },
                            })
                          }
                          className="w-full text-xs text-slate-600 bg-white border border-slate-200 hover:outline hover:outline-dashed hover:outline-azure-400 rounded-lg p-2"
                          title="Sửa ghi chú"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Cột 2: Mạng Lưới Điểm Trực & Chi Nhánh Cửa Khẩu */}
                  <div className="space-y-4">
                    <div className="flex items-center justify-between pb-2 border-b border-slate-200">
                      <div>
                        <h3 className="font-bold text-base text-slate-950">
                          Mạng Lưới Chi Nhánh Cửa Khẩu & Cảng Biển
                        </h3>
                        <p className="text-xs text-slate-500">
                          Đội ngũ hiện trường túc trực giải quyết thông quan và vận tải trực tiếp.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          const newBranch = {
                            name: "Chi Nhánh Mới",
                            address: "Địa chỉ văn phòng / bãi kiểm hóa...",
                            note: "Ghi chú hoạt động hiện trường...",
                          };
                          setContactData({
                            ...contactData,
                            branches: [...(contactData.branches || DEFAULT_CONTACT_CONTENT.branches), newBranch],
                          });
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-azure-600 hover:bg-azure-500 text-white font-bold text-xs shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" />
                        <span>Thêm Chi Nhánh</span>
                      </button>
                    </div>

                    <div className="space-y-4">
                      {(contactData.branches || DEFAULT_CONTACT_CONTENT.branches).map((branch: any, idx: number) => (
                        <div key={idx} className="group/branch p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 relative">
                          <div className="flex items-center justify-between gap-2">
                            <input
                              type="text"
                              value={branch.name}
                              onChange={(e) => {
                                const val = e.target.value;
                                setContactData((prev: any) => {
                                  const cur = [...(prev.branches || DEFAULT_CONTACT_CONTENT.branches)];
                                  cur[idx] = { ...cur[idx], name: val };
                                  return { ...prev, branches: cur };
                                });
                              }}
                              className="font-bold text-sm text-azure-900 bg-white border border-slate-200 hover:outline hover:outline-dashed hover:outline-azure-400 rounded px-2 py-1 w-full"
                              title="Sửa tên chi nhánh"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                setContactData((prev: any) => ({
                                  ...prev,
                                  branches: (prev.branches || DEFAULT_CONTACT_CONTENT.branches).filter(
                                    (_: any, i: number) => i !== idx
                                  ),
                                }));
                              }}
                              className="opacity-0 group-hover/branch:opacity-100 p-1.5 text-slate-400 hover:text-rose-500 transition-opacity shrink-0"
                              title="Xóa chi nhánh này"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div>
                            <textarea
                              rows={2}
                              value={branch.address}
                              onChange={(e) => {
                                const val = e.target.value;
                                setContactData((prev: any) => {
                                  const cur = [...(prev.branches || DEFAULT_CONTACT_CONTENT.branches)];
                                  cur[idx] = { ...cur[idx], address: val };
                                  return { ...prev, branches: cur };
                                });
                              }}
                              className="w-full text-xs font-semibold text-slate-800 bg-white border border-slate-200 hover:outline hover:outline-dashed hover:outline-azure-400 rounded-lg p-2"
                              title="Sửa địa chỉ chi nhánh"
                            />
                          </div>

                          <div>
                            <input
                              type="text"
                              value={branch.note}
                              onChange={(e) => {
                                const val = e.target.value;
                                setContactData((prev: any) => {
                                  const cur = [...(prev.branches || DEFAULT_CONTACT_CONTENT.branches)];
                                  cur[idx] = { ...cur[idx], note: val };
                                  return { ...prev, branches: cur };
                                });
                              }}
                              className="w-full text-[11px] text-slate-500 bg-white border border-slate-200 hover:outline hover:outline-dashed hover:outline-azure-400 rounded px-2 py-1"
                              title="Sửa ghi chú chi nhánh"
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 7: TRANG BÁO GIÁ (/quote) (FIX POINT 4)                   */}
        {/* ============================================================== */}
        {selectedPage === "quote" && (
          <div className="space-y-0">
            {/* Banner Báo Giá */}
            <div className="relative bg-slate-950 text-white py-16 sm:py-20 px-4 sm:px-8 border-b border-slate-800 overflow-hidden">
              {/* Nút Đổi Ảnh Nền Banner & Thu phóng trực quan trên Banner */}
              <div className="absolute top-6 right-6 z-20 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => triggerImagePicker("bannerBg")}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-azure-600/90 hover:bg-azure-500 text-white font-bold text-xs shadow-lg border border-azure-400 backdrop-blur-sm transition-colors cursor-pointer"
                  title="Nhấp để tải hoặc chọn ảnh nền Banner mới"
                >
                  <Camera className="w-4 h-4 text-gold-400" />
                  <span>Đổi Ảnh Nền Banner</span>
                </button>
                <button
                  type="button"
                  onClick={() => setBgControlOpen(!bgControlOpen)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-gold-300 font-bold text-xs shadow-lg border border-slate-700 backdrop-blur-sm transition-colors cursor-pointer"
                  title="Mở thanh tinh chỉnh thu phóng (Zoom Scale) & căn chỉnh vị trí ảnh nền"
                >
                  <Sliders className="w-4 h-4" />
                  <span>Thu Phóng / Vị Trí</span>
                </button>
              </div>

              {activeBanner.bgImage && (
                <div
                  className="absolute inset-0 z-0 bg-no-repeat pointer-events-none transition-transform"
                  style={{
                    backgroundImage: `url('${activeBanner.bgImage}')`,
                    backgroundSize: `${activeBanner.bgScale}%`,
                    backgroundPosition: activeBanner.bgPosition,
                    opacity: activeBanner.bgOpacity / 100,
                  }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/40 z-0 pointer-events-none" />

              <div className="relative z-10 max-w-7xl mx-auto space-y-3">
                <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2">
                  <span>Trang chủ</span>
                  <ChevronRight className="w-3 h-3 text-slate-600" />
                  <span className="text-azure-400 font-medium">Yêu cầu báo giá</span>
                </div>

                <input
                  type="text"
                  value={
                    locale === "zh"
                      ? banners?.quote?.titleZh || ""
                      : locale === "en"
                      ? banners?.quote?.titleEn || ""
                      : banners?.quote?.title || "Yêu Cầu Báo Giá Nhanh"
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    setBanners((prev: any) => ({
                      ...prev,
                      quote: {
                        ...(prev.quote || {}),
                        ...(locale === "zh"
                          ? { titleZh: val }
                          : locale === "en"
                          ? { titleEn: val }
                          : { title: val }),
                      },
                    }));
                  }}
                  className="w-full bg-transparent text-2xl sm:text-4xl font-black text-white hover:outline hover:outline-dashed hover:outline-azure-400 rounded px-1"
                  title="Nhấp để sửa tiêu đề trang báo giá"
                />

                <textarea
                  rows={2}
                  value={
                    locale === "zh"
                      ? banners?.quote?.subtitleZh || ""
                      : locale === "en"
                      ? banners?.quote?.subtitleEn || ""
                      : banners?.quote?.subtitle || ""
                  }
                  onChange={(e) => {
                    const val = e.target.value;
                    setBanners((prev: any) => ({
                      ...prev,
                      quote: {
                        ...(prev.quote || {}),
                        ...(locale === "zh"
                          ? { subtitleZh: val }
                          : locale === "en"
                          ? { subtitleEn: val }
                          : { subtitle: val }),
                      },
                    }));
                  }}
                  className="w-full bg-transparent text-xs sm:text-sm text-slate-300 hover:outline hover:outline-dashed hover:outline-azure-400 rounded px-1 resize-none"
                  title="Nhấp để sửa mô tả phụ trang báo giá"
                />
              </div>
            </div>

            {/* 3 Cam kết báo giá */}
            <section className="py-12 bg-white border-b border-slate-200">
              <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <Clock className="w-5 h-5 text-azure-600 mb-2" />
                  <h4 className="font-bold text-sm text-slate-900">Phản Hồi Trong 15 Phút</h4>
                  <p className="text-xs text-slate-500 mt-1">Đội ngũ chuyên viên tư vấn phương án vận tải và biểu phí tối ưu nhanh chóng.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <TrendingUp className="w-5 h-5 text-azure-600 mb-2" />
                  <h4 className="font-bold text-sm text-slate-900">Tối Ưu Chi Phí</h4>
                  <p className="text-xs text-slate-500 mt-1">Tư vấn mã HS Code và biểu thuế C/O Form E để tiết kiệm chi phí thuế cao nhất.</p>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200">
                  <ShieldCheck className="w-5 h-5 text-azure-600 mb-2" />
                  <h4 className="font-bold text-sm text-slate-900">Minh Bạch Hợp Đồng</h4>
                  <p className="text-xs text-slate-500 mt-1">Cung cấp báo giá trọn gói không phát sinh chi phí ẩn ngoài thỏa thuận.</p>
                </div>
              </div>
            </section>
          </div>
        )}

        {/* ============================================================== */}
        {/* VIEW 8: TRANG DỊCH VỤ CỤ THỂ (SERVICE DETAIL)                   */}
        {/* ============================================================== */}
        {currentService && (
          <div className="space-y-0">
            {/* Banner đầu trang Dịch vụ */}
            <div className="relative bg-slate-950 text-white py-10 sm:py-12 px-4 sm:px-8 border-b border-slate-800 overflow-hidden">
              {/* Nút Đổi Ảnh Nền Banner & Thu phóng trực quan trên Banner */}
              <div className="absolute top-6 right-6 z-20 flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => triggerImagePicker("bannerBg")}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-azure-600/90 hover:bg-azure-500 text-white font-bold text-xs shadow-lg border border-azure-400 backdrop-blur-sm transition-colors cursor-pointer"
                  title="Nhấp để tải hoặc chọn ảnh nền Banner mới"
                >
                  <Camera className="w-4 h-4 text-gold-400" />
                  <span>Đổi Ảnh Nền Banner</span>
                </button>
                <button
                  type="button"
                  onClick={() => setBgControlOpen(!bgControlOpen)}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-slate-900/90 hover:bg-slate-800 text-gold-300 font-bold text-xs shadow-lg border border-slate-700 backdrop-blur-sm transition-colors cursor-pointer"
                  title="Mở thanh tinh chỉnh thu phóng (Zoom Scale) & căn chỉnh vị trí ảnh nền"
                >
                  <Sliders className="w-4 h-4" />
                  <span>Thu Phóng / Vị Trí</span>
                </button>
              </div>

              {activeBanner.bgImage && (
                <div
                  className="absolute inset-0 z-0 bg-no-repeat pointer-events-none transition-transform"
                  style={{
                    backgroundImage: `url('${activeBanner.bgImage}')`,
                    backgroundSize: `${activeBanner.bgScale}%`,
                    backgroundPosition: activeBanner.bgPosition,
                    opacity: activeBanner.bgOpacity / 100,
                  }}
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/40 z-0 pointer-events-none" />

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
                  <span className="text-xs font-bold text-azure-400 block">
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
                            className="inline-flex items-center gap-1.5 text-xs text-azure-600 hover:text-azure-700 font-bold bg-azure-50 px-3 py-1.5 rounded-lg border border-azure-200 transition-colors whitespace-nowrap"
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
                  </div>

                  {/* Cột phải: Sidebar dịch vụ y như thật */}
                  <div className="lg:col-span-4 space-y-4">
                    <div className="bg-slate-50 p-5 rounded-2xl border border-slate-200">
                      <h4 className="font-bold text-sm text-slate-900 mb-3 border-b border-slate-200 pb-2">
                        Tất Cả 4 Dịch Vụ Trọng Tâm
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
