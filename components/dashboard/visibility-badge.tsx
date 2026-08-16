import { Crown, Globe, Lock, Share2, ShieldCheck, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { EventVisibility, FolderVisibility } from "@/lib/api/types";

const EVENT_VISIBILITY_META: Record<
  EventVisibility,
  { label: string; icon: typeof Lock }
> = {
  PRIVATE: { label: "Private", icon: Lock },
  PUBLIC: { label: "Public", icon: Globe },
};

const FOLDER_VISIBILITY_META: Record<
  FolderVisibility,
  { label: string; icon: typeof Lock }
> = {
  PRIMARY_ONLY: { label: "Only me", icon: Lock },
  CLIENT_ONLY: { label: "Client", icon: ShieldCheck },
  GUEST_ONLY: { label: "Guests", icon: Users },
};

export function EventVisibilityBadge({
  visibility,
  className,
}: {
  visibility: EventVisibility;
  className?: string;
}) {
  const { label, icon: Icon } = EVENT_VISIBILITY_META[visibility];
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1 uppercase tracking-[0.08em] text-muted-foreground",
        className
      )}
    >
      <Icon data-icon="inline-start" className="size-3" />
      {label}
    </Badge>
  );
}

export function EventOwnerBadge({
  isOwner,
  className,
}: {
  isOwner?: string;
  className?: string;
}) {
  const owned = isOwner === "Y";
  const Icon = owned ? Crown : Users;

  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1 uppercase tracking-[0.08em]",
        owned
          ? "border-amber-500/30 bg-amber-500/10 text-amber-600 dark:text-amber-400"
          : "border-sky-500/30 bg-sky-500/10 text-sky-600 dark:text-sky-400",
        className
      )}
    >
      <Icon data-icon="inline-start" className="size-3" />
      {owned ? "Owned" : "Shared"}
    </Badge>
  );
}

export function FolderSharingBadge({ className }: { className?: string }) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1 border-emerald-500/30 bg-emerald-500/10 uppercase tracking-[0.08em] text-emerald-600 dark:text-emerald-400",
        className
      )}
    >
      <Share2 data-icon="inline-start" className="size-3" />
      Sharing enabled
    </Badge>
  );
}

export function FolderVisibilityBadge({
  visibility,
  className,
}: {
  visibility: FolderVisibility;
  className?: string;
}) {
  const { label, icon: Icon } = FOLDER_VISIBILITY_META[visibility];
  return (
    <Badge
      variant="outline"
      className={cn(
        "gap-1 uppercase tracking-[0.08em] text-muted-foreground",
        className
      )}
    >
      <Icon data-icon="inline-start" className="size-3" />
      {label}
    </Badge>
  );
}
