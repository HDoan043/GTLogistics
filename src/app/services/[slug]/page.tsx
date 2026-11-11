import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Phone,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ChevronRight,
} from "lucide-react";
import { getServiceBySlug, getServices } from "@/modules/services/actions";
import { getSiteSettings } from "@/modules/settings/actions";
import { Button } from "@/components/ui/Button";
import { Badge } from "@/components/ui/Badge";
import { QuoteCtaSection } from "@/components/home/QuoteCtaSection";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const service = await getServiceBySlug(slug);
  if (!service) return { title: "Dịch vụ không tồn tại" };

  return {
    title: `${service.title} | GT Logistics`,
    description: service.shortDesc,
  };
}

export default async function ServiceDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [service, allServices, settings] = await Promise.all([
    getServiceBySlug(slug),
    getServices(),
    getSiteSettings(),
  ]);

  if (!service) {
    notFound();
  }

  const cleanPhone = (settings.hotline || "0904.382.268").replace(/[^0-9]/g, "");

  return (
    <div className="flex flex-col min-h-screen">
      {/* Banner Tiêu đề & Breadcrumb */}
      <section className="relative py-16 bg-slate-950 text-white overflow-hidden border-b border-slate-800">
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center mix-blend-luminosity scale-105"
          style={{ backgroundImage: `url('${service.bannerImage}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-blue-950/70" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-3">
            <Link href="/" className="hover:text-white transition-colors">Trang chủ</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <Link href="/services" className="hover:text-white transition-colors">Dịch vụ</Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-sky-300 font-semibold">{service.title}</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white max-w-3xl">
            {service.title}
          </h1>
          <p className="mt-3 text-slate-300 text-sm sm:text-base max-w-2xl">
            {service.shortDesc}
          </p>
        </div>
      </section>

      {/* Nội dung chi tiết dịch vụ */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            {/* Cột trái: Nội dung chính */}
            <div className="lg:col-span-8 space-y-8">
              <div className="relative h-80 sm:h-96 w-full rounded-3xl overflow-hidden shadow-xl border border-slate-200">
                <Image
                  src={service.bannerImage}
                  alt={service.title}
                  fill
                  className="object-cover"
                />
              </div>

              <div
                className="prose prose-lg max-w-none text-slate-700 prose-headings:text-slate-900 prose-headings:font-bold prose-h3:text-2xl prose-h4:text-xl prose-a:text-blue-700 prose-li:my-1"
                dangerouslySetInnerHTML={{ __html: service.fullContent }}
              />

              {/* Box cam kết dịch vụ */}
              <div className="p-6 rounded-3xl bg-blue-50/50 border border-blue-100 space-y-3">
                <h4 className="font-bold text-slate-900 text-base flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-blue-700" />
                  <span>Cam Kết Chất Lượng Từ Logistics GT:</span>
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs text-slate-700">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Hàng hóa bảo hiểm 100% trong quá trình vận chuyển.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Giám sát định vị GPS lộ trình hàng hóa liên tục.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Hóa đơn GTGT và tờ khai hải quan chính ngạch hợp lệ.</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Đội ngũ trực cửa khẩu giải phóng hàng 24/7.</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cột phải: Sidebar điều hướng & CTA */}
            <div className="lg:col-span-4 space-y-6">
              {/* Danh sách các dịch vụ khác */}
              <div className="bg-slate-50 p-6 rounded-3xl border border-slate-200">
                <h3 className="font-bold text-base text-slate-900 mb-4 border-b border-slate-200 pb-3">
                  Tất Cả Dịch Vụ
                </h3>
                <div className="space-y-2">
                  {allServices.map((s) => {
                    const isActive = s.slug === service.slug;
                    return (
                      <Link
                        key={s.slug}
                        href={`/services/${s.slug}`}
                        className={`flex items-center justify-between p-3 rounded-2xl text-sm font-semibold transition-all ${
                          isActive
                            ? "bg-blue-700 text-white shadow-sm"
                            : "bg-white text-slate-700 hover:bg-slate-100 hover:text-blue-700 border border-slate-200/60"
                        }`}
                      >
                        <span className="line-clamp-1">{s.title}</span>
                        <ArrowRight className="w-4 h-4 shrink-0" />
                      </Link>
                    );
                  })}
                </div>
              </div>

              {/* Hộp Hotline tư vấn */}
              <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl text-center space-y-4 border border-slate-800">
                <div className="w-14 h-14 rounded-2xl bg-blue-600 flex items-center justify-center mx-auto text-white shadow-lg shadow-blue-600/30">
                  <Phone className="w-7 h-7" />
                </div>
                <h4 className="font-bold text-lg text-white">Cần Tư Vấn Dịch Vụ Này?</h4>
                <p className="text-xs text-slate-300">
                  Liên hệ chuyên viên chứng từ trực tiếp tại Cửa khẩu Bắc Luân 2:
                </p>
                <a
                  href={`tel:${cleanPhone}`}
                  className="block text-2xl font-black text-sky-400 hover:text-sky-300 hover:underline"
                >
                  {settings.hotline}
                </a>
                <Link href="/quote" className="block pt-2">
                  <Button variant="accent" size="md" className="w-full font-bold shadow-md shadow-blue-600/20">
                    Gửi Yêu Cầu Báo Giá
                  </Button>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      <QuoteCtaSection hotline={settings.hotline} />
    </div>
  );
}
