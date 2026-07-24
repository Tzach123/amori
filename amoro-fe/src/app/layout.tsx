import type { Metadata } from "next";
import { Rubik, Frank_Ruhl_Libre } from "next/font/google";
import "./globals.css";

const rubik = Rubik({
  subsets: ["hebrew", "latin"],
  variable: "--font-sans",
});

const frankRuhlLibre = Frank_Ruhl_Libre({
  subsets: ["hebrew", "latin"],
  weight: ["400", "500", "700"],
  variable: "--font-heading",
});

export const metadata: Metadata = {
  title: "Amori",
  description: "Amori — kids' clothing",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="he"
      dir="rtl"
      className={`h-full antialiased ${rubik.variable} ${frankRuhlLibre.variable}`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
