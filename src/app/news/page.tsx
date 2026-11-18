import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Calendar, Eye, ArrowRight, BookOpen } from "lucide-react";
import { getPosts } from "@/modules/posts/actions";
import { Badge } from "@/components/ui/Badge";
import { PageBanner } from "@/components/layout/PageBanner";
import { getServerDictionary } from "@/lib/i18n/server";
import { getLocalizedPost } from "@/lib/i18n";
import { DEFAULT_BANNERS_CONTENT } from "@/modules/content/constants";
import { getPageSectionContent } from "@/modules/content/actions";

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
  const [{ locale, t }, posts, bannersContent] = await Promise.all([
    getServerDictionary(),
    getPosts({ category }),
    getPageSectionContent("content_banners", DEFAULT_BANNERS_CONTENT),
  ]);

  const bannerCfg = bannersContent?.news || DEFAULT_BANNERS_CONTENT.news;

  const categories = [
    { filterVal: "", label: t.newsPage.categories.all },
    { filterVal: "Tin tức ngành", label: t.newsPage.categories.industry },
    { filterVal: "Cẩm nang XNK", label: t.newsPage.categories.guide },
    { filterVal: "Thông báo công ty", label: t.newsPage.categories.company },
  ];

  const currentCategory = category || "";
  const dateLocale = locale === "zh" ? "zh-CN" : locale === "en" ? "en-US" : "vi-VN";
  const newsTitle =
    locale === "zh"
      ? "新闻与外贸指南"
      : locale === "en"
      ? "News & Trade Guides"
      : "Tin Tức & Cẩm Nang";

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900">
      {/* Banner Tiêu đề Trang chính: Rộng thoáng, to đẹp với watermark logo GT */}
      <PageBanner
        breadcrumbs={[
          { label: t.common.home, href: "/" },
          { label: t.common.news },
        ]}
        title={newsTitle}
        subtitle={t.newsPage.desc}
        size="main"
        bgImage={bannerCfg.bgImage}
        bgScale={bannerCfg.bgScale}
        bgPosition={bannerCfg.bgPosition}
        bgOpacity={bannerCfg.bgOpacity}
      />

      {/* Bộ Lọc Chuyên Mục */}
      <section className="py-6 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {categories.map((cat) => {
              const isActive = cat.filterVal === currentCategory;
              const href = !cat.filterVal
                ? "/news"
                : `/news?category=${encodeURIComponent(cat.filterVal)}`;

              return (
                <Link
                  key={cat.filterVal || "all"}
                  href={href}
                  className={`px-4 py-2 rounded-full text-xs font-semibold transition-colors duration-150 ${
                    isActive
                      ? "bg-azure-600 text-white shadow-sm"
                      : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                  }`}
                >
                  {cat.label}
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
              <h3 className="font-bold text-slate-900 text-base">
                {t.newsPage.emptyTitle}
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                {t.newsPage.emptyDesc}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => {
                const localized = getLocalizedPost(post, locale);
                const dateStr = new Date(post.publishedAt).toLocaleDateString(
                  dateLocale,
                  {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric",
                  }
                );

                return (
                  <article
                    key={post.slug}
                    className="bg-white rounded-3xl overflow-hidden border border-slate-200/90 shadow-xs hover:shadow-md hover:border-azure-300 transition-transform duration-200 flex flex-col group motion-safe:hover:-translate-y-1"
                  >
                    <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                      <Image
                        src={post.coverImage}
                        alt={localized.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-white/95 text-slate-900 shadow-xs border border-slate-100">
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
                            <span className="tabular-nums">
                              {post.viewCount} {t.newsPage.viewsCount}
                            </span>
                          </span>
                        </div>

                        <h3 className="text-base font-bold text-slate-900 group-hover:text-azure-600 transition-colors line-clamp-2">
                          <Link href={`/news/${post.slug}`}>{localized.title}</Link>
                        </h3>

                        <p className="mt-2 text-xs text-slate-600 line-clamp-3 leading-relaxed">
                          {localized.excerpt}
                        </p>
                      </div>

                      <div className="mt-6 pt-4 border-t border-slate-100">
                        <Link
                          href={`/news/${post.slug}`}
                          className="text-xs font-bold text-azure-600 hover:text-gold-600 inline-flex items-center gap-1 transition-colors"
                        >
                          <span>{t.newsPage.readMore}</span>
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
