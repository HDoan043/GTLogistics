"use server";

import { prisma } from "@/lib/db";
import { DEFAULT_COMPANY_INFO } from "@/lib/constants";
import { revalidatePath } from "next/cache";

export async function getSiteSettings(): Promise<Record<string, string>> {
  try {
    const settings = await prisma.siteSetting.findMany();
    const result: Record<string, string> = { ...DEFAULT_COMPANY_INFO };

    for (const s of settings) {
      result[s.key] = s.value;
    }
    return result;
  } catch (err) {
    console.error("Lỗi khi tải SiteSettings:", err);
    return { ...DEFAULT_COMPANY_INFO };
  }
}

export async function updateSiteSettings(
  formData: FormData
): Promise<{ success: boolean; message: string }> {
  try {
    const entries = Array.from(formData.entries());

    for (const [key, value] of entries) {
      if (typeof value === "string" && !key.startsWith("$ACTION_")) {
        await prisma.siteSetting.upsert({
          where: { key },
          update: { value },
          create: { key, value },
        });
      }
    }

    revalidatePath("/", "layout");
    return { success: true, message: "Cập nhật cấu hình website thành công!" };
  } catch (err) {
    console.error("Lỗi khi lưu cấu hình:", err);
    return { success: false, message: "Không thể lưu cấu hình. Vui lòng thử lại." };
  }
}
