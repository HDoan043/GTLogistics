"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
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
  const [isVisible, setIsVisible] = useState(true);
  const [isAtTop, setIsAtTop] = useState(true);

  const pathname = usePathname();
  const { t, locale } = useLanguage();

  // Không hiển thị Header công khai bên trong khu vực quản trị (/admin/*)
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const cleanPhone = hotline.replace(/[^0-9]/g, "");

  // Smart Scroll: Cuộn xuống ẩn đi, cuộn lên hiện ra, ở đỉnh trang luôn hiện
  useEffect(() => {
    let prevScrollY = window.scrollY;
    let ticking = false;

    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (currentScrollY <= 20) {
            setIsVisible(true);
            setIsAtTop(true);
          } else {
            setIsAtTop(false);
            const delta = currentScrollY - prevScrollY;

            // Cuộn xuống quá 8px và qua khỏi header -> ẩn navbar
            if (delta > 8 && currentScrollY > 80) {
              setIsVisible(false);
              setServicesDropdown(false);
            }
            // Cuộn lên đủ nhanh (delta < -8px) -> hiện navbar ngay
            else if (delta < -8) {
              setIsVisible(true);
            }
          }
          prevScrollY = currentScrollY;
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

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
    <header
      className={`w-full bg-white/95 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200/90 transition-transform duration-300 ease-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      } ${!isAtTop ? "shadow-md shadow-slate-900/5" : ""}`}
    >
      {/* Main Navbar - Giao diện sáng tinh tế theo màu logo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          {/* Logo & Navigation Group with Natural Proximity */}
          <div className="flex items-center gap-6 xl:gap-8">
            <Link href="/" className="flex items-center group shrink-0">
              <GtLogo showSlogan={false} />
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-1 xl:gap-1.5">
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
                        className={`px-3 py-2 text-sm font-semibold rounded-lg flex items-center gap-1 transition-colors duration-150 ${
                          isActive
                            ? "text-azure-700 bg-azure-50 border border-azure-200/80 font-bold"
                            : "text-slate-700 hover:text-azure-600 hover:bg-slate-50"
                        }`}
                      >
                        <span>{label}</span>
                        <ChevronDown
                          className={`w-4 h-4 text-slate-500 transition-transform duration-200 ${
                            servicesDropdown ? "rotate-180 text-azure-600" : ""
                          }`}
                        />
                      </Link>

                      {/* Services Dropdown */}
                      {servicesDropdown && (
                        <div className="absolute top-full left-0 pt-2 z-50">
                          <div className="w-[390px] bg-white rounded-2xl shadow-md border border-slate-200 p-2.5 animate-in fade-in slide-in-from-top-2 duration-150 text-slate-900">
                            <div className="px-3 py-2 text-xs font-semibold text-slate-500 border-b border-slate-100 mb-1">
                              {t.header.servicesDropdownTitle}
                            </div>
                            <div className="space-y-1">
                              {SERVICE_CATEGORIES.map((service) => {
                                const IconComponent = serviceIconMap[service.iconName] || Truck;
                                return (
                                  <Link
                                    key={service.slug}
                                    href={`/services/${service.slug}`}
                                    className="flex items-start gap-3 p-2.5 rounded-xl hover:bg-slate-50 transition-colors group"
                                  >
                                    <div className="w-9 h-9 rounded-xl bg-azure-50 border border-azure-100 text-azure-600 flex items-center justify-center shrink-0 group-hover:bg-azure-600 group-hover:text-white transition-colors">
                                      <IconComponent className="w-4 h-4" />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                      <div className="text-sm font-bold text-slate-900 group-hover:text-azure-700 transition-colors leading-snug">
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
                                className="font-bold text-azure-600 hover:text-azure-800 flex items-center gap-1 transition-colors"
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
                    className={`px-3 py-2 text-sm font-semibold rounded-lg transition-colors duration-150 ${
                      isActive
                        ? "text-azure-700 bg-azure-50 border border-azure-200/80 font-bold"
                        : "text-slate-700 hover:text-azure-600 hover:bg-slate-50"
                    }`}
                  >
                    {label}
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Right Action: Language Switcher placed prominently at the end of Navbar */}
          <div className="hidden lg:flex items-center gap-3">
            <LanguageSwitcher />
          </div>

          {/* Mobile Menu Button & Language Switcher */}
          <div className="flex items-center gap-2 lg:hidden">
            <LanguageSwitcher />
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-700 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6 text-slate-700" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white/98 border-t border-slate-200 px-4 pt-3 pb-6 space-y-2 animate-in fade-in duration-200 shadow-xl">
          {NAVIGATION_LINKS.map((link) => {
            const isActive = pathname === link.href;
            const label = getNavLabel(link.href, link.label);
            return (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`block px-3 py-2.5 rounded-xl text-base font-semibold transition-colors ${
                  isActive
                    ? "text-azure-700 bg-azure-50 border border-azure-200 font-bold"
                    : "text-slate-700 hover:bg-slate-50 hover:text-azure-700"
                }`}
              >
                {label}
              </Link>
            );
          })}
          <div className="pt-4 border-t border-slate-200 flex flex-col gap-2">
            <Link href="/quote" onClick={() => setMobileMenuOpen(false)}>
              <Button variant="accent" size="lg" className="w-full font-bold tap-press shadow-md shadow-gold-500/10">
                {t.common.requestQuote}
              </Button>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
