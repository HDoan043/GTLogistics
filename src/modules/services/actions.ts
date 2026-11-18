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
      titleEn: s.titleEn,
      titleZh: s.titleZh,
      slug: s.slug,
      shortDesc: s.shortDesc,
      shortDescEn: s.shortDescEn,
      shortDescZh: s.shortDescZh,
      fullContent: `<p>${s.shortDesc}</p>`,
      fullContentEn: `<p>${s.shortDescEn}</p>`,
      fullContentZh: `<p>${s.shortDescZh}</p>`,
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
        titleEn: fallback.titleEn,
        titleZh: fallback.titleZh,
        slug: fallback.slug,
        shortDesc: fallback.shortDesc,
        shortDescEn: fallback.shortDescEn,
        shortDescZh: fallback.shortDescZh,
        fullContent: `<p>${fallback.shortDesc}</p>`,
        fullContentEn: `<p>${fallback.shortDescEn}</p>`,
        fullContentZh: `<p>${fallback.shortDescZh}</p>`,
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

export async function updateServiceContent(
  slug: string,
  data: {
    title?: string;
    titleEn?: string;
    titleZh?: string;
    shortDesc?: string;
    shortDescEn?: string;
    shortDescZh?: string;
    bannerImage?: string;
    fullContent?: string;
    fullContentEn?: string;
    fullContentZh?: string;
  }
) {
  try {
    const { revalidatePath } = await import("next/cache");
    const updated = await prisma.service.update({
      where: { slug },
      data,
    });
    revalidatePath("/", "layout");
    revalidatePath("/services");
    revalidatePath(`/services/${slug}`);
    return { success: true, message: "Đã cập nhật dịch vụ thành công!", service: updated };
  } catch (error) {
    console.error("Lỗi cập nhật dịch vụ:", error);
    return {
      success: false,
      message: "Lỗi khi lưu dịch vụ: " + (error instanceof Error ? error.message : String(error)),
    };
  }
}
