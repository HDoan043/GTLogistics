import { HeroSection } from "@/components/home/HeroSection";
import { StatsCounter } from "@/components/home/StatsCounter";
import { ServicesSection } from "@/components/home/ServicesSection";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { RecentNewsSection } from "@/components/home/RecentNewsSection";
import { QuoteCtaSection } from "@/components/home/QuoteCtaSection";
import { getServices } from "@/modules/services/actions";
import { getPosts } from "@/modules/posts/actions";
import { getSiteSettings } from "@/modules/settings/actions";

export const revalidate = 60; // ISR cache 60s cho trang chủ để chịu tải cực tốt

export default async function HomePage() {
  const [services, posts, settings] = await Promise.all([
    getServices(),
    getPosts({ limit: 3 }),
    getSiteSettings(),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection hotline={settings.hotline} />
      <StatsCounter />
      <ServicesSection services={services} />
      <WhyChooseUs />
      <RecentNewsSection posts={posts} />
      <QuoteCtaSection hotline={settings.hotline} />
    </div>
  );
}
