"use client";

import { Download, FolderInput, MoreVertical, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useMediaDownloadUrl, useRemoveMedia } from "@/lib/queries/use-folder-media";
import { downloadFromUrl } from "@/lib/dashboard/download";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import type { MediaAssetResponseDTO } from "@/lib/api/types";

export function MediaActionsMenu({
  eventSlug,
  folderSlug,
  asset,
  onMove,
  onRemoved,
  triggerClassName,
}: {
  eventSlug: string;
  folderSlug: string;
  asset: MediaAssetResponseDTO;
  onMove: (asset: MediaAssetResponseDTO) => void;
  onRemoved?: (asset: MediaAssetResponseDTO) => void;
  triggerClassName?: string;
}) {
  const removeMedia = useRemoveMedia(eventSlug, folderSlug);
  const downloadUrl = useMediaDownloadUrl(eventSlug, folderSlug);

  const handleDownload = () => {
    downloadUrl.mutate(asset.frmvmdaPk, {
      onSuccess: (url) => downloadFromUrl(url, asset.originalFilename),
      onError: () => {
        toast.add({
          title: "Couldn't download",
          description: "Something went wrong. Please try again.",
          type: "error",
        });
      },
    });
  };

  const handleRemove = () => {
    removeMedia.mutate(asset.frmvmdaPk, {
      onSuccess: () => {
        onRemoved?.(asset);
        toast.add({
          title: "Moved to bin",
          description: `"${asset.originalFilename}" was moved to the bin.`,
          type: "success",
        });
      },
      onError: () => {
        toast.add({
          title: "Couldn't remove media",
          description: "Something went wrong. Please try again.",
          type: "error",
        });
      },
    });
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            size="icon-sm"
            className={cn("bg-background/80", triggerClassName)}
            aria-label="Media actions"
          >
            <MoreVertical />
          </Button>
        }
      />
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleDownload} disabled={downloadUrl.isPending}>
          <Download />
          Download
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => onMove(asset)}>
          <FolderInput />
          Move to folder…
        </DropdownMenuItem>
        <DropdownMenuItem
          variant="destructive"
          onClick={handleRemove}
          disabled={removeMedia.isPending}
        >
          <Trash2 />
          Remove
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
