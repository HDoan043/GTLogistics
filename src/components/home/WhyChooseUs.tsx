"use client";

import React from "react";
import Image from "next/image";
import { Truck, Building, ShieldCheck, FileCheck, PhoneCall } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";

interface WhyUsProps {
  whyUsData?: {
    badge?: string;
    badgeEn?: string;
    badgeZh?: string;
    title?: string;
    titleEn?: string;
    titleZh?: string;
    description?: string;
    descriptionEn?: string;
    descriptionZh?: string;
    image?: string;
    items?: Array<{
      icon?: string;
      title: string;
      titleEn?: string;
      titleZh?: string;
      desc: string;
      descEn?: string;
      descZh?: string;
    }>;
  };
}

const iconMap: Record<string, React.ElementType> = {
  Truck,
  Building,
  ShieldCheck,
  FileCheck,
};

export function WhyChooseUs({ whyUsData }: WhyUsProps = {}) {
  const { locale } = useLanguage();

  const badgeText =
    locale === "zh" && whyUsData?.badgeZh
      ? whyUsData.badgeZh
      : locale === "en" && whyUsData?.badgeEn
      ? whyUsData.badgeEn
      : whyUsData?.badge || "VÌ SAO KHÁCH HÀNG TIN CHỌN";

  const heading =
    locale === "zh" && whyUsData?.titleZh
      ? whyUsData.titleZh
      : locale === "en" && whyUsData?.titleEn
      ? whyUsData.titleEn
      : whyUsData?.title || "Vì Sao Khách Hàng Luôn Tin Chọn Logistics GT?";

  const desc =
    locale === "zh" && whyUsData?.descriptionZh
      ? whyUsData.descriptionZh
      : locale === "en" && whyUsData?.descriptionEn
      ? whyUsData.descriptionEn
      : whyUsData?.description ||
        "Chủ động phương tiện vận tải đường bộ và đường biển, phủ sóng 4 cửa khẩu lớn, chuyên gia xử lý hàng khó và cam kết giải phóng hàng ngay trong ngày.";

  const bannerImg = whyUsData?.image || "/images/vietphuc/boardroom_conference.webp";

  const defaultReasons = [
    {
      icon: "Truck",
      title: "Sở Hữu Trực Tiếp 50 Xe Container & Đội Tàu Sà Lan",
      titleEn: "Direct Ownership of 50 Container Trucks & Marine Fleet",
      titleZh: "直接自营 50 辆集装箱甩挂车队与海运驳船",
      desc: "Chủ động 100% phương tiện đường bộ lẫn đường biển, bình ổn giá cước ngay cả trong mùa cao điểm, không phụ thuộc vào bên trung gian.",
      descEn: "100% control of road and sea transport fleets, stabilizing freight rates even in peak seasons without relying on middlemen.",
      descZh: "自有运力直接调配，旺季运价高度平稳，全程不倒手、无中间环节加价，保障客户运费与时效。",
    },
    {
      icon: "Building",
      title: "Phủ Sóng 4 Cửa Khẩu Lớn",
      titleEn: "Full Coverage of 4 Major Border Gates",
      titleZh: "全面覆盖北部四大核心陆路陆港口岸",
      desc: "Linh hoạt điều phối luồng hàng giữa Móng Cái, Hữu Nghị, Tân Thanh và Chi Ma tùy theo tình trạng thông quan thực tế để giải phóng xe nhanh nhất.",
      descEn: "Flexible cargo rerouting between Mong Cai, Huu Nghi, Tan Thanh, and Chi Ma based on real-time clearance conditions.",
      descZh: "根据当天现场查验排队情况，智能分流通关至芒街、友谊关、新清或峙马，实现车辆极速放行。",
    },
    {
      icon: "ShieldCheck",
      title: "Chuyên Gia Xử Lý Hàng Khó",
      titleEn: "Specialists in Difficult & Specialized Cargo",
      titleZh: "精通大件超限、危险化工与纺织面料等难货处理",
      desc: "Dày dạn kinh nghiệm thực chiến với các lô hàng quá khổ quá tải, hàng quá cảnh, hóa chất nguy hiểm và hàng vải cần kiểm định gấp.",
      descEn: "Proven field experience with project cargo, bonded transit, hazardous chemicals, and urgent textile testings.",
      descZh: "针对超重超长设备、海关监管保税过境、危险化学品申报及服装面料快速抽检出证具备深厚实操功底。",
    },
    {
      icon: "FileCheck",
      title: "Thông Quan Nhanh – Giao Hàng Thẳng",
      titleEn: "Rapid Customs Clearance – Direct Delivery",
      titleZh: "极速报关查验 – 点到点直发客户工厂",
      desc: "Tối ưu hóa thủ tục hải quan để giải phóng hàng ngay tại cửa khẩu và vận chuyển thẳng tới điểm đích, triệt tiêu các chi phí lưu kho bãi không cần thiết cho khách hàng.",
      descEn: "Optimizing customs workflows to release shipments at borders and transport directly to destinations, eliminating unnecessary storage costs.",
      descZh: "优化单证审理与查验衔接，口岸放行后车辆直达收货仓库，彻底杜绝高昂的堆存费与延滞费。",
    },
  ];

  const items = whyUsData?.items && whyUsData.items.length > 0 ? whyUsData.items : defaultReasons;

  return (
    <section className="py-16 sm:py-24 bg-white text-slate-900 border-b border-slate-200/80 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Cột 1: Header, Mô tả & Ảnh minh họa tạo điểm nhấn đặt ngay bên dưới */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              <span className="text-xs font-bold text-azure-700 block mb-2">
                {badgeText}
              </span>
              <div className="h-1 w-12 bg-azure-600 rounded-full mb-4" />
              <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight leading-tight">
                {heading}
              </h2>
              <p className="mt-4 text-slate-600 text-sm sm:text-base leading-relaxed">
                {desc}
              </p>
            </div>

            {/* Ảnh minh họa ban lãnh đạo & điều hành tiếp vận */}
            <div className="relative h-60 sm:h-64 rounded-2xl overflow-hidden shadow-xs border border-slate-200 group">
              <Image
                src={bannerImg}
                alt="Ban điều hành và chuyên viên tiếp vận Logistics GT"
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white flex items-center justify-between">
                <div>
                  <span className="inline-block px-2.5 py-0.5 rounded-md bg-gold-500 text-slate-950 text-xs font-bold mb-1">
                    {locale === "zh" ? "信赖品质" : locale === "en" ? "Trusted Quality" : "Cam Kết Chất Lượng"}
                  </span>
                  <p className="text-xs text-slate-200">
                    {locale === "zh" ? "准时履约 • 100% 责任保障" : locale === "en" ? "Punctual • 100% Insured" : "Bảo hiểm 100% trách nhiệm hàng hóa"}
                  </p>
                </div>
                <div className="flex items-center gap-1.5 text-xs text-gold-300 font-semibold">
                  <PhoneCall className="w-3.5 h-3.5 text-gold-400 shrink-0" />
                  <span>0904.382.268</span>
                </div>
              </div>
            </div>
          </div>

          {/* Cột 2: 4 Lý do tin chọn theo đúng tài liệu Section 1.5 */}
          <div className="lg:col-span-7 flex flex-col justify-center gap-4">
            {items.map((it, idx) => {
              const Icon = iconMap[it.icon || ""] || Truck;
              const title = locale === "zh" && it.titleZh ? it.titleZh : locale === "en" && it.titleEn ? it.titleEn : it.title;
              const itemDesc = locale === "zh" && it.descZh ? it.descZh : locale === "en" && it.descEn ? it.descEn : it.desc;

              return (
                <div
                  key={idx}
                  className="bg-slate-50/80 rounded-2xl p-4 sm:p-5 border-2 border-slate-200 hover:border-azure-600 hover:bg-white transition-colors duration-150 shadow-xs"
                >
                  <div className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-azure-50 text-azure-700 border border-azure-200 flex items-center justify-center shrink-0 shadow-xs">
                      <Icon className="w-5 h-5" />
                    </div>

                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs font-mono font-bold text-azure-700">
                          0{idx + 1}
                        </span>
                        <h3 className="font-bold text-slate-950 text-sm sm:text-base leading-snug">
                          {title}
                        </h3>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {itemDesc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
