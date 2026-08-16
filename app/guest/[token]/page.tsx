"use client";

import { useParams } from "next/navigation";
import { FolderClosed, Link2Off, RotateCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { GuestTopbar } from "@/components/guest/guest-topbar";
import { GuestFolderCard } from "@/components/guest/guest-folder-card";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { useGuestEvent, useGuestFolder } from "@/lib/queries/use-guest";

export default function GuestEventPage() {
  const params = useParams<{ token: string }>();
  const {
    data: event,
    isLoading: eventLoading,
    isError: eventError,
    refetch: refetchEvent,
  } = useGuestEvent(params.token);
  const {
    data: folders,
    isLoading: foldersLoading,
    isError: foldersError,
    refetch: refetchFolders,
    isFetching: foldersFetching,
  } = useGuestFolder(event?.slug ?? "", params.token);

  if (eventLoading) {
    return (
      <>
        <GuestTopbar items={[{ label: "FrameVault" }]} />
        <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">
          <div className="mx-auto flex max-w-6xl flex-col gap-8">
            <Skeleton className="h-9 w-72" />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-xl" />
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
              action={
                <Button variant="outline" onClick={() => refetchEvent()} className="gap-1.5">
                  <RotateCw data-icon="inline-start" />
                  Try again
                </Button>
              }
            />
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <GuestTopbar items={[{ label: event.title }]} />

      <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-8">
          <div>
            <h1 className="text-2xl font-semibold sm:text-3xl">{event.title}</h1>
            {event.description ? (
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                {event.description}
              </p>
            ) : null}
          </div>

          {foldersLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-48 rounded-xl" />
              ))}
            </div>
          ) : foldersError ? (
            <DashboardEmptyState
              icon={FolderClosed}
              title="Couldn't load folders"
              description="Something went wrong loading this gallery. Check your connection and try again."
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
              title="No folders shared yet"
              description="The studio hasn't shared any folders on this link yet. Check back later."
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {folders.map((folder) => (
                <GuestFolderCard key={folder.frmvfldPk} token={params.token} folder={folder} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
