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

  // Đảm bảo chỉ hiển thị 5 dịch vụ chính thức
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
        {/* Đưa toàn bộ Header và các thẻ Dịch vụ vào 1 khối thống nhất, liền mạch */}
        <div className="rounded-3xl border border-slate-300 bg-white overflow-hidden shadow-xs grid grid-cols-1 lg:grid-cols-12 items-stretch">
          {/* Cột Trái: Header dịch vụ lấy ảnh làm nền, tiêu đề căn dọc chính giữa */}
          <div className="lg:col-span-5 relative p-8 sm:p-10 lg:p-12 flex flex-col justify-center border-b lg:border-b-0 lg:border-r border-slate-300 min-h-[440px]">
            {/* Ảnh nền thực tế vận tải đa phương thức */}
            <div className="absolute inset-0 pointer-events-none">
              <Image
                src="/images/vietphuc/presentation_multimodal.webp"
                alt="GT Logistics Services Overview"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center"
              />
              {/* Lớp phủ sáng trong suốt vừa đủ để nổi bật ảnh nền */}
              <div className="absolute inset-0 bg-white/80" />
              <div className="absolute inset-0 bg-gradient-to-r from-white/95 via-white/85 to-white/75" />
            </div>

            {/* Nội dung Header căn dọc ở giữa khối, không bị dính lên đỉnh */}
            <div className="relative z-10 space-y-5 my-auto">
              <div>
                <div className="h-1 w-12 bg-azure-600 rounded-full mb-3" />
                <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight leading-tight">
                  {t.services.heading}
                </h2>
              </div>

              <p className="text-slate-700 text-sm sm:text-base leading-relaxed font-medium">
                {t.services.desc}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3">
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

              <div className="pt-2 flex items-center gap-2.5 text-xs text-slate-700 font-semibold">
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

          {/* Cột Phải: Các thẻ dịch vụ xếp dọc nằm trong cùng khối, viền đậm rõ nét */}
          <div className="lg:col-span-7 p-6 sm:p-8 lg:p-10 flex flex-col justify-center gap-3.5 bg-slate-50/50">
            {activeServices.map((s) => {
              const Icon = iconMap[s.iconName] || Truck;
              const title = getTitle(s);
              const desc = getShortDesc(s);

              return (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  className="group bg-white rounded-xl p-4 sm:p-4.5 border border-slate-300 hover:border-azure-600 hover:bg-slate-50/80 shadow-xs hover:shadow-sm transition-colors duration-150 flex items-center justify-between gap-4 tap-press"
                >
                  <div className="flex items-center gap-3.5 sm:gap-4 min-w-0">
                    <div className="w-11 h-11 rounded-lg bg-azure-50 text-azure-700 border border-azure-200 flex items-center justify-center shrink-0 group-hover:bg-azure-600 group-hover:text-white transition-colors duration-150">
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
