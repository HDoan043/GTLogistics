"use client";

import React from "react";
import { TrendingUp, Users, CheckCircle, Award } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";

export function StatsCounter() {
  const { t } = useLanguage();

  const stats = [
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
    <section className="bg-slate-950 text-white py-10 relative overflow-hidden border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="relative p-5 rounded-2xl bg-slate-900/90 border border-slate-800 hover:border-azure-500/50 transition-colors group tap-press"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-gold-400 group-hover:text-azure-400 group-hover:bg-azure-950/80 transition-colors">
                    <Icon className="w-4 h-4" />
                  </div>
                  <span className="text-[11px] text-slate-400 font-semibold">
                    {s.unit}
                  </span>
                </div>
                <div className="text-3xl sm:text-4xl font-black text-white tracking-tight tabular-nums font-mono">
                  {s.value}
                </div>
                <div className="text-xs sm:text-sm font-bold text-gold-300 mt-1.5 leading-snug">
                  {s.label}
                </div>
                <div className="text-xs text-slate-400 mt-1 line-clamp-2 leading-relaxed">
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
