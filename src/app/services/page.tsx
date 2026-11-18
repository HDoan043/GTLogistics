import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Truck,
  Ship,
  FileCheck,
  ShieldCheck,
  ArrowRight,
  PhoneCall,
} from "lucide-react";
import { getServices } from "@/modules/services/actions";
import { getSiteSettings } from "@/modules/settings/actions";
import { PageBanner } from "@/components/layout/PageBanner";
import { getServerDictionary } from "@/lib/i18n/server";
import { getLocalizedService } from "@/lib/i18n";
import { getPageSectionContent } from "@/modules/content/actions";
import { DEFAULT_BANNERS_CONTENT } from "@/modules/content/constants";

export const metadata = {
  title: "Tất Cả Dịch Vụ Logistics & Hải Quan | GT Logistics",
  description:
    "Danh mục 4 dịch vụ trọng tâm của GT Logistics: Khai báo hải quan, Vận tải đường bộ 50 xe container, Hàng hóa đặc thù và Tàu sà lan đi đảo Cô Tô.",
};

const iconMap: Record<string, React.ElementType> = {
  Truck,
  Ship,
  FileCheck,
  ShieldCheck,
};

export default async function ServicesPage() {
  const [{ locale, t }, services, bannersContent, settings] = await Promise.all([
    getServerDictionary(),
    getServices(),
    getPageSectionContent("content_banners", DEFAULT_BANNERS_CONTENT),
    getSiteSettings(),
  ]);

  // Chỉ lấy đúng 4 dịch vụ trọng tâm theo Section 1.3
  const activeServices = services.slice(0, 4);

  const bannerCfg = bannersContent?.services || DEFAULT_BANNERS_CONTENT.services;
  const cleanPhone = (settings.hotline || "0904.382.268").replace(/[^0-9]/g, "");

  const servicesTitle =
    locale === "zh" && bannerCfg.titleZh
      ? bannerCfg.titleZh
      : locale === "en" && bannerCfg.titleEn
      ? bannerCfg.titleEn
      : bannerCfg.title || "Tất Cả Dịch Vụ";

  const servicesSubtitle =
    locale === "zh" && bannerCfg.subtitleZh
      ? bannerCfg.subtitleZh
      : locale === "en" && bannerCfg.subtitleEn
      ? bannerCfg.subtitleEn
      : bannerCfg.subtitle ||
        "Hệ thống giải pháp tiếp vận toàn diện: Thông quan đa cửa khẩu, đội xe 50 container, hàng đặc thù và tàu sà lan Cô Tô.";

  return (
    <div className="flex flex-col min-h-screen bg-slate-50/70 text-slate-900">
      {/* Banner trang chính rộng thoáng, chữ to rõ ràng và watermark logo GT */}
      <PageBanner
        breadcrumbs={[
          { label: t.common.home, href: "/" },
          { label: t.common.allServices },
        ]}
        title={servicesTitle}
        subtitle={servicesSubtitle}
        size="main"
        bgImage={bannerCfg.bgImage}
        bgScale={bannerCfg.bgScale}
        bgPosition={bannerCfg.bgPosition}
        bgOpacity={bannerCfg.bgOpacity}
      />

      {/* Trình bày 4 thẻ dịch vụ lớn chuyên sâu với ảnh minh họa, tiêu đề và tóm tắt */}
      <section className="py-16 sm:py-20 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="text-xs font-bold text-azure-700 mb-1">
              Hệ thống dịch vụ trọng tâm
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
              4 Giải Pháp Logistics Nòng Cốt
            </h2>
            <p className="mt-3 text-slate-600 text-sm sm:text-base leading-relaxed">
              Từ hàng tiêu chuẩn đến hàng siêu trường siêu trọng hay vận tải biển đảo phức tạp, Logistics GT đều chủ động phương tiện và giải pháp trọn gói.
            </p>
          </div>

          {/* Lưới 2 Cột x 2 Hàng (4 Thẻ Lớn) Cân Đối & Bề Thế */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-10">
            {activeServices.map((s, idx) => {
              const locS = getLocalizedService(s, locale);
              const Icon = iconMap[s.iconName] || Truck;

              return (
                <div
                  key={s.slug}
                  className="group bg-white rounded-3xl overflow-hidden border-2 border-slate-200 hover:border-azure-600 shadow-xs hover:shadow-md transition-colors duration-150 flex flex-col justify-between"
                >
                  <div>
                    {/* Ảnh minh họa dịch vụ lớn sắc nét */}
                    <div className="relative h-60 sm:h-72 w-full overflow-hidden bg-slate-100">
                      <Image
                        src={s.bannerImage}
                        alt={locS.title}
                        fill
                        sizes="(max-width: 768px) 100vw, 50vw"
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                      
                      {/* Badge số thứ tự & Icon dịch vụ */}
                      <div className="absolute top-4 left-4 flex items-center gap-2">
                        <div className="w-10 h-10 rounded-xl bg-azure-600 text-white flex items-center justify-center font-bold shadow-sm">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="px-2.5 py-1 rounded-lg bg-slate-900 text-white text-xs font-bold border border-white/20">
                          Dịch vụ 0{idx + 1}
                        </span>
                      </div>
                    </div>

                    {/* Nội dung: Tiêu đề và tóm tắt */}
                    <div className="p-6 sm:p-8 space-y-3">
                      <h3 className="text-xl sm:text-2xl font-bold text-slate-950 group-hover:text-azure-700 transition-colors leading-snug">
                        <Link href={`/services/${s.slug}`}>
                          {locS.title}
                        </Link>
                      </h3>

                      <p className="text-slate-600 text-sm sm:text-base leading-relaxed line-clamp-3">
                        {locS.shortDesc}
                      </p>
                    </div>
                  </div>

                  {/* Nút xem chi tiết dịch vụ */}
                  <div className="p-6 sm:p-8 pt-0">
                    <Link
                      href={`/services/${s.slug}`}
                      className="inline-flex items-center justify-between w-full px-5 py-3.5 rounded-xl bg-slate-50 hover:bg-azure-600 text-slate-900 hover:text-white font-bold text-sm border border-slate-200 hover:border-azure-600 transition-colors duration-150 tap-press"
                    >
                      <span>Xem Chi Tiết Quy Trình & Năng Lực</span>
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>
    </div>
  );
}
