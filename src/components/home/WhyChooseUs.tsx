"use client";

import React from "react";
import Image from "next/image";
import { MapPin, Building2, ShieldCheck, Clock, Award, TrendingUp } from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { useLanguage } from "@/lib/i18n/context";

const pillarIcons = [MapPin, Building2, ShieldCheck, Clock, Award, TrendingUp];

export function WhyChooseUs() {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-white text-slate-900 border-b border-slate-200/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tiêu đề & Thông điệp */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="accent" className="mb-3">
            {t.whyUs.badge}
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            {t.whyUs.heading}
          </h2>
          <p className="mt-4 text-slate-600 text-base leading-relaxed">
            {t.whyUs.desc}
          </p>
        </div>

        {/* Lưới hình ảnh thực tế của Trụ sở & Đội ngũ */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-16 items-center">
          {/* Ảnh lớn bên trái: Biển hiệu thương hiệu phát sáng 3D */}
          <div className="md:col-span-7 relative h-[360px] sm:h-[440px] rounded-3xl overflow-hidden shadow-lg border border-slate-200">
            <Image
              src="/images/vietphuc/gt_brand_wall_illuminated.webp"
              alt="Biển hiệu GT Logistics tại văn phòng Vinhomes Golden Avenue Móng Cái"
              fill
              sizes="(max-width: 768px) 100vw, 60vw"
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="inline-block px-3.5 py-1 rounded-full bg-gold-500 text-slate-950 text-xs font-bold mb-2 shadow-md">
                {t.whyUs.officeCaptionTitle}
              </span>
              <h3 className="text-lg sm:text-xl font-bold">
                {t.common.hqAddress}
              </h3>
              <p className="text-xs sm:text-sm text-slate-200 mt-1">
                {t.whyUs.officeCaptionDesc}
              </p>
            </div>
          </div>

          {/* 2 Ảnh bên phải: Đội ngũ & Sàn làm việc thực tế */}
          <div className="md:col-span-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-6">
            <div className="relative h-[208px] rounded-3xl overflow-hidden shadow-sm border border-slate-200">
              <Image
                src="/images/vietphuc/office_main_floor.webp"
                alt="Sàn làm việc chuyên viên chứng từ Logistics GT"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-xs font-bold block">{t.whyUs.docCaptionTitle}</span>
                <span className="text-xs text-slate-300">{t.whyUs.docCaptionDesc}</span>
              </div>
            </div>

            <div className="relative h-[208px] rounded-3xl overflow-hidden shadow-sm border border-slate-200">
              <Image
                src="/images/vietphuc/customs_document_review.webp"
                alt="Kiểm tra tờ khai và bộ chứng từ xuất nhập khẩu"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-xs font-bold block">{t.whyUs.customsCaptionTitle}</span>
                <span className="text-xs text-slate-300">{t.whyUs.customsCaptionDesc}</span>
              </div>
            </div>
          </div>
        </div>

        {/* 6 Trụ cột năng lực cốt lõi */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {t.whyUs.pillars.map((p, idx) => {
            const IconComponent = pillarIcons[idx] || ShieldCheck;
            return (
              <div
                key={idx}
                className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-azure-300 hover:bg-white shadow-xs transition-colors duration-150 flex flex-col justify-between group tap-press"
              >
                <div>
                  <div className="w-11 h-11 rounded-xl bg-azure-50 text-azure-600 border border-azure-100 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <IconComponent className="w-5 h-5 text-azure-600" />
                  </div>
                  <h4 className="font-bold text-sm sm:text-base text-slate-900 mb-2 leading-snug group-hover:text-azure-700 transition-colors">
                    {p.title}
                  </h4>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {p.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
