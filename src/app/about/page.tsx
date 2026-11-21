import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  PhoneCall,
  ArrowRight,
  Truck,
  Ship,
  ShieldCheck,
  CheckCircle2,
  MapPin,
  Clock,
  Boxes,
  FileCheck,
  Anchor,
  Layers,
  Globe2,
  TrendingUp,
  Compass,
  Sparkles,
  Users,
  Award,
} from "lucide-react";
import { PageBanner } from "@/components/layout/PageBanner";
import { getSiteSettings } from "@/modules/settings/actions";
import { getServerDictionary } from "@/lib/i18n/server";
import { getPageSectionContent } from "@/modules/content/actions";
import {
  DEFAULT_ABOUT_CONTENT,
  DEFAULT_BANNERS_CONTENT,
} from "@/modules/content/constants";

export const revalidate = 300;

export const metadata = {
  title: "Giới Thiệu Về Chúng Tôi | GT Logistics",
  description:
    "Tìm hiểu về năng lực tiếp vận, quy mô 50 xe container, đội tàu sà lan Cô Tô và hệ sinh thái khép kín của Công ty TNHH Logistics GT.",
};

export default async function AboutPage() {
  const [{ locale, t }, settings, bannersContent, aboutData] =
    await Promise.all([
      getServerDictionary(),
      getSiteSettings(),
      getPageSectionContent("content_banners", DEFAULT_BANNERS_CONTENT),
      getPageSectionContent("content_about", DEFAULT_ABOUT_CONTENT),
    ]);

  const about = { ...DEFAULT_ABOUT_CONTENT, ...(aboutData || {}) };
  const bannerCfg = bannersContent?.about || DEFAULT_BANNERS_CONTENT.about;
  const cleanPhone = (settings.hotline || "0904.382.268").replace(/[^0-9]/g, "");

  const aboutTitle =
    locale === "zh" && bannerCfg.titleZh
      ? bannerCfg.titleZh
      : locale === "en" && bannerCfg.titleEn
      ? bannerCfg.titleEn
      : bannerCfg.title || "VỀ CHÚNG TÔI";

  const aboutSubtitle =
    locale === "zh" && bannerCfg.subtitleZh
      ? bannerCfg.subtitleZh
      : locale === "en" && bannerCfg.subtitleEn
      ? bannerCfg.subtitleEn
      : bannerCfg.subtitle ||
        "Công ty TNHH Logistics GT - Kết nối thông suốt dòng chảy biên mậu Việt - Trung và vận tải chuyên tuyến biển đảo Cô Tô.";

  const scope = about.scope || DEFAULT_ABOUT_CONTENT.scope;
  const fleetScale = about.fleetScale || DEFAULT_ABOUT_CONTENT.fleetScale;
  const customsCapability =
    about.customsCapability || DEFAULT_ABOUT_CONTENT.customsCapability;
  const visionMission =
    about.visionMission || DEFAULT_ABOUT_CONTENT.visionMission;
  const ecosystem = about.ecosystem || DEFAULT_ABOUT_CONTENT.ecosystem;

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      {/* 1. Page Banner */}
      <PageBanner
        breadcrumbs={[
          { label: t.common.home, href: "/" },
          { label: t.common.aboutUs },
        ]}
        title={aboutTitle}
        subtitle={aboutSubtitle}
        size="main"
        bgImage={bannerCfg.bgImage || "/images/about/fleet_scale_wide.webp"}
        bgScale={bannerCfg.bgScale}
        bgPosition={bannerCfg.bgPosition}
        bgOpacity={bannerCfg.bgOpacity}
      />

      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-20 sm:space-y-24">
        
        {/* ========================================================================= */}
        {/* MỤC 1: CÂU CHUYỆN DOANH NGHIỆP & BỨT PHÁ (BENTO 2 CỘT TƯƠNG PHẢN THỊ GIÁC) */}
        {/* ========================================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Cột trái: Nội dung & Thông điệp lãnh đạo (7 cols) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-azure-50 border border-azure-200 text-azure-700 text-xs font-bold">
              <Sparkles className="w-3.5 h-3.5 text-azure-600" />
              <span>Hồ sơ doanh nghiệp</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-950 tracking-tight leading-tight">
              Cầu Nối Tiếp Vận <span className="text-azure-600">Biên Mậu Việt - Trung</span> & Tuyến Vận Tải Biển Đảo
            </h1>

            {/* NỘI DUNG GIỚI THIỆU: HỖ TRỢ ĐỊNH DẠNG RICH TEXT SOẠN THẢO TRỰC QUAN HOẶC FALLBACK MẪU MỚI */}
            <div className="space-y-4 text-slate-700 text-base sm:text-lg leading-relaxed">
              {locale === "zh" && about.contentHtmlZh ? (
                <div
                  className="rich-content space-y-4 text-slate-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: about.contentHtmlZh }}
                />
              ) : locale === "en" && about.contentHtmlEn ? (
                <div
                  className="rich-content space-y-4 text-slate-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: about.contentHtmlEn }}
                />
              ) : about.contentHtml ? (
                <div
                  className="rich-content space-y-4 text-slate-700 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: about.contentHtml }}
                />
              ) : (
                <>
                  <p>
                    Được thành lập với sứ mệnh trở thành cầu nối giao thương huyết mạch giữa Việt Nam, Trung Quốc và khu vực ASEAN,{" "}
                    <strong className="text-slate-950 font-bold">Công ty TNHH Logistics GT</strong> (MST: 5701750095) đã và đang khẳng định vị thế là một trong những đơn vị tiếp vận biên mậu và vận tải biển đảo uy tín hàng đầu tại miền Bắc.
                  </p>
                  <p className="text-slate-600 text-sm sm:text-base">
                    Với trụ sở điều hành đặt ngay tại cửa ngõ Cửa khẩu Quốc tế Bắc Luân 2 (TP. Móng Cái), kết hợp cùng mạng lưới hiện trường thường trực tại các cửa khẩu Lạng Sơn (Hữu Nghị, Tân Thanh, Chi Ma) và năng lực tự sở hữu 50 đầu kéo container cùng đội tàu sà lan Cô Tô, chúng tôi cam kết mang tới giải pháp giao nhận trọn gói, an toàn và tối ưu chi phí nhất.
                  </p>
                </>
              )}
            </div>

            {/* 3 Trụ Cột Giá Trị Cốt Lõi (Mini cards) */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-azure-300 transition-colors">
                <ShieldCheck className="w-6 h-6 text-azure-600 mb-2" />
                <h4 className="font-bold text-slate-900 text-sm">Chính Ngạch 100%</h4>
                <p className="text-xs text-slate-500 mt-1">Chuẩn pháp lý, C/O Form E và hóa đơn GTGT hợp lệ.</p>
              </div>
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-gold-400 transition-colors">
                <Clock className="w-6 h-6 text-gold-500 mb-2" />
                <h4 className="font-bold text-slate-900 text-sm">Tốc Độ Trong Ngày</h4>
                <p className="text-xs text-slate-500 mt-1">Giải phóng phương tiện nhanh, giao thẳng kho nhà máy.</p>
              </div>
              <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs hover:border-emerald-300 transition-colors">
                <MapPin className="w-6 h-6 text-emerald-600 mb-2" />
                <h4 className="font-bold text-slate-900 text-sm">Hiện Trường 24/7</h4>
                <p className="text-xs text-slate-500 mt-1">Chuyên viên túc trực tại 4 cửa khẩu trọng điểm.</p>
              </div>
            </div>

            {/* Trụ sở & Hotline nhanh */}
            <div className="flex flex-wrap items-center gap-4 pt-2 text-xs text-slate-600">
              <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">
                <MapPin className="w-4 h-4 text-slate-500" />
                <span>Trụ sở: Căn ĐLTC-41, KĐT Vinhomes Golden Avenue, TP. Móng Cái</span>
              </div>
              <div className="flex items-center gap-1.5 bg-gold-50 px-3 py-1.5 rounded-lg border border-gold-200 text-gold-800 font-semibold">
                <PhoneCall className="w-4 h-4 text-gold-600" />
                <span>Hotline: {settings.hotline || "0904.382.268"}</span>
              </div>
            </div>
          </div>

          {/* Cột phải: Khung ảnh đại diện quy mô tập thể & lãnh đạo Gala 2026 (5 cols) */}
          <div className="lg:col-span-5 relative">
            <div className="relative h-[380px] sm:h-[460px] w-full rounded-2xl overflow-hidden shadow-xl border border-slate-200 group">
              <Image
                src="/images/about/gala_team_leadership.webp"
                alt="Ban Lãnh Đạo & Toàn Thể Cán Bộ Nhân Viên HTC - GT Logistics Gala 2026"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 1024px) 100vw, 500px"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-slate-950/30 to-transparent" />
              
              {/* Badge góc trên */}
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-lg shadow-md border border-slate-100 flex items-center gap-2">
                <Award className="w-4 h-4 text-gold-500" />
                <span className="text-xs font-black text-slate-900">Tập thể đồng lòng 2026</span>
              </div>

              {/* Thông tin chân ảnh */}
              <div className="absolute bottom-4 left-5 right-5 text-white">
                <div className="flex items-center gap-2 mb-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 motion-safe:animate-pulse motion-reduce:animate-none" />
                  <span className="text-xs font-bold text-azure-300">Hệ thống HTC & GT Logistics</span>
                </div>
                <h4 className="text-lg font-black text-white leading-snug">
                  Cùng Nhau Bứt Phá - Dẫn Đầu Thành Công
                </h4>
                <p className="text-xs text-slate-200 mt-1 line-clamp-2">
                  Đội ngũ ban lãnh đạo, cán bộ nghiệp vụ xuất nhập khẩu và tài xế liên vận thường trực sẵn sàng phục vụ quý khách hàng.
                </p>
              </div>
            </div>

            {/* Floating Card nhỏ phía dưới góc phải */}
            <div className="absolute -bottom-6 -right-2 sm:-right-6 bg-white rounded-xl p-3 sm:p-4 shadow-xl border border-slate-200 flex items-center gap-3 z-10">
              <div className="w-10 h-10 rounded-lg bg-azure-500 flex items-center justify-center text-white font-black text-sm">
                50+
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">Xe Đầu Kéo Container</p>
                <p className="text-[11px] text-slate-500">Chủ động 100% phương tiện</p>
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* MỤC 2: CHỈ SỐ BẢO CHỨNG NĂNG LỰC DOANH NGHIỆP (4-CARD METRIC STRIP HIỆN ĐẠI) */}
        {/* ========================================================================= */}
        <section className="bg-slate-900 text-white rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="absolute -right-20 -top-20 w-80 h-80 bg-azure-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -left-20 -bottom-20 w-80 h-80 bg-gold-500/10 rounded-full blur-3xl pointer-events-none" />

          <div className="relative z-10 grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-slate-800">
            {/* Stat 1 */}
            <div className="pt-4 sm:pt-0 sm:px-4 space-y-2">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">50</span>
                <span className="text-2xl font-black text-gold-400">+</span>
              </div>
              <p className="text-sm font-bold text-azure-300">Xe Container Trực Sở Hữu</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Đội xe Việt Phúc sẵn sàng điều động 24/7, vận chuyển giao thẳng Door-to-Door không qua trung gian.
              </p>
            </div>

            {/* Stat 2 */}
            <div className="pt-4 sm:pt-0 sm:px-4 space-y-2">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">04</span>
                <span className="text-2xl font-black text-azure-400">Cửa Khẩu</span>
              </div>
              <p className="text-sm font-bold text-azure-300">Huyết Mạch Phía Bắc</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Thường trực tại Móng Cái (Bắc Luân 2, Ka Long), Hữu Nghị, Tân Thanh và Chi Ma.
              </p>
            </div>

            {/* Stat 3 */}
            <div className="pt-4 sm:pt-0 sm:px-4 space-y-2">
              <div className="flex items-baseline gap-1">
                <span className="text-4xl sm:text-5xl font-black text-white tracking-tight">100</span>
                <span className="text-2xl font-black text-gold-400">%</span>
              </div>
              <p className="text-sm font-bold text-azure-300">Chính Ngạch & C/O Form E</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Tuyệt đối chuẩn pháp lý, tối ưu thuế suất ưu đãi 0%, hóa đơn GTGT đầy đủ.
              </p>
            </div>

            {/* Stat 4 */}
            <div className="pt-4 sm:pt-0 sm:px-4 space-y-2">
              <div className="flex items-baseline gap-1">
                <span className="text-3xl sm:text-4xl font-black text-white tracking-tight">ĐỘI TÀU</span>
                <span className="text-xl font-bold text-emerald-400">SÀ LAN</span>
              </div>
              <p className="text-sm font-bold text-azure-300">Chuyên Tuyến Cô Tô</p>
              <p className="text-xs text-slate-400 leading-relaxed">
                Vận chuyển container, xe cơ giới và vật liệu xây dựng tới các xã đảo Cô Tô Lớn, Thanh Lân.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* MỤC 3: QUY MÔ NĂNG LỰC ĐỘI XE CONTAINER VIỆT PHÚC (ẢNH THỰC TẾ + BENTO GRID) */}
        {/* ========================================================================= */}
        <section className="space-y-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div className="space-y-2">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-gold-50 border border-gold-200 text-gold-700 text-xs font-bold">
                <Truck className="w-3.5 h-3.5 text-gold-600" />
                <span>Năng lực vận tải đường bộ</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                Quy Mô 50 Xe Container - Đội Xe Hùng Hậu Việt Phúc
              </h2>
            </div>
            <p className="text-sm text-slate-500 max-w-md">
              Chủ động 100% về phương tiện vận tải đường bộ, loại bỏ hoàn toàn các tầng nấc trung gian, giúp doanh nghiệp bình ổn cước phí ngay cả trong mùa cao điểm.
            </p>
          </div>

          {/* Ảnh Toàn Cảnh Đại Đội Xe & Đội Ngũ Lái Xe */}
          <div className="relative h-72 sm:h-96 lg:h-[460px] w-full rounded-2xl overflow-hidden shadow-lg border border-slate-200 group">
            <Image
              src="/images/about/fleet_scale_wide.webp"
              alt="Quy mô 50 đầu kéo container Việt Phúc và đội ngũ lái xe chuyên nghiệp"
              fill
              className="object-cover group-hover:scale-102 transition-transform duration-700"
              sizes="(max-width: 1280px) 100vw, 1200px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/85 via-slate-950/20 to-transparent" />
            <div className="absolute bottom-5 left-6 right-6 flex flex-col sm:flex-row sm:items-end justify-between gap-3 text-white">
              <div>
                <span className="text-xs font-bold text-azure-300 block mb-1">
                  Việt Phúc Logistics • Đội xe đường trường & liên vận
                </span>
                <p className="text-base sm:text-lg font-bold text-white max-w-2xl">
                  Dàn xe đầu kéo Chenglong, Hino, Sitrak chuyên dụng cùng đội ngũ lái xe giàu kinh nghiệm túc trực 24/7.
                </p>
              </div>
              <div className="flex items-center gap-2 bg-white/10 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/20 text-xs text-slate-200">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>100% Xe Gắn GPS Giám Sát</span>
              </div>
            </div>
          </div>

          {/* 3 Thẻ Bento chi tiết năng lực xe */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-shadow space-y-3">
              <div className="w-12 h-12 rounded-xl bg-azure-50 flex items-center justify-center text-azure-600 font-bold">
                <Boxes className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-950">Đa Dạng Loại Moóc & Vỏ Cont</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Đầy đủ container tiêu chuẩn 20ft, 40ft, 45ft, moóc sàn, moóc lùn phục vụ hàng siêu trường siêu trọng và moóc rào vận chuyển hàng rời.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-shadow space-y-3">
              <div className="w-12 h-12 rounded-xl bg-gold-50 flex items-center justify-center text-gold-600 font-bold">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-950">Vận Chuyển Door-to-Door</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Hàng sau khi thông quan tại cửa khẩu được kéo thẳng tới tận nhà máy và kho bãi của doanh nghiệp, không sang tải, giảm tối đa rủi ro hư hỏng.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white border border-slate-200 shadow-xs hover:shadow-md transition-shadow space-y-3">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center text-emerald-600 font-bold">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-slate-950">Định Vị & An Toàn Tuyệt Đối</h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Cập nhật lộ trình minh bạch theo thời gian thực. Toàn bộ xe được bảo dưỡng định kỳ tại trạm xưởng riêng, tuân thủ nghiêm ngặt chuẩn an toàn đường bộ.
              </p>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* MỤC 4: 2 MŨI NHỌN CHIẾN LƯỢC: BIỂN ĐẢO CÔ TÔ & THÔNG QUAN CỬA KHẨU QUỐC TẾ */}
        {/* ========================================================================= */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-10">
          
          {/* Cột 1: Chuyên tuyến biển đảo Cô Tô */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs hover:border-azure-300 transition-colors flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-azure-50 text-azure-700 text-xs font-bold">
                <Ship className="w-3.5 h-3.5 text-azure-600" />
                <span>Vận tải đường thủy nội địa</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-950">
                Chuyên Tuyến Tàu & Sà Lan Biển Đảo Cô Tô
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Khai thác tuyến vận tải đường thủy đặc thù từ đất liền ra toàn bộ huyện đảo Cô Tô (Cô Tô Lớn, Cô Tô Con, đảo Thanh Lân và các đảo tiền tiêu), đảm bảo dòng chảy hàng hóa không bị đứt gãy.
              </p>
            </div>

            {/* Collage 2 ảnh biển đảo */}
            <div className="grid grid-cols-2 gap-3 h-52 sm:h-64">
              <div className="relative rounded-xl overflow-hidden border border-slate-200">
                <Image
                  src="/images/about/coto_sea_barge.webp"
                  alt="Sà lan vận tải chuyên dụng chở thiết bị cơ giới nặng ra đảo Cô Tô"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 300px"
                />
                <span className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-xs text-[10px] text-white px-2 py-0.5 rounded font-medium">
                  Sà Lan Trọng Tải Lớn
                </span>
              </div>
              <div className="relative rounded-xl overflow-hidden border border-slate-200">
                <Image
                  src="/images/about/coto_island_freight.webp"
                  alt="Đội phà vận chuyển đoàn xe tải biển 14E vượt sóng ra đảo"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 300px"
                />
                <span className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-xs text-[10px] text-white px-2 py-0.5 rounded font-medium">
                  Phà Chở Xe & Hàng Hóa
                </span>
              </div>
            </div>

            <ul className="space-y-2 text-xs sm:text-sm text-slate-700 pt-2 border-t border-slate-100">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-azure-600 mt-0.5 shrink-0" />
                <span>Vận chuyển thiết bị công trình, xe tải, cát đá xi măng và nhu yếu phẩm ra đảo.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-azure-600 mt-0.5 shrink-0" />
                <span>Chủ động đội tàu vượt sóng lớn, lịch trình đều đặn, không để hàng hóa ứ đọng tại cảng.</span>
              </li>
            </ul>
          </div>

          {/* Cột 2: Thông quan cửa khẩu & Cảng biển */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200 shadow-xs hover:border-gold-300 transition-colors flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-gold-50 text-gold-700 text-xs font-bold">
                <FileCheck className="w-3.5 h-3.5 text-gold-600" />
                <span>Thủ tục hải quan & cảng nước sâu</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black text-slate-950">
                Thông Quan 4 Cửa Khẩu & Cảng Nước Sâu CICT
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed">
                Đội ngũ chuyên viên hiện trường túc trực tại Cửa khẩu Móng Cái, Hữu Nghị, Tân Thanh, Chi Ma và Cảng quốc tế Cái Lân, giải quyết thần tốc mọi vướng mắc hồ sơ.
              </p>
            </div>

            {/* Collage 2 ảnh chuyển tải & cảng biển */}
            <div className="grid grid-cols-2 gap-3 h-52 sm:h-64">
              <div className="relative rounded-xl overflow-hidden border border-slate-200">
                <Image
                  src="/images/about/viet_china_border_transfer.webp"
                  alt="Quy trình cẩu chuyển tải container tại cửa khẩu biên giới Việt - Trung"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 300px"
                />
                <span className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-xs text-[10px] text-white px-2 py-0.5 rounded font-medium">
                  Cẩu Chuyển Tải Biên Giới
                </span>
              </div>
              <div className="relative rounded-xl overflow-hidden border border-slate-200">
                <Image
                  src="/images/about/cict_port_supervision.webp"
                  alt="Chuyên viên giám sát giao nhận tại cảng container quốc tế Cái Lân"
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 50vw, 300px"
                />
                <span className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-xs text-[10px] text-white px-2 py-0.5 rounded font-medium">
                  Giám Sát Cảng Nước Sâu
                </span>
              </div>
            </div>

            <ul className="space-y-2 text-xs sm:text-sm text-slate-700 pt-2 border-t border-slate-100">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-gold-600 mt-0.5 shrink-0" />
                <span>Chuyên trị hàng khó: Quá cảnh (Transit), hóa chất nguy hiểm, máy móc quá khổ quá tải.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-gold-600 mt-0.5 shrink-0" />
                <span>Kiểm định vải dệt may cấp tốc, tư vấn C/O Form E chuẩn chỉnh hưởng thuế 0%.</span>
              </li>
            </ul>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* MỤC 5: HỆ SINH THÁI 3 TRỤ CỘT KHÉP KÍN (ECOSYSTEM INTERACTIVE CARDS) */}
        {/* ========================================================================= */}
        <section className="space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-200 text-slate-700 text-xs font-bold">
              <Layers className="w-3.5 h-3.5 text-slate-600" />
              <span>Cấu trúc hệ thống</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Hệ Sinh Thái Tiếp Vận Khép Kín GT
            </h2>
            <p className="text-sm text-slate-600">
              Sự liên kết chặt chẽ giữa 3 đơn vị mũi nhọn tạo nên sức mạnh tổng hợp, kiểm soát toàn diện từ biên giới đường bộ tới hải đảo xa xôi.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Đơn vị 1 */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border-2 border-azure-100 hover:border-azure-400 shadow-xs hover:shadow-lg transition-colors duration-200 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded bg-azure-50 text-azure-700">
                    Công ty mẹ
                  </span>
                  <ShieldCheck className="w-5 h-5 text-azure-600" />
                </div>
                <h3 className="text-lg font-black text-slate-950">
                  CÔNG TY TNHH LOGISTICS GT
                </h3>
                <p className="text-xs font-bold text-azure-700">
                  Trung tâm Điều hành & Nghiệp vụ Hải quan
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Đầu mối quản trị chuỗi cung ứng, phụ trách toàn bộ thủ tục thông quan tại hệ thống cửa khẩu Móng Cái, Hữu Nghị, Tân Thanh, Chi Ma và xử lý các lô hàng đặc thù.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
                MST: 5701750095 • Vinhomes Golden Avenue
              </div>
            </div>

            {/* Đơn vị 2 */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border-2 border-gold-100 hover:border-gold-400 shadow-xs hover:shadow-lg transition-colors duration-200 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded bg-gold-50 text-gold-700">
                    Công ty thành viên
                  </span>
                  <Truck className="w-5 h-5 text-gold-600" />
                </div>
                <h3 className="text-lg font-black text-slate-950">
                  VIỆT PHÚC LOGISTICS
                </h3>
                <p className="text-xs font-bold text-gold-700">
                  Đơn Vị Vận Tải Đường Bộ & Liên Vận
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Trực tiếp điều phối đội ngũ 50 xe container, giải phóng phương tiện tại cửa khẩu và vận chuyển giao thẳng Door-to-Door tới các khu công nghiệp toàn quốc.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
                Đội xe 50 đầu kéo • Bãi xe trạm bảo dưỡng riêng
              </div>
            </div>

            {/* Đơn vị 3 */}
            <div className="bg-white rounded-2xl p-6 sm:p-7 border-2 border-emerald-100 hover:border-emerald-400 shadow-xs hover:shadow-lg transition-colors duration-200 space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold px-2.5 py-1 rounded bg-emerald-50 text-emerald-700">
                    Công ty thành viên
                  </span>
                  <Ship className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="text-lg font-black text-slate-950">
                  VẬN TẢI CÔ TÔ
                </h3>
                <p className="text-xs font-bold text-emerald-700">
                  Chuyên Tuyến Tàu & Sà Lan Biển Đảo
                </p>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Quản lý đội sà lan và tàu tải trọng lớn chuyên chở phương tiện, container, thiết bị dự án xây dựng và hàng hóa ra toàn bộ các đảo thuộc huyện Cô Tô.
                </p>
              </div>
              <div className="pt-3 border-t border-slate-100 text-[11px] text-slate-500 font-medium">
                Đội sà lan biển • Khai thác chuyên tuyến hải đảo
              </div>
            </div>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* MỤC 6: TẦM NHÌN & SỨ MỆNH (NAVY ACCENT BOX HIỆN ĐẠI) */}
        {/* ========================================================================= */}
        <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-azure-50 flex items-center justify-center text-azure-600">
              <Compass className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-black text-slate-950">Tầm Nhìn Chiến Lược</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {visionMission?.vision ||
                "Trở thành doanh nghiệp Logistics đa phương thức hàng đầu khu vực phía Bắc, kết nối hoàn hảo giữa vận tải đường bộ biên giới Việt - Trung và vận tải tàu/sà lan biển đảo."}
            </p>
          </div>

          <div className="bg-white rounded-2xl p-6 sm:p-8 border border-slate-200 shadow-xs space-y-3">
            <div className="w-10 h-10 rounded-xl bg-gold-50 flex items-center justify-center text-gold-600">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-xl font-black text-slate-950">Sứ Mệnh Phụng Sự</h3>
            <p className="text-sm text-slate-600 leading-relaxed">
              {visionMission?.mission ||
                "Đơn giản hóa mọi thủ tục hải quan phức tạp, cung cấp năng lực vận tải mạnh mẽ cho các mặt hàng đặc thù và công trình biển đảo, giúp đối tác tối ưu chi phí và bứt phá doanh thu."}
            </p>
          </div>
        </section>

        {/* ========================================================================= */}
        {/* MỤC 7: KÊU GỌI HÀNH ĐỘNG (CTA STRIP TẬN DỤNG HOTLINE SẴN CÓ) */}
        {/* ========================================================================= */}
        <section className="bg-gradient-to-r from-slate-950 via-slate-900 to-azure-950 rounded-3xl p-8 sm:p-12 text-white flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
          <div className="space-y-2 text-center md:text-left">
            <span className="text-xs font-bold text-azure-400">
              Đồng hành cùng doanh nghiệp
            </span>
            <h3 className="text-2xl sm:text-3xl font-black text-white">
              Sẵn Sàng Giải Phóng Lô Hàng Của Bạn?
            </h3>
            <p className="text-sm text-slate-300 max-w-xl">
              Liên hệ ngay với bộ phận điều vận hiện trường của Logistics GT để nhận báo giá cước vận tải container hoặc tư vấn thủ tục hải quan trong vòng 15 phút.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-4 shrink-0">
            <Link
              href="/quote"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-azure-500 hover:bg-azure-400 active:bg-azure-600 text-white font-bold text-sm shadow-lg hover:shadow-azure-500/25 transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-azure-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              <span>Yêu Cầu Báo Giá</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={`tel:${cleanPhone}`}
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 text-white font-bold text-sm border border-white/20 backdrop-blur-xs transition-colors duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2 focus-visible:ring-offset-slate-900"
            >
              <PhoneCall className="w-4 h-4 text-gold-400" />
              <span>{settings.hotline || "0904.382.268"}</span>
            </a>
          </div>
        </section>

      </div>
    </div>
  );
}