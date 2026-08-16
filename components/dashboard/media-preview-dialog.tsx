"use client";

import * as React from "react";
import { Camera, ChevronLeft, ChevronRight, Heart, Send } from "lucide-react";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Spinner } from "@/components/ui/spinner";
import { MediaActionsMenu } from "@/components/dashboard/media-actions-menu";
import { useToggleLike, useComments, useAddComment } from "@/lib/queries/use-engagement";
import { formatBytes, formatRelativeDate } from "@/lib/dashboard/utils";
import { toast } from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import type { MediaAssetResponseDTO } from "@/lib/api/types";

export function MediaPreviewDialog({
  eventSlug,
  folderSlug,
  asset,
  open,
  onOpenChange,
  onMove,
  onRemoved,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: {
  eventSlug: string;
  folderSlug: string;
  asset: MediaAssetResponseDTO | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onMove: (asset: MediaAssetResponseDTO) => void;
  onRemoved?: (asset: MediaAssetResponseDTO) => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        showCloseButton
        className="grid-rows-[auto_1fr] gap-0 overflow-hidden p-0 sm:max-w-4xl"
      >
        {open && asset ? (
          <MediaPreviewBody
            key={asset.frmvmdaPk}
            eventSlug={eventSlug}
            folderSlug={folderSlug}
            asset={asset}
            onOpenChange={onOpenChange}
            onMove={onMove}
            onRemoved={onRemoved}
            onPrev={onPrev}
            onNext={onNext}
            hasPrev={hasPrev}
            hasNext={hasNext}
          />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function MediaPreviewBody({
  eventSlug,
  folderSlug,
  asset,
  onOpenChange,
  onMove,
  onRemoved,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: {
  eventSlug: string;
  folderSlug: string;
  asset: MediaAssetResponseDTO;
  onOpenChange: (open: boolean) => void;
  onMove: (asset: MediaAssetResponseDTO) => void;
  onRemoved?: (asset: MediaAssetResponseDTO) => void;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}) {
  // The API has no "current like state" field on the media asset itself and
  // no GET endpoint for it — only a toggle. So liked/count stay unknown
  // (neutral heart, no count) until the user toggles at least once here.
  const [likeState, setLikeState] = React.useState<{ liked: boolean; totalLikes: number } | null>(
    null
  );
  const toggleLike = useToggleLike(asset.frmvmdaPk);
  const { data: comments, isLoading: commentsLoading } = useComments(asset.frmvmdaPk, true);
  const addComment = useAddComment(asset.frmvmdaPk);
  const [commentBody, setCommentBody] = React.useState("");

  const handleLike = () => {
    toggleLike.mutate(undefined, {
      onSuccess: (result) =>
        setLikeState({ liked: result.liked, totalLikes: result.totalLikes }),
      onError: () => {
        toast.add({
          title: "Couldn't update like",
          description: "Something went wrong. Please try again.",
          type: "error",
        });
      },
    });
  };

  const handleAddComment = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const body = commentBody.trim();
    if (!body) return;
    addComment.mutate(
      { body },
      {
        onSuccess: () => setCommentBody(""),
        onError: () => {
          toast.add({
            title: "Couldn't post comment",
            description: "Something went wrong. Please try again.",
            type: "error",
          });
        },
      }
    );
  };

  return (
    <>
      <DialogTitle className="sr-only">{asset.originalFilename}</DialogTitle>
      <DialogDescription className="sr-only">
        Preview of {asset.originalFilename}
      </DialogDescription>

      <div className="relative flex max-h-[70vh] items-center justify-center bg-black">
        {asset.previewUrl ? (
          asset.mediaType === "VIDEO" ? (
            <video
              key={asset.frmvmdaPk}
              src={asset.previewUrl}
              controls
              autoPlay
              className="max-h-[70vh] w-full object-contain"
            />
          ) : (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={asset.previewUrl}
              alt={asset.originalFilename}
              className="max-h-[70vh] w-full object-contain"
            />
          )
        ) : (
          <div className="flex h-64 w-full items-center justify-center text-muted-foreground/40">
            <Camera className="size-10" strokeWidth={1.5} />
          </div>
        )}

        <div className="absolute top-3 left-3">
          <MediaActionsMenu
            eventSlug={eventSlug}
            folderSlug={folderSlug}
            asset={asset}
            onMove={onMove}
            onRemoved={(removed) => {
              onRemoved?.(removed);
              onOpenChange(false);
            }}
          />
        </div>

        {hasPrev ? (
          <Button
            variant="outline"
            size="icon"
            className="absolute top-1/2 left-3 -translate-y-1/2 bg-background/80"
            aria-label="Previous"
            onClick={onPrev}
          >
            <ChevronLeft />
          </Button>
        ) : null}
        {hasNext ? (
          <Button
            variant="outline"
            size="icon"
            className="absolute top-1/2 right-3 -translate-y-1/2 bg-background/80"
            aria-label="Next"
            onClick={onNext}
          >
            <ChevronRight />
          </Button>
        ) : null}
      </div>

      <div className="flex max-h-[40vh] flex-col gap-4 overflow-y-auto p-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="min-w-0">
            <p className="truncate text-sm font-medium">{asset.originalFilename}</p>
            <p className="text-xs text-muted-foreground">
              {formatBytes(asset.fileSizeBytes)} · {formatRelativeDate(asset.uploadedAt)}
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            className="gap-1.5"
            onClick={handleLike}
            disabled={toggleLike.isPending}
          >
            <Heart
              className={cn(
                "transition-colors",
                likeState?.liked ? "fill-destructive text-destructive" : "text-muted-foreground"
              )}
            />
            {likeState ? likeState.totalLikes : "Like"}
          </Button>
        </div>

        <div className="flex flex-col gap-3">
          {commentsLoading ? (
            <p className="text-sm text-muted-foreground">Loading comments…</p>
          ) : !comments || comments.length === 0 ? (
            <p className="text-sm text-muted-foreground">No comments yet.</p>
          ) : (
            comments.map((comment) => (
              <div key={comment.frmvcmtPk} className="flex items-start gap-2.5">
                <Avatar size="sm">
                  <AvatarFallback>
                    {(comment.authorName ?? "?").charAt(0).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1">
                  <p className="text-sm">
                    <span className="font-medium">{comment.authorName ?? "Someone"}</span>{" "}
                    <span className="text-muted-foreground">
                      {formatRelativeDate(comment.createdAt)}
                    </span>
                  </p>
                  <p className="text-sm break-words">{comment.body}</p>
                </div>
              </div>
            ))
          )}
        </div>

        <form onSubmit={handleAddComment} className="flex items-start gap-2">
          <Textarea
            value={commentBody}
            onChange={(e) => setCommentBody(e.target.value)}
            placeholder="Add a comment…"
            maxLength={1000}
            className="min-h-9"
          />
          <Button
            type="submit"
            size="icon"
            aria-label="Post comment"
            disabled={!commentBody.trim() || addComment.isPending}
          >
            {addComment.isPending ? <Spinner /> : <Send />}
          </Button>
        </form>
      </div>
    </>
  );
}
