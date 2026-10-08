"use client";

import { useState } from "react";
import Link from "next/link";
import { Menu, ShoppingBag, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";

// DOM order first-to-last renders right-to-left under dir="rtl", matching
// docs/mockups/homepage.jpeg's left-to-right sequence: דף הבית, בנות, בנים,
// אודות, מדריך מידות, יצירת קשר.
const NAV_LINKS = [
  { label: "יצירת קשר", href: "/contact" },
  { label: "מדריך מידות", href: "/size-guide" },
  { label: "אודות", href: "/about" },
  { label: "בנים", href: "/collections/boys" },
  { label: "בנות", href: "/collections/girls" },
  { label: "דף הבית", href: "/" },
];

export function SiteHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <header className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4 sm:px-6">
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

        <Link href="/" className="flex flex-col items-center leading-none">
          <span className="font-heading text-2xl text-primary">AMORI</span>
          <span className="text-xs text-muted-foreground">made with love</span>
        </Link>

        <div className="flex items-center gap-3 text-muted-foreground">
          <span title="הסל שלך" aria-label="הסל שלך, 0 פריטים">
            <ShoppingBag className="size-5" />
          </span>
          <span title="החשבון שלי" aria-label="החשבון שלי">
            <User className="size-5" />
          </span>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            aria-label={mobileOpen ? "סגירת תפריט" : "פתיחת תפריט"}
            aria-expanded={mobileOpen}
            onClick={() => setMobileOpen((open) => !open)}
          >
            {mobileOpen ? <X className="size-5" /> : <Menu className="size-5" />}
          </Button>
        </div>
      </div>

      {mobileOpen && (
        <nav
          data-testid="mobile-nav"
          className="flex flex-col gap-1 border-t border-border px-4 py-3 text-sm text-foreground md:hidden"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-lg px-2 py-2 transition-colors hover:bg-muted hover:text-primary"
              onClick={() => setMobileOpen(false)}
            >
              {link.label}
            </Link>
          ))}
        </nav>
      )}
    </header>
  );
}
