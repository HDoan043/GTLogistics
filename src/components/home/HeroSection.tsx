"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Search,
  ArrowRight,
  ShieldCheck,
  Clock,
  Award,
  Truck,
  MapPin,
  CheckCircle2,
  Navigation2,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/context";

export function HeroSection({ hotline = "0904.382.268" }: { hotline?: string }) {
  const [trackingInput, setTrackingInput] = useState("");
  const [activeTab, setActiveTab] = useState<"corridor" | "tracking">("corridor");
  const router = useRouter();
  const { t, locale } = useLanguage();

  const handleTracking = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingInput.trim()) {
      router.push(`/tracking?code=${encodeURIComponent(trackingInput.trim())}`);
    }
  };

  const cleanPhone = hotline.replace(/[^0-9]/g, "");

  // Corridor route data (localized labels based on active language)
  const routes = [
    {
      from: locale === "zh" ? "芒街口岸 (VN)" : locale === "en" ? "Mong Cai Border (VN)" : "Cửa khẩu Móng Cái (VN)",
      to: locale === "zh" ? "东兴口岸 / 防城港 (CN)" : locale === "en" ? "Dongxing Port / Fangchenggang (CN)" : "Đông Hưng / Phòng Thành (CN)",
      gate: locale === "zh" ? "北仑一/二桥 · Km3+4 海安通道" : locale === "en" ? "Bac Luan I/II · Km3+4 Hai Yen" : "Cầu Bắc Luân I/II · Km3+4 Hải Yên",
      time: "2 - 4h",
      status: locale === "zh" ? "正常通关" : locale === "en" ? "Clear & Running" : "Thông suốt / Bình thường",
      type: "FTL / LTL",
    },
    {
      from: locale === "zh" ? "东兴 / 广州 / 深圳" : locale === "en" ? "Dongxing / Guangzhou / Shenzhen" : "Đông Hưng ⇄ Quảng Châu / Thâm Quyến",
      to: locale === "zh" ? "越南全国各省市" : locale === "en" ? "Nationwide Vietnam" : "Hà Nội / Hải Phòng / Bắc Ninh / Toàn quốc",
      gate: locale === "zh" ? "跨境公路快线 / 恒温冷链" : locale === "en" ? "Cross-border Highway Express" : "Xe liên vận Trung - Việt / Xe lạnh",
      time: "24 - 48h",
      status: locale === "zh" ? "每日发车" : locale === "en" ? "Daily Dispatch" : "Khởi hành hàng ngày",
      type: "Express",
    },
    {
      from: locale === "zh" ? "海防港 / 广宁港" : locale === "en" ? "Hai Phong / Quang Ninh Port" : "Cảng Hải Phòng / Quảng Ninh",
      to: locale === "zh" ? "保税区与内陆工厂" : locale === "en" ? "Bonded Zones & Factories" : "KCN & Kho Ngoại Quan Phía Bắc",
      gate: locale === "zh" ? "保税仓储 · 快速转运" : locale === "en" ? "Bonded Storage & Transfer" : "Hải quan điện tử · Kẹp chì niêm phong",
      time: "4 - 8h",
      status: locale === "zh" ? "全天候响应" : locale === "en" ? "24/7 Operations" : "Điều phối 24/7",
      type: "Logistics Hub",
    },
  ];

  return (
    <section className="relative bg-slate-950 text-white overflow-hidden py-12 lg:py-18 border-b border-slate-800">
      {/* Authentic panoramic office photo background with modern subtle overlay */}
      <div
        className="absolute inset-0 z-0 opacity-15 bg-cover bg-center mix-blend-luminosity scale-100 pointer-events-none"
        style={{
          backgroundImage: "url('/images/vietphuc/hero_office_panoramic.webp')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/95 to-slate-900/80 z-0 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Cột trái: Split Studio - Tiêu đề, Cam kết & Điều hướng hành động */}
          <div className="lg:col-span-7 space-y-5">
            {/* Wayfind Transit Signal Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/90 border border-azure-500/40 text-azure-300 text-xs font-semibold shadow-sm">
              <span className="relative flex h-2 w-2">
                <span className="animate-transit-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span>{t.hero.borderNotice}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-white">
              {t.hero.titleMain}{" "}
              <span className="text-gold-400 font-black">
                {t.hero.titleHighlight}
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
              {t.hero.desc}
            </p>

            {/* Slogan chính thức */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-gold-500/30 text-xs sm:text-sm text-slate-200">
              <span className="text-gold-400 font-semibold">{t.hero.sloganLabel}:</span>
              <span className="font-semibold text-gold-200">
                {t.common.slogan}
              </span>
            </div>

            {/* Quick Actions Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-1">
              <Link href="/quote">
                <Button variant="accent" size="lg" className="font-bold tap-press shadow-md shadow-gold-500/10">
                  <span>{t.hero.btnQuote}</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-white/5 border-slate-700 text-white hover:bg-white/15 hover:border-slate-500 font-semibold tap-press"
                >
                  {t.hero.btnProfile}
                </Button>
              </Link>
            </div>

            {/* Key Trust Badges */}
            <div className="pt-5 border-t border-slate-800/80 grid grid-cols-3 gap-3 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gold-400 shrink-0" />
                <span className="font-medium">{t.hero.badgeInsurance}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gold-400 shrink-0" />
                <span className="font-medium">{t.hero.badgeSameDay}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-gold-400 shrink-0" />
                <span className="font-medium">{t.hero.badge247}</span>
              </div>
            </div>
          </div>

          {/* Cột phải: Split Studio - Thẻ Tương Tác Mạng Lưới Luồng Tuyến Vận Tải & Tra Cứu */}
          <div className="lg:col-span-5">
            <div className="bg-slate-900/95 backdrop-blur-md rounded-2xl border border-slate-700/80 shadow-lg p-5 sm:p-6 text-white overflow-hidden">
              {/* Wayfind Tab Switcher */}
              <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
                <div className="flex items-center gap-1.5 p-1 bg-slate-950/80 rounded-xl border border-slate-800">
                  <button
                    type="button"
                    onClick={() => setActiveTab("corridor")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors tap-press ${
                      activeTab === "corridor"
                        ? "bg-azure-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Navigation2 className="w-3.5 h-3.5" />
                    <span>
                      {locale === "zh" ? "跨境运力走廊" : locale === "en" ? "Transit Corridor" : "Luồng Tuyến Biên Giới"}
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveTab("tracking")}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-colors tap-press ${
                      activeTab === "tracking"
                        ? "bg-azure-600 text-white shadow-sm"
                        : "text-slate-400 hover:text-white"
                    }`}
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>
                      {locale === "zh" ? "实时查单" : locale === "en" ? "Live Track" : "Tra Cứu Nhanh"}
                    </span>
                  </button>
                </div>

                <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span>LIVE 24/7</span>
                </div>
              </div>

              {/* Tab 1: Mạng lưới Luồng tuyến Vận tải Biên giới */}
              {activeTab === "corridor" ? (
                <div className="space-y-3 animate-in fade-in duration-150">
                  <div className="text-xs text-slate-400 flex items-center justify-between pb-1">
                    <span className="font-semibold text-slate-300">
                      {locale === "zh" ? "实时口岸运力状态" : locale === "en" ? "Border Gate Route Operations" : "Tình trạng điều phối & thông quan:"}
                    </span>
                    <span className="text-[11px] text-azure-400 font-medium">Bắc Luân · Km3+4</span>
                  </div>

                  {routes.map((r, idx) => (
                    <div
                      key={idx}
                      className="p-3 bg-slate-950/80 rounded-xl border border-slate-800/90 hover:border-azure-500/40 transition-colors"
                    >
                      <div className="flex items-start justify-between gap-2 mb-1.5">
                        <div className="flex items-center gap-2">
                          <div className="w-6 h-6 rounded-lg bg-azure-900/60 text-azure-400 flex items-center justify-center shrink-0">
                            <Truck className="w-3.5 h-3.5" />
                          </div>
                          <div>
                            <div className="text-xs font-bold text-white leading-snug">
                              {r.from} ⇄ {r.to}
                            </div>
                            <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-gold-400 shrink-0" />
                              <span>{r.gate}</span>
                            </div>
                          </div>
                        </div>

                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-800/60 shrink-0 font-mono tabular-nums">
                          {r.time}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-1.5 border-t border-slate-800/60 text-[11px] text-slate-400">
                        <span className="flex items-center gap-1 text-emerald-400 font-medium">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                          <span>{r.status}</span>
                        </span>
                        <span className="text-slate-400 font-medium">{r.type}</span>
                      </div>
                    </div>
                  ))}

                  <div className="pt-2 flex items-center justify-between text-xs">
                    <button
                      type="button"
                      onClick={() => setActiveTab("tracking")}
                      className="text-azure-400 hover:text-azure-300 font-bold flex items-center gap-1 transition-colors tap-press"
                    >
                      <span>{t.hero.trackingBtn}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <a
                      href={`tel:${cleanPhone}`}
                      className="text-gold-400 hover:text-gold-300 font-bold"
                    >
                      Hotline: <span className="font-mono tabular-nums">{hotline}</span>
                    </a>
                  </div>
                </div>
              ) : (
                /* Tab 2: Tra Cứu Vận Đơn Tức Thời */
                <div className="space-y-4 animate-in fade-in duration-150">
                  <div>
                    <h2 className="text-sm font-bold text-white flex items-center gap-2 mb-1">
                      <Search className="w-4 h-4 text-azure-400" />
                      <span>{t.hero.trackingTitle}</span>
                    </h2>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      {t.hero.trackingDesc}
                    </p>
                  </div>

                  <form onSubmit={handleTracking} className="space-y-3">
                    <div>
                      <label htmlFor="trackingCodeHero" className="block text-xs font-semibold text-slate-300 mb-1.5">
                        {t.trackingPage.title}
                      </label>
                      <div className="relative">
                        <input
                          id="trackingCodeHero"
                          type="text"
                          value={trackingInput}
                          onChange={(e) => setTrackingInput(e.target.value)}
                          placeholder={t.hero.trackingPlaceholder}
                          className="w-full pl-4 pr-10 py-2.5 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-500 font-mono"
                        />
                        <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
                      </div>
                    </div>

                    <Button type="submit" variant="accent" size="md" className="w-full font-bold tap-press shadow-md shadow-gold-500/10">
                      <span>{t.hero.trackingBtn}</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Button>
                  </form>

                  {/* Gợi ý mã tra cứu nhanh */}
                  <div className="pt-2 border-t border-slate-800 text-xs text-slate-400 flex items-center gap-2 flex-wrap">
                    <span className="font-semibold text-slate-300">{t.hero.trackingSamples}:</span>
                    <button
                      type="button"
                      onClick={() => {
                        setTrackingInput("GT889922");
                        router.push("/tracking?code=GT889922");
                      }}
                      className="font-mono text-azure-300 hover:text-white font-bold bg-azure-950/80 hover:bg-azure-900 px-2.5 py-1 rounded-lg transition-colors tap-press border border-azure-800/80"
                    >
                      GT889922
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setTrackingInput("GT556677");
                        router.push("/tracking?code=GT556677");
                      }}
                      className="font-mono text-azure-300 hover:text-white font-bold bg-azure-950/80 hover:bg-azure-900 px-2.5 py-1 rounded-lg transition-colors tap-press border border-azure-800/80"
                    >
                      GT556677
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
