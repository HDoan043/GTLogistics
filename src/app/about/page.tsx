import React from "react";
import Image from "next/image";
import Link from "next/link";
import { PhoneCall, ArrowRight } from "lucide-react";
import { PageBanner } from "@/components/layout/PageBanner";
import { getSiteSettings } from "@/modules/settings/actions";
import { getServerDictionary } from "@/lib/i18n/server";
import { getPageSectionContent } from "@/modules/content/actions";
import { DEFAULT_ABOUT_CONTENT, DEFAULT_BANNERS_CONTENT } from "@/modules/content/constants";

export const metadata = {
  title: "Giới Thiệu Về Chúng Tôi | GT Logistics",
  description:
    "Tìm hiểu về năng lực tiếp vận, quy mô 50 xe container, đội tàu sà lan Cô Tô và hệ sinh thái khép kín của Công ty TNHH Logistics GT.",
};

export default async function AboutPage() {
  const [{ locale, t }, settings, bannersContent] = await Promise.all([
    getServerDictionary(),
    getSiteSettings(),
    getPageSectionContent("content_banners", DEFAULT_BANNERS_CONTENT),
  ]);

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

          <div className="space-y-4 text-slate-700 text-base sm:text-lg leading-relaxed pt-2">
            <p>
              Được thành lập với sứ mệnh trở thành cầu nối giao thương huyết mạch giữa Việt Nam, Trung Quốc và khu vực ASEAN,{" "}
              <strong className="text-slate-950 font-bold">Công ty TNHH Logistics GT</strong> (Mã số thuế: 5701750095) đã và đang khẳng định vị thế là một trong những đơn vị tiếp vận biên mậu và vận tải biển đảo uy tín hàng đầu tại miền Bắc.
            </p>
            <p>
              Với trụ sở điều hành đặt ngay tại cửa ngõ Cửa khẩu Bắc Luân 2 (KĐT Vinhomes Golden Avenue, TP. Móng Cái), hiện diện trực tiếp tại các cửa khẩu trọng điểm Lạng Sơn (Hữu Nghị, Tân Thanh, Chi Ma), kết hợp cùng năng lực 50 xe đầu kéo container và đội tàu/sà lan chuyên tuyến Cô Tô, chúng tôi mang đến cho doanh nghiệp giải pháp vận chuyển liền mạch từ biên giới trên bộ ra tới tận hải đảo.
            </p>
          </div>

          {/* Ảnh minh họa trụ sở và nhân sự */}
          <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden shadow-xs border border-slate-200 mt-6">
            <Image
              src="/images/vietphuc/hero_office_panoramic.webp"
              alt="Trụ sở điều hành và chuyên viên Logistics GT"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 896px"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-4 left-6 right-6 text-white flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-azure-300 block">Trụ Sở Điều Hành Bắc Luân 2</span>
                <p className="text-xs sm:text-sm text-slate-200">Căn ĐLTC-41, KĐT Vinhomes Golden Avenue, TP. Móng Cái</p>
              </div>
              <div className="hidden sm:flex items-center gap-1.5 text-xs text-gold-300 font-bold">
                <PhoneCall className="w-4 h-4 text-gold-400" />
                <span>0904.382.268</span>
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
                Phạm vi phủ sóng
              </h3>
              <p className="text-sm sm:text-base">
                Logistics GT thiết lập mạng lưới điều vận và thông quan hiện trường thường trực 24/7 tại toàn bộ các cửa khẩu huyết mạch biên giới phía Bắc cùng tuyến vận tải biển đảo chuyên biệt:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base text-slate-700">
                <li>
                  <strong>Cửa khẩu Quốc tế Móng Cái (Bắc Luân 2 & Ka Long - Quảng Ninh):</strong> Đầu mối giao thương tốc độ cao kết nối trực tiếp TP. Đông Hưng (Trung Quốc) và trục cao tốc Vân Đồn - Móng Cái - Hà Nội - Hải Phòng.
                </li>
                <li>
                  <strong>Cửa khẩu Quốc tế Hữu Nghị (Lạng Sơn):</strong> Tuyến huyết mạch đường bộ hàng đầu cho hàng điện tử, linh kiện công nghệ cao, máy móc thiết bị và hàng quá cảnh quốc tế.
                </li>
                <li>
                  <strong>Cửa khẩu Tân Thanh (Lạng Sơn):</strong> Trung tâm thông quan hàng nông sản, trái cây tươi và hàng tiêu dùng với quy trình kiểm dịch thực vật, giải phóng phương tiện nhanh gọn.
                </li>
                <li>
                  <strong>Cửa khẩu Chi Ma (Lạng Sơn):</strong> Cửa ngõ thông quan tối ưu chi phí và thời gian cho hàng bách hóa, nguyên phụ liệu dệt may (hàng vải) và hàng thương mại biên giới.
                </li>
                <li>
                  <strong>Chuyên tuyến vận tải biển đảo Cô Tô:</strong> Vận tải đường thủy bằng tàu tải trọng lớn và sà lan chuyên dụng từ đất liền ra khắp tất cả các đảo thuộc huyện đảo Cô Tô (Cô Tô lớn, Cô Tô con, đảo Thanh Lân và các đảo phụ cận).
                </li>
              </ul>
            </div>

            {/* Header phụ 2: Quy mô vận tải */}
            <div className="space-y-3">
              <h3 className="text-lg sm:text-xl font-bold text-slate-950">
                Quy mô vận tải
              </h3>
              <p className="text-sm sm:text-base">
                Chủ động hoàn toàn về năng lực phương tiện vận tải đường bộ và đường thủy nội địa, không phụ thuộc vào đơn vị trung gian:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base text-slate-700">
                <li>
                  <strong>Đội xe 50 đầu kéo container:</strong> Trực tiếp sở hữu và điều hành 50 đầu kéo chuyên dụng (20ft, 40ft, 45ft), moóc sàn, moóc lùn và moóc rào, sẵn sàng điều động 24/7 trên toàn quốc.
                </li>
                <li>
                  <strong>Vận chuyển giao thẳng (Door-to-Door):</strong> Hàng hóa sau khi hoàn tất thủ tục hải quan tại cửa khẩu được xe kéo giao thẳng về kho bãi, nhà máy của doanh nghiệp, loại bỏ rủi ro sang tải và tiết kiệm chi phí bến bãi.
                </li>
                <li>
                  <strong>Đội tàu biển và sà lan Cô Tô:</strong> Năng lực vận chuyển đa dạng các loại vật liệu xây dựng (cát, đá, xi măng, sắt thép), máy móc công trình cơ giới nặng và nhu yếu phẩm phục vụ phát triển kinh tế biển đảo.
                </li>
                <li>
                  <strong>Giám sát hành trình trực tuyến:</strong> 100% phương tiện gắn định vị GPS và cảm biến giám sát liên tục, cập nhật lộ trình minh bạch và cam kết an toàn hàng hóa tuyệt đối.
                </li>
              </ul>
            </div>

            {/* Header phụ 3: Thông quan hàng hóa */}
            <div className="space-y-3">
              <h3 className="text-lg sm:text-xl font-bold text-slate-950">
                Thông quan hàng hóa
              </h3>
              <p className="text-sm sm:text-base">
                Quy trình thông quan chính ngạch, chuẩn mực pháp lý và xử lý triệt để các loại hàng hóa phức tạp:
              </p>
              <ul className="list-disc pl-5 space-y-2 text-sm sm:text-base text-slate-700">
                <li>
                  <strong>100% nghiệp vụ chính ngạch:</strong> Đại lý hải quan điện tử trực tiếp truyền tờ khai qua hệ thống VNACCS/VCIS, đảm bảo chứng từ hợp lệ và xuất hóa đơn đầy đủ.
                </li>
                <li>
                  <strong>Tư vấn mã HS Code và tối ưu biểu thuế:</strong> Rà soát hợp đồng thương mại, phân loại mã hàng chuẩn xác, xin cấp và kiểm tra tính hợp lệ của C/O Form E để hưởng thuế suất ưu đãi đặc biệt ACFTA.
                </li>
                <li>
                  <strong>Đa dạng loại hình xuất nhập khẩu:</strong> Nhập kinh doanh (A11), Nhập sản xuất xuất khẩu (E31), Gia công may mặc & điện tử (E21), Tạm nhập tái xuất, Hàng dự án đầu tư miễn thuế.
                </li>
                <li>
                  <strong>Chuyên gia xử lý hàng đặc thù:</strong> Năng lực vượt trội đối với hàng quá khổ quá tải (OOG/Project Cargo), hàng quá cảnh kẹp chì hải quan sang Lào/Campuchia, hàng hóa chất và kiểm định nhanh vải may mặc.
                </li>
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
                Trở thành doanh nghiệp Logistics đa phương thức hàng đầu khu vực phía Bắc, kết nối hoàn hảo giữa vận tải đường bộ biên giới Việt - Trung và vận tải tàu/sà lan biển đảo.
              </p>
            </div>

            <div className="space-y-2">
              <h3 className="text-lg sm:text-xl font-bold text-slate-950">
                Sứ mệnh
              </h3>
              <p className="text-sm sm:text-base leading-relaxed">
                Đơn giản hóa mọi thủ tục hải quan phức tạp, cung cấp năng lực vận tải mạnh mẽ cho các mặt hàng đặc thù và công trình biển đảo, giúp đối tác tối ưu chi phí và bứt phá doanh thu.
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
              <li>Logistics GT (Công ty mẹ)</li>
              <li>Việt Phúc Logistics (Công ty thành viên)</li>
              <li>Vận tải Cô Tô (Công ty thành viên)</li>
            </ul>

            <div className="space-y-8 pt-4">
              {/* Công ty 1 */}
              <div className="space-y-2.5">
                <h3 className="text-lg sm:text-xl font-bold text-slate-950">
                  Công ty TNHH Logistics GT (Công ty mẹ)
                </h3>
                <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-base text-slate-700">
                  <li>
                    <strong>Vai trò trong hệ sinh thái:</strong> Trung tâm điều hành & thủ tục hải quan, quản trị chuỗi cung ứng tổng thể.
                  </li>
                  <li>
                    <strong>Thế mạnh trọng tâm:</strong> Khai báo hải quan đa cửa khẩu (Móng Cái, Hữu Nghị, Tân Thanh, Chi Ma), tư vấn tối ưu thuế XNK, xử lý hàng quá khổ quá tải, hàng quá cảnh, hóa chất nguy hiểm và kiểm định vải dệt may.
                  </li>
                </ul>
              </div>

              {/* Công ty 2 */}
              <div className="space-y-2.5">
                <h3 className="text-lg sm:text-xl font-bold text-slate-950">
                  Việt Phúc Logistics (Công ty thành viên)
                </h3>
                <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-base text-slate-700">
                  <li>
                    <strong>Vai trò trong hệ sinh thái:</strong> Đơn vị vận tải đường bộ liên vận & nội địa.
                  </li>
                  <li>
                    <strong>Thế mạnh trọng tâm:</strong> Trực tiếp quản lý và điều phối đội xe 50 đầu kéo container, kết nối luồng hàng tốc độ cao từ các cửa khẩu Lạng Sơn - Quảng Ninh - Hải Phòng đi toàn quốc theo hình thức giao thẳng Door-to-Door.
                  </li>
                </ul>
              </div>

              {/* Công ty 3 */}
              <div className="space-y-2.5">
                <h3 className="text-lg sm:text-xl font-bold text-slate-950">
                  Vận tải Cô Tô (Công ty thành viên)
                </h3>
                <ul className="list-disc pl-5 space-y-1.5 text-sm sm:text-base text-slate-700">
                  <li>
                    <strong>Vai trò trong hệ sinh thái:</strong> Đơn vị khai thác tàu & sà lan biển đảo.
                  </li>
                  <li>
                    <strong>Thế mạnh trọng tâm:</strong> Vận hành đội tàu biển và sà lan tải trọng lớn, chuyên trách vận chuyển hàng hóa, vật tư công trình, máy móc thiết bị và hàng tiêu dùng đi tất cả các đảo thuộc khu vực Cô Tô, Quảng Ninh.
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}
