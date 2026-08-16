"use client";

import * as React from "react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useUpdateEvent } from "@/lib/queries/use-events";
import type { EventResponseDTO, EventVisibility } from "@/lib/api/types";

export function EditEventDialog({
  event,
  open,
  onOpenChange,
}: {
  event: EventResponseDTO;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {open ? (
          <EditEventForm event={event} onOpenChange={onOpenChange} />
        ) : null}
      </DialogContent>
    </Dialog>
  );
}

function EditEventForm({
  event,
  onOpenChange,
}: {
  event: EventResponseDTO;
  onOpenChange: (open: boolean) => void;
}) {
  const updateEvent = useUpdateEvent(event.frmvevtPk);
  const [title, setTitle] = React.useState(event.title);
  const [description, setDescription] = React.useState(
    event.description ?? ""
  );
  const [visibility, setVisibility] = React.useState<EventVisibility>(
    event.visibility
  );
  const [secondaryOwnerEmail, setSecondaryOwnerEmail] = React.useState("");
  const [handoverDueAt, setHandoverDueAt] = React.useState("");

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!title.trim()) return;

    updateEvent.mutate(
      {
        title,
        description,
        visibility,
        secondaryOwnerEmail: secondaryOwnerEmail.trim() || undefined,
        handoverDueAt: handoverDueAt || undefined,
      },
      {
        onSuccess: () => {
          onOpenChange(false);
        },
      }
    );
  };

  return (
    <form onSubmit={handleSubmit}>
      <DialogHeader>
        <DialogTitle>Edit event</DialogTitle>
        <DialogDescription>
          Update the details for this event.
        </DialogDescription>
      </DialogHeader>

      <FieldGroup className="py-4">
        <Field>
          <FieldLabel htmlFor="edit-event-title">Title</FieldLabel>
          <Input
            id="edit-event-title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            maxLength={255}
            required
            autoFocus
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="edit-event-description">
            Description
            <span className="ml-auto text-xs font-normal text-muted-foreground">
              Optional
            </span>
          </FieldLabel>
          <Textarea
            id="edit-event-description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            maxLength={255}
          />
        </Field>

        <Field>
          <FieldLabel htmlFor="edit-event-visibility">Visibility</FieldLabel>
          <Select
            value={visibility}
            onValueChange={(value) => {
              const next = value as EventVisibility;
              setVisibility(next);
              if (next !== "PUBLIC") {
                setSecondaryOwnerEmail("");
                setHandoverDueAt("");
              }
            }}
          >
            <SelectTrigger id="edit-event-visibility" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="PRIVATE">Private — only you</SelectItem>
              <SelectItem value="PUBLIC">Public — shareable link</SelectItem>
            </SelectContent>
          </Select>
        </Field>

        {visibility === "PUBLIC" ? (
          <>
            <Field>
              <FieldLabel htmlFor="edit-event-secondary-owner-email">
                Secondary owner email
                <span className="ml-auto text-xs font-normal text-muted-foreground">
                  Optional
                </span>
              </FieldLabel>
              <Input
                id="edit-event-secondary-owner-email"
                type="email"
                placeholder="client@example.com"
                value={secondaryOwnerEmail}
                onChange={(e) => setSecondaryOwnerEmail(e.target.value)}
                minLength={5}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="edit-event-handover-due-at">
                Handover due date
                <span className="ml-auto text-xs font-normal text-muted-foreground">
                  Optional
                </span>
              </FieldLabel>
              <Input
                id="edit-event-handover-due-at"
                type="date"
                value={handoverDueAt}
                onChange={(e) => setHandoverDueAt(e.target.value)}
              />
            </Field>
          </>
        ) : null}

        {updateEvent.isError ? (
          <p className="text-sm text-destructive">
            Couldn&apos;t update the event. Please try again.
          </p>
        ) : null}
      </FieldGroup>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          onClick={() => onOpenChange(false)}
        >
          Cancel
        </Button>
        <Button type="submit" disabled={!title.trim() || updateEvent.isPending}>
          {updateEvent.isPending ? "Saving…" : "Save changes"}
        </Button>
      </DialogFooter>
    </form>
  );
}
