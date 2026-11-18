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

export function ServicesSection({
  services,
  homeServicesData,
}: {
  services: ServiceItem[];
  homeServicesData?: {
    badge?: string;
    badgeEn?: string;
    badgeZh?: string;
    heading?: string;
    headingEn?: string;
    headingZh?: string;
    description?: string;
    descriptionEn?: string;
    descriptionZh?: string;
    illustrationImage?: string;
  };
}) {
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

  const headingText =
    locale === "zh" && homeServicesData?.headingZh
      ? homeServicesData.headingZh
      : locale === "en" && homeServicesData?.headingEn
      ? homeServicesData.headingEn
      : homeServicesData?.heading || t.services.heading;

  const descText =
    locale === "zh" && homeServicesData?.descriptionZh
      ? homeServicesData.descriptionZh
      : locale === "en" && homeServicesData?.descriptionEn
      ? homeServicesData.descriptionEn
      : homeServicesData?.description || t.services.desc;

  const illustrationImg =
    homeServicesData?.illustrationImage || "/images/vietphuc/presentation_multimodal.webp";

  return (
    <section className="py-16 sm:py-24 bg-slate-50/70 text-slate-900 border-b border-slate-200/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Thiết kế tương đồng 100% với mục Vì sao chọn GT Logistics: 1 bên Header kèm ảnh minh họa bên dưới, 1 bên các thẻ dịch vụ */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Cột Trái: Tiêu đề, giới thiệu, nút bấm và ảnh minh họa tạo điểm nhấn đặt ngay bên dưới */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <div className="h-1 w-12 bg-azure-600 rounded-full mb-4" />
              <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
                {headingText}
              </h2>
              <p className="mt-4 text-slate-600 text-base leading-relaxed">
                {descText}
              </p>

              <div className="pt-4 flex flex-wrap items-center gap-3">
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
            </div>

            {/* Ảnh minh họa nghiệp vụ tiếp vận đặt ngay dưới Header để tạo điểm nhấn trực quan */}
            <div className="relative h-60 sm:h-64 rounded-2xl overflow-hidden shadow-sm border border-slate-200 group">
              <Image
                src={illustrationImg}
                alt="Vận tải đa phương thức & tiếp vận biên mậu Logistics GT"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white flex items-center justify-between">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-md bg-azure-600 text-white text-[11px] font-bold mb-1">
                    {locale === "zh" ? "多式联运网络" : locale === "en" ? "Multimodal Network" : "Mạng Lưới Đa Phương Thức"}
                  </span>
                  <p className="text-xs text-slate-200">
                    {locale === "zh" ? "芒街 - 海防 - 陆海联运通道" : locale === "en" ? "Mong Cai - Hai Phong Route" : "Chuyên tuyến Móng Cái - Hải Phòng - Toàn quốc"}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gold-300 font-semibold">
                  <PhoneCall className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                  <span>0904.382.268</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cột Phải: Danh sách các thẻ dịch vụ xếp dọc, viền đậm và dày hơn 1 chút (border-2) */}
          <div className="lg:col-span-7 flex flex-col justify-center gap-3.5">
            {activeServices.map((s) => {
              const Icon = iconMap[s.iconName] || Truck;
              const title = getTitle(s);
              const desc = getShortDesc(s);

              return (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  className="group bg-white rounded-xl p-4 sm:p-4.5 border-2 border-slate-300 hover:border-azure-600 hover:bg-slate-50/80 shadow-xs hover:shadow-sm transition-colors duration-150 flex items-center justify-between gap-4 tap-press"
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
