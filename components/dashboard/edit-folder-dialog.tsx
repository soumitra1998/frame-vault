"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateFolder } from "@/lib/queries/use-folders";
import type { FolderResponseDTO, FolderVisibility } from "@/lib/api/types";

export function EditFolderDialog({
  eventSlug,
  folder,
  open,
  onOpenChange,
}: {
  eventSlug: string;
  folder: FolderResponseDTO;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {open ? (
          <EditFolderForm
            eventSlug={eventSlug}
            folder={folder}
            onOpenChange={onOpenChange}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function EditFolderForm({
  eventSlug,
  folder,
  onOpenChange,
}: {
  eventSlug: string;
  folder: FolderResponseDTO;
  onOpenChange: (open: boolean) => void;
}) {
  const updateFolder = useUpdateFolder(eventSlug, folder.slug);
  const [title, setTitle] = React.useState(folder.title);
  const [description, setDescription] = React.useState(
    folder.description ?? ""
  );
  const [visibility, setVisibility] = React.useState<FolderVisibility>(
    folder.visibility
  );

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) return;

    updateFolder.mutate(
      { title, description, visibility },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>Edit folder</DialogTitle>
        <DialogDescription>
          Update the details for this folder.
        </DialogDescription>
      </DialogHeader>

      <FieldGroup className="py-4">
        <Field>
          <FieldLabel htmlFor="edit-folder-title">Title</FieldLabel>
          <Input
            id="edit-folder-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={255}
            required
            autoFocus
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="edit-folder-description">
            Description
            <span className="ml-auto text-xs font-normal text-muted-foreground">
              Optional
            </span>
          </FieldLabel>
          <Textarea
            id="edit-folder-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={255}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="edit-folder-visibility">Visibility</FieldLabel>
          <Select
            value={visibility}
            onValueChange={(value) =>
              setVisibility(value as FolderVisibility)
            }
          >
            <SelectTrigger id="edit-folder-visibility" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PRIMARY_ONLY">
                Only me — private working folder
              </SelectItem>
              <SelectItem value="CLIENT_ONLY">
                Client — visible to the event owner&apos;s client
              </SelectItem>
              <SelectItem value="GUEST_ONLY">
                Guests — shareable with guest links
              </SelectItem>
            </SelectContent>
          </Select>
          <FieldDescription>
            Controls who this folder is visible to once you share it.
          </FieldDescription>
        </Field>

        {updateFolder.isError ? (
          <p className="text-sm text-destructive">
            Couldn&apos;t update the folder. Please try again.
          </p>
        ) : null}
      </FieldGroup>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          disabled={!title.trim() || updateFolder.isPending}
        >
          {updateFolder.isPending ? "Saving…" : "Save changes"}
        </Button>
      </DialogFooter>
    </form>
  );
}
