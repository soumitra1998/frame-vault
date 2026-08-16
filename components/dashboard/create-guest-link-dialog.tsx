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
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { Skeleton } from "@/components/ui/skeleton";
import { GuestLinkShareCard } from "@/components/dashboard/guest-link-share-card";
import { useFolders } from "@/lib/queries/use-folders";
import { useCreateGuestLink } from "@/lib/queries/use-events";
import type { GuestLinkResponseDTO } from "@/lib/api/types";

export function CreateGuestLinkDialog({
  eventSlug,
  open,
  onOpenChange,
}: {
  eventSlug: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { data: folders, isLoading: foldersLoading } = useFolders(eventSlug);
  const createGuestLink = useCreateGuestLink(eventSlug);

  const [folderIds, setFolderIds] = React.useState<number[]>([]);
  const [label, setLabel] = React.useState("");
  const [expiresAt, setExpiresAt] = React.useState("");
  const [allowDownload, setAllowDownload] = React.useState(true);
  const [watermarkEnabled, setWatermarkEnabled] = React.useState(false);
  const [result, setResult] = React.useState<GuestLinkResponseDTO | null>(
    null
  );
  const reset = () => {
    setFolderIds([]);
    setLabel("");
    setExpiresAt("");
    setAllowDownload(true);
    setWatermarkEnabled(false);
    setResult(null);
    createGuestLink.reset();
  };

  const toggleFolder = (folderId: number, checked: boolean) => {
    setFolderIds((prev) =>
      checked ? [...prev, folderId] : prev.filter((id) => id !== folderId)
    );
  };

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (folderIds.length === 0) return;

    createGuestLink.mutate(
      {
        folderIds,
        label: label.trim() || undefined,
        expiresAt: expiresAt || undefined,
        allowDownload,
        watermarkEnabled,
      },
      {
        onSuccess: (link) => setResult(link),
      }
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        onOpenChange(next);
        if (!next) reset();
      }}
    >
      <DialogContent className="sm:max-w-md">
        {result ? (
          <>
            <DialogHeader>
              <DialogTitle>Guest link created</DialogTitle>
              <DialogDescription>
                Share this link with clients or guests to give them access to
                the selected folders.
              </DialogDescription>
            </DialogHeader>

            <div className="py-4">
              <GuestLinkShareCard link={result} />
            </div>

            <DialogFooter>
              <Button type="button" onClick={() => onOpenChange(false)}>
                Done
              </Button>
            </DialogFooter>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            <DialogHeader>
              <DialogTitle>Create guest link</DialogTitle>
              <DialogDescription>
                Pick which folders this link can access, then share it with
                clients or guests.
              </DialogDescription>
            </DialogHeader>

            <FieldGroup className="py-4">
              <Field>
                <FieldLabel>Folders</FieldLabel>
                {foldersLoading ? (
                  <div className="flex flex-col gap-2">
                    <Skeleton className="h-5 w-full" />
                    <Skeleton className="h-5 w-full" />
                  </div>
                ) : !folders || folders.length === 0 ? (
                  <p className="text-sm text-muted-foreground">
                    Create a folder in this event before sharing a guest
                    link.
                  </p>
                ) : (
                  <div className="flex flex-col gap-2">
                    {folders.map((folder) => (
                      <label
                        key={folder.frmvfldPk}
                        className="flex items-center gap-2 text-sm"
                      >
                        <Checkbox
                          checked={folderIds.includes(folder.frmvfldPk)}
                          onCheckedChange={(checked) =>
                            toggleFolder(folder.frmvfldPk, checked === true)
                          }
                        />
                        {folder.title}
                      </label>
                    ))}
                  </div>
                )}
              </Field>

              <Field>
                <FieldLabel htmlFor="guest-link-label">
                  Label
                  <span className="ml-auto text-xs font-normal text-muted-foreground">
                    Optional
                  </span>
                </FieldLabel>
                <Input
                  id="guest-link-label"
                  placeholder="Family & friends"
                  value={label}
                  onChange={(e) => setLabel(e.target.value)}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="guest-link-expires-at">
                  Expires on
                  <span className="ml-auto text-xs font-normal text-muted-foreground">
                    Optional
                  </span>
                </FieldLabel>
                <Input
                  id="guest-link-expires-at"
                  type="date"
                  value={expiresAt}
                  onChange={(e) => setExpiresAt(e.target.value)}
                />
              </Field>

              <Field orientation="horizontal">
                <FieldLabel htmlFor="guest-link-allow-download">
                  Allow downloads
                </FieldLabel>
                <Switch
                  id="guest-link-allow-download"
                  checked={allowDownload}
                  onCheckedChange={setAllowDownload}
                />
              </Field>

              <Field orientation="horizontal">
                <FieldLabel htmlFor="guest-link-watermark">
                  Watermark previews
                </FieldLabel>
                <Switch
                  id="guest-link-watermark"
                  checked={watermarkEnabled}
                  onCheckedChange={setWatermarkEnabled}
                />
              </Field>

              {createGuestLink.isError ? (
                <p className="text-sm text-destructive">
                  Couldn&apos;t create the guest link. Please try again.
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
                disabled={folderIds.length === 0 || createGuestLink.isPending}
              >
                {createGuestLink.isPending ? "Creating…" : "Create link"}
              </Button>
            </DialogFooter>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
