// components/hero-section.tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function HeroSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-20 text-center sm:py-28">
      <Badge variant="outline" className="mx-auto">
        Private event galleries
      </Badge>
      <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-medium leading-tight sm:text-5xl md:text-6xl">
        Every memory, kept safe and shared in an instant
      </h1>
      <p className="mx-auto mt-6 max-w-xl text-base text-muted-foreground sm:text-lg">
        FrameVault gives photographers and their clients one fast, reliable
        place to store, share, and collaborate on event photos — with 2GB of
        free storage to get started.
      </p>
      <div className="mt-10 flex flex-col items-center justify-center gap-3 sm:flex-row">
        <Button
          size="lg"
          className="rounded-full px-6"
          render={<Link href="/signup" />}
          nativeButton={false}
        >
          Sign up free
          <ArrowRight className="ml-1" data-icon="inline-end" />
        </Button>
        <Button
          size="lg"
          variant="outline"
          className="rounded-full px-6"
          render={<Link href="/how-to-use" />}
          nativeButton={false}
        >
          See how it works
        </Button>
      </div>
    </section>
  );
}
