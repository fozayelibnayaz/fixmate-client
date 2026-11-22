import { Hero } from "@/components/home/hero";
import { FeaturedServices } from "@/components/home/featured-services";
import {
  FaqSection,
  FinalCta,
  HowItWorksSection,
  MarketplaceSection,
  Marquee,
  ScrollEffects,
  ShowcaseSection,
  StatusSection,
  StoriesSection,
  TrustSection,
} from "@/components/home/sections";

export default function HomePage() {
  return (
    <>
      <ScrollEffects />
      <Hero />
      <Marquee />
      <FeaturedServices />
      <HowItWorksSection />
      <TrustSection />
      <StatusSection />
      <ShowcaseSection />
      <StoriesSection />
      <MarketplaceSection />
      <FaqSection />
      <FinalCta />
    </>
  );
}
