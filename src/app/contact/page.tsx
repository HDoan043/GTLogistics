import React from "react";
import { Phone, Mail } from "lucide-react";
import { getSiteSettings } from "@/modules/settings/actions";
import { PageBanner } from "@/components/layout/PageBanner";
import { QuoteCtaSection } from "@/components/home/QuoteCtaSection";
import { getServerDictionary } from "@/lib/i18n/server";
import {
  DEFAULT_BANNERS_CONTENT,
  DEFAULT_CONTACT_CONTENT,
} from "@/modules/content/constants";
import { getPageSectionContent } from "@/modules/content/actions";

export const metadata = {
  title: "Thông Tin Doanh Nghiệp & Hệ Thống Điểm Trực | GT Logistics",
  description:
    "Thông tin pháp nhân Công ty TNHH Logistics GT (MST: 5701750095) và hệ thống 5 điểm trực cửa khẩu thường trực 24/7 tại Quảng Ninh, Lạng Sơn, Hải Phòng và Cô Tô.",
};

export default async function ContactPage() {
  const [{ locale, t }, settings, bannersContent, contactData] =
    await Promise.all([
      getServerDictionary(),
      getSiteSettings(),
      getPageSectionContent("content_banners", DEFAULT_BANNERS_CONTENT),
      getPageSectionContent("content_contact", DEFAULT_CONTACT_CONTENT),
    ]);

  const contact = { ...DEFAULT_CONTACT_CONTENT, ...(contactData || {}) };
  const bannerCfg = bannersContent?.contact || DEFAULT_BANNERS_CONTENT.contact;
  const cleanPhone = (contact.hotline || settings.hotline || "0904.382.268").replace(/[^0-9]/g, "");

  const contactTitle =
    locale === "zh" && bannerCfg.titleZh
      ? bannerCfg.titleZh
      : locale === "en" && bannerCfg.titleEn
      ? bannerCfg.titleEn
      : bannerCfg.title || "LIÊN HỆ HỢP TÁC";

  const contactSubtitle =
    locale === "zh" && bannerCfg.subtitleZh
      ? bannerCfg.subtitleZh
      : locale === "en" && bannerCfg.subtitleEn
      ? bannerCfg.subtitleEn
      : bannerCfg.subtitle ||
        "Kết nối trực tiếp trụ sở Cửa khẩu Bắc Luân 2 Móng Cái, các điểm trực Lạng Sơn, cảng Hải Phòng và đầu mối Cô Tô.";

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900">
      {/* Banner Tiêu đề Trang chính với ảnh nền Việt Phúc */}
      <PageBanner
        breadcrumbs={[
          { label: t.common.home, href: "/" },
          { label: t.common.contact },
        ]}
        title={contactTitle}
        subtitle={contactSubtitle}
        size="main"
        bgImage={bannerCfg.bgImage}
        bgScale={bannerCfg.bgScale}
        bgPosition={bannerCfg.bgPosition}
        bgOpacity={bannerCfg.bgOpacity}
      />

      {/* BỐ CỤC 1 CỘT DỌC: THÔNG TIN PHÁP NHÂN TRANG TRỌNG Ở TRÊN, FORM BÁO GIÁ LIÊN HỆ Ở DƯỚI */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-16">
        
        {/* PHẦN 1: THÔNG TIN PHÁP NHÂN & HỆ THỐNG ĐIỂM TRỰC (CHUẨN TEXT THEO MỤC 3) */}
        <section className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            THÔNG TIN DOANH NGHIỆP & HỆ THỐNG ĐIỂM TRỰC
          </h2>
          <div className="h-0.5 w-16 bg-slate-900" />

          <div className="pt-2 text-slate-800 text-base sm:text-lg leading-relaxed space-y-4">
            <ul className="list-disc pl-5 space-y-3">
              <li>
                <strong>Tên doanh nghiệp:</strong> {contact.companyName || "CÔNG TY TNHH LOGISTICS GT"}
              </li>
              <li>
                <strong>Mã số thuế:</strong> {contact.taxCode || "5701750095"}
              </li>
              <li>
                <strong>Đại diện pháp luật:</strong> {contact.legalRep || "Lê Thanh Tâm"}
              </li>
              <li>
                <strong>Hotline tư vấn 24/7:</strong>{" "}
                <a
                  href={`tel:${cleanPhone}`}
                  className="font-bold text-azure-700 hover:text-azure-900 hover:underline inline-flex items-center gap-1.5"
                >
                  <Phone className="w-4 h-4 text-azure-600 inline" />
                  <span>{contact.hotline || settings.hotline || "0904.382.268"}</span>
                </a>
              </li>
              <li>
                <strong>Email chính thức:</strong>{" "}
                <a
                  href={`mailto:${contact.email || settings.email || "contact@logisticsgt.vn"}`}
                  className="font-medium text-azure-700 hover:text-azure-900 hover:underline inline-flex items-center gap-1.5"
                >
                  <Mail className="w-4 h-4 text-azure-600 inline" />
                  <span>{contact.email || settings.email || "contact@logisticsgt.vn"}</span>
                </a>
              </li>
              <li>
                <strong>Hệ thống văn phòng & Điểm trực cửa khẩu:</strong>
                <ul className="list-disc pl-6 mt-2.5 space-y-2 text-slate-700 text-sm sm:text-base">
                  {contact.headquarters && (
                    <li>
                      <strong>{contact.headquarters.title || "Trụ sở chính (Móng Cái)"}:</strong>{" "}
                      {contact.headquarters.address}
                    </li>
                  )}
                  {(contact.branches || []).map((b: any, i: number) => (
                    <li key={i}>
                      <strong>{b.title}:</strong> {b.address}
                    </li>
                  ))}
                </ul>
              </li>
            </ul>
          </div>
        </section>

      </div>

      {/* PHẦN 2: FORM TIẾP NHẬN YÊU CẦU BÁO GIÁ & LIÊN HỆ ĐẶT Ở PHÍA DƯỚI */}
      <QuoteCtaSection hotline={settings.hotline} />
    </div>
  );
}
