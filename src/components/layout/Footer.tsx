"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ArrowRight,
  Building,
  Truck,
  Ship,
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
  branchLangSon?: string;
  branchHaiPhong?: string;
  branchCoTo?: string;
  taxCode?: string;
  legalRep?: string;
  workingHours?: string;
}

export function Footer({
  companyName = "CÔNG TY TNHH LOGISTICS GT",
  hotline = "0904.382.268",
  zaloPhone = "0904382268",
  email = "contact@logisticsgt.vn",
  headquarters = "Căn ĐLTC-41, KĐT Vinhomes Golden Avenue, Cửa khẩu Bắc Luân 2, Phường Hải Hòa, TP. Móng Cái, Tỉnh Quảng Ninh",
  branchLangSon = "CK Hữu Nghị, CK Tân Thanh & CK Chi Ma",
  branchHaiPhong = "Cụm Cảng Đình Vũ, Q. Hải An, TP. Hải Phòng",
  branchCoTo = "Bến Vân Đồn / Cẩm Phả & Quần đảo Cô Tô",
  taxCode = "5701750095",
  legalRep = "Lê Thanh Tâm",
  workingHours = "Trực hiện trường kiểm hóa & thông quan: 24/7 cả Thứ Bảy, Chủ Nhật",
}: FooterProps) {
  const pathname = usePathname();
  const { t, locale } = useLanguage();

  // Không hiển thị Footer công khai bên trong khu vực quản trị (/admin/*)
  if (pathname?.startsWith("/admin")) {
    return null;
  }

  const cleanPhone = hotline.replace(/[^0-9]/g, "");

  const getServiceTitle = (s: (typeof SERVICE_CATEGORIES)[0]) => {
    if (locale === "zh") return s.titleZh || s.title;
    if (locale === "en") return s.titleEn || s.title;
    return s.title;
  };

  return (
    <footer className="bg-slate-950 text-slate-300 pt-16 pb-8 border-t-2 border-gold-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 pb-12 border-b border-slate-800">
          {/* Cột 1: Thông tin công ty & Nhận diện GT LOGISTICS */}
          <div className="space-y-4">
            <Link href="/" className="inline-block">
              <GtLogo variant="dark" showSlogan={true} />
            </Link>

            <p className="text-sm text-slate-400 leading-relaxed pt-1">
              Đơn vị tiên phong vận tải đường bộ liên vận Việt – Trung (50 xe container), đại lý thông quan chính ngạch đa cửa khẩu và khai thác chuyên tuyến tàu/sà lan quần đảo Cô Tô.
            </p>

            <div className="pt-2 text-xs text-slate-400 space-y-1.5 border-t border-slate-800/80">
              <div>
                <span className="font-semibold text-slate-200">Mã số thuế:</span>{" "}
                <span className="text-gold-400 font-mono font-bold">{taxCode}</span>
              </div>
              <div>
                <span className="font-semibold text-slate-200">Đại diện pháp luật:</span> {legalRep}
              </div>
              <div>
                <span className="font-semibold text-slate-200">Hotline 24/7:</span>{" "}
                <a href={`tel:${cleanPhone}`} className="text-azure-400 font-bold hover:underline">
                  {hotline}
                </a>
              </div>
              <div>
                <span className="font-semibold text-slate-200">Email:</span>{" "}
                <a href={`mailto:${email}`} className="text-slate-300 hover:underline">
                  {email}
                </a>
              </div>
            </div>
          </div>

          {/* Cột 2: 4 Dịch vụ nòng cốt */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4 border-l-2 border-gold-500 pl-3">
              DỊCH VỤ TRỌNG TÂM
            </h3>
            <ul className="space-y-2.5 text-sm">
              {SERVICE_CATEGORIES.map((s) => (
                <li key={s.slug}>
                  <Link
                    href={`/services/${s.slug}`}
                    className="hover:text-gold-300 transition-colors flex items-center gap-1.5 text-slate-400 group"
                  >
                    <ArrowRight className="w-3.5 h-3.5 text-slate-600 group-hover:text-gold-400 transition-colors shrink-0" />
                    <span className="line-clamp-1">{getServiceTitle(s)}</span>
                  </Link>
                </li>
              ))}
            </ul>

            <div className="mt-6 pt-4 border-t border-slate-800/80">
              <span className="text-xs font-bold text-slate-400 block mb-2">HỆ SINH THÁI THÀNH VIÊN:</span>
              <p className="text-xs text-slate-500 leading-relaxed">
                • <strong className="text-slate-300">Việt Phúc Logistics:</strong> Đội xe 50 container<br />
                • <strong className="text-slate-300">Vận Tải Cô Tô:</strong> Tàu & sà lan biển đảo
              </p>
            </div>
          </div>

          {/* Cột 3: Liên kết nhanh (Đã bỏ hoàn toàn Tra Cứu Vận Đơn) */}
          <div>
            <h3 className="text-sm font-bold text-white mb-4 border-l-2 border-gold-500 pl-3">
              LIÊN KẾT NHANH
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link href="/about" className="hover:text-gold-300 transition-colors flex items-center gap-1.5 text-slate-400">
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  <span>Về Chúng Tôi (Giới Thiệu)</span>
                </Link>
              </li>
              <li>
                <Link href="/services" className="hover:text-gold-300 transition-colors flex items-center gap-1.5 text-slate-400">
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  <span>Tất Cả 4 Dịch Vụ</span>
                </Link>
              </li>
              <li>
                <Link href="/news" className="hover:text-gold-300 transition-colors flex items-center gap-1.5 text-slate-400">
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  <span>Tin Tức & Biểu Thuế XNK</span>
                </Link>
              </li>
              <li>
                <Link href="/quote" className="hover:text-gold-300 transition-colors flex items-center gap-1.5 text-slate-400">
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  <span>Yêu Cầu Báo Giá Nhanh</span>
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-gold-300 transition-colors flex items-center gap-1.5 text-slate-400">
                  <ArrowRight className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                  <span>Liên Hệ & Điểm Trực Cửa Khẩu</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Cột 4: Hệ thống điểm trực cửa khẩu 24/7 */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-white border-l-2 border-gold-500 pl-3">
              ĐIỂM TRỰC CỬA KHẨU 24/7
            </h3>

            <div className="space-y-3 text-xs text-slate-400">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-azure-400 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-slate-200 block">Trụ Sở Móng Cái (Bắc Luân 2):</strong>
                  <span>{headquarters}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Truck className="w-4 h-4 text-gold-400 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-slate-200 block">Điểm Trực Lạng Sơn:</strong>
                  <span>{branchLangSon}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Building className="w-4 h-4 text-azure-400 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-slate-200 block">Văn Phòng Cảng Hải Phòng:</strong>
                  <span>{branchHaiPhong}</span>
                </div>
              </div>

              <div className="flex items-start gap-2.5">
                <Ship className="w-4 h-4 text-emerald-400 mt-0.5 shrink-0" />
                <div>
                  <strong className="text-slate-200 block">Đầu Mối Tàu Đảo Cô Tô:</strong>
                  <span>{branchCoTo}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bản quyền & giờ làm việc */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div>
            © {new Date().getFullYear()} {companyName}. Bản quyền thuộc về Logistics GT.
          </div>
          <div className="flex items-center gap-2 text-slate-400">
            <Clock className="w-3.5 h-3.5 text-gold-400" />
            <span>{workingHours}</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
