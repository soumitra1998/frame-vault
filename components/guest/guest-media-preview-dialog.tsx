"use client";

import { Camera, ChevronLeft, ChevronRight } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { GuestDownloadButton } from "@/components/guest/guest-download-button";
import { formatBytes, formatRelativeDate } from "@/lib/dashboard/utils";
import type { MediaAssetResponseDTO } from "@/lib/api/types";

export function GuestMediaPreviewDialog({
  token,
  eventSlug,
  folderSlug,
  allowDownload,
  asset,
  open,
  onOpenChange,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: {
  token: string;
  eventSlug: string;
  folderSlug: string;
  allowDownload: boolean;
  asset: MediaAssetResponseDTO | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="grid-rows-[auto_1fr] gap-0 overflow-hidden p-0 sm:max-w-4xl"
      >
        {open && asset ? (
          <>
            <DialogTitle className="sr-only">{asset.originalFilename}</DialogTitle>
            <DialogDescription className="sr-only">
              Preview of {asset.originalFilename}
            </DialogDescription>

            <div className="relative flex max-h-[75vh] items-center justify-center bg-black">
              {asset.previewUrl ? (
                asset.mediaType === "VIDEO" ? (
                  <video
                    key={asset.frmvmdaPk}
                    src={asset.previewUrl}
                    controls
                    autoPlay
                    className="max-h-[75vh] w-full object-contain"
                  />
                ) : (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={asset.previewUrl}
                    alt={asset.originalFilename}
                    className="max-h-[75vh] w-full object-contain"
                  />
                )
              ) : (
                <div className="flex h-64 w-full items-center justify-center text-muted-foreground/40">
                  <Camera className="size-10" strokeWidth={1.5} />
                </div>
              )}

              {hasPrev ? (
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-1/2 left-3 -translate-y-1/2 bg-background/80"
                  aria-label="Previous"
                  onClick={onPrev}
                >
                  <ChevronLeft />
                </Button>
              ) : null}
              {hasNext ? (
                <Button
                  variant="outline"
                  size="icon"
                  className="absolute top-1/2 right-3 -translate-y-1/2 bg-background/80"
                  aria-label="Next"
                  onClick={onNext}
                >
                  <ChevronRight />
                </Button>
              ) : null}
            </div>

            <div className="flex flex-wrap items-center justify-between gap-3 p-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{asset.originalFilename}</p>
                <p className="text-xs text-muted-foreground">
                  {formatBytes(asset.fileSizeBytes)} · {formatRelativeDate(asset.uploadedAt)}
                </p>
              </div>

              {allowDownload ? (
                <GuestDownloadButton
                  token={token}
                  eventSlug={eventSlug}
                  folderSlug={folderSlug}
                  asset={asset}
                />
              ) : null}
            </div>
          </>
        ) : null}
      </DialogContent>
    </Dialog>
  );
}
