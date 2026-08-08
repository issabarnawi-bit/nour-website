"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import { useLanguage } from "../../core/i18n";
import { createClient } from "../../lib/supabase/client";
import {
  getFlightsForProgram,
  getHotelsForProgram,
  getProgramById,
} from "./services";

type ProgramDetailsPageProps = {
  programId: string;
};

function formatDateTime(
  value: string | null,
  language: "ar" | "en",
) {
  if (!value) return "";

  return new Intl.DateTimeFormat(
    language === "ar" ? "ar-SA" : "en-US",
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  ).format(new Date(value));
}

export default function ProgramDetailsPage({
  programId,
}: ProgramDetailsPageProps) {
  const { language } = useLanguage();
  const router = useRouter();
  const isArabic = language === "ar";

  const supabase = useMemo(
    () => createClient(),
    [],
  );

  const {
    data: program,
    isLoading: isProgramLoading,
    isError: isProgramError,
    error: programError,
  } = useQuery({
    queryKey: ["program", programId],
    queryFn: () =>
      getProgramById(supabase, programId),
    enabled: Boolean(programId),
  });

  const {
    data: hotels = [],
    isLoading: isHotelsLoading,
    isError: isHotelsError,
    error: hotelsError,
  } = useQuery({
    queryKey: ["program", programId, "hotels"],
    queryFn: () =>
      getHotelsForProgram(supabase, programId),
    enabled: Boolean(programId),
  });

  const {
    data: flights = [],
    isLoading: isFlightsLoading,
    isError: isFlightsError,
    error: flightsError,
  } = useQuery({
    queryKey: ["program", programId, "flights"],
    queryFn: () =>
      getFlightsForProgram(supabase, programId),
    enabled: Boolean(programId),
  });

  const isLoading =
    isProgramLoading ||
    isHotelsLoading ||
    isFlightsLoading;

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

  if (
    isProgramError ||
    !program ||
    isHotelsError ||
    isFlightsError
  ) {
    const error =
      programError ??
      hotelsError ??
      flightsError;

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
            className="nr-program-action"
          >
            {isArabic
              ? "العودة إلى البرامج"
              : "Back to Programs"}
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

  const flightInclusionLabel =
    program.flightInclusion === "included"
      ? isArabic
        ? "الطيران مشمول"
        : "Flight Included"
      : program.flightInclusion === "excluded"
        ? isArabic
          ? "الطيران غير مشمول"
          : "Flight Not Included"
        : isArabic
          ? "السعر حسب وقت الحجز"
          : "Dynamic at Booking";

  return (
    <section
      className="nr-dashboard"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="nr-dashboard-heading">
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
            onClick={() =>
              router.push("/admin/programs")
            }
          >
            {isArabic
              ? "العودة إلى البرامج"
              : "Back to Programs"}
          </button>

          <button
            type="button"
            className="nr-program-action nr-program-action-edit"
            onClick={() =>
              router.push(
                `/admin/programs?edit=${program.id}`,
              )
            }
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
            {isArabic ? "الحالة" : "Status"}
          </span>
          <strong>{statusLabel}</strong>
        </article>

        <article className="nr-program-details-card">
          <span>
            {isArabic ? "المدة" : "Duration"}
          </span>
          <strong>
            {program.durationDays}{" "}
            {isArabic ? "أيام" : "days"}
          </strong>
        </article>

        <article className="nr-program-details-card">
          <span>
            {isArabic ? "الليالي" : "Nights"}
          </span>
          <strong>
            {program.durationNights}{" "}
            {isArabic ? "ليالٍ" : "nights"}
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

      <article className="nr-program-details-description">
        <h2>
          {isArabic
            ? "الفنادق المرتبطة"
            : "Linked Hotels"}
        </h2>

        {hotels.length === 0 ? (
          <div className="nr-program-details-empty">
            {isArabic
              ? "لا توجد فنادق مرتبطة بهذا البرنامج."
              : "No hotels are linked to this program."}
          </div>
        ) : (
          <div className="nr-program-admin-list">
            {hotels.map((hotel) => (
              <div
                key={hotel.id}
                className="nr-program-admin-item"
              >
                <strong>
                  {isArabic
                    ? hotel.roomTypeAr || hotel.hotelId
                    : hotel.roomTypeEn || hotel.hotelId}
                </strong>

                <span>
                  {hotel.nights}{" "}
                  {isArabic ? "ليالٍ" : "nights"}
                </span>

                {(hotel.checkInDate ||
                  hotel.checkOutDate) ? (
                  <small>
                    {hotel.checkInDate ?? "—"}
                    {" → "}
                    {hotel.checkOutDate ?? "—"}
                  </small>
                ) : null}
              </div>
            ))}
          </div>
        )}
      </article>

      <article className="nr-program-details-description">
        <div className="nr-program-flight-admin-heading">
          <div>
            <h2>
              {isArabic
                ? "تفاصيل الرحلات"
                : "Flight Details"}
            </h2>

            <p>{flightInclusionLabel}</p>
          </div>

          <span className="nr-program-flight-policy">
            {flightInclusionLabel}
          </span>
        </div>

        {(isArabic
          ? program.flightNotesAr
          : program.flightNotesEn) ? (
          <p className="nr-program-flight-note">
            {isArabic
              ? program.flightNotesAr
              : program.flightNotesEn}
          </p>
        ) : null}

        {flights.length === 0 ? (
          <div className="nr-program-details-empty">
            {isArabic
              ? "لا توجد رحلات مرتبطة بهذا البرنامج."
              : "No flights are linked to this program."}
          </div>
        ) : (
          <div className="nr-program-admin-list">
            {flights.map((flight) => {
              const airline =
                isArabic
                  ? flight.airlineNameAr
                  : flight.airlineNameEn;

              const departure =
                isArabic
                  ? flight.departureAirportAr
                  : flight.departureAirportEn;

              const arrival =
                isArabic
                  ? flight.arrivalAirportAr
                  : flight.arrivalAirportEn;

              return (
                <div
                  key={flight.id}
                  className="nr-program-admin-flight"
                >
                  <div className="nr-program-admin-flight-header">
                    <div>
                      <span className="nr-dashboard-kicker">
                        {flight.direction === "outbound"
                          ? isArabic
                            ? "ذهاب"
                            : "Outbound"
                          : isArabic
                            ? "عودة"
                            : "Return"}
                      </span>

                      <h3>
                        {airline ||
                          (isArabic
                            ? "رحلة"
                            : "Flight")}
                      </h3>
                    </div>

                    {flight.flightNumber ? (
                      <strong>
                        {flight.flightNumber}
                      </strong>
                    ) : null}
                  </div>

                  <div className="nr-program-admin-flight-route">
                    <div>
                      <span>
                        {isArabic
                          ? "المغادرة"
                          : "Departure"}
                      </span>
                      <strong>{departure}</strong>
                      {flight.departureAt ? (
                        <small>
                          {formatDateTime(
                            flight.departureAt,
                            language,
                          )}
                        </small>
                      ) : null}
                    </div>

                    <div>
                      <span>
                        {isArabic
                          ? "الوصول"
                          : "Arrival"}
                      </span>
                      <strong>{arrival}</strong>
                      {flight.arrivalAt ? (
                        <small>
                          {formatDateTime(
                            flight.arrivalAt,
                            language,
                          )}
                        </small>
                      ) : null}
                    </div>
                  </div>

                  <div className="nr-program-admin-flight-meta">
                    <span>
                      {flight.flightType === "direct"
                        ? isArabic
                          ? "مباشر"
                          : "Direct"
                        : isArabic
                          ? "ترانزيت"
                          : "Transit"}
                    </span>

                    {flight.baggageAllowanceKg > 0 ? (
                      <span>
                        {flight.baggageAllowanceKg}{" "}
                        {isArabic
                          ? "كجم أمتعة"
                          : "kg baggage"}
                      </span>
                    ) : null}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </article>

      <style jsx>{`
        .nr-program-details-actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }

        .nr-program-details-cover {
          height: 320px;
          overflow: hidden;
          margin-top: 20px;
          border-radius: 20px;
        }

        .nr-program-details-cover img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .nr-program-details-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 14px;
          margin-top: 20px;
        }

        .nr-program-details-card,
        .nr-program-details-description {
          border: 1px solid var(--nour-border);
          border-radius: 16px;
          background: var(--nour-surface);
        }

        .nr-program-details-card {
          display: flex;
          min-height: 110px;
          flex-direction: column;
          justify-content: center;
          gap: 7px;
          padding: 18px;
        }

        .nr-program-details-card span,
        .nr-program-admin-item span,
        .nr-program-admin-item small {
          color: #7b899d;
          font-size: 11px;
        }

        .nr-program-details-description {
          margin-top: 20px;
          padding: 22px;
        }

        .nr-program-details-description > p {
          color: #6f7e92;
          line-height: 1.9;
          white-space: pre-line;
        }

        .nr-program-details-empty {
          padding: 22px;
          border: 1px dashed var(--nour-border);
          border-radius: 14px;
          color: #7c899c;
          text-align: center;
        }

        .nr-program-admin-list {
          display: grid;
          gap: 12px;
        }

        .nr-program-admin-item,
        .nr-program-admin-flight {
          padding: 15px;
          border: 1px solid var(--nour-border);
          border-radius: 13px;
          background: var(--nour-background);
        }

        .nr-program-admin-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
        }

        .nr-program-flight-admin-heading,
        .nr-program-admin-flight-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 12px;
        }

        .nr-program-flight-admin-heading h2,
        .nr-program-admin-flight-header h3 {
          margin-top: 0;
        }

        .nr-program-flight-policy {
          padding: 8px 11px;
          border-radius: 999px;
          color: var(--nour-primary);
          background: rgba(23, 111, 232, 0.08);
          font-size: 10px;
          font-weight: 900;
        }

        .nr-program-flight-note {
          padding: 12px;
          border-radius: 10px;
          background: var(--nour-background);
        }

        .nr-program-admin-flight-route {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 10px;
          margin-top: 12px;
        }

        .nr-program-admin-flight-route > div {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 12px;
          border-radius: 10px;
          background: var(--nour-surface);
        }

        .nr-program-admin-flight-route span,
        .nr-program-admin-flight-route small {
          color: #7b899d;
          font-size: 10px;
        }

        .nr-program-admin-flight-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 10px;
        }

        .nr-program-admin-flight-meta span {
          padding: 7px 9px;
          border-radius: 9px;
          color: #65758a;
          background: var(--nour-surface);
          font-size: 10px;
          font-weight: 800;
        }

        @media (max-width: 900px) {
          .nr-program-details-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 620px) {
          .nr-program-details-grid,
          .nr-program-admin-flight-route {
            grid-template-columns: 1fr;
          }

          .nr-program-admin-item {
            align-items: flex-start;
            flex-direction: column;
          }
        }
      `}</style>
    </section>
  );
}