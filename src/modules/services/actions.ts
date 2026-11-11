"use server";

import { prisma } from "@/lib/db";
import { SERVICE_CATEGORIES } from "@/lib/constants";

export async function getServices() {
  try {
    const services = await prisma.service.findMany({
      orderBy: { sortOrder: "asc" },
    });

    if (services.length > 0) return services;
    return SERVICE_CATEGORIES.map((s, idx) => ({
      id: `svc_${idx}`,
      title: s.title,
      slug: s.slug,
      shortDesc: s.shortDesc,
      fullContent: `<p>${s.shortDesc}</p>`,
      iconName: s.iconName,
      bannerImage: s.bannerImage,
      sortOrder: idx + 1,
      isFeatured: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    }));
  } catch (error) {
    console.error("Lỗi lấy danh sách dịch vụ:", error);
    return [];
  }
}

export async function getServiceBySlug(slug: string) {
  try {
    const service = await prisma.service.findUnique({
      where: { slug },
    });
    if (service) return service;

    // Fallback to static
    const fallback = SERVICE_CATEGORIES.find((s) => s.slug === slug);
    if (fallback) {
      return {
        id: "svc_fallback",
        title: fallback.title,
        slug: fallback.slug,
        shortDesc: fallback.shortDesc,
        fullContent: `<p>${fallback.shortDesc}</p>`,
        iconName: fallback.iconName,
        bannerImage: fallback.bannerImage,
        sortOrder: 1,
        isFeatured: true,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    }
    return null;
  } catch (error) {
    console.error("Lỗi lấy chi tiết dịch vụ:", error);
    return null;
  }
}
