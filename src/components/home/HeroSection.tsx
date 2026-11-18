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
    subHeadline?: string;
    subHeadlineEn?: string;
    subHeadlineZh?: string;
    btnQuote?: string;
    btnQuoteEn?: string;
    btnQuoteZh?: string;
    btnHotline?: string;
    bgImage?: string;
    bgScale?: number;
    bgPosition?: string;
    bgOpacity?: number;
    bullets?: Array<{ vi: string; en?: string; zh?: string }>;
  };
}

export function HeroSection({ hotline = "0904.382.268", heroData }: HeroSectionProps) {
  const { locale } = useLanguage();
  const cleanPhone = hotline.replace(/[^0-9]/g, "");

  const companyTitle =
    heroData?.titleGt || "CÔNG TY TNHH LOGISTICS GT";

  const slogan =
    locale === "zh" && heroData?.sloganZh
      ? heroData.sloganZh
      : locale === "en" && heroData?.sloganEn
      ? heroData.sloganEn
      : heroData?.slogan || "ĐỒNG HÀNH TIN CẬY – PHÁT TRIỂN BỀN VỮNG";

  const subHeadline =
    locale === "zh" && heroData?.subHeadlineZh
      ? heroData.subHeadlineZh
      : locale === "en" && heroData?.subHeadlineEn
      ? heroData.subHeadlineEn
      : heroData?.subHeadline ||
        "Đơn vị tiên phong cung cấp giải pháp vận tải đường bộ liên vận Việt – Trung, thông quan chính ngạch tại hệ thống các cửa khẩu trọng điểm phía Bắc (Móng Cái, Hữu Nghị, Tân Thanh, Chi Ma) và khai thác chuyên tuyến Vận tải biển bằng tàu & sà lan đi khắp quần đảo Cô Tô.";

  const btnQuoteText =
    locale === "zh" && heroData?.btnQuoteZh
      ? heroData.btnQuoteZh
      : locale === "en" && heroData?.btnQuoteEn
      ? heroData.btnQuoteEn
      : heroData?.btnQuote || "Nhận Báo Giá Trong 15 Phút";

  const btnHotlineText =
    heroData?.btnHotline || `Hotline Tư Vấn 24/7: ${hotline}`;

  const bgImage = heroData?.bgImage || "/images/vietphuc/hero_fleet_6k3a8950.webp";
  const bgScale = heroData?.bgScale || 100;
  const bgPosition = heroData?.bgPosition || "center";
  const bgOpacity = heroData?.bgOpacity ?? 55;

  return (
    <section className="relative bg-slate-950 text-white overflow-hidden py-20 sm:py-24 lg:py-28 border-b border-slate-800">
      {/* Ảnh nền thực tế sáng rõ, màu sắc sống động tự nhiên theo yêu cầu người dùng */}
      <div
        className="absolute inset-0 z-0 bg-cover pointer-events-none"
        style={{
          backgroundImage: `url('${bgImage}')`,
          backgroundSize: `${bgScale}%`,
          backgroundPosition: bgPosition,
          opacity: bgOpacity / 100,
        }}
      />
      {/* Lớp phủ chuyển màu gradient dịu nhẹ: Giữ chữ rõ nét nhưng nền ảnh văn phòng & xe vẫn sáng rõ rệt */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/90 via-slate-950/70 to-slate-950/25 z-0 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          {/* Tiêu đề chính tên công ty & khẩu hiệu doanh nghiệp chuẩn xác */}
          <div className="space-y-3">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-tight text-white">
              {companyTitle}
            </h1>
            <div className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-100 tracking-wide">
              {slogan}
            </div>
          </div>

          {/* Dòng kẻ ngăn cách rõ nét giữa cụm tiêu đề và nội dung */}
          <div className="my-6 sm:my-8 h-1 w-24 bg-gradient-to-r from-azure-400 to-gold-400 rounded-full" />

          {/* Đoạn mô tả ngắn dưới dấu gạch: gọn gàng, súc tích, làm bật các cửa khẩu trọng điểm & biển đảo Cô Tô */}
          <p className="text-sm sm:text-base lg:text-lg text-slate-200 leading-relaxed font-normal">
            {subHeadline}
          </p>

          {/* Cụm 2 nút hành động: Nhận Báo Giá Trong 15 Phút & Hotline Tư Vấn 24/7 */}
          <div className="pt-8 sm:pt-10 flex flex-wrap items-center gap-4">
            <Link href="/quote">
              <Button
                variant="primary"
                size="md"
                className="font-bold tap-press shadow-md shadow-azure-900/40 px-6 py-3.5 text-sm"
              >
                <span>{btnQuoteText}</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>

            <a
              href={`tel:${cleanPhone}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-slate-700 bg-slate-900/80 text-slate-100 hover:bg-slate-800 hover:text-white text-sm font-semibold transition-colors duration-150 tap-press"
            >
              <PhoneCall className="w-4 h-4 text-gold-400" />
              <span>{btnHotlineText}</span>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
