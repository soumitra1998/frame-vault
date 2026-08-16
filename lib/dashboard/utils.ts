export function formatBytes(bytes: number) {
  if (bytes <= 0) return "0 MB";
  const units = ["B", "KB", "MB", "GB", "TB"];
  const exponent = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1
  );
  const value = bytes / Math.pow(1024, exponent);
  return `${value >= 100 ? Math.round(value) : value.toFixed(1)} ${units[exponent]}`;
}

export const TRASH_RETENTION_DAYS = Number(
  process.env.NEXT_PUBLIC_TRASH_RETENTION_DAYS ?? 60
);

/** Days left before a trashed media asset is permanently deleted (never negative). */
export function daysUntilPermanentDeletion(removeAt: string) {
  const removedAtMs = new Date(removeAt).getTime();
  const deleteAtMs = removedAtMs + TRASH_RETENTION_DAYS * 24 * 60 * 60 * 1000;
  const daysLeft = Math.ceil((deleteAtMs - Date.now()) / (1000 * 60 * 60 * 24));
  return Math.max(0, daysLeft);
}

export function formatRelativeDate(iso: string) {
  const date = new Date(iso);
  const diffMs = Date.now() - date.getTime();
  const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 0) return "Today";
  if (diffDays === 1) return "Yesterday";
  if (diffDays < 30) return `${diffDays} days ago`;

  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}
