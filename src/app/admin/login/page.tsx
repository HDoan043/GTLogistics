"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Lock, Mail, AlertCircle, ArrowRight, Eye, EyeOff, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { loginAdmin } from "@/modules/auth/actions";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("admin@logisticsgt.vn");
  const [password, setPassword] = useState("Admin@GT2026!");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fillDefaults = () => {
    setEmail("admin@logisticsgt.vn");
    setPassword("Admin@GT2026!");
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append("email", email);
    formData.append("password", password);

    const res = await loginAdmin(formData);

    if (res.success) {
      window.location.href = "/admin/dashboard";
    } else {
      setLoading(false);
      setError(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 border border-slate-200 text-slate-900 shadow-xl">
        <div className="text-center mb-8">
          <div className="relative h-14 w-48 mx-auto mb-4">
            <Image
              src="/images/gt_logo.webp"
              alt="GT Logistics"
              fill
              priority
              className="object-contain"
            />
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-azure-50 text-azure-700 border border-azure-200 text-xs mb-2 font-bold">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            Hệ Thống Quản Trị Doanh Nghiệp
          </div>
          <h1 className="text-2xl font-black text-slate-950 tracking-tight">
            Đăng Nhập Quản Trị
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Điều phối nội dung website, bài viết và tiếp nhận khách hàng tiềm năng.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-700 rounded-xl flex items-start gap-2.5 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <span>{error}</span>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Email Quản Trị
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@logisticsgt.vn"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-azure-500 focus:bg-white font-mono"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs font-bold text-slate-700">
                Mật Khẩu
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-slate-500 hover:text-slate-800 flex items-center gap-1 transition-colors"
              >
                {showPassword ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5" />
                    <span>Ẩn</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5" />
                    <span>Hiện</span>
                  </>
                )}
              </button>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-10 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-azure-500 focus:bg-white font-mono"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="accent"
              size="lg"
              isLoading={loading}
              className="w-full font-bold py-3 tap-press shadow-md shadow-gold-500/10"
            >
              <span>{loading ? "Đang xác thực & chuyển hướng..." : "Đăng Nhập Quản Trị"}</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500">
          <div>
            <span>Tài khoản: </span>
            <span className="text-slate-800 font-semibold">admin@logisticsgt.vn</span>
            <br />
            <span>Mật khẩu: </span>
            <span className="text-slate-800 font-semibold">Admin@GT2026!</span>
          </div>
          <button
            type="button"
            onClick={fillDefaults}
            className="flex items-center gap-1 text-[11px] text-azure-700 hover:text-azure-900 transition-colors py-1 px-2.5 rounded-lg bg-azure-50 border border-azure-200 shrink-0 font-bold"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Điền mặc định</span>
          </button>
        </div>
      </div>
    </div>
  );
}
