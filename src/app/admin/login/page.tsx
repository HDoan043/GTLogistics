"use client";

import React, { useState } from "react";
import { Lock, Mail, AlertCircle, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { loginAdmin } from "@/modules/auth/actions";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("admin@logisticsgt.vn");
  const [password, setPassword] = useState("Admin@GT2026!");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
    <div className="min-h-screen bg-slate-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-white rounded-3xl p-8 sm:p-10 shadow-2xl border border-slate-100">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-brand-900 flex items-center justify-center text-accent-400 mx-auto mb-3 shadow-md font-black text-2xl border border-brand-700">
            GT
          </div>
          <h1 className="text-2xl font-black text-brand-950 tracking-tight">
            Quản Trị Logistics GT
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Đăng nhập để quản lý bài viết, tin tức và khách hàng tiềm năng.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl flex items-start gap-2.5 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
            <span>{error}</span>
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
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              Mật Khẩu
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-500"
              />
            </div>
          </div>

          <div className="pt-2">
            <Button
              type="submit"
              variant="accent"
              size="lg"
              isLoading={loading}
              className="w-full font-bold py-3 shadow-lg"
            >
              <span>{loading ? "Đang chuyển hướng..." : "Đăng Nhập Quản Trị"}</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-100 text-center">
          <p className="text-[11px] text-slate-400">
            Tài khoản: <span className="font-mono text-slate-600 font-semibold">admin@logisticsgt.vn</span> (hoặc <span className="font-mono text-slate-600 font-semibold">admin@htclogistics.vn</span>)
            <br />
            Mật khẩu: <span className="font-mono text-slate-600 font-semibold">Admin@GT2026!</span>
          </p>
        </div>
      </div>
    </div>
  );
}
