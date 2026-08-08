"use client";

import {
  AnimatePresence,
  motion,
} from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import {
  useEffect,
  useMemo,
  useState,
} from "react";

import type { Language } from "../../../data/home";
import { createClient } from "../../../../src/lib/supabase/client";
import {
  getPublicCountries,
  type PublicCountry,
} from "../../../../src/features/countries/services";

import styles from "./NourWorldMap.module.css";

type Props = {
  language: Language;
};

type MapPosition = {
  x: number;
  y: number;
};

const SAUDI_ISO2 = "SA";

/**
 * تحويل الإحداثيات الجغرافية إلى نسبة مئوية
 * مناسبة لخريطة Equirectangular.
 */
function coordinatesToMapPosition(
  latitude: number,
  longitude: number,
): MapPosition {
  const x =
    ((longitude + 180) / 360) * 100;

  const y =
    ((90 - latitude) / 180) * 100;

  return {
    x: Math.min(
      Math.max(x, 1.5),
      98.5,
    ),

    y: Math.min(
      Math.max(y, 2),
      98,
    ),
  };
}

function getProgramsLabel(
  country: PublicCountry,
  isArabic: boolean,
): string {
  const count =
    country.publishedProgramsCount;

  if (isArabic) {
    if (count === 0) {
      return "لا توجد برامج منشورة حاليًا";
    }

    if (count === 1) {
      return "برنامج واحد متاح";
    }

    if (count === 2) {
      return "برنامجان متاحان";
    }

    if (
      count >= 3 &&
      count <= 10
    ) {
      return `${count} برامج متاحة`;
    }

    return `${count} برنامجًا متاحًا`;
  }

  if (count === 0) {
    return "No published programs yet";
  }

  if (count === 1) {
    return "1 program available";
  }

  return `${count} programs available`;
}

export default function NourWorldMap({
  language,
}: Props) {
  const isArabic =
    language === "ar";

  const supabase = useMemo(
    () => createClient(),
    [],
  );

  const [activeId, setActiveId] =
    useState<string | null>(null);

  const [paused, setPaused] =
    useState(false);

  const countriesQuery = useQuery({
    queryKey: [
      "public",
      "map-countries",
    ],

    queryFn: () =>
      getPublicCountries(supabase),

    staleTime: 5 * 60 * 1000,

    refetchOnWindowFocus: false,
  });

  const countries =
    countriesQuery.data ?? [];

  const countriesWithPositions =
    useMemo(
      () =>
        countries.map((country) => ({
          ...country,

          position:
            coordinatesToMapPosition(
              country.latitude,
              country.longitude,
            ),
        })),

      [countries],
    );

  useEffect(() => {
    if (
      !countriesWithPositions.length
    ) {
      setActiveId(null);
      return;
    }

    const currentCountryExists =
      countriesWithPositions.some(
        (country) =>
          country.id === activeId,
      );

    if (currentCountryExists) {
      return;
    }

    const saudiCountry =
      countriesWithPositions.find(
        (country) =>
          country.iso2 ===
          SAUDI_ISO2,
      );

    setActiveId(
      saudiCountry?.id ??
        countriesWithPositions[0].id,
    );
  }, [
    countriesWithPositions,
    activeId,
  ]);

  const activeCountry = useMemo(
    () =>
      countriesWithPositions.find(
        (country) =>
          country.id === activeId,
      ) ??
      countriesWithPositions[0] ??
      null,

    [
      countriesWithPositions,
      activeId,
    ],
  );

  const saudiCountry =
    useMemo(
      () =>
        countriesWithPositions.find(
          (country) =>
            country.iso2 ===
            SAUDI_ISO2,
        ) ?? null,

      [countriesWithPositions],
    );

  const publishedProgramsCount =
    useMemo(
      () =>
        countries.reduce(
          (total, country) =>
            total +
            country.publishedProgramsCount,

          0,
        ),

      [countries],
    );

  const countriesWithProgramsCount =
    useMemo(
      () =>
        countries.filter(
          (country) =>
            country.hasPublishedPrograms,
        ).length,

      [countries],
    );

  useEffect(() => {
    if (
      paused ||
      countriesWithPositions.length <=
        1
    ) {
      return;
    }

    const timer =
      window.setInterval(() => {
        setActiveId((currentId) => {
          const currentIndex =
            countriesWithPositions.findIndex(
              (country) =>
                country.id ===
                currentId,
            );

          const nextIndex =
            currentIndex < 0
              ? 0
              : (currentIndex + 1) %
                countriesWithPositions.length;

          return countriesWithPositions[
            nextIndex
          ].id;
        });
      }, 4200);

    return () => {
      window.clearInterval(timer);
    };
  }, [
    paused,
    countriesWithPositions,
  ]);

  const activeProgramsUrl =
    activeCountry
      ? `/programs?country=${encodeURIComponent(
          activeCountry.id,
        )}`
      : "/programs";

  return (
    <motion.div
      className={styles.panel}
      initial={{
        opacity: 0,
        y: 28,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.16,
      }}
      transition={{
        duration: 0.7,
        ease: [
          0.22,
          1,
          0.36,
          1,
        ],
      }}
      onMouseEnter={() =>
        setPaused(true)
      }
      onMouseLeave={() =>
        setPaused(false)
      }
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className={styles.copy}>
        <span className={styles.eyebrow}>
          {isArabic
            ? "نطاق نور آب العالمي"
            : "NourApp global reach"}
        </span>

        <h3>
          {isArabic
            ? "خدمات تربط المعتمرين بمكة من دول متعددة"
            : "Services connecting pilgrims to Makkah from multiple countries"}
        </h3>

        <p>
          {isArabic
            ? "تعرض الخريطة الدول المفعّلة في منصة نور آب. تضيء الدولة عند توفر برامج عمرة منشورة مرتبطة بها."
            : "The map displays active countries on NourApp. A country glows when published Umrah programs are available for it."}
        </p>

        <div className={styles.metrics}>
          <div>
            <strong>
              {countries.length}
            </strong>

            <span>
              {isArabic
                ? "دولة مفعّلة"
                : "Active countries"}
            </span>
          </div>

          <div>
            <strong>
              {
                countriesWithProgramsCount
              }
            </strong>

            <span>
              {isArabic
                ? "دولة لديها برامج"
                : "Countries with programs"}
            </span>
          </div>

          <div>
            <strong>
              {publishedProgramsCount}
            </strong>

            <span>
              {isArabic
                ? "برنامج منشور"
                : "Published programs"}
            </span>
          </div>
        </div>

        <a
          className={styles.cta}
          href={activeProgramsUrl}
        >
          <span>
            {activeCountry
              ? isArabic
                ? `استكشف برامج ${activeCountry.nameAr}`
                : `Explore ${activeCountry.nameEn} programs`
              : isArabic
                ? "استكشف برامج نور آب"
                : "Explore NourApp programs"}
          </span>

          <ArrowIcon
            isArabic={isArabic}
          />
        </a>
      </div>

      <div className={styles.mapArea}>
        <div className={styles.mapHeader}>
          <div>
            <small>
              {isArabic
                ? "شبكة الخدمات"
                : "Service network"}
            </small>

            <strong>
              {isArabic
                ? "اختر دولة على الخريطة"
                : "Choose a country on the map"}
            </strong>
          </div>

          <span className={styles.live}>
            <i />

            {countriesQuery.isFetching
              ? isArabic
                ? "جارٍ التحديث"
                : "Updating"
              : isArabic
                ? "متصلة بالمنصة"
                : "Connected"}
          </span>
        </div>

        <div className={styles.map}>
          {/*
            ضع الخريطة الواقعية داخل:
            public/images/site/world-map-realistic.svg
          */}
          <img
            className={styles.realisticMap}
                src="/images/site/world-map-equirectangular.jpg"

            alt=""
            aria-hidden="true"
          />

          <svg
            className={styles.decorGrid}
            viewBox="0 0 1000 520"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            <g>
              <path d="M0 130H1000" />
              <path d="M0 260H1000" />
              <path d="M0 390H1000" />
              <path d="M250 0V520" />
              <path d="M500 0V520" />
              <path d="M750 0V520" />
            </g>
          </svg>

          {saudiCountry ? (
            <svg
              className={styles.routes}
              viewBox="0 0 100 100"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              {countriesWithPositions
                .filter(
                  (country) =>
                    country.id !==
                      saudiCountry.id &&
                    country.hasPublishedPrograms,
                )
                .map((country) => (
                  <motion.path
                    key={country.id}
                    d={`M${country.position.x} ${country.position.y} C${
                      (country.position.x +
                        saudiCountry.position
                          .x) /
                      2
                    } ${
                      country.position.y -
                      8
                    }, ${
                      (country.position.x +
                        saudiCountry.position
                          .x) /
                      2
                    } ${
                      saudiCountry.position
                        .y -
                      5
                    }, ${
                      saudiCountry.position.x
                    } ${
                      saudiCountry.position.y
                    }`}
                    initial={{
                      pathLength: 0,
                      opacity: 0,
                    }}
                    whileInView={{
                      pathLength: 1,
                      opacity: 1,
                    }}
                    viewport={{
                      once: true,
                    }}
                    transition={{
                      duration: 1.15,
                      delay: 0.2,
                    }}
                  />
                ))}
            </svg>
          ) : null}

          {countriesQuery.isLoading ? (
            <div
              className={
                styles.mapState
              }
            >
              {isArabic
                ? "جارٍ تحميل الدول..."
                : "Loading countries..."}
            </div>
          ) : null}

          {countriesQuery.isError ? (
            <div
              className={
                styles.mapState
              }
              role="alert"
            >
              {isArabic
                ? "تعذر تحميل دول الخريطة."
                : "Unable to load map countries."}
            </div>
          ) : null}

          {!countriesQuery.isLoading &&
          !countriesQuery.isError &&
          countriesWithPositions.length ===
            0 ? (
            <div
              className={
                styles.mapState
              }
            >
              {isArabic
                ? "أضف إحداثيات إلى دولة مفعّلة لتظهر على الخريطة."
                : "Add coordinates to an active country to display it on the map."}
            </div>
          ) : null}

          {countriesWithPositions.map(
            (country) => {
              const isActive =
                country.id === activeId;

              const isSaudi =
                country.iso2 ===
                SAUDI_ISO2;

              return (
                <button
                  key={country.id}
                  type="button"
                  className={[
                    styles.point,

                    country.hasPublishedPrograms
                      ? styles.availablePoint
                      : styles.inactivePoint,

                    isSaudi
                      ? styles.goldPoint
                      : "",

                    isActive
                      ? styles.activePoint
                      : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  style={{
                    left: `${country.position.x}%`,
                    top: `${country.position.y}%`,
                  }}
                  onClick={() =>
                    setActiveId(
                      country.id,
                    )
                  }
                  onFocus={() => {
                    setPaused(true);

                    setActiveId(
                      country.id,
                    );
                  }}
                  onBlur={() =>
                    setPaused(false)
                  }
                  aria-label={
                    isArabic
                      ? `عرض برامج ${country.nameAr}`
                      : `Show programs for ${country.nameEn}`
                  }
                  aria-pressed={
                    isActive
                  }
                  title={
                    isArabic
                      ? country.nameAr
                      : country.nameEn
                  }
                >
                  <span />

                  <small>
                    {isArabic
                      ? country.nameAr
                      : country.nameEn}
                  </small>
                </button>
              );
            },
          )}

          <AnimatePresence mode="wait">
            {activeCountry ? (
              <motion.article
                key={activeCountry.id}
                className={styles.card}
                initial={{
                  opacity: 0,
                  y: 12,
                  scale: 0.96,
                }}
                animate={{
                  opacity: 1,
                  y: 0,
                  scale: 1,
                }}
                exit={{
                  opacity: 0,
                  y: -8,
                  scale: 0.97,
                }}
                transition={{
                  duration: 0.28,
                }}
                style={{
                  left: `${Math.min(
                    Math.max(
                      activeCountry
                        .position.x,
                      24,
                    ),
                    76,
                  )}%`,

                  top: `${
                    activeCountry.position
                      .y < 45
                      ? activeCountry
                          .position.y + 12
                      : activeCountry
                          .position.y - 12
                  }%`,
                }}
              >
                <div
                  className={
                    styles.cardTop
                  }
                >
                  <span
                    className={
                      styles.pin
                    }
                  >
                    {activeCountry.iso2 ===
                    SAUDI_ISO2 ? (
                      <KaabaIcon />
                    ) : (
                      <LocationIcon />
                    )}
                  </span>

                  <div>
                    <small>
                      {isArabic
                        ? activeCountry.nameAr
                        : activeCountry.nameEn}
                    </small>

                    <strong>
                      {getProgramsLabel(
                        activeCountry,
                        isArabic,
                      )}
                    </strong>
                  </div>
                </div>

                <p>
                  {activeCountry.hasPublishedPrograms
                    ? isArabic
                      ? "اضغط على زر استكشاف البرامج لعرض برامج العمرة المنشورة والمتاحة لهذه الدولة."
                      : "Select Explore Programs to view the published Umrah programs available for this country."
                    : isArabic
                      ? "الدولة مفعّلة على المنصة، ولم تُنشر برامج مرتبطة بها حتى الآن."
                      : "This country is active on the platform, but no linked programs have been published yet."}
                </p>
              </motion.article>
            ) : null}
          </AnimatePresence>
        </div>

        {countriesWithPositions.length >
        0 ? (
          <div
            className={
              styles.locationTabs
            }
          >
            {countriesWithPositions.map(
              (country) => (
                <button
                  key={country.id}
                  type="button"
                  className={
                    country.id ===
                    activeId
                      ? styles.activeTab
                      : ""
                  }
                  onClick={() =>
                    setActiveId(
                      country.id,
                    )
                  }
                >
                  {isArabic
                    ? country.nameAr
                    : country.nameEn}

                  {country.hasPublishedPrograms ? (
                    <span>
                      {
                        country.publishedProgramsCount
                      }
                    </span>
                  ) : null}
                </button>
              ),
            )}
          </div>
        ) : null}
      </div>
    </motion.div>
  );
}

function ArrowIcon({
  isArabic,
}: {
  isArabic: boolean;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      aria-hidden="true"
    >
      {isArabic ? (
        <path
          d="M19 12H5m6 6-6-6 6-6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ) : (
        <path
          d="M5 12h14m-6-6 6 6-6 6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      aria-hidden="true"
    >
      <path d="M12 21s7-4.3 7-11a7 7 0 1 0-14 0c0 6.7 7 11 7 11Z" />
      <circle
        cx="12"
        cy="10"
        r="2.5"
      />
    </svg>
  );
}

function KaabaIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <path d="M6 5h12v15H6z" />
      <path d="M6 9h12M9 5v4M15 5v4M10 14h4v6" />
    </svg>
  );
}