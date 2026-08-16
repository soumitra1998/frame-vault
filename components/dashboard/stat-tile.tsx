import type { LucideIcon } from "lucide-react";

import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

export function StatTile({
  icon: Icon,
  label,
  value,
  className,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  className?: string;
}) {
  return (
    <Card className={cn("flex-row items-center gap-3 p-4", className)}>
      <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
        <Icon className="size-4" />
      </div>
      <div className="min-w-0">
        <p className="truncate text-lg font-medium font-heading">{value}</p>
        <p className="truncate text-xs text-muted-foreground uppercase tracking-[0.08em]">
          {label}
        </p>
      </div>
    </Card>
  );
}
