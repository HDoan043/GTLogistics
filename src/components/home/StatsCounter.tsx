import React from "react";
import { TrendingUp, Users, CheckCircle, Award } from "lucide-react";

export function StatsCounter() {
  const stats = [
    {
      icon: Award,
      value: "10+",
      label: "Năm Hoạt Động",
      desc: "Thành lập từ 2015, vững chắc trong tiếp vận biên mậu",
    },
    {
      icon: TrendingUp,
      value: "65,000+",
      label: "Tấn Hàng / Năm",
      desc: "Thông quan an toàn qua Cửa khẩu Bắc Luân 2 & Móng Cái",
    },
    {
      icon: Users,
      value: "1,500+",
      label: "Doanh Nghiệp Tin Chọn",
      desc: "Chủ hàng XNK, nhà máy chế biến nông sản và chuỗi phân phối",
    },
    {
      icon: CheckCircle,
      value: "100%",
      label: "An Toàn & Minh Bạch",
      desc: "Bảo hiểm lô hàng, cam kết đền bù và hóa đơn hợp lệ",
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
                className="text-center p-5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm hover:border-amber-500/40 transition-colors"
              >
                <Icon className="w-7 h-7 mx-auto text-amber-400 mb-2" />
                <div className="text-3xl sm:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-yellow-100 to-white tracking-tight">
                  {s.value}
                </div>
                <div className="text-xs sm:text-sm font-bold text-amber-300 mt-1 uppercase tracking-wider">
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
