"use client";

import * as React from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Camera,
  Clapperboard,
  FolderClosed,
  HardDrive,
  PlayCircle,
  RotateCw,
  Trash2,
  Upload,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { StatTile } from "@/components/dashboard/stat-tile";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import {
  FolderSharingBadge,
  FolderVisibilityBadge,
} from "@/components/dashboard/visibility-badge";
import { UploadMediaDialog } from "@/components/dashboard/upload-media-dialog";
import { MediaActionsMenu } from "@/components/dashboard/media-actions-menu";
import { MediaPreviewDialog } from "@/components/dashboard/media-preview-dialog";
import { MoveMediaDialog } from "@/components/dashboard/move-media-dialog";
import {
  useEvent,
  useGuestLink,
  useGuestLinkFolderIds,
} from "@/lib/queries/use-events";
import { useFolder } from "@/lib/queries/use-folders";
import { useFolderMedia } from "@/lib/queries/use-folder-media";
import { formatBytes } from "@/lib/dashboard/utils";
import type { MediaAssetResponseDTO } from "@/lib/api/types";

export default function FolderDetailPage() {
  const params = useParams<{ eventSlug: string; folderSlug: string }>();
  const [uploadOpen, setUploadOpen] = React.useState(false);
  const [previewMediaId, setPreviewMediaId] = React.useState<number | null>(null);
  const [moveTarget, setMoveTarget] = React.useState<MediaAssetResponseDTO | null>(null);
  const { data: event } = useEvent(params.eventSlug);
  const {
    data: folder,
    isLoading: folderLoading,
    isError: folderError,
    refetch: refetchFolder,
  } = useFolder(params.eventSlug, params.folderSlug);
  const { data: guestLink } = useGuestLink(params.eventSlug);
  const { data: sharedFolderIds } = useGuestLinkFolderIds(params.eventSlug);
  const isShared =
    !!folder && !!guestLink?.isActive && !!sharedFolderIds?.includes(folder.frmvfldPk);
  const {
    data: media,
    isLoading: mediaLoading,
    isError: mediaError,
    refetch: refetchMedia,
    isFetching: mediaFetching,
  } = useFolderMedia(params.eventSlug, params.folderSlug);

  const previewIndex =
    media?.findIndex((asset) => asset.frmvmdaPk === previewMediaId) ?? -1;
  const previewAsset = previewIndex >= 0 ? (media?.[previewIndex] ?? null) : null;

  if (folderLoading) {
    return (
      <>
        <DashboardTopbar items={[{ label: "My events", href: "/dashboard" }]} />
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">
          <div className="mx-auto flex max-w-6xl flex-col gap-8">
            <Skeleton className="h-9 w-72" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-15 rounded-xl" />
              ))}
            </div>
          </div>
        </main>
      </>
    );
  }

  if (folderError || !folder) {
    return (
      <>
        <DashboardTopbar
          items={[{ label: "My events", href: "/dashboard" }, { label: "Not found" }]}
        />
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">
          <div className="mx-auto max-w-6xl">
            <DashboardEmptyState
              icon={FolderClosed}
              title={folderError ? "Couldn't load this folder" : "Folder not found"}
              description={
                folderError
                  ? "Something went wrong reaching the FrameVault API. Check your connection and try again."
                  : "This folder doesn't exist or may have been removed."
              }
              action={
                folderError ? (
                  <Button variant="outline" onClick={() => refetchFolder()} className="gap-1.5">
                    <RotateCw data-icon="inline-start" />
                    Try again
                  </Button>
                ) : (
                  <Button render={<Link href="/dashboard" />} nativeButton={false}>
                    Back to my events
                  </Button>
                )
              }
            />
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <DashboardTopbar
        items={[
          { label: "My events", href: "/dashboard" },
          {
            label: event?.title ?? params.eventSlug,
            href: `/dashboard/events/${params.eventSlug}`,
          },
          { label: folder.title },
        ]}
      />

      <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl font-semibold sm:text-3xl">
                  {folder.title}
                </h1>
                <FolderVisibilityBadge visibility={folder.visibility} />
                {isShared ? <FolderSharingBadge /> : null}
              </div>
              {folder.description ? (
                <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                  {folder.description}
                </p>
              ) : null}
            </div>

            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                className="gap-1.5"
                nativeButton={false}
                render={
                  <Link
                    href={`/dashboard/events/${params.eventSlug}/folders/${params.folderSlug}/trash`}
                  />
                }
              >
                <Trash2 data-icon="inline-start" />
                Bin
              </Button>
              <Button className="gap-1.5" onClick={() => setUploadOpen(true)}>
                <Upload data-icon="inline-start" />
                Upload media
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            <StatTile icon={Camera} label="Photos" value={folder.totalPhotos.toLocaleString()} />
            <StatTile icon={Clapperboard} label="Videos" value={folder.totalVideos.toLocaleString()} />
            <StatTile icon={HardDrive} label="Storage used" value={formatBytes(folder.totalSizeBytes)} />
          </div>

          {mediaLoading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-lg" />
              ))}
            </div>
          ) : mediaError ? (
            <DashboardEmptyState
              icon={Camera}
              title="Couldn't load media"
              description="Something went wrong reaching the FrameVault API. Check your connection and try again."
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
              description="Photos and videos you upload to this folder will show up here."
              action={
                <Button className="gap-1.5" onClick={() => setUploadOpen(true)}>
                  <Upload data-icon="inline-start" />
                  Upload media
                </Button>
              }
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

                  <div
                    className="absolute top-1.5 right-1.5 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100 data-open:opacity-100"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <MediaActionsMenu
                      eventSlug={params.eventSlug}
                      folderSlug={params.folderSlug}
                      asset={asset}
                      onMove={setMoveTarget}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <UploadMediaDialog
        eventSlug={params.eventSlug}
        folderSlug={params.folderSlug}
        open={uploadOpen}
        onOpenChange={setUploadOpen}
      />

      <MediaPreviewDialog
        eventSlug={params.eventSlug}
        folderSlug={params.folderSlug}
        asset={previewAsset}
        open={previewAsset != null}
        onOpenChange={(open) => {
          if (!open) setPreviewMediaId(null);
        }}
        onMove={setMoveTarget}
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

      <MoveMediaDialog
        eventSlug={params.eventSlug}
        folderSlug={params.folderSlug}
        asset={moveTarget}
        open={moveTarget != null}
        onOpenChange={(open) => {
          if (!open) setMoveTarget(null);
        }}
      />
    </>
  );
}
