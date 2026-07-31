"use client";

import { useLanguage } from "../i18n";

type ErrorStateProps = {
  title?: string;
  description?: string;
  onRetry?: () => void;
};

export default function ErrorState({
  title,
  description,
  onRetry,
}: ErrorStateProps) {
  const { language } = useLanguage();
  const isArabic = language === "ar";

  const resolvedTitle =
    title ??
    (isArabic
      ? "حدث خطأ"
      : "Something went wrong");

  const resolvedDescription =
    description ??
    (isArabic
      ? "تعذر تحميل البيانات. يرجى المحاولة مرة أخرى."
      : "Unable to load the data. Please try again.");

  return (
    <div
      className="nr-state nr-state--error"
      role="alert"
    >
      <strong>{resolvedTitle}</strong>

      <p>{resolvedDescription}</p>

      {onRetry ? (
        <button
          type="button"
          className="nr-secondary-button"
          onClick={onRetry}
        >
          {isArabic
            ? "إعادة المحاولة"
            : "Try Again"}
        </button>
      ) : null}
    </div>
  );
}