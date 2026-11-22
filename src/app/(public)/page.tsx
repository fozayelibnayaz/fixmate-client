import { Hero } from "@/components/home/hero";
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
