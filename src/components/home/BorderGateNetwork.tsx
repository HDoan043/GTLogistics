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
        {/* Phần Header mục: Tiêu đề & mô tả chiến lược thông suốt */}
        <div className="max-w-3xl mb-10 sm:mb-12">
          <span className="text-xs font-bold text-azure-700 block mb-2">
            {badgeText}
          </span>
          <div className="h-1 w-16 bg-gradient-to-r from-azure-600 to-gold-500 rounded-full mb-4" />
          <h2 className="text-2xl sm:text-4xl font-black text-slate-950 tracking-tight leading-tight">
            {headingText}
          </h2>
          <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
            {descText}
          </p>
        </div>

        {/* Ma trận 2x2 cho 4 Cửa Khẩu Chiến Lược (2 trên, 2 dưới cân xứng, chuyên nghiệp) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
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
                className="bg-slate-50/80 rounded-2xl p-6 sm:p-7 border-2 border-slate-200 hover:border-azure-600 hover:bg-white transition-colors duration-150 shadow-xs flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-3 mb-4">
                    {/* Mã số cửa khẩu nổi bật */}
                    <div className="w-12 h-12 rounded-xl bg-azure-600 text-white font-mono font-black text-base flex items-center justify-center shrink-0 shadow-xs group-hover:bg-azure-700 transition-colors">
                      {g.code}
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-azure-100/90 text-azure-800 text-xs font-bold">
                        <MapPin className="w-3.5 h-3.5 text-azure-600 shrink-0" />
                        <span>{g.province}</span>
                      </span>
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                        <Clock className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>{locale === "zh" ? "现场 24/7" : locale === "en" ? "24/7 Field Team" : "Trực 24/7"}</span>
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

                <div className="pt-4 mt-4 border-t border-slate-200/80 flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span className="text-azure-700 font-bold">
                    {locale === "zh" ? "正规报关 · 当天放行" : locale === "en" ? "Official Clearance · Same-day Release" : "Chính ngạch • Giải phóng xe trong ngày"}
                  </span>
                  <span className="text-gold-600 font-bold flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>{locale === "zh" ? "现场常驻" : locale === "en" ? "On-site" : "Thường trực"}</span>
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Thanh cam kết năng lực dưới ma trận */}
        <div className="mt-8 p-4 sm:p-5 rounded-2xl bg-azure-900 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-azure-800 flex items-center justify-center shrink-0 text-gold-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                {locale === "zh" ? "口岸一线专业团队联动 24/7" : locale === "en" ? "Seamless 24/7 Multi-Border On-Site Coordination" : "Đội ngũ chuyên viên túc trực 24/7 tại toàn bộ 4 cửa khẩu trọng điểm"}
              </h4>
              <p className="text-xs text-azure-200 mt-0.5">
                {locale === "zh" ? "全套单证审核、动植物检疫、海关查验无缝衔接，杜绝滞留与额外费用。" : locale === "en" ? "Direct customs declaration, physical inspection, quarantine and instant truck dispatch." : "Xử lý trọn gói từ tờ khai điện tử, kiểm hóa, kiểm dịch thực vật đến điều vận xe thẳng về kho."}
              </p>
            </div>
          </div>
          <div className="text-xs font-bold text-gold-300 bg-azure-950 px-3 py-1.5 rounded-lg border border-azure-700/60 shrink-0">
            MÓNG CÁI, HỮU NGHỊ, TÂN THANH, CHI MA
          </div>
        </div>
      </div>
    </section>
  );
}
