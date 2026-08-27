import type { Metadata } from "next";
import { HomeScreen } from "@/features/home";

const TITLE = "AMORI — made with love";
const DESCRIPTION =
  "בגדי ילדים בעיצוב ישראלי, נוחים ועל-זמניים. גלו את קולקציית הקיץ של AMORI.";

export const metadata: Metadata = {
  title: TITLE,
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: "/",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "AMORI",
  slogan: "made with love",
};

export default function Home() {
  return (
    <main>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationJsonLd) }}
      />
      <HomeScreen />
    </main>
  );
}
