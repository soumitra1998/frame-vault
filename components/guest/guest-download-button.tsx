"use client";

import { Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Spinner } from "@/components/ui/spinner";
import { useGuestMediaDownloadUrl } from "@/lib/queries/use-guest";
import { downloadFromUrl } from "@/lib/dashboard/download";
import { toast } from "@/components/ui/toast";
import type { MediaAssetResponseDTO } from "@/lib/api/types";

/** Download control for one guest-visible media asset. Resolves a fresh presigned URL from the backend on each click, then triggers the browser download. */
export function GuestDownloadButton({
  token,
  eventSlug,
  folderSlug,
  asset,
  variant = "full",
  className,
}: {
  token: string;
  eventSlug: string;
  folderSlug: string;
  asset: MediaAssetResponseDTO;
  variant?: "full" | "icon";
  className?: string;
}) {
  const downloadUrl = useGuestMediaDownloadUrl(token, eventSlug, folderSlug);

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

  if (variant === "icon") {
    return (
      <Button
        type="button"
        variant="outline"
        size="icon-sm"
        className={className}
        aria-label={`Download ${asset.originalFilename}`}
        onClick={handleDownload}
        disabled={downloadUrl.isPending}
      >
        {downloadUrl.isPending ? <Spinner /> : <Download />}
      </Button>
    );
  }

  return (
    <Button
      type="button"
      variant="outline"
      className={className}
      onClick={handleDownload}
      disabled={downloadUrl.isPending}
    >
      {downloadUrl.isPending ? <Spinner data-icon="inline-start" /> : <Download data-icon="inline-start" />}
      Download
    </Button>
  );
}
