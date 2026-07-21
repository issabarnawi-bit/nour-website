import type { Metadata } from "next";
import { Cairo } from "next/font/google";
import "./globals.css";
import "./nour-redesign.css";
import "./modern-upgrade.css";
const cairo = Cairo({
  subsets: ["arabic", "latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-cairo",
  display: "swap",
});

export const metadata: Metadata = {
  title: "نور | Nour Umrah",
  description: "منصة نور الرقمية لخدمات وبرامج العمرة.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="ar" dir="rtl" className={cairo.variable} suppressHydrationWarning>
      <body style={{ fontFamily: "var(--font-cairo), sans-serif" }}>{children}</body>
    </html>
  );
}
