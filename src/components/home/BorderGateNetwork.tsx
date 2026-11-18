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
          {/* Cột 1: Danh sách 4 Cửa khẩu Chiến Lược (bên trái trên Desktop) */}
          <div className="order-2 lg:order-1 lg:col-span-6 flex flex-col justify-center gap-3.5">
            {gates.map((g) => {
              const name = locale === "zh" && g.nameZh ? g.nameZh : locale === "en" && g.nameEn ? g.nameEn : g.name;
              const desc = locale === "zh" && g.descZh ? g.descZh : locale === "en" && g.descEn ? g.descEn : g.desc;

              return (
                <div
                  key={g.code}
                  className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border-2 border-slate-200 hover:border-azure-600 hover:bg-white transition-colors duration-150 shadow-xs"
                >
                  <div className="flex items-start gap-4">
                    {/* Mã số cửa khẩu */}
                    <div className="w-10 h-10 rounded-xl bg-azure-600 text-white font-mono font-black text-sm flex items-center justify-center shrink-0 shadow-xs">
                      {g.code}
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-azure-100/80 text-azure-800 text-[11px] font-bold">
                          <MapPin className="w-3 h-3 text-azure-600 shrink-0" />
                          <span>{g.province}</span>
                        </span>
                        <span className="inline-flex items-center gap-1 text-[11px] text-emerald-700 font-medium">
                          <Clock className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>{locale === "zh" ? "现场 24/7" : locale === "en" ? "24/7 Field Team" : "Trực 24/7"}</span>
                        </span>
                      </div>

                      <h3 className="font-bold text-slate-950 text-sm sm:text-base leading-snug">
                        {name}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 mt-1.5 leading-relaxed">
                        {desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cột 2: Header, Giới thiệu & Ảnh minh họa điểm trực cửa khẩu (bên phải trên Desktop) */}
          <div className="order-1 lg:order-2 lg:col-span-6 space-y-6">
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

            {/* Ảnh minh họa điểm trực cửa khẩu thực tế */}
            <div className="relative h-56 sm:h-60 rounded-2xl overflow-hidden shadow-xs border border-slate-200 group">
              <Image
                src={featuredImg}
                alt="Đội ngũ trực cửa khẩu Logistics GT thường trực 24/7"
                fill
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white flex items-center justify-between">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-md bg-azure-600 text-white text-xs font-bold mb-1">
                    {locale === "zh" ? "口岸一线驻点" : locale === "en" ? "On-Site Border Teams" : "Nhân Sự Thường Trực 24/7"}
                  </span>
                  <p className="text-xs text-slate-200">
                    {locale === "zh" ? "广宁与谅山全线口岸联动" : locale === "en" ? "Quang Ninh & Lang Son Gates" : "Móng Cái • Hữu Nghị • Tân Thanh • Chi Ma"}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gold-300 font-semibold">
                  <ShieldCheck className="w-4 h-4 text-gold-400 shrink-0" />
                  <span>{locale === "zh" ? "当天放行" : locale === "en" ? "Same-Day Release" : "Thông Quan Trong Ngày"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
