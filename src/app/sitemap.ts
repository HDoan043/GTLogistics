import { MetadataRoute } from "next";
import { prisma } from "@/lib/db";

export const revalidate = 3600; // Cập nhật sitemap mỗi 1 giờ

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "http://160.191.46.105";

  // Các tuyến đường tĩnh cốt lõi
  const staticRoutes: MetadataRoute.Sitemap = [
    {
      url: `${baseUrl}`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/services`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/quote`,
      lastModified: new Date(),
      changeFrequency: "weekly",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/news`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/contact`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
  ];

  // 4 dịch vụ chiến lược cố định
  const defaultServices = [
    "customs-clearance",
    "cross-border-trucking",
    "multimodal-transport",
    "warehousing",
  ];

  const serviceRoutes: MetadataRoute.Sitemap = defaultServices.map((slug) => ({
    url: `${baseUrl}/services/${slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.85,
  }));

  // Truy vấn thêm các bài viết tin tức đã xuất bản
  let newsRoutes: MetadataRoute.Sitemap = [];
  try {
    const posts = await prisma.post.findMany({
      where: { isPublished: true },
      select: { slug: true, updatedAt: true },
      take: 100,
    });

    newsRoutes = posts.map((post) => ({
      url: `${baseUrl}/news/${post.slug}`,
      lastModified: post.updatedAt,
      changeFrequency: "weekly" as const,
      priority: 0.7,
    }));
  } catch (err) {
    console.error("Lỗi tạo sitemap tin tức:", err);
  }

  return [...staticRoutes, ...serviceRoutes, ...newsRoutes];
}
