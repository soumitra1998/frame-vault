// components/storage-section.tsx
import Link from "next/link";
import { ArrowRight, CloudUpload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import {
  Progress,
  ProgressTrack,
  ProgressIndicator,
} from "@/components/ui/progress";

export function StorageSection() {
  return (
    <section className="mx-auto max-w-7xl px-6 py-16 sm:py-20">
      <Card className="grid grid-cols-1 gap-8 border border-border p-8 sm:p-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <div>
          <Badge variant="secondary" className="gap-1">
            <CloudUpload data-icon="inline-start" />
            2GB free storage
          </Badge>
          <h2 className="mt-4 text-3xl font-medium sm:text-4xl">
            Start preserving memories today, on us
          </h2>
          <p className="mt-4 text-muted-foreground">
            Every account starts with 2GB of free storage — plenty of room
            for a full event gallery. Upgrade any time as your library grows.
          </p>
          <Button
            className="mt-8 rounded-full px-6"
            render={<Link href="/signup" />}
            nativeButton={false}
          >
            Sign up free
            <ArrowRight className="ml-1" data-icon="inline-end" />
          </Button>
        </div>

        <div className="rounded-xl bg-muted/50 p-6">
          <Progress value={18} className="flex-col items-stretch gap-2">
            <div className="flex items-center justify-between text-sm">
              <span className="font-medium">Free plan</span>
              <span className="text-muted-foreground">360MB of 2GB used</span>
            </div>
            <ProgressTrack>
              <ProgressIndicator />
            </ProgressTrack>
          </Progress>
          <p className="mt-4 text-sm text-muted-foreground">
            Plenty of headroom for a whole season of galleries before you need
            to upgrade.
          </p>
        </div>
      </Card>
    </section>
  );
}
