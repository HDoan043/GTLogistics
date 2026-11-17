import { cookies } from "next/headers";
import { Locale, getDictionary } from "./index";

export async function getServerLocale(): Promise<Locale> {
  try {
    const cookieStore = await cookies();
    const rawLocale = cookieStore.get("NEXT_LOCALE")?.value;
    if (rawLocale === "en" || rawLocale === "zh") {
      return rawLocale;
    }
  } catch {
    // Trường hợp chạy ngoài request context
  }
  return "vi";
}

export async function getServerDictionary() {
  const locale = await getServerLocale();
  return {
    locale,
    t: getDictionary(locale),
  };
}
