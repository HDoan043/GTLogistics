import React from "react";
import {
  MapPin,
  Phone,
  Mail,
  Building,
  Truck,
  Ship,
  FileCheck,
  ShieldCheck,
  Clock,
} from "lucide-react";
import { getSiteSettings } from "@/modules/settings/actions";
import { PageBanner } from "@/components/layout/PageBanner";
import { QuoteCtaSection } from "@/components/home/QuoteCtaSection";
import { getServerDictionary } from "@/lib/i18n/server";

export const metadata = {
  title: "Thông Tin Liên Hệ & Hệ Thống Điểm Trực | GT Logistics",
  description:
    "Trụ sở chính Cửa khẩu Bắc Luân 2 Móng Cái, các điểm trực cửa khẩu Hữu Nghị, Tân Thanh, Chi Ma (Lạng Sơn), văn phòng cảng Hải Phòng và đầu mối tàu đảo Cô Tô.",
};

export default async function ContactPage() {
  const [{ locale, t }, settings] = await Promise.all([
    getServerDictionary(),
    getSiteSettings(),
  ]);

  const cleanPhone = (settings.hotline || "0904.382.268").replace(/[^0-9]/g, "");

  const locations = [
    {
      title: "Trụ Sở Chính (Móng Cái)",
      tag: "Trụ Sở Điều Hành",
      badgeClass: "bg-azure-600 text-white",
      address: "Căn ĐLTC-41, KĐT Vinhomes Golden Avenue, Cửa khẩu Bắc Luân 2, Phường Hải Hòa, TP. Móng Cái, Tỉnh Quảng Ninh.",
      desc: "Trung tâm quản trị chuỗi cung ứng, điều vận đội xe 50 container và đại lý thông quan Bắc Luân 2 & Ka Long.",
      icon: Building,
      highlight: true,
    },
    {
      title: "Điểm Trực Cửa Khẩu Hữu Nghị & Tân Thanh",
      tag: "Cửa Khẩu Lạng Sơn",
      badgeClass: "bg-gold-500 text-slate-950 font-bold",
      address: "Khu vực Cửa khẩu Quốc tế Hữu Nghị & Cửa khẩu Tân Thanh, Tỉnh Lạng Sơn.",
      desc: "Chuyên viên hiện trường trực 24/7 kiểm hóa hàng điện tử, linh kiện, nông sản tươi sống và hàng quá cảnh.",
      icon: Truck,
      highlight: false,
    },
    {
      title: "Điểm Trực Cửa Khẩu Chi Ma",
      tag: "Cửa Khẩu Lạng Sơn",
      badgeClass: "bg-slate-800 text-slate-100",
      address: "Khu vực Cửa khẩu Chi Ma, Huyện Lộc Bình, Tỉnh Lạng Sơn.",
      desc: "Giải pháp thông quan tiết kiệm thời gian cho hàng bách hóa, nguyên phụ liệu dệt may (hàng vải) và biên mậu.",
      icon: FileCheck,
      highlight: false,
    },
    {
      title: "Văn Phòng Cảng Hải Phòng",
      tag: "Đầu Mối Biển & Cảng",
      badgeClass: "bg-azure-800 text-white",
      address: "Khu vực Cụm Cảng Đình Vũ, Quận Hải An, TP. Hải Phòng.",
      desc: "Đầu mối tiếp nhận hàng chuyển cảng, sang tải kẹp chì niêm phong từ các cầu cảng quốc tế về biên giới.",
      icon: ShieldCheck,
      highlight: false,
    },
    {
      title: "Đầu Mối Tàu & Sà Lan Cô Tô",
      tag: "Chuyên Tuyến Biển Đảo",
      badgeClass: "bg-emerald-600 text-white",
      address: "Khu vực cảng bến đất liền Vân Đồn / Cẩm Phả & Huyện đảo Cô Tô, Tỉnh Quảng Ninh.",
      desc: "Tập kết vật tư xây dựng cát đá xi măng, điều hành đội tàu và sà lan chuyên chở ra các đảo thuộc Cô Tô.",
      icon: Ship,
      highlight: false,
    },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      {/* Banner Tiêu đề Trang chính: Rộng thoáng, chữ to rõ nét */}
      <PageBanner
        breadcrumbs={[
          { label: t.common.home, href: "/" },
          { label: t.common.contact },
        ]}
        title="Liên Hệ & Hệ Thống Điểm Trực"
        subtitle="Hệ thống 5 trụ sở và điểm trực cửa khẩu thường trực 24/7 của Logistics GT tại Quảng Ninh, Lạng Sơn và Hải Phòng."
        size="main"
      />

      {/* Thông tin pháp nhân và hotline liên hệ */}
      <section className="py-12 border-b border-slate-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-6 sm:p-8 rounded-3xl bg-slate-950 text-white flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 border border-slate-800 shadow-sm">
            <div className="space-y-2">
              <div className="text-xs font-bold text-azure-400">
                Thông tin pháp nhân doanh nghiệp
              </div>
              <h2 className="text-2xl sm:text-3xl font-black text-white">
                CÔNG TY TNHH LOGISTICS GT
              </h2>
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm text-slate-300 pt-1">
                <div>
                  <span className="text-slate-400 font-semibold">Mã số thuế:</span>{" "}
                  <span className="font-mono font-bold text-gold-400">5701750095</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold">Đại diện pháp luật:</span>{" "}
                  <span className="font-bold text-white">Lê Thanh Tâm</span>
                </div>
                <div>
                  <span className="text-slate-400 font-semibold">Email chính thức:</span>{" "}
                  <a href="mailto:contact@logisticsgt.vn" className="text-azure-400 hover:underline">
                    contact@logisticsgt.vn
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              <a
                href={`tel:${cleanPhone}`}
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-gold-500 hover:bg-gold-400 text-slate-950 font-bold text-sm shadow-md transition-colors tap-press"
              >
                <Phone className="w-4 h-4 text-slate-950" />
                <span>Hotline 24/7: {settings.hotline}</span>
              </a>
              <a
                href={`https://zalo.me/${settings.zaloPhone}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-azure-600 hover:bg-azure-700 text-white font-bold text-sm transition-colors tap-press"
              >
                <span>Nhắn Zalo Ngay</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Danh sách 5 điểm trực & văn phòng */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <div className="text-xs font-bold text-azure-700 mb-1">
              Hệ thống điểm trực 24/7
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-slate-950 tracking-tight">
              Hệ Thống Văn Phòng & Điểm Trực Cửa Khẩu
            </h3>
            <p className="mt-2 text-slate-600 text-sm sm:text-base">
              Nhân sự túc trực hiện trường sẵn sàng tiếp nhận, kiểm hóa và giải phóng hàng hóa ngay trong ngày.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {locations.map((loc, idx) => {
              const Icon = loc.icon;
              return (
                <div
                  key={idx}
                  className={`p-6 sm:p-7 rounded-2xl border-2 transition-colors duration-150 flex flex-col justify-between shadow-xs ${
                    loc.highlight
                      ? "bg-white border-azure-600"
                      : "bg-white border-slate-200 hover:border-azure-400"
                  }`}
                >
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="w-11 h-11 rounded-xl bg-azure-50 text-azure-700 border border-azure-200 flex items-center justify-center font-bold">
                        <Icon className="w-5 h-5" />
                      </div>
                      <span className={`px-2.5 py-1 rounded-md text-[11px] font-bold ${loc.badgeClass}`}>
                        {loc.tag}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-bold text-base sm:text-lg text-slate-950 leading-snug">
                        {loc.title}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        {loc.desc}
                      </p>
                    </div>

                    <div className="space-y-2 pt-3 border-t border-slate-100 text-xs text-slate-700">
                      <div className="flex items-start gap-2">
                        <MapPin className="w-4 h-4 text-azure-600 shrink-0 mt-0.5" />
                        <span className="leading-relaxed font-medium">{loc.address}</span>
                      </div>
                      <div className="flex items-center gap-2 text-emerald-700 font-semibold">
                        <Clock className="w-4 h-4 text-emerald-600 shrink-0" />
                        <span>Trực hiện trường & thông quan 24/7</span>
                      </div>
                    </div>
                  </div>

                  <div className="pt-5 border-t border-slate-100 mt-4 flex items-center justify-between">
                    <a
                      href={`tel:${cleanPhone}`}
                      className="text-xs font-bold text-azure-700 hover:text-azure-800 flex items-center gap-1.5"
                    >
                      <Phone className="w-3.5 h-3.5" />
                      <span>{settings.hotline}</span>
                    </a>
                    <a
                      href={`https://zalo.me/${settings.zaloPhone}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs font-bold text-slate-500 hover:text-azure-700"
                    >
                      Chat Zalo
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Form Báo Giá Cuối Trang */}
      <QuoteCtaSection hotline={settings.hotline} />
    </div>
  );
}
