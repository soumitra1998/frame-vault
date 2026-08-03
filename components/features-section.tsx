// components/features-section.tsx
import { Zap, Share2, Users, ImagePlus } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const FEATURES = [
  {
    icon: Zap,
    title: "Fast & reliable storage",
    description:
      "Every photo lands in a store built for speed and durability, so your galleries load instantly and never let you down.",
  },
  {
    icon: Share2,
    title: "Easy, fast sharing",
    description:
      "Send a single link and guests are viewing the gallery in seconds. No accounts, no friction, just share and go.",
  },
  {
    icon: Users,
    title: "Fast collaboration",
    description:
      "Invite co-shooters, editors, and clients into the same vault and watch uploads and edits sync in real time.",
  },
  {
    icon: ImagePlus,
    title: "Preserve every memory",
    description:
      "Keep full-resolution photos safe for as long as you need them, backed by storage that scales with your work.",
  },
];

export function FeaturesSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-medium sm:text-4xl">
          Built to move at the speed of your event
        </h2>
        <p className="mt-4 text-muted-foreground">
          From the first upload to the last download, FrameVault keeps every
          memory fast, safe, and easy to reach.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {FEATURES.map(({ icon: Icon, title, description }) => (
          <Card key={title} className="border border-border">
            <CardHeader>
              <div className="flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon className="size-5" />
              </div>
              <CardTitle className="mt-3">{title}</CardTitle>
              <CardDescription className="mt-1">{description}</CardDescription>
            </CardHeader>
          </Card>
        ))}
      </div>
    </section>
  );
}
