"use client";

import { useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { useLanguage } from "../../core/i18n";
import { createClient } from "../../lib/supabase/client";
import {
  getProgramById,
} from "./services";

type ProgramDetailsPageProps = {
  programId: string;
};

export default function ProgramDetailsPage({
  programId,
}: ProgramDetailsPageProps) {
  const { language } = useLanguage();
  const router = useRouter();

  const isArabic = language === "ar";

  const supabase = useMemo(() => {
    return createClient();
  }, []);

  const {
    data: program,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["program", programId],
    queryFn: () =>
      getProgramById(
        supabase,
        programId,
      ),
  });

  if (isLoading) {
    return (
      <section className="nr-dashboard">
        <div className="nr-state">
          <strong>
            {isArabic
              ? "جاري تحميل تفاصيل البرنامج..."
              : "Loading program details..."}
          </strong>
        </div>
      </section>
    );
  }

  if (isError || !program) {
    return (
      <section className="nr-dashboard">
        <div className="nr-state">
          <strong>
            {isArabic
              ? "تعذر تحميل البرنامج"
              : "Unable to load program"}
          </strong>

          <p>
            {error instanceof Error
              ? error.message
              : isArabic
                ? "البرنامج غير موجود."
                : "Program not found."}
          </p>

          <Link
            href="/admin/programs"
            className="nr-program-details-back"
          >
            {isArabic
              ? "العودة إلى البرامج"
              : "Back to programs"}
          </Link>
        </div>
      </section>
    );
  }

  const statusLabel =
    program.status === "published"
      ? isArabic
        ? "منشور"
        : "Published"
      : program.status === "draft"
        ? isArabic
          ? "مسودة"
          : "Draft"
        : isArabic
          ? "غير نشط"
          : "Inactive";

  return (
    <section className="nr-dashboard">
      <div className="nr-program-details-heading">
        <div>
          <span className="nr-dashboard-kicker">
            {isArabic
              ? "تفاصيل البرنامج"
              : "Program Details"}
          </span>

          <h1>
            {isArabic
              ? program.titleAr
              : program.titleEn}
          </h1>

          <p>
            {isArabic
              ? program.summaryAr
              : program.summaryEn}
          </p>
        </div>

        <div className="nr-program-details-actions">
          <button
            type="button"
            className="nr-program-action"
            onClick={() => {
              router.push("/admin/programs");
            }}
          >
            {isArabic
              ? "العودة إلى البرامج"
              : "Back to Programs"}
          </button>

          <button
            type="button"
            className="nr-program-action nr-program-action-edit"
            onClick={() => {
              router.push(
                `/admin/programs?edit=${program.id}`,
              );
            }}
          >
            {isArabic
              ? "تعديل البرنامج"
              : "Edit Program"}
          </button>
        </div>
      </div>

      {program.coverUrl ? (
        <div className="nr-program-details-cover">
          <img
            src={program.coverUrl}
            alt={
              isArabic
                ? program.titleAr
                : program.titleEn
            }
          />
        </div>
      ) : null}

      <div className="nr-program-details-grid">
        <article className="nr-program-details-card">
          <span>
            {isArabic
              ? "الحالة"
              : "Status"}
          </span>

          <strong>
            {statusLabel}
          </strong>
        </article>

        <article className="nr-program-details-card">
          <span>
            {isArabic
              ? "المدة"
              : "Duration"}
          </span>

          <strong>
            {program.durationDays}{" "}
            {isArabic
              ? "أيام"
              : "days"}
          </strong>
        </article>

        <article className="nr-program-details-card">
          <span>
            {isArabic
              ? "الليالي"
              : "Nights"}
          </span>

          <strong>
            {program.durationNights}{" "}
            {isArabic
              ? "ليالٍ"
              : "nights"}
          </strong>
        </article>

        <article className="nr-program-details-card">
          <span>
            {isArabic
              ? "السعر الأساسي"
              : "Base Price"}
          </span>

          <strong>
            {program.basePrice}{" "}
            {program.currencyCode}
          </strong>
        </article>
      </div>

      <article className="nr-program-details-description">
        <h2>
          {isArabic
            ? "وصف البرنامج"
            : "Program Description"}
        </h2>

        <p>
          {isArabic
            ? program.descriptionAr
            : program.descriptionEn}
        </p>
      </article>
    </section>
  );
}