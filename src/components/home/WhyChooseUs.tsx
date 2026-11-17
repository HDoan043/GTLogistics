"use client";

import React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/Badge";
import { useLanguage } from "@/lib/i18n/context";

export function WhyChooseUs() {
  const { t } = useLanguage();

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tiêu đề & Thông điệp */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="accent" className="mb-3">
            {t.whyUs.badge}
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
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
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
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

        {/* 6 Trụ cột giá trị cốt lõi đúc kết từ biển hiệu */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {t.whyUs.pillars.map((p, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-gold-400 hover:bg-gold-50/20 transition-colors duration-150 text-center flex flex-col justify-between group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-100 to-gold-200 text-gold-950 border border-gold-300/80 flex items-center justify-center font-bold text-sm mx-auto mb-3 shadow-sm">
                0{idx + 1}
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 mb-1">
                  {p.title}
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
