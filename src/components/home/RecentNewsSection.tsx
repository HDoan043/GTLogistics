import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, ArrowRight, Eye } from "lucide-react";
import { Badge } from "@/components/ui/Badge";

interface PostItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  coverImage: string;
  category: string;
  viewCount: number;
  publishedAt: Date | string;
}

export function RecentNewsSection({ posts }: { posts: PostItem[] }) {
  if (!posts || posts.length === 0) return null;

  return (
    <section className="py-20 bg-slate-50 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <Badge variant="brand" className="mb-2 uppercase tracking-wider">
              Bản Tin & Cẩm Nang
            </Badge>
            <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
              Tin Tức Xuất Nhập Khẩu & Thông Quan Cửa Khẩu Mới Nhất
            </h2>
          </div>
          <Link
            href="/news"
            className="mt-4 md:mt-0 text-sm font-bold text-blue-700 hover:text-blue-800 inline-flex items-center gap-1.5 transition-colors"
          >
            <span>Xem tất cả bài viết</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.slice(0, 3).map((post) => {
            const dateStr = new Date(post.publishedAt).toLocaleDateString("vi-VN", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
            });

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
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/90 text-blue-900 shadow-sm backdrop-blur-sm">
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
                      <span>Đọc tiếp</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
