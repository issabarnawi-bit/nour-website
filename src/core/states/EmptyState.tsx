"use client";

import { useLanguage } from "../i18n";

type EmptyStateProps = {
  title?: string;
  description?: string;
};

export default function EmptyState({
  title,
  description,
}: EmptyStateProps) {
  const { language } = useLanguage();
  const isArabic = language === "ar";

  const resolvedTitle =
    title ??
    (isArabic
      ? "لا توجد بيانات"
      : "No data available");

  const resolvedDescription =
    description ??
    (isArabic
      ? "لا توجد عناصر لعرضها حاليًا."
      : "There are no items to display right now.");

  return (
    <div className="nr-state">
      <strong>{resolvedTitle}</strong>

      <p>{resolvedDescription}</p>
    </div>
  );
}