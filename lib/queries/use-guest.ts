"use client";

import { useMutation, useQuery } from "@tanstack/react-query";

import {
  getGuestEvent,
  getGuestEventFolderMedia,
  getGuestFolder,
  getGuestMediaDownloadUrl,
} from "@/lib/api/guest";
import { queryKeys } from "./keys";

export function useGuestEvent(token: string) {
  return useQuery({
    queryKey: queryKeys.guestEvent(token),
    queryFn: () => getGuestEvent(token),
    enabled: !!token,
  });
}

export function useGuestFolder(eventSlug: string, token: string) {
  return useQuery({
    queryKey: queryKeys.guestFolder(eventSlug, token),
    queryFn: () => getGuestFolder(eventSlug, token),
    enabled: !!eventSlug && !!token,
  });
}

export function useGuestFolderMedia(
  eventSlug: string,
  folderSlug: string,
  token: string
) {
  return useQuery({
    queryKey: queryKeys.guestFolderMedia(eventSlug, folderSlug, token),
    queryFn: () => getGuestEventFolderMedia(eventSlug, folderSlug, token),
    enabled: !!eventSlug && !!folderSlug && !!token,
  });
}

export function useGuestMediaDownloadUrl(
  token: string,
  eventSlug: string,
  folderSlug: string
) {
  return useMutation({
    mutationFn: (mediaId: number) =>
      getGuestMediaDownloadUrl(token, eventSlug, folderSlug, mediaId),
  });
}
