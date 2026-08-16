"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  createFolder,
  deleteFolder,
  getFolderBySlug,
  getFoldersByEvent,
  updateFolder,
} from "@/lib/api/folders";
import type { FolderRequestDTO } from "@/lib/api/types";
import { queryKeys } from "./keys";

export function useFolders(eventSlug: string) {
  return useQuery({
    queryKey: queryKeys.folders(eventSlug),
    queryFn: () => getFoldersByEvent(eventSlug),
    enabled: !!eventSlug,
  });
}

export function useFolder(eventSlug: string, folderSlug: string) {
  return useQuery({
    queryKey: queryKeys.folder(eventSlug, folderSlug),
    queryFn: () => getFolderBySlug(eventSlug, folderSlug),
    enabled: !!eventSlug && !!folderSlug,
  });
}

export function useCreateFolder(eventSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: FolderRequestDTO) => createFolder(eventSlug, body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.folders(eventSlug),
      });
    },
  });
}

export function useUpdateFolder(eventSlug: string, folderSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: FolderRequestDTO) =>
      updateFolder(eventSlug, folderSlug, body),
    onSuccess: (folder) => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.folders(eventSlug),
      });
      queryClient.setQueryData(
        queryKeys.folder(eventSlug, folderSlug),
        folder
      );
    },
  });
}

export function useDeleteFolder(eventSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (folderSlug: string) => deleteFolder(eventSlug, folderSlug),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.folders(eventSlug),
      });
    },
  });
}
