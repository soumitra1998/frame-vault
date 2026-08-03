// components/cta-section.tsx
import Link from "next/link";
import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 sm:py-24">
      <div className="rounded-2xl bg-primary/10 px-6 py-14 text-center sm:px-10">
        <h2 className="text-3xl font-medium sm:text-4xl">
          Your memories deserve a fast, reliable home
        </h2>
        <p className="mx-auto mt-4 max-w-xl text-muted-foreground">
          Join FrameVault and keep every shot safe, shareable, and ready to
          relive — starting with 2GB free.
        </p>
        <Button
          size="lg"
          className="mt-8 rounded-full px-6"
          render={<Link href="/signup" />}
          nativeButton={false}
        >
          Sign up free
          <ArrowRight className="ml-1" data-icon="inline-end" />
        </Button>
      </div>
    </section>
  );
}
