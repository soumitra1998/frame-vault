"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { MediaUploader } from "@/components/dashboard/media-uploader";

export function UploadMediaDialog({
  eventSlug,
  folderSlug,
  open,
  onOpenChange,
}: {
  eventSlug: string;
  folderSlug: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload media</DialogTitle>
          <DialogDescription>
            Add photos or videos to this folder. Drag and drop or browse to select
            multiple files — uploads start automatically.
          </DialogDescription>
        </DialogHeader>

        {open ? <MediaUploader eventSlug={eventSlug} folderSlug={folderSlug} /> : null}
      </DialogContent>
    </Dialog>
  );
}
