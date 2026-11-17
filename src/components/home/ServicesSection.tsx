"use client";

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
import { useLanguage } from "@/lib/i18n/context";

interface ServiceItem {
  id: string;
  title: string;
  titleEn?: string | null;
  titleZh?: string | null;
  slug: string;
  shortDesc: string;
  shortDescEn?: string | null;
  shortDescZh?: string | null;
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
  const { t, locale } = useLanguage();

  const getTitle = (s: ServiceItem) => {
    if (locale === "zh") return s.titleZh || s.title;
    if (locale === "en") return s.titleEn || s.title;
    return s.title;
  };

  const getShortDesc = (s: ServiceItem) => {
    if (locale === "zh") return s.shortDescZh || s.shortDesc;
    if (locale === "en") return s.shortDescEn || s.shortDesc;
    return s.shortDesc;
  };

  return (
    <section className="py-20 bg-slate-50/70 text-slate-900 border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="brand" className="mb-3">
            {t.services.badge}
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight">
            {t.services.heading}
          </h2>
          <p className="mt-4 text-slate-600 text-base">
            {t.services.desc}
          </p>
        </div>

        {/* Grid Danh sách Dịch vụ - Wayfind Clean Light Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((s) => {
            const Icon = iconMap[s.iconName] || Truck;
            const title = getTitle(s);
            const desc = getShortDesc(s);

            return (
              <div
                key={s.slug}
                className="group bg-white rounded-2xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-md hover:border-azure-300 transition-colors duration-200 flex flex-col"
              >
                {/* Ảnh dịch vụ */}
                <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                  <Image
                    src={s.bannerImage}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                  <div className="absolute bottom-3 left-4 right-4 flex items-center justify-between text-white">
                    <span className="w-10 h-10 rounded-xl bg-gradient-to-br from-gold-500 to-gold-600 text-slate-950 font-bold flex items-center justify-center shadow-md border border-gold-200/50">
                      <Icon className="w-5 h-5 text-slate-950" />
                    </span>
                    <span className="text-xs font-semibold bg-slate-950/80 text-gold-300 px-2.5 py-1 rounded-full border border-gold-500/40">
                      {t.services.officialTag}
                    </span>
                  </div>
                </div>

                {/* Nội dung dịch vụ */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-azure-600 transition-colors">
                      <Link href={`/services/${s.slug}`}>{title}</Link>
                    </h3>
                    <p className="mt-2 text-sm text-slate-600 leading-relaxed line-clamp-3">
                      {desc}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
                    <Link
                      href={`/services/${s.slug}`}
                      className="text-sm font-bold text-azure-600 hover:text-gold-600 inline-flex items-center gap-1.5 transition-colors tap-press"
                    >
                      <span>{t.common.viewDetails}</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                    <Link
                      href="/quote"
                      className="text-xs font-semibold text-slate-500 hover:text-slate-800 px-2.5 py-1 rounded-lg hover:bg-slate-100 transition-colors tap-press"
                    >
                      {t.services.quotePrompt}
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
