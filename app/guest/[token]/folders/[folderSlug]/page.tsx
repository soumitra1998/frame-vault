"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { Camera, Link2Off, PlayCircle, RotateCw, ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { GuestTopbar } from "@/components/guest/guest-topbar";
import { GuestDownloadButton } from "@/components/guest/guest-download-button";
import { GuestMediaPreviewDialog } from "@/components/guest/guest-media-preview-dialog";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { useGuestEvent, useGuestFolder, useGuestFolderMedia } from "@/lib/queries/use-guest";

export default function GuestFolderPage() {
  const { token, folderSlug } = useParams<{ token: string; folderSlug: string }>();
  const [previewMediaId, setPreviewMediaId] = React.useState<number | null>(null);

  const { data: event, isLoading: eventLoading, isError: eventError } = useGuestEvent(token);
  const { data: folders } = useGuestFolder(event?.slug ?? "", token);
  const folder = folders?.find((f) => f.slug === folderSlug);
  const {
    data: gallery,
    isLoading: mediaLoading,
    isError: mediaError,
    refetch: refetchMedia,
    isFetching: mediaFetching,
  } = useGuestFolderMedia(event?.slug ?? "", folderSlug, token);

  const media = gallery?.media;
  const previewIndex = media?.findIndex((asset) => asset.frmvmdaPk === previewMediaId) ?? -1;
  const previewAsset = previewIndex >= 0 ? (media?.[previewIndex] ?? null) : null;

  if (eventLoading) {
    return (
      <>
        <GuestTopbar items={[{ label: "FrameVault" }]} />
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">
          <div className="mx-auto flex max-w-6xl flex-col gap-8">
            <Skeleton className="h-9 w-72" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-lg" />
              ))}
            </div>
          </div>
        </main>
      </>
    );
  }

  if (eventError || !event) {
    return (
      <>
        <GuestTopbar items={[{ label: "FrameVault" }]} />
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">
          <div className="mx-auto max-w-6xl">
            <DashboardEmptyState
              icon={Link2Off}
              title="This link isn't available"
              description="It may have been deactivated, deleted, or has expired. Ask the studio for a new guest link."
            />
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <GuestTopbar
        items={[
          { label: event.title, href: `/guest/${token}` },
          { label: folder?.title ?? gallery?.eventTitle ?? folderSlug },
        ]}
      />

      <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-8">
          <div>
            <h1 className="text-2xl font-semibold sm:text-3xl">
              {folder?.title ?? gallery?.eventTitle ?? folderSlug}
            </h1>
            {folder?.description ? (
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                {folder.description}
              </p>
            ) : null}
            {gallery && gallery.watermarkEnabled ? (
              <p className="mt-2 flex items-center gap-1.5 text-xs text-muted-foreground">
                <ShieldAlert className="size-3.5" />
                Downloads from this gallery include a watermark.
              </p>
            ) : null}
          </div>

          {mediaLoading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
              {Array.from({ length: 10 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-lg" />
              ))}
            </div>
          ) : mediaError ? (
            <DashboardEmptyState
              icon={Camera}
              title="Couldn't load media"
              description="Something went wrong loading this gallery. Check your connection and try again."
              action={
                <Button
                  variant="outline"
                  onClick={() => refetchMedia()}
                  disabled={mediaFetching}
                  className="gap-1.5"
                >
                  <RotateCw data-icon="inline-start" className={mediaFetching ? "animate-spin" : ""} />
                  Try again
                </Button>
              }
            />
          ) : !media || media.length === 0 ? (
            <DashboardEmptyState
              icon={Camera}
              title="No media yet"
              description="Photos and videos shared in this folder will show up here."
            />
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
              {media.map((asset) => (
                <div
                  key={asset.frmvmdaPk}
                  role="button"
                  tabIndex={0}
                  onClick={() => setPreviewMediaId(asset.frmvmdaPk)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" || e.key === " ") {
                      e.preventDefault();
                      setPreviewMediaId(asset.frmvmdaPk);
                    }
                  }}
                  className="group relative aspect-square cursor-pointer overflow-hidden rounded-lg bg-muted ring-1 ring-foreground/10"
                >
                  {asset.thumbnailUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={asset.thumbnailUrl}
                      alt={asset.originalFilename}
                      className="size-full object-cover transition-transform group-hover:scale-105"
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center text-muted-foreground/40">
                      <Camera className="size-6" strokeWidth={1.5} />
                    </div>
                  )}
                  {asset.mediaType === "VIDEO" ? (
                    <PlayCircle className="absolute right-1.5 bottom-1.5 size-5 text-white drop-shadow" />
                  ) : null}

                  {gallery?.allowDownload ? (
                    <div
                      className="absolute top-1.5 right-1.5 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 data-open:opacity-100"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <GuestDownloadButton
                        token={token}
                        eventSlug={event.slug}
                        folderSlug={folderSlug}
                        asset={asset}
                        variant="icon"
                        className="bg-background/80"
                      />
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <GuestMediaPreviewDialog
        token={token}
        eventSlug={event.slug}
        folderSlug={folderSlug}
        allowDownload={!!gallery?.allowDownload}
        asset={previewAsset}
        open={previewAsset != null}
        onOpenChange={(open) => {
          if (!open) setPreviewMediaId(null);
        }}
        onPrev={() => {
          const prev = media?.[previewIndex - 1];
          if (prev) setPreviewMediaId(prev.frmvmdaPk);
        }}
        onNext={() => {
          const next = media?.[previewIndex + 1];
          if (next) setPreviewMediaId(next.frmvmdaPk);
        }}
        hasPrev={previewIndex > 0}
        hasNext={!!media && previewIndex >= 0 && previewIndex < media.length - 1}
      />
    </>
  );
}
