import { Dictionary, Locale } from "./types";
import { viDictionary } from "./dictionaries/vi";
import { enDictionary } from "./dictionaries/en";
import { zhDictionary } from "./dictionaries/zh";

export * from "./types";

export const dictionaries: Record<Locale, Dictionary> = {
  vi: viDictionary,
  en: enDictionary,
  zh: zhDictionary,
};

export function getDictionary(locale: Locale = "vi"): Dictionary {
  return dictionaries[locale] || viDictionary;
}

export function getLocalizedPost(
  post: {
    title: string;
    titleEn?: string | null;
    titleZh?: string | null;
    excerpt: string;
    excerptEn?: string | null;
    excerptZh?: string | null;
    content: string;
    contentEn?: string | null;
    contentZh?: string | null;
    [key: string]: unknown;
  },
  locale: Locale = "vi"
) {
  if (locale === "zh") {
    return {
      ...post,
      title: post.titleZh || post.title,
      excerpt: post.excerptZh || post.excerpt,
      content: post.contentZh || post.content,
    };
  }
  if (locale === "en") {
    return {
      ...post,
      title: post.titleEn || post.title,
      excerpt: post.excerptEn || post.excerpt,
      content: post.contentEn || post.content,
    };
  }
  return post;
}

export function getLocalizedService(
  service: {
    title: string;
    titleEn?: string | null;
    titleZh?: string | null;
    shortDesc: string;
    shortDescEn?: string | null;
    shortDescZh?: string | null;
    fullContent: string;
    fullContentEn?: string | null;
    fullContentZh?: string | null;
    [key: string]: unknown;
  },
  locale: Locale = "vi"
) {
  if (locale === "zh") {
    return {
      ...service,
      title: service.titleZh || service.title,
      shortDesc: service.shortDescZh || service.shortDesc,
      fullContent: service.fullContentZh || service.fullContent,
    };
  }
  if (locale === "en") {
    return {
      ...service,
      title: service.titleEn || service.title,
      shortDesc: service.shortDescEn || service.shortDesc,
      fullContent: service.fullContentEn || service.fullContent,
    };
  }
  return service;
}
