// components/about-hero-section.tsx
import { Badge } from "@/components/ui/badge";

export function AboutHeroSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 text-center sm:py-28">
      <Badge variant="outline" className="mx-auto">
        About FrameVault
      </Badge>
      <h1 className="mx-auto mt-6 max-w-2xl text-4xl font-medium leading-tight sm:text-5xl">
        A private home for every gallery you shoot
      </h1>
      <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
        FrameVault exists so photographers can spend less time managing
        drives, links, and file transfers — and more time behind the camera.
      </p>
    </section>
  );
}
