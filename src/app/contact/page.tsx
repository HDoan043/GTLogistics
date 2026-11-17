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
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-100">
      {/* Banner Tiêu đề Trang */}
      <section className="relative py-16 bg-slate-950 text-white text-center border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Badge variant="accent" className="mb-2">
            {t.contactPage.badge}
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            {t.contactPage.title}
          </h1>
          <p className="mt-2 text-sm text-slate-300 max-w-xl mx-auto">
            {t.contactPage.desc}
          </p>
        </div>
      </section>

      {/* Thông tin chi tiết các chi nhánh */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Trụ sở Móng Cái */}
            <div className="bg-slate-900/90 p-8 rounded-3xl border border-azure-700/50 shadow-md space-y-4 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-24 h-24 bg-azure-500/10 rounded-bl-full pointer-events-none" />
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-azure-950 text-azure-400 border border-azure-800 flex items-center justify-center font-bold">
                    <Building className="w-6 h-6" />
                  </div>
                  <div>
                    <Badge variant="brand" className="text-xs font-semibold">
                      {t.contactPage.mainHqBadge}
                    </Badge>
                    <h2 className="text-lg font-bold text-white mt-0.5">
                      {t.contactPage.mainHqTitle}
                    </h2>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-slate-300 pt-2 border-t border-slate-800">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-azure-400 mt-0.5 shrink-0" />
                    <span className="font-medium text-slate-200">
                      {t.contactPage.mainHqAddress}
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-azure-400 shrink-0" />
                    <a href={`tel:${cleanPhone}`} className="font-bold text-white hover:text-azure-400 transition-colors">
                      {t.common.hotline}: {settings.hotline}
                    </a>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-azure-400 shrink-0" />
                    <span>{settings.email}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-azure-400 shrink-0" />
                    <span>{t.contactPage.schedule247}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex gap-3">
                <a
                  href={`https://zalo.me/${settings.zaloPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-azure-600 hover:bg-azure-500 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors shadow-sm tap-press"
                >
                  <span>{t.contactPage.chatZalo}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Chi nhánh Cảng Hải Phòng */}
            <div className="bg-slate-900/90 p-8 rounded-3xl border border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-300 flex items-center justify-center font-bold">
                    <Building className="w-6 h-6" />
                  </div>
                  <div>
                    <Badge variant="neutral" className="text-xs">
                      {t.contactPage.seaPortBadge}
                    </Badge>
                    <h2 className="text-lg font-bold text-white mt-0.5">
                      {t.contactPage.seaPortTitle}
                    </h2>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-slate-400 pt-2 border-t border-slate-800">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                    <span>{t.contactPage.seaPortAddress}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                    <span className="font-semibold text-slate-200">{settings.hotline}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>{t.contactPage.scheduleHaiPhong}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <a
                  href={`tel:${cleanPhone}`}
                  className="block text-center w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors tap-press"
                >
                  {t.contactPage.callPort}
                </a>
              </div>
            </div>

            {/* Chi nhánh Hà Nội */}
            <div className="bg-slate-900/90 p-8 rounded-3xl border border-slate-800 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-800 text-slate-300 flex items-center justify-center font-bold">
                    <Building className="w-6 h-6" />
                  </div>
                  <div>
                    <Badge variant="neutral" className="text-xs">
                      {t.contactPage.repBadge}
                    </Badge>
                    <h2 className="text-lg font-bold text-white mt-0.5">
                      {t.contactPage.repTitle}
                    </h2>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-slate-400 pt-2 border-t border-slate-800">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                    <span>{t.contactPage.repAddress}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                    <span className="font-semibold text-slate-200">{settings.hotline}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>{t.contactPage.scheduleHanoi}</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800">
                <a
                  href={`tel:${cleanPhone}`}
                  className="block text-center w-full py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-semibold transition-colors tap-press"
                >
                  {t.contactPage.callHanoi}
                </a>
              </div>
            </div>
          </div>

          {/* Pháp lý doanh nghiệp chính xác */}
          <div className="bg-slate-900/90 rounded-3xl p-8 border border-slate-800 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-white">
              {t.contactPage.legalTitle}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-slate-400">
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-slate-400 block mb-1">
                  {t.contactPage.legalCompanyName}:
                </span>
                <strong className="text-white">{t.common.companyName}</strong>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-slate-400 block mb-1">
                  {t.contactPage.legalTaxCode}:
                </span>
                <strong className="text-azure-400 font-mono text-sm">5701750095</strong>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-slate-400 block mb-1">
                  {t.contactPage.legalRepresentative}:
                </span>
                <strong className="text-white">
                  {t.aboutPage.leader1.replace(/^.*:\s*/, "")}
                </strong>
              </div>
              <div className="p-4 rounded-xl bg-slate-950/70 border border-slate-800">
                <span className="text-slate-400 block mb-1">
                  {t.contactPage.legalLicensingAuthority}:
                </span>
                <strong className="text-white">
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
