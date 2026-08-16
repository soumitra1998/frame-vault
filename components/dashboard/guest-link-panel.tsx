"use client";

import * as React from "react";
import { Check, Copy, Link2, Link2Off, MoreVertical, QrCode, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import { CreateGuestLinkDialog } from "@/components/dashboard/create-guest-link-dialog";
import { GuestLinkShareCard } from "@/components/dashboard/guest-link-share-card";
import {
  useDeleteGuestLink,
  useGuestLink,
  useSetGuestLinkActive,
} from "@/lib/queries/use-events";
import { getGuestLinkUrl } from "@/lib/dashboard/guest-link";
import { toast } from "@/components/ui/toast";

export function GuestLinkPanel({ eventSlug }: { eventSlug: string }) {
  const { data: link, isLoading } = useGuestLink(eventSlug);
  console.log("link data:" + JSON.stringify(link))
  const [createOpen, setCreateOpen] = React.useState(false);
  const [qrOpen, setQrOpen] = React.useState(false);
  const [deleteOpen, setDeleteOpen] = React.useState(false);
  const [copied, setCopied] = React.useState(false);
  const setActive = useSetGuestLinkActive(eventSlug);
  const deleteLink = useDeleteGuestLink(eventSlug);

  // `CreateGuestLinkDialog` is rendered unconditionally (not nested inside the
  // `!link` branch below): its own success callback is what flips `link` from
  // null to present, and a dialog nested in a branch keyed on that same value
  // gets unmounted out from under itself the instant it succeeds, before the
  // user ever sees the success/QR screen.
  const createDialog = (
    <CreateGuestLinkDialog eventSlug={eventSlug} open={createOpen} onOpenChange={setCreateOpen} />
  );

  if (isLoading) {
    return <Skeleton className="h-6 w-36" />;
  }

  if (!link) {
    return (
      <>
        <Button variant="outline" className="gap-1.5" onClick={() => setCreateOpen(true)}>
          <Link2 data-icon="inline-start" />
          Generate guest link
        </Button>
        {createDialog}
      </>
    );
  }

  const url = getGuestLinkUrl(link);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleToggleActive = () => {
    const wasActive = link.isActive;
    setActive.mutate(!wasActive, {
      onSuccess: () => {
        toast.add({
          title: wasActive ? "Guest link deactivated" : "Guest link activated",
          type: "success",
        });
      },
      onError: () => {
        toast.add({
          title: "Couldn't update the guest link",
          description: "Something went wrong. Please try again.",
          type: "error",
        });
      },
    });
  };

  const handleDelete = () => {
    deleteLink.mutate(undefined, {
      onSuccess: () => {
        setDeleteOpen(false);
        toast.add({ title: "Guest link deleted", type: "success" });
      },
      onError: () => {
        toast.add({
          title: "Couldn't delete the guest link",
          description: "Something went wrong. Please try again.",
          type: "error",
        });
      },
    });
  };

  return (
    <>
      <div className="flex items-center gap-1.5">
        <Badge variant={link.isActive ? "secondary" : "outline"}>
          {link.isActive ? "Guest link active" : "Guest link inactive"}
        </Badge>

        <div className="flex items-center rounded-lg border border-input">
          <span className="max-w-36 truncate px-2.5 text-sm text-muted-foreground sm:max-w-52">
            {url}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="shrink-0"
            onClick={handleCopy}
            aria-label="Copy guest link"
          >
            {copied ? <Check /> : <Copy />}
          </Button>
        </div>

        <Button
          variant="outline"
          size="icon"
          onClick={() => setQrOpen(true)}
          aria-label="Show QR code"
        >
          <QrCode />
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <Button variant="outline" size="icon" aria-label="Guest link options">
                <MoreVertical />
              </Button>
            }
          />
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleToggleActive} disabled={setActive.isPending}>
              {link.isActive ? <Link2Off /> : <Link2 />}
              {link.isActive ? "Deactivate link" : "Activate link"}
            </DropdownMenuItem>
            <DropdownMenuItem
              variant="destructive"
              onClick={(e) => {
                e.preventDefault();
                setDeleteOpen(true);
              }}
            >
              <Trash2 />
              Delete link
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {createDialog}

      <Dialog open={qrOpen} onOpenChange={setQrOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Guest link</DialogTitle>
            <DialogDescription>
              Share this link or QR code with clients or guests.
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <GuestLinkShareCard link={link} />
          </div>
        </DialogContent>
      </Dialog>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete guest link?</AlertDialogTitle>
            <AlertDialogDescription>
              Anyone with this link or QR code will lose access immediately. This
              can&apos;t be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleteLink.isPending}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={handleDelete}
              disabled={deleteLink.isPending}
            >
              {deleteLink.isPending ? "Deleting…" : "Delete link"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
