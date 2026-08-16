import type { GuestLinkResponseDTO } from "@/lib/api/types";

/**
 * The backend's `url` field points at its own API host (e.g.
 * `http://localhost:8080/api/v1/guest/...`), not the guest-facing frontend
 * route. The link shown/copied/QR-encoded in the UI is built from this app's
 * own origin instead, using only the `token` the backend issued.
 */
export function getGuestLinkUrl(link: Pick<GuestLinkResponseDTO, "token">): string {
  const origin = typeof window !== "undefined" ? window.location.origin : "";
  return `${origin}/guest/${link.token}`;
}
