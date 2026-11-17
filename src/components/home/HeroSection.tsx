"use client";

import React from "react";
import Link from "next/link";
import {
  ArrowRight,
  ShieldCheck,
  Clock,
  Award,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/context";

export function HeroSection({ hotline = "0904.382.268" }: { hotline?: string }) {
  const { t } = useLanguage();

  return (
    <section className="relative bg-gradient-to-b from-slate-50/80 via-white to-slate-50/40 text-slate-900 overflow-hidden py-16 sm:py-24 lg:py-28 border-b border-slate-200/80">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Bố cục 1 cột căn trái hiện đại (Left-aligned Minimalist) với nhiều khoảng thở */}
        <div className="max-w-3xl space-y-6">
          {/* Wayfind Transit Signal Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-azure-50 border border-azure-200/80 text-azure-800 text-xs font-semibold shadow-xs">
            <span className="relative flex h-2 w-2">
              <span className="animate-transit-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span>{t.hero.borderNotice}</span>
          </div>

          {/* Tiêu đề chính định vị thương hiệu GT Logistics */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.12] text-slate-950">
            {t.hero.titleMain}{" "}
            <span className="text-azure-600 font-black">
              {t.hero.titleHighlight}
            </span>
          </h1>

          {/* Giới thiệu súc tích sứ mệnh & năng lực doanh nghiệp */}
          <p className="text-slate-600 text-base sm:text-xl leading-relaxed font-normal pt-1">
            {t.hero.desc}
          </p>

          {/* Slogan chính thức từ logo */}
          <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-xl bg-white border border-gold-400/50 shadow-xs text-xs sm:text-sm text-slate-800">
            <span className="text-gold-600 font-bold">{t.hero.sloganLabel}:</span>
            <span className="font-semibold text-slate-900">
              {t.common.slogan}
            </span>
          </div>

          {/* Quick Actions Buttons: Nút chính Xanh Azure thương hiệu, nút phụ viền Slate */}
          <div className="flex flex-wrap items-center gap-4 pt-2">
            <Link href="/quote">
              <Button
                variant="primary"
                size="lg"
                className="font-bold tap-press shadow-md shadow-azure-600/20 px-6 py-3"
              >
                <span>{t.hero.btnQuote}</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>
            <Link href="/about">
              <Button
                variant="outline"
                size="lg"
                className="bg-white border-slate-300 text-slate-800 hover:bg-slate-50 hover:border-slate-400 font-semibold tap-press px-6 py-3"
              >
                {t.hero.btnProfile}
              </Button>
            </Link>
          </div>

          {/* Đặc điểm cốt lõi doanh nghiệp Móng Cái (Trust Signals) */}
          <div className="pt-8 mt-4 border-t border-slate-200/90 grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs sm:text-sm text-slate-700">
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/70 border border-slate-200/60 shadow-xs">
              <ShieldCheck className="w-5 h-5 text-gold-500 shrink-0" />
              <span className="font-medium text-slate-800">{t.hero.badgeInsurance}</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/70 border border-slate-200/60 shadow-xs">
              <Clock className="w-5 h-5 text-azure-600 shrink-0" />
              <span className="font-medium text-slate-800">{t.hero.badgeSameDay}</span>
            </div>
            <div className="flex items-center gap-2.5 p-3 rounded-xl bg-white/70 border border-slate-200/60 shadow-xs">
              <Award className="w-5 h-5 text-gold-500 shrink-0" />
              <span className="font-medium text-slate-800">{t.hero.badge247}</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
