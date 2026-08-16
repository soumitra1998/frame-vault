"use client";

import * as React from "react";
import axios from "axios";
import Uppy, { type Meta, type UppyFile } from "@uppy/core";
import AwsS3 from "@uppy/aws-s3";
import Dashboard from "@uppy/react/dashboard";

import {
  abortMultipartUpload,
  completeDirectUpload,
  completeMultipartUpload,
  initiateMultipartUpload,
  presignUpload,
  signMultipartPart,
} from "@/lib/api/media";
import { useInvalidateFolderMedia } from "@/lib/queries/use-folder-media";
import { cn } from "@/lib/utils";
import type { InitiateUploadRequestDTO, MediaType } from "@/lib/api/types";

/** Files at or above this size use S3 multipart upload instead of a single PUT. */
export const SMALL_FILE_THRESHOLD = 100 * 1024 * 1024; // 100 MB
/** Chunk size used to split large files into multipart upload parts. */
export const PART_SIZE = 10 * 1024 * 1024; // 10 MB
const CONCURRENT_UPLOADS = 4;

type UploadMode = "direct" | "multipart";

interface FileMeta {
  mediaId?: number;
  uploadMode?: UploadMode;
}

type AnyUppyFile = UppyFile<Record<string, unknown>, Record<string, unknown>>;

/** `file.meta` is stored as a plain record by Uppy; read our own fields off it. */
function metaOf(file: AnyUppyFile): FileMeta {
  return file.meta as FileMeta;
}

function mediaTypeFor(mimeType: string): MediaType {
  return mimeType.startsWith("video/") ? "VIDEO" : "PHOTO";
}

function initiateRequestFor(file: AnyUppyFile): InitiateUploadRequestDTO {
  return {
    fileName: file.name ?? "upload",
    fileSize: file.size ?? 0,
    mimeType: file.type || "application/octet-stream",
    mediaType: mediaTypeFor(file.type || ""),
  };
}

/** Turns raw backend/AWS errors into a message that's safe to show a user. */
function friendlyErrorMessage(error: unknown): string {
  const status = axios.isAxiosError(error) ? error.response?.status : undefined;
  if (status === 402 || status === 413) {
    return "Storage limit exceeded. Free up space or upgrade your plan.";
  }
  if (status === 415 || status === 400) {
    return "This file type isn't supported.";
  }
  if (status === 401 || status === 403) {
    return "You don't have permission to upload to this folder.";
  }
  if (status === 404) {
    return "This folder no longer exists.";
  }
  if (status && status >= 500) {
    return "The server had a problem finishing this upload. Please retry.";
  }
  if (axios.isAxiosError(error) && error.code === "ECONNABORTED") {
    return "Upload timed out. Please retry.";
  }
  return "Upload failed. Please retry.";
}

export interface MediaUploaderProps {
  eventSlug: string;
  folderSlug: string;
  /** Called once per completed upload batch that includes at least one successful file. */
  onUploadComplete?: () => void;
  className?: string;
}

export function MediaUploader({
  eventSlug,
  folderSlug,
  onUploadComplete,
  className,
}: MediaUploaderProps) {
  const invalidateFolderMedia = useInvalidateFolderMedia(eventSlug, folderSlug);

  const onUploadCompleteRef = React.useRef(onUploadComplete);
  React.useEffect(() => {
    onUploadCompleteRef.current = onUploadComplete;
  });

  // Created and torn down inside a single effect (not a `useState(() => new
  // Uppy())` initializer with a separate cleanup effect) so that React
  // StrictMode's dev-only mount→unmount→remount simulation always recreates
  // the instance it destroys, instead of destroying it once and never
  // reinstalling its plugins.
  const [uppy, setUppy] = React.useState<Uppy | null>(null);

  React.useEffect(() => {
    const instance = new Uppy({
      autoProceed: true,
      restrictions: {
        allowedFileTypes: ["image/*", "video/*"],
      },
    });

    instance.use(AwsS3, {
      limit: CONCURRENT_UPLOADS,
      shouldUseMultipart: (file) => (file.size ?? 0) >= SMALL_FILE_THRESHOLD,
      getChunkSize: () => PART_SIZE,

      // Small files: a single presigned PUT.
      getUploadParameters: async (file) => {
        try {
          const { mediaId, url } = await presignUpload(
            eventSlug,
            folderSlug,
            initiateRequestFor(file)
          );
          instance.setFileMeta(file.id, { mediaId, uploadMode: "direct" });
          return {
            method: "PUT",
            url,
            headers: { "Content-Type": file.type || "application/octet-stream" },
          };
        } catch (error) {
          throw new Error(friendlyErrorMessage(error));
        }
      },

      // Large files: S3 multipart upload.
      createMultipartUpload: async (file) => {
        try {
          const { mediaId, uploadId, objectKey } = await initiateMultipartUpload(
            eventSlug,
            folderSlug,
            initiateRequestFor(file)
          );
          instance.setFileMeta(file.id, { mediaId, uploadMode: "multipart" });
          return { uploadId, key: objectKey };
        } catch (error) {
          throw new Error(friendlyErrorMessage(error));
        }
      },
      listParts: async () => [],
      signPart: async (file, { partNumber }) => {
        const mediaId = metaOf(file).mediaId;
        if (mediaId == null) {
          throw new Error("Upload session is missing. Please retry.");
        }
        try {
          const { url } = await signMultipartPart(
            eventSlug,
            folderSlug,
            mediaId,
            partNumber
          );
          return { url };
        } catch (error) {
          throw new Error(friendlyErrorMessage(error));
        }
      },
      completeMultipartUpload: async (file, { uploadId, parts }) => {
        const mediaId = metaOf(file).mediaId;
        if (mediaId == null) {
          throw new Error("Upload session is missing. Please retry.");
        }
        try {
          await completeMultipartUpload(eventSlug, folderSlug, mediaId, {
            uploadId,
            parts: parts.map((part) => ({
              partNumber: part.PartNumber ?? 0,
              etag: part.ETag ?? "",
            })),
          });
          return {};
        } catch (error) {
          throw new Error(friendlyErrorMessage(error));
        }
      },
      abortMultipartUpload: async (file) => {
        const mediaId = metaOf(file).mediaId;
        if (mediaId == null) return;
        await abortMultipartUpload(eventSlug, folderSlug, mediaId).catch(() => {});
      },
    });

    // Direct (small-file) uploads still need a `complete-direct` call once the
    // S3 PUT succeeds; multipart uploads are already finalized server-side by
    // `completeMultipartUpload` above. A postprocessor is the correct Uppy
    // hook for this: it runs after the transport step, Dashboard shows a
    // "processing" state for it automatically, and a per-file failure here
    // (via `setFileState`) fails only that file rather than the whole batch.
    instance.addPostProcessor(async (fileIDs) => {
      await Promise.all(
        fileIDs.map(async (fileID) => {
          const file = instance.getFile(fileID);
          const meta = file ? metaOf(file) : undefined;
          if (!file || meta?.uploadMode !== "direct" || meta.mediaId == null) {
            return;
          }
          try {
            await completeDirectUpload(eventSlug, folderSlug, meta.mediaId);
          } catch (error) {
            instance.setFileState(fileID, { error: friendlyErrorMessage(error) });
          }
        })
      );
    });

    instance.on("complete", (result) => {
      if (result.successful && result.successful.length > 0) {
        invalidateFolderMedia();
        onUploadCompleteRef.current?.();
      }
    });

    // Deferred to a microtask so this isn't a same-tick setState-in-effect:
    // the Dashboard needs a real, ready-to-use instance as a prop, and this
    // still resolves before paint.
    queueMicrotask(() => setUppy(instance));

    return () => {
      instance.cancelAll();
      instance.destroy();
    };
  }, [eventSlug, folderSlug, invalidateFolderMedia]);

  if (!uppy) return null;

  return (
    <div
      className={cn(
        "media-uploader overflow-hidden rounded-xl border border-border",
        className
      )}
    >
      <Dashboard<Meta, Record<string, never>>
        uppy={uppy}
        theme="auto"
        height={380}
        proudlyDisplayPoweredByUppy={false}
        note="Photos and videos"
      />
    </div>
  );
}
