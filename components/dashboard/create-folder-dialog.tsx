"use client";

import * as React from "react";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { useCreateFolder } from "@/lib/queries/use-folders";
import { useCurrentUserId } from "@/lib/queries/use-current-user";
import type { FolderVisibility } from "@/lib/api/types";

export function CreateFolderDialog({
  eventSlug,
  trigger,
}: {
  eventSlug: string;
  trigger?: React.ReactElement;
}) {
  const userId = useCurrentUserId();
  const createFolder = useCreateFolder(eventSlug);
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [visibility, setVisibility] =
    React.useState<FolderVisibility>("CLIENT_ONLY");

  const reset = () => {
    setTitle("");
    setDescription("");
    setVisibility("CLIENT_ONLY");
    createFolder.reset();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createFolder.mutate(
      { title, description, visibility },
      {
        onSuccess: () => {
          setOpen(false);
          reset();
        },
      }
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger
        render={
          trigger ?? (
            <Button className="gap-1.5">
              <Plus data-icon="inline-start" />
              New folder
            </Button>
          )
        }
      />
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create a new folder</DialogTitle>
            <DialogDescription>
              Folders group photos and videos within this event — for example
              by ceremony, session, or delivery batch.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="py-4">
            <Field>
              <FieldLabel htmlFor="folder-title">Title</FieldLabel>
              <Input
                id="folder-title"
                placeholder="Reception Highlights"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={255}
                required
                autoFocus
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="folder-description">
                Description
                <span className="ml-auto text-xs font-normal text-muted-foreground">
                  Optional
                </span>
              </FieldLabel>
              <Textarea
                id="folder-description"
                placeholder="A short note about this folder"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={255}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="folder-visibility">Visibility</FieldLabel>
              <Select
                value={visibility}
                onValueChange={(value) =>
                  setVisibility(value as FolderVisibility)
                }
              >
                <SelectTrigger id="folder-visibility" className="w-full">
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

            {createFolder.isError ? (
              <p className="text-sm text-destructive">
                Couldn&apos;t create the folder. Please try again.
              </p>
            ) : null}
          </FieldGroup>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!title.trim() || !userId || createFolder.isPending}
            >
              {createFolder.isPending ? "Creating…" : "Create folder"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
