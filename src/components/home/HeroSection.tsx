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
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/context";

export function HeroSection({ hotline = "0904.382.268" }: { hotline?: string }) {
  const [trackingInput, setTrackingInput] = useState("");
  const router = useRouter();
  const { t } = useLanguage();

  const handleTracking = (e: React.FormEvent) => {
    e.preventDefault();
    if (trackingInput.trim()) {
      router.push(`/tracking?code=${encodeURIComponent(trackingInput.trim())}`);
    }
  };

  return (
    <section className="relative bg-slate-950 text-white overflow-hidden py-16 lg:py-24 border-b border-slate-800">
      {/* Background authentic panoramic office photo with dark executive gradient overlay */}
      <div
        className="absolute inset-0 z-0 opacity-25 bg-cover bg-center mix-blend-luminosity scale-105 transition-transform duration-1000"
        style={{
          backgroundImage: "url('/images/vietphuc/hero_office_panoramic.webp')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-blue-950/70 z-0" />

      {/* Decorative High-Tech Glow Elements */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Cột trái: Tiêu đề & Thông điệp GT LOGISTICS */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900/90 border border-amber-500/40 text-amber-300 text-xs font-semibold tracking-wide backdrop-blur-md shadow-sm">
              <span className="w-2 h-2 rounded-full bg-amber-400 animate-pulse" />
              <span>{t.hero.borderNotice}</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight sm:leading-none text-white">
              {t.hero.titleMain} <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-200">
                {t.hero.titleHighlight}
              </span>
            </h1>

            <p className="text-slate-300 text-base sm:text-lg leading-relaxed max-w-2xl font-normal">
              {t.hero.desc}
            </p>

            {/* Slogan chính thức trên biển hiệu */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white/5 border border-amber-500/20 backdrop-blur-sm text-xs sm:text-sm text-slate-200">
              <span className="text-amber-400 font-bold">{t.hero.sloganLabel}:</span>
              <span className="font-semibold tracking-wide uppercase text-amber-200">
                {t.common.slogan}
              </span>
            </div>

            {/* Quick Actions Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link href="/quote">
                <Button variant="accent" size="lg" className="font-bold shadow-lg shadow-amber-500/25">
                  <span>{t.hero.btnQuote}</span>
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
              </Link>
              <Link href="/about">
                <Button
                  variant="outline"
                  size="lg"
                  className="bg-white/5 border-slate-700 text-white hover:bg-white/15 hover:border-slate-500 font-semibold"
                >
                  {t.hero.btnProfile}
                </Button>
              </Link>
            </div>

            {/* Key Trust Badges */}
            <div className="pt-6 border-t border-slate-800/80 grid grid-cols-3 gap-4 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{t.hero.badgeInsurance}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{t.hero.badgeSameDay}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-amber-400 shrink-0" />
                <span>{t.hero.badge247}</span>
              </div>
            </div>
          </div>

          {/* Cột phải: Hộp Tra cứu Vận Đơn & Điểm Nổi Bật Nhanh */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-2xl text-slate-800 border border-slate-100">
              <div className="flex items-center gap-2 mb-2">
                <Search className="w-5 h-5 text-blue-700" />
                <h2 className="text-xl font-bold text-slate-900">
                  {t.hero.trackingTitle}
                </h2>
              </div>
              <p className="text-xs text-slate-500 mb-6">
                {t.hero.trackingDesc}
              </p>

              <form onSubmit={handleTracking} className="space-y-4">
                <div>
                  <label htmlFor="trackingCode" className="block text-xs font-bold text-slate-700 mb-1.5 uppercase">
                    {t.trackingPage.title}
                  </label>
                  <div className="relative">
                    <input
                      id="trackingCode"
                      type="text"
                      value={trackingInput}
                      onChange={(e) => setTrackingInput(e.target.value)}
                      placeholder={t.hero.trackingPlaceholder}
                      className="w-full pl-4 pr-10 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all font-mono"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                  </div>
                </div>

                <Button type="submit" variant="accent" size="lg" className="w-full font-bold shadow-md shadow-amber-500/20">
                  <span>{t.hero.trackingBtn}</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>

              {/* Gợi ý tra cứu nhanh */}
              <div className="mt-5 pt-4 border-t border-slate-100 text-xs text-slate-500">
                <span className="font-semibold text-slate-700">{t.hero.trackingSamples} </span>
                <button
                  type="button"
                  onClick={() => setTrackingInput("GT889922")}
                  className="font-mono text-blue-700 hover:underline mx-1 font-bold"
                >
                  GT889922
                </button>
                {" • "}
                <button
                  type="button"
                  onClick={() => setTrackingInput("GT556677")}
                  className="font-mono text-blue-700 hover:underline mx-1 font-bold"
                >
                  GT556677
                </button>
              </div>

              {/* Thông tin trực tiếp */}
              <div className="mt-4 p-3 bg-amber-50/70 border border-amber-200/80 rounded-xl flex items-center justify-between text-xs">
                <span className="text-slate-600">{t.hero.trackingSupport}</span>
                <a href={`tel:${hotline.replace(/[^0-9]/g, "")}`} className="font-bold text-amber-800 hover:underline">
                  {hotline}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
