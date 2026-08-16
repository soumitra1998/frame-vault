"use client";

import * as React from "react";
import { useParams } from "next/navigation";
import { Camera, PlayCircle, RotateCcw, RotateCw, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Skeleton } from "@/components/ui/skeleton";
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
import { DashboardTopbar } from "@/components/dashboard/dashboard-topbar";
import { DashboardEmptyState } from "@/components/dashboard/dashboard-empty-state";
import { useEvent } from "@/lib/queries/use-events";
import { useFolder } from "@/lib/queries/use-folders";
import {
  useDeleteMediaPermanently,
  useRestoreMedia,
  useTrashedMedia,
} from "@/lib/queries/use-folder-media";
import { daysUntilPermanentDeletion, TRASH_RETENTION_DAYS } from "@/lib/dashboard/utils";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";

type DeleteTarget = { kind: "one"; mediaId: number } | { kind: "selected" } | { kind: "all" };

export default function FolderTrashPage() {
  const params = useParams<{ eventSlug: string; folderSlug: string }>();
  const { data: event } = useEvent(params.eventSlug);
  const { data: folder } = useFolder(params.eventSlug, params.folderSlug);
  const {
    data: trashedMedia,
    isLoading,
    isError,
    refetch,
    isFetching,
  } = useTrashedMedia(params.eventSlug, params.folderSlug);

  const restoreMedia = useRestoreMedia(params.eventSlug, params.folderSlug);
  const deletePermanently = useDeleteMediaPermanently(params.eventSlug, params.folderSlug);

  const [selected, setSelected] = React.useState<Set<number>>(new Set());
  const [deleteTarget, setDeleteTarget] = React.useState<DeleteTarget | null>(null);
  const [isBulkWorking, setIsBulkWorking] = React.useState(false);

  const toggleSelected = (mediaId: number) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(mediaId)) next.delete(mediaId);
      else next.add(mediaId);
      return next;
    });
  };

  const allSelected = !!trashedMedia?.length && selected.size === trashedMedia.length;
  const toggleSelectAll = () => {
    if (allSelected) setSelected(new Set());
    else setSelected(new Set((trashedMedia ?? []).map((asset) => asset.frmvmdaPk)));
  };

  const handleRestoreSelected = async () => {
    const ids = [...selected];
    if (ids.length === 0) return;
    setIsBulkWorking(true);
    const results = await Promise.allSettled(ids.map((id) => restoreMedia.mutateAsync(id)));
    setIsBulkWorking(false);
    setSelected(new Set());
    const failed = results.filter((r) => r.status === "rejected").length;
    if (failed === 0) {
      toast.add({
        title: "Restored",
        description: `${ids.length} item${ids.length === 1 ? "" : "s"} restored to the folder.`,
        type: "success",
      });
    } else {
      toast.add({
        title: "Some items couldn't be restored",
        description: `${ids.length - failed} of ${ids.length} restored. Please retry the rest.`,
        type: "error",
      });
    }
  };

  const resolveDeleteIds = (target: DeleteTarget): number[] => {
    if (target.kind === "one") return [target.mediaId];
    if (target.kind === "selected") return [...selected];
    return (trashedMedia ?? []).map((asset) => asset.frmvmdaPk);
  };

  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    const ids = resolveDeleteIds(deleteTarget);
    setIsBulkWorking(true);
    const results = await Promise.allSettled(
      ids.map((id) => deletePermanently.mutateAsync(id))
    );
    setIsBulkWorking(false);
    setDeleteTarget(null);
    setSelected(new Set());
    const failed = results.filter((r) => r.status === "rejected").length;
    if (failed === 0) {
      toast.add({
        title: "Deleted permanently",
        description: `${ids.length} item${ids.length === 1 ? "" : "s"} deleted for good.`,
        type: "success",
      });
    } else {
      toast.add({
        title: "Some items couldn't be deleted",
        description: `${ids.length - failed} of ${ids.length} deleted. Please retry the rest.`,
        type: "error",
      });
    }
  };

  const deleteCount = deleteTarget ? resolveDeleteIds(deleteTarget).length : 0;

  return (
    <>
      <DashboardTopbar
        items={[
          { label: "My events", href: "/dashboard" },
          {
            label: event?.title ?? params.eventSlug,
            href: `/dashboard/events/${params.eventSlug}`,
          },
          {
            label: folder?.title ?? params.folderSlug,
            href: `/dashboard/events/${params.eventSlug}/folders/${params.folderSlug}`,
          },
          { label: "Bin" },
        ]}
      />

      <main className="flex-1 px-4 py-6 sm:px-6 sm:py-8">
        <div className="mx-auto flex max-w-6xl flex-col gap-6">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h1 className="text-2xl font-semibold sm:text-3xl">Bin</h1>
              <p className="mt-1 max-w-2xl text-sm text-muted-foreground">
                Removed items stay here for {TRASH_RETENTION_DAYS} days before they&apos;re
                deleted for good.
              </p>
            </div>

            {trashedMedia && trashedMedia.length > 0 ? (
              <Button
                variant="destructive"
                className="gap-1.5"
                onClick={() => setDeleteTarget({ kind: "all" })}
              >
                <Trash2 data-icon="inline-start" />
                Empty bin
              </Button>
            ) : null}
          </div>

          {trashedMedia && trashedMedia.length > 0 ? (
            <div className="flex flex-wrap items-center gap-3 rounded-lg border border-border bg-card/40 px-3 py-2">
              <label className="flex items-center gap-2 text-sm">
                <Checkbox
                  checked={allSelected}
                  onCheckedChange={toggleSelectAll}
                  aria-label="Select all"
                />
                Select all
              </label>

              {selected.size > 0 ? (
                <>
                  <span className="text-sm text-muted-foreground">
                    {selected.size} selected
                  </span>
                  <div className="ml-auto flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="gap-1.5"
                      onClick={handleRestoreSelected}
                      disabled={isBulkWorking}
                    >
                      <RotateCcw data-icon="inline-start" />
                      Restore
                    </Button>
                    <Button
                      variant="destructive"
                      size="sm"
                      className="gap-1.5"
                      onClick={() => setDeleteTarget({ kind: "selected" })}
                      disabled={isBulkWorking}
                    >
                      <Trash2 data-icon="inline-start" />
                      Delete
                    </Button>
                  </div>
                </>
              ) : null}
            </div>
          ) : null}

          {isLoading ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Skeleton key={i} className="aspect-square rounded-lg" />
              ))}
            </div>
          ) : isError ? (
            <DashboardEmptyState
              icon={Trash2}
              title="Couldn't load the bin"
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
          ) : !trashedMedia || trashedMedia.length === 0 ? (
            <DashboardEmptyState
              icon={Trash2}
              title="Bin is empty"
              description="Items you remove from this folder will show up here until they're permanently deleted."
            />
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-5">
              {trashedMedia.map((asset) => {
                const isSelected = selected.has(asset.frmvmdaPk);
                const daysLeft = asset.removeAt
                  ? daysUntilPermanentDeletion(asset.removeAt)
                  : null;

                return (
                  <div
                    key={asset.frmvmdaPk}
                    role="button"
                    tabIndex={0}
                    onClick={() => toggleSelected(asset.frmvmdaPk)}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        toggleSelected(asset.frmvmdaPk);
                      }
                    }}
                    className={cn(
                      "group relative aspect-square cursor-pointer overflow-hidden rounded-lg bg-muted ring-1 ring-foreground/10",
                      isSelected && "ring-2 ring-primary"
                    )}
                  >
                    {asset.thumbnailUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={asset.thumbnailUrl}
                        alt={asset.originalFilename}
                        className={cn(
                          "size-full object-cover transition-opacity",
                          isSelected && "opacity-70"
                        )}
                      />
                    ) : (
                      <div className="flex size-full items-center justify-center text-muted-foreground/40">
                        <Camera className="size-6" strokeWidth={1.5} />
                      </div>
                    )}
                    {asset.mediaType === "VIDEO" ? (
                      <PlayCircle className="absolute right-1.5 bottom-1.5 size-5 text-white drop-shadow" />
                    ) : null}

                    <div className="absolute top-1.5 left-1.5" onClick={(e) => e.stopPropagation()}>
                      <Checkbox
                        checked={isSelected}
                        onCheckedChange={() => toggleSelected(asset.frmvmdaPk)}
                        aria-label={`Select ${asset.originalFilename}`}
                        className="bg-background/90"
                      />
                    </div>

                    {daysLeft != null ? (
                      <Badge
                        variant="outline"
                        className="absolute bottom-1.5 left-1.5 bg-background/80"
                      >
                        {daysLeft === 0 ? "Deletes today" : `${daysLeft}d left`}
                      </Badge>
                    ) : null}

                    <div
                      className="absolute top-1.5 right-1.5 flex flex-col gap-1 opacity-0 transition-opacity group-hover:opacity-100 group-focus-within:opacity-100"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <Button
                        variant="outline"
                        size="icon-sm"
                        className="bg-background/80"
                        aria-label="Restore"
                        onClick={() => restoreMedia.mutate(asset.frmvmdaPk)}
                      >
                        <RotateCcw />
                      </Button>
                      <Button
                        variant="outline"
                        size="icon-sm"
                        className="bg-background/80 text-destructive hover:text-destructive"
                        aria-label="Delete permanently"
                        onClick={() => setDeleteTarget({ kind: "one", mediaId: asset.frmvmdaPk })}
                      >
                        <Trash2 />
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      <AlertDialog
        open={deleteTarget != null}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              Delete {deleteCount} item{deleteCount === 1 ? "" : "s"} permanently?
            </AlertDialogTitle>
            <AlertDialogDescription>
              This can&apos;t be undone. These photos and videos will be gone for good.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isBulkWorking}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleConfirmDelete}
              disabled={isBulkWorking}
            >
              {isBulkWorking ? "Deleting…" : "Delete permanently"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
