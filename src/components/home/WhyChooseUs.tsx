"use client";

import React from "react";
import Image from "next/image";
import { MapPin, Building2, ShieldCheck, Clock, FileCheck2, Award } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";

export function WhyChooseUs() {
  const { t, locale } = useLanguage();

  const networkNodes = [
    {
      title:
        locale === "zh"
          ? "芒街总运营中心（北仑二桥）"
          : locale === "en"
          ? "Mong Cai HQ (Bac Luan 2 Border)"
          : "Trụ Sở Móng Cái (Cửa khẩu Bắc Luân 2)",
      desc: t.common.hqAddress,
      badge:
        locale === "zh"
          ? "总指挥部"
          : locale === "en"
          ? "Headquarters"
          : "Trụ Sở Chính",
      icon: MapPin,
      highlight: true,
    },
    {
      title:
        locale === "zh"
          ? "谅山友谊关分支机构"
          : locale === "en"
          ? "Lang Son Huu Nghi Branch"
          : "Chi Nhánh Lạng Sơn (Cửa khẩu Hữu Nghị)",
      desc: t.common.langSonOffice,
      badge:
        locale === "zh"
          ? "北部口岸"
          : locale === "en"
          ? "Border Branch"
          : "Chi Nhánh",
      icon: Building2,
      highlight: false,
    },
    {
      title:
        locale === "zh"
          ? "海防港口海运对接站"
          : locale === "en"
          ? "Hai Phong Seaport Liaison Office"
          : "Văn Phòng Cảng Hải Phòng",
      desc: t.common.haiPhongOffice,
      badge:
        locale === "zh"
          ? "海运联运"
          : locale === "en"
          ? "Seaport Hub"
          : "Đầu mối Cảng",
      icon: Building2,
      highlight: false,
    },
  ];

  const coreStrengths = [
    {
      icon: ShieldCheck,
      title:
        locale === "zh"
          ? "100% 正规通关报关"
          : locale === "en"
          ? "100% Official Customs Clearance"
          : "100% Thủ Tục Chính Ngạch",
      desc:
        locale === "zh"
          ? "严格遵守两国进出口法律，完备海关单据与增值税发票。"
          : locale === "en"
          ? "Strict compliance with trade regulations, full official documentation."
          : "Chuẩn hóa hồ sơ xuất nhập khẩu, đầy đủ tờ khai và hóa đơn GTGT hợp lệ.",
    },
    {
      icon: Clock,
      title:
        locale === "zh"
          ? "口岸一线 24/7 现场驻点"
          : locale === "en"
          ? "24/7 On-Site Border Clearance"
          : "Túc Trực Cửa Khẩu 24/7",
      desc:
        locale === "zh"
          ? "中越双语专员常驻芒街与友谊关，即时排查并放行货物。"
          : locale === "en"
          ? "Bilingual Vietnamese-Chinese field specialists stationed on-site."
          : "Chuyên viên thường trực tại Bắc Luân 2 và Hữu Nghị, sang tải giải phóng hàng thông suốt.",
    },
    {
      icon: FileCheck2,
      title:
        locale === "zh"
          ? "ACFTA 原产地证 Form E 专家"
          : locale === "en"
          ? "C/O Form E & Tariff Specialist"
          : "Chuyên Gia C/O Form E & Biểu Thuế",
      desc:
        locale === "zh"
          ? "精准核定税率，合规享受东盟-中国自贸协定优惠关税。"
          : locale === "en"
          ? "Optimized tariff coding ensuring maximal official tariff savings."
          : "Tối ưu mã HS, hưởng thuế suất ưu đãi đặc biệt hiệp định ACFTA an toàn tuyệt đối.",
    },
    {
      icon: Award,
      title:
        locale === "zh"
          ? "跨国车队直连直达"
          : locale === "en"
          ? "Direct Cross-Border Fleet"
          : "Đội Xe Liên Vận Hai Chiều",
      desc:
        locale === "zh"
          ? "GPS 实时追踪，无缝对接东兴与各省工业园区。"
          : locale === "en"
          ? "Real-time GPS tracking connecting directly with industrial parks."
          : "Giám sát lộ trình GPS tức thời, kết nối thẳng các khu công nghiệp trọng điểm.",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-white text-slate-900 border-b border-slate-200/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Cột Trái (Nội dung mạng lưới & năng lực thực tế) */}
          <div className="lg:col-span-7 order-2 lg:order-1 space-y-6">
            {/* 3 Nút Mạng Lưới Chi Nhánh Thực Tế */}
            <div className="space-y-3">
              {networkNodes.map((node, idx) => {
                const IconComponent = node.icon;
                return (
                  <div
                    key={idx}
                    className={`p-4 rounded-xl border transition-colors duration-150 flex items-start gap-3.5 ${
                      node.highlight
                        ? "bg-azure-50/60 border-azure-300 shadow-xs"
                        : "bg-slate-50/70 border-slate-200/90"
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${
                        node.highlight
                          ? "bg-azure-600 text-white"
                          : "bg-white text-slate-700 border border-slate-200"
                      }`}
                    >
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-bold text-sm sm:text-base text-slate-900">
                          {node.title}
                        </h4>
                        <span
                          className={`text-xs font-semibold px-2.5 py-0.5 rounded-md ${
                            node.highlight
                              ? "bg-gold-500 text-slate-950"
                              : "bg-slate-200 text-slate-700"
                          }`}
                        >
                          {node.badge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {node.desc}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* 4 Năng lực cốt lõi dạng thẻ gọn */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 pt-2">
              {coreStrengths.map((item, idx) => {
                const StrengthIcon = item.icon;
                return (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-slate-50 border border-slate-200/80 hover:bg-white hover:border-azure-300 transition-colors duration-150"
                  >
                    <div className="flex items-center gap-2.5 mb-1.5">
                      <StrengthIcon className="w-4 h-4 text-azure-600 shrink-0" />
                      <h5 className="font-bold text-xs sm:text-sm text-slate-900 leading-snug">
                        {item.title}
                      </h5>
                    </div>
                    <p className="text-[11px] text-slate-600 leading-relaxed">
                      {item.desc}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cột Phải: Tiêu đề ngắn gọn & Ảnh biển hiệu thực tế (So le phải) */}
          <div className="lg:col-span-5 order-1 lg:order-2 space-y-6">
            <div>
              <div className="h-1 w-12 bg-gold-500 rounded-full mb-4" />
              <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
                {t.whyUs.heading}
              </h2>
              <p className="mt-4 text-slate-600 text-base leading-relaxed">
                {t.whyUs.desc}
              </p>
            </div>

            {/* Ảnh Biển Hiệu Trụ Sở Thực Tế Tại Móng Cái */}
            <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden shadow-md border border-slate-200 group">
              <Image
                src="/images/vietphuc/gt_brand_wall_illuminated.webp"
                alt="Văn phòng điều hành GT Logistics tại Vinhomes Golden Avenue Móng Cái"
                fill
                sizes="(max-width: 768px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/30 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="inline-block px-2.5 py-0.5 rounded-md bg-gold-500 text-slate-950 text-[11px] font-bold mb-1">
                  {t.common.companyName}
                </span>
                <p className="text-xs text-slate-200 line-clamp-2">
                  {t.common.hqAddress}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
