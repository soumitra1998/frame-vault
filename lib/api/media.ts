import { apiClient } from "./client";
import type {
  CompleteUploadRequestDTO,
  InitiateUploadRequestDTO,
  InitiateUploadResponseDTO,
  MediaAssetResponseDTO,
  MoveMediaRequestDTO,
  PresignUploadResponseDTO,
  SignPartResponseDTO,
} from "./types";

export async function getMediaByFolder(eventSlug: string, folderSlug: string) {
  const { data } = await apiClient.get<MediaAssetResponseDTO[]>(
    `/api/v1/events/${eventSlug}/folders/${folderSlug}/media`
  );
  return data;
}

/** Soft-deletes a media asset: moves it into the folder's trash/bin. */
export async function removeMediaAsset(
  eventSlug: string,
  folderSlug: string,
  mediaId: number
) {
  await apiClient.put(
    `/api/v1/events/${eventSlug}/folders/${folderSlug}/media/${mediaId}/remove`
  );
}

/** Restores a trashed media asset back to its folder. */
export async function restoreMediaAsset(
  eventSlug: string,
  folderSlug: string,
  mediaId: number
) {
  const { data } = await apiClient.put<MediaAssetResponseDTO>(
    `/api/v1/events/${eventSlug}/folders/${folderSlug}/media/${mediaId}/restore`
  );
  return data;
}

/**
 * Moves a media asset from its current folder into `targetFolderSlug`.
 * `MoveMediaRequestDTO` in server-api.json only documents `targetFolderSlug`,
 * so `mediaId` is also sent as a query param — matching how this backend
 * already omits some real parameters (e.g. `currentUser`) from its generated
 * OpenAPI doc for custom-resolved arguments.
 */
export async function moveMediaAsset(
  eventSlug: string,
  folderSlug: string,
  mediaId: number,
  body: MoveMediaRequestDTO
) {
  await apiClient.put(
    `/api/v1/events/${eventSlug}/folders/${folderSlug}/media/move`,
    body,
    { params: { mediaId } }
  );
}

export async function getTrashedMedia(eventSlug: string, folderSlug: string) {
  const { data } = await apiClient.get<MediaAssetResponseDTO[]>(
    `/api/v1/events/${eventSlug}/folders/${folderSlug}/media/trash`
  );
  return data;
}

/** Permanently deletes an already-trashed media asset. */
export async function deleteMediaPermanently(
  eventSlug: string,
  folderSlug: string,
  mediaId: number
) {
  await apiClient.delete(
    `/api/v1/events/${eventSlug}/folders/${folderSlug}/media/${mediaId}/trash`
  );
}

export async function generateMediaDownloadUrl(
  eventSlug: string,
  folderSlug: string,
  mediaId: number
) {
  const { data } = await apiClient.get<string>(
    `/api/v1/events/${eventSlug}/folders/${folderSlug}/media/${mediaId}/download`
  );
  return data;
}

/** Small-file (direct) upload: single presigned PUT URL. */
export async function presignUpload(
  eventSlug: string,
  folderSlug: string,
  body: InitiateUploadRequestDTO
) {
  const { data } = await apiClient.post<PresignUploadResponseDTO>(
    `/api/v1/events/${eventSlug}/folders/${folderSlug}/media/presign`,
    body
  );
  return data;
}

export async function completeDirectUpload(
  eventSlug: string,
  folderSlug: string,
  mediaId: number
) {
  const { data } = await apiClient.post<MediaAssetResponseDTO>(
    `/api/v1/events/${eventSlug}/folders/${folderSlug}/media/${mediaId}/complete-direct`
  );
  return data;
}

/** Large-file upload: begins an S3 multipart upload session. */
export async function initiateMultipartUpload(
  eventSlug: string,
  folderSlug: string,
  body: InitiateUploadRequestDTO
) {
  const { data } = await apiClient.post<InitiateUploadResponseDTO>(
    `/api/v1/events/${eventSlug}/folders/${folderSlug}/media/initiate`,
    body
  );
  return data;
}

export async function signMultipartPart(
  eventSlug: string,
  folderSlug: string,
  mediaId: number,
  partNumber: number
) {
  const { data } = await apiClient.post<SignPartResponseDTO>(
    `/api/v1/events/${eventSlug}/folders/${folderSlug}/media/${mediaId}/parts/${partNumber}/sign`
  );
  return data;
}

export async function completeMultipartUpload(
  eventSlug: string,
  folderSlug: string,
  mediaId: number,
  body: CompleteUploadRequestDTO
) {
  const { data } = await apiClient.post<MediaAssetResponseDTO>(
    `/api/v1/events/${eventSlug}/folders/${folderSlug}/media/${mediaId}/complete`,
    body
  );
  return data;
}

export async function abortMultipartUpload(
  eventSlug: string,
  folderSlug: string,
  mediaId: number
) {
  await apiClient.post(
    `/api/v1/events/${eventSlug}/folders/${folderSlug}/media/${mediaId}/abort`
  );
}
