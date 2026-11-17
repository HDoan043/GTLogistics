"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, PhoneCall, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useLanguage } from "@/lib/i18n/context";

export function HeroSection({ hotline = "0904.382.268" }: { hotline?: string }) {
  const { t } = useLanguage();
  const cleanPhone = hotline.replace(/[^0-9]/g, "");

  return (
    <section className="relative bg-slate-950 text-white overflow-hidden py-16 sm:py-20 lg:py-24 border-b border-slate-800">
      {/* Ảnh nền thực tế toàn cảnh văn phòng GT Logistics, tăng độ hiển thị rõ nét hơn */}
      <div
        className="absolute inset-0 z-0 opacity-45 bg-cover bg-center mix-blend-luminosity pointer-events-none scale-100"
        style={{
          backgroundImage: "url('/images/vietphuc/hero_office_panoramic.webp')",
        }}
      />
      {/* Lớp phủ nền tối trong suốt để chữ hiển thị tương phản sắc nét */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-950/92 via-slate-950/80 to-slate-900/65 z-0 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-4">
          {/* Tiêu đề chính: GT LOGISTICS - mô phỏng chuẩn màu sắc logo */}
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-none text-white flex items-center gap-3">
            <span className="text-azure-400">GT</span>
            <span className="text-gold-400">LOGISTICS</span>
          </h1>

          {/* Tiêu đề phụ: Khẩu hiệu doanh nghiệp, nhỏ hơn tiêu đề chính nhưng to hơn nội dung */}
          <div className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-200 tracking-wide">
            {t.common.slogan}
          </div>

          {/* Đường kẻ phân cách tinh tế giữa tiêu đề và nội dung */}
          <div className="h-0.5 w-20 bg-gradient-to-r from-azure-400 to-gold-400 rounded-full my-3" />

          {/* Nội dung giới thiệu in trực tiếp lên nền (không đóng khung), bố trí thành bullet rõ ràng */}
          <div className="space-y-3 pt-1 text-slate-300 text-sm sm:text-base leading-relaxed">
            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-azure-400 shrink-0 mt-1" />
              <span>
                {t.hero.desc}
              </span>
            </div>

            <div className="flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 text-gold-400 shrink-0 mt-1" />
              <span className="font-semibold text-slate-100">
                {t.hero.borderNotice}
              </span>
            </div>

            <div className="flex items-start gap-2.5 text-xs sm:text-sm text-slate-400">
              <span className="w-1.5 h-1.5 rounded-full bg-gold-400 shrink-0 mt-2 ml-1.5" />
              <span>
                Mạng lưới văn phòng điều hành: Móng Cái (Quảng Ninh) & Cửa khẩu Quốc tế Hữu Nghị (Lạng Sơn) • MST: 5701750095
              </span>
            </div>
          </div>

          {/* Nút hành động: Yêu cầu báo giá nhanh và Liên hệ */}
          <div className="flex flex-wrap items-center gap-4 pt-4">
            <Link href="/quote">
              <Button
                variant="primary"
                size="md"
                className="font-bold tap-press shadow-md shadow-azure-900/40 px-6 py-3 text-sm"
              >
                <span>{t.hero.btnQuote}</span>
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </Link>

            <a
              href={`tel:${cleanPhone}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl border border-slate-700 bg-slate-900/80 text-slate-100 hover:bg-slate-800 hover:text-white text-sm font-semibold transition-colors tap-press"
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
