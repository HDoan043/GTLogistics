import React from "react";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ExternalLink,
  Building,
} from "lucide-react";
import { getSiteSettings } from "@/modules/settings/actions";
import { Badge } from "@/components/ui/Badge";
import { PageBanner } from "@/components/layout/PageBanner";
import { QuoteCtaSection } from "@/components/home/QuoteCtaSection";
import { getServerDictionary } from "@/lib/i18n/server";

export const metadata = {
  title: "Thông Tin Liên Hệ & Trụ Sở | GT Logistics",
  description:
    "Địa chỉ trụ sở chính tại KĐT Vinhomes Golden Avenue Cửa khẩu Bắc Luân 2 Móng Cái, chi nhánh Cảng Hải Phòng, hotline 24/7 và kết nối Zalo với Logistics GT.",
};

export default async function ContactPage() {
  const [{ t }, settings] = await Promise.all([
    getServerDictionary(),
    getSiteSettings(),
  ]);

  const cleanPhone = (settings.hotline || "0904.382.268").replace(/[^0-9]/g, "");

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      {/* Banner Tiêu đề Trang tinh gọn */}
      <PageBanner
        breadcrumbs={[
          { label: t.common.home, href: "/" },
          { label: t.common.contact },
        ]}
        title={t.contactPage.title}
        subtitle={t.contactPage.desc}
      />

      {/* Thông tin chi tiết các chi nhánh */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Trụ sở Móng Cái */}
            <div className="bg-white p-8 rounded-3xl border border-azure-200 shadow-sm space-y-4 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-24 h-24 bg-azure-500/10 rounded-bl-full pointer-events-none" />
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-azure-50 text-azure-700 flex items-center justify-center font-bold">
                    <Building className="w-6 h-6" />
                  </div>
                  <div>
                    <Badge variant="brand" className="text-xs font-semibold">
                      {t.contactPage.mainHqBadge}
                    </Badge>
                    <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                      {t.contactPage.mainHqTitle}
                    </h2>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-azure-600 mt-0.5 shrink-0" />
                    <span className="font-medium text-slate-800">
                      {t.contactPage.mainHqAddress}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-azure-600 shrink-0" />
                    <a href={`tel:${cleanPhone}`} className="font-bold text-slate-900 hover:text-azure-600 transition-colors">
                      {t.common.hotline}: {settings.hotline}
                    </a>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-azure-600 shrink-0" />
                    <span>{settings.email}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-azure-600 shrink-0" />
                    <span>{t.contactPage.schedule247}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex gap-3">
                <a
                  href={`https://zalo.me/${settings.zaloPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-azure-600 hover:bg-azure-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm tap-press"
                >
                  <span>{t.contactPage.chatZalo}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Chi nhánh Cảng Hải Phòng */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                    <Building className="w-6 h-6" />
                  </div>
                  <div>
                    <Badge variant="neutral" className="text-xs">
                      {t.contactPage.seaPortBadge}
                    </Badge>
                    <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                      {t.contactPage.seaPortTitle}
                    </h2>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                    <span>{t.contactPage.seaPortAddress}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                    <span className="font-semibold text-slate-800">{settings.hotline}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>{t.contactPage.scheduleHaiPhong}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <a
                  href={`tel:${cleanPhone}`}
                  className="block text-center w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors tap-press"
                >
                  {t.contactPage.callPort}
                </a>
              </div>
            </div>

            {/* Chi nhánh Hà Nội */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-xs space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                    <Building className="w-6 h-6" />
                  </div>
                  <div>
                    <Badge variant="neutral" className="text-xs">
                      {t.contactPage.repBadge}
                    </Badge>
                    <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                      {t.contactPage.repTitle}
                    </h2>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                    <span>{t.contactPage.repAddress}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                    <span className="font-semibold text-slate-800">{settings.hotline}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>{t.contactPage.scheduleHanoi}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <a
                  href={`tel:${cleanPhone}`}
                  className="block text-center w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-semibold transition-colors tap-press"
                >
                  {t.contactPage.callHanoi}
                </a>
              </div>
            </div>
          </div>

          {/* Pháp lý doanh nghiệp chính xác */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              {t.contactPage.legalTitle}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-slate-600">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block mb-1">
                  {t.contactPage.legalCompanyName}:
                </span>
                <strong className="text-slate-900">{t.common.companyName}</strong>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block mb-1">
                  {t.contactPage.legalTaxCode}:
                </span>
                <strong className="text-azure-700 font-mono text-sm">5701750095</strong>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block mb-1">
                  {t.contactPage.legalRepresentative}:
                </span>
                <strong className="text-slate-900">
                  {t.aboutPage.leader1.replace(/^.*:\s*/, "")}
                </strong>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block mb-1">
                  {t.contactPage.legalLicensingAuthority}:
                </span>
                <strong className="text-slate-900">
                  {t.contactPage.authorityName}
                </strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote CTA */}
      <QuoteCtaSection hotline={settings.hotline} />
    </div>
  );
}
