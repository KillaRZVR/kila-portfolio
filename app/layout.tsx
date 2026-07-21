import type { Metadata } from "next";
import "./globals.css";
import { CustomCursor } from "@/components/custom-cursor";
import { siteData } from "@/lib/data";
export const metadata: Metadata = { title: `${siteData.brand} — Portfolio`, description: siteData.heroNote };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="ru" className="dark"><body><CustomCursor />{children}</body></html>;
}
