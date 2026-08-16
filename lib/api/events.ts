import { apiClient } from "./client";
import type {
  CreateGuestLinkRequestDTO,
  EventRequestDTO,
  EventResponseDTO,
  GuestLinkResponseDTO,
  MyEventsResponseDTO,
} from "./types";

export async function getMyEvents() {
  const { data } = await apiClient.get<MyEventsResponseDTO>(
    "/api/v1/event/my-events"
  );
  return data;
}

export async function getEventBySlug(slugUrl: string) {
  const { data } = await apiClient.get<EventResponseDTO>("/api/v1/event", {
    params: { slugUrl },
  });
  return data;
}

export async function getEventById(eventId: number) {
  const { data } = await apiClient.get<EventResponseDTO>(
    `/api/v1/event/${eventId}`
  );
  return data;
}

export async function createEvent(body: EventRequestDTO) {
  const { data } = await apiClient.post<EventResponseDTO>(
    "/api/v1/event",
    body
  );
  return data;
}

export async function updateEvent(eventId: number, body: EventRequestDTO) {
  const { data } = await apiClient.put<EventResponseDTO>(
    `/api/v1/event/${eventId}`,
    body
  );
  return data;
}

export async function deleteEvent(eventId: number) {
  await apiClient.delete(`/api/v1/event/${eventId}`);
}

export async function createGuestLink(
  eventSlug: string,
  body: CreateGuestLinkRequestDTO
) {
  const { data } = await apiClient.post<GuestLinkResponseDTO>(
    `/api/v1/event/${eventSlug}/guest-links`,
    body
  );
  return data;
}

/**
 * Throws (400) when the event has no active guest link — either none was ever
 * created, or the last one expired. Callers should treat that as "no link".
 */
export async function getGuestLink(eventSlug: string) {
  const { data } = await apiClient.get<GuestLinkResponseDTO>(
    `/api/v1/event/${eventSlug}/guest-links`
  );
  return data;
}

export async function deleteGuestLink(eventSlug: string) {
  await apiClient.delete(`/api/v1/event/${eventSlug}/guest-links`);
}

export async function activateGuestLink(eventSlug: string) {
  const { data } = await apiClient.put<GuestLinkResponseDTO>(
    `/api/v1/event/${eventSlug}/guest-links/activate`
  );
  return data;
}

export async function deactivateGuestLink(eventSlug: string) {
  const { data } = await apiClient.put<GuestLinkResponseDTO>(
    `/api/v1/event/${eventSlug}/guest-links/deactivate`
  );
  return data;
}

export async function addGuestLinkFolders(eventSlug: string, folderIds: number[]) {
  const { data } = await apiClient.post<GuestLinkResponseDTO>(
    `/api/v1/event/${eventSlug}/guest-links/folders`,
    { folderIds }
  );
  return data;
}

export async function removeGuestLinkFolders(eventSlug: string, folderIds: number[]) {
  const { data } = await apiClient.delete<GuestLinkResponseDTO>(
    `/api/v1/event/${eventSlug}/guest-links/folders`,
    { data: { folderIds } }
  );
  return data;
}
