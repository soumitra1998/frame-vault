"use client";

import * as React from "react";
import Link from "next/link";
import {
  Camera,
  Clapperboard,
  HardDrive,
  Link2,
  MoreVertical,
  Pencil,
  Trash2,
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  EventOwnerBadge,
  EventVisibilityBadge,
} from "@/components/dashboard/visibility-badge";
import { CreateGuestLinkDialog } from "@/components/dashboard/create-guest-link-dialog";
import { EditEventDialog } from "@/components/dashboard/edit-event-dialog";
import { useDeleteEvent } from "@/lib/queries/use-events";
import { formatBytes, formatRelativeDate } from "@/lib/dashboard/utils";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import type { EventResponseDTO } from "@/lib/api/types";

export function EventCard({ event }: { event: EventResponseDTO }) {
  const [guestLinkOpen, setGuestLinkOpen] = React.useState(false);
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const deleteEvent = useDeleteEvent();
  const owned = event.isOwner === "Y";

  const handleDelete = () => {
    deleteEvent.mutate(event.frmvevtPk, {
      onSuccess: () => {
        setDeleteOpen(false);
        toast.add({
          title: "Event deleted",
          description: `"${event.title}" has been deleted.`,
          type: "success",
        });
      },
      onError: () => {
        toast.add({
          title: "Couldn't delete event",
          description: "Something went wrong. Please try again.",
          type: "error",
        });
      },
    });
  };

  return (
    <>
      <Card
        className={cn(
          "relative h-full transition-colors hover:ring-primary/40",
          owned
            ? "ring-amber-500/15 dark:ring-amber-400/15"
            : "ring-sky-500/20 dark:ring-sky-400/20",
        )}
      >
        <Link
          href={`/dashboard/events/${event.slug}`}
          className="absolute inset-0 z-0 rounded-xl"
          aria-label={event.title}
        />

        <div className="relative flex aspect-video items-center justify-center overflow-hidden bg-linear-to-br from-muted to-card">
          <Camera
            className="size-8 text-muted-foreground/40"
            strokeWidth={1.5}
          />
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <EventVisibilityBadge
              visibility={event.visibility}
              className="bg-background/80"
            />
            <EventOwnerBadge
              isOwner={event.isOwner}
              className="bg-background/80"
            />
          </div>
          <div className="absolute top-3 right-3 z-10">
            {event.isOwner === "Y" && (
              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <Button
                      variant="outline"
                      size="icon-sm"
                      className="bg-background/80"
                      aria-label="Event actions"
                    >
                      <MoreVertical />
                    </Button>
                  }
                />
                <DropdownMenuContent align="end">
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault();
                      setEditOpen(true);
                    }}
                  >
                    <Pencil />
                    Edit event
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.preventDefault();
                      setGuestLinkOpen(true);
                    }}
                  >
                    <Link2 />
                    Create guest link
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    variant="destructive"
                    onClick={(e) => {
                      e.preventDefault();
                      setDeleteOpen(true);
                    }}
                  >
                    <Trash2 />
                    Delete event
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>

        <CardHeader>
          <CardTitle className="truncate">{event.title}</CardTitle>
          {event.description ? (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {event.description}
            </p>
          ) : null}
        </CardHeader>

        <CardContent className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-3">
            <span className="flex items-center gap-1">
              <Camera className="size-3.5" /> {event.totalPhotos}
            </span>
            <span className="flex items-center gap-1">
              <Clapperboard className="size-3.5" /> {event.totalVideos}
            </span>
            <span className="flex items-center gap-1">
              <HardDrive className="size-3.5" />{" "}
              {formatBytes(event.totalSizeBytes)}
            </span>
          </div>
          <span>{formatRelativeDate(event.updatedAt)}</span>
        </CardContent>
      </Card>

      <EditEventDialog
        event={event}
        open={editOpen}
        onOpenChange={setEditOpen}
      />
      <CreateGuestLinkDialog
        eventSlug={event.slug}
        open={guestLinkOpen}
        onOpenChange={setGuestLinkOpen}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete &quot;{event.title}&quot;?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes the event and everything in it, including
              all folders and media. This can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteEvent.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteEvent.isPending}
            >
              {deleteEvent.isPending ? "Deleting…" : "Delete event"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
