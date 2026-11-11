import React from "react";
import Link from "next/link";
import Image from "next/image";
import {
  Truck,
  Ship,
  FileCheck,
  Warehouse,
  ShieldCheck,
  Globe,
  ArrowRight,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface ServiceItem {
  id: string;
  title: string;
  slug: string;
  shortDesc: string;
  iconName: string;
  bannerImage: string;
}

const iconMap: Record<string, React.ElementType> = {
  Truck,
  Ship,
  FileCheck,
  Warehouse,
  ShieldCheck,
  Globe,
};

export function ServicesSection({ services }: { services: ServiceItem[] }) {
  return (
    <section className="py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="brand" className="mb-3 uppercase tracking-wider">
            Năng Lực Cung Ứng Thực Tế
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Dịch Vụ Logistics & Hải Quan Cửa Khẩu Trọng Tâm
          </h2>
          <p className="mt-4 text-slate-600 text-base">
            Logistics GT cung cấp giải pháp toàn diện từ khai báo hải quan, vận tải đường bộ liên vận Việt - Trung qua Cửa khẩu Quốc tế Móng Cái đến kho bãi sang tải và ủy thác ngoại thương.
          </p>
        </div>

        {/* Grid Danh sách Dịch vụ */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((s) => {
            const Icon = iconMap[s.iconName] || Truck;
            return (
              <div
                key={s.slug}
                className="group bg-white rounded-3xl overflow-hidden border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col hover:-translate-y-1"
              >
                {/* Ảnh dịch vụ */}
                <div className="relative h-52 w-full overflow-hidden bg-slate-200">
                  <Image
                    src={s.bannerImage}
                    alt={s.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                    <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-yellow-500 text-slate-950 font-bold backdrop-blur-sm flex items-center justify-center shadow-lg border border-amber-200/50 group-hover:scale-110 transition-transform">
                      <Icon className="w-5 h-5 text-slate-950" />
                    </span>
                    <span className="text-[11px] font-bold tracking-wider uppercase bg-slate-950/80 text-amber-300 px-2.5 py-1 rounded-full backdrop-blur-sm border border-amber-500/30">
                      Chính Ngạch
                    </span>
                  </div>
                </div>

                {/* Nội dung dịch vụ */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-blue-700 transition-colors">
                      <Link href={`/services/${s.slug}`}>{s.title}</Link>
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed line-clamp-3">
                      {s.shortDesc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      href={`/services/${s.slug}`}
                      className="text-sm font-bold text-blue-700 hover:text-blue-800 inline-flex items-center gap-1.5 transition-colors"
                    >
                      <span>Xem chi tiết</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      href="/quote"
                      className="text-xs font-semibold text-slate-500 hover:text-slate-900 px-2.5 py-1 rounded-lg hover:bg-slate-100 transition-colors"
                    >
                      Báo giá nhanh
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
