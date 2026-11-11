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
  ArrowRight,
  Phone,
} from "lucide-react";
import { getPostBySlug, getPosts } from "@/modules/posts/actions";
import { getSiteSettings } from "@/modules/settings/actions";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

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
  const [post, recentPosts, settings] = await Promise.all([
    getPostBySlug(slug),
    getPosts({ limit: 5 }),
    getSiteSettings(),
  ]);

  if (!post) {
    notFound();
  }

  const dateStr = new Date(post.publishedAt).toLocaleDateString("vi-VN", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  const cleanPhone = (settings.hotline || "0904.382.268").replace(/[^0-9]/g, "");

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-slate-500 mb-6">
          <Link href="/" className="hover:text-blue-700 transition-colors">Trang chủ</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/news" className="hover:text-blue-700 transition-colors">Tin tức</Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-800 font-semibold line-clamp-1">{post.title}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Cột trái: Nội dung bài viết */}
          <main className="lg:col-span-8 bg-white p-6 sm:p-10 rounded-3xl border border-slate-200 shadow-sm">
            <div className="mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-blue-50 text-blue-800 border border-blue-200/80">
                {post.category}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight leading-tight">
              {post.title}
            </h1>

            {/* Thông tin metadata bài viết */}
            <div className="flex flex-wrap items-center gap-4 py-4 my-4 border-y border-slate-100 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Tác giả: {post.author?.fullName || "Ban Biên Tập Logistics GT"}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>Ngày đăng: {dateStr}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5 text-slate-400" />
                <span>{post.viewCount} lượt xem</span>
              </div>
            </div>

            {/* Đoạn tóm tắt nổi bật */}
            <div className="p-5 rounded-2xl bg-blue-50/50 border-l-4 border-blue-600 text-sm text-slate-700 font-medium italic mb-8">
              {post.excerpt}
            </div>

            {/* Ảnh bìa */}
            <div className="relative h-80 sm:h-96 w-full rounded-3xl overflow-hidden mb-8 shadow-md border border-slate-200">
              <Image
                src={post.coverImage}
                alt={post.title}
                fill
                priority
                className="object-cover"
              />
            </div>

            {/* Nội dung bài viết (Sanitized HTML) */}
            <article
              className="prose prose-slate max-w-none text-slate-700 leading-relaxed prose-headings:text-slate-900 prose-headings:font-bold prose-h2:text-2xl prose-h3:text-xl prose-a:text-blue-700 prose-img:rounded-2xl"
              dangerouslySetInnerHTML={{ __html: post.content }}
            />

            {/* Chia sẻ bài viết */}
            <div className="mt-12 pt-6 border-t border-slate-100 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5">
                <Share2 className="w-4 h-4 text-slate-400" />
                Chia sẻ bài viết này
              </span>
              <div className="flex gap-2">
                <a
                  href={`https://zalo.me/share`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 bg-blue-600 text-white rounded-xl text-xs font-bold hover:bg-blue-700 transition-colors shadow-sm"
                >
                  Zalo
                </a>
                <a
                  href={`https://www.facebook.com/sharer/sharer.php`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 bg-slate-800 text-white rounded-xl text-xs font-bold hover:bg-slate-900 transition-colors shadow-sm"
                >
                  Facebook
                </a>
              </div>
            </div>
          </main>

          {/* Cột phải: Sidebar bài viết liên quan */}
          <aside className="lg:col-span-4 space-y-6">
            {/* Tin mới nhất */}
            <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm">
              <h3 className="font-bold text-base text-slate-900 mb-4 pb-2 border-b border-slate-100">
                Bài Viết Mới Nhất
              </h3>
              <div className="space-y-4">
                {recentPosts
                  .filter((p) => p.slug !== post.slug)
                  .slice(0, 4)
                  .map((p) => (
                    <Link
                      key={p.slug}
                      href={`/news/${p.slug}`}
                      className="group flex gap-3 items-start"
                    >
                      <div className="relative w-20 h-16 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200/80">
                        <Image
                          src={p.coverImage}
                          alt={p.title}
                          fill
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div>
                        <h4 className="text-xs font-bold text-slate-800 group-hover:text-blue-700 line-clamp-2 transition-colors">
                          {p.title}
                        </h4>
                        <span className="text-[11px] text-slate-400 mt-1 block">
                          {new Date(p.publishedAt).toLocaleDateString("vi-VN")}
                        </span>
                      </div>
                    </Link>
                  ))}
              </div>
            </div>

            {/* Hotline liên hệ nhanh */}
            <div className="bg-gradient-to-br from-slate-950 via-slate-900 to-blue-950 text-white p-6 sm:p-8 rounded-3xl shadow-xl text-center space-y-3 border border-slate-800">
              <Phone className="w-8 h-8 mx-auto text-sky-400" />
              <h4 className="font-bold text-base text-white">Bạn Cần Hỗ Trợ Pháp Lý Hải Quan?</h4>
              <p className="text-xs text-slate-300">
                Đội ngũ chuyên viên Logistics GT trực tại Bắc Luân 2 sẵn sàng tư vấn miễn phí quy trình và mã thuế:
              </p>
              <a
                href={`tel:${cleanPhone}`}
                className="block text-xl font-black text-sky-400 hover:text-sky-300 hover:underline"
              >
                {settings.hotline}
              </a>
              <Link href="/quote" className="block pt-2">
                <Button variant="accent" size="sm" className="w-full font-bold shadow-md shadow-blue-600/20">
                  Gửi Yêu Cầu Báo Giá
                </Button>
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
