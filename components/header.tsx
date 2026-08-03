// components/site-header.tsx
"use client";

import { useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { Button } from "@/components/ui/button";
import {Menu, X } from "lucide-react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import logoImg from "../public/logo.png";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
} from "@/components/ui/navigation-menu";

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "How to Use", href: "/how-to-use" },
  { label: "Pricing", href: "/pricing" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        <Link href="/" className="group flex items-center gap-2.5 shrink-0">
          <Image src={logoImg} alt="Company Logo" width={40} height={40} className="h-40 w-40 object-contain" />
        </Link>

        <NavigationMenu className="hidden md:flex max-w-none flex-none">
          <NavigationMenuList className="gap-9">
            {NAV_LINKS.map(({ label, href }) => {
              const isActive = pathname === href;
              return (
                <NavigationMenuItem key={href}>
                  <NavigationMenuLink
                    active={isActive}
                    render={<Link href={href} />}
                    className="group/navlink relative rounded-none bg-transparent p-0 py-2 text-[13px] font-medium uppercase tracking-[0.08em] text-muted-foreground transition-colors hover:bg-transparent hover:text-foreground focus:bg-transparent data-active:bg-transparent"
                  >
                    {label}
                    <span
                      className={`absolute -bottom-0.5 left-0 h-[1.5px] w-full origin-left bg-primary transition-transform duration-300 ${
                        isActive
                          ? "scale-x-100"
                          : "scale-x-0 group-hover/navlink:scale-x-100"
                      }`}
                    />
                  </NavigationMenuLink>
                </NavigationMenuItem>
              );
            })}
          </NavigationMenuList>
        </NavigationMenu>

        <div className="hidden md:flex items-center gap-3 shrink-0">
          <Button
            variant="ghost"
            className="rounded-full text-[13px] font-medium tracking-wide text-foreground hover:border-primary"
            onClick={() => signIn("cognito")}
          >
            Log in
          </Button>
          <Button className="rounded-full bg-primary text-[13px] font-medium tracking-wide text-primary-foreground hover:bg-primary/80">
            <Link href="/signup">Sign up</Link>
          </Button>
        </div>

        <button
          className="md:hidden flex h-9 w-9 items-center justify-center text-foreground"
          onClick={() => setMobileOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {mobileOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {mobileOpen && (
        <div className="md:hidden border-t border-border bg-background px-6 py-5">
          <nav className="flex flex-col gap-1">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={href}
                href={href}
                onClick={() => setMobileOpen(false)}
                className={`rounded-md px-3 py-2.5 text-left text-sm font-medium uppercase tracking-[0.08em] transition-colors ${
                  pathname === href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:bg-accent hover:text-foreground"
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="mt-4 flex flex-col gap-2 border-t border-border pt-4">
            <Button
              variant="ghost"
              className="justify-center rounded-full text-foreground hover:border-primary"
              onClick={() => {
                setMobileOpen(false);
                signIn("cognito");
              }}
            >
              Log in
            </Button>
            <Button className="justify-center rounded-full bg-primary text-primary-foreground hover:bg-primary/80">
              <Link href="/signup">Sign up</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
}
