"use client";

import React from "react";
import { Globe } from "lucide-react";
import { useLanguage } from "@/lib/i18n/context";
import { Locale } from "@/lib/i18n";

const LANGUAGES: Array<{ code: Locale; label: string; title: string }> = [
  { code: "vi", label: "VN", title: "Tiếng Việt" },
  { code: "en", label: "EN", title: "English" },
  { code: "zh", label: "中文", title: "中文 (Chinese)" },
];

export function LanguageSwitcher({ className = "" }: { className?: string }) {
  const { locale, setLocale } = useLanguage();

  return (
    <div
      className={`inline-flex items-center gap-1 bg-white/10 dark:bg-slate-900/60 p-1 rounded-xl border border-white/15 dark:border-slate-800 backdrop-blur-sm ${className}`}
      role="group"
      aria-label="Chọn ngôn ngữ"
    >
      <Globe className="w-3.5 h-3.5 text-amber-400 ml-1.5 mr-0.5 shrink-0" />
      {LANGUAGES.map((lang) => {
        const isActive = locale === lang.code;
        return (
          <button
            key={lang.code}
            type="button"
            onClick={() => setLocale(lang.code)}
            title={lang.title}
            className={`px-2 py-0.5 rounded-lg text-[11px] font-black transition-all duration-200 tracking-wider ${
              isActive
                ? "bg-gradient-to-r from-amber-500 to-yellow-500 text-slate-950 shadow-sm"
                : "text-slate-300 hover:text-white hover:bg-white/10"
            }`}
          >
            {lang.label}
          </button>
        );
      })}
    </div>
  );
}
