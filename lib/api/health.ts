import { apiClient } from "./client";

export async function healthCheck() {
  const { data } = await apiClient.get<string>("/api/v1/health");
  return data;
}

export async function sendWelcomeEmail(email: string, name: string) {
  const { data } = await apiClient.post<string>(
    "/api/v1/health/welcome",
    null,
    { params: { email, name } }
  );
  return data;
}
