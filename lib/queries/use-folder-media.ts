"use client";

import { useCallback } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  deleteMediaPermanently,
  generateMediaDownloadUrl,
  getMediaByFolder,
  getTrashedMedia,
  moveMediaAsset,
  removeMediaAsset,
  restoreMediaAsset,
} from "@/lib/api/media";
import { queryKeys } from "./keys";

export function useFolderMedia(eventSlug: string, folderSlug: string) {
  return useQuery({
    queryKey: queryKeys.folderMedia(eventSlug, folderSlug),
    queryFn: () => getMediaByFolder(eventSlug, folderSlug),
    enabled: !!eventSlug && !!folderSlug,
  });
}

export function useTrashedMedia(eventSlug: string, folderSlug: string) {
  return useQuery({
    queryKey: queryKeys.folderTrash(eventSlug, folderSlug),
    queryFn: () => getTrashedMedia(eventSlug, folderSlug),
    enabled: !!eventSlug && !!folderSlug,
  });
}

/** Refreshes the folder media list, e.g. after a Media Uploader upload completes. */
export function useInvalidateFolderMedia(eventSlug: string, folderSlug: string) {
  const queryClient = useQueryClient();
  return useCallback(
    () =>
      queryClient.invalidateQueries({
        queryKey: queryKeys.folderMedia(eventSlug, folderSlug),
      }),
    [queryClient, eventSlug, folderSlug]
  );
}

function useInvalidateAfterMediaChange(eventSlug: string, folderSlug: string) {
  const queryClient = useQueryClient();
  return useCallback(
    (...extraFolderSlugs: string[]) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.folderMedia(eventSlug, folderSlug) });
      queryClient.invalidateQueries({ queryKey: queryKeys.folderTrash(eventSlug, folderSlug) });
      queryClient.invalidateQueries({ queryKey: queryKeys.folder(eventSlug, folderSlug) });
      queryClient.invalidateQueries({ queryKey: queryKeys.folders(eventSlug) });
      for (const slug of extraFolderSlugs) {
        queryClient.invalidateQueries({ queryKey: queryKeys.folderMedia(eventSlug, slug) });
        queryClient.invalidateQueries({ queryKey: queryKeys.folder(eventSlug, slug) });
      }
    },
    [queryClient, eventSlug, folderSlug]
  );
}

/** Soft-deletes (trashes) a media asset. */
export function useRemoveMedia(eventSlug: string, folderSlug: string) {
  const invalidate = useInvalidateAfterMediaChange(eventSlug, folderSlug);
  return useMutation({
    mutationFn: (mediaId: number) => removeMediaAsset(eventSlug, folderSlug, mediaId),
    onSuccess: () => invalidate(),
  });
}

/** Restores a trashed media asset back into its folder. */
export function useRestoreMedia(eventSlug: string, folderSlug: string) {
  const invalidate = useInvalidateAfterMediaChange(eventSlug, folderSlug);
  return useMutation({
    mutationFn: (mediaId: number) => restoreMediaAsset(eventSlug, folderSlug, mediaId),
    onSuccess: () => invalidate(),
  });
}

/** Moves a media asset into a different folder within the same event. */
export function useMoveMedia(eventSlug: string, folderSlug: string) {
  const invalidate = useInvalidateAfterMediaChange(eventSlug, folderSlug);
  return useMutation({
    mutationFn: ({
      mediaId,
      targetFolderSlug,
    }: {
      mediaId: number;
      targetFolderSlug: string;
    }) => moveMediaAsset(eventSlug, folderSlug, mediaId, { targetFolderSlug }),
    onSuccess: (_data, variables) => invalidate(variables.targetFolderSlug),
  });
}

/** Permanently deletes an already-trashed media asset. */
export function useDeleteMediaPermanently(eventSlug: string, folderSlug: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (mediaId: number) => deleteMediaPermanently(eventSlug, folderSlug, mediaId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.folderTrash(eventSlug, folderSlug) });
    },
  });
}

export function useMediaDownloadUrl(eventSlug: string, folderSlug: string) {
  return useMutation({
    mutationFn: (mediaId: number) =>
      generateMediaDownloadUrl(eventSlug, folderSlug, mediaId),
  });
}
