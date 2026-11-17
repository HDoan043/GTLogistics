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
    <section className="relative bg-slate-950 text-white overflow-hidden py-14 lg:py-20 border-b border-slate-800">
      {/* Authentic panoramic office photo background */}
      <div
        className="absolute inset-0 z-0 opacity-20 bg-cover bg-center mix-blend-luminosity scale-100"
        style={{
          backgroundImage: "url('/images/vietphuc/hero_office_panoramic.webp')",
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/95 to-slate-900/80 z-0" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* Cột trái: Tiêu đề & Thông điệp GT LOGISTICS */}
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900 border border-gold-500/30 text-gold-300 text-xs font-medium shadow-sm">
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
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-900 border border-gold-500/20 text-xs sm:text-sm text-slate-200">
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
                <span>{t.hero.badgeInsurance}</span>
              </div>
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-gold-400 shrink-0" />
                <span>{t.hero.badgeSameDay}</span>
              </div>
              <div className="flex items-center gap-2">
                <Award className="w-4 h-4 text-gold-400 shrink-0" />
                <span>{t.hero.badge247}</span>
              </div>
            </div>
          </div>

          {/* Cột phải: Hộp Tra cứu Vận Đơn */}
          <div className="lg:col-span-5">
            <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-lg border border-slate-200 text-slate-800">
              <div className="flex items-center gap-2 mb-2">
                <Search className="w-5 h-5 text-azure-600" />
                <h2 className="text-xl font-bold text-slate-900">
                  {t.hero.trackingTitle}
                </h2>
              </div>
              <p className="text-xs text-slate-500 mb-5">
                {t.hero.trackingDesc}
              </p>

              <form onSubmit={handleTracking} className="space-y-4">
                <div>
                  <label htmlFor="trackingCode" className="block text-xs font-semibold text-slate-700 mb-1.5">
                    {t.trackingPage.title}
                  </label>
                  <div className="relative">
                    <input
                      id="trackingCode"
                      type="text"
                      value={trackingInput}
                      onChange={(e) => setTrackingInput(e.target.value)}
                      placeholder={t.hero.trackingPlaceholder}
                      className="w-full pl-4 pr-10 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-500 focus:bg-white transition-colors font-mono"
                    />
                    <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3.5" />
                  </div>
                </div>

                <Button type="submit" variant="accent" size="lg" className="w-full font-bold tap-press shadow-md shadow-gold-500/10">
                  <span>{t.hero.trackingBtn}</span>
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Button>
              </form>

              {/* Gợi ý tra cứu nhanh */}
              <div className="mt-4 pt-3.5 border-t border-slate-100 text-xs text-slate-500 flex items-center gap-2 flex-wrap">
                <span className="font-semibold text-slate-700">{t.hero.trackingSamples}:</span>
                <button
                  type="button"
                  onClick={() => {
                    setTrackingInput("GT889922");
                    router.push("/tracking?code=GT889922");
                  }}
                  className="font-mono text-azure-700 hover:text-azure-800 font-bold bg-azure-50 hover:bg-azure-100 px-2.5 py-1 rounded-lg transition-colors tap-press border border-azure-200/60"
                >
                  GT889922
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setTrackingInput("GT556677");
                    router.push("/tracking?code=GT556677");
                  }}
                  className="font-mono text-azure-700 hover:text-azure-800 font-bold bg-azure-50 hover:bg-azure-100 px-2.5 py-1 rounded-lg transition-colors tap-press border border-azure-200/60"
                >
                  GT556677
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
