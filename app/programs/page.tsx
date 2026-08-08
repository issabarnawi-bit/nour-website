"use client";

import Image from "next/image";
import Link from "next/link";
import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ArrowLeft,
  CalendarDays,
  MapPin,
  Moon,
  Plane,
  Search,
  Sparkles,
} from "lucide-react";

import { useLanguage } from "../../src/core/i18n";
import { createClient } from "../../src/lib/supabase/client";

type MediaRow = {
  bucket: string;
  path: string;
};

type CountryRow = {
  id: string;
  name_ar: string;
  name_en: string;
};

type ProgramRow = {
  id: string;
  title_ar: string;
  title_en: string;
  slug: string;
  summary_ar: string | null;
  summary_en: string | null;
  country_id: string | null;
  duration_days: number;
  duration_nights: number;
  base_price: number | string;
  currency_code: string;
  is_featured: boolean;
  sort_order: number;
  created_at: string;
  flight_inclusion: "included" | "excluded" | "dynamic";
  cover_media: MediaRow | MediaRow[] | null;
};

type PublicProgram = {
  id: string;
  titleAr: string;
  titleEn: string;
  slug: string;
  summaryAr: string;
  summaryEn: string;
  countryId: string | null;
  countryNameAr: string;
  countryNameEn: string;
  durationDays: number;
  durationNights: number;
  basePrice: number;
  currencyCode: string;
  isFeatured: boolean;
  flightInclusion: "included" | "excluded" | "dynamic";
  coverUrl: string | null;
};

function getCoverMedia(
  media: ProgramRow["cover_media"],
) {
  if (!media) return null;
  return Array.isArray(media)
    ? media[0] ?? null
    : media;
}

function createPublicMediaUrl(
  supabaseUrl: string,
  bucket: string,
  path: string,
) {
  return `${supabaseUrl}/storage/v1/object/public/${bucket}/${path}`;
}

function formatPrice(
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

async function loadPublicPrograms(
  supabase: ReturnType<typeof createClient>,
): Promise<PublicProgram[]> {
  const { data, error } = await supabase
    .from("programs")
    .select(`
      id,
      title_ar,
      title_en,
      slug,
      summary_ar,
      summary_en,
      country_id,
      duration_days,
      duration_nights,
      base_price,
      currency_code,
      is_featured,
      sort_order,
      created_at,
      flight_inclusion,
      cover_media:media!programs_cover_media_id_fkey (
        bucket,
        path
      )
    `)
    .eq("status", "published")
    .eq("is_active", true)
    .is("deleted_at", null)
    .order("is_featured", {
      ascending: false,
    })
    .order("sort_order", {
      ascending: true,
    })
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    throw new Error(
      `Failed to load public programs: ${error.message}`,
    );
  }

  const rows = (data ?? []) as ProgramRow[];

  const countryIds = [
    ...new Set(
      rows
        .map((program) => program.country_id)
        .filter(
          (countryId): countryId is string =>
            typeof countryId === "string",
        ),
    ),
  ];

  const countryMap =
    new Map<string, CountryRow>();

  if (countryIds.length > 0) {
    const {
      data: countriesData,
      error: countriesError,
    } = await supabase
      .from("countries")
      .select("id,name_ar,name_en")
      .in("id", countryIds)
      .eq("is_active", true)
      .is("deleted_at", null);

    if (countriesError) {
      throw new Error(
        `Failed to load program countries: ${countriesError.message}`,
      );
    }

    (
      (countriesData ?? []) as CountryRow[]
    ).forEach((country) => {
      countryMap.set(
        country.id,
        country,
      );
    });
  }

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";

  return rows.map((program) => {
    const country = program.country_id
      ? countryMap.get(program.country_id)
      : undefined;

    const coverMedia =
      getCoverMedia(program.cover_media);

    return {
      id: program.id,
      titleAr: program.title_ar,
      titleEn: program.title_en,
      slug: program.slug,
      summaryAr: program.summary_ar ?? "",
      summaryEn: program.summary_en ?? "",
      countryId: program.country_id,
      countryNameAr:
        country?.name_ar ?? "",
      countryNameEn:
        country?.name_en ?? "",
      durationDays:
        program.duration_days,
      durationNights:
        program.duration_nights,
      basePrice:
        Number(program.base_price) || 0,
      currencyCode:
        program.currency_code,
      isFeatured:
        program.is_featured,
      flightInclusion:
        program.flight_inclusion ??
        "dynamic",
      coverUrl:
        coverMedia && supabaseUrl
          ? createPublicMediaUrl(
              supabaseUrl,
              coverMedia.bucket,
              coverMedia.path,
            )
          : null,
    };
  });
}

export default function PublicProgramsPage() {
  const { language } = useLanguage();
  const isArabic = language === "ar";

  const [searchValue, setSearchValue] =
    useState("");
  const [countryFilter, setCountryFilter] =
    useState("all");

  const supabase = useMemo(
    () => createClient(),
    [],
  );

  const {
    data: programs = [],
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["public", "programs"],
    queryFn: () =>
      loadPublicPrograms(supabase),
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const countries = useMemo(() => {
    const map = new Map<
      string,
      { id: string; name: string }
    >();

    programs.forEach((program) => {
      if (!program.countryId) return;

      map.set(program.countryId, {
        id: program.countryId,
        name: isArabic
          ? program.countryNameAr
          : program.countryNameEn,
      });
    });

    return [...map.values()].filter(
      (country) => country.name,
    );
  }, [programs, isArabic]);

  const visiblePrograms = useMemo(() => {
    const search =
      searchValue.trim().toLowerCase();

    return programs.filter((program) => {
      const title = isArabic
        ? program.titleAr
        : program.titleEn;

      const summary = isArabic
        ? program.summaryAr
        : program.summaryEn;

      const country = isArabic
        ? program.countryNameAr
        : program.countryNameEn;

      const matchesSearch =
        !search ||
        title
          .toLowerCase()
          .includes(search) ||
        summary
          .toLowerCase()
          .includes(search) ||
        country
          .toLowerCase()
          .includes(search);

      const matchesCountry =
        countryFilter === "all" ||
        program.countryId === countryFilter;

      return (
        matchesSearch &&
        matchesCountry
      );
    });
  }, [
    programs,
    searchValue,
    countryFilter,
    isArabic,
  ]);

  return (
    <main
      className="nr-all-programs"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <section className="nr-all-programs-hero">
        <div className="nr-all-programs-container">
          <Link
            href="/"
            className="nr-all-programs-back"
          >
            <ArrowLeft size={17} />
            {isArabic
              ? "العودة للرئيسية"
              : "Back Home"}
          </Link>

          <span className="nr-all-programs-kicker">
            <Sparkles size={15} />
            {isArabic
              ? "برامج نور آب"
              : "NourApp Programs"}
          </span>

          <h1>
            {isArabic
              ? "اختر البرنامج المناسب لرحلتك"
              : "Choose the right program for your journey"}
          </h1>

          <p>
            {isArabic
              ? "تصفح برامج العمرة المنشورة في نور آب، وقارن المدة والإقامة والسعر الأساسي ثم افتح تفاصيل البرنامج قبل المتابعة عبر التطبيق."
              : "Browse published Umrah programs on NourApp, compare duration, accommodation and base price, then review full details before continuing in the app."}
          </p>
        </div>
      </section>

      <section className="nr-all-programs-content">
        <div className="nr-all-programs-container">
          <div className="nr-all-programs-toolbar">
            <label className="nr-all-programs-search">
              <Search size={18} />

              <input
                type="search"
                value={searchValue}
                onChange={(event) =>
                  setSearchValue(
                    event.target.value,
                  )
                }
                placeholder={
                  isArabic
                    ? "ابحث عن برنامج أو دولة..."
                    : "Search program or country..."
                }
              />
            </label>

            <select
              value={countryFilter}
              onChange={(event) =>
                setCountryFilter(
                  event.target.value,
                )
              }
              aria-label={
                isArabic
                  ? "تصفية حسب الدولة"
                  : "Filter by country"
              }
            >
              <option value="all">
                {isArabic
                  ? "جميع الدول"
                  : "All Countries"}
              </option>

              {countries.map((country) => (
                <option
                  key={country.id}
                  value={country.id}
                >
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          <div className="nr-all-programs-result-row">
            <strong>
              {isArabic
                ? `${visiblePrograms.length} برنامج`
                : `${visiblePrograms.length} programs`}
            </strong>
          </div>

          {isLoading ? (
            <div className="nr-all-programs-state">
              <div className="nr-all-programs-loader" />
              <strong>
                {isArabic
                  ? "جارٍ تحميل البرامج..."
                  : "Loading programs..."}
              </strong>
            </div>
          ) : isError ? (
            <div className="nr-all-programs-state is-error">
              <strong>
                {isArabic
                  ? "تعذر تحميل البرامج"
                  : "Unable to load programs"}
              </strong>

              <p>
                {error instanceof Error
                  ? error.message
                  : ""}
              </p>
            </div>
          ) : visiblePrograms.length === 0 ? (
            <div className="nr-all-programs-state">
              <strong>
                {isArabic
                  ? "لا توجد برامج مطابقة"
                  : "No matching programs"}
              </strong>

              <p>
                {isArabic
                  ? "جرّب تغيير كلمات البحث أو اختيار دولة أخرى."
                  : "Try another search or country."}
              </p>
            </div>
          ) : (
            <div className="nr-all-programs-grid">
              {visiblePrograms.map(
                (program) => {
                  const title = isArabic
                    ? program.titleAr
                    : program.titleEn;

                  const summary = isArabic
                    ? program.summaryAr
                    : program.summaryEn;

                  const country = isArabic
                    ? program.countryNameAr
                    : program.countryNameEn;

                  const flightLabel =
                    program.flightInclusion ===
                    "included"
                      ? isArabic
                        ? "الطيران مشمول"
                        : "Flights included"
                      : program.flightInclusion ===
                          "excluded"
                        ? isArabic
                          ? "الطيران غير مشمول"
                          : "Flights excluded"
                        : isArabic
                          ? "سعر الطيران ديناميكي"
                          : "Dynamic flight price";

                  return (
                    <article
                      key={program.id}
                      className="nr-all-programs-card"
                    >
                      <Link
                        href={`/programs/${program.slug}`}
                        className="nr-all-programs-image"
                      >
                        {program.coverUrl ? (
                          <Image
                            src={program.coverUrl}
                            alt={title}
                            fill
                            unoptimized
                          />
                        ) : (
                          <div className="nr-all-programs-placeholder">
                            <Sparkles />
                          </div>
                        )}

                        {program.isFeatured ? (
                          <span className="nr-all-programs-featured">
                            <Sparkles size={13} />
                            {isArabic
                              ? "مميز"
                              : "Featured"}
                          </span>
                        ) : null}
                      </Link>

                      <div className="nr-all-programs-card-body">
                        {country ? (
                          <span className="nr-all-programs-country">
                            <MapPin size={14} />
                            {country}
                          </span>
                        ) : null}

                        <h2>
                          <Link
                            href={`/programs/${program.slug}`}
                          >
                            {title}
                          </Link>
                        </h2>

                        {summary ? (
                          <p>{summary}</p>
                        ) : null}

                        <div className="nr-all-programs-meta">
                          <span>
                            <CalendarDays />
                            {program.durationDays}{" "}
                            {isArabic
                              ? "أيام"
                              : "days"}
                          </span>

                          <span>
                            <Moon />
                            {program.durationNights}{" "}
                            {isArabic
                              ? "ليالٍ"
                              : "nights"}
                          </span>

                          <span>
                            <Plane />
                            {flightLabel}
                          </span>
                        </div>

                        <div className="nr-all-programs-card-footer">
                          <div>
                            <small>
                              {isArabic
                                ? "يبدأ من"
                                : "Starting from"}
                            </small>

                            <strong>
                              {formatPrice(
                                program.basePrice,
                                language,
                              )}{" "}
                              <span>
                                {
                                  program.currencyCode
                                }
                              </span>
                            </strong>
                          </div>

                          <Link
                            href={`/programs/${program.slug}`}
                            className="nr-all-programs-details"
                          >
                            {isArabic
                              ? "عرض التفاصيل"
                              : "View Details"}
                          </Link>
                        </div>
                      </div>
                    </article>
                  );
                },
              )}
            </div>
          )}
        </div>
      </section>

      <style jsx global>{`
        .nr-all-programs {
          min-height: 100vh;
          color: #14253d;
          background: #f5f8fd;
        }

        .nr-all-programs-container {
          width: min(1360px, calc(100% - 56px));
          margin-inline: auto;
        }

        .nr-all-programs-hero {
          position: relative;
          overflow: hidden;
          padding: 34px 0 58px;
          color: #fff;
          background:
            radial-gradient(
              circle at 12% 20%,
              rgba(23, 111, 232, 0.28),
              transparent 34%
            ),
            radial-gradient(
              circle at 85% 80%,
              rgba(255, 195, 19, 0.11),
              transparent 30%
            ),
            #081b30;
        }

        .nr-all-programs-back {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          margin-bottom: 38px;
          color: rgba(255, 255, 255, 0.75);
          text-decoration: none;
          font-size: 12px;
          font-weight: 800;
        }

        [dir="rtl"] .nr-all-programs-back svg {
          transform: rotate(180deg);
        }

        .nr-all-programs-kicker {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          min-height: 34px;
          padding-inline: 12px;
          border: 1px solid rgba(23, 111, 232, 0.35);
          border-radius: 999px;
          color: #8fc4ff;
          background: rgba(23, 111, 232, 0.1);
          font-size: 11px;
          font-weight: 900;
        }

        .nr-all-programs-hero h1 {
          max-width: 900px;
          margin: 17px 0 12px;
          font-size: clamp(36px, 4.4vw, 58px);
          line-height: 1.16;
          letter-spacing: -0.035em;
        }

        .nr-all-programs-hero p {
          max-width: 850px;
          margin: 0;
          color: rgba(255, 255, 255, 0.67);
          font-size: 14px;
          line-height: 1.9;
        }

        .nr-all-programs-content {
          padding: 32px 0 72px;
        }

        .nr-all-programs-toolbar {
          display: grid;
          grid-template-columns: minmax(0, 1fr) 230px;
          gap: 12px;
          padding: 14px;
          border: 1px solid #dce5f0;
          border-radius: 18px;
          background: #fff;
          box-shadow: 0 14px 40px rgba(20, 59, 102, 0.06);
        }

        .nr-all-programs-search {
          min-height: 48px;
          display: flex;
          align-items: center;
          gap: 9px;
          padding-inline: 13px;
          border: 1px solid #dce5f0;
          border-radius: 12px;
          background: #f8fafd;
        }

        .nr-all-programs-search svg {
          flex: 0 0 auto;
          color: #176fe8;
        }

        .nr-all-programs-search input {
          width: 100%;
          border: 0;
          outline: 0;
          color: #14253d;
          background: transparent;
          font: inherit;
        }

        .nr-all-programs-toolbar select {
          min-height: 48px;
          padding-inline: 13px;
          border: 1px solid #dce5f0;
          border-radius: 12px;
          outline: 0;
          color: #14253d;
          background: #f8fafd;
          font: inherit;
        }

        .nr-all-programs-result-row {
          margin: 26px 0 14px;
          color: #61738a;
          font-size: 12px;
        }

        .nr-all-programs-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 18px;
        }

        .nr-all-programs-card {
          overflow: hidden;
          border: 1px solid #dce5f0;
          border-radius: 18px;
          background: #fff;
          box-shadow: 0 18px 48px rgba(20, 59, 102, 0.07);
          transition:
            transform 180ms ease,
            box-shadow 180ms ease;
        }

        .nr-all-programs-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 24px 58px rgba(20, 59, 102, 0.11);
        }

        .nr-all-programs-image {
          position: relative;
          height: 210px;
          display: block;
          overflow: hidden;
          background: #e7edf5;
        }

        .nr-all-programs-image img {
          object-fit: cover;
          transition: transform 320ms ease;
        }

        .nr-all-programs-card:hover
          .nr-all-programs-image img {
          transform: scale(1.035);
        }

        .nr-all-programs-placeholder {
          width: 100%;
          height: 100%;
          display: grid;
          place-items: center;
          color: #8ba0b7;
        }

        .nr-all-programs-placeholder svg {
          width: 42px;
          height: 42px;
        }

        .nr-all-programs-featured {
          position: absolute;
          top: 14px;
          inset-inline-start: 14px;
          z-index: 2;
          min-height: 31px;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding-inline: 10px;
          border-radius: 999px;
          color: #17304f;
          background: #ffc313;
          font-size: 10px;
          font-weight: 900;
        }

        .nr-all-programs-card-body {
          padding: 17px;
        }

        .nr-all-programs-country {
          display: inline-flex;
          align-items: center;
          gap: 5px;
          color: #176fe8;
          font-size: 10px;
          font-weight: 900;
        }

        .nr-all-programs-card h2 {
          margin: 8px 0 10px;
          font-size: 20px;
          line-height: 1.35;
        }

        .nr-all-programs-card h2 a {
          color: #14253d;
          text-decoration: none;
        }

        .nr-all-programs-card-body > p {
          min-height: 52px;
          margin: 0;
          overflow: hidden;
          color: #708198;
          font-size: 12px;
          line-height: 1.75;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
        }

        .nr-all-programs-meta {
          display: flex;
          flex-wrap: wrap;
          gap: 7px;
          margin-top: 16px;
        }

        .nr-all-programs-meta span {
          min-height: 31px;
          display: inline-flex;
          align-items: center;
          gap: 5px;
          padding-inline: 8px;
          border-radius: 9px;
          color: #61738a;
          background: #f5f8fd;
          font-size: 9px;
          font-weight: 800;
        }

        .nr-all-programs-meta svg {
          width: 13px;
          color: #176fe8;
        }

        .nr-all-programs-card-footer {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 12px;
          margin-top: 20px;
          padding-top: 16px;
          border-top: 1px solid #edf1f6;
        }

        .nr-all-programs-card-footer > div {
          display: flex;
          flex-direction: column;
          gap: 4px;
        }

        .nr-all-programs-card-footer small {
          color: #8a98aa;
          font-size: 9px;
        }

        .nr-all-programs-card-footer strong {
          color: #176fe8;
          font-size: 19px;
        }

        .nr-all-programs-card-footer strong span {
          color: #728197;
          font-size: 10px;
        }

        .nr-all-programs-details {
          min-height: 40px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding-inline: 13px;
          border-radius: 10px;
          color: #fff;
          background: #176fe8;
          text-decoration: none;
          font-size: 10px;
          font-weight: 900;
        }

        .nr-all-programs-state {
          min-height: 300px;
          display: grid;
          place-items: center;
          align-content: center;
          gap: 10px;
          padding: 30px;
          color: #697c94;
          text-align: center;
        }

        .nr-all-programs-state strong {
          color: #17304f;
          font-size: 20px;
        }

        .nr-all-programs-state p {
          margin: 0;
          font-size: 12px;
        }

        .nr-all-programs-state.is-error strong {
          color: #b42318;
        }

        .nr-all-programs-loader {
          width: 32px;
          height: 32px;
          border: 3px solid #dce5f0;
          border-top-color: #176fe8;
          border-radius: 50%;
          animation: nrAllProgramsSpin 0.8s linear infinite;
        }

        @keyframes nrAllProgramsSpin {
          to {
            transform: rotate(360deg);
          }
        }


        @media (min-width: 1500px) {
          .nr-all-programs-container {
            width: min(1460px, calc(100% - 72px));
          }

          .nr-all-programs-grid {
            grid-template-columns: repeat(4, minmax(0, 1fr));
          }

          .nr-all-programs-image {
            height: 205px;
          }
        }

        @media (min-width: 921px) and (max-width: 1366px) {
          .nr-all-programs-container {
            width: min(1200px, calc(100% - 40px));
          }

          .nr-all-programs-hero h1 {
            font-size: clamp(34px, 4.2vw, 50px);
          }

          .nr-all-programs-grid {
            gap: 16px;
          }
        }

        @media (max-width: 980px) {
          .nr-all-programs-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 700px) {
          .nr-all-programs-hero {
            padding-bottom: 54px;
          }

          .nr-all-programs-back {
            margin-bottom: 34px;
          }

          .nr-all-programs-toolbar {
            grid-template-columns: 1fr;
          }

          .nr-all-programs-grid {
            grid-template-columns: 1fr;
          }

          .nr-all-programs-image {
            height: 225px;
          }
        }

        @media (max-width: 480px) {
          .nr-all-programs-container {
            width: min(100% - 22px, 1180px);
          }

          .nr-all-programs-hero h1 {
            font-size: 38px;
          }

          .nr-all-programs-card-footer {
            align-items: stretch;
            flex-direction: column;
          }

          .nr-all-programs-details {
            width: 100%;
          }
        }
      `}</style>
    </main>
  );
}