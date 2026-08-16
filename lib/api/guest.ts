import { apiClient } from "./client";
import type {
  EventResponseDTO,
  FolderResponseDTO,
  GuestGalleryResponseDTO,
} from "./types";

export async function getGuestEvent(token: string) {
  const { data } = await apiClient.get<EventResponseDTO>(
    `/api/v1/guest/event/${token}`
  );
  return data;
}

export async function getGuestFolder(eventSlug: string, token: string) {
  const { data } = await apiClient.get<FolderResponseDTO[]>(
    `/api/v1/guest/event/${eventSlug}/folders/${token}`
  );
  return data;
}

export async function getGuestEventFolderMedia(
  eventSlug: string,
  folderSlug: string,
  token: string
) {
  const { data } = await apiClient.get<GuestGalleryResponseDTO>(
    `/api/v1/guest/event/${eventSlug}/folders/${folderSlug}/media/${token}`
  );
  return data;
}

/** Resolves a presigned, time-limited S3 URL for downloading one guest-visible media asset. */
export async function getGuestMediaDownloadUrl(
  token: string,
  eventSlug: string,
  folderSlug: string,
  mediaId: number
) {
  const { data } = await apiClient.get<string>(
    `/api/v1/guest/${token}/event/${eventSlug}/folders/${folderSlug}/media/${mediaId}/download`
  );
  return data;
}
