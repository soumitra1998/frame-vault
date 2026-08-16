"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { addComment, getComments, toggleLike } from "@/lib/api/engagement";
import type { AddCommentRequestDTO } from "@/lib/api/types";
import { queryKeys } from "./keys";

export function useToggleLike(mediaId: number) {
  return useMutation({
    mutationFn: () => toggleLike(mediaId),
  });
}

export function useComments(mediaId: number, enabled = true) {
  return useQuery({
    queryKey: queryKeys.comments(mediaId),
    queryFn: () => getComments(mediaId),
    enabled: enabled && !!mediaId,
  });
}

export function useAddComment(mediaId: number) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (body: AddCommentRequestDTO) => addComment(mediaId, body),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.comments(mediaId) });
    },
  });
}
