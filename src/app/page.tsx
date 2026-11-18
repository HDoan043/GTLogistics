import { HeroSection } from "@/components/home/HeroSection";
import { TrustedPartners } from "@/components/home/TrustedPartners";
import { ServicesSection } from "@/components/home/ServicesSection";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { QuoteCtaSection } from "@/components/home/QuoteCtaSection";
import { getServices } from "@/modules/services/actions";
import { getSiteSettings } from "@/modules/settings/actions";
import { getPageSectionContent } from "@/modules/content/actions";
import {
  DEFAULT_HOME_HERO,
  DEFAULT_HOME_WHY_US,
  DEFAULT_HOME_SERVICES,
} from "@/modules/content/constants";

export const revalidate = 60; // ISR cache 60s cho trang chủ để chịu tải cực tốt

export default async function HomePage() {
  const [services, settings, heroContent, whyUsContent, homeServicesContent] = await Promise.all([
    getServices(),
    getSiteSettings(),
    getPageSectionContent("content_home_hero", DEFAULT_HOME_HERO),
    getPageSectionContent("content_home_why_us", DEFAULT_HOME_WHY_US),
    getPageSectionContent("content_home_services", DEFAULT_HOME_SERVICES),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection hotline={settings.hotline} heroData={heroContent} />
      <TrustedPartners />
      <ServicesSection services={services} homeServicesData={homeServicesContent} />
      <WhyChooseUs whyUsData={whyUsContent} />
      <QuoteCtaSection hotline={settings.hotline} />
    </div>
  );
}
