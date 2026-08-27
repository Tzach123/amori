import Link from "next/link";
import { ShoppingBag } from "lucide-react";

const NAV_LINKS = [
  { label: "דף הבית", href: "/" },
  { label: "יצירת קשר", href: "/contact" },
  { label: "אודות", href: "/about" },
  { label: "מדריך מידות", href: "/size-guide" },
  { label: "בנות", href: "/collections/girls" },
  { label: "בנים", href: "/collections/boys" },
];

export function SiteHeader() {
  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
        <span
          className="text-muted-foreground"
          title="הסל שלך"
          aria-label="הסל שלך, 0 פריטים"
        >
          <ShoppingBag className="size-5" />
        </span>

        <Link
          href="/"
          className="flex flex-col items-center leading-none"
        >
          <span className="font-heading text-2xl text-primary">AMORI</span>
          <span className="text-xs text-muted-foreground">made with love</span>
        </Link>

        <nav className="hidden gap-5 text-sm text-foreground md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="transition-colors hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
