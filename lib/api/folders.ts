import { apiClient } from "./client";
import type { FolderRequestDTO, FolderResponseDTO } from "./types";

export async function getFoldersByEvent(eventSlug: string) {
  const { data } = await apiClient.get<FolderResponseDTO[]>(
    `/api/v1/events/${eventSlug}/folders`
  );
  return data;
}

export async function getFolderBySlug(eventSlug: string, folderSlug: string) {
  const { data } = await apiClient.get<FolderResponseDTO>(
    `/api/v1/events/${eventSlug}/folders/${folderSlug}`
  );
  return data;
}

export async function createFolder(
  eventSlug: string,
  body: FolderRequestDTO
) {
  const { data } = await apiClient.post<FolderResponseDTO>(
    `/api/v1/events/${eventSlug}/folders`,
    body
  );
  return data;
}

export async function updateFolder(
  eventSlug: string,
  folderSlug: string,
  body: FolderRequestDTO
) {
  const { data } = await apiClient.put<FolderResponseDTO>(
    `/api/v1/events/${eventSlug}/folders/${folderSlug}`,
    body
  );
  return data;
}

export async function deleteFolder(eventSlug: string, folderSlug: string) {
  await apiClient.delete(`/api/v1/events/${eventSlug}/folders/${folderSlug}`);
}
