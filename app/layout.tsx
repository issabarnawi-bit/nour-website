import type { Metadata } from "next";
import { Suspense } from "react";
import { Cairo } from "next/font/google";

import VisitorAnalyticsTracker from "../src/features/analytics/components/VisitorAnalyticsTracker";

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
  title: "نور آب | NourApp Umrah",
  description:
    "منصة نور آب الرقمية لخدمات وبرامج العمرة.",
};

type RootLayoutProps = Readonly<{
  children: React.ReactNode;
}>;

export default function RootLayout({
  children,
}: RootLayoutProps) {
  return (
    <html
      lang="ar"
      dir="rtl"
      className={cairo.variable}
      suppressHydrationWarning
    >
      <body
        style={{
          fontFamily:
            "var(--font-cairo), sans-serif",
        }}
      >
        <Suspense fallback={null}>
          <VisitorAnalyticsTracker />
        </Suspense>

        {children}
      </body>
    </html>
  );
}