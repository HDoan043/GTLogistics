import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Phone,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { getServiceBySlug, getServices } from "@/modules/services/actions";
import { getSiteSettings } from "@/modules/settings/actions";
import { Button } from "@/components/ui/Button";
import { QuoteCtaSection } from "@/components/home/QuoteCtaSection";
import { getServerDictionary } from "@/lib/i18n/server";
import { getLocalizedService } from "@/lib/i18n";

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

  return (
    <div className="flex flex-col min-h-screen">
      {/* Banner Tiêu đề & Breadcrumb */}
      <section className="relative py-16 bg-slate-950 text-white overflow-hidden border-b border-slate-800">
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center mix-blend-luminosity scale-100"
          style={{ backgroundImage: `url('${service.bannerImage}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/95 to-slate-900/80" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
            <Link href="/" className="hover:text-gold-300 transition-colors">
              {t.common.home}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/services" className="hover:text-gold-300 transition-colors">
              {t.servicesPage.detailBreadcrumbServices}
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-azure-300 font-semibold">{localized.title}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white max-w-3xl">
            {localized.title}
          </h1>
          <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-2xl">
            {localized.shortDesc}
          </p>
        </div>
      </section>

      {/* Nội dung chi tiết dịch vụ */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Cột trái: Nội dung chính */}
            <div className="lg:col-span-8 space-y-8">
              <div className="relative h-80 sm:h-96 w-full rounded-3xl overflow-hidden shadow-md border border-slate-200">
                <Image
                  src={service.bannerImage}
                  alt={localized.title}
                  fill
                  sizes="(max-width: 1024px) 100vw, 66vw"
                  className="object-cover"
                />
              </div>

              <div
                className="prose prose-lg max-w-none text-slate-700 prose-headings:text-slate-900 prose-headings:font-bold prose-h3:text-2xl prose-h4:text-xl prose-a:text-azure-600 prose-li:my-1"
                dangerouslySetInnerHTML={{ __html: localized.fullContent }}
              />

              {/* Box cam kết dịch vụ */}
              <div className="p-6 rounded-3xl bg-azure-50/50 border border-azure-100 space-y-3">
                <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-azure-600" />
                  <span>{t.servicesPage.commitmentTitle}</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{t.servicesPage.commitment1}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{t.servicesPage.commitment2}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{t.servicesPage.commitment3}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>{t.servicesPage.commitment4}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cột phải: Sidebar điều hướng & CTA */}
            <div className="lg:col-span-4 space-y-6">
              {/* Danh sách các dịch vụ khác */}
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200">
                <h3 className="font-bold text-base text-slate-900 mb-4 border-b border-slate-200 pb-3">
                  {t.servicesPage.allServicesSidebar}
                </h3>
                <div className="space-y-2">
                  {allServices.map((s) => {
                    const locS = getLocalizedService(s, locale);
                    const isActive = s.slug === service.slug;
                    return (
                      <Link
                        key={s.slug}
                        href={`/services/${s.slug}`}
                        className={`flex items-center justify-between p-3 rounded-2xl text-sm font-semibold transition-colors duration-150 ${
                          isActive
                            ? "bg-azure-600 text-white shadow-sm"
                            : "bg-white text-slate-700 hover:bg-slate-100 hover:text-azure-600 border border-slate-200/60"
                        }`}
                      >
                        <span className="line-clamp-1">{locS.title}</span>
                        <ArrowRight className="w-4 h-4 shrink-0" />
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Hộp Hotline tư vấn */}
              <div className="bg-slate-950 text-white p-6 sm:p-8 rounded-3xl shadow-md text-center space-y-4 border border-slate-800">
                <div className="w-14 h-14 rounded-2xl bg-gold-500 flex items-center justify-center mx-auto text-slate-950 shadow-lg shadow-gold-500/20">
                  <Phone className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-lg text-white">
                  {t.servicesPage.consultationTitle}
                </h4>
                <p className="text-xs text-slate-300">
                  {t.servicesPage.consultationDesc}
                </p>
                <a
                  href={`tel:${cleanPhone}`}
                  className="block text-2xl font-black text-gold-300 hover:text-gold-200 hover:underline transition-colors"
                >
                  {settings.hotline}
                </a>
                <Link href="/quote" className="block pt-2">
                  <Button variant="accent" size="md" className="w-full font-bold">
                    {t.common.requestQuote}
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <QuoteCtaSection hotline={settings.hotline} />
    </div>
  );
}
