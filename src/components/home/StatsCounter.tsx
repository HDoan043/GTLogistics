"use client";

import React from "react";
import { TrendingUp, Users, CheckCircle, Award } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";

interface StatsCounterProps {
  statsData?: Array<{
    num?: string;
    unit?: string;
    label?: string;
    labelEn?: string;
    labelZh?: string;
    sub?: string;
    subEn?: string;
    subZh?: string;
  }>;
}

const defaultIcons = [Award, TrendingUp, Users, CheckCircle];

export function StatsCounter({ statsData }: StatsCounterProps = {}) {
  const { t, locale } = useLanguage();

  const stats =
    statsData && statsData.length === 4
      ? statsData.map((s, idx) => ({
          icon: defaultIcons[idx] || Award,
          value: s.num || "",
          label:
            locale === "zh" && s.labelZh
              ? s.labelZh
              : locale === "en" && s.labelEn
              ? s.labelEn
              : s.label || "",
          desc:
            locale === "zh" && s.subZh
              ? s.subZh
              : locale === "en" && s.subEn
              ? s.subEn
              : s.sub || "",
          unit: s.unit || "",
        }))
      : [
          {
            icon: Award,
            value: t.stats.years.value,
            label: t.stats.years.label,
            desc: t.stats.years.desc,
            unit: "YEARS",
          },
          {
            icon: TrendingUp,
            value: t.stats.cargo.value,
            label: t.stats.cargo.label,
            desc: t.stats.cargo.desc,
            unit: "METRIC TONS",
          },
          {
            icon: Users,
            value: t.stats.clients.value,
            label: t.stats.clients.label,
            desc: t.stats.clients.desc,
            unit: "ENTERPRISES",
          },
          {
            icon: CheckCircle,
            value: t.stats.safety.value,
            label: t.stats.safety.label,
            desc: t.stats.safety.desc,
            unit: "ACCURACY",
          },
        ];

  return (
    <section className="bg-slate-50 text-slate-900 py-10 sm:py-12 relative overflow-hidden border-b border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="relative p-5 sm:p-6 rounded-2xl bg-white border-2 border-slate-200 hover:border-azure-500 shadow-xs hover:shadow-sm transition-colors duration-150 group tap-press flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-9 h-9 rounded-xl bg-azure-50 text-azure-600 border border-azure-100 flex items-center justify-center group-hover:bg-azure-600 group-hover:text-white transition-colors duration-150">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="text-xs text-slate-400 font-semibold font-mono">
                      {s.unit}
                    </span>
                  </div>
                  <div className="text-3xl sm:text-4xl font-black text-slate-950 tracking-tight tabular-nums font-mono">
                    {s.value}
                  </div>
                  <div className="text-xs sm:text-sm font-bold text-azure-700 mt-1.5 leading-snug">
                    {s.label}
                  </div>
                </div>
                <div className="text-xs text-slate-500 mt-2 line-clamp-2 leading-relaxed">
                  {s.desc}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
