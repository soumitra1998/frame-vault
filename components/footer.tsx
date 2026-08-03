// components/footer.tsx
import Link from "next/link";
import Image from "next/image";
import logoImg from "../public/logo.png";

const LEGAL_LINKS = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
  { label: "Contact", href: "/contact" },
];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="w-full border-t border-border bg-background">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-8 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Image
            src={logoImg}
            alt="Company Logo"
            width={32}
            height={32}
            className="h-8 w-8 object-contain"
          />
          <p className="text-xs text-muted-foreground">
            &copy; {year} FrameVault. All rights reserved.
          </p>
        </div>

        <nav className="flex items-center gap-6">
          {LEGAL_LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              className="text-[13px] font-medium tracking-wide text-muted-foreground transition-colors hover:text-foreground"
            >
              {label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
