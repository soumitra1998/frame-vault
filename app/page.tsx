import { SiteHeader } from "@/components/header";
import { SiteFooter } from "@/components/footer";
import { HeroSection } from "@/components/hero-section";
import { FeaturesSection } from "@/components/features-section";
import { StorageSection } from "@/components/storage-section";
import { CtaSection } from "@/components/cta-section";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 pt-20">
        <HeroSection />
        <FeaturesSection />
        <StorageSection />
        <CtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
