"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateEvent } from "@/lib/queries/use-events";
import { useCurrentUserId } from "@/lib/queries/use-current-user";
import type { EventVisibility } from "@/lib/api/types";

export function CreateEventDialog({
  trigger,
}: {
  trigger?: React.ReactElement;
}) {
  const router = useRouter();
  const userId = useCurrentUserId();
  const createEvent = useCreateEvent();
  const [open, setOpen] = React.useState(false);
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [visibility, setVisibility] = React.useState<EventVisibility>("PRIVATE");
  const [secondaryOwnerEmail, setSecondaryOwnerEmail] = React.useState("");
  const [handoverDueAt, setHandoverDueAt] = React.useState("");

  const reset = () => {
    setTitle("");
    setDescription("");
    setVisibility("PRIVATE");
    setSecondaryOwnerEmail("");
    setHandoverDueAt("");
    createEvent.reset();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    createEvent.mutate(
      {
        title,
        description,
        visibility,
        secondaryOwnerEmail: secondaryOwnerEmail.trim() || undefined,
        handoverDueAt: handoverDueAt || undefined,
      },
      {
        onSuccess: (event) => {
          setOpen(false);
          reset();
          router.push(`/dashboard/events/${event.slug}`);
        },
      }
    );
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger
        render={
          trigger ?? (
            <Button className="gap-1.5">
              <Plus data-icon="inline-start" />
              New event
            </Button>
          )
        }
      />
      <DialogContent className="sm:max-w-md">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>Create a new event</DialogTitle>
            <DialogDescription>
              An event is the top-level gallery for a shoot — you&apos;ll add
              folders inside it to organize photos and videos.
            </DialogDescription>
          </DialogHeader>

          <FieldGroup className="py-4">
            <Field>
              <FieldLabel htmlFor="event-title">Title</FieldLabel>
              <Input
                id="event-title"
                placeholder="Amara & Rohan — Wedding"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                maxLength={255}
                required
                autoFocus
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="event-description">
                Description
                <span className="ml-auto text-xs font-normal text-muted-foreground">
                  Optional
                </span>
              </FieldLabel>
              <Textarea
                id="event-description"
                placeholder="A short note about this event"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                maxLength={255}
              />
            </Field>

            <Field>
              <FieldLabel htmlFor="event-visibility">Visibility</FieldLabel>
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
                <SelectTrigger id="event-visibility" className="w-full">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PRIVATE">Private — only you</SelectItem>
                  <SelectItem value="PUBLIC">Public — shareable link</SelectItem>
                </SelectContent>
              </Select>
              <FieldDescription>
                You can invite clients and guests to specific folders later.
              </FieldDescription>
            </Field>

            {visibility === "PUBLIC" ? (
              <>
                <Field>
                  <FieldLabel htmlFor="event-secondary-owner-email">
                    Secondary owner email
                    <span className="ml-auto text-xs font-normal text-muted-foreground">
                      Optional
                    </span>
                  </FieldLabel>
                  <Input
                    id="event-secondary-owner-email"
                    type="email"
                    placeholder="client@example.com"
                    value={secondaryOwnerEmail}
                    onChange={(e) => setSecondaryOwnerEmail(e.target.value)}
                    minLength={5}
                  />
                  <FieldDescription>
                    They&apos;ll be able to claim ownership of this event once
                    it hands over.
                  </FieldDescription>
                </Field>

                <Field>
                  <FieldLabel htmlFor="event-handover-due-at">
                    Handover due date
                    <span className="ml-auto text-xs font-normal text-muted-foreground">
                      Optional
                    </span>
                  </FieldLabel>
                  <Input
                    id="event-handover-due-at"
                    type="date"
                    value={handoverDueAt}
                    onChange={(e) => setHandoverDueAt(e.target.value)}
                  />
                </Field>
              </>
            ) : null}

            {createEvent.isError ? (
              <p className="text-sm text-destructive">
                Couldn&apos;t create the event. Please try again.
              </p>
            ) : null}
          </FieldGroup>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={!title.trim() || !userId || createEvent.isPending}
            >
              {createEvent.isPending ? "Creating…" : "Create event"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
