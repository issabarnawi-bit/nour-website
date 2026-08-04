"use client";

import { useEffect, useRef } from "react";
import {
  usePathname,
  useSearchParams,
} from "next/navigation";

import { recordVisitorPageVisit } from "../services/visitor-analytics.service";

const DUPLICATE_VISIT_WINDOW_MS = 2000;

export default function VisitorAnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const lastVisitRef = useRef<{
    pagePath: string;
    recordedAt: number;
  } | null>(null);

  useEffect(() => {
    if (!pathname) {
      return;
    }

    const queryString = searchParams.toString();

    const pagePath = queryString
      ? `${pathname}?${queryString}`
      : pathname;

    const now = Date.now();
    const lastVisit = lastVisitRef.current;

    if (
      lastVisit &&
      lastVisit.pagePath === pagePath &&
      now - lastVisit.recordedAt <
        DUPLICATE_VISIT_WINDOW_MS
    ) {
      return;
    }

    lastVisitRef.current = {
      pagePath,
      recordedAt: now,
    };

    const documentLanguage =
      document.documentElement.lang
        .toLowerCase()
        .trim();

    const language:
      | "ar"
      | "en"
      | null = documentLanguage.startsWith("en")
      ? "en"
      : documentLanguage.startsWith("ar")
        ? "ar"
        : null;

    void recordVisitorPageVisit({
      pagePath,
      pageTitle: document.title,
      language,
    });
  }, [pathname, searchParams]);

  return null;
}