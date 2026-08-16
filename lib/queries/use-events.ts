"use client";

import axios from "axios";
import { useMutation, useQuery, useQueryClient, type QueryClient } from "@tanstack/react-query";

import {
  activateGuestLink,
  addGuestLinkFolders,
  createEvent,
  createGuestLink,
  deactivateGuestLink,
  deleteEvent,
  deleteGuestLink,
  getEventById,
  getEventBySlug,
  getGuestLink,
  getMyEvents,
  removeGuestLinkFolders,
  updateEvent,
} from "@/lib/api/events";
import type {
  CreateGuestLinkRequestDTO,
  EventRequestDTO,
  GuestLinkResponseDTO,
} from "@/lib/api/types";
import { queryKeys } from "./keys";

export function useMyEvents() {
  return useQuery({
    queryKey: queryKeys.myEvents,
    queryFn: getMyEvents,
  });
}

export function useEvent(eventSlug: string) {
  return useQuery({
    queryKey: queryKeys.event(eventSlug),
    queryFn: () => getEventBySlug(eventSlug),
    enabled: !!eventSlug,
  });
}

export function useEventById(eventId: number) {
  return useQuery({
    queryKey: queryKeys.eventById(eventId),
    queryFn: () => getEventById(eventId),
    enabled: !!eventId,
  });
}

export function useCreateEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: EventRequestDTO) => createEvent(body),
    onSuccess: (event) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.myEvents });
      queryClient.setQueryData(queryKeys.event(event.slug), event);
    },
  });
}

export function useUpdateEvent(eventId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: EventRequestDTO) => updateEvent(eventId, body),
    onSuccess: (event) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.myEvents });
      queryClient.setQueryData(queryKeys.eventById(eventId), event);
      queryClient.setQueryData(queryKeys.event(event.slug), event);
    },
  });
}

export function useDeleteEvent() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (eventId: number) => deleteEvent(eventId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.myEvents });
    },
  });
}

// --- Guest links -----------------------------------------------------------
//
// `GuestLinkResponseDTO` never reports which folders are attached to the
// link, only the link record itself. So the set of shared folder IDs is
// tracked client-side (in a dedicated query-cache entry that's never
// refetched, only updated by these mutations) rather than fetched from the
// server. That's accurate for changes made in this browser session, but a
// link created or edited elsewhere won't be reflected until touched again
// here — a real limitation of the current API, not a bug in this code.

function setGuestLinkCache(
  queryClient: QueryClient,
  eventSlug: string,
  link: GuestLinkResponseDTO | null
) {
  queryClient.setQueryData(queryKeys.guestLink(eventSlug), link);
}

function updateGuestLinkFolderIds(
  queryClient: QueryClient,
  eventSlug: string,
  updater: (prev: number[]) => number[]
) {
  queryClient.setQueryData<number[]>(
    queryKeys.guestLinkFolders(eventSlug),
    (prev = []) => updater(prev)
  );
}

/** The event's guest link, or `null` if none exists (never created, or expired). */
export function useGuestLink(eventSlug: string) {
  return useQuery({
    queryKey: queryKeys.guestLink(eventSlug),
    queryFn: async () => {
      try {
        return await getGuestLink(eventSlug);
      } catch (error) {
        if (axios.isAxiosError(error) && error.response?.status === 400) {
          return null;
        }
        throw error;
      }
    },
    enabled: !!eventSlug,
  });
}

/** Folder IDs currently attached to the guest link — see note above. */
export function useGuestLinkFolderIds(eventSlug: string) {
  return useQuery({
    queryKey: queryKeys.guestLinkFolders(eventSlug),
    queryFn: (): number[] => [],
    enabled: !!eventSlug,
    staleTime: Infinity,
  });
}

export function useCreateGuestLink(eventSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (body: CreateGuestLinkRequestDTO) =>
      createGuestLink(eventSlug, body),
    onSuccess: (link, variables) => {
      setGuestLinkCache(queryClient, eventSlug, link);
      updateGuestLinkFolderIds(queryClient, eventSlug, () => variables.folderIds);
    },
  });
}

export function useDeleteGuestLink(eventSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => deleteGuestLink(eventSlug),
    onSuccess: () => {
      setGuestLinkCache(queryClient, eventSlug, null);
      updateGuestLinkFolderIds(queryClient, eventSlug, () => []);
    },
  });
}

export function useSetGuestLinkActive(eventSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (active: boolean) =>
      active ? activateGuestLink(eventSlug) : deactivateGuestLink(eventSlug),
    onSuccess: (link) => setGuestLinkCache(queryClient, eventSlug, link),
  });
}

export function useAddGuestLinkFolders(eventSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (folderIds: number[]) => addGuestLinkFolders(eventSlug, folderIds),
    onSuccess: (link, folderIds) => {
      setGuestLinkCache(queryClient, eventSlug, link);
      updateGuestLinkFolderIds(queryClient, eventSlug, (prev) =>
        Array.from(new Set([...prev, ...folderIds]))
      );
    },
  });
}

export function useRemoveGuestLinkFolders(eventSlug: string) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (folderIds: number[]) => removeGuestLinkFolders(eventSlug, folderIds),
    onSuccess: (link, folderIds) => {
      setGuestLinkCache(queryClient, eventSlug, link);
      updateGuestLinkFolderIds(queryClient, eventSlug, (prev) =>
        prev.filter((id) => !folderIds.includes(id))
      );
    },
  });
}
