import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Truck,
  Ship,
  FileCheck,
  ShieldCheck,
  Globe,
  ArrowRight,
} from "lucide-react";
import { getServices } from "@/modules/services/actions";
import { PageBanner } from "@/components/layout/PageBanner";
import { getServerDictionary } from "@/lib/i18n/server";
import { getLocalizedService } from "@/lib/i18n";

export const metadata = {
  title: "Dịch Vụ Logistics & Thủ Tục Hải Quan Cửa Khẩu | GT Logistics",
  description:
    "Danh mục các dịch vụ vận tải đường bộ liên vận Móng Cái, thủ tục hải quan xuất nhập khẩu chính ngạch, C/O Form E và hàng quá cảnh uy tín hàng đầu.",
};

const iconMap: Record<string, React.ElementType> = {
  Truck,
  Ship,
  FileCheck,
  ShieldCheck,
  Globe,
};

export default async function ServicesPage() {
  const [{ locale, t }, services] = await Promise.all([
    getServerDictionary(),
    getServices(),
  ]);

  const activeServices = services.filter(
    (s) =>
      s.slug !== "kho-bai-chuoi-cung-ung" &&
      s.slug !== "van-tai-thuy-tuyen-dao"
  );

  const servicesTitle =
    locale === "zh"
      ? "核心物流服务"
      : locale === "en"
      ? "GT Logistics Services"
      : "Dịch Vụ GT Logistics";

  return (
    <div className="flex flex-col min-h-screen">
      {/* Banner trang chính rộng thoáng, tiêu đề to ngắn gọn và watermark logo GT */}
      <PageBanner
        breadcrumbs={[
          { label: t.common.home, href: "/" },
          { label: t.common.allServices },
        ]}
        title={servicesTitle}
        subtitle={t.servicesPage.desc}
        size="main"
      />

      {/* Trình bày các thẻ dịch vụ lớn chuyên sâu với ảnh, tiêu đề, mô tả và nút xem chi tiết */}
      <section className="py-16 sm:py-20 bg-slate-50/70 text-slate-900 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {activeServices.map((s) => {
              const locS = getLocalizedService(s, locale);
              const Icon = iconMap[s.iconName] || Truck;

              return (
                <div
                  key={s.slug}
                  className="group bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-md hover:border-azure-400 transition-colors duration-150 flex flex-col justify-between"
                >
                  {/* Ảnh dịch vụ lớn sắc nét */}
                  <div className="relative h-56 w-full overflow-hidden bg-slate-100">
                    <Image
                      src={s.bannerImage}
                      alt={locS.title}
                      fill
                      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                    <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                      <span className="w-10 h-10 rounded-xl bg-azure-600 text-white font-bold flex items-center justify-center shadow-md">
                        <Icon className="w-5 h-5" />
                      </span>
                      <span className="text-[11px] font-bold bg-slate-950/80 text-gold-300 px-2.5 py-1 rounded-full border border-gold-500/40">
                        {t.services.officialTag}
                      </span>
                    </div>
                  </div>

                  {/* Nội dung chi tiết dịch vụ */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <h3 className="text-xl font-bold text-slate-900 group-hover:text-azure-600 transition-colors">
                        <Link href={`/services/${s.slug}`}>{locS.title}</Link>
                      </h3>
                      <p className="mt-2.5 text-sm text-slate-600 leading-relaxed line-clamp-3">
                        {locS.shortDesc}
                      </p>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                      <Link
                        href={`/services/${s.slug}`}
                        className="text-sm font-bold text-azure-600 hover:text-gold-600 inline-flex items-center gap-1.5 transition-colors tap-press"
                      >
                        <span>{t.common.viewDetails}</span>
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                      <Link
                        href={`/quote?service=${encodeURIComponent(s.title)}`}
                        className="text-xs font-semibold text-slate-500 hover:text-slate-900 px-2.5 py-1 rounded-lg hover:bg-slate-100 transition-colors tap-press"
                      >
                        {t.common.quote}
                      </Link>
                    </div>
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
