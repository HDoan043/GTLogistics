"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Truck,
  Ship,
  FileCheck,
  Warehouse,
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
  Warehouse,
  ShieldCheck,
  Globe,
};

export function ServicesSection({ services }: { services: ServiceItem[] }) {
  const { t, locale } = useLanguage();

  const getTitle = (s: ServiceItem) => {
    if (locale === "zh") return s.titleZh || s.title;
    if (locale === "en") return s.titleEn || s.title;
    return s.title;
  };

  return (
    <section className="relative py-16 sm:py-24 bg-slate-50 text-slate-900 border-b border-slate-200/80 overflow-hidden">
      {/* Nền ảnh thực tế hoạt động đa phương thức có phủ lớp sáng tương phản cao */}
      <div className="absolute inset-0 pointer-events-none">
        <Image
          src="/images/vietphuc/presentation_multimodal.webp"
          alt="GT Logistics Multimodal Operations"
          fill
          sizes="100vw"
          className="object-cover opacity-15"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-50/98 via-white/95 to-slate-50/98" />
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Cột Trái: Tiêu đề ngắn gọn & Giới thiệu (So le trái) */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="h-1 w-12 bg-azure-600 rounded-full mb-4" />
              <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
                {t.services.heading}
              </h2>
              <p className="mt-4 text-slate-600 text-base leading-relaxed">
                {t.services.desc}
              </p>
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
              <Link
                href="/services"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-azure-600 hover:bg-azure-700 text-white font-bold text-sm shadow-xs transition-colors duration-150 tap-press"
              >
                <span>{t.common.allServices}</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/quote"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-semibold text-sm transition-colors duration-150 tap-press"
              >
                <span>{t.common.quote}</span>
              </Link>
            </div>

            <div className="pt-4 border-t border-slate-200/80 flex items-center gap-3 text-xs text-slate-500">
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

          {/* Cột Phải: Danh sách các thẻ dịch vụ tinh gọn (Chỉ icon + tiêu đề) */}
          <div className="lg:col-span-7">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {services.map((s) => {
                const Icon = iconMap[s.iconName] || Truck;
                const title = getTitle(s);

                return (
                  <Link
                    key={s.slug}
                    href={`/services/${s.slug}`}
                    className="group bg-white rounded-xl p-4 sm:p-5 border border-slate-200/90 shadow-xs hover:border-azure-500 hover:shadow-md hover:bg-slate-50/60 transition-colors duration-150 flex items-center justify-between gap-3.5 tap-press"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-11 h-11 rounded-lg bg-azure-50 text-azure-700 border border-azure-100 flex items-center justify-center shrink-0 group-hover:bg-azure-600 group-hover:text-white transition-colors duration-150">
                        <Icon className="w-5 h-5" />
                      </div>
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-azure-700 transition-colors duration-150 truncate">
                        {title}
                      </h3>
                    </div>
                    <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-azure-600 group-hover:translate-x-0.5 transition-transform duration-200 shrink-0" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
