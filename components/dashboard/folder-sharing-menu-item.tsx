"use client";

import { Link2Off, Share2 } from "lucide-react";

import { DropdownMenuItem } from "@/components/ui/dropdown-menu";
import {
  useAddGuestLinkFolders,
  useCreateGuestLink,
  useGuestLink,
  useGuestLinkFolderIds,
  useRemoveGuestLinkFolders,
} from "@/lib/queries/use-events";
import { toast } from "@/components/ui/toast";
import type { FolderResponseDTO } from "@/lib/api/types";

/**
 * Dropdown item that starts/stops sharing a single folder via the event's
 * guest link — creating the link on first use if the event doesn't have one
 * yet. Reused by both the dashboard folder grid and the folder detail page.
 */
export function FolderSharingMenuItem({
  eventSlug,
  folder,
}: {
  eventSlug: string;
  folder: FolderResponseDTO;
}) {
  const { data: link } = useGuestLink(eventSlug);
  const { data: sharedFolderIds } = useGuestLinkFolderIds(eventSlug);
  const createGuestLink = useCreateGuestLink(eventSlug);
  const addFolders = useAddGuestLinkFolders(eventSlug);
  const removeFolders = useRemoveGuestLinkFolders(eventSlug);

  const isShared = !!link?.isActive && !!sharedFolderIds?.includes(folder.frmvfldPk);
  const isPending = createGuestLink.isPending || addFolders.isPending || removeFolders.isPending;

  const handleStopSharing = () => {
    removeFolders.mutate([folder.frmvfldPk], {
      onSuccess: () => {
        toast.add({
          title: "Sharing stopped",
          description: `"${folder.title}" is no longer shared via guest link.`,
          type: "success",
        });
      },
      onError: () => {
        toast.add({
          title: "Couldn't stop sharing",
          description: "Something went wrong. Please try again.",
          type: "error",
        });
      },
    });
  };

  const handleStartSharing = () => {
    const onError = () => {
      toast.add({
        title: "Couldn't start sharing",
        description: "Something went wrong. Please try again.",
        type: "error",
      });
    };
    const onSuccess = () => {
      toast.add({
        title: "Sharing started",
        description: `"${folder.title}" is now shared via guest link.`,
        type: "success",
      });
    };

    if (!link) {
      createGuestLink.mutate({ folderIds: [folder.frmvfldPk] }, { onSuccess, onError });
    } else {
      addFolders.mutate([folder.frmvfldPk], { onSuccess, onError });
    }
  };

  return (
    <DropdownMenuItem
      onClick={(e) => {
        e.preventDefault();
        if (isShared) handleStopSharing();
        else handleStartSharing();
      }}
      disabled={isPending}
    >
      {isShared ? <Link2Off /> : <Share2 />}
      {isShared ? "Stop sharing" : "Start sharing"}
    </DropdownMenuItem>
  );
}
