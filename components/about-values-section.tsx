// components/about-values-section.tsx
import { ShieldCheck, Zap, Lock, Users } from "lucide-react";

import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";

const VALUES = [
  {
    icon: ShieldCheck,
    title: "Reliability first",
    description:
      "Your galleries are backed up and available whenever a client clicks the link — no downtime, no lost photos.",
  },
  {
    icon: Zap,
    title: "Built for speed",
    description:
      "Uploads, previews, and shares are optimized to feel instant, even for full-resolution event galleries.",
  },
  {
    icon: Lock,
    title: "Private by default",
    description:
      "Every gallery is only visible to the people you invite. You decide who sees what, and for how long.",
  },
  {
    icon: Users,
    title: "Made for teams",
    description:
      "Bring in second shooters, editors, and clients to the same vault and collaborate without email chains.",
  },
];

export function AboutValuesSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-3xl font-medium sm:text-4xl">What we care about</h2>
        <p className="mt-4 text-muted-foreground">
          The principles that shape every feature we ship.
        </p>
      </div>

      <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {VALUES.map(({ icon: Icon, title, description }) => (
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
