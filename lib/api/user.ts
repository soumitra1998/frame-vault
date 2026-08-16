import { apiClient } from "./client";
import type { UserResponseDTO } from "./types";

export async function getCurrentUser() {
  const { data } = await apiClient.get<UserResponseDTO>("/api/v1/user/me");
  return data;
}

export async function getUserById(userId: number) {
  const { data } = await apiClient.get<UserResponseDTO>(
    `/api/v1/user/${userId}`
  );
  return data;
}
