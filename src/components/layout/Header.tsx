"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Phone,
  Mail,
  MapPin,
  Clock,
  Menu,
  X,
  ChevronDown,
  ArrowRight,
  Truck,
  FileCheck,
  ShieldCheck,
  Warehouse,
  Ship,
  Globe,
} from "lucide-react";
import { NAVIGATION_LINKS, SERVICE_CATEGORIES } from "@/lib/constants";
import { Button } from "@/components/ui/Button";
import { GtLogo } from "@/components/common/GtLogo";
import { LanguageSwitcher } from "./LanguageSwitcher";
import { useLanguage } from "@/lib/i18n/context";

const serviceIconMap: Record<string, React.ElementType> = {
  Truck,
  FileCheck,
  ShieldCheck,
  Warehouse,
  Ship,
  Globe,
};

interface HeaderProps {
  companyName?: string;
  hotline?: string;
  email?: string;
}

export function Header({
  companyName = "CÔNG TY TNHH LOGISTICS GT",
  hotline = "0904.382.268",
  email = "contact@logisticsgt.vn",
}: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesDropdown, setServicesDropdown] = useState(false);
  const pathname = usePathname();
  const { t, locale } = useLanguage();

  const cleanPhone = hotline.replace(/[^0-9]/g, "");

  const getNavLabel = (href: string, fallback: string) => {
    switch (href) {
      case "/":
        return t.common.home;
      case "/about":
        return t.common.aboutUs;
      case "/services":
        return t.common.allServices;
      case "/tracking":
        return t.common.trackOrder;
      case "/news":
        return t.common.news;
      case "/quote":
        return t.common.quote;
      case "/contact":
        return t.common.contact;
      default:
        return fallback;
    }
  };

  const getServiceTitle = (s: (typeof SERVICE_CATEGORIES)[0]) => {
    if (locale === "zh") return s.titleZh || s.title;
    if (locale === "en") return s.titleEn || s.title;
    return s.title;
  };

  const getServiceDesc = (s: (typeof SERVICE_CATEGORIES)[0]) => {
    if (locale === "zh") return s.shortDescZh || s.shortDesc;
    if (locale === "en") return s.shortDescEn || s.shortDesc;
    return s.shortDesc;
  };

  return (
    <header className="w-full bg-white/95 backdrop-blur-md shadow-sm sticky top-0 z-40 transition-all duration-200 border-b border-slate-200/80">
      {/* Top Bar - Thông tin nhanh & Bộ chọn 3 ngôn ngữ (Executive Midnight Slate) */}
      <div className="bg-slate-950 text-slate-300 text-xs py-2 px-4 border-b border-slate-800/80 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <div className="flex items-center gap-1.5 text-slate-300">
              <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>{t.header.borderGateNotice}</span>
            </div>
            <div className="flex items-center gap-1.5 text-slate-300">
              <Clock className="w-3.5 h-3.5 text-sky-400 shrink-0" />
              <span>{t.header.schedule247}</span>
            </div>
          </div>

          <div className="flex items-center gap-5">
            <a
              href={`mailto:${email}`}
              className="flex items-center gap-1.5 hover:text-white transition-colors text-slate-300"
            >
              <Mail className="w-3.5 h-3.5 text-amber-400" />
              <span>{email}</span>
            </a>
            <a
              href={`tel:${cleanPhone}`}
              className="flex items-center gap-1.5 font-bold text-amber-300 hover:text-amber-200 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.common.hotline}: {hotline}</span>
            </a>

            {/* Bộ chuyển đổi 3 ngôn ngữ VN | EN | 中文 */}
            <div className="border-l border-slate-700/80 pl-4">
              <LanguageSwitcher />
            </div>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Thương hiệu GT LOGISTICS */}
          <Link href="/" className="flex items-center group">
            <GtLogo showSlogan={false} />
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-1 xl:gap-2">
            {NAVIGATION_LINKS.map((link) => {
              const isActive = pathname === link.href;
              const label = getNavLabel(link.href, link.label);

              if (link.href === "/services") {
                return (
                  <div
                    key={link.href}
                    className="relative py-2"
                    onMouseEnter={() => setServicesDropdown(true)}
                    onMouseLeave={() => setServicesDropdown(false)}
                  >
                    <Link
                      href={link.href}
                      className={`px-3.5 py-2 text-sm font-semibold rounded-lg flex items-center gap-1 transition-all duration-150 ${
                        isActive
                          ? "text-blue-700 bg-blue-50 font-bold"
                          : "text-slate-700 hover:text-blue-700 hover:bg-slate-50"
                      }`}
                    >
                      <span>{label}</span>
                      <ChevronDown
                        className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${
                          servicesDropdown ? "rotate-180 text-blue-700" : ""
                        }`}
                      />
                    </Link>

                    {/* Dropdown Dịch vụ hiện đại, hỗ trợ đa ngôn ngữ */}
                    {servicesDropdown && (
                      <div className="absolute top-full left-0 pt-2 z-50">
                        <div className="w-[390px] bg-white rounded-2xl shadow-2xl border border-slate-200/80 p-2.5 animate-in fade-in slide-in-from-top-2 duration-150">
                          <div className="px-3 py-2 text-[11px] font-bold uppercase tracking-wider text-slate-400 border-b border-slate-100 mb-1">
                            {t.header.servicesDropdownTitle}
                          </div>
                          <div className="space-y-1">
                            {SERVICE_CATEGORIES.map((service) => {
                              const IconComponent = serviceIconMap[service.iconName] || Truck;
                              return (
                                <Link
                                  key={service.slug}
                                  href={`/services/${service.slug}`}
                                  className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-blue-50/80 transition-colors group"
                                >
                                  <div className="w-9 h-9 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                                    <IconComponent className="w-4 h-4" />
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="text-sm font-bold text-slate-800 group-hover:text-blue-700 transition-colors leading-snug">
                                      {getServiceTitle(service)}
                                    </div>
                                    <div className="text-xs text-slate-500 line-clamp-1 mt-0.5">
                                      {getServiceDesc(service)}
                                    </div>
                                  </div>
                                </Link>
                              );
                            })}
                          </div>
                          <div className="mt-2 pt-2 border-t border-slate-100 px-3 py-1 flex items-center justify-between text-xs">
                            <Link
                              href="/services"
                              className="font-bold text-blue-700 hover:text-blue-800 flex items-center gap-1"
                            >
                              <span>{t.header.viewAllCapabilities}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                );
              }

              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`px-3.5 py-2 text-sm font-semibold rounded-lg transition-all duration-150 ${
                    isActive
                      ? "text-blue-700 bg-blue-50 font-bold"
                      : "text-slate-700 hover:text-blue-700 hover:bg-slate-50"
                  }`}
                >
                  {label}
                </Link>
              );
            })}
          </nav>

          {/* Action Button */}
          <div className="hidden lg:flex items-center gap-4">
            <Link href="/quote">
              <Button
                variant="accent"
                size="md"
                className="font-bold shadow-md shadow-amber-500/20"
              >
                <span>{t.common.requestQuote}</span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </Button>
            </Link>
          </div>

          {/* Mobile Menu Button & Mini Switcher */}
          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSwitcher />
            <a
              href={`tel:${cleanPhone}`}
              className="p-2 text-blue-700 hover:bg-blue-50 rounded-lg"
              title="Hotline"
            >
              <Phone className="w-5 h-5 text-amber-500" />
            </a>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-blue-700 rounded-lg"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white border-t border-slate-200 px-4 pt-3 pb-6 space-y-2 animate-in fade-in duration-200 shadow-xl">
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs text-slate-500 font-bold uppercase">Ngôn ngữ / Language:</span>
            <LanguageSwitcher />
          </div>

          {NAVIGATION_LINKS.map((link) => {
            const isActive = pathname === link.href;
            const label = getNavLabel(link.href, link.label);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-xl text-base font-semibold ${
                  isActive
                    ? "text-blue-700 bg-blue-50 font-bold"
                    : "text-slate-700 hover:bg-slate-50 hover:text-blue-700"
                }`}
              >
                {label}
              </Link>
            );
          })}
          <div className="pt-4 border-t border-slate-100 flex flex-col gap-2">
            <Link href="/quote" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="accent" size="lg" className="w-full font-bold">
                {t.common.requestQuote}
              </Button>
            </Link>
            <a
              href={`tel:${cleanPhone}`}
              className="flex items-center justify-center gap-2 px-4 py-3 bg-slate-100 text-slate-800 rounded-xl font-bold text-sm"
            >
              <Phone className="w-4 h-4 text-amber-500" />
              <span>{t.common.hotline}: {hotline}</span>
            </a>
          </div>
        </div>
      )}
    </header>
  );
}
