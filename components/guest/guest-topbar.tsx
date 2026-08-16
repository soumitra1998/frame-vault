import * as React from "react";
import Image from "next/image";
import Link from "next/link";

import logoImg from "@/public/logo.png";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export interface GuestBreadcrumbEntry {
  label: string;
  href?: string;
}

/**
 * Minimal top bar for guest-facing gallery pages: no sidebar trigger, no
 * account/nav links — guests are unauthenticated and scoped to a single
 * shared event via their link token.
 */
export function GuestTopbar({ items }: { items: GuestBreadcrumbEntry[] }) {
  return (
    <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center gap-3 border-b border-border bg-background/95 px-4 backdrop-blur-sm supports-backdrop-filter:bg-background/80 sm:px-6">
      <div className="flex shrink-0 items-center gap-2">
        <Image
          src={logoImg}
          alt="FrameVault"
          width={24}
          height={24}
          className="size-6 object-contain"
        />
        <span className="font-heading text-sm font-semibold tracking-tight">
          FrameVault
        </span>
      </div>
      <span className="h-4 w-px shrink-0 bg-border" />
      <Breadcrumb className="min-w-0">
        <BreadcrumbList className="flex-nowrap">
          {items.map((item, index) => {
            const isLast = index === items.length - 1;
            return (
              <React.Fragment key={`${item.label}-${index}`}>
                <BreadcrumbItem className="min-w-0">
                  {isLast || !item.href ? (
                    <BreadcrumbPage className="truncate">{item.label}</BreadcrumbPage>
                  ) : (
                    <BreadcrumbLink render={<Link href={item.href} />} className="truncate">
                      {item.label}
                    </BreadcrumbLink>
                  )}
                </BreadcrumbItem>
                {!isLast && <BreadcrumbSeparator />}
              </React.Fragment>
            );
          })}
        </BreadcrumbList>
      </Breadcrumb>
    </header>
  );
}
