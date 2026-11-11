"use client";

import React, { useState } from "react";
import { Send, CheckCircle2, PhoneCall, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { submitLead } from "@/modules/leads/actions";

export function QuoteCtaSection({ hotline = "0904.382.268" }: { hotline?: string }) {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    email: "",
    company: "",
    serviceType: "Vận tải đường bộ & liên vận Móng Cái",
    routeOrigin: "",
    routeDestination: "",
    cargoDetails: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{
    type: "idle" | "success" | "error";
    message: string;
  }>({
    type: "idle",
    message: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: "idle", message: "" });

    const result = await submitLead(formData);
    setLoading(false);

    if (result.success) {
      setStatus({
        type: "success",
        message: result.message,
      });
      setFormData({
        fullName: "",
        phone: "",
        email: "",
        company: "",
        serviceType: "Vận tải đường bộ & liên vận Móng Cái",
        routeOrigin: "",
        routeDestination: "",
        cargoDetails: "",
        message: "",
      });
    } else {
      setStatus({
        type: "error",
        message: result.message,
      });
    }
  };

  const cleanPhone = hotline.replace(/[^0-9]/g, "");

  return (
    <section className="py-20 bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white relative border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Cột trái: Lời kêu gọi */}
          <div className="lg:col-span-5 space-y-6">
            <span className="inline-block px-3.5 py-1 bg-blue-900/60 text-sky-300 text-xs font-bold rounded-full border border-blue-500/30 uppercase tracking-wider backdrop-blur-sm">
              Báo Giá Nhanh 15 Phút
            </span>
            <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
              Cần Báo Giá Cước Hoặc Tư Vấn Thông Quan Cửa Khẩu?
            </h2>
            <p className="text-slate-300 text-sm leading-relaxed">
              Điền nhanh thông tin lô hàng của bạn. Đội ngũ chuyên viên chứng từ của <strong>Logistics GT</strong> tại Cửa khẩu Móng Cái sẽ phân tích biểu thuế, lộ trình và gửi phương án tối ưu chi phí nhất tới bạn trong vòng 15 phút.
            </p>

            <div className="p-6 rounded-3xl bg-white/5 border border-white/10 space-y-4 backdrop-blur-md">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white font-bold shrink-0 shadow-lg shadow-blue-600/30">
                  <PhoneCall className="w-6 h-6" />
                </div>
                <div>
                  <div className="text-xs text-slate-400">Tư vấn trực tiếp 24/7:</div>
                  <a
                    href={`tel:${cleanPhone}`}
                    className="text-xl font-black text-sky-400 hover:text-sky-300 hover:underline transition-colors"
                  >
                    {hotline}
                  </a>
                </div>
              </div>
              <div className="text-xs text-slate-300 space-y-1">
                <div>✓ Trực tiếp tại Cửa khẩu Quốc tế Móng Cái & Bắc Luân 2.</div>
                <div>✓ Miễn phí tư vấn mã HS Code và tối ưu thuế ACFTA.</div>
              </div>
            </div>
          </div>

          {/* Cột phải: Form Báo Giá */}
          <div className="lg:col-span-7">
            <div className="bg-white rounded-3xl p-6 sm:p-10 text-slate-800 shadow-2xl border border-slate-100">
              <h3 className="text-2xl font-black text-slate-900 mb-2">
                Yêu Cầu Báo Giá Trực Tuyến
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Vui lòng cung cấp thông tin liên hệ và chi tiết lô hàng của Quý khách.
              </p>

              {status.type === "success" && (
                <div className="mb-6 p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-2xl flex items-start gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <div className="text-sm font-semibold">{status.message}</div>
                </div>
              )}

              {status.type === "error" && (
                <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-2xl flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div className="text-sm font-semibold">{status.message}</div>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Họ và Tên *
                    </label>
                    <input
                      type="text"
                      required
                      value={formData.fullName}
                      onChange={(e) =>
                        setFormData({ ...formData, fullName: e.target.value })
                      }
                      placeholder="Nguyễn Văn A"
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Số Điện Thoại / Zalo *
                    </label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) =>
                        setFormData({ ...formData, phone: e.target.value })
                      }
                      placeholder="0912.345.678"
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Dịch Vụ Cần Tư Vấn *
                    </label>
                    <select
                      value={formData.serviceType}
                      onChange={(e) =>
                        setFormData({ ...formData, serviceType: e.target.value })
                      }
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                    >
                      <option value="Vận tải đường bộ">Vận tải đường bộ</option>
                      <option value="Thủ tục hải quan & C/O">Thủ tục hải quan & C/O</option>
                      <option value="Ủy thác xuất nhập khẩu">Ủy thác xuất nhập khẩu</option>
                      <option value="Kho bãi & sang tải">Kho bãi & sang tải</option>
                      <option value="Logistics chuỗi lạnh">Logistics chuỗi lạnh</option>
                      <option value="Vận tải đa phương thức">Vận tải đa phương thức</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Tên Doanh Nghiệp (Nếu có)
                    </label>
                    <input
                      type="text"
                      value={formData.company}
                      onChange={(e) =>
                        setFormData({ ...formData, company: e.target.value })
                      }
                      placeholder="Công ty TNHH XYZ"
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Điểm Gửi (Nơi đi)
                    </label>
                    <input
                      type="text"
                      value={formData.routeOrigin}
                      onChange={(e) =>
                        setFormData({ ...formData, routeOrigin: e.target.value })
                      }
                      placeholder="Đông Hưng (TQ) / Hà Nội / Hải Phòng..."
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 mb-1">
                      Điểm Đến (Nơi nhận)
                    </label>
                    <input
                      type="text"
                      value={formData.routeDestination}
                      onChange={(e) =>
                        setFormData({ ...formData, routeDestination: e.target.value })
                      }
                      placeholder="Móng Cái / KCN Bắc Ninh / Toàn quốc..."
                      className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    Mô Tả Lô Hàng / Yêu Cầu Cụ Thể
                  </label>
                  <textarea
                    rows={3}
                    value={formData.cargoDetails}
                    onChange={(e) =>
                      setFormData({ ...formData, cargoDetails: e.target.value })
                    }
                    placeholder="Loại hàng hóa, quy cách đóng gói (container / kiện / pallet), trọng lượng dự kiến và thời gian cần giao nhận..."
                    className="w-full px-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all"
                  />
                </div>

                <Button
                  type="submit"
                  variant="accent"
                  size="lg"
                  isLoading={loading}
                  className="w-full font-black text-base py-3.5 shadow-lg shadow-blue-600/30"
                >
                  <Send className="w-5 h-5 mr-2" />
                  <span>Gửi Yêu Cầu Báo Giá Nhanh</span>
                </Button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
