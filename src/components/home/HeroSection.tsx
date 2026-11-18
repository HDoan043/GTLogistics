"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, PhoneCall } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/context";

interface HeroSectionProps {
  hotline?: string;
  heroData?: {
    titleGt?: string;
    titleLogistics?: string;
    slogan?: string;
    sloganEn?: string;
    sloganZh?: string;
    bgImage?: string;
    bullets?: Array<{ vi: string; en?: string; zh?: string }>;
  };
}

export function HeroSection({ hotline = "0904.382.268", heroData }: HeroSectionProps) {
  const { t, locale } = useLanguage();
  const cleanPhone = hotline.replace(/[^0-9]/g, "");

  const titleGt = heroData?.titleGt || "GT";
  const titleLogistics = heroData?.titleLogistics || "LOGISTICS";
  const slogan =
    locale === "zh" && heroData?.sloganZh
      ? heroData.sloganZh
      : locale === "en" && heroData?.sloganEn
      ? heroData.sloganEn
      : heroData?.slogan || t.common.slogan;
  const bgImage = heroData?.bgImage || "/images/vietphuc/hero_office_panoramic.webp";

  const bullets =
    heroData?.bullets && heroData.bullets.length > 0
      ? heroData.bullets.map((b) =>
          locale === "zh" && b.zh ? b.zh : locale === "en" && b.en ? b.en : b.vi
        )
      : [t.hero.desc, t.hero.borderNotice];

  return (
    <section className="relative bg-slate-950 text-white overflow-hidden py-20 sm:py-24 lg:py-28 border-b border-slate-800">
      {/* Ảnh nền thực tế toàn cảnh văn phòng GT Logistics, giữ nguyên màu sắc sống động tự nhiên */}
      <div
        className="absolute inset-0 z-0 opacity-35 bg-cover bg-center pointer-events-none scale-100"
        style={{
          backgroundImage: `url('${bgImage}')`,
        }}
      />
      {/* Lớp phủ chuyển màu gradient: Đậm vững chắc ở bên trái để nổi bật chữ, nhạt dần và trong suốt về bên phải */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-slate-950/20 z-0 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {/* Tiêu đề chính & Tiêu đề phụ (khẩu hiệu doanh nghiệp) */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none text-white flex items-center gap-3">
              <span className="text-azure-400">{titleGt}</span>
              <span className="text-gold-400">{titleLogistics}</span>
            </h1>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-100 tracking-wide">
              {slogan}
            </div>
          </div>

          {/* Dòng kẻ ngăn cách rõ nét giữa cụm tiêu đề và nội dung */}
          <div className="my-8 sm:my-9 h-1 w-24 bg-gradient-to-r from-azure-400 to-gold-400 rounded-full" />

          {/* Dòng nội dung bullet points: cùng kiểu bullet, cùng cỡ chữ, font chữ và màu sắc */}
          <ul className="space-y-4 text-sm sm:text-base text-slate-200 leading-relaxed">
            {bullets.map((bullet, idx) => (
              <li key={idx} className="flex items-start gap-3">
                <span className="w-2 h-2 rounded-full bg-gold-400 shrink-0 mt-2" />
                <span>{bullet}</span>
              </li>
            ))}
          </ul>

          {/* Cụm nút hành động: Cách nội dung một khoảng rộng thoáng đãng */}
          <div className="pt-10 sm:pt-12 flex flex-wrap items-center gap-4">
            <Link href="/quote">
              <Button
                variant="primary"
                size="md"
                className="font-bold tap-press shadow-md shadow-azure-900/40 px-6 py-3.5 text-sm"
              >
                <span>{t.hero.btnQuote}</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>

            <a
              href={`tel:${cleanPhone}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-slate-700 bg-slate-900/80 text-slate-100 hover:bg-slate-800 hover:text-white text-sm font-semibold transition-colors duration-150 tap-press"
            >
              <PhoneCall className="w-4 h-4 text-gold-400" />
              <span>{t.common.contactUs}: {hotline}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
