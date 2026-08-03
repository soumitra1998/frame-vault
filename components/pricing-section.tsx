// components/pricing-section.tsx
import Link from "next/link";
import { Check } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

const PLANS = [
  {
    name: "Free",
    price: "₹0",
    storage: "2GB storage",
    description: "Try FrameVault on a single event before you upgrade.",
    features: [
      "2GB free storage",
      "1 active gallery",
      "Shareable gallery link",
      "Standard image quality",
      "Community support",
    ],
    cta: "Sign up free",
    href: "/signup",
    variant: "outline" as const,
    highlighted: false,
  },
  {
    name: "Studio",
    price: "₹1,499",
    storage: "100GB storage",
    description: "For working photographers shooting events every week.",
    features: [
      "100GB storage",
      "Unlimited galleries",
      "Full-resolution downloads",
      "5 collaborator seats",
      "Custom gallery branding",
      "Priority support",
    ],
    cta: "Start Studio",
    href: "/signup?plan=studio",
    variant: "default" as const,
    highlighted: true,
  },
  {
    name: "Pro",
    price: "₹3,999",
    storage: "1TB storage",
    description: "For studios and teams managing many clients at once.",
    features: [
      "1TB storage",
      "Unlimited galleries",
      "Unlimited collaborator seats",
      "Advanced sharing permissions",
      "Custom domain",
      "Dedicated support",
    ],
    cta: "Go Pro",
    href: "/signup?plan=pro",
    variant: "outline" as const,
    highlighted: false,
  },
];

export function PricingSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3 lg:items-stretch">
        {PLANS.map((plan) => (
          <Card
            key={plan.name}
            className={cn(
              "flex flex-col border p-2",
              plan.highlighted
                ? "border-primary ring-1 ring-primary"
                : "border-border"
            )}
          >
            <CardHeader className="gap-2 px-6 pt-6">
              {plan.highlighted && (
                <Badge className="w-fit">Most popular</Badge>
              )}
              <CardTitle className="text-lg">{plan.name}</CardTitle>
              <CardDescription>{plan.description}</CardDescription>
              <div className="mt-2 flex items-baseline gap-1">
                <span className="text-4xl font-medium">{plan.price}</span>
                <span className="text-sm text-muted-foreground">/month</span>
              </div>
              <p className="text-sm font-medium text-muted-foreground">
                {plan.storage}
              </p>
            </CardHeader>

            <CardContent className="flex-1 px-6">
              <ul className="flex flex-col gap-3">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 size-4 shrink-0 text-primary" />
                    <span className="text-muted-foreground">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>

            <CardFooter className="border-none bg-transparent px-6 pb-6">
              <Button
                size="lg"
                variant={plan.variant}
                className="w-full rounded-full"
                render={<Link href={plan.href} />}
                nativeButton={false}
              >
                {plan.cta}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </section>
  );
}
