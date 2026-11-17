"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Truck,
  Ship,
  FileCheck,
  ShieldCheck,
  Globe,
  ArrowRight,
  PhoneCall,
} from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";

interface ServiceItem {
  id: string;
  title: string;
  titleEn?: string | null;
  titleZh?: string | null;
  slug: string;
  shortDesc: string;
  shortDescEn?: string | null;
  shortDescZh?: string | null;
  iconName: string;
  bannerImage: string;
}

const iconMap: Record<string, React.ElementType> = {
  Truck,
  Ship,
  FileCheck,
  ShieldCheck,
  Globe,
};

export function ServicesSection({ services }: { services: ServiceItem[] }) {
  const { t, locale } = useLanguage();

  // Đảm bảo loại bỏ kho bãi và chuỗi lạnh nếu còn sót từ cache
  const activeServices = services.filter(
    (s) =>
      s.slug !== "kho-bai-chuoi-cung-ung" &&
      s.slug !== "van-tai-thuy-tuyen-dao"
  );

  const getTitle = (s: ServiceItem) => {
    if (locale === "zh") return s.titleZh || s.title;
    if (locale === "en") return s.titleEn || s.title;
    return s.title;
  };

  const getShortDesc = (s: ServiceItem) => {
    if (locale === "zh") return s.shortDescZh || s.shortDesc;
    if (locale === "en") return s.shortDescEn || s.shortDesc;
    return s.shortDesc;
  };

  return (
    <section className="py-16 sm:py-24 bg-slate-50 text-slate-900 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-stretch">
          {/* Cột Trái: Thẻ Header Dịch Vụ có hình nền thực tế & lớp phủ trắng trong suốt làm nổi bật ảnh */}
          <div className="lg:col-span-5 relative rounded-2xl overflow-hidden border border-slate-200 shadow-xs flex flex-col justify-between min-h-[380px] p-6 sm:p-8">
            {/* Ảnh nền thực tế hoạt động vận tải đa phương thức */}
            <div className="absolute inset-0 pointer-events-none">
              <Image
                src="/images/vietphuc/presentation_multimodal.webp"
                alt="GT Logistics Services Overview"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center"
              />
              {/* Lớp màu trắng trong suốt vừa đủ để ảnh nổi bật nhưng chữ vẫn rõ nét tuyệt đối */}
              <div className="absolute inset-0 bg-white/80" />
              <div className="absolute inset-0 bg-gradient-to-b from-white/90 via-white/75 to-white/95" />
            </div>

            {/* Nội dung Header phía trên */}
            <div className="relative z-10 space-y-4">
              <div className="h-1 w-12 bg-azure-600 rounded-full" />
              <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
                {t.services.heading}
              </h2>
              <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-medium">
                {t.services.desc}
              </p>
            </div>

            {/* Cụm hành động & Hotline phía dưới */}
            <div className="relative z-10 pt-6 space-y-4 border-t border-slate-200/80 mt-6">
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-azure-600 hover:bg-azure-700 text-white font-bold text-sm shadow-xs transition-colors duration-150 tap-press"
                >
                  <span>{t.common.allServices}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/quote"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-semibold text-sm transition-colors duration-150 tap-press"
                >
                  <span>{t.common.quote}</span>
                </Link>
              </div>

              <div className="flex items-center gap-2.5 text-xs text-slate-700 font-semibold">
                <PhoneCall className="w-4 h-4 text-gold-600 shrink-0" />
                <span>
                  {locale === "zh"
                    ? "口岸现场 24/7 专人对接: 0904.382.268"
                    : locale === "en"
                    ? "Direct Border Clearance 24/7 Hotline: 0904.382.268"
                    : "Trực tiếp thông quan tại cửa khẩu 24/7: 0904.382.268"}
                </span>
              </div>
            </div>
          </div>

          {/* Cột Phải: Bố trí các thẻ xếp dọc, tất cả đều có viền rõ ràng */}
          <div className="lg:col-span-7 flex flex-col justify-between gap-3 sm:gap-3.5">
            {activeServices.map((s) => {
              const Icon = iconMap[s.iconName] || Truck;
              const title = getTitle(s);
              const desc = getShortDesc(s);

              return (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  className="group bg-white rounded-xl p-4 sm:p-4.5 border border-slate-200 hover:border-azure-500 hover:bg-slate-50/70 shadow-xs hover:shadow-sm transition-colors duration-150 flex items-center justify-between gap-4 tap-press"
                >
                  <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                    <div className="w-11 h-11 rounded-lg bg-azure-50 text-azure-700 border border-azure-200/80 flex items-center justify-center shrink-0 group-hover:bg-azure-600 group-hover:text-white transition-colors duration-150">
                      <Icon className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-azure-700 transition-colors duration-150 truncate">
                        {title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-0.5 truncate hidden sm:block">
                        {desc}
                      </p>
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-azure-600 group-hover:translate-x-1 transition-transform duration-200 shrink-0" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
