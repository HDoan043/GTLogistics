"use client";

import React from "react";
import Image from "next/image";
import { MapPin, ShieldCheck, Clock } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";

interface BorderGateItem {
  code: string;
  name: string;
  nameEn?: string;
  nameZh?: string;
  province: string;
  desc: string;
  descEn?: string;
  descZh?: string;
}

interface BorderGateNetworkProps {
  borderGatesData?: {
    badge?: string;
    badgeEn?: string;
    badgeZh?: string;
    heading?: string;
    headingEn?: string;
    headingZh?: string;
    description?: string;
    descriptionEn?: string;
    descriptionZh?: string;
    image?: string;
    gates?: BorderGateItem[];
  };
}

export function BorderGateNetwork({ borderGatesData }: BorderGateNetworkProps = {}) {
  const { locale } = useLanguage();

  const badgeText =
    locale === "zh" && borderGatesData?.badgeZh
      ? borderGatesData.badgeZh
      : locale === "en" && borderGatesData?.badgeEn
      ? borderGatesData.badgeEn
      : borderGatesData?.badge || "MẠNG LƯỚI CỬA KHẨU CHIẾN LƯỢC";

  const headingText =
    locale === "zh" && borderGatesData?.headingZh
      ? borderGatesData.headingZh
      : locale === "en" && borderGatesData?.headingEn
      ? borderGatesData.headingEn
      : borderGatesData?.heading || "Năng Lực Thông Quan Phủ Sóng Toàn Tuyến Biên Giới Phía Bắc";

  const descText =
    locale === "zh" && borderGatesData?.descriptionZh
      ? borderGatesData.descriptionZh
      : locale === "en" && borderGatesData?.descriptionEn
      ? borderGatesData.descriptionEn
      : borderGatesData?.description ||
        "Không chỉ dừng lại ở một điểm nút, Logistics GT sở hữu đội ngũ nhân sự hiện trường thường trực 24/7 tại tất cả các cửa khẩu huyết mạch Quảng Ninh và Lạng Sơn, đảm bảo luồng hàng hóa thông quan và giải phóng xe ngay trong ngày:";

  const featuredImg = borderGatesData?.image || "/images/vietphuc/gt_brand_wall_illuminated.webp";

  const defaultGates: BorderGateItem[] = [
    {
      code: "01",
      name: "Cửa khẩu Quốc tế Móng Cái (Bắc Luân 2 & Ka Long - Quảng Ninh)",
      nameEn: "Mong Cai International Border Gate (Bac Luan 2 & Ka Long - Quang Ninh)",
      nameZh: "芒街国际口岸（北仑二桥及卡隆口岸 - 广宁省）",
      province: "Quảng Ninh",
      desc: "Đầu mối giao thương tốc độ cao, kết nối trực tiếp Đông Hưng (Trung Quốc) và tuyến cao tốc Vân Đồn – Móng Cái.",
      descEn: "High-speed trade hub directly connecting Dongxing (China) with Van Don - Mong Cai expressway network.",
      descZh: "高速经贸核心枢纽，无缝直通中国东兴口岸并依托云屯—芒街高速公路连接全境各工业区。",
    },
    {
      code: "02",
      name: "Cửa khẩu Quốc tế Hữu Nghị (Lạng Sơn)",
      nameEn: "Huu Nghi International Border Gate (Lang Son)",
      nameZh: "友谊关国际口岸（谅山省）",
      province: "Lạng Sơn",
      desc: "Tuyến huyết mạch đường bộ quan trọng bậc nhất cho hàng điện tử, linh kiện, máy móc công nghiệp và hàng quá cảnh.",
      descEn: "The most vital overland artery for electronics, components, industrial equipment, and customs-bonded transit.",
      descZh: "中越陆路核心运输干道，专营高价值电子元器件、精密工业设备及国际保税过境货物。",
    },
    {
      code: "03",
      name: "Cửa khẩu Tân Thanh (Lạng Sơn)",
      nameEn: "Tan Thanh Border Gate (Lang Son)",
      nameZh: "新清口岸（谅山省）",
      province: "Lạng Sơn",
      desc: "Trung tâm thông quan hàng nông sản, hoa quả tươi sống và hàng tiêu dùng với quy trình kiểm dịch, giải phóng phương tiện nhanh gọn.",
      descEn: "Agricultural, fresh fruit and consumer goods clearance center with streamlined quarantine and fast turnaround.",
      descZh: "农产品、生鲜水果及日用消费品大型集散通关中心，具备动植物检疫绿色通道与快速放行优势。",
    },
    {
      code: "04",
      name: "Cửa khẩu Chi Ma (Lạng Sơn)",
      nameEn: "Chi Ma Border Gate (Lang Son)",
      nameZh: "峙马口岸（谅山省）",
      province: "Lạng Sơn",
      desc: "Giải pháp thông quan tối ưu chi phí và thời gian cho hàng bách hóa, nguyên phụ liệu dệt may (hàng vải) và hàng thương mại biên giới.",
      descEn: "Cost- and time-efficient customs solution for general merchandise, textile fabrics, and border trade.",
      descZh: "综合百货、纺织面料原辅料及边贸互市的高性价比通关方案，大幅压缩等待时间与滞留成本。",
    },
  ];

  const gates = borderGatesData?.gates && borderGatesData.gates.length > 0 ? borderGatesData.gates : defaultGates;

  return (
    <section className="py-16 sm:py-24 bg-white text-slate-900 border-b border-slate-200/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* CỘT 1: NỘI DUNG TRÁI - 4 thẻ cửa khẩu chiến lược xếp dọc nổi bật */}
          <div className="lg:col-span-6 order-2 lg:order-1">
            <div className="space-y-4">
              {gates.map((g) => {
                const name =
                  locale === "zh" && g.nameZh
                    ? g.nameZh
                    : locale === "en" && g.nameEn
                    ? g.nameEn
                    : g.name;
                const desc =
                  locale === "zh" && g.descZh
                    ? g.descZh
                    : locale === "en" && g.descEn
                    ? g.descEn
                    : g.desc;

                return (
                  <div
                    key={g.code}
                    className="bg-slate-50/80 rounded-2xl p-5 sm:p-6 border-2 border-slate-200 hover:border-azure-600 hover:bg-white transition-colors duration-150 shadow-xs flex flex-col justify-between group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-2 mb-3">
                        {/* Mã số cửa khẩu nổi bật */}
                        <div className="w-10 h-10 rounded-xl bg-azure-600 text-white font-mono font-black text-sm flex items-center justify-center shrink-0 shadow-xs group-hover:bg-azure-700 transition-colors">
                          {g.code}
                        </div>

                        <div className="flex items-center gap-1.5 flex-wrap justify-end">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-azure-100/90 text-azure-800 text-[11px] font-bold">
                            <MapPin className="w-3 h-3 text-azure-600 shrink-0" />
                            <span>{g.province}</span>
                          </span>
                          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-[10px] font-semibold border border-emerald-200">
                            <Clock className="w-2.5 h-2.5 text-emerald-600 shrink-0" />
                            <span>{locale === "zh" ? "24/7" : locale === "en" ? "24/7" : "Trực 24/7"}</span>
                          </span>
                        </div>
                      </div>

                      <h3 className="font-black text-slate-950 text-base sm:text-lg leading-snug mb-2 group-hover:text-azure-700 transition-colors">
                        {name}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {desc}
                      </p>
                    </div>

                    <div className="pt-3 mt-3 border-t border-slate-200/80 flex items-center justify-between text-[11px] text-slate-500 font-medium">
                      <span className="text-azure-700 font-bold">
                        {locale === "zh" ? "正规报关 · 当天放行" : locale === "en" ? "Same-day Release" : "Giải phóng xe trong ngày"}
                      </span>
                      <span className="text-gold-600 font-bold flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3" />
                        <span>{locale === "zh" ? "常驻" : locale === "en" ? "On-site" : "Thường trực"}</span>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CỘT 2: HEADER PHẢI - Tiêu đề nửa màn hình, mô tả và ảnh minh họa */}
          <div className="lg:col-span-6 order-1 lg:order-2 space-y-6">
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
            </div>

            {/* Ảnh minh họa thương hiệu năng lực thông quan */}
            <div className="relative h-56 sm:h-60 rounded-2xl overflow-hidden shadow-xs border border-slate-200 group">
              <Image
                src={featuredImg}
                alt="Năng lực thông quan đa cửa khẩu Logistics GT"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white flex items-center justify-between">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-md bg-gold-500 text-slate-950 text-xs font-bold mb-1">
                    {locale === "zh" ? "正规报关" : locale === "en" ? "Official Clearance" : "Thông Quan Chính Ngạch"}
                  </span>
                  <p className="text-xs text-slate-200 font-medium">
                    {locale === "zh" ? "中越边境全线常驻保障" : locale === "en" ? "Northern Border Full Coverage" : "Hiện diện thường trực tại 4 cửa khẩu trọng điểm"}
                  </p>
                </div>
              </div>
            </div>

            {/* Khối cam kết giải phóng xe */}
            <div className="p-4 rounded-xl bg-azure-900 text-white flex items-center gap-3 shadow-xs">
              <div className="w-9 h-9 rounded-lg bg-azure-800 flex items-center justify-center shrink-0 text-gold-400">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-xs">
                <span className="font-bold text-white block">
                  {locale === "zh" ? "口岸一线专业团队联动 · 杜绝滞留" : locale === "en" ? "Seamless Multi-Border Coordination" : "Đội ngũ hiện trường chuyên nghiệp • Thông quan giải phóng xe ngay trong ngày"}
                </span>
                <span className="text-azure-200 text-[11px] block mt-0.5">
                  Móng Cái, Hữu Nghị, Tân Thanh, Chi Ma
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
