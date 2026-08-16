"use client";

import * as React from "react";
import { FolderClosed } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldLabel } from "@/components/ui/field";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useFolders } from "@/lib/queries/use-folders";
import { useMoveMedia } from "@/lib/queries/use-folder-media";
import { toast } from "@/components/ui/toast";
import type { MediaAssetResponseDTO } from "@/lib/api/types";

export function MoveMediaDialog({
  eventSlug,
  folderSlug,
  asset,
  open,
  onOpenChange,
}: {
  eventSlug: string;
  folderSlug: string;
  asset: MediaAssetResponseDTO | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {open && asset ? (
          <MoveMediaForm
            eventSlug={eventSlug}
            folderSlug={folderSlug}
            asset={asset}
            onOpenChange={onOpenChange}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function MoveMediaForm({
  eventSlug,
  folderSlug,
  asset,
  onOpenChange,
}: {
  eventSlug: string;
  folderSlug: string;
  asset: MediaAssetResponseDTO;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: folders, isLoading } = useFolders(eventSlug);
  const moveMedia = useMoveMedia(eventSlug, folderSlug);
  const otherFolders = React.useMemo(
    () => (folders ?? []).filter((folder) => folder.slug !== folderSlug),
    [folders, folderSlug]
  );
  const [targetFolderSlug, setTargetFolderSlug] = React.useState("");

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!targetFolderSlug) return;

    moveMedia.mutate(
      { mediaId: asset.frmvmdaPk, targetFolderSlug },
      {
        onSuccess: () => {
          onOpenChange(false);
          toast.add({
            title: "Media moved",
            description: `"${asset.originalFilename}" has been moved.`,
            type: "success",
          });
        },
        onError: () => {
          toast.add({
            title: "Couldn't move media",
            description: "Something went wrong. Please try again.",
            type: "error",
          });
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>Move to another folder</DialogTitle>
        <DialogDescription>
          Move &quot;{asset.originalFilename}&quot; to a different folder in this event.
        </DialogDescription>
      </DialogHeader>

      <div className="py-4">
        <Field>
          <FieldLabel htmlFor="move-media-target">Target folder</FieldLabel>
          <Select
            value={targetFolderSlug}
            onValueChange={(value) => setTargetFolderSlug(value ?? "")}
          >
            <SelectTrigger id="move-media-target" className="w-full">
              <SelectValue placeholder="Choose a folder…" />
            </SelectTrigger>
            <SelectContent>
              {otherFolders.length === 0 ? (
                <div className="flex items-center gap-1.5 px-1.5 py-1 text-sm text-muted-foreground">
                  <FolderClosed className="size-4" />
                  No other folders yet
                </div>
              ) : (
                otherFolders.map((folder) => (
                  <SelectItem key={folder.slug} value={folder.slug}>
                    {folder.title}
                  </SelectItem>
                ))
              )}
            </SelectContent>
          </Select>
        </Field>

        {moveMedia.isError ? (
          <p className="mt-2 text-sm text-destructive">
            Couldn&apos;t move this media. Please try again.
          </p>
        ) : null}
      </div>

      <DialogFooter>
        <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!targetFolderSlug || isLoading || moveMedia.isPending}
        >
          {moveMedia.isPending ? "Moving…" : "Move"}
        </Button>
      </DialogFooter>
    </form>
  );
}
