export const queryKeys = {
  currentUser: ["current-user"] as const,
  userById: (userId: number) => ["user", userId] as const,
  myEvents: ["events", "my"] as const,
  event: (eventSlug: string) => ["events", "detail", eventSlug] as const,
  eventById: (eventId: number) => ["events", "detail-id", eventId] as const,
  folders: (eventSlug: string) => ["events", eventSlug, "folders"] as const,
  folder: (eventSlug: string, folderSlug: string) =>
    ["events", eventSlug, "folders", folderSlug] as const,
  folderMedia: (eventSlug: string, folderSlug: string) =>
    ["events", eventSlug, "folders", folderSlug, "media"] as const,
  folderTrash: (eventSlug: string, folderSlug: string) =>
    ["events", eventSlug, "folders", folderSlug, "media", "trash"] as const,
  guestLink: (eventSlug: string) => ["events", eventSlug, "guest-link"] as const,
  guestLinkFolders: (eventSlug: string) =>
    ["events", eventSlug, "guest-link", "folders"] as const,
  subscription: ["subscription"] as const,
  storageInfo: ["subscription", "storage"] as const,
  comments: (mediaId: number) => ["media", mediaId, "comments"] as const,
  guestEvent: (token: string) => ["guest", "event", token] as const,
  guestFolder: (eventSlug: string, token: string) =>
    ["guest", "event", eventSlug, "folders", token] as const,
  guestFolderMedia: (
    eventSlug: string,
    folderSlug: string,
    token: string
  ) => ["guest", "event", eventSlug, "folders", folderSlug, "media", token] as const,
};
