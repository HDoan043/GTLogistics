"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Truck,
  Ship,
  FileCheck,
  ShieldCheck,
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
  const { locale } = useLanguage();

  // Đảm bảo chỉ hiển thị đúng 4 dịch vụ chính thức
  const activeServices = services.slice(0, 4);

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

  const badgeText =
    locale === "zh" && homeServicesData?.badgeZh
      ? homeServicesData.badgeZh
      : locale === "en" && homeServicesData?.badgeEn
      ? homeServicesData.badgeEn
      : homeServicesData?.badge || "HỆ THỐNG DỊCH VỤ TRỌNG TÂM";

  const headingText =
    locale === "zh" && homeServicesData?.headingZh
      ? homeServicesData.headingZh
      : locale === "en" && homeServicesData?.headingEn
      ? homeServicesData.headingEn
      : homeServicesData?.heading || "Giải Pháp Logistics Toàn Diện & Chuyên Sâu";

  const descText =
    locale === "zh" && homeServicesData?.descriptionZh
      ? homeServicesData.descriptionZh
      : locale === "en" && homeServicesData?.descriptionEn
      ? homeServicesData.descriptionEn
      : homeServicesData?.description ||
        "Từ những lô hàng tiêu chuẩn đến các mặt hàng siêu trường siêu trọng hay vận tải biển đảo phức tạp, GT Logistics đều có phương án xử lý trọn gói.";

  const illustrationImg =
    homeServicesData?.illustrationImage || "/images/vietphuc/presentation_multimodal.webp";

  return (
    <section className="py-16 sm:py-24 bg-slate-50/70 text-slate-900 border-b border-slate-200/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Cột Trái: Tiêu đề nửa màn hình, mô tả tinh gọn, nút bấm và ảnh minh họa */}
          <div className="lg:col-span-6 space-y-6">
            <div>
              <span className="text-xs font-bold text-azure-700 block mb-2">
                {badgeText}
              </span>
              <div className="h-1 w-12 bg-azure-600 rounded-full mb-4" />
              <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight leading-tight">
                {headingText}
              </h2>
              <p className="mt-3 text-slate-600 text-xs sm:text-sm leading-relaxed">
                {descText}
              </p>

              <div className="pt-4 flex flex-wrap items-center gap-3">
                <Link
                  href="/services"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-azure-600 hover:bg-azure-700 text-white font-bold text-sm shadow-xs transition-colors duration-150 tap-press"
                >
                  <span>{locale === "zh" ? "全部四大服务" : locale === "en" ? "All 4 Services" : "Tất Cả Dịch Vụ"}</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href="/quote"
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-800 border border-slate-300 font-semibold text-sm transition-colors duration-150 tap-press"
                >
                  <span>{locale === "zh" ? "获取运费报价" : locale === "en" ? "Request Quote" : "Nhận Báo Giá"}</span>
                </Link>
              </div>
            </div>

            {/* Ảnh minh họa nghiệp vụ tiếp vận đặt ngay dưới Header để tạo điểm nhấn trực quan */}
            <div className="relative h-56 sm:h-60 rounded-2xl overflow-hidden shadow-xs border border-slate-200 group">
              <Image
                src={illustrationImg}
                alt="Giải pháp tiếp vận toàn diện Logistics GT"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white flex items-center justify-between">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-md bg-azure-600 text-white text-xs font-bold mb-1">
                    {locale === "zh" ? "自营运力体系" : locale === "en" ? "Direct Operational Fleet" : "Đội Xe & Tàu Sà Lan Trực Tiếp"}
                  </span>
                  <p className="text-xs text-slate-200">
                    {locale === "zh" ? "50辆集装箱车队 • 姑苏全境航线" : locale === "en" ? "50 Container Fleet • Co To Routes" : "50 Đầu kéo container • Tuyến biển Cô Tô"}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gold-300 font-semibold">
                  <PhoneCall className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                  <span>0904.382.268</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cột Phải: Ma trận 2x2 gồm 4 thẻ dịch vụ thu gọn cân đối */}
          <div className="lg:col-span-6 grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {activeServices.map((s, idx) => {
              const Icon = iconMap[s.iconName] || Truck;
              const title = getTitle(s);
              const desc = getShortDesc(s);

              return (
                <Link
                  key={s.slug}
                  href={`/services/${s.slug}`}
                  className="group bg-white rounded-2xl p-5 border-2 border-slate-300 hover:border-azure-600 hover:bg-slate-50/80 shadow-xs hover:shadow-sm transition-colors duration-150 flex flex-col justify-between gap-4 tap-press"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-xl bg-azure-50 text-azure-700 border border-azure-200 flex items-center justify-center shrink-0 group-hover:bg-azure-600 group-hover:text-white transition-colors duration-150">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className="text-xs font-mono font-bold text-slate-600">
                        0{idx + 1}
                      </span>
                    </div>

                    <div>
                      <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug group-hover:text-azure-700 transition-colors duration-150 line-clamp-2">
                        {title}
                      </h3>
                      <p className="text-xs text-slate-500 mt-2 line-clamp-3 leading-relaxed">
                        {desc}
                      </p>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-azure-700 group-hover:text-azure-800">
                    <span>{locale === "zh" ? "查看详情" : locale === "en" ? "View Details" : "Xem Chi Tiết"}</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
