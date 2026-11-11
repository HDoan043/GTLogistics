import React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Truck,
  ShieldCheck,
  CheckCircle,
  Users,
  Award,
  Target,
  Compass,
  Building,
  MapPin,
  FileCheck,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";
import { StatsCounter } from "@/components/home/StatsCounter";
import { QuoteCtaSection } from "@/components/home/QuoteCtaSection";
import { getSiteSettings } from "@/modules/settings/actions";

export const metadata = {
  title: "Giới Thiệu Về Chúng Tôi | GT Logistics",
  description:
    "Tìm hiểu về lịch sử hình thành, năng lực vận tải, pháp lý doanh nghiệp và cam kết dịch vụ của Công ty TNHH Logistics GT tại Cửa khẩu Quốc tế Móng Cái.",
};

export default async function AboutPage() {
  const settings = await getSiteSettings();

  return (
    <div className="flex flex-col min-h-screen">
      {/* Banner Tiêu đề Trang (Executive Midnight Style) */}
      <section className="relative py-20 bg-slate-950 text-white overflow-hidden border-b border-slate-800">
        <div
          className="absolute inset-0 opacity-25 bg-cover bg-center mix-blend-luminosity scale-105"
          style={{
            backgroundImage: "url('/images/vietphuc/hero_office_panoramic.webp')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-blue-950/70" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <Badge variant="accent" className="mb-3 uppercase tracking-wider">
            Hồ Sơ Doanh Nghiệp
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            CÂU CHUYỆN & NĂNG LỰC GT LOGISTICS
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
            Hơn 10 năm đồng hành cùng sự phát triển của dòng chảy thương mại song phương Việt Nam - Trung Quốc qua cửa ngõ Cửa khẩu Quốc tế Móng Cái.
          </p>
        </div>
      </section>

      {/* Lịch sử & Tổng quan với hình ảnh thực tế */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            {/* Ảnh thực tế sàn làm việc văn phòng */}
            <div className="lg:col-span-6 relative h-[440px] rounded-3xl overflow-hidden shadow-2xl border border-slate-200 group">
              <Image
                src="/images/vietphuc/office_workstations_wide.webp"
                alt="Văn phòng điều hành Logistics GT tại Vinhomes Golden Avenue Móng Cái"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white p-5 rounded-2xl bg-slate-900/80 backdrop-blur-md border border-white/10">
                <span className="text-sm font-bold block text-sky-400">
                  CÔNG TY TNHH LOGISTICS GT
                </span>
                <span className="text-xs text-slate-200">
                  Trụ sở điều hành: Căn ĐLTC-41, KĐT Vinhomes Golden Avenue, Cửa khẩu Bắc Luân 2, TP. Móng Cái, Quảng Ninh
                </span>
              </div>
            </div>

            {/* Nội dung thông tin doanh nghiệp chính xác */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 text-blue-800 text-xs font-bold border border-blue-200">
                <span>MST: 5701750095 • Hoạt động từ 2015</span>
              </div>

              <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                Vị Thế Tiên Phong Tiếp Vận Biên Mậu Tại Cửa Khẩu Móng Cái
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                <strong>Công ty TNHH Logistics GT</strong> (tiền thân thành lập và hoạt động vững chắc từ năm 2015) là đơn vị tiếp vận chuyên nghiệp hàng đầu tại địa bàn Thành phố Móng Cái, tỉnh Quảng Ninh.
              </p>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Với trụ sở điều hành đặt ngay tại <strong>Khu đô thị Vinhomes Golden Avenue</strong> sát cạnh khu vực <strong>Cửa khẩu Quốc tế Bắc Luân 2</strong>, chúng tôi sở hữu vị trí chiến lược tiếp cận các bãi kiểm hóa, trạm liên ngành và luồng xe container liên vận Việt - Trung nhanh chóng nhất.
              </p>

              {/* Tổ hợp đối tác hệ sinh thái */}
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-2 text-xs text-slate-700">
                <div className="font-bold text-slate-900 text-sm flex items-center gap-2">
                  <Building className="w-4 h-4 text-blue-700" />
                  <span>Hệ sinh thái dịch vụ liên minh vững mạnh</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Logistics GT phối hợp liên kết toàn diện cùng <strong>Công ty TNHH Việt Phúc Logistics</strong> (Căn ĐLTC-39, MST: 4900940684) tạo nên mạng lưới dịch vụ đồng bộ gồm: thông quan hải quan điện tử, xin cấp C/O Form E, vận tải đường bộ xuyên biên giới và sang tải lưu kho bảo quản tiêu chuẩn.
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-start gap-3">
                  <Target className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Sứ Mệnh</h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Kết nối chuỗi cung ứng thông suốt, an toàn và tối ưu chi phí xuất nhập khẩu.
                    </p>
                  </div>
                </div>
                <div className="p-4 rounded-2xl bg-blue-50/50 border border-blue-100 flex items-start gap-3">
                  <Compass className="w-5 h-5 text-blue-700 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="font-bold text-sm text-slate-900">Khẩu Hiệu</h4>
                    <p className="text-xs text-slate-600 mt-1">
                      Đồng hành tin cậy - Phát triển bền vững.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Đội ngũ & Buổi họp chiến lược thực tế */}
      <section className="py-20 bg-slate-50 border-y border-slate-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-5 space-y-6">
              <Badge variant="brand" className="uppercase tracking-wider">
                Đội Ngũ & Ban Lãnh Đạo
              </Badge>
              <h2 className="text-3xl font-black text-slate-900 tracking-tight leading-tight">
                Ban Lãnh Đạo Tận Tâm, Nhân Sự Thực Chiến
              </h2>
              <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                Toàn bộ đội ngũ của chúng tôi được đào tạo bài bản về quy định hải quan, thủ tục kiểm hóa, điều kiện xuất nhập khẩu nông sản, máy móc và quy chuẩn vận tải đường bộ.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-slate-700">
                  <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Người đại diện pháp luật: <strong>Lê Thanh Tâm</strong></span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-700">
                  <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Trực cửa khẩu giải phóng hàng: <strong>24/7 kể cả ngày lễ</strong></span>
                </div>
                <div className="flex items-center gap-3 text-sm text-slate-700">
                  <CheckCircle className="w-4 h-4 text-blue-600 shrink-0" />
                  <span>Tư vấn biểu thuế ACFTA & kiểm tra C/O Form E chuẩn xác 100%</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Ảnh lãnh đạo */}
              <div className="relative h-64 rounded-3xl overflow-hidden shadow-lg border border-slate-200 group">
                <Image
                  src="/images/vietphuc/director_leadership.webp"
                  alt="Ban lãnh đạo điều hành chiến lược Logistics GT"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-xs font-bold block">Ban Lãnh Đạo Điều Hành</span>
                  <span className="text-[11px] text-slate-300">Định hướng chiến lược & cam kết chất lượng</span>
                </div>
              </div>

              {/* Ảnh phòng họp toàn thể */}
              <div className="relative h-64 rounded-3xl overflow-hidden shadow-lg border border-slate-200 group">
                <Image
                  src="/images/vietphuc/boardroom_conference.webp"
                  alt="Họp giao ban nghiệp vụ vận tải và thông quan tại phòng hội nghị"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4 text-white">
                  <span className="text-xs font-bold block">Phòng Hội Nghị & Điều Phối</span>
                  <span className="text-[11px] text-slate-300">Giao ban nghiệp vụ hải quan & tiến độ giao nhận</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Số liệu ấn tượng */}
      <StatsCounter />

      {/* 6 Trụ cột giá trị cốt lõi đúc kết từ biển hiệu */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <Badge variant="brand" className="uppercase tracking-wider mb-2">
              Kim Chỉ Nam Hoạt Động
            </Badge>
            <h2 className="text-3xl font-black text-slate-900 tracking-tight">
              6 Giá Trị Cốt Lõi Vững Bền
            </h2>
            <p className="mt-3 text-slate-600 text-sm">
              Được khắc ghi trang trọng trên biểu tượng thương hiệu tại trụ sở điều hành GT Logistics
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "KẾT NỐI",
                desc: "Kết nối mạng lưới logistics thông suốt từ các trung tâm sản xuất nội địa đi qua Cửa khẩu Quốc tế Móng Cái thẳng vào thị trường Trung Quốc.",
              },
              {
                title: "AN TOÀN",
                desc: "Cam kết 100% an toàn hàng hóa với chính sách bảo hiểm trách nhiệm toàn diện, giám sát hành trình GPS và đền bù thỏa đáng nếu có sự cố.",
              },
              {
                title: "TỐI ƯU",
                desc: "Tối ưu hóa thời gian thông quan, tư vấn phân loại mã HS Code chính xác giúp doanh nghiệp tận dụng tối đa biểu thuế xuất nhập khẩu ưu đãi.",
              },
              {
                title: "HIỆU QUẢ",
                desc: "Quy trình giải phóng tờ khai hải quan điện tử và sang tải xe container siêu tốc, hỗ trợ giao hàng hỏa tốc trong ngày.",
              },
              {
                title: "UY TÍN",
                desc: "Hơn 10 năm gây dựng uy tín trong ngành tiếp vận biên mậu, pháp lý chính ngạch minh bạch, hóa đơn chứng từ đầy đủ.",
              },
              {
                title: "TIẾT KIỆM",
                desc: "Chính sách cước phí cạnh tranh nhất, không phát sinh phụ phí ngầm, chiết khấu ưu đãi cho khách hàng ký hợp đồng nguyên tắc lâu dài.",
              },
            ].map((v, i) => (
              <div
                key={i}
                className="p-6 rounded-3xl bg-slate-50 border border-slate-200/80 hover:border-blue-500/50 hover:bg-blue-50/20 hover:shadow-md transition-all duration-200"
              >
                <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center mb-4 font-black text-base">
                  0{i + 1}
                </div>
                <h3 className="font-extrabold text-lg text-slate-900 mb-2">{v.title}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quote CTA */}
      <QuoteCtaSection hotline={settings.hotline} />
    </div>
  );
}
