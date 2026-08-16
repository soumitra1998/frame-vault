"use client";

import * as React from "react";
import QRCode from "qrcode";
import { Check, Copy, Download } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { getGuestLinkUrl } from "@/lib/dashboard/guest-link";
import type { GuestLinkResponseDTO } from "@/lib/api/types";

/**
 * A guest link's URL (with copy) and QR code (with download). Shared by the
 * create-guest-link success screen and the event page's guest link panel.
 */
export function GuestLinkShareCard({ link }: { link: GuestLinkResponseDTO }) {
  const [copied, setCopied] = React.useState(false);
  const [qrDataUrl, setQrDataUrl] = React.useState<string | null>(null);
  const url = getGuestLinkUrl(link);

  React.useEffect(() => {
    let cancelled = false;

    QRCode.toDataURL(url, { width: 240, margin: 1 })
      .then((dataUrl) => {
        if (!cancelled) setQrDataUrl(dataUrl);
      })
      .catch(() => {
        if (!cancelled) setQrDataUrl(null);
      });

    return () => {
      cancelled = true;
    };
  }, [url]);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const qrFileName = `${
    link.label
      ?.trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "") || "guest-link"
  }-qr.png`;

  return (
    <FieldGroup>
      <Field>
        <FieldLabel htmlFor="guest-link-url">Link</FieldLabel>
        <div className="flex gap-2">
          <Input id="guest-link-url" value={url} readOnly />
          <Button
            type="button"
            variant="outline"
            size="icon"
            onClick={handleCopy}
            aria-label="Copy link"
          >
            {copied ? <Check /> : <Copy />}
          </Button>
        </div>
      </Field>

      <Field>
        <FieldLabel>QR code</FieldLabel>
        <div className="flex flex-col items-center gap-3 rounded-lg border border-border p-4">
          {qrDataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={qrDataUrl}
              alt={`QR code for ${link.label || "guest link"}`}
              width={200}
              height={200}
              className="size-50"
            />
          ) : (
            <Skeleton className="size-50" />
          )}
          <Button
            variant="outline"
            size="sm"
            disabled={!qrDataUrl}
            nativeButton={false}
            render={<a href={qrDataUrl ?? undefined} download={qrFileName} />}
          >
            <Download data-icon="inline-start" />
            Download QR code
          </Button>
        </div>
      </Field>
    </FieldGroup>
  );
}
