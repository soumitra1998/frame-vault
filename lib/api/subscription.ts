import { apiClient } from "./client";
import type { StorageInfoResponseDTO, SubscriptionResponseDTO } from "./types";

export async function getSubscription() {
  const { data } = await apiClient.get<SubscriptionResponseDTO>(
    "/api/v1/subscription"
  );
  return data;
}

export async function getStorageInfo() {
  const { data } = await apiClient.get<StorageInfoResponseDTO>(
    "/api/v1/subscription/storage"
  );
  return data;
}
