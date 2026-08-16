import { apiClient } from "./client";
import type { AddCommentRequestDTO, CommentResponseDTO, LikeResponseDTO } from "./types";

export async function toggleLike(mediaId: number) {
  const { data } = await apiClient.post<LikeResponseDTO>(`/api/v1/media/${mediaId}/like`);
  return data;
}

export async function getComments(mediaId: number) {
  const { data } = await apiClient.get<CommentResponseDTO[]>(
    `/api/v1/media/${mediaId}/comments`
  );
  return data;
}

export async function addComment(mediaId: number, body: AddCommentRequestDTO) {
  const { data } = await apiClient.post<CommentResponseDTO>(
    `/api/v1/media/${mediaId}/comments`,
    body
  );
  return data;
}
