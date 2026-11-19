import React from "react";
import Image from "next/image";
import Link from "next/link";
import { PhoneCall, ArrowRight } from "lucide-react";
import { PageBanner } from "@/components/layout/PageBanner";
import { getSiteSettings } from "@/modules/settings/actions";
import { getServerDictionary } from "@/lib/i18n/server";
import { getPageSectionContent } from "@/modules/content/actions";
import { DEFAULT_ABOUT_CONTENT, DEFAULT_BANNERS_CONTENT } from "@/modules/content/constants";

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

  const storyImg =
    about.storyImage || "/images/vietphuc/hero_office_panoramic.webp";

  const scope = about.scope || DEFAULT_ABOUT_CONTENT.scope;
  const fleetScale = about.fleetScale || DEFAULT_ABOUT_CONTENT.fleetScale;
  const customsCapability =
    about.customsCapability || DEFAULT_ABOUT_CONTENT.customsCapability;
  const visionMission =
    about.visionMission || DEFAULT_ABOUT_CONTENT.visionMission;
  const ecosystem = about.ecosystem || DEFAULT_ABOUT_CONTENT.ecosystem;

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900">
      {/* Banner Tiêu đề Trang chính với ảnh nền Việt Phúc mới nhất */}
      <PageBanner
        breadcrumbs={[
          { label: t.common.home, href: "/" },
          { label: t.common.aboutUs },
        ]}
        title={aboutTitle}
        subtitle={aboutSubtitle}
        size="main"
        bgImage={bannerCfg.bgImage}
        bgScale={bannerCfg.bgScale}
        bgPosition={bannerCfg.bgPosition}
        bgOpacity={bannerCfg.bgOpacity}
      />

      {/* BỐ CỤC 1 HÀNG DỌC CHUẨN MỰC, TẬP TRUNG HEADER VÀ TEXT PHÂN CẤP KHOA HỌC */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-16 sm:space-y-20">
        
        {/* MỤC 1: VỀ CHÚNG TÔI */}
        <section className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            VỀ CHÚNG TÔI
          </h2>
          <div className="h-0.5 w-16 bg-slate-900" />

          {/* NỘI DUNG GIỚI THIỆU: HỖ TRỢ ĐỊNH DẠNG RICH TEXT SOẠN THẢO TRỰC QUAN HOẶC FALLBACK ĐOẠN VĂN BẢN CŨ */}
          {locale === "zh" && about.contentHtmlZh ? (
            <div
              className="rich-content space-y-4 text-slate-700 leading-relaxed pt-2"
              dangerouslySetInnerHTML={{ __html: about.contentHtmlZh }}
            />
          ) : locale === "en" && about.contentHtmlEn ? (
            <div
              className="rich-content space-y-4 text-slate-700 leading-relaxed pt-2"
              dangerouslySetInnerHTML={{ __html: about.contentHtmlEn }}
            />
          ) : about.contentHtml ? (
            <div
              className="rich-content space-y-4 text-slate-700 leading-relaxed pt-2"
              dangerouslySetInnerHTML={{ __html: about.contentHtml }}
            />
          ) : (
            <div className="space-y-4 text-slate-700 text-base sm:text-lg leading-relaxed pt-2">
              {about.paragraphs && about.paragraphs.length > 0 ? (
                about.paragraphs.map((p: any, idx: number) => {
                  const text =
                    locale === "zh" && p.zh
                      ? p.zh
                      : locale === "en" && p.en
                      ? p.en
                      : p.vi || p;
                  return (
                    <p key={idx} className="leading-relaxed">
                      {text}
                    </p>
                  );
                })
              ) : (
                <p>
                  Được thành lập với sứ mệnh trở thành cầu nối giao thương huyết mạch giữa Việt Nam, Trung Quốc và khu vực ASEAN,{" "}
                  <strong className="text-slate-950 font-bold">Công ty TNHH Logistics GT</strong> (Mã số thuế: 5701750095) đã và đang khẳng định vị thế là một trong những đơn vị tiếp vận biên mậu và vận tải biển đảo uy tín hàng đầu tại miền Bắc.
                </p>
              )}
            </div>
          )}

          {/* Ảnh minh họa trụ sở và nhân sự */}
          <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden shadow-xs border border-slate-200 mt-6">
            <Image
              src={storyImg}
              alt="Trụ sở điều hành và chuyên viên Logistics GT"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 896px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-6 right-6 text-white flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-azure-300 block">Trụ Sở Điều Hành Bắc Luân 2</span>
                <p className="text-xs sm:text-sm text-slate-200">{about.companyInfo?.headquarters || "Căn ĐLTC-41, KĐT Vinhomes Golden Avenue, TP. Móng Cái"}</p>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-gold-300 font-bold">
                <PhoneCall className="w-4 h-4 text-gold-400" />
                <span>{cleanPhone}</span>
              </div>
            </div>
          </div>
        </section>

        {/* MỤC 2: QUY MÔ VẬN TẢI & PHẠM VI PHỦ SÓNG */}
        <section className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            QUY MÔ VẬN TẢI & PHẠM VI PHỦ SÓNG
          </h2>
          <div className="h-0.5 w-16 bg-slate-900" />

          <div className="space-y-8 pt-2 text-slate-700 leading-relaxed">
            {/* Header phụ 1: Phạm vi phủ sóng */}
            <div className="space-y-3">
              <h3 className="text-lg sm:text-xl font-bold text-slate-950">
                {scope.heading || "Phạm vi phủ sóng"}
              </h3>
              {scope.description && (
                <p className="text-sm sm:text-base">
                  {scope.description}
                </p>
              )}
              <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base text-slate-700">
                {(scope.items || []).map((item: string, i: number) => {
                  const parts = item.split(":");
                  return (
                    <li key={i}>
                      {parts.length > 1 ? (
                        <>
                          <strong>{parts[0]}:</strong>{parts.slice(1).join(":")}
                        </>
                      ) : (
                        item
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Header phụ 2: Quy mô vận tải */}
            <div className="space-y-3">
              <h3 className="text-lg sm:text-xl font-bold text-slate-950">
                {fleetScale.heading || "Quy mô vận tải"}
              </h3>
              {fleetScale.description && (
                <p className="text-sm sm:text-base">
                  {fleetScale.description}
                </p>
              )}
              <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base text-slate-700">
                {(fleetScale.items || []).map((item: string, i: number) => {
                  const parts = item.split(":");
                  return (
                    <li key={i}>
                      {parts.length > 1 ? (
                        <>
                          <strong>{parts[0]}:</strong>{parts.slice(1).join(":")}
                        </>
                      ) : (
                        item
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Header phụ 3: Thông quan hàng hóa */}
            <div className="space-y-3">
              <h3 className="text-lg sm:text-xl font-bold text-slate-950">
                {customsCapability.heading || "Thông quan hàng hóa"}
              </h3>
              {customsCapability.description && (
                <p className="text-sm sm:text-base">
                  {customsCapability.description}
                </p>
              )}
              <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base text-slate-700">
                {(customsCapability.items || []).map((item: string, i: number) => {
                  const parts = item.split(":");
                  return (
                    <li key={i}>
                      {parts.length > 1 ? (
                        <>
                          <strong>{parts[0]}:</strong>{parts.slice(1).join(":")}
                        </>
                      ) : (
                        item
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </section>

        {/* MỤC 3: TẦM NHÌN & SỨ MỆNH */}
        <section className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            TẦM NHÌN & SỨ MỆNH
          </h2>
          <div className="h-0.5 w-16 bg-slate-900" />

          <div className="space-y-6 pt-2 text-slate-700 leading-relaxed">
            <div className="space-y-2">
              <h3 className="text-lg sm:text-xl font-bold text-slate-950">
                Tầm nhìn
              </h3>
              <p className="text-sm sm:text-base leading-relaxed">
                {visionMission?.vision ||
                  "Trở thành doanh nghiệp Logistics đa phương thức hàng đầu khu vực phía Bắc, kết nối hoàn hảo giữa vận tải đường bộ biên giới Việt - Trung và vận tải tàu/sà lan biển đảo."}
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg sm:text-xl font-bold text-slate-950">
                Sứ mệnh
              </h3>
              <p className="text-sm sm:text-base leading-relaxed">
                {visionMission?.mission ||
                  "Đơn giản hóa mọi thủ tục hải quan phức tạp, cung cấp năng lực vận tải mạnh mẽ cho các mặt hàng đặc thù và công trình biển đảo, giúp đối tác tối ưu chi phí và bứt phá doanh thu."}
              </p>
            </div>
          </div>
        </section>

        {/* MỤC 4: HỆ SINH THÁI */}
        <section className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
            HỆ SINH THÁI
          </h2>
          <div className="h-0.5 w-16 bg-slate-900" />

          <div className="space-y-6 pt-2 text-slate-700 leading-relaxed">
            <p className="text-sm sm:text-base">
              Sự liên kết chặt chẽ giữa 3 đơn vị tạo nên chuỗi cung ứng khép kín, chủ động hoàn toàn về phương tiện đường bộ lẫn đường biển:
            </p>
            <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-base font-semibold text-slate-900">
              {(ecosystem || []).map((eco: any, i: number) => (
                <li key={i}>
                  {eco.unit} ({eco.tag})
                </li>
              ))}
            </ul>

            <div className="space-y-8 pt-4">
              {(ecosystem || []).map((eco: any, i: number) => (
                <div key={i} className="space-y-2.5">
                  <h3 className="text-lg sm:text-xl font-bold text-slate-950">
                    {eco.unit} ({eco.tag})
                  </h3>
                  <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-base text-slate-700">
                    {eco.role && (
                      <li>
                        <strong>Vai trò trong hệ sinh thái:</strong> {eco.role}
                      </li>
                    )}
                    {eco.desc && (
                      <li>
                        <strong>Thế mạnh trọng tâm:</strong> {eco.desc}
                      </li>
                    )}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
