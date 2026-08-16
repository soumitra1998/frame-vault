import Link from "next/link";
import { Camera, Clapperboard, FolderClosed, HardDrive } from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatBytes } from "@/lib/dashboard/utils";
import type { FolderResponseDTO } from "@/lib/api/types";

export function GuestFolderCard({
  token,
  folder,
}: {
  token: string;
  folder: FolderResponseDTO;
}) {
  return (
    <Card className="relative h-full transition-colors hover:ring-primary/40">
      <Link
        href={`/guest/${token}/folders/${folder.slug}`}
        className="absolute inset-0 z-0 rounded-xl"
        aria-label={folder.title}
      />

      <div className="flex aspect-video items-center justify-center overflow-hidden bg-linear-to-br from-muted to-card">
        <FolderClosed className="size-8 text-muted-foreground/40" strokeWidth={1.5} />
      </div>

      <CardHeader>
        <CardTitle className="truncate">{folder.title}</CardTitle>
        {folder.description ? (
          <p className="line-clamp-2 text-sm text-muted-foreground">{folder.description}</p>
        ) : null}
      </CardHeader>

      <CardContent className="flex items-center gap-3 text-xs text-muted-foreground">
        <span className="flex items-center gap-1">
          <Camera className="size-3.5" /> {folder.totalPhotos}
        </span>
        <span className="flex items-center gap-1">
          <Clapperboard className="size-3.5" /> {folder.totalVideos}
        </span>
        <span className="flex items-center gap-1">
          <HardDrive className="size-3.5" /> {formatBytes(folder.totalSizeBytes)}
        </span>
      </CardContent>
    </Card>
  );
}
