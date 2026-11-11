import React from "react";
import Image from "next/image";
import {
  ShieldCheck,
  Compass,
  Clock,
  Headphones,
  CheckCircle2,
  Anchor,
  Sparkles,
  Award,
} from "lucide-react";
import { Badge } from "@/components/ui/Badge";

export function WhyChooseUs() {
  // 6 Giá trị cốt lõi đúc kết trực tiếp từ biểu tượng thương hiệu trên tường văn phòng
  const wallPillars = [
    { title: "KẾT NỐI", desc: "Mạng lưới tiếp vận đa phương thức xuyên suốt hai chiều Việt - Trung" },
    { title: "AN TOÀN", desc: "Bảo hiểm 100% trách nhiệm, quy chuẩn kiểm đếm & bảo quản chặt chẽ" },
    { title: "TỐI ƯU", desc: "Tối ưu hóa cung đường, biểu thuế ACFTA và thời gian lưu bãi" },
    { title: "HIỆU QUẢ", desc: "Thông quan giải phóng phương tiện nhanh chóng ngay trong ngày" },
    { title: "UY TÍN", desc: "Đồng hành minh bạch, pháp lý chính ngạch, cam kết tiến độ chuẩn xác" },
    { title: "TIẾT KIỆM", desc: "Chi phí cước cạnh tranh nhất khu vực cửa khẩu Móng Cái" },
  ];

  return (
    <section className="py-20 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Tiêu đề & Thông điệp */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <Badge variant="accent" className="mb-3 uppercase tracking-wider">
            Năng Lực & Cam Kết Thực Tế
          </Badge>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Đồng Hành Tin Cậy - Phát Triển Bền Vững
          </h2>
          <p className="mt-4 text-slate-600 text-base leading-relaxed">
            Hạ tầng làm việc hiện đại tại Khu đô thị Vinhomes Golden Avenue (khu vực Cửa khẩu Bắc Luân 2, TP. Móng Cái) cùng đội ngũ chuyên viên thường trực 24/7 bảo đảm giải phóng hàng hóa lưu thông nhanh nhất.
          </p>
        </div>

        {/* Lưới hình ảnh thực tế của Trụ sở & Đội ngũ */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 mb-16 items-center">
          {/* Ảnh lớn bên trái: Biển hiệu thương hiệu phát sáng 3D */}
          <div className="md:col-span-7 relative h-[360px] sm:h-[440px] rounded-3xl overflow-hidden shadow-xl border border-slate-200 group">
            <Image
              src="/images/vietphuc/gt_brand_wall_illuminated.webp"
              alt="Biển hiệu GT Logistics tại văn phòng Vinhomes Golden Avenue Móng Cái"
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 text-white">
              <span className="inline-block px-3.5 py-1 rounded-full bg-amber-500 text-slate-950 text-xs font-black mb-2 backdrop-blur-sm shadow-md">
                Trụ Sở Điều Hành Móng Cái
              </span>
              <h3 className="text-lg sm:text-xl font-bold">
                Căn ĐLTC-41, KĐT Vinhomes Golden Avenue, Cửa khẩu Bắc Luân 2
              </h3>
              <p className="text-xs sm:text-sm text-slate-300 mt-1">
                Không gian làm việc tiêu chuẩn cao, kết nối trực tiếp các cơ quan kiểm hóa và hải quan cửa khẩu.
              </p>
            </div>
          </div>

          {/* 2 Ảnh bên phải: Đội ngũ & Sàn làm việc thực tế */}
          <div className="md:col-span-5 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 gap-6">
            <div className="relative h-[208px] rounded-3xl overflow-hidden shadow-md border border-slate-200 group">
              <Image
                src="/images/vietphuc/office_main_floor.webp"
                alt="Sàn làm việc chuyên viên chứng từ Logistics GT"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-xs font-bold block">Sàn Giao Dịch & Chứng Từ</span>
                <span className="text-[11px] text-slate-300">Túc trực khai báo hải quan điện tử VNACCS 24/7</span>
              </div>
            </div>

            <div className="relative h-[208px] rounded-3xl overflow-hidden shadow-md border border-slate-200 group">
              <Image
                src="/images/vietphuc/customs_document_review.webp"
                alt="Kiểm tra tờ khai và bộ chứng từ xuất nhập khẩu"
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 text-white">
                <span className="text-xs font-bold block">Nghiệp Vụ Hải Quan Chính Ngạch</span>
                <span className="text-[11px] text-slate-300">Thẩm định chứng từ & xin C/O Form E ưu đãi thuế</span>
              </div>
            </div>
          </div>
        </div>

        {/* 6 Trụ cột giá trị cốt lõi đúc kết từ biển hiệu */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
          {wallPillars.map((p, idx) => (
            <div
              key={idx}
              className="p-5 rounded-2xl bg-slate-50 border border-slate-200/80 hover:border-amber-400/80 hover:bg-amber-50/20 hover:shadow-lg transition-all duration-200 text-center flex flex-col justify-between group"
            >
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-100 to-amber-200 text-amber-950 border border-amber-300/80 flex items-center justify-center font-black text-sm mx-auto mb-3 shadow-sm group-hover:scale-110 transition-transform">
                0{idx + 1}
              </div>
              <div>
                <h4 className="font-extrabold text-sm text-slate-900 tracking-wider mb-1">
                  {p.title}
                </h4>
                <p className="text-[11px] text-slate-600 leading-relaxed">
                  {p.desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
