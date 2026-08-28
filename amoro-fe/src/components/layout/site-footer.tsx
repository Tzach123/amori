import Link from "next/link";

const FOOTER_COLUMNS = [
  {
    title: "שירות לקוחות",
    links: [
      { label: "שאלות נפוצות", href: "/faq" },
      { label: "משלוחים", href: "/shipping" },
      { label: "החלפות והחזרות", href: "/returns" },
      { label: "יצירת קשר", href: "/contact" },
    ],
  },
  {
    title: "מידע",
    links: [
      { label: "אודות", href: "/about" },
      { label: "מדריך מידות", href: "/size-guide" },
      { label: "טבלת כביסה", href: "/care-guide" },
      { label: "פרטי כביסה", href: "/care-guide" },
    ],
  },
  {
    title: "הקולקציה",
    links: [
      { label: "בנות", href: "/collections/girls" },
      { label: "בנים", href: "/collections/boys" },
      { label: "כל הפריטים", href: "/collections" },
      { label: "חדש", href: "/collections" },
    ],
  },
];

export function SiteFooter() {
  return (
    <footer className="mt-16 border-t border-border bg-background">
      <div className="mx-auto grid max-w-6xl gap-10 px-4 py-12 sm:px-6 md:grid-cols-3">
        <div className="flex flex-col gap-2">
          <span className="font-heading text-2xl text-primary">AMORI</span>
          <span className="text-xs text-muted-foreground">made with love</span>
          <div className="mt-4 flex gap-3 text-sm text-muted-foreground">
            <a href="#" className="hover:text-primary">
              אינסטגרם
            </a>
            <a href="#" className="hover:text-primary">
              פייסבוק
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-8 sm:grid-cols-3 md:col-span-2">
          {FOOTER_COLUMNS.map((column) => (
            <div key={column.title} className="flex flex-col gap-3">
              <h4 className="text-sm font-medium text-foreground">
                {column.title}
              </h4>
              <ul className="flex flex-col gap-2">
                {column.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-primary"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border py-4 text-center text-xs text-muted-foreground">
        AMORI © כל הזכויות שמורות
      </div>
    </footer>
  );
}
