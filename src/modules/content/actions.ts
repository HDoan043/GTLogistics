"use server";

import { prisma } from "@/lib/db";
import { revalidatePath } from "next/cache";
import {
  DEFAULT_HOME_HERO,
  DEFAULT_HOME_WHY_US,
  DEFAULT_HOME_STATS,
  DEFAULT_ABOUT_CONTENT,
  DEFAULT_BANNERS_CONTENT,
  DEFAULT_HOME_SERVICES,
  DEFAULT_BORDER_GATES,
  DEFAULT_CONTACT_CONTENT,
} from "./constants";

// Hàm lấy nội dung một section (kèm fallback mặc định)
export async function getPageSectionContent<T>(key: string, defaultValue: T): Promise<T> {
  try {
    const setting = await prisma.siteSetting.findUnique({
      where: { key },
    });
    if (!setting?.value) {
      return defaultValue;
    }
    return JSON.parse(setting.value) as T;
  } catch (err) {
    console.error(`Lỗi đọc section ${key}:`, err);
    return defaultValue;
  }
}

// Hàm lưu nội dung một section
export async function savePageSectionContent<T>(
  key: string,
  content: T,
  description?: string
): Promise<{ success: boolean; message: string }> {
  try {
    const jsonString = JSON.stringify(content);
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value: jsonString, description: description || `Cấu hình ${key}` },
      create: { key, value: jsonString, description: description || `Cấu hình ${key}` },
    });

    revalidatePath("/", "layout");
    revalidatePath("/about");
    revalidatePath("/services");
    revalidatePath("/tracking");
    revalidatePath("/news");
    revalidatePath("/contact");
    revalidatePath("/quote");

    return { success: true, message: "Đã lưu thay đổi nội dung thành công!" };
  } catch (err) {
    console.error(`Lỗi lưu section ${key}:`, err);
    return {
      success: false,
      message: "Không thể lưu nội dung: " + (err instanceof Error ? err.message : String(err)),
    };
  }
}

// Lấy toàn bộ dữ liệu nội dung phục vụ trang Admin
export async function getAllPageContents() {
  const [
    hero,
    whyUs,
    stats,
    about,
    banners,
    homeServices,
    borderGates,
    contact,
  ] = await Promise.all([
    getPageSectionContent("content_home_hero", DEFAULT_HOME_HERO),
    getPageSectionContent("content_home_why_us", DEFAULT_HOME_WHY_US),
    getPageSectionContent("content_home_stats", DEFAULT_HOME_STATS),
    getPageSectionContent("content_about", DEFAULT_ABOUT_CONTENT),
    getPageSectionContent("content_banners", DEFAULT_BANNERS_CONTENT),
    getPageSectionContent("content_home_services", DEFAULT_HOME_SERVICES),
    getPageSectionContent("content_border_gates", DEFAULT_BORDER_GATES),
    getPageSectionContent("content_contact", DEFAULT_CONTACT_CONTENT),
  ]);

  return { hero, whyUs, stats, about, banners, homeServices, borderGates, contact };
}
