"use client";

import React from "react";
import Link from "next/link";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowRight,
  Building,
} from "lucide-react";
import { SERVICE_CATEGORIES } from "@/lib/constants";
import { GtLogo } from "@/components/common/GtLogo";
import { useLanguage } from "@/lib/i18n/context";

interface FooterProps {
  companyName?: string;
  hotline?: string;
  zaloPhone?: string;
  email?: string;
  headquarters?: string;
  branchHaiPhong?: string;
  taxCode?: string;
}

export function Footer({
  companyName = "CÔNG TY TNHH LOGISTICS GT",
  hotline = "0904.382.268",
  zaloPhone = "0904382268",
  email = "contact@logisticsgt.vn",
  headquarters = "Căn ĐLTC-41, KĐT Vinhomes Golden Avenue, Cửa khẩu Bắc Luân 2, Phường Hải Hòa, TP. Móng Cái, Tỉnh Quảng Ninh",
  branchHaiPhong = "Cụm Cảng Đình Vũ, Phường Đông Hải 2, Quận Hải An, TP. Hải Phòng",
  taxCode = "5701750095",
}: FooterProps) {
  const { t, locale } = useLanguage();
  const cleanPhone = hotline.replace(/[^0-9]/g, "");

  const getServiceTitle = (s: (typeof SERVICE_CATEGORIES)[0]) => {
    if (locale === "zh") return s.titleZh || s.title;
    if (locale === "en") return s.titleEn || s.title;
    return s.title;
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t-2 border-amber-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Cột 1: Thông tin công ty & Nhận diện GT LOGISTICS */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <GtLogo variant="dark" showSlogan={true} />
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed pt-1">
              {t.footer.companySummary}
            </p>

            <div className="pt-2 text-xs text-slate-400 space-y-1.5 border-t border-slate-800/80">
              <div>
                <span className="font-semibold text-slate-200">{t.common.taxCode}:</span>{" "}
                <span className="text-amber-400 font-mono font-bold">{taxCode}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-200">{t.common.legalRepresentative}:</span> Lê Thanh Tâm
              </div>
              <div>
                <span className="font-semibold text-slate-200">{t.common.partnerEcosystem}:</span> CÔNG TY TNHH VIỆT PHÚC LOGISTICS (MST: 4900940684)
              </div>
            </div>
          </div>

          {/* Cột 2: Dịch vụ cốt lõi */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-amber-500 pl-3">
              {t.footer.coreServices}
            </h3>
            <ul className="space-y-2.5 text-sm">
              {SERVICE_CATEGORIES.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="hover:text-amber-300 transition-colors flex items-center gap-1.5 text-slate-400 group"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-amber-400 transition-colors" />
                    <span>{getServiceTitle(s)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Cột 3: Liên kết nhanh */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-l-2 border-amber-500 pl-3">
              {t.footer.quickLinks}
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="hover:text-amber-300 transition-colors flex items-center gap-1.5 text-slate-400">
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                  <span>{t.common.aboutUs}</span>
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-amber-300 transition-colors flex items-center gap-1.5 text-slate-400">
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                  <span>{t.common.allServices}</span>
                </Link>
              </li>
              <li>
                <Link href="/tracking" className="hover:text-amber-300 transition-colors flex items-center gap-1.5 text-slate-400">
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                  <span>{t.common.trackOrder}</span>
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-amber-300 transition-colors flex items-center gap-1.5 text-slate-400">
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                  <span>{t.common.news}</span>
                </Link>
              </li>
              <li>
                <Link href="/quote" className="hover:text-amber-300 transition-colors flex items-center gap-1.5 text-slate-400">
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                  <span>{t.common.quote}</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-amber-300 transition-colors flex items-center gap-1.5 text-slate-400">
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600" />
                  <span>{t.common.contact}</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 4: Mạng lưới văn phòng */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider border-l-2 border-amber-500 pl-3">
              {t.footer.contactHeadquarters}
            </h3>

            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-slate-200 block">
                    {locale === "zh" ? "芒街总部运营中心:" : locale === "en" ? "Mong Cai Headquarters:" : "Trụ Sở Điều Hành Móng Cái:"}
                  </strong>
                  <span>{t.common.hqAddress}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Building className="w-4 h-4 text-sky-400 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-slate-200 block">
                    {locale === "zh" ? "海防港口分支办事处:" : locale === "en" ? "Hai Phong Port Branch:" : "Văn Phòng Cảng Hải Phòng:"}
                  </strong>
                  <span>{t.common.haiPhongOffice}</span>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-amber-400 shrink-0" />
                <div>
                  <span className="text-slate-400">{t.common.hotline}: </span>
                  <a href={`tel:${cleanPhone}`} className="text-amber-300 font-bold hover:text-amber-200 transition-colors">
                    {hotline}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-sky-400 shrink-0" />
                <a href={`mailto:${email}`} className="text-slate-300 hover:text-white transition-colors">
                  {email}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Clock className="w-4 h-4 text-sky-400 shrink-0" />
                <span>{t.common.operatingHours}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div>
            © {new Date().getFullYear()} {t.common.companyName}. {t.footer.copyright}
          </div>
          <div className="flex items-center gap-6">
            <span>{t.common.slogan}</span>
            <Link href="/admin/login" className="text-slate-600 hover:text-slate-400 transition-colors">
              Admin CMS
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
