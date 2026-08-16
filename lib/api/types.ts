// Mirrors the schemas in local-dummy/server-api.json (FrameVault OpenAPI spec).
// Keep field names identical to the DTOs so this stays a thin, swappable layer.

export type EventVisibility = "PRIVATE" | "PUBLIC";
export type FolderVisibility = "PRIMARY_ONLY" | "CLIENT_ONLY" | "GUEST_ONLY";
export type MediaType = "PHOTO" | "VIDEO";
export type ProcessingStatus = "UPLOADING" | "PROCESSING" | "READY" | "FAILED";
export type MediaAssetStatus = "ACTIVE" | "REMOVED";
export type TransferStatus =
  | "NOT_SET"
  | "PENDING"
  | "NOTIFIED"
  | "ACCEPTED"
  | "EXPIRED"
  | "CANCELLED";

export interface EventRequestDTO {
  title: string;
  description?: string;
  visibility?: EventVisibility;
  secondaryOwnerEmail?: string;
  handoverDueAt?: string;
}

export interface EventResponseDTO {
  frmvevtPk: number;
  title: string;
  description?: string;
  visibility: EventVisibility;
  slug: string;
  totalPhotos: number;
  totalVideos: number;
  totalSizeBytes: number;
  transferStatus?: TransferStatus;
  transferScheduleAt?: string;
  transferClaimedAt?: string;
  createdAt: string;
  updatedAt: string;
  isOwner?: string;
}

export interface FolderRequestDTO {
  title: string;
  description?: string;
  visibility?: FolderVisibility;
}

export interface FolderResponseDTO {
  frmvfldPk: number;
  eventId: number;
  title: string;
  description?: string;
  slug: string;
  visibility: FolderVisibility;
  totalPhotos: number;
  totalVideos: number;
  totalSizeBytes: number;
  createdAt: string;
  updatedAt: string;
}

export interface MyEventsResponseDTO {
  ownedEvents: EventResponseDTO[];
  sharedEvents: EventResponseDTO[];
  totalOwnedEvents: number;
  totalSharedEvents: number;
}

export interface UserResponseDTO {
  frmvusrPk: number;
  name?: string;
  email?: string;
  phoneNumber?: string;
  profileImageUrl?: string;
  aboutMe?: string;
  role?: "STUDIO" | "USER";
  studioName?: string;
  studioAddress?: string;
  studioLogoUrl?: string;
  instagramUrl?: string;
  facebookUrl?: string;
  websiteUrl?: string;
  disabled?: boolean;
  version?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface SubscriptionResponseDTO {
  frmvsubPk: number;
  planName: string;
  planDisplayName: string;
  storageLimitGb: number;
  priceMonthly: number;
  status: string;
  storageUsedGb: number;
  storageUsedBytes: number;
  storageAvailableBytes: number;
  storagePercentageUsed: number;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
}

export interface StorageInfoResponseDTO {
  limitGb: number;
  usedBytes: number;
  usedGb: number;
  availableBytes: number;
  percentageUsed: number;
}

export interface MediaAssetResponseDTO {
  frmvmdaPk: number;
  objectKey: string;
  thumbnailUrl?: string;
  previewUrl?: string;
  mediaType: MediaType;
  originalFilename: string;
  fileSizeBytes: number;
  width?: number;
  height?: number;
  durationSeconds?: number;
  processingStatus: ProcessingStatus;
  mediaStatus: MediaAssetStatus;
  removeAt?: string;
  uploadedAt: string;
}

export interface MoveMediaRequestDTO {
  targetFolderSlug: string;
}

export interface LikeResponseDTO {
  mediaId: number;
  liked: boolean;
  totalLikes: number;
}

export interface AddCommentRequestDTO {
  body: string;
  parentCommentId?: number;
}

export interface CommentResponseDTO {
  frmvcmtPk: number;
  body: string;
  authorName?: string;
  totalReplies: number;
  replies: CommentResponseDTO[];
  createdAt: string;
}

export interface InitiateUploadRequestDTO {
  fileName: string;
  fileSize: number;
  mimeType: string;
  mediaType: MediaType;
}

export interface PresignUploadResponseDTO {
  mediaId: number;
  objectKey: string;
  url: string;
  expiresInSeconds: number;
}

export interface InitiateUploadResponseDTO {
  mediaId: number;
  uploadId: string;
  objectKey: string;
  partSize: number;
}

export interface SignPartResponseDTO {
  url: string;
}

export interface CompletedPartRequestDTO {
  partNumber: number;
  etag: string;
}

export interface CompleteUploadRequestDTO {
  uploadId: string;
  parts: CompletedPartRequestDTO[];
}

export interface CreateGuestLinkRequestDTO {
  folderIds: number[];
  label?: string;
  expiresAt?: string;
  allowDownload?: boolean;
  watermarkEnabled?: boolean;
}

export interface GuestLinkResponseDTO {
  frmvglsPk: number;
  token: string;
  url: string;
  label?: string;
  allowDownload: boolean;
  watermarkEnabled: boolean;
  expiresAt?: string;
  viewCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface GuestGalleryResponseDTO {
  eventTitle: string;
  allowDownload: boolean;
  watermarkEnabled: boolean;
  media: MediaAssetResponseDTO[];
}
