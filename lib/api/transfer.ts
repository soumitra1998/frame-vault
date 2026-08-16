import { apiClient } from "./client";
import type { EventResponseDTO } from "./types";

export async function claimOwnership(token: string) {
  const { data } = await apiClient.post<EventResponseDTO>(
    "/api/v1/event/transfer/claim",
    null,
    { params: { token } }
  );
  return data;
}
