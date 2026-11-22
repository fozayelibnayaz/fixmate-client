import { Hero } from "@/components/home/hero";
import {
  AgentSection,
  ApiSection,
  CmsSection,
  CodeSection,
  FinalCta,
  MarketplaceSection,
  Marquee,
  PlatformBento,
  ScrollEffects,
  ShowcaseSection,
  StoriesSection,
} from "@/components/home/sections";

export default function HomePage() {
  return (
    <>
      <ScrollEffects />
      <Hero />
      <Marquee />
      <AgentSection />
      <CmsSection />
      <CodeSection />
      <ApiSection />
      <PlatformBento />
      <ShowcaseSection />
      <StoriesSection />
      <MarketplaceSection />
      <FinalCta />
    </>
  );
}
