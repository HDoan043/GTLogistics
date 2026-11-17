import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  CheckCircle,
  Target,
  Compass,
  Building,
  Globe2,
  ShieldCheck,
  Zap,
  Gauge,
  Award,
  Coins,
  ArrowRight,
  PhoneCall,
} from "lucide-react";
import { StatsCounter } from "@/components/home/StatsCounter";
import { PageBanner } from "@/components/layout/PageBanner";
import { getSiteSettings } from "@/modules/settings/actions";
import { getServerDictionary } from "@/lib/i18n/server";

export const metadata = {
  title: "Giới Thiệu Về Chúng Tôi | GT Logistics",
  description:
    "Tìm hiểu về lịch sử hình thành, năng lực vận tải, pháp lý doanh nghiệp và cam kết dịch vụ của Công ty TNHH Logistics GT tại Cửa khẩu Quốc tế Móng Cái.",
};

const pillarIcons = [Globe2, ShieldCheck, Zap, Gauge, Award, Coins];

export default async function AboutPage() {
  const [{ locale, t }, settings] = await Promise.all([
    getServerDictionary(),
    getSiteSettings(),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Banner Tiêu đề Trang tinh gọn, đồng bộ hệ thống */}
      <PageBanner
        breadcrumbs={[
          { label: t.common.home, href: "/" },
          { label: t.common.aboutUs },
        ]}
        title={t.aboutPage.title}
        subtitle={t.aboutPage.desc}
      />

      {/* Đẩy tất cả Big Numbers (Số liệu ấn tượng) lên đầu trang theo yêu cầu */}
      <StatsCounter />

      {/* Lịch sử, Pháp lý & Mạng lưới chi nhánh - Bố cục 2 cột cân bằng hoàn hảo */}
      <section className="py-16 sm:py-20 bg-white text-slate-900 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Cột trái: Nội dung text câu chuyện & Sứ mệnh */}
            <div className="lg:col-span-6 space-y-5">
              <span className="inline-block px-3 py-1 rounded-full bg-azure-50 text-azure-700 text-xs font-bold border border-azure-200">
                {t.aboutPage.taxBadge}
              </span>

              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-tight">
                {t.aboutPage.heading}
              </h2>

              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                {t.aboutPage.p1}
              </p>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                {t.aboutPage.p2}
              </p>

              {/* Sứ mệnh & Khẩu hiệu */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <Target className="w-5 h-5 text-azure-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">
                      {t.aboutPage.missionTitle}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {t.aboutPage.missionDesc}
                    </p>
                  </div>
                </div>
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <Compass className="w-5 h-5 text-azure-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">
                      {t.aboutPage.sloganTitle}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                      {t.aboutPage.sloganDesc}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Cột phải: Minh họa hình ảnh thực tế & Mạng lưới 2 cửa khẩu đối xứng */}
            <div className="lg:col-span-6 space-y-5">
              {/* Ảnh thực tế sàn làm việc văn phòng */}
              <div className="relative h-64 sm:h-72 rounded-2xl overflow-hidden shadow-sm border border-slate-200">
                <Image
                  src="/images/vietphuc/office_workstations_wide.webp"
                  alt="Văn phòng điều hành Logistics GT tại Vinhomes Golden Avenue Móng Cái"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-xs font-bold block text-gold-400">
                    {t.common.companyName}
                  </span>
                  <span className="text-[11px] text-slate-200 line-clamp-1">
                    {t.aboutPage.officeCaptionSub}
                  </span>
                </div>
              </div>

              {/* Hệ sinh thái đối tác */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-1.5 text-xs text-slate-600">
                <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Building className="w-4 h-4 text-azure-600" />
                  <span>{t.aboutPage.ecosystemTitle}</span>
                </div>
                <p className="text-slate-600 leading-relaxed text-[11px]">
                  {t.aboutPage.ecosystemDesc}
                </p>
              </div>

              {/* Mạng lưới chi nhánh cửa khẩu chiến lược Móng Cái & Lạng Sơn */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3.5 rounded-xl bg-azure-50/70 border border-azure-200 text-xs">
                  <span className="font-bold text-azure-950 block">Trụ Sở Móng Cái (Bắc Luân 2)</span>
                  <span className="text-slate-600 text-[11px] leading-relaxed block mt-0.5">{t.common.hqAddress}</span>
                </div>
                <div className="p-3.5 rounded-xl bg-gold-50/70 border border-gold-200 text-xs">
                  <span className="font-bold text-gold-950 block">Chi Nhánh Lạng Sơn (Hữu Nghị)</span>
                  <span className="text-slate-600 text-[11px] leading-relaxed block mt-0.5">{t.common.langSonOffice}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Đội ngũ & Buổi họp chiến lược thực tế - 2 Cột cân bằng */}
      <section className="py-16 sm:py-20 bg-slate-50/70 text-slate-900 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
            {/* Cột trái: Giới thiệu đội ngũ */}
            <div className="lg:col-span-5 space-y-5">
              <span className="inline-block px-3 py-1 rounded-full bg-azure-100 text-azure-800 text-xs font-bold">
                {t.aboutPage.teamBadge}
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-tight">
                {t.aboutPage.teamHeading}
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                {t.aboutPage.teamDesc}
              </p>
              <div className="space-y-3 pt-1">
                <div className="flex items-center gap-3 text-sm text-slate-700">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t.aboutPage.leader1}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-700">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t.aboutPage.leader2}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-700">
                  <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{t.aboutPage.leader3}</span>
                </div>
              </div>
            </div>

            {/* Cột phải: 2 Ảnh minh họa Ban lãnh đạo & Phòng họp */}
            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="relative h-60 sm:h-64 rounded-2xl overflow-hidden shadow-xs border border-slate-200">
                <Image
                  src="/images/vietphuc/director_leadership.webp"
                  alt="Ban lãnh đạo điều hành chiến lược Logistics GT"
                  fill
                  sizes="(max-width: 768px) 100vw, 30vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-xs font-bold block">
                    {t.aboutPage.directorsCaption}
                  </span>
                  <span className="text-[11px] text-slate-200">
                    {t.aboutPage.directorsSub}
                  </span>
                </div>
              </div>

              <div className="relative h-60 sm:h-64 rounded-2xl overflow-hidden shadow-xs border border-slate-200">
                <Image
                  src="/images/vietphuc/boardroom_conference.webp"
                  alt="Họp giao ban nghiệp vụ vận tải và thông quan tại phòng hội nghị"
                  fill
                  sizes="(max-width: 768px) 100vw, 30vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-transparent to-transparent" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="text-xs font-bold block">
                    {t.aboutPage.conferenceCaption}
                  </span>
                  <span className="text-[11px] text-slate-200">
                    {t.aboutPage.conferenceSub}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6 Trụ cột giá trị cốt lõi đúc kết từ biển hiệu */}
      <section className="py-16 sm:py-20 bg-white text-slate-900 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-block px-3 py-1 rounded-full bg-gold-100 text-gold-800 text-xs font-bold mb-2">
              {t.aboutPage.coreValuesBadge}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              {t.aboutPage.coreValuesHeading}
            </h2>
            <p className="mt-2 text-slate-600 text-sm">
              {t.aboutPage.coreValuesDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.aboutPage.pillars.map((v, i) => {
              const PillarIcon = pillarIcons[i] || ShieldCheck;
              return (
                <div
                  key={i}
                  className="p-6 rounded-2xl bg-slate-50/70 border border-slate-200/80 hover:border-azure-300 hover:bg-white shadow-xs transition-colors duration-150 group tap-press"
                >
                  <div className="w-11 h-11 rounded-xl bg-azure-50 text-azure-600 border border-azure-100 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform duration-200">
                    <PillarIcon className="w-5 h-5 text-azure-600" />
                  </div>
                  <h3 className="font-bold text-base text-slate-900 mb-1.5 group-hover:text-azure-700 transition-colors">{v.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Cụm CTA Liên hệ & Báo giá tinh gọn cuối trang */}
      <section className="py-12 bg-slate-950 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-xl sm:text-2xl font-bold text-white">
              {locale === "zh" ? "准备好与 GT 物流开展下一次合作了吗？" : locale === "en" ? "Ready to partner with GT Logistics for your next shipment?" : "Sẵn sàng đồng hành cùng Logistics GT trong lô hàng tiếp theo?"}
            </h3>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              {locale === "zh" ? "正规报关，专业车队，快速报价。" : locale === "en" ? "Official customs declaration, dedicated fleet, rapid quote response." : "Thông quan chính ngạch, phương tiện liên vận trực tiếp, báo giá nhanh trong 15 phút."}
            </p>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <Link
              href="/quote"
              className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-gold-500 hover:bg-gold-400 text-slate-950 font-bold text-sm transition-colors duration-150 tap-press"
            >
              <span>{t.common.requestQuote}</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={`tel:${(settings.hotline || "0904.382.268").replace(/[^0-9]/g, "")}`}
              className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white border border-slate-700 font-semibold text-sm transition-colors duration-150"
            >
              <PhoneCall className="w-4 h-4 text-gold-400" />
              <span>{settings.hotline}</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
