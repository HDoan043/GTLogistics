import React from "react";
import { ServicesSection } from "@/components/home/ServicesSection";
import { QuoteCtaSection } from "@/components/home/QuoteCtaSection";
import { getServices } from "@/modules/services/actions";
import { getSiteSettings } from "@/modules/settings/actions";
import { Badge } from "@/components/ui/Badge";

export const metadata = {
  title: "Dịch Vụ Logistics & Thủ Tục Hải Quan Cửa Khẩu | GT Logistics",
  description:
    "Danh mục các dịch vụ vận tải đường bộ liên vận Móng Cái, thủ tục hải quan xuất nhập khẩu chính ngạch, C/O Form E, kho bãi và ủy thác ngoại thương.",
};

export default async function ServicesPage() {
  const [services, settings] = await Promise.all([
    getServices(),
    getSiteSettings(),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative py-20 bg-slate-950 text-white overflow-hidden text-center border-b border-slate-800">
        <div
          className="absolute inset-0 opacity-25 bg-cover bg-center mix-blend-luminosity scale-105"
          style={{
            backgroundImage: "url('/images/vietphuc/hero_office_panoramic.webp')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-blue-950/70" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Badge variant="accent" className="mb-3 uppercase tracking-wider">
            Năng Lực Thực Tế
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            DỊCH VỤ LOGISTICS & THÔNG QUAN CỬA KHẨU GT
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
            Hạ tầng điều hành tại Căn ĐLTC-41 Vinhomes Golden Avenue Cửa khẩu Bắc Luân 2 Móng Cái, bảo đảm thông quan nhanh chóng, chính ngạch và an toàn 100%.
          </p>
        </div>
      </section>

      <ServicesSection services={services} />
      <QuoteCtaSection hotline={settings.hotline} />
    </div>
  );
}
