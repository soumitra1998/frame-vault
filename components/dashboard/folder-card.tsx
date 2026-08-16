"use client";

import * as React from "react";
import Link from "next/link";
import {
  Camera,
  Clapperboard,
  FolderClosed,
  HardDrive,
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
  FolderSharingBadge,
  FolderVisibilityBadge,
} from "@/components/dashboard/visibility-badge";
import { EditFolderDialog } from "@/components/dashboard/edit-folder-dialog";
import { FolderSharingMenuItem } from "@/components/dashboard/folder-sharing-menu-item";
import { useDeleteFolder } from "@/lib/queries/use-folders";
import { useGuestLink, useGuestLinkFolderIds } from "@/lib/queries/use-events";
import { formatBytes } from "@/lib/dashboard/utils";
import { toast } from "@/components/ui/toast";
import type { FolderResponseDTO } from "@/lib/api/types";

export function FolderCard({
  eventSlug,
  folder,
}: {
  eventSlug: string;
  folder: FolderResponseDTO;
}) {
  const [editOpen, setEditOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const deleteFolder = useDeleteFolder(eventSlug);
  const { data: guestLink } = useGuestLink(eventSlug);
  const { data: sharedFolderIds } = useGuestLinkFolderIds(eventSlug);
  const isShared = !!guestLink?.isActive && !!sharedFolderIds?.includes(folder.frmvfldPk);

  const handleDelete = () => {
    deleteFolder.mutate(folder.slug, {
      onSuccess: () => {
        setDeleteOpen(false);
        toast.add({
          title: "Folder deleted",
          description: `"${folder.title}" has been deleted.`,
          type: "success",
        });
      },
      onError: () => {
        toast.add({
          title: "Couldn't delete folder",
          description: "Something went wrong. Please try again.",
          type: "error",
        });
      },
    });
  };

  return (
    <>
      <Card className="relative h-full transition-colors hover:ring-primary/40">
        <Link
          href={`/dashboard/events/${eventSlug}/folders/${folder.slug}`}
          className="absolute inset-0 z-0 rounded-xl"
          aria-label={folder.title}
        />

        <div className="relative flex aspect-video items-center justify-center overflow-hidden bg-linear-to-br from-muted to-card">
          <FolderClosed
            className="size-8 text-muted-foreground/40"
            strokeWidth={1.5}
          />
          <div className="absolute top-3 left-3 flex items-center gap-1.5">
            <FolderVisibilityBadge
              visibility={folder.visibility}
              className="bg-background/80"
            />
            {isShared ? <FolderSharingBadge className="bg-background/80" /> : null}
          </div>
          <div className="absolute top-3 right-3 z-10">
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <Button
                    variant="outline"
                    size="icon-sm"
                    className="bg-background/80"
                    aria-label="Folder actions"
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
                  Edit folder
                </DropdownMenuItem>
                <FolderSharingMenuItem eventSlug={eventSlug} folder={folder} />
                <DropdownMenuItem
                  variant="destructive"
                  onClick={(e) => {
                    e.preventDefault();
                    setDeleteOpen(true);
                  }}
                >
                  <Trash2 />
                  Delete folder
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <CardHeader>
          <CardTitle className="truncate">{folder.title}</CardTitle>
          {folder.description ? (
            <p className="line-clamp-2 text-sm text-muted-foreground">
              {folder.description}
            </p>
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

      <EditFolderDialog
        eventSlug={eventSlug}
        folder={folder}
        open={editOpen}
        onOpenChange={setEditOpen}
      />

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete &quot;{folder.title}&quot;?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This permanently deletes the folder and everything in it,
              including all media. This can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteFolder.isPending}>
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteFolder.isPending}
            >
              {deleteFolder.isPending ? "Deleting…" : "Delete folder"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
