import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  FileText,
  Users,
  Eye,
  Settings,
  PlusCircle,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { prisma } from "@/lib/db";
import { getCurrentAdmin } from "@/lib/auth";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

export default async function AdminDashboardPage() {
  const admin = await getCurrentAdmin();
  if (!admin) {
    redirect("/admin/login");
  }

  const [postCount, totalViews, newLeadsCount, recentLeads, recentPosts] =
    await Promise.all([
      prisma.post.count(),
      prisma.post.aggregate({ _sum: { viewCount: true } }),
      prisma.lead.count({ where: { status: "NEW" } }),
      prisma.lead.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
      prisma.post.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
      }),
    ]);

  return (
    <div className="p-6 sm:p-10 max-w-7xl mx-auto space-y-8">
      {/* Header Chào Mừng */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-black text-brand-950 tracking-tight">
            Xin Chào, {admin.fullName}!
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Tổng quan hệ thống thông tin website doanh nghiệp và tiếp nhận khách hàng.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/admin/posts/new">
            <Button variant="accent" size="sm" className="font-bold shadow-md">
              <PlusCircle className="w-4 h-4 mr-1.5" />
              <span>Viết Bài Mới</span>
            </Button>
          </Link>
          <Link href="/admin/settings">
            <Button variant="outline" size="sm" className="font-semibold bg-white">
              <Settings className="w-4 h-4 mr-1.5" />
              <span>Cấu Hình</span>
            </Button>
          </Link>
        </div>
      </div>

      {/* Thẻ Thống Kê Nhanh */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-brand-50 text-brand-700 flex items-center justify-center font-bold">
            <FileText className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
              Tổng Bài Viết
            </span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">
              {postCount}
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center font-bold">
            <Eye className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
              Lượt Đọc Bài Viết
            </span>
            <span className="text-2xl font-black text-slate-900 mt-1 block">
              {totalViews._sum.viewCount || 0}
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-accent-50 text-accent-600 flex items-center justify-center font-bold">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
              Leads Mới Chờ Xử Lý
            </span>
            <span className="text-2xl font-black text-accent-600 mt-1 block">
              {newLeadsCount}
            </span>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider block">
              Trạng Thái Hệ Thống
            </span>
            <span className="text-sm font-bold text-emerald-600 mt-1 block">
              Hoạt Động Tốt 100%
            </span>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Khách hàng mới gửi yêu cầu báo giá */}
        <div className="lg:col-span-7 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-base text-brand-950">
                Yêu Cầu Báo Giá & Liên Hệ Gần Nhất
              </h3>
              <p className="text-xs text-slate-500">Khách hàng điền thông tin từ website</p>
            </div>
            <Link
              href="/admin/leads"
              className="text-xs font-bold text-brand-700 hover:underline flex items-center gap-1"
            >
              <span>Xem tất cả</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {recentLeads.length === 0 ? (
            <div className="text-center py-8 text-xs text-slate-400">
              Chưa có yêu cầu báo giá nào mới.
            </div>
          ) : (
            <div className="space-y-3">
              {recentLeads.map((lead) => (
                <div
                  key={lead.id}
                  className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900 text-sm">
                        {lead.fullName}
                      </span>
                      <Badge
                        variant={lead.status === "NEW" ? "accent" : "success"}
                        className="text-[10px]"
                      >
                        {lead.status === "NEW" ? "Mới tiếp nhận" : "Đã liên hệ"}
                      </Badge>
                    </div>
                    <div className="text-slate-500 mt-1 flex flex-wrap gap-2">
                      <span>SĐT: <strong className="text-slate-800">{lead.phone}</strong></span>
                      <span>•</span>
                      <span>Dịch vụ: <strong className="text-slate-800">{lead.serviceType}</strong></span>
                    </div>
                    {lead.cargoDetails && (
                      <p className="text-slate-600 mt-1 italic line-clamp-1">
                        &quot;{lead.cargoDetails}&quot;
                      </p>
                    )}
                  </div>

                  <Link href="/admin/leads">
                    <Button variant="outline" size="sm" className="text-xs bg-white">
                      Xử Lý
                    </Button>
                  </Link>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Bài viết mới cập nhật */}
        <div className="lg:col-span-5 bg-white rounded-3xl border border-slate-200 shadow-sm p-6 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-base text-brand-950">
                Bài Viết Vừa Đăng
              </h3>
              <p className="text-xs text-slate-500">Tin tức & cẩm nang XNK</p>
            </div>
            <Link
              href="/admin/posts"
              className="text-xs font-bold text-brand-700 hover:underline flex items-center gap-1"
            >
              <span>Quản lý</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentPosts.map((post) => (
              <div
                key={post.id}
                className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100 text-xs"
              >
                <div className="pr-2">
                  <h4 className="font-bold text-slate-800 line-clamp-1">
                    {post.title}
                  </h4>
                  <div className="flex items-center gap-2 text-slate-400 text-[11px] mt-1">
                    <span>{post.category}</span>
                    <span>•</span>
                    <span>{post.viewCount} lượt xem</span>
                  </div>
                </div>

                <Link
                  href={`/news/${post.slug}`}
                  target="_blank"
                  className="text-brand-600 hover:underline shrink-0 font-semibold"
                >
                  Xem
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
