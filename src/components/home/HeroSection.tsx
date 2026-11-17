"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Clock,
  Award,
  MapPin,
  Building,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/context";

export function HeroSection({ hotline = "0904.382.268" }: { hotline?: string }) {
  const { t } = useLanguage();
  const cleanPhone = hotline.replace(/[^0-9]/g, "");

  return (
    <section className="relative bg-slate-950 text-white overflow-hidden py-14 sm:py-18 lg:py-20 border-b border-slate-800">
      {/* Authentic panoramic office photo background with modern subtle overlay */}
      <div
        className="absolute inset-0 z-0 opacity-15 bg-cover bg-center mix-blend-luminosity pointer-events-none"
        style={{
          backgroundImage: "url('/images/vietphuc/hero_office_panoramic.webp')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/95 to-slate-900/85 z-0 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Khối Giới thiệu Doanh nghiệp duy nhất - Chữ sáng trên nền đậm, kích thước chữ tinh gọn */}
        <div className="max-w-3xl space-y-5">
          {/* Wayfind Transit Signal Badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-900/90 border border-azure-500/40 text-azure-300 text-xs font-semibold shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-transit-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>{t.hero.borderNotice}</span>
          </div>

          {/* Tiêu đề chính định vị thương hiệu GT Logistics - Cỡ chữ tinh gọn, trang nhã */}
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight leading-snug text-white">
            {t.hero.titleMain}{" "}
            <span className="text-gold-400 font-black">
              {t.hero.titleHighlight}
            </span>
          </h1>

          {/* Giới thiệu súc tích sứ mệnh & năng lực doanh nghiệp */}
          <p className="text-slate-300 text-sm sm:text-base leading-relaxed font-normal">
            {t.hero.desc}
          </p>

          {/* Slogan chính thức từ logo */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900/90 border border-gold-500/30 text-xs sm:text-sm">
            <span className="text-gold-400 font-bold">{t.hero.sloganLabel}:</span>
            <span className="font-semibold text-gold-200">
              {t.common.slogan}
            </span>
          </div>

          {/* Thông tin pháp lý & trụ sở thực địa xác thực của GT Logistics */}
          <div className="p-4 rounded-xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-2">
            <div className="flex items-center gap-2 text-white font-semibold">
              <Building className="w-4 h-4 text-azure-400 shrink-0" />
              <span>{t.common.companyName}</span>
              <span className="text-slate-500">|</span>
              <span className="text-slate-400 font-normal">{t.common.taxCode}:</span>
              <span className="text-gold-400 font-mono font-bold">5701750095</span>
            </div>
            <div className="flex items-start gap-2 text-slate-400">
              <MapPin className="w-4 h-4 text-gold-400 shrink-0 mt-0.5" />
              <span>{t.common.hqAddress}</span>
            </div>
          </div>

          {/* Quick Actions Buttons: Nút chính Xanh Azure thương hiệu, nút gọi tư vấn */}
          <div className="flex flex-wrap items-center gap-3 pt-1">
            <Link href="/quote">
              <Button
                variant="primary"
                size="md"
                className="font-bold tap-press shadow-md shadow-azure-900/40 px-5 py-2.5 text-sm"
              >
                <span>{t.hero.btnQuote}</span>
                <ArrowRight className="w-4 h-4 ml-1.5" />
              </Button>
            </Link>
            <a
              href={`tel:${cleanPhone}`}
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl border border-slate-700 bg-slate-900/80 text-slate-200 hover:bg-slate-800 hover:text-white text-sm font-semibold transition-colors tap-press"
            >
              <span>{t.common.hotline}: {hotline}</span>
            </a>
          </div>

          {/* Đặc điểm cốt lõi doanh nghiệp Móng Cái (Trust Signals) */}
          <div className="pt-5 border-t border-slate-800/80 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-gold-400 shrink-0" />
              <span className="font-medium text-slate-200">{t.hero.badgeInsurance}</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-azure-400 shrink-0" />
              <span className="font-medium text-slate-200">{t.hero.badgeSameDay}</span>
            </div>
            <div className="flex items-center gap-2">
              <Award className="w-4 h-4 text-gold-400 shrink-0" />
              <span className="font-medium text-slate-200">{t.hero.badge247}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
