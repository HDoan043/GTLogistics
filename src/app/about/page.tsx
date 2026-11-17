import React from "react";
import Image from "next/image";
import {
  CheckCircle,
  Target,
  Compass,
  Building,
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
          className="absolute inset-0 opacity-25 bg-cover bg-center mix-blend-luminosity scale-105"
          style={{
            backgroundImage: "url('/images/vietphuc/hero_office_panoramic.webp')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-blue-950/70" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="accent" className="mb-3 uppercase tracking-wider">
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

      {/* Lịch sử & Tổng quan với hình ảnh thực tế */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Ảnh thực tế sàn làm việc văn phòng */}
            <div className="lg:col-span-6 relative h-[440px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 group">
              <Image
                src="/images/vietphuc/office_workstations_wide.webp"
                alt="Văn phòng điều hành Logistics GT tại Vinhomes Golden Avenue Móng Cái"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white p-5 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/10">
                <span className="text-sm font-bold block text-sky-400">
                  {t.common.companyName}
                </span>
                <span className="text-xs text-slate-200">
                  {t.aboutPage.officeCaptionSub}
                </span>
              </div>
            </div>

            {/* Nội dung thông tin doanh nghiệp chính xác */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-800 text-xs font-bold border border-blue-200">
                <span>{t.aboutPage.taxBadge}</span>
              </div>

              <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                {t.aboutPage.heading}
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                {t.aboutPage.p1}
              </p>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                {t.aboutPage.p2}
              </p>

              {/* Tổ hợp đối tác hệ sinh thái */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700">
                <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Building className="w-4 h-4 text-blue-700" />
                  <span>{t.aboutPage.ecosystemTitle}</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  {t.aboutPage.ecosystemDesc}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-start gap-3">
                  <Target className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">
                      {t.aboutPage.missionTitle}
                    </h4>
                    <p className="text-xs text-slate-600 mt-1">
                      {t.aboutPage.missionDesc}
                    </p>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-start gap-3">
                  <Compass className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
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
      <section className="py-20 bg-slate-50 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <Badge variant="brand" className="uppercase tracking-wider">
                {t.aboutPage.teamBadge}
              </Badge>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                {t.aboutPage.teamHeading}
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                {t.aboutPage.teamDesc}
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-700">
                  <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{t.aboutPage.leader1}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-700">
                  <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{t.aboutPage.leader2}</span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-700">
                  <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>{t.aboutPage.leader3}</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Ảnh lãnh đạo */}
              <div className="relative h-64 rounded-3xl overflow-hidden shadow-lg border border-slate-200 group">
                <Image
                  src="/images/vietphuc/director_leadership.webp"
                  alt="Ban lãnh đạo điều hành chiến lược Logistics GT"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-xs font-bold block">
                    {t.aboutPage.directorsCaption}
                  </span>
                  <span className="text-[11px] text-slate-300">
                    {t.aboutPage.directorsSub}
                  </span>
                </div>
              </div>

              {/* Ảnh phòng họp toàn thể */}
              <div className="relative h-64 rounded-3xl overflow-hidden shadow-lg border border-slate-200 group">
                <Image
                  src="/images/vietphuc/boardroom_conference.webp"
                  alt="Họp giao ban nghiệp vụ vận tải và thông quan tại phòng hội nghị"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-xs font-bold block">
                    {t.aboutPage.conferenceCaption}
                  </span>
                  <span className="text-[11px] text-slate-300">
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
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="brand" className="uppercase tracking-wider mb-2">
              {t.aboutPage.coreValuesBadge}
            </Badge>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              {t.aboutPage.coreValuesHeading}
            </h2>
            <p className="mt-3 text-slate-600 text-sm">
              {t.aboutPage.coreValuesDesc}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {t.aboutPage.pillars.map((v, i) => (
              <div
                key={i}
                className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-blue-500/50 hover:bg-blue-50/20 hover:shadow-md transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4 font-black text-base">
                  0{i + 1}
                </div>
                <h3 className="font-extrabold text-lg text-slate-900 mb-2">{v.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote CTA */}
      <QuoteCtaSection hotline={settings.hotline} />
    </div>
  );
}
