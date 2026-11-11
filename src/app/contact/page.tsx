import React from "react";
import Image from "next/image";
import {
  MapPin,
  Phone,
  Mail,
  Clock,
  ExternalLink,
  Building,
  ShieldCheck,
} from "lucide-react";
import { getSiteSettings } from "@/modules/settings/actions";
import { Badge } from "@/components/ui/Badge";
import { QuoteCtaSection } from "@/components/home/QuoteCtaSection";

export const metadata = {
  title: "Thông Tin Liên Hệ & Trụ Sở | GT Logistics",
  description:
    "Địa chỉ trụ sở chính tại KĐT Vinhomes Golden Avenue Cửa khẩu Bắc Luân 2 Móng Cái, chi nhánh Cảng Hải Phòng, hotline 24/7 và kết nối Zalo với Logistics GT.",
};

export default async function ContactPage() {
  const settings = await getSiteSettings();
  const cleanPhone = (settings.hotline || "0904.382.268").replace(/[^0-9]/g, "");

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Banner Tiêu đề Trang */}
      <section className="relative py-16 bg-slate-950 text-white text-center border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Badge variant="accent" className="mb-2 uppercase tracking-wider">
            Kết Nối Trực Tiếp
          </Badge>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
            LIÊN HỆ VỚI LOGISTICS GT
          </h1>
          <p className="mt-2 text-sm text-slate-300 max-w-xl mx-auto">
            Hệ thống trụ sở điều hành tại Móng Cái và mạng lưới văn phòng tại Cảng Hải Phòng, Hà Nội luôn sẵn sàng phục vụ Quý khách hàng 24/7.
          </p>
        </div>
      </section>

      {/* Thông tin chi tiết các chi nhánh */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
            {/* Trụ sở Móng Cái */}
            <div className="bg-white p-8 rounded-3xl border border-blue-200/80 shadow-md space-y-4 relative overflow-hidden flex flex-col justify-between">
              <div className="absolute top-0 right-0 w-24 h-24 bg-blue-600/10 rounded-bl-full pointer-events-none" />
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-700 flex items-center justify-center font-bold">
                    <Building className="w-6 h-6" />
                  </div>
                  <div>
                    <Badge variant="brand" className="text-[11px] font-bold">Trụ Sở Điều Hành Chính</Badge>
                    <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                      Văn Phòng Móng Cái
                    </h2>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-blue-700 mt-0.5 shrink-0" />
                    <span className="font-medium text-slate-800">
                      Căn ĐLTC-41, KĐT Vinhomes Golden Avenue, Cửa khẩu Bắc Luân 2, Phường Hải Hòa, TP. Móng Cái, Quảng Ninh
                    </span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-blue-700 shrink-0" />
                    <a href={`tel:${cleanPhone}`} className="font-bold text-slate-900 hover:text-blue-700">
                      Hotline: {settings.hotline}
                    </a>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-blue-700 shrink-0" />
                    <span>{settings.email}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-blue-700 shrink-0" />
                    <span>Trực cửa khẩu & thông quan: 24/7</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100 flex gap-3">
                <a
                  href={`https://zalo.me/${settings.zaloPhone}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors shadow-sm"
                >
                  <span>Chat Zalo Trực Tiếp</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>

            {/* Chi nhánh Cảng Hải Phòng */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                    <Building className="w-6 h-6" />
                  </div>
                  <div>
                    <Badge variant="neutral" className="text-[11px]">Chi Nhánh Cảng Biển</Badge>
                    <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                      Văn Phòng Cảng Hải Phòng
                    </h2>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                    <span>Cụm Cảng Đình Vũ, Phường Đông Hải 2, Quận Hải An, TP. Hải Phòng</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                    <span className="font-semibold text-slate-800">{settings.hotline}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>Thứ 2 - Thứ 7: 08:00 - 17:30</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <a
                  href={`tel:${cleanPhone}`}
                  className="block text-center w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
                >
                  Gọi Liên Hệ Cảng
                </a>
              </div>
            </div>

            {/* Chi nhánh Hà Nội */}
            <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold">
                    <Building className="w-6 h-6" />
                  </div>
                  <div>
                    <Badge variant="neutral" className="text-[11px]">Văn Phòng Đại Diện</Badge>
                    <h2 className="text-lg font-bold text-slate-900 mt-0.5">
                      Văn Phòng Hà Nội
                    </h2>
                  </div>
                </div>

                <div className="space-y-3 text-xs text-slate-600 pt-2 border-t border-slate-100">
                  <div className="flex items-start gap-2.5">
                    <MapPin className="w-4 h-4 text-slate-500 mt-0.5 shrink-0" />
                    <span>Số 18 Phạm Hùng, Phường Mỹ Đình, Quận Nam Từ Liêm, TP. Hà Nội</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-slate-500 shrink-0" />
                    <span className="font-semibold text-slate-800">{settings.hotline}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Clock className="w-4 h-4 text-slate-500 shrink-0" />
                    <span>Thứ 2 - Thứ 6: 08:30 - 17:30</span>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-slate-100">
                <a
                  href={`tel:${cleanPhone}`}
                  className="block text-center w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-colors"
                >
                  Gọi Văn Phòng Hà Nội
                </a>
              </div>
            </div>
          </div>

          {/* Pháp lý doanh nghiệp chính xác */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-slate-900">
              Thông Tin Pháp Lý Doanh Nghiệp (Đã Xác Thực)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-slate-600">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block mb-1">Tên pháp lý:</span>
                <strong className="text-slate-900">CÔNG TY TNHH LOGISTICS GT</strong>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block mb-1">Mã số thuế (MST):</span>
                <strong className="text-blue-700 font-mono text-sm">5701750095</strong>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block mb-1">Người đại diện pháp luật:</span>
                <strong className="text-slate-900">Lê Thanh Tâm</strong>
              </div>
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-400 block mb-1">Cơ quan cấp phép:</span>
                <strong className="text-slate-900">Sở KH&ĐT Tỉnh Quảng Ninh</strong>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quote CTA */}
      <QuoteCtaSection hotline={settings.hotline} />
    </div>
  );
}
