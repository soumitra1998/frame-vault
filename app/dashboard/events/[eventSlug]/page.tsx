"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import {
  Camera,
  Clapperboard,
  FolderClosed,
  HardDrive,
  RotateCw,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { StatTile } from "@/components/dashboard/stat-tile";
import { FolderCard } from "@/components/dashboard/folder-card";
import { CreateFolderDialog } from "@/components/dashboard/create-folder-dialog";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { EventVisibilityBadge } from "@/components/dashboard/visibility-badge";
import { GuestLinkPanel } from "@/components/dashboard/guest-link-panel";
import { useEvent } from "@/lib/queries/use-events";
import { useFolders } from "@/lib/queries/use-folders";
import { formatBytes } from "@/lib/dashboard/utils";

export default function EventDetailPage() {
  const params = useParams<{ eventSlug: string }>();
  const {
    data: event,
    isLoading: eventLoading,
    isError: eventError,
    refetch: refetchEvent,
  } = useEvent(params.eventSlug);
  const {
    data: folders,
    isLoading: foldersLoading,
    isError: foldersError,
    refetch: refetchFolders,
    isFetching: foldersFetching,
  } = useFolders(params.eventSlug);

  if (eventLoading) {
    return (
      <>
        <DashboardTopbar items={[{ label: "My events", href: "/dashboard" }]} />
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">
          <div className="mx-auto flex max-w-6xl flex-col gap-8">
            <Skeleton className="h-9 w-72" />
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-15 rounded-xl" />
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
        <DashboardTopbar
          items={[
            { label: "My events", href: "/dashboard" },
            { label: "Not found" },
          ]}
        />
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">
          <div className="mx-auto max-w-6xl">
            <DashboardEmptyState
              icon={FolderClosed}
              title={
                eventError ? "Couldn't load this event" : "Event not found"
              }
              description={
                eventError
                  ? "Something went wrong reaching the FrameVault API. Check your connection and try again."
                  : "This event doesn't exist or may have been removed."
              }
              action={
                eventError ? (
                  <Button
                    variant="outline"
                    onClick={() => refetchEvent()}
                    className="gap-1.5"
                  >
                    <RotateCw data-icon="inline-start" />
                    Try again
                  </Button>
                ) : (
                  <Button
                    render={<Link href="/dashboard" />}
                    nativeButton={false}
                  >
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
          { label: event.title },
        ]}
      />

      <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h1 className="text-2xl font-semibold sm:text-3xl">
                  {event.title}
                </h1>
                <EventVisibilityBadge visibility={event.visibility} />
              </div>
              {event.description ? (
                <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                  {event.description}
                </p>
              ) : null}
            </div>
            <CreateFolderDialog eventSlug={event.slug} />
          </div>
          <div>
            <GuestLinkPanel eventSlug={event.slug} />
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            <StatTile
              icon={FolderClosed}
              label="Folders"
              value={String(folders?.length ?? 0)}
            />
            <StatTile
              icon={Camera}
              label="Photos"
              value={event.totalPhotos.toLocaleString()}
            />
            <StatTile
              icon={Clapperboard}
              label="Videos"
              value={event.totalVideos.toLocaleString()}
            />
            <StatTile
              icon={HardDrive}
              label="Storage used"
              value={formatBytes(event.totalSizeBytes)}
            />
          </div>

          {foldersLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-40 rounded-xl" />
              ))}
            </div>
          ) : foldersError ? (
            <DashboardEmptyState
              icon={FolderClosed}
              title="Couldn't load folders"
              description="Something went wrong reaching the FrameVault API. Check your connection and try again."
              action={
                <Button
                  variant="outline"
                  onClick={() => refetchFolders()}
                  disabled={foldersFetching}
                  className="gap-1.5"
                >
                  <RotateCw
                    data-icon="inline-start"
                    className={foldersFetching ? "animate-spin" : ""}
                  />
                  Try again
                </Button>
              }
            />
          ) : !folders || folders.length === 0 ? (
            <DashboardEmptyState
              icon={FolderClosed}
              title="No folders yet"
              description="Add a folder to start grouping photos and videos for this event."
              action={<CreateFolderDialog eventSlug={event.slug} />}
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {folders.map((folder) => (
                <FolderCard
                  key={folder.frmvfldPk}
                  eventSlug={event.slug}
                  folder={folder}
                />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
