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
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-slate-900/95 rounded-2xl p-8 sm:p-10 border border-slate-800 text-white shadow-md">
        <div className="text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-azure-950 border border-azure-800/80 flex items-center justify-center text-azure-400 mx-auto mb-3 shadow-sm font-mono font-black text-2xl">
            GT
          </div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-950 text-emerald-400 border border-slate-800 text-[11px] mb-2 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
            Operations Console
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight">
            Quản Trị Logistics GT
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Đăng nhập để điều phối bài viết, tin tức và khách hàng tiềm năng.
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-rose-950/80 border border-rose-800/80 text-rose-300 rounded-xl flex items-start gap-2.5 text-xs font-semibold">
            <AlertCircle className="w-4 h-4 text-rose-400 shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Email Quản Trị
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@logisticsgt.vn"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-azure-500 font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-300 mb-1.5">
              Mật Khẩu
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-10 pr-4 py-2.5 text-sm bg-slate-950 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-azure-500 font-mono"
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
              <span>{loading ? "Đang chuyển hướng..." : "Đăng Nhập Quản Trị"}</span>
              <ArrowRight className="w-4 h-4 ml-1.5" />
            </Button>
          </div>
        </form>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center">
          <p className="text-xs text-slate-400">
            Tài khoản: <span className="text-slate-200 font-semibold">admin@logisticsgt.vn</span>
            <br />
            Mật khẩu: <span className="text-slate-200 font-semibold">Admin@GT2026!</span>
          </p>
        </div>
      </div>
    </div>
  );
}
