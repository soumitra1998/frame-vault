"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { LayoutGrid, LogOut, Settings, User } from "lucide-react";

import logoImg from "@/public/logo.png";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Progress, ProgressIndicator, ProgressTrack } from "@/components/ui/progress";
import { useCurrentUser } from "@/lib/queries/use-current-user";
import { useSubscription } from "@/lib/queries/use-subscription";
import { formatBytes } from "@/lib/dashboard/utils";

const NAV_ITEMS = [{ label: "My events", href: "/dashboard", icon: LayoutGrid }];

function initials(name: string) {
  return name
    .split(" ")
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

export function AppSidebar() {
  const pathname = usePathname();
  const { data: user, isLoading: userLoading } = useCurrentUser();
  const { data: subscription, isLoading: subscriptionLoading } = useSubscription();

  const displayName = user?.name || user?.email || "Your account";
  const storagePercent = subscription
    ? Math.round(subscription.storagePercentageUsed)
    : 0;
  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <Link
          href="/dashboard"
          className="flex items-center gap-2.5 px-2 py-1.5"
        >
          <Image
            src={logoImg}
            alt="FrameVault"
            width={28}
            height={28}
            className="size-7 shrink-0 object-contain"
          />
          <span className="font-heading text-sm font-semibold tracking-tight group-data-[collapsible=icon]:hidden">
            FrameVault
          </span>
        </Link>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Workspace</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV_ITEMS.map(({ label, href, icon: Icon }) => (
                <SidebarMenuItem key={href}>
                  <SidebarMenuButton
                    isActive={pathname === href || pathname.startsWith(`${href}/`)}
                    tooltip={label}
                    render={<Link href={href} />}
                  >
                    <Icon />
                    <span>{label}</span>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="rounded-lg bg-sidebar-accent/60 p-3 group-data-[collapsible=icon]:hidden">
          {subscriptionLoading ? (
            <div className="flex flex-col gap-2">
              <Skeleton className="h-3.5 w-24" />
              <Skeleton className="h-1.5 w-full" />
              <Skeleton className="h-3 w-32" />
            </div>
          ) : subscription ? (
            <>
              <div className="flex items-center justify-between text-xs">
                <span className="font-medium text-sidebar-foreground">
                  {subscription.planDisplayName}
                </span>
                <span className="text-sidebar-foreground/60">
                  {storagePercent}%
                </span>
              </div>
              <Progress value={storagePercent} className="mt-2">
                <ProgressTrack className="h-1.5 bg-sidebar-border">
                  <ProgressIndicator />
                </ProgressTrack>
              </Progress>
              <p className="mt-2 text-[11px] text-sidebar-foreground/60">
                {formatBytes(subscription.storageUsedBytes)} of{" "}
                {subscription.storageLimitGb} GB used
              </p>
            </>
          ) : (
            <p className="text-[11px] text-sidebar-foreground/60">
              Storage usage unavailable
            </p>
          )}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton size="lg" className="mt-1">
                {userLoading ? (
                  <>
                    <Skeleton className="size-6 rounded-full" />
                    <Skeleton className="h-3.5 w-24" />
                  </>
                ) : (
                  <>
                    <Avatar size="sm">
                      <AvatarFallback>{initials(displayName)}</AvatarFallback>
                    </Avatar>
                    <div className="flex min-w-0 flex-col text-left leading-tight">
                      <span className="truncate text-sm font-medium">
                        {displayName}
                      </span>
                      <span className="truncate text-xs text-sidebar-foreground/60">
                        {user?.email ?? ""}
                      </span>
                    </div>
                  </>
                )}
              </SidebarMenuButton>
            }
          />
          <DropdownMenuContent align="start" side="top" className="w-56">
            <DropdownMenuGroup>
              <DropdownMenuLabel>
                {user?.studioName || "FrameVault"}
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User /> Profile
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Settings /> Settings
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem variant="destructive">
                <LogOut /> Log out
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
