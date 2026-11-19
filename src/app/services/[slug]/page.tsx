import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Phone, ArrowRight } from "lucide-react";
import { getServiceBySlug, getServices } from "@/modules/services/actions";
import { getSiteSettings } from "@/modules/settings/actions";
import { PageBanner } from "@/components/layout/PageBanner";
import { getServerDictionary } from "@/lib/i18n/server";
import { getLocalizedService } from "@/lib/i18n";

export const revalidate = 300;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return { title: "Dịch vụ không tồn tại" };

  return {
    title: `${service.title} | GT Logistics`,
    description: service.shortDesc,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [{ locale, t }, service, allServices, settings] = await Promise.all([
    getServerDictionary(),
    getServiceBySlug(slug),
    getServices(),
    getSiteSettings(),
  ]);

  if (!service) {
    notFound();
  }

  const localized = getLocalizedService(service, locale);
  const cleanPhone = (settings.hotline || "0904.382.268").replace(/[^0-9]/g, "");

  const activeServices = allServices.filter(
    (s) =>
      s.slug !== "kho-bai-chuoi-cung-ung" &&
      s.slug !== "van-tai-thuy-tuyen-dao"
  );

  return (
    <div className="flex flex-col min-h-screen">
      {/* Banner trang tinh gọn, đúng chuẩn thiết kế người dùng mong muốn */}
      <PageBanner
        breadcrumbs={[
          { label: t.common.home, href: "/" },
          { label: t.common.allServices, href: "/services" },
          { label: localized.title },
        ]}
        title={localized.title}
        subtitle={localized.shortDesc}
        bgImage={service.bannerImage}
      />

      {/* Nội dung chi tiết dịch vụ */}
      <section className="py-12 sm:py-16 bg-white text-slate-900 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            {/* Cột trái: Ảnh minh họa thực tế & Nội dung định dạng chuyên nghiệp */}
            <div className="lg:col-span-8 space-y-6">
              <div className="relative h-72 sm:h-96 w-full rounded-2xl overflow-hidden shadow-xs border border-slate-200">
                <Image
                  src={service.bannerImage}
                  alt={localized.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover"
                />
              </div>

              {/* Nội dung dịch vụ với typography đẹp mắt, tiêu đề phân cấp và khoảng cách thoáng đãng */}
              <div
                className="rich-content pt-2"
                dangerouslySetInnerHTML={{ __html: localized.fullContent }}
              />
            </div>

            {/* Cột phải: Danh sách điều hướng tất cả dịch vụ & Liên hệ nhanh */}
            <div className="lg:col-span-4 space-y-5 sticky top-24">
              <div className="bg-slate-50/80 p-5 rounded-2xl border border-slate-200">
                <h3 className="font-bold text-sm text-slate-900 mb-3 border-b border-slate-200 pb-2.5">
                  {t.servicesPage.allServicesSidebar}
                </h3>
                <div className="space-y-2">
                  {activeServices.map((s) => {
                    const locS = getLocalizedService(s, locale);
                    const isActive = s.slug === service.slug;
                    return (
                      <Link
                        key={s.slug}
                        href={`/services/${s.slug}`}
                        className={`flex items-center justify-between p-3 rounded-xl text-sm font-semibold transition-colors duration-150 ${
                          isActive
                            ? "bg-azure-600 text-white shadow-xs"
                            : "bg-white text-slate-700 hover:bg-slate-100 hover:text-azure-700 border border-slate-200"
                        }`}
                      >
                        <span className="line-clamp-1">{locS.title}</span>
                        <ArrowRight className="w-4 h-4 shrink-0" />
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Thẻ liên hệ Hotline trực tiếp */}
              <div className="p-4 rounded-xl bg-white border border-slate-200 flex items-center justify-between gap-3 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-lg bg-azure-50 text-azure-700 flex items-center justify-center shrink-0 border border-azure-100">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[11px] font-semibold text-slate-500 block">
                      {locale === "zh" ? "口岸 24/7 直通专线" : locale === "en" ? "24/7 Border Hotline" : "Hotline Trực Cửa Khẩu"}
                    </span>
                    <a
                      href={`tel:${cleanPhone}`}
                      className="text-sm font-bold text-slate-900 hover:text-azure-600 transition-colors"
                    >
                      {settings.hotline}
                    </a>
                  </div>
                </div>
                <a
                  href={`tel:${cleanPhone}`}
                  className="px-3.5 py-1.5 rounded-lg bg-azure-600 hover:bg-azure-700 text-white text-xs font-bold transition-colors"
                >
                  {t.common.contact}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
