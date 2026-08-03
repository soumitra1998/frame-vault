import { SiteHeader } from "@/components/header";
import { SiteFooter } from "@/components/footer";
import { AboutHeroSection } from "@/components/about-hero-section";
import { AboutStorySection } from "@/components/about-story-section";
import { AboutValuesSection } from "@/components/about-values-section";
import { CtaSection } from "@/components/cta-section";

export default function About() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 pt-20">
        <AboutHeroSection />
        <AboutStorySection />
        <AboutValuesSection />
        <CtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
