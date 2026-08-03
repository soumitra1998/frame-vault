import { SiteHeader } from "@/components/header";
import { SiteFooter } from "@/components/footer";
import { PricingSection } from "@/components/pricing-section";
import { Badge } from "@/components/ui/badge";

export default function Pricing() {
  return (
    <>
      <SiteHeader />
      <main className="flex-1 pt-20">
        <section className="mx-auto max-w-7xl px-6 pt-16 text-center sm:pt-20">
          <Badge variant="outline" className="mx-auto">
            Pricing
          </Badge>
          <h1 className="mx-auto mt-6 max-w-2xl text-4xl font-medium leading-tight sm:text-5xl">
            Plans that grow with your galleries
          </h1>
          <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
            Start free, then upgrade as your storage and collaboration needs
            grow. Cancel anytime.
          </p>
        </section>

        <PricingSection />
      </main>
      <SiteFooter />
    </>
  );
}
