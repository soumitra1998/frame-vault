"use client";

import * as React from "react";
import { Camera, Clapperboard, FolderClosed, HardDrive, RotateCw } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { StatTile } from "@/components/dashboard/stat-tile";
import { EventCard } from "@/components/dashboard/event-card";
import { CreateEventDialog } from "@/components/dashboard/create-event-dialog";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { useMyEvents } from "@/lib/queries/use-events";
import { formatBytes } from "@/lib/dashboard/utils";

type OwnerFilter = "all" | "owned" | "shared";

export default function DashboardOverviewPage() {
  const { data, isLoading, isError, refetch, isFetching } = useMyEvents();
  const [ownerFilter, setOwnerFilter] = React.useState<OwnerFilter>("all");

  const ownedEvents = data?.ownedEvents ?? [];
  const sharedEvents = data?.sharedEvents ?? [];
  const events =
    ownerFilter === "owned"
      ? ownedEvents
      : ownerFilter === "shared"
        ? sharedEvents
        : [...ownedEvents, ...sharedEvents];

  const totals = events.reduce(
    (acc, event) => ({
      photos: acc.photos + event.totalPhotos,
      videos: acc.videos + event.totalVideos,
      bytes: acc.bytes + event.totalSizeBytes,
    }),
    { photos: 0, videos: 0, bytes: 0 }
  );

  return (
    <>
      <DashboardTopbar items={[{ label: "My events" }]} />

      <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold sm:text-3xl">
                My events
              </h1>
              <p className="mt-1 text-sm text-muted-foreground">
                Every shoot lives here — create an event, then add folders to
                organize what you deliver.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Select
                value={ownerFilter}
                onValueChange={(value) => setOwnerFilter(value as OwnerFilter)}
              >
                <SelectTrigger className="w-[168px]">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">
                    All events ({ownedEvents.length + sharedEvents.length})
                  </SelectItem>
                  <SelectItem value="owned">
                    Owned by me ({ownedEvents.length})
                  </SelectItem>
                  <SelectItem value="shared">
                    Shared with me ({sharedEvents.length})
                  </SelectItem>
                </SelectContent>
              </Select>
              <CreateEventDialog />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {isLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <Skeleton key={i} className="h-15 rounded-xl" />
              ))
            ) : (
              <>
                <StatTile icon={FolderClosed} label="Events" value={String(events.length)} />
                <StatTile icon={Camera} label="Photos" value={totals.photos.toLocaleString()} />
                <StatTile icon={Clapperboard} label="Videos" value={totals.videos.toLocaleString()} />
                <StatTile icon={HardDrive} label="Storage used" value={formatBytes(totals.bytes)} />
              </>
            )}
          </div>

          {isLoading ? (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-xl" />
              ))}
            </div>
          ) : isError ? (
            <DashboardEmptyState
              icon={FolderClosed}
              title="Couldn't load your events"
              description="Something went wrong reaching the FrameVault API. Check your connection and try again."
              action={
                <Button
                  variant="outline"
                  onClick={() => refetch()}
                  disabled={isFetching}
                  className="gap-1.5"
                >
                  <RotateCw data-icon="inline-start" className={isFetching ? "animate-spin" : ""} />
                  Try again
                </Button>
              }
            />
          ) : events.length === 0 && ownerFilter !== "all" ? (
            <DashboardEmptyState
              icon={FolderClosed}
              title={
                ownerFilter === "owned"
                  ? "No events owned by you"
                  : "No events shared with you"
              }
              description="Try switching the filter to see your other events."
              action={
                <Button variant="outline" onClick={() => setOwnerFilter("all")}>
                  Show all events
                </Button>
              }
            />
          ) : events.length === 0 ? (
            <DashboardEmptyState
              icon={FolderClosed}
              title="No events yet"
              description="Create your first event to start organizing photos and videos into folders."
              action={<CreateEventDialog />}
            />
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => (
                <EventCard key={event.frmvevtPk} event={event} />
              ))}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
