"use client";

import { useLanguage } from "../i18n";

type LoadingStateProps = {
  title?: string;
};

export default function LoadingState({
  title,
}: LoadingStateProps) {
  const { language } = useLanguage();
  const isArabic = language === "ar";

  const resolvedTitle =
    title ??
    (isArabic
      ? "جارٍ التحميل..."
      : "Loading...");

  return (
    <div
      className="nr-state"
      role="status"
      aria-live="polite"
    >
      <span
        className="nr-state-spinner"
        aria-hidden="true"
      />

      <strong>{resolvedTitle}</strong>
    </div>
  );
}