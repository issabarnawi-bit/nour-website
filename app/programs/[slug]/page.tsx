"use client";

import Image from "next/image";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  BedDouble,
  BriefcaseBusiness,
  BusFront,
  CalendarDays,
  CheckCircle2,
  Clock3,
  MapPin,
  Moon,
  Plane,
  PlaneLanding,
  PlaneTakeoff,
  ShieldCheck,
  Smartphone,
  Sparkles,
  Stamp,
  Star,
  Utensils,
} from "lucide-react";

import { useLanguage } from "../../../src/core/i18n";
import { createClient } from "../../../src/lib/supabase/client";
import { getPublicProgramBySlug } from "../../../src/features/programs/services/public-program-details.service";
import { getTransportsForProgram } from "../../../src/features/transports/services";
import { getVisasForProgram } from "../../../src/features/visas/services";

function formatNumber(
  value: number,
  language: "ar" | "en",
) {
  return new Intl.NumberFormat(
    language === "ar" ? "ar-SA" : "en-US",
    {
      maximumFractionDigits: 0,
    },
  ).format(value);
}

function formatDateTime(
  value: string | null,
  language: "ar" | "en",
) {
  if (!value) {
    return "";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(
    language === "ar" ? "ar-SA" : "en-US",
    {
      dateStyle: "medium",
      timeStyle: "short",
    },
  ).format(date);
}

function formatDate(
  value: string | null,
  language: "ar" | "en",
) {
  if (!value) {
    return "";
  }

  const date = new Date(`${value}T00:00:00`);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return new Intl.DateTimeFormat(
    language === "ar" ? "ar-SA" : "en-US",
    {
      dateStyle: "medium",
    },
  ).format(date);
}

function formatTransitDuration(
  minutes: number,
  isArabic: boolean,
) {
  const hours = Math.floor(minutes / 60);
  const remainingMinutes = minutes % 60;

  if (hours > 0 && remainingMinutes > 0) {
    return isArabic
      ? `${hours} س ${remainingMinutes} د`
      : `${hours}h ${remainingMinutes}m`;
  }

  if (hours > 0) {
    return isArabic
      ? `${hours} ساعة`
      : `${hours}h`;
  }

  return isArabic
    ? `${remainingMinutes} دقيقة`
    : `${remainingMinutes}m`;
}

export default function PublicProgramDetailsPage() {
  const { language } = useLanguage();
  const isArabic = language === "ar";

  const params = useParams<{
    slug: string;
  }>();

  const slug =
    typeof params.slug === "string"
      ? decodeURIComponent(params.slug)
      : "";

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
    queryKey: [
      "public",
      "program-details",
      slug,
    ],
    queryFn: () =>
      getPublicProgramBySlug(
        supabase,
        slug,
      ),
    enabled: Boolean(slug),
  });

  const {
    data: transports = [],
    isLoading: isTransportsLoading,
    isError: isTransportsError,
    error: transportsError,
  } = useQuery({
    queryKey: [
      "public",
      "program-details",
      program?.id ?? "",
      "transports",
    ],
    queryFn: () =>
      getTransportsForProgram(
        supabase,
        program!.id,
      ),
    enabled: Boolean(program?.id),
  });

  const {
    data: visas = [],
    isLoading: isVisasLoading,
    isError: isVisasError,
    error: visasError,
  } = useQuery({
    queryKey: [
      "public",
      "program-details",
      program?.id ?? "",
      "visas",
    ],
    queryFn: () =>
      getVisasForProgram(
        supabase,
        program!.id,
      ),
    enabled: Boolean(program?.id),
  });

  const isLoading =
    isProgramLoading ||
    (Boolean(program?.id) &&
      (isTransportsLoading ||
        isVisasLoading));

  const isError =
    isProgramError ||
    isTransportsError ||
    isVisasError;

  const error =
    programError ??
    transportsError ??
    visasError;

  if (isLoading) {
    return (
      <main className="nr-program-details-state">
        <div className="nr-program-details-loader" />
        <strong>
          {isArabic
            ? "جارٍ تحميل البرنامج..."
            : "Loading program..."}
        </strong>
      </main>
    );
  }

  if (isError) {
    return (
      <main className="nr-program-details-state">
        <strong>
          {isArabic
            ? "تعذر تحميل البرنامج"
            : "Unable to load program"}
        </strong>

        <p>
          {error instanceof Error
            ? error.message
            : ""}
        </p>

        <Link href="/">
          {isArabic
            ? "العودة للرئيسية"
            : "Back Home"}
        </Link>
      </main>
    );
  }

  if (!program) {
    return (
      <main className="nr-program-details-state">
        <strong>404</strong>

        <p>
          {isArabic
            ? "البرنامج غير موجود أو غير منشور."
            : "This program does not exist or is not published."}
        </p>

        <Link href="/#programs">
          {isArabic
            ? "عرض البرامج"
            : "View Programs"}
        </Link>
      </main>
    );
  }

  const title =
    isArabic
      ? program.titleAr
      : program.titleEn;

  const summary =
    isArabic
      ? program.summaryAr
      : program.summaryEn;

  const description =
    isArabic
      ? program.descriptionAr
      : program.descriptionEn;

  const country =
    isArabic
      ? program.countryNameAr
      : program.countryNameEn;

  const flightPolicyLabel =
    program.flightInclusion === "included"
      ? isArabic
        ? "الطيران مشمول في سعر البرنامج"
        : "Flights are included in the program price"
      : program.flightInclusion === "excluded"
        ? isArabic
          ? "الطيران غير مشمول في سعر البرنامج"
          : "Flights are not included in the program price"
        : isArabic
          ? "سعر الطيران يتحدد حسب السعر والتوفر وقت الحجز"
          : "Flight price depends on live price and availability at booking time";

  const flightPolicyNote =
    isArabic
      ? program.flightNotesAr
      : program.flightNotesEn;

  const appDeepLink =
    `nourapp://programs/${program.id}`;

  return (
    <main
      className="nr-program-details"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <section className="nr-program-details-hero">
        {program.coverUrl ? (
          <Image
            src={program.coverUrl}
            alt={title}
            fill
            unoptimized
            priority
            className="nr-program-details-cover"
          />
        ) : null}

        <div
          className="nr-program-details-overlay"
          aria-hidden="true"
        />

        <div className="nr-program-details-container nr-program-details-hero-content">
          <Link
            href="/#programs"
            className="nr-program-details-back"
          >
            <ArrowLeft size={17} />

            {isArabic
              ? "العودة للبرامج"
              : "Back to Programs"}
          </Link>

          <div className="nr-program-details-copy">
            <div className="nr-program-details-top-tags">
              {program.isFeatured ? (
                <span className="nr-program-details-badge">
                  <Sparkles size={14} />
                  {isArabic
                    ? "برنامج مميز"
                    : "Featured Program"}
                </span>
              ) : null}

              {country ? (
                <span className="nr-program-details-country">
                  <MapPin size={16} />
                  {country}
                </span>
              ) : null}
            </div>

            <h1>{title}</h1>

            {summary ? (
              <p>{summary}</p>
            ) : null}

            <div className="nr-program-details-facts">
              <span>
                <CalendarDays />
                <strong>
                  {program.durationDays}
                </strong>
                {isArabic
                  ? " أيام"
                  : " days"}
              </span>

              <span>
                <Moon />
                <strong>
                  {program.durationNights}
                </strong>
                {isArabic
                  ? " ليالٍ"
                  : " nights"}
              </span>

              <span className="is-price">
                <strong>
                  {formatNumber(
                    program.basePrice,
                    language,
                  )}
                </strong>
                {` ${program.currencyCode}`}
              </span>
            </div>
          </div>
        </div>
      </section>

      <div className="nr-program-details-container nr-program-details-layout">
        <div className="nr-program-details-main">
          <section className="nr-program-details-section">
            <span className="nr-program-details-kicker">
              {isArabic
                ? "عن البرنامج"
                : "About the Program"}
            </span>

            <h2>
              {isArabic
                ? "تفاصيل البرنامج"
                : "Program Details"}
            </h2>

            {description ? (
              <p className="nr-program-details-description">
                {description}
              </p>
            ) : (
              <div className="nr-program-details-empty">
                {isArabic
                  ? "سيتم إضافة تفاصيل البرنامج قريبًا."
                  : "Program details will be added soon."}
              </div>
            )}

            <div className="nr-program-details-trust">
              <div>
                <ShieldCheck />
                <span>
                  {isArabic
                    ? "حجز آمن عبر التطبيق"
                    : "Secure booking via the app"}
                </span>
              </div>

              <div>
                <CheckCircle2 />
                <span>
                  {isArabic
                    ? "تفاصيل البرنامج محدثة"
                    : "Updated program details"}
                </span>
              </div>

              <div>
                <Smartphone />
                <span>
                  {isArabic
                    ? "إتمام الطلب من نور آب"
                    : "Complete booking in NourApp"}
                </span>
              </div>
            </div>
          </section>

          <section className="nr-program-details-section">
            <span className="nr-program-details-kicker">
              {isArabic
                ? "الإقامة"
                : "Accommodation"}
            </span>

            <h2>
              {isArabic
                ? "الفنادق والإقامة"
                : "Hotels & Accommodation"}
            </h2>

            {program.hotels.length === 0 ? (
              <div className="nr-program-details-empty">
                {isArabic
                  ? "لم تتم إضافة تفاصيل الفندق لهذا البرنامج بعد."
                  : "Hotel details have not been added to this program yet."}
              </div>
            ) : (
              <div className="nr-program-details-hotels">
                {program.hotels.map(
                  (hotel) => {
                    const hotelName =
                      isArabic
                        ? hotel.nameAr
                        : hotel.nameEn;

                    const city =
                      isArabic
                        ? hotel.cityAr
                        : hotel.cityEn;

                    const hotelDescription =
                      isArabic
                        ? hotel.descriptionAr
                        : hotel.descriptionEn;

                    const roomType =
                      isArabic
                        ? hotel.roomTypeAr
                        : hotel.roomTypeEn;

                    const mealPlan =
                      isArabic
                        ? hotel.mealPlanAr
                        : hotel.mealPlanEn;

                    const notes =
                      isArabic
                        ? hotel.notesAr
                        : hotel.notesEn;

                    return (
                      <article
                        key={hotel.relationId}
                        className="nr-program-details-hotel"
                      >
                        <div className="nr-program-details-hotel-cover">
                          {hotel.coverUrl ? (
                            <Image
                              src={hotel.coverUrl}
                              alt={hotelName}
                              fill
                              unoptimized
                              className="nr-program-details-hotel-image"
                            />
                          ) : (
                            <div className="nr-program-details-hotel-placeholder">
                              <BedDouble />
                            </div>
                          )}

                          {hotel.stars > 0 ? (
                            <div className="nr-program-details-stars-floating">
                              <Star
                                size={14}
                                fill="currentColor"
                              />
                              <strong>
                                {hotel.stars}
                              </strong>
                            </div>
                          ) : null}
                        </div>

                        <div className="nr-program-details-hotel-body">
                          <div className="nr-program-details-hotel-heading">
                            <div>
                              {city ? (
                                <span>
                                  <MapPin size={15} />
                                  {city}
                                </span>
                              ) : null}

                              <h3>
                                {hotelName}
                              </h3>
                            </div>
                          </div>

                          {hotelDescription ? (
                            <p>
                              {hotelDescription}
                            </p>
                          ) : null}

                          <div className="nr-program-details-hotel-meta">
                            <span>
                              <Moon />
                              {hotel.nights}{" "}
                              {isArabic
                                ? "ليالٍ"
                                : "nights"}
                            </span>

                            {roomType ? (
                              <span>
                                <BedDouble />
                                {roomType}
                              </span>
                            ) : null}

                            {mealPlan ? (
                              <span>
                                <Utensils />
                                {mealPlan}
                              </span>
                            ) : null}
                          </div>

                          {(hotel.checkInDate ||
                            hotel.checkOutDate) ? (
                            <div className="nr-program-details-dates">
                              {hotel.checkInDate ? (
                                <span>
                                  {isArabic
                                    ? "الدخول:"
                                    : "Check-in:"}{" "}
                                  <strong>
                                    {formatDate(
                                      hotel.checkInDate,
                                      language,
                                    )}
                                  </strong>
                                </span>
                              ) : null}

                              {hotel.checkOutDate ? (
                                <span>
                                  {isArabic
                                    ? "الخروج:"
                                    : "Check-out:"}{" "}
                                  <strong>
                                    {formatDate(
                                      hotel.checkOutDate,
                                      language,
                                    )}
                                  </strong>
                                </span>
                              ) : null}
                            </div>
                          ) : null}

                          {notes ? (
                            <p className="nr-program-details-notes">
                              {notes}
                            </p>
                          ) : null}
                        </div>

                        {hotel.galleryUrls.length > 0 ? (
                          <div className="nr-program-details-gallery">
                            {hotel.galleryUrls
                              .slice(0, 6)
                              .map(
                                (url, index) => (
                                  <div
                                    key={`${url}-${index}`}
                                    className="nr-program-details-gallery-item"
                                  >
                                    <Image
                                      src={url}
                                      alt={`${hotelName} ${index + 1}`}
                                      fill
                                      unoptimized
                                    />

                                    {index === 5 &&
                                    hotel.galleryUrls.length > 6 ? (
                                      <span className="nr-program-details-gallery-more">
                                        +{hotel.galleryUrls.length - 6}
                                      </span>
                                    ) : null}
                                  </div>
                                ),
                              )}
                          </div>
                        ) : null}
                      </article>
                    );
                  },
                )}
              </div>
            )}
          </section>

          <section className="nr-program-details-section">
            <span className="nr-program-details-kicker">
              {isArabic
                ? "النقل"
                : "Transport"}
            </span>

            <h2>
              {isArabic
                ? "النقل والمواصلات"
                : "Transport & Transfers"}
            </h2>

            {transports.length === 0 ? (
              <div className="nr-program-details-empty">
                {isArabic
                  ? "لم تتم إضافة تفاصيل النقل لهذا البرنامج بعد."
                  : "Transport details have not been added to this program yet."}
              </div>
            ) : (
              <div className="nr-program-transports-public">
                {transports.map((transport) => {
                  const service =
                    transport.transport;

                  const serviceName =
                    service
                      ? isArabic
                        ? service.nameAr
                        : service.nameEn
                      : isArabic
                        ? "خدمة نقل"
                        : "Transport Service";

                  const vehicleName =
                    service
                      ? isArabic
                        ? service.vehicleNameAr ||
                          service.vehicleType
                        : service.vehicleNameEn ||
                          service.vehicleType
                      : "";

                  const pickupName =
                    isArabic
                      ? transport.pickupNameAr
                      : transport.pickupNameEn;

                  const dropoffName =
                    isArabic
                      ? transport.dropoffNameAr
                      : transport.dropoffNameEn;

                  const notes =
                    isArabic
                      ? transport.notesAr
                      : transport.notesEn;

                  return (
                    <article
                      key={transport.id}
                      className="nr-program-transport-public-card"
                    >
                      <div className="nr-program-transport-public-header">
                        <div>
                          <span className="nr-program-transport-day">
                            {transport.dayNumber
                              ? isArabic
                                ? `اليوم ${transport.dayNumber}`
                                : `Day ${transport.dayNumber}`
                              : isArabic
                                ? "خدمة نقل"
                                : "Transport"}
                          </span>

                          <h3>
                            <BusFront size={20} />
                            {serviceName}
                          </h3>
                        </div>

                        <span
                          className={`nr-program-transport-inclusion ${
                            transport.isIncluded
                              ? "is-included"
                              : "is-excluded"
                          }`}
                        >
                          {transport.isIncluded
                            ? isArabic
                              ? "مشمول"
                              : "Included"
                            : isArabic
                              ? "غير مشمول"
                              : "Not Included"}
                        </span>
                      </div>

                      <div className="nr-program-transport-route">
                        <div>
                          <MapPin />
                          <span>
                            {isArabic
                              ? "الاستلام"
                              : "Pickup"}
                          </span>
                          <strong>
                            {pickupName || "—"}
                          </strong>
                        </div>

                        <div className="nr-program-transport-route-line">
                          <span />
                          <BusFront size={18} />
                          <span />
                        </div>

                        <div>
                          <MapPin />
                          <span>
                            {isArabic
                              ? "الوصول"
                              : "Drop-off"}
                          </span>
                          <strong>
                            {dropoffName || "—"}
                          </strong>
                        </div>
                      </div>

                      <div className="nr-program-transport-meta">
                        {service ? (
                          <>
                            <span>
                              <BusFront />
                              {service.mode === "private"
                                ? isArabic
                                  ? "نقل خاص"
                                  : "Private"
                                : isArabic
                                  ? "نقل مشترك"
                                  : "Shared"}
                            </span>

                            {vehicleName ? (
                              <span>
                                <BusFront />
                                {vehicleName}
                              </span>
                            ) : null}

                            <span>
                              <BriefcaseBusiness />
                              {isArabic
                                ? `${service.capacity} راكب`
                                : `${service.capacity} passengers`}
                            </span>
                          </>
                        ) : null}

                        {transport.pickupDatetime ? (
                          <span>
                            <CalendarDays />
                            {formatDateTime(
                              transport.pickupDatetime,
                              language,
                            )}
                          </span>
                        ) : null}

                        {transport.estimatedDurationMinutes !==
                        null ? (
                          <span>
                            <Clock3 />
                            {formatTransitDuration(
                              transport.estimatedDurationMinutes,
                              isArabic,
                            )}
                          </span>
                        ) : null}
                      </div>

                      {notes ? (
                        <p className="nr-program-transport-notes">
                          {notes}
                        </p>
                      ) : null}
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          <section className="nr-program-details-section">
            <span className="nr-program-details-kicker">
              {isArabic
                ? "التأشيرة"
                : "Visa"}
            </span>

            <h2>
              {isArabic
                ? "التأشيرات والمتطلبات"
                : "Visas & Requirements"}
            </h2>

            {visas.length === 0 ? (
              <div className="nr-program-details-empty">
                {isArabic
                  ? "لم تتم إضافة تفاصيل التأشيرة لهذا البرنامج بعد."
                  : "Visa details have not been added to this program yet."}
              </div>
            ) : (
              <div className="nr-program-visas-public">
                {visas.map((programVisa) => {
                  const visa = programVisa.visa;

                  const visaName =
                    visa
                      ? isArabic
                        ? visa.nameAr
                        : visa.nameEn
                      : isArabic
                        ? "تأشيرة"
                        : "Visa";

                  const visaDescription =
                    visa
                      ? isArabic
                        ? visa.descriptionAr
                        : visa.descriptionEn
                      : "";

                  const requirements =
                    visa
                      ? isArabic
                        ? visa.requirementsAr
                        : visa.requirementsEn
                      : [];

                  const notes =
                    isArabic
                      ? programVisa.notesAr
                      : programVisa.notesEn;

                  const visaTypeLabel =
                    visa?.visaType === "umrah"
                      ? isArabic
                        ? "تأشيرة عمرة"
                        : "Umrah Visa"
                      : visa?.visaType === "tourist"
                        ? isArabic
                          ? "تأشيرة سياحية"
                          : "Tourist Visa"
                        : visa?.visaType === "visit"
                          ? isArabic
                            ? "تأشيرة زيارة"
                            : "Visit Visa"
                          : visa?.visaType === "transit"
                            ? isArabic
                              ? "تأشيرة ترانزيت"
                              : "Transit Visa"
                            : isArabic
                              ? "تأشيرة أخرى"
                              : "Other Visa";

                  const processingLabel =
                    visa?.processingType === "express"
                      ? isArabic
                        ? "معالجة سريعة"
                        : "Express Processing"
                      : visa?.processingType === "manual"
                        ? isArabic
                          ? "معالجة يدوية"
                          : "Manual Processing"
                        : isArabic
                          ? "معالجة عادية"
                          : "Standard Processing";

                  return (
                    <article
                      key={programVisa.id}
                      className="nr-program-visa-public-card"
                    >
                      <div className="nr-program-visa-public-header">
                        <div>
                          <span className="nr-program-visa-type">
                            {visaTypeLabel}
                          </span>

                          <h3>
                            <Stamp size={20} />
                            {visaName}
                          </h3>
                        </div>

                        <span
                          className={`nr-program-visa-inclusion ${
                            programVisa.isIncluded
                              ? "is-included"
                              : "is-excluded"
                          }`}
                        >
                          {programVisa.isIncluded
                            ? isArabic
                              ? "مشمولة في البرنامج"
                              : "Included"
                            : isArabic
                              ? "غير مشمولة"
                              : "Not Included"}
                        </span>
                      </div>

                      {visaDescription ? (
                        <p className="nr-program-visa-description">
                          {visaDescription}
                        </p>
                      ) : null}

                      <div className="nr-program-visa-meta">
                        <span>
                          <Clock3 />
                          {processingLabel}
                        </span>

                        {visa?.processingTimeDays !== null &&
                        visa?.processingTimeDays !== undefined ? (
                          <span>
                            <CalendarDays />
                            {isArabic
                              ? `المعالجة خلال ${visa.processingTimeDays} يوم`
                              : `${visa.processingTimeDays} processing days`}
                          </span>
                        ) : null}

                        {visa?.validityDays !== null &&
                        visa?.validityDays !== undefined ? (
                          <span>
                            <ShieldCheck />
                            {isArabic
                              ? `الصلاحية ${visa.validityDays} يوم`
                              : `${visa.validityDays} days validity`}
                          </span>
                        ) : null}

                        {visa?.maxStayDays !== null &&
                        visa?.maxStayDays !== undefined ? (
                          <span>
                            <Moon />
                            {isArabic
                              ? `أقصى إقامة ${visa.maxStayDays} يوم`
                              : `Max stay ${visa.maxStayDays} days`}
                          </span>
                        ) : null}
                      </div>

                      {requirements.length > 0 ? (
                        <div className="nr-program-visa-requirements">
                          <div className="nr-program-visa-requirements-heading">
                            <CheckCircle2 />
                            <strong>
                              {isArabic
                                ? "المتطلبات"
                                : "Requirements"}
                            </strong>
                          </div>

                          <ul>
                            {requirements.map(
                              (requirement: string, index: number) => (
                                <li
                                  key={`${requirement}-${index}`}
                                >
                                  <CheckCircle2 />
                                  <span>
                                    {requirement}
                                  </span>
                                </li>
                              ),
                            )}
                          </ul>
                        </div>
                      ) : null}

                      {notes ? (
                        <p className="nr-program-visa-notes">
                          {notes}
                        </p>
                      ) : null}
                    </article>
                  );
                })}
              </div>
            )}
          </section>

          <section className="nr-program-details-section">
            <span className="nr-program-details-kicker">
              {isArabic
                ? "الطيران"
                : "Flights"}
            </span>

            <h2>
              {isArabic
                ? "تفاصيل الرحلات"
                : "Flight Details"}
            </h2>

            <div
              className={`nr-program-flight-policy nr-program-flight-policy-${program.flightInclusion}`}
            >
              <Plane size={19} />

              <div>
                <strong>
                  {flightPolicyLabel}
                </strong>

                {flightPolicyNote ? (
                  <span>
                    {flightPolicyNote}
                  </span>
                ) : null}
              </div>
            </div>

            {program.flights.length === 0 ? (
              <div className="nr-program-details-empty">
                {isArabic
                  ? "لم تتم إضافة تفاصيل الرحلات لهذا البرنامج بعد."
                  : "Flight details have not been added to this program yet."}
              </div>
            ) : (
              <div className="nr-program-flights-public">
                {program.flights.map((flight) => {
                  const airlineName =
                    isArabic
                      ? flight.airlineNameAr
                      : flight.airlineNameEn;

                  const departureAirport =
                    isArabic
                      ? flight.departureAirportAr
                      : flight.departureAirportEn;

                  const arrivalAirport =
                    isArabic
                      ? flight.arrivalAirportAr
                      : flight.arrivalAirportEn;

                  const cabinClass =
                    isArabic
                      ? flight.cabinClassAr
                      : flight.cabinClassEn;

                  const transitAirport =
                    isArabic
                      ? flight.transitAirportAr
                      : flight.transitAirportEn;

                  const notes =
                    isArabic
                      ? flight.notesAr
                      : flight.notesEn;

                  return (
                    <article
                      key={flight.id}
                      className="nr-program-flight-public-card"
                    >
                      <div className="nr-program-flight-public-header">
                        <div>
                          <span
                            className={`nr-program-flight-public-direction ${
                              flight.direction === "outbound"
                                ? "is-outbound"
                                : "is-return"
                            }`}
                          >
                            {flight.direction === "outbound"
                              ? isArabic
                                ? "رحلة الذهاب"
                                : "Outbound"
                              : isArabic
                                ? "رحلة العودة"
                                : "Return"}
                          </span>

                          <h3>
                            {airlineName ||
                              (isArabic
                                ? "تفاصيل الرحلة"
                                : "Flight")}
                          </h3>
                        </div>

                        {flight.flightNumber ? (
                          <strong className="nr-program-flight-number">
                            {flight.flightNumber}
                          </strong>
                        ) : null}
                      </div>

                      <div className="nr-program-flight-route">
                        <div>
                          <PlaneTakeoff />
                          <span>
                            {isArabic
                              ? "المغادرة"
                              : "Departure"}
                          </span>
                          <strong>
                            {departureAirport}
                          </strong>
                          {flight.departureAt ? (
                            <small>
                              {formatDateTime(
                                flight.departureAt,
                                language,
                              )}
                            </small>
                          ) : null}
                        </div>

                        <div className="nr-program-flight-route-line">
                          <span />
                          <Plane size={19} />
                          <span />
                        </div>

                        <div>
                          <PlaneLanding />
                          <span>
                            {isArabic
                              ? "الوصول"
                              : "Arrival"}
                          </span>
                          <strong>
                            {arrivalAirport}
                          </strong>
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

                      <div className="nr-program-flight-meta">
                        <span>
                          <Plane />
                          {flight.flightType === "direct"
                            ? isArabic
                              ? "مباشر"
                              : "Direct"
                            : isArabic
                              ? "ترانزيت"
                              : "Transit"}
                        </span>

                        {cabinClass ? (
                          <span>
                            <BriefcaseBusiness />
                            {cabinClass}
                          </span>
                        ) : null}

                        {flight.baggageAllowanceKg > 0 ? (
                          <span>
                            <BriefcaseBusiness />
                            {flight.baggageAllowanceKg}{" "}
                            {isArabic
                              ? "كجم أمتعة"
                              : "kg baggage"}
                          </span>
                        ) : null}
                      </div>

                      {flight.flightType === "transit" ? (
                        <div className="nr-program-flight-transit-public">
                          <Clock3 />

                          <div>
                            <strong>
                              {isArabic
                                ? "تفاصيل الترانزيت"
                                : "Transit Details"}
                            </strong>

                            <span>
                              {transitAirport ||
                                (isArabic
                                  ? "مطار الترانزيت غير محدد"
                                  : "Transit airport not specified")}

                              {flight.transitDurationMinutes > 0
                                ? ` • ${formatTransitDuration(
                                    flight.transitDurationMinutes,
                                    isArabic,
                                  )}`
                                : ""}
                            </span>
                          </div>
                        </div>
                      ) : null}

                      {notes ? (
                        <p className="nr-program-flight-public-notes">
                          {notes}
                        </p>
                      ) : null}
                    </article>
                  );
                })}
              </div>
            )}
          </section>
        </div>

        <aside className="nr-program-details-booking">
          <div className="nr-program-details-booking-label">
            <Sparkles size={15} />
            {isArabic
              ? "ابدأ رحلتك مع نور آب"
              : "Start your journey with NourApp"}
          </div>

          <span>
            {isArabic
              ? "السعر يبدأ من"
              : "Starting from"}
          </span>

          <strong>
            {formatNumber(
              program.basePrice,
              language,
            )}

            <small>
              {program.currencyCode}
            </small>
          </strong>

          <div className="nr-program-details-booking-facts">
            <span>
              <CalendarDays />
              {program.durationDays}{" "}
              {isArabic ? "أيام" : "days"}
            </span>

            <span>
              <Moon />
              {program.durationNights}{" "}
              {isArabic ? "ليالٍ" : "nights"}
            </span>
          </div>

          <p>
            {isArabic
              ? "الحجز وإتمام الطلب والدفع يتم عبر تطبيق نور آب."
              : "Booking, checkout and payment are completed through the NourApp application."}
          </p>

          <a
            href={appDeepLink}
            className="nr-program-details-book"
          >
            <Smartphone size={18} />
            {isArabic
              ? "احجز عبر تطبيق نور آب"
              : "Book via NourApp"}
          </a>

          <small className="nr-program-details-booking-hint">
            {isArabic
              ? "سيتم فتح البرنامج مباشرة داخل التطبيق."
              : "The program will open directly in the app."}
          </small>
        </aside>
      </div>

      <style jsx global>{`
        .nr-program-details {
          min-height: 100vh;
          background: #f5f8fd;
          color: #14253d;
        }

        .nr-program-details-container {
          width: min(1360px, calc(100% - 56px));
          margin-inline: auto;
        }

        .nr-program-details-hero {
          position: relative;
          min-height: 540px;
          overflow: hidden;
          background:
            radial-gradient(circle at 20% 20%, rgba(23, 111, 232, 0.28), transparent 36%),
            #07182c;
        }

        .nr-program-details-cover {
          object-fit: cover;
        }

        .nr-program-details-overlay {
          position: absolute;
          inset: 0;
          background:
            linear-gradient(
              90deg,
              rgba(4, 18, 34, 0.95),
              rgba(4, 18, 34, 0.58) 55%,
              rgba(4, 18, 34, 0.28)
            ),
            linear-gradient(
              0deg,
              rgba(4, 18, 34, 0.82),
              transparent 55%
            );
        }

        [dir="rtl"] .nr-program-details-overlay {
          background:
            linear-gradient(
              270deg,
              rgba(4, 18, 34, 0.95),
              rgba(4, 18, 34, 0.58) 55%,
              rgba(4, 18, 34, 0.28)
            ),
            linear-gradient(
              0deg,
              rgba(4, 18, 34, 0.82),
              transparent 55%
            );
        }

        .nr-program-details-hero-content {
          position: relative;
          z-index: 2;
          min-height: 540px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          padding-block: 84px 58px;
        }

        .nr-program-details-back {
          position: absolute;
          top: 34px;
          inset-inline-start: 0;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          color: rgba(255, 255, 255, 0.85);
          text-decoration: none;
          font-size: 13px;
          font-weight: 800;
          transition:
            opacity 160ms ease,
            transform 160ms ease;
        }

        .nr-program-details-back:hover {
          opacity: 1;
          transform: translateY(-1px);
        }

        [dir="rtl"] .nr-program-details-back svg {
          transform: rotate(180deg);
        }

        .nr-program-details-copy {
          max-width: 760px;
          color: #fff;
        }

        .nr-program-details-top-tags {
          display: flex;
          flex-wrap: wrap;
          align-items: center;
          gap: 10px;
        }

        .nr-program-details-badge,
        .nr-program-details-country {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          min-height: 34px;
          padding-inline: 11px;
          border-radius: 999px;
          font-size: 11px;
          font-weight: 900;
        }

        .nr-program-details-badge {
          color: #16365d;
          background: #ffc313;
        }

        .nr-program-details-country {
          color: #d5eaff;
          border: 1px solid rgba(255, 255, 255, 0.14);
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(12px);
        }

        .nr-program-details-copy h1 {
          margin: 18px 0 14px;
          font-size: clamp(40px, 4.6vw, 62px);
          line-height: 1.08;
          letter-spacing: -0.035em;
        }

        .nr-program-details-copy > p {
          max-width: 700px;
          margin: 0;
          color: rgba(255, 255, 255, 0.76);
          font-size: 15px;
          line-height: 1.95;
        }

        .nr-program-details-facts {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 24px;
        }

        .nr-program-details-facts span {
          min-height: 46px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding-inline: 15px;
          border: 1px solid rgba(255, 255, 255, 0.13);
          border-radius: 13px;
          background: rgba(255, 255, 255, 0.09);
          backdrop-filter: blur(14px);
        }

        .nr-program-details-facts span.is-price {
          color: #1c3558;
          border-color: rgba(255, 195, 19, 0.52);
          background: #ffc313;
        }

        .nr-program-details-facts svg {
          width: 17px;
          color: #ffc313;
        }

        .nr-program-details-facts .is-price svg {
          color: #1c3558;
        }

        .nr-program-details-layout {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 320px;
          gap: 24px;
          padding-block: 42px 76px;
        }

        .nr-program-details-main {
          display: grid;
          gap: 20px;
        }

        .nr-program-details-section {
          padding: 24px;
          border: 1px solid #dce5f0;
          border-radius: 20px;
          background: #fff;
          box-shadow: 0 18px 55px rgba(20, 59, 102, 0.07);
        }

        .nr-program-details-kicker {
          color: #176fe8;
          font-size: 11px;
          font-weight: 900;
          letter-spacing: 0.03em;
        }

        .nr-program-details-section h2 {
          margin: 7px 0 18px;
          color: #14253d;
          font-size: clamp(24px, 3vw, 30px);
        }

        .nr-program-details-description {
          margin: 0;
          color: #687b92;
          line-height: 2;
          white-space: pre-line;
        }

        .nr-program-details-trust {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 10px;
          margin-top: 22px;
        }

        .nr-program-details-trust > div {
          display: flex;
          align-items: center;
          gap: 8px;
          min-height: 62px;
          padding: 12px;
          border-radius: 13px;
          color: #526981;
          background: #f6f9fd;
          font-size: 11px;
          font-weight: 800;
        }

        .nr-program-details-trust svg {
          flex: 0 0 auto;
          width: 18px;
          color: #176fe8;
        }

        .nr-program-details-hotels {
          display: grid;
          gap: 20px;
        }

        .nr-program-details-hotel {
          overflow: hidden;
          border: 1px solid #dce5f0;
          border-radius: 20px;
          background: #fff;
        }

        .nr-program-details-hotel-cover {
          position: relative;
          height: 285px;
          overflow: hidden;
          background: #e8eef6;
        }

        .nr-program-details-hotel-image {
          object-fit: cover;
          transition: transform 350ms ease;
        }

        .nr-program-details-hotel:hover .nr-program-details-hotel-image {
          transform: scale(1.025);
        }

        .nr-program-details-hotel-placeholder {
          width: 100%;
          height: 100%;
          display: grid;
          place-items: center;
          color: #9aabc0;
        }

        .nr-program-details-hotel-placeholder svg {
          width: 46px;
          height: 46px;
        }

        .nr-program-details-stars-floating {
          position: absolute;
          top: 16px;
          inset-inline-end: 16px;
          z-index: 2;
          min-height: 34px;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding-inline: 10px;
          border-radius: 999px;
          color: #624800;
          background: rgba(255, 195, 19, 0.95);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.14);
        }

        .nr-program-details-hotel-body {
          padding: 19px;
        }

        .nr-program-details-hotel-heading {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 16px;
        }

        .nr-program-details-hotel-heading span {
          display: flex;
          align-items: center;
          gap: 5px;
          color: #176fe8;
          font-size: 11px;
          font-weight: 800;
        }

        .nr-program-details-hotel-heading h3 {
          margin: 6px 0 0;
          color: #17304f;
          font-size: 22px;
        }

        .nr-program-details-hotel-body > p {
          color: #687b92;
          line-height: 1.8;
        }

        .nr-program-details-hotel-meta {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 9px;
          margin-top: 18px;
        }

        .nr-program-details-hotel-meta span {
          min-height: 74px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 7px;
          padding: 9px;
          border-radius: 13px;
          color: #63758b;
          background: #f5f8fd;
          text-align: center;
          font-size: 11px;
          font-weight: 800;
        }

        .nr-program-details-hotel-meta svg {
          width: 19px;
          color: #176fe8;
        }

        .nr-program-details-dates {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 16px;
          color: #718198;
          font-size: 12px;
        }

        .nr-program-details-notes {
          padding: 12px;
          border-radius: 10px;
          background: #f7f9fc;
        }

        .nr-program-details-gallery {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 7px;
          padding: 0 22px 22px;
        }

        .nr-program-details-gallery-item {
          position: relative;
          height: 108px;
          overflow: hidden;
          border-radius: 12px;
          background: #e8eef6;
        }

        .nr-program-details-gallery-item img {
          object-fit: cover;
          transition: transform 250ms ease;
        }

        .nr-program-details-gallery-item:hover img {
          transform: scale(1.04);
        }

        .nr-program-details-gallery-more {
          position: absolute;
          inset: 0;
          display: grid;
          place-items: center;
          color: #fff;
          background: rgba(5, 19, 35, 0.62);
          font-size: 22px;
          font-weight: 900;
        }

        .nr-program-details-empty {
          padding: 25px;
          border: 1px dashed #d5deea;
          border-radius: 15px;
          color: #7b8ba0;
          background: #f8fafd;
          text-align: center;
        }

        .nr-program-flight-policy {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          margin-bottom: 18px;
          padding: 14px 16px;
          border: 1px solid #dce5f0;
          border-radius: 14px;
          background: #f8fafd;
        }

        .nr-program-flight-policy > svg {
          flex: 0 0 auto;
          margin-top: 2px;
          color: #176fe8;
        }

        .nr-program-flight-policy div {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .nr-program-flight-policy strong {
          color: #17304f;
          font-size: 13px;
        }

        .nr-program-flight-policy span {
          color: #6f7e92;
          font-size: 11px;
          line-height: 1.7;
        }

        .nr-program-flight-policy-included {
          border-color: rgba(22, 163, 74, 0.2);
          background: rgba(22, 163, 74, 0.05);
        }

        .nr-program-flight-policy-excluded {
          border-color: rgba(220, 38, 38, 0.16);
          background: rgba(220, 38, 38, 0.04);
        }

        .nr-program-flight-policy-dynamic {
          border-color: rgba(23, 111, 232, 0.18);
          background: rgba(23, 111, 232, 0.05);
        }

        .nr-program-flights-public {
          display: grid;
          gap: 16px;
        }

        .nr-program-flight-public-card {
          padding: 17px;
          border: 1px solid #dce5f0;
          border-radius: 18px;
          background: #fff;
          transition:
            transform 180ms ease,
            box-shadow 180ms ease;
        }

        .nr-program-flight-public-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 36px rgba(20, 59, 102, 0.08);
        }

        .nr-program-flight-public-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 18px;
        }

        .nr-program-flight-public-header h3 {
          margin: 7px 0 0;
          font-size: 19px;
        }

        .nr-program-flight-public-direction {
          display: inline-flex;
          min-height: 25px;
          align-items: center;
          padding-inline: 9px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 900;
        }

        .nr-program-flight-public-direction.is-outbound {
          color: #176fe8;
          background: rgba(23, 111, 232, 0.08);
        }

        .nr-program-flight-public-direction.is-return {
          color: #7c3aed;
          background: rgba(124, 58, 237, 0.08);
        }

        .nr-program-flight-number {
          padding: 8px 10px;
          border-radius: 10px;
          color: #17304f;
          background: #f5f8fd;
          font-size: 12px;
        }

        .nr-program-flight-route {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 120px minmax(0, 1fr);
          align-items: center;
          gap: 14px;
          padding: 18px;
          border-radius: 15px;
          background: #f8fafd;
        }

        .nr-program-flight-route > div:not(.nr-program-flight-route-line) {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .nr-program-flight-route svg {
          width: 18px;
          color: #176fe8;
        }

        .nr-program-flight-route span {
          color: #8a98aa;
          font-size: 10px;
          font-weight: 800;
        }

        .nr-program-flight-route strong {
          color: #17304f;
          font-size: 13px;
          line-height: 1.6;
        }

        .nr-program-flight-route small {
          color: #687b92;
          font-size: 10px;
        }

        .nr-program-flight-route-line {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .nr-program-flight-route-line span {
          height: 1px;
          flex: 1;
          background: #cfd9e6;
        }

        .nr-program-flight-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 13px;
        }

        .nr-program-flight-meta span {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          min-height: 34px;
          padding-inline: 10px;
          border-radius: 10px;
          color: #62758c;
          background: #f5f8fd;
          font-size: 10px;
          font-weight: 800;
        }

        .nr-program-flight-meta svg {
          width: 15px;
          color: #176fe8;
        }

        .nr-program-flight-transit-public {
          display: flex;
          gap: 10px;
          margin-top: 13px;
          padding: 12px;
          border: 1px dashed rgba(217, 119, 6, 0.25);
          border-radius: 11px;
          background: rgba(245, 158, 11, 0.05);
        }

        .nr-program-flight-transit-public > svg {
          flex: 0 0 auto;
          width: 17px;
          color: #b45309;
        }

        .nr-program-flight-transit-public div {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }

        .nr-program-flight-transit-public strong {
          color: #9a4f06;
          font-size: 11px;
        }

        .nr-program-flight-transit-public span {
          color: #7d6b58;
          font-size: 10px;
        }

        .nr-program-flight-public-notes {
          margin: 13px 0 0;
          padding: 11px 12px;
          border-radius: 10px;
          color: #687b92;
          background: #f8fafd;
          font-size: 11px;
          line-height: 1.8;
        }


        .nr-program-transports-public {
          display: grid;
          gap: 16px;
        }

        .nr-program-transport-public-card {
          padding: 17px;
          border: 1px solid #dce5f0;
          border-radius: 18px;
          background: #fff;
          transition:
            transform 180ms ease,
            box-shadow 180ms ease;
        }

        .nr-program-transport-public-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 36px rgba(20, 59, 102, 0.08);
        }

        .nr-program-transport-public-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 14px;
          margin-bottom: 16px;
        }

        .nr-program-transport-public-header h3 {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 7px 0 0;
          color: #17304f;
          font-size: 19px;
        }

        .nr-program-transport-public-header h3 svg {
          color: #176fe8;
        }

        .nr-program-transport-day {
          display: inline-flex;
          min-height: 25px;
          align-items: center;
          padding-inline: 9px;
          border-radius: 999px;
          color: #176fe8;
          background: rgba(23, 111, 232, 0.08);
          font-size: 10px;
          font-weight: 900;
        }

        .nr-program-transport-inclusion {
          display: inline-flex;
          min-height: 29px;
          align-items: center;
          padding-inline: 10px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 900;
          white-space: nowrap;
        }

        .nr-program-transport-inclusion.is-included {
          color: #047857;
          background: rgba(16, 185, 129, 0.1);
        }

        .nr-program-transport-inclusion.is-excluded {
          color: #b45309;
          background: rgba(245, 158, 11, 0.11);
        }

        .nr-program-transport-route {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 110px minmax(0, 1fr);
          align-items: center;
          gap: 12px;
          padding: 18px;
          border-radius: 15px;
          background: #f8fafd;
        }

        .nr-program-transport-route > div:not(.nr-program-transport-route-line) {
          display: flex;
          flex-direction: column;
          gap: 5px;
        }

        .nr-program-transport-route svg {
          width: 18px;
          color: #176fe8;
        }

        .nr-program-transport-route span {
          color: #8a98aa;
          font-size: 10px;
          font-weight: 800;
        }

        .nr-program-transport-route strong {
          color: #17304f;
          font-size: 13px;
          line-height: 1.6;
        }

        .nr-program-transport-route-line {
          display: flex;
          align-items: center;
          gap: 5px;
        }

        .nr-program-transport-route-line span {
          height: 1px;
          flex: 1;
          background: #cfd9e6;
        }

        .nr-program-transport-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 13px;
        }

        .nr-program-transport-meta span {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          min-height: 34px;
          padding-inline: 10px;
          border-radius: 10px;
          color: #62758c;
          background: #f5f8fd;
          font-size: 10px;
          font-weight: 800;
        }

        .nr-program-transport-meta svg {
          width: 15px;
          color: #176fe8;
        }

        .nr-program-transport-notes {
          margin: 13px 0 0;
          padding: 11px 12px;
          border-radius: 10px;
          color: #687b92;
          background: #f8fafd;
          font-size: 11px;
          line-height: 1.8;
          white-space: pre-line;
        }


        .nr-program-visas-public {
          display: grid;
          gap: 16px;
        }

        .nr-program-visa-public-card {
          padding: 17px;
          border: 1px solid #dce5f0;
          border-radius: 18px;
          background: #fff;
          transition:
            transform 180ms ease,
            box-shadow 180ms ease;
        }

        .nr-program-visa-public-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 14px 36px rgba(20, 59, 102, 0.08);
        }

        .nr-program-visa-public-header {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 14px;
        }

        .nr-program-visa-public-header h3 {
          display: flex;
          align-items: center;
          gap: 8px;
          margin: 7px 0 0;
          color: #17304f;
          font-size: 19px;
        }

        .nr-program-visa-public-header h3 svg {
          color: #176fe8;
        }

        .nr-program-visa-type {
          display: inline-flex;
          min-height: 25px;
          align-items: center;
          padding-inline: 9px;
          border-radius: 999px;
          color: #176fe8;
          background: rgba(23, 111, 232, 0.08);
          font-size: 10px;
          font-weight: 900;
        }

        .nr-program-visa-inclusion {
          display: inline-flex;
          min-height: 29px;
          align-items: center;
          padding-inline: 10px;
          border-radius: 999px;
          font-size: 10px;
          font-weight: 900;
          white-space: nowrap;
        }

        .nr-program-visa-inclusion.is-included {
          color: #047857;
          background: rgba(16, 185, 129, 0.1);
        }

        .nr-program-visa-inclusion.is-excluded {
          color: #b45309;
          background: rgba(245, 158, 11, 0.11);
        }

        .nr-program-visa-description {
          margin: 14px 0 0;
          color: #687b92;
          font-size: 12px;
          line-height: 1.9;
          white-space: pre-line;
        }

        .nr-program-visa-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 14px;
        }

        .nr-program-visa-meta span {
          display: inline-flex;
          min-height: 34px;
          align-items: center;
          gap: 6px;
          padding-inline: 10px;
          border-radius: 10px;
          color: #62758c;
          background: #f5f8fd;
          font-size: 10px;
          font-weight: 800;
        }

        .nr-program-visa-meta svg {
          width: 15px;
          color: #176fe8;
        }

        .nr-program-visa-requirements {
          margin-top: 15px;
          padding: 14px;
          border: 1px solid rgba(23, 111, 232, 0.12);
          border-radius: 13px;
          background: rgba(23, 111, 232, 0.035);
        }

        .nr-program-visa-requirements-heading {
          display: flex;
          align-items: center;
          gap: 7px;
          color: #17304f;
          font-size: 12px;
        }

        .nr-program-visa-requirements-heading svg {
          width: 17px;
          color: #176fe8;
        }

        .nr-program-visa-requirements ul {
          display: grid;
          gap: 8px;
          margin: 12px 0 0;
          padding: 0;
          list-style: none;
        }

        .nr-program-visa-requirements li {
          display: flex;
          align-items: flex-start;
          gap: 8px;
          color: #63758b;
          font-size: 11px;
          line-height: 1.7;
        }

        .nr-program-visa-requirements li svg {
          flex: 0 0 auto;
          width: 15px;
          margin-top: 2px;
          color: #16a34a;
        }

        .nr-program-visa-notes {
          margin: 13px 0 0;
          padding: 11px 12px;
          border-radius: 10px;
          color: #687b92;
          background: #f8fafd;
          font-size: 11px;
          line-height: 1.8;
          white-space: pre-line;
        }

        .nr-program-details-booking {
          position: sticky;
          top: 24px;
          height: fit-content;
          padding: 22px;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.08);
          border-radius: 20px;
          background:
            radial-gradient(circle at 15% 0%, rgba(23, 111, 232, 0.32), transparent 38%),
            #0b294b;
          color: #fff;
          box-shadow: 0 25px 70px rgba(11, 41, 75, 0.2);
        }

        .nr-program-details-booking-label {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          margin-bottom: 18px;
          padding: 7px 9px;
          border-radius: 999px;
          color: #d7e8fb;
          background: rgba(255, 255, 255, 0.08);
          font-size: 10px;
          font-weight: 800;
        }

        .nr-program-details-booking > span {
          display: block;
          color: rgba(255, 255, 255, 0.62);
          font-size: 12px;
        }

        .nr-program-details-booking > strong {
          display: block;
          margin-top: 8px;
          color: #ffc313;
          font-size: 38px;
          line-height: 1;
        }

        .nr-program-details-booking strong small {
          margin-inline-start: 5px;
          color: rgba(255, 255, 255, 0.72);
          font-size: 12px;
        }

        .nr-program-details-booking-facts {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-top: 18px;
        }

        .nr-program-details-booking-facts span {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          min-height: 32px;
          padding-inline: 9px;
          border-radius: 9px;
          color: rgba(255, 255, 255, 0.78);
          background: rgba(255, 255, 255, 0.07);
          font-size: 10px;
          font-weight: 800;
        }

        .nr-program-details-booking-facts svg {
          width: 14px;
          color: #ffc313;
        }

        .nr-program-details-booking p {
          color: rgba(255, 255, 255, 0.67);
          font-size: 12px;
          line-height: 1.8;
        }

        .nr-program-details-book {
          min-height: 52px;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 19px;
          border-radius: 13px;
          color: #12345d;
          background: #ffc313;
          text-decoration: none;
          font-size: 13px;
          font-weight: 900;
          transition:
            transform 160ms ease,
            box-shadow 160ms ease;
        }

        .nr-program-details-book:hover {
          transform: translateY(-1px);
          box-shadow: 0 10px 30px rgba(255, 195, 19, 0.22);
        }

        .nr-program-details-booking-hint {
          display: block;
          margin-top: 10px;
          color: rgba(255, 255, 255, 0.45);
          font-size: 10px;
          text-align: center;
        }

        .nr-program-details-state {
          min-height: 100vh;
          display: grid;
          place-items: center;
          align-content: center;
          gap: 12px;
          padding: 24px;
          color: #14253d;
          background: #f5f8fd;
          text-align: center;
        }

        .nr-program-details-state strong {
          font-size: 38px;
        }

        .nr-program-details-state a {
          min-height: 44px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding-inline: 16px;
          border-radius: 11px;
          color: #fff;
          background: #176fe8;
          text-decoration: none;
          font-weight: 800;
        }

        .nr-program-details-loader {
          width: 34px;
          height: 34px;
          border: 3px solid #dce7f5;
          border-top-color: #176fe8;
          border-radius: 50%;
          animation: nrProgramSpin 0.8s linear infinite;
        }

        @keyframes nrProgramSpin {
          to {
            transform: rotate(360deg);
          }
        }


        @media (min-width: 1500px) {
          .nr-program-details-container {
            width: min(1460px, calc(100% - 72px));
          }

          .nr-program-details-layout {
            grid-template-columns: minmax(0, 1fr) 330px;
          }
        }

        @media (min-width: 921px) and (max-width: 1366px) {
          .nr-program-details-container {
            width: min(1200px, calc(100% - 40px));
          }

          .nr-program-details-hero {
            min-height: 510px;
          }

          .nr-program-details-hero-content {
            min-height: 510px;
            padding-block: 76px 48px;
          }

          .nr-program-details-copy h1 {
            font-size: clamp(38px, 4.4vw, 56px);
          }

          .nr-program-details-layout {
            grid-template-columns: minmax(0, 1fr) 300px;
          }
        }

        @media (max-width: 980px) {
          .nr-program-details-layout {
            grid-template-columns: 1fr;
          }

          .nr-program-details-booking {
            position: static;
          }
        }

        @media (max-width: 720px) {
          .nr-program-details-hero,
          .nr-program-details-hero-content {
            min-height: 575px;
          }

          .nr-program-details-copy h1 {
            font-size: 42px;
          }

          .nr-program-details-layout {
            padding-block: 34px 70px;
          }

          .nr-program-details-section {
            padding: 17px;
            border-radius: 19px;
          }

          .nr-program-details-trust {
            grid-template-columns: 1fr;
          }

          .nr-program-details-hotel-cover {
            height: 235px;
          }

          .nr-program-details-hotel-meta {
            grid-template-columns: 1fr;
          }

          .nr-program-details-gallery {
            grid-template-columns: repeat(2, 1fr);
          }

          .nr-program-flight-route,
          .nr-program-transport-route {
            grid-template-columns: 1fr;
          }

          .nr-program-flight-route-line,
          .nr-program-transport-route-line {
            width: 70px;
            margin: 2px auto;
            transform: rotate(90deg);
          }

          .nr-program-details-booking {
            border-radius: 18px;
          }
        }

        @media (max-width: 480px) {
          .nr-program-details-container {
            width: min(100% - 22px, 1180px);
          }

          .nr-program-details-copy h1 {
            font-size: 36px;
          }

          .nr-program-details-copy > p {
            font-size: 14px;
          }

          .nr-program-details-facts {
            gap: 8px;
          }

          .nr-program-details-facts span {
            min-height: 44px;
            padding-inline: 11px;
            font-size: 11px;
          }

          .nr-program-details-gallery {
            grid-template-columns: 1fr 1fr;
            padding-inline: 14px;
            padding-bottom: 14px;
          }

          .nr-program-details-gallery-item {
            height: 105px;
          }

          .nr-program-flight-public-card {
            padding: 15px;
          }

          .nr-program-flight-public-header,
          .nr-program-visa-public-header {
            flex-direction: column;
          }
        }
      `}</style>
    </main>
  );
}