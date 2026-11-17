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
    },
    {
      icon: TrendingUp,
      value: t.stats.cargo.value,
      label: t.stats.cargo.label,
      desc: t.stats.cargo.desc,
    },
    {
      icon: Users,
      value: t.stats.clients.value,
      label: t.stats.clients.label,
      desc: t.stats.clients.desc,
    },
    {
      icon: CheckCircle,
      value: t.stats.safety.value,
      label: t.stats.safety.label,
      desc: t.stats.safety.desc,
    },
  ];

  return (
    <section className="bg-slate-900 text-white py-12 relative overflow-hidden border-b border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {stats.map((s, idx) => {
            const Icon = s.icon;
            return (
              <div
                key={idx}
                className="text-center p-5 rounded-2xl bg-slate-800/60 border border-slate-700/60 hover:border-gold-500/40 transition-colors"
              >
                <Icon className="w-7 h-7 mx-auto text-gold-400 mb-2" />
                <div className="text-3xl sm:text-4xl font-black text-gold-400 tracking-tight tabular-nums">
                  {s.value}
                </div>
                <div className="text-xs sm:text-sm font-semibold text-gold-300 mt-1">
                  {s.label}
                </div>
                <div className="text-xs text-slate-300 mt-1 line-clamp-2">
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
