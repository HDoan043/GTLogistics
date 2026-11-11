import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Eye, ArrowRight, BookOpen } from "lucide-react";
import { getPosts } from "@/modules/posts/actions";
import { Badge } from "@/components/ui/Badge";

export const metadata = {
  title: "Tin Tức & Cẩm Nang Xuất Nhập Khẩu | GT Logistics",
  description:
    "Cập nhật tin tức thị trường vận tải, cẩm nang thủ tục hải quan xuất nhập khẩu và các thông báo mới nhất từ Công ty TNHH Logistics GT.",
};

export default async function NewsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string }>;
}) {
  const { category } = await searchParams;
  const posts = await getPosts({ category });

  const categories = [
    "Tất cả",
    "Tin tức ngành",
    "Cẩm nang XNK",
    "Thông báo công ty",
  ];

  const currentCategory = category || "Tất cả";

  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      {/* Banner Tiêu đề Trang */}
      <section className="relative py-20 bg-slate-950 text-white overflow-hidden text-center border-b border-slate-800">
        <div
          className="absolute inset-0 opacity-20 bg-cover bg-center mix-blend-luminosity scale-105"
          style={{
            backgroundImage: "url('/images/vietphuc/hero_office_panoramic.webp')",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950 via-slate-950/90 to-blue-950/70" />

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Badge variant="accent" className="mb-3 uppercase tracking-wider">
            Bản Tin & Cẩm Nang
          </Badge>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-white">
            TIN TỨC & CẨM NANG THÔNG QUAN CỬA KHẨU
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto">
            Tổng hợp quy định hải quan mới nhất, phân tích biểu thuế ACFTA và kinh nghiệm luân chuyển hàng hóa qua Cửa khẩu Quốc tế Móng Cái.
          </p>
        </div>
      </section>

      {/* Bộ Lọc Chuyên Mục */}
      <section className="py-6 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => {
              const isActive =
                cat === currentCategory || (cat === "Tất cả" && !category);
              const href =
                cat === "Tất cả" ? "/news" : `/news?category=${encodeURIComponent(cat)}`;

              return (
                <Link
                  key={cat}
                  href={href}
                  className={`px-4 py-2 rounded-full text-xs font-bold transition-all ${
                    isActive
                      ? "bg-blue-700 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      {/* Danh sách bài viết */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {posts.length === 0 ? (
            <div className="text-center py-20 bg-white rounded-3xl border border-slate-200 max-w-md mx-auto p-8 shadow-sm">
              <BookOpen className="w-12 h-12 text-slate-400 mx-auto mb-3" />
              <h3 className="font-bold text-slate-800 text-base">Chưa có bài viết nào</h3>
              <p className="text-xs text-slate-500 mt-1">
                Các bài viết trong chuyên mục này sẽ sớm được cập nhật.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => {
                const dateStr = new Date(post.publishedAt).toLocaleDateString(
                  "vi-VN",
                  {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  }
                );

                return (
                  <article
                    key={post.slug}
                    className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-lg transition-all duration-300 flex flex-col group hover:-translate-y-1"
                  >
                    <div className="relative h-52 w-full overflow-hidden bg-slate-200">
                      <Image
                        src={post.coverImage}
                        alt={post.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/95 text-blue-900 shadow-sm backdrop-blur-sm">
                          {post.category}
                        </span>
                      </div>
                    </div>

                    <div className="p-6 flex-1 flex flex-col justify-between">
                      <div>
                        <div className="flex items-center gap-4 text-xs text-slate-500 mb-2.5">
                          <span className="flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-slate-400" />
                            <span>{dateStr}</span>
                          </span>
                          <span className="flex items-center gap-1">
                            <Eye className="w-3.5 h-3.5 text-slate-400" />
                            <span>{post.viewCount} lượt xem</span>
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors line-clamp-2">
                          <Link href={`/news/${post.slug}`}>{post.title}</Link>
                        </h3>

                        <p className="mt-2 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                          {post.excerpt}
                        </p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-100">
                        <Link
                          href={`/news/${post.slug}`}
                          className="text-xs font-bold text-blue-700 hover:text-blue-800 inline-flex items-center gap-1 transition-colors"
                        >
                          <span>Đọc chi tiết</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </div>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
