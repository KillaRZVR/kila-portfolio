import type { Metadata } from "next";
import "./globals.css";
import { siteData } from "@/lib/data";

export const metadata: Metadata = {
  title: `${siteData.brand} — Portfolio`,
  description: siteData.heroNote,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ru" className="dark">
      <body>{children}</body>
    </html>
  );
}
