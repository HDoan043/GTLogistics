import { HeroSection } from "@/components/home/HeroSection";
import { TrustedPartners } from "@/components/home/TrustedPartners";
import { ServicesSection } from "@/components/home/ServicesSection";
import { WhyChooseUs } from "@/components/home/WhyChooseUs";
import { QuoteCtaSection } from "@/components/home/QuoteCtaSection";
import { getServices } from "@/modules/services/actions";
import { getSiteSettings } from "@/modules/settings/actions";

export const revalidate = 60; // ISR cache 60s cho trang chủ để chịu tải cực tốt

export default async function HomePage() {
  const [services, settings] = await Promise.all([
    getServices(),
    getSiteSettings(),
  ]);

  return (
    <div className="flex flex-col min-h-screen">
      <HeroSection hotline={settings.hotline} />
      <TrustedPartners />
      <ServicesSection services={services} />
      <WhyChooseUs />
      <QuoteCtaSection hotline={settings.hotline} />
    </div>
  );
}
