import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calendar,
  Eye,
  User,
  ChevronRight,
  Share2,
  Phone,
} from "lucide-react";
import { getPostBySlug, getPosts } from "@/modules/posts/actions";
import { getSiteSettings } from "@/modules/settings/actions";
import { Button } from "@/components/ui/Button";
import { getServerDictionary } from "@/lib/i18n/server";
import { getLocalizedPost } from "@/lib/i18n";

export const revalidate = 180;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Bài viết không tồn tại" };

  return {
    title: `${post.title} | GT Logistics`,
    description: post.excerpt,
    openGraph: {
      title: post.title,
      description: post.excerpt,
      images: [post.coverImage],
    },
  };
}

export default async function NewsDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const [{ locale, t }, post, recentPosts, settings] = await Promise.all([
    getServerDictionary(),
    getPostBySlug(slug),
    getPosts({ limit: 5 }),
    getSiteSettings(),
  ]);

  if (!post) {
    notFound();
  }

  const localized = getLocalizedPost(post, locale);
  const dateLocale = locale === "zh" ? "zh-CN" : locale === "en" ? "en-US" : "vi-VN";
  const dateStr = new Date(post.publishedAt).toLocaleDateString(dateLocale, {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const defaultAuthor =
    locale === "zh"
      ? "GT物流编辑部"
      : locale === "en"
      ? "GT Logistics Editorial Board"
      : "Ban Biên Tập Logistics GT";

  const cleanPhone = (settings.hotline || "0904.382.268").replace(/[^0-9]/g, "");

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 text-slate-900 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-azure-600 transition-colors">
            {t.common.home}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/news" className="hover:text-azure-600 transition-colors">
            {t.common.news}
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-semibold line-clamp-1">
            {localized.title}
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Cột trái: Nội dung bài viết */}
          <main className="lg:col-span-8 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200/90 shadow-xs">
            <div className="mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-azure-50 text-azure-800 border border-azure-200/80">
                {post.category}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-950 tracking-tight leading-tight">
              {localized.title}
            </h1>

            {/* Thông tin metadata bài viết */}
            <div className="flex flex-wrap items-center gap-4 py-4 my-4 border-y border-slate-100 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {t.newsPage.author}: {post.author?.fullName || defaultAuthor}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {t.newsPage.publishedDate}: {dateStr}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                <span className="tabular-nums">
                  {post.viewCount} {t.newsPage.viewsCount}
                </span>
              </div>
            </div>

            {/* Đoạn tóm tắt nổi bật */}
            <div className="p-5 sm:p-6 rounded-2xl bg-slate-50 border border-slate-200 text-sm sm:text-base text-slate-700 font-medium leading-relaxed mb-8">
              {localized.excerpt}
            </div>

            {/* Ảnh bìa */}
            <div className="relative h-80 sm:h-96 w-full rounded-3xl overflow-hidden mb-8 shadow-sm border border-slate-200">
              <Image
                src={post.coverImage}
                alt={localized.title}
                fill
                priority
                className="object-cover"
              />
            </div>

            {/* Nội dung bài viết (Sanitized HTML & Rich Content Typography) */}
            <article
              className="rich-content text-slate-700 leading-relaxed"
              dangerouslySetInnerHTML={{ __html: localized.content }}
            />

            {/* Chia sẻ bài viết */}
            <div className="mt-12 pt-6 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 flex items-center gap-1.5">
                <Share2 className="w-4 h-4 text-slate-400" />
                {t.newsPage.shareArticle}
              </span>
              <div className="flex gap-2">
                <a
                  href={`https://zalo.me/share`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 bg-azure-600 text-white rounded-xl text-xs font-semibold hover:bg-azure-700 transition-colors shadow-xs"
                >
                  Zalo
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 bg-slate-800 text-white rounded-xl text-xs font-semibold hover:bg-slate-900 transition-colors shadow-xs"
                >
                  Facebook
                </a>
              </div>
            </div>
          </main>

          {/* Cột phải: Sidebar bài viết liên quan */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Tin mới nhất */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200/90 shadow-xs">
              <h3 className="font-bold text-base text-slate-900 mb-4 pb-2 border-b border-slate-100">
                {t.newsPage.recentNewsTitle}
              </h3>
              <div className="space-y-4">
                {recentPosts
                  .filter((p) => p.slug !== post.slug)
                  .slice(0, 4)
                  .map((p) => {
                    const locP = getLocalizedPost(p, locale);
                    const pDate = new Date(p.publishedAt).toLocaleDateString(
                      dateLocale
                    );
                    return (
                      <Link
                        key={p.slug}
                        href={`/news/${p.slug}`}
                        className="group flex gap-3 items-start"
                      >
                        <div className="relative w-20 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200">
                          <Image
                            src={p.coverImage}
                            alt={locP.title}
                            fill
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 group-hover:text-azure-600 line-clamp-2 transition-colors">
                            {locP.title}
                          </h4>
                          <span className="text-xs text-slate-400 mt-1 block">
                            {pDate}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
              </div>
            </div>

            {/* Hotline liên hệ nhanh */}
            <div className="bg-slate-950 text-white p-6 sm:p-8 rounded-3xl shadow-md text-center space-y-3 border border-slate-800">
              <Phone className="w-8 h-8 mx-auto text-gold-400" />
              <h4 className="font-bold text-base text-white">
                {t.newsPage.consultationTitle}
              </h4>
              <p className="text-xs text-slate-300">
                {t.newsPage.consultationDesc}
              </p>
              <a
                href={`tel:${cleanPhone}`}
                className="block text-xl font-black text-gold-300 hover:text-gold-200 hover:underline transition-colors"
              >
                {settings.hotline}
              </a>
              <Link href="/quote" className="block pt-2">
                <Button variant="accent" size="sm" className="w-full font-bold">
                  {t.common.requestQuote}
                </Button>
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
