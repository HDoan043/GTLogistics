import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Target,
  Compass,
  Building,
  Truck,
  Ship,
  FileCheck,
  CheckCircle2,
  PhoneCall,
  ArrowRight,
  ShieldCheck,
  Award,
} from "lucide-react";
import { PageBanner } from "@/components/layout/PageBanner";
import { getSiteSettings } from "@/modules/settings/actions";
import { getServerDictionary } from "@/lib/i18n/server";
import { getPageSectionContent } from "@/modules/content/actions";
import { DEFAULT_ABOUT_CONTENT, DEFAULT_BANNERS_CONTENT } from "@/modules/content/constants";

export const metadata = {
  title: "Giới Thiệu Về Chúng Tôi | GT Logistics",
  description:
    "Tìm hiểu về lịch sử hình thành, năng lực 50 xe container, đội tàu sà lan Cô Tô, hệ sinh thái và pháp lý của Công ty TNHH Logistics GT.",
};

export default async function AboutPage() {
  const [{ locale, t }, settings, bannersContent, aboutContent] = await Promise.all([
    getServerDictionary(),
    getSiteSettings(),
    getPageSectionContent("content_banners", DEFAULT_BANNERS_CONTENT),
    getPageSectionContent("content_about", DEFAULT_ABOUT_CONTENT),
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
        "Công ty TNHH Logistics GT – Kết nối thông suốt dòng chảy biên mậu Việt – Trung và vận tải chuyên tuyến biển đảo Cô Tô.";

  // Con số năng lực ấn tượng (KPIs bảo chứng năng lực doanh nghiệp)
  const keyMetrics = [
    {
      num: "04",
      unit: "CỬA KHẨU",
      label: "Cửa Khẩu Trọng Điểm",
      desc: "Móng Cái – Hữu Nghị – Tân Thanh – Chi Ma",
      icon: Building,
    },
    {
      num: "50+",
      unit: "ĐẦU KÉO",
      label: "Đầu Kéo Container",
      desc: "Đội xe hùng hậu, vận chuyển giao thẳng Door-to-Door",
      icon: Truck,
    },
    {
      num: "ĐỘI TÀU",
      unit: "SÀ LAN",
      label: "Tàu & Sà Lan Biển Đảo",
      desc: "Chuyên tuyến kết nối trực tiếp tất cả đảo Cô Tô",
      icon: Ship,
    },
    {
      num: "100%",
      unit: "CHÍNH NGẠCH",
      label: "Hải Quan Chính Ngạch",
      desc: "Hàng quá khổ quá tải, quá cảnh, hóa chất, hàng vải",
      icon: FileCheck,
    },
  ];

  // Hệ sinh thái công ty thành viên (Section 1.4)
  const ecosystemRows = [
    {
      unit: "CÔNG TY TNHH LOGISTICS GT",
      tag: "Công ty mẹ",
      role: "Trung tâm Điều hành & Thủ tục Hải quan",
      desc: "Quản trị chuỗi cung ứng, khai báo hải quan đa cửa khẩu (Móng Cái, Hữu Nghị, Tân Thanh, Chi Ma), xử lý hàng quá khổ quá tải, quá cảnh, hóa chất, vải vóc.",
      color: "bg-azure-50 text-azure-700 border-azure-300",
      badgeColor: "bg-azure-600 text-white",
      icon: ShieldCheck,
    },
    {
      unit: "VIỆT PHÚC LOGISTICS",
      tag: "Công ty thành viên",
      role: "Đơn vị Vận tải Đường bộ Liên vận & Nội địa",
      desc: "Trực tiếp quản lý và điều phối đội xe 50 đầu kéo container, kết nối luồng hàng tốc độ cao từ các cửa khẩu Lạng Sơn – Quảng Ninh – Hải Phòng đi toàn quốc.",
      color: "bg-gold-50 text-gold-800 border-gold-300",
      badgeColor: "bg-gold-500 text-slate-950 font-bold",
      icon: Truck,
    },
    {
      unit: "VẬN TẢI CÔ TÔ",
      tag: "Công ty thành viên",
      role: "Đơn vị Khai thác Tàu & Sà lan Biển Đảo",
      desc: "Vận hành đội tàu biển và sà lan tải trọng lớn, chuyên trách vận chuyển hàng hóa, vật tư công trình đi tất cả các đảo thuộc khu vực Cô Tô, Quảng Ninh.",
      color: "bg-emerald-50 text-emerald-800 border-emerald-300",
      badgeColor: "bg-emerald-600 text-white",
      icon: Ship,
    },
  ];

  // Đối tác & Khách hàng tin tưởng
  const partnerList = [
    { name: "Cảng Hải Phòng (Đình Vũ & Lạch Huyện)", category: "Cảng Biển Quốc Tế" },
    { name: "SITC Container Lines", category: "Hãng Tàu Quốc Tế" },
    { name: "COSCO Shipping Lines", category: "Hãng Tàu Quốc Tế" },
    { name: "Foxconn Electronics", category: "Linh Kiện Điện Tử" },
    { name: "Shenzhou International", category: "Dệt May Xuất Khẩu" },
    { name: "Texhong Textile Group", category: "Sợi & Vải Dệt May" },
    { name: "Coteccons Construction", category: "Vật Liệu & Dự Án Đảo" },
    { name: "Tập Đoàn Đèo Cả", category: "Hạ Tầng Giao Thông" },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-white text-slate-900">
      {/* Banner Tiêu đề Trang chính: Rộng thoáng, chữ to rõ nét và watermark logo GT */}
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

      {/* BỐ CỤC 1 HÀNG DỌC CHUYÊN NGHIỆP THEO ĐÚNG YÊU CẦU */}
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-16 sm:py-20 space-y-16 sm:space-y-20">
        
        {/* MỤC 1: VỀ CÔNG TY TNHH LOGISTICS GT */}
        <section className="space-y-6">
          <div className="flex items-center gap-3">
            <span className="px-3 py-1 rounded-full bg-azure-50 text-azure-700 text-xs font-bold border border-azure-200">
              MST: 5701750095
            </span>
            <span className="text-xs font-bold text-slate-500">
              Đại diện pháp luật: Lê Thanh Tâm
            </span>
          </div>

          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight leading-tight">
            Về Công Ty TNHH Logistics GT
          </h2>

          <div className="h-1 w-16 bg-gradient-to-r from-azure-600 to-gold-500 rounded-full" />

          <div className="space-y-4 text-slate-700 text-base sm:text-lg leading-relaxed">
            <p>
              Được thành lập với sứ mệnh trở thành cầu nối giao thương huyết mạch giữa Việt Nam, Trung Quốc và khu vực ASEAN,{" "}
              <strong className="text-slate-950 font-bold">Công ty TNHH Logistics GT</strong> (Mã số thuế:{" "}
              <span className="font-mono font-bold text-azure-700">5701750095</span>) đã và đang khẳng định vị thế là một trong những đơn vị tiếp vận biên mậu và vận tải biển đảo uy tín hàng đầu tại miền Bắc.
            </p>
            <p>
              Với trụ sở điều hành đặt ngay tại cửa ngõ Cửa khẩu Bắc Luân 2 (KĐT Vinhomes Golden Avenue, TP. Móng Cái), hiện diện trực tiếp tại các cửa khẩu trọng điểm Lạng Sơn (<strong>Hữu Nghị, Tân Thanh, Chi Ma</strong>), kết hợp cùng năng lực{" "}
              <strong>50 xe đầu kéo container</strong> và <strong>đội tàu/sà lan chuyên tuyến Cô Tô</strong>, chúng tôi mang đến cho doanh nghiệp giải pháp vận chuyển liền mạch từ biên giới trên bộ ra tới tận hải đảo.
            </p>
          </div>

          {/* Ảnh toàn cảnh trụ sở & đội xe */}
          <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden shadow-xs border border-slate-200 mt-6">
            <Image
              src="/images/vietphuc/hero_office_panoramic.webp"
              alt="Trụ sở điều hành và chuyên viên Logistics GT"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 900px"
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

        {/* MỤC 2: CON SỐ NĂNG LỰC BẢO CHỨNG (CHỈ SỐ DOANH NGHIỆP) */}
        <section className="space-y-6">
          <div>
            <div className="text-xs font-bold text-azure-700 mb-1">
              Năng lực bảo chứng thực tế
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Quy Mô Vận Tải & Phạm Vi Phủ Sóng
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {keyMetrics.map((m, idx) => {
              const Icon = m.icon;
              return (
                <div
                  key={idx}
                  className="bg-slate-50 rounded-2xl p-5 border-2 border-slate-200 hover:border-azure-600 transition-colors duration-150 flex flex-col justify-between shadow-xs"
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 rounded-xl bg-azure-100 text-azure-800 flex items-center justify-center font-bold">
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-[11px] font-mono font-bold text-slate-600">
                      {m.unit}
                    </span>
                  </div>
                  <div>
                    <div className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
                      {m.num}
                    </div>
                    <div className="font-bold text-sm text-slate-900 mt-1">
                      {m.label}
                    </div>
                    <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                      {m.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* MỤC 3: TẦM NHÌN & SỨ MỆNH */}
        <section className="space-y-6">
          <div>
            <div className="text-xs font-bold text-azure-700 mb-1">
              Định hướng phát triển
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Tầm Nhìn & Sứ Mệnh Doanh Nghiệp
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {/* Tầm nhìn */}
            <div className="bg-slate-50 rounded-2xl p-6 sm:p-7 border-2 border-slate-200 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-azure-600 text-white flex items-center justify-center shadow-xs">
                <Target className="w-6 h-6" />
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-slate-950">
                Tầm Nhìn Chiến Lược
              </h4>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Trở thành doanh nghiệp Logistics đa phương thức hàng đầu khu vực phía Bắc, kết nối hoàn hảo giữa vận tải đường bộ biên giới Việt Nam và Trung Quốc với vận tải tàu/sà lan biển đảo.
              </p>
            </div>

            {/* Sứ mệnh */}
            <div className="bg-slate-50 rounded-2xl p-6 sm:p-7 border-2 border-slate-200 space-y-4">
              <div className="w-12 h-12 rounded-xl bg-gold-500 text-slate-950 flex items-center justify-center shadow-xs">
                <Compass className="w-6 h-6" />
              </div>
              <h4 className="text-lg sm:text-xl font-bold text-slate-950">
                Sứ Mệnh Doanh Nghiệp
              </h4>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed">
                Đơn giản hóa mọi thủ tục hải quan phức tạp, cung cấp năng lực vận tải mạnh mẽ cho các mặt hàng đặc thù và công trình biển đảo, giúp đối tác tối ưu chi phí và bứt phá doanh thu.
              </p>
            </div>
          </div>
        </section>

        {/* MỤC 4: HỆ SINH THÁI & CÔNG TY THÀNH VIÊN (BẢNG RỘNG CHIẾM TOÀN BỘ KHÔNG GIAN) */}
        <section className="space-y-6">
          <div>
            <div className="text-xs font-bold text-azure-700 mb-1">
              Hệ sinh thái khép kín
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight leading-tight">
              Hệ Sinh Thái Vững Mạnh: Chủ Động Phương Tiện Vận Tải
            </h3>
            <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
              Sự liên kết chặt chẽ giữa <strong>Công ty TNHH Logistics GT</strong> và 2 công ty thành viên tạo nên mạng lưới vận tải đường bộ và đường biển khép kín, chủ động hoàn toàn về phương tiện:
            </p>
          </div>

          {/* Bảng Hệ sinh thái chuẩn Corporate hiển thị chiếm toàn không gian */}
          <div className="overflow-x-auto rounded-2xl border-2 border-slate-300 shadow-xs">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-900 text-white text-xs sm:text-sm font-bold">
                  <th className="py-4 px-5 border-b border-slate-800 w-1/4">Đơn Vị Thành Viên</th>
                  <th className="py-4 px-5 border-b border-slate-800 w-1/3">Vai Trò Trong Hệ Sinh Thái</th>
                  <th className="py-4 px-5 border-b border-slate-800">Thế Mạnh Trọng Tâm</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-xs sm:text-sm">
                {ecosystemRows.map((row, idx) => {
                  const Icon = row.icon;
                  return (
                    <tr key={idx} className="hover:bg-slate-50/80 transition-colors">
                      <td className="py-4.5 px-5 font-bold text-slate-950 align-top">
                        <div className="flex items-center gap-2 mb-1.5">
                          <Icon className="w-4 h-4 text-azure-600 shrink-0" />
                          <span className="text-xs font-mono font-bold px-2 py-0.5 rounded-md bg-slate-100 text-slate-800">
                            {row.tag}
                          </span>
                        </div>
                        <span className="text-sm font-black text-slate-900 block">
                          {row.unit}
                        </span>
                      </td>
                      <td className="py-4.5 px-5 text-slate-800 font-semibold align-top leading-snug">
                        {row.role}
                      </td>
                      <td className="py-4.5 px-5 text-slate-600 align-top leading-relaxed">
                        {row.desc}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* MỤC 5: ĐỐI TÁC VÀ KHÁCH HÀNG TIN TƯỞNG */}
        <section className="space-y-6">
          <div>
            <div className="text-xs font-bold text-azure-700 mb-1">
              Đối tác chiến lược
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Đối Tác & Doanh Nghiệp Tin Tưởng Đồng Hành
            </h3>
            <p className="text-sm sm:text-base text-slate-600 mt-2 leading-relaxed">
              Logistics GT tự hào là đối tác tiếp vận, thủ tục hải quan và vận chuyển biển đảo tin cậy của các tập đoàn sản xuất, hãng tàu quốc tế và nhà thầu xây dựng trọng điểm:
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {partnerList.map((p, idx) => (
              <div
                key={idx}
                className="p-5 rounded-2xl bg-slate-50 border-2 border-slate-200 hover:border-azure-600 hover:bg-white transition-colors duration-150 flex flex-col justify-between shadow-xs group"
              >
                <div className="flex items-center gap-2 mb-3">
                  <Award className="w-4 h-4 text-azure-600 shrink-0" />
                  <span className="text-xs font-bold text-slate-500 truncate">
                    {p.category}
                  </span>
                </div>
                <div className="font-extrabold text-sm sm:text-base text-slate-900 group-hover:text-azure-700 transition-colors leading-snug">
                  {p.name}
                </div>
                <div className="mt-3 flex items-center gap-1 text-[11px] text-emerald-700 font-semibold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span>Đối tác chính thức</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* HỘP KÊU GỌI HÀNH ĐỘNG CUỐI TRANG */}
        <section className="bg-slate-950 text-white rounded-3xl p-8 sm:p-10 border border-slate-800 shadow-md flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="space-y-2">
            <span className="text-xs font-bold text-gold-400 block mb-1">
              Hợp tác tiếp vận bền vững
            </span>
            <h4 className="text-xl sm:text-2xl font-black text-white leading-tight">
              Sẵn Sàng Đồng Hành Cùng Chuỗi Cung Ứng Của Bạn
            </h4>
            <p className="text-sm text-slate-300 max-w-xl">
              Nhận tư vấn phương án thông quan và biểu giá cước đội xe 50 container hoặc vận chuyển tàu đảo Cô Tô chỉ trong vòng 15 phút.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              href="/quote"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl bg-azure-600 hover:bg-azure-700 text-white font-bold text-sm shadow-md transition-colors tap-press"
            >
              <span>Nhận Báo Giá Trong 15 Phút</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <a
              href={`tel:${cleanPhone}`}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl border border-slate-700 bg-slate-900 text-slate-100 hover:bg-slate-800 text-sm font-semibold transition-colors tap-press"
            >
              <PhoneCall className="w-4 h-4 text-gold-400" />
              <span>{settings.hotline}</span>
            </a>
          </div>
        </section>

      </div>
    </div>
  );
}
