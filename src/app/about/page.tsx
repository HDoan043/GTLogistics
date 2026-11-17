import React from "react";
import Image from "next/image";
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
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { StatsCounter } from "@/components/home/StatsCounter";
import { QuoteCtaSection } from "@/components/home/QuoteCtaSection";
import { getSiteSettings } from "@/modules/settings/actions";
import { getServerDictionary } from "@/lib/i18n/server";

export const metadata = {
  title: "Giới Thiệu Về Chúng Tôi | GT Logistics",
  description:
    "Tìm hiểu về lịch sử hình thành, năng lực vận tải, pháp lý doanh nghiệp và cam kết dịch vụ của Công ty TNHH Logistics GT tại Cửa khẩu Quốc tế Móng Cái.",
};

const pillarIcons = [Globe2, ShieldCheck, Zap, Gauge, Award, Coins];

export default async function AboutPage() {
  const [{ t }, settings] = await Promise.all([
    getServerDictionary(),
    getSiteSettings(),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      {/* Banner Tiêu đề Trang (Executive Midnight Style) */}
      <section className="relative py-20 bg-slate-950 text-white overflow-hidden border-b border-slate-800">
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center mix-blend-luminosity scale-100"
          style={{
            backgroundImage: "url('/images/vietphuc/hero_office_panoramic.webp')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/95 to-slate-900/80" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="accent" className="mb-3">
            {t.aboutPage.badge}
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            {t.aboutPage.title}
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
            {t.aboutPage.desc}
          </p>
        </div>
      </section>

      {/* Lịch sử & Tổng quan với hình ảnh thực tế - Clean Light Theme */}
      <section className="py-20 bg-white text-slate-900 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Ảnh thực tế sàn làm việc văn phòng */}
            <div className="lg:col-span-6 relative h-[440px] rounded-2xl overflow-hidden shadow-lg border border-slate-200">
              <Image
                src="/images/vietphuc/office_workstations_wide.webp"
                alt="Văn phòng điều hành Logistics GT tại Vinhomes Golden Avenue Móng Cái"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white p-5 rounded-xl bg-slate-950/90 border border-slate-800">
                <span className="text-sm font-bold block text-gold-400">
                  {t.common.companyName}
                </span>
                <span className="text-xs text-slate-200">
                  {t.aboutPage.officeCaptionSub}
                </span>
              </div>
            </div>

            {/* Nội dung thông tin doanh nghiệp chính xác */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-azure-50 text-azure-800 text-xs font-semibold border border-azure-200/80">
                <span>{t.aboutPage.taxBadge}</span>
              </div>

              <h2 className="text-3xl font-black text-slate-950 tracking-tight leading-tight">
                {t.aboutPage.heading}
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                {t.aboutPage.p1}
              </p>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                {t.aboutPage.p2}
              </p>

              {/* Tổ hợp đối tác hệ sinh thái */}
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-600">
                <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Building className="w-4 h-4 text-azure-600" />
                  <span>{t.aboutPage.ecosystemTitle}</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {t.aboutPage.ecosystemDesc}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <Target className="w-5 h-5 text-azure-600 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">
                      {t.aboutPage.missionTitle}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1">
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
                    <p className="text-xs text-slate-600 mt-1">
                      {t.aboutPage.sloganDesc}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Đội ngũ & Buổi họp chiến lược thực tế */}
      <section className="py-20 bg-slate-50/70 text-slate-900 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <Badge variant="brand" className="mb-2">
                {t.aboutPage.teamBadge}
              </Badge>
              <h2 className="text-3xl font-black text-slate-950 tracking-tight leading-tight">
                {t.aboutPage.teamHeading}
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                {t.aboutPage.teamDesc}
              </p>
              <div className="space-y-3">
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

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Ảnh lãnh đạo */}
              <div className="relative h-64 rounded-2xl overflow-hidden shadow-sm border border-slate-200">
                <Image
                  src="/images/vietphuc/director_leadership.webp"
                  alt="Ban lãnh đạo điều hành chiến lược Logistics GT"
                  fill
                  sizes="(max-width: 768px) 100vw, 30vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-xs font-bold block">
                    {t.aboutPage.directorsCaption}
                  </span>
                  <span className="text-[11px] text-slate-200">
                    {t.aboutPage.directorsSub}
                  </span>
                </div>
              </div>

              {/* Ảnh phòng họp toàn thể */}
              <div className="relative h-64 rounded-2xl overflow-hidden shadow-sm border border-slate-200">
                <Image
                  src="/images/vietphuc/boardroom_conference.webp"
                  alt="Họp giao ban nghiệp vụ vận tải và thông quan tại phòng hội nghị"
                  fill
                  sizes="(max-width: 768px) 100vw, 30vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
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

      {/* Số liệu ấn tượng */}
      <StatsCounter />

      {/* 6 Trụ cột giá trị cốt lõi đúc kết từ biển hiệu */}
      <section className="py-20 bg-white text-slate-900 border-b border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="brand" className="mb-2">
              {t.aboutPage.coreValuesBadge}
            </Badge>
            <h2 className="text-3xl font-black text-slate-950 tracking-tight">
              {t.aboutPage.coreValuesHeading}
            </h2>
            <p className="mt-3 text-slate-600 text-sm">
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
                  <div className="w-12 h-12 rounded-xl bg-azure-50 text-azure-600 border border-azure-100 flex items-center justify-center mb-4 group-hover:scale-105 transition-transform">
                    <PillarIcon className="w-6 h-6 text-azure-600" />
                  </div>
                  <h3 className="font-bold text-lg text-slate-900 mb-2 group-hover:text-azure-700 transition-colors">{v.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed">{v.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Quote CTA */}
      <QuoteCtaSection hotline={settings.hotline} />
    </div>
  );
}
