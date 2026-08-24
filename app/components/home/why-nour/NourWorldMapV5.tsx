"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

import type { Language } from "../../../data/home";
import { getPublicCountries, type PublicCountry } from "../../../../src/features/countries/services";
import { trackMapEvent } from "../../../../src/lib/analytics/map-events";
import { createClient } from "../../../../src/lib/supabase/client";
import styles from "./NourWorldMap.module.css";

type Props = { language: Language };
type MapPosition = { x: number; y: number };
type MapProgramRow = {
  id: string;
  title_ar: string;
  title_en: string;
  slug: string;
  duration_days: number;
  duration_nights: number;
  base_price: number | string;
  currency_code: string;
  is_featured: boolean;
  cover_media: { bucket: string; path: string } | { bucket: string; path: string }[] | null;
};
type MapProgram = {
  id: string;
  titleAr: string;
  titleEn: string;
  slug: string;
  durationDays: number;
  durationNights: number;
  basePrice: number;
  currencyCode: string;
  isFeatured: boolean;
  coverUrl: string | null;
};

type PositionedCountry = PublicCountry & { position: MapPosition };

const SAUDI_ISO2 = "SA";
const MAKKAH_COORDINATES = { latitude: 21.4225, longitude: 39.8262 };
const STORY_DELAY_MS = 6000;

function coordinatesToMapPosition(latitude: number, longitude: number): MapPosition {
  const x = ((longitude + 180) / 360) * 100;
  const y = ((90 - latitude) / 180) * 100;
  return {
    x: Math.min(Math.max(x, 1.5), 98.5),
    y: Math.min(Math.max(y, 2), 98),
  };
}

function buildRoutePath(from: MapPosition, to: MapPosition) {
  const midX = (from.x + to.x) / 2;
  const lift = Math.max(6, Math.min(15, Math.abs(from.x - to.x) * 0.08));
  return `M${from.x} ${from.y} C${midX} ${from.y - lift}, ${midX} ${to.y - lift * 0.72}, ${to.x} ${to.y}`;
}

function getProgramsLabel(country: PublicCountry, isArabic: boolean) {
  const count = country.publishedProgramsCount;
  if (isArabic) {
    if (count === 0) return "لا توجد برامج منشورة حاليًا";
    if (count === 1) return "برنامج واحد متاح";
    if (count === 2) return "برنامجان متاحان";
    if (count >= 3 && count <= 10) return `${count} برامج متاحة`;
    return `${count} برنامجًا متاحًا`;
  }
  if (count === 0) return "No published programs yet";
  if (count === 1) return "1 program available";
  return `${count} programs available`;
}

function getCoverMedia(media: MapProgramRow["cover_media"]) {
  if (!media) return null;
  return Array.isArray(media) ? media[0] ?? null : media;
}

function formatPrice(value: number, language: Language) {
  return new Intl.NumberFormat(language === "ar" ? "ar-SA" : "en-US", {
    maximumFractionDigits: 0,
  }).format(value);
}

function formatDuration(days: number, nights: number, isArabic: boolean) {
  return isArabic ? `${days} أيام · ${nights} ليالٍ` : `${days} days · ${nights} nights`;
}

async function loadCountryPrograms(
  supabase: ReturnType<typeof createClient>,
  countryId: string,
): Promise<MapProgram[]> {
  const { data, error } = await supabase
    .from("programs")
    .select(`
      id,
      title_ar,
      title_en,
      slug,
      duration_days,
      duration_nights,
      base_price,
      currency_code,
      is_featured,
      cover_media:media!programs_cover_media_id_fkey (bucket,path)
    `)
    .eq("country_id", countryId)
    .eq("status", "published")
    .eq("is_active", true)
    .is("deleted_at", null)
    .order("is_featured", { ascending: false })
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: false })
    .limit(3);

  if (error) throw new Error(`Failed to load map programs: ${error.message}`);

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
  return ((data ?? []) as MapProgramRow[]).map((program) => {
    const cover = getCoverMedia(program.cover_media);
    return {
      id: program.id,
      titleAr: program.title_ar,
      titleEn: program.title_en,
      slug: program.slug,
      durationDays: program.duration_days,
      durationNights: program.duration_nights,
      basePrice: Number(program.base_price) || 0,
      currencyCode: program.currency_code,
      isFeatured: program.is_featured,
      coverUrl: cover && supabaseUrl
        ? `${supabaseUrl}/storage/v1/object/public/${cover.bucket}/${cover.path}`
        : null,
    };
  });
}

export default function NourWorldMapV5({ language }: Props) {
  const isArabic = language === "ar";
  const shouldReduceMotion = useReducedMotion();
  const supabase = useMemo(() => createClient(), []);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedProgramId, setSelectedProgramId] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);

  const countriesQuery = useQuery({
    queryKey: ["public", "map-countries"],
    queryFn: () => getPublicCountries(supabase),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const countries = countriesQuery.data ?? [];
  const positionedCountries = useMemo<PositionedCountry[]>(
    () => countries.map((country) => ({
      ...country,
      position: coordinatesToMapPosition(country.latitude, country.longitude),
    })),
    [countries],
  );

  const makkahPosition = useMemo(
    () => coordinatesToMapPosition(MAKKAH_COORDINATES.latitude, MAKKAH_COORDINATES.longitude),
    [],
  );

  const storyCountries = useMemo(
    () => positionedCountries.filter(
      (country) => country.iso2 !== SAUDI_ISO2 && country.hasPublishedPrograms,
    ),
    [positionedCountries],
  );

  useEffect(() => {
    if (!positionedCountries.length) {
      setActiveId(null);
      return;
    }
    if (positionedCountries.some((country) => country.id === activeId)) return;
    setActiveId(storyCountries[0]?.id ?? positionedCountries.find((country) => country.iso2 !== SAUDI_ISO2)?.id ?? null);
  }, [positionedCountries, storyCountries, activeId]);

  const activeCountry = useMemo(
    () => positionedCountries.find((country) => country.id === activeId) ?? null,
    [positionedCountries, activeId],
  );

  const selectedCountry = useMemo(
    () => positionedCountries.find((country) => country.id === selectedId) ?? null,
    [positionedCountries, selectedId],
  );

  const focusCountry = selectedCountry ?? activeCountry;

  useEffect(() => {
    if (paused || selectedId || shouldReduceMotion || storyCountries.length <= 1) return;

    const timer = window.setTimeout(() => {
      const currentIndex = storyCountries.findIndex((country) => country.id === activeId);
      const next = storyCountries[currentIndex < 0 ? 0 : (currentIndex + 1) % storyCountries.length];
      setActiveId(next.id);
      trackMapEvent("map_story_advanced", {
        countryId: next.id,
        countryIso2: next.iso2,
        source: "story",
        hasPrograms: true,
      });
    }, STORY_DELAY_MS);

    return () => window.clearTimeout(timer);
  }, [activeId, paused, selectedId, shouldReduceMotion, storyCountries]);

  useEffect(() => {
    setSelectedProgramId(null);
  }, [selectedId]);

  const programsQuery = useQuery({
    queryKey: ["public", "map-country-programs", selectedCountry?.id],
    queryFn: () => loadCountryPrograms(supabase, selectedCountry!.id),
    enabled: Boolean(selectedCountry?.hasPublishedPrograms),
    staleTime: 2 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const selectedProgram = useMemo(
    () => programsQuery.data?.find((program) => program.id === selectedProgramId) ?? null,
    [programsQuery.data, selectedProgramId],
  );

  const publishedProgramsCount = useMemo(
    () => countries.reduce((total, country) => total + country.publishedProgramsCount, 0),
    [countries],
  );
  const countriesWithProgramsCount = useMemo(
    () => countries.filter((country) => country.hasPublishedPrograms).length,
    [countries],
  );

  const selectCountry = (country: PositionedCountry, source: "map" | "chip") => {
    const togglingOff = selectedId === country.id;
    setActiveId(country.id);
    setSelectedId(togglingOff ? null : country.id);
    setSelectedProgramId(null);

    if (!togglingOff) {
      trackMapEvent("map_country_selected", {
        countryId: country.id,
        countryIso2: country.iso2,
        source,
        hasPrograms: country.hasPublishedPrograms,
      });
      if (!country.hasPublishedPrograms) {
        trackMapEvent("map_country_without_programs", {
          countryId: country.id,
          countryIso2: country.iso2,
          source,
          hasPrograms: false,
        });
      }
    }
  };

  const selectProgram = (program: MapProgram) => {
    const togglingOff = selectedProgramId === program.id;
    setSelectedProgramId(togglingOff ? null : program.id);
    if (!togglingOff && selectedCountry) {
      trackMapEvent("map_program_clicked", {
        countryId: selectedCountry.id,
        countryIso2: selectedCountry.iso2,
        programId: program.id,
        programSlug: program.slug,
        source: "program_card",
        hasPrograms: true,
      });
    }
  };

  const highlightedId = selectedId ?? activeId;
  const routeCountries = storyCountries;
  const programFocusActive = Boolean(selectedProgram);
  const focusedPosition = selectedCountry?.position;
  const activeProgramsUrl = focusCountry
    ? `/programs?country=${encodeURIComponent(focusCountry.id)}`
    : "/programs";

  return (
    <motion.section
      className={styles.panel}
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setPaused(false);
      }}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <header className={styles.sectionIntro}>
        <span className={styles.eyebrow}>{isArabic ? "من العالم إلى مكة" : "From the world to Makkah"}</span>
        <h3>{isArabic ? "اكتشف من أين تبدأ رحلتك إلى مكة" : "Discover where your journey to Makkah begins"}</h3>
        <p>{isArabic
          ? "اختر دولتك وشاهد البرامج المتاحة والمسار الذي يربط رحلتك بمكة المكرمة."
          : "Choose your country, view available programs, and see the route connecting your journey to Makkah."}</p>
      </header>

      <div className={styles.mapExperience}>
        <div className={styles.mapHeader}>
          <div>
            <small>{isArabic ? "شبكة نور للرحلات" : "Nour journey network"}</small>
            <strong>{isArabic ? "رحلات تنطلق من دول متعددة إلى مكة" : "Journeys connecting multiple countries to Makkah"}</strong>
          </div>
          <span className={styles.live}><i />{countriesQuery.isFetching
            ? isArabic ? "جارٍ التحديث" : "Updating"
            : isArabic ? "متصلة بالمنصة" : "Connected"}</span>
        </div>

        <div className={styles.map}>
          <div
            className={styles.mapStage}
            style={{
              transform: selectedCountry && !shouldReduceMotion ? "scale(1.075)" : "scale(1)",
              transformOrigin: focusedPosition ? `${focusedPosition.x}% ${focusedPosition.y}%` : "50% 50%",
              transition: shouldReduceMotion ? "none" : "transform 760ms cubic-bezier(.22,1,.36,1)",
            }}
          >
            <img className={styles.realisticMap} src="/images/site/world-map-white.svg" alt="" aria-hidden="true" />
            <svg className={styles.routes} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="nourRouteGradientV5" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#176fe8" stopOpacity="0.28" />
                  <stop offset="62%" stopColor="#2aa9e9" stopOpacity="0.72" />
                  <stop offset="100%" stopColor="#ffc313" stopOpacity="1" />
                </linearGradient>
                <filter id="nourRouteGlowV5" x="-50%" y="-50%" width="200%" height="200%">
                  <feGaussianBlur stdDeviation="0.75" result="blur" />
                  <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
                </filter>
              </defs>
              {routeCountries.map((country, index) => {
                const routePath = buildRoutePath(country.position, makkahPosition);
                const isHighlighted = country.id === highlightedId;
                return (
                  <g key={country.id}>
                    <motion.path
                      d={routePath}
                      className={isHighlighted ? styles.routeBaseActive : styles.routeBase}
                      initial={{ pathLength: 0, opacity: 0 }}
                      whileInView={{ pathLength: 1, opacity: 1 }}
                      viewport={{ once: true }}
                      style={isHighlighted && programFocusActive
                        ? { filter: "drop-shadow(0 0 2px rgba(255,195,19,.95))" }
                        : undefined}
                      transition={{ duration: 1.25, delay: 0.16 + index * 0.08, ease: [0.22, 1, 0.36, 1] }}
                    />
                    <motion.path
                      d={routePath}
                      className={isHighlighted ? styles.routeTravelerActive : styles.routeTraveler}
                      strokeDasharray="0.6 3.6"
                      animate={{
                        strokeDashoffset: shouldReduceMotion ? 0 : [0, -16],
                        opacity: isHighlighted ? 1 : 0.2,
                      }}
                      transition={shouldReduceMotion ? { duration: 0 } : {
                        strokeDashoffset: {
                          duration: isHighlighted ? 3.6 : 4.5 + index * 0.18,
                          repeat: Infinity,
                          ease: "linear",
                        },
                      }}
                    />
                    {isHighlighted && !shouldReduceMotion ? (
                      <circle r={programFocusActive ? "1.15" : "0.95"} fill="#ffc313" filter="url(#nourRouteGlowV5)">
                        <animateMotion dur={programFocusActive ? "3.5s" : "4.2s"} repeatCount="indefinite" path={routePath} />
                        <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.14;0.84;1" dur={programFocusActive ? "3.5s" : "4.2s"} repeatCount="indefinite" />
                      </circle>
                    ) : null}
                  </g>
                );
              })}
            </svg>

            <motion.div
              className={styles.makkahMarker}
              style={{ left: `${makkahPosition.x}%`, top: `${makkahPosition.y}%` }}
              animate={{ scale: programFocusActive ? 1.08 : 1 }}
              transition={{ duration: 0.35 }}
            >
              <span className={styles.makkahPulse} />
              <span className={styles.makkahCore}><KaabaIcon /></span>
              <strong>{isArabic ? "مكة" : "Makkah"}</strong>
            </motion.div>

            {positionedCountries.map((country) => {
              if (country.iso2 === SAUDI_ISO2) return null;
              const isActive = country.id === activeId;
              const isSelected = country.id === selectedId;
              return (
                <button
                  key={country.id}
                  type="button"
                  className={[
                    styles.point,
                    country.hasPublishedPrograms ? styles.availablePoint : styles.inactivePoint,
                    isActive ? styles.activePoint : "",
                    isSelected ? "nr-map-selected-point" : "",
                    "nr-map-touch-point",
                  ].filter(Boolean).join(" ")}
                  style={{ left: `${country.position.x}%`, top: `${country.position.y}%` }}
                  onMouseEnter={() => {
                    if (!selectedId) setActiveId(country.id);
                    setPaused(true);
                  }}
                  onMouseLeave={() => setPaused(false)}
                  onClick={() => selectCountry(country, "map")}
                  aria-label={isArabic ? `عرض ${country.nameAr}` : `Show ${country.nameEn}`}
                  aria-pressed={isSelected}
                >
                  <span />
                  <small>{isArabic ? country.nameAr : country.nameEn}</small>
                </button>
              );
            })}

            {countriesQuery.isLoading ? <div className={styles.mapState}>{isArabic ? "جارٍ تحميل الدول..." : "Loading countries..."}</div> : null}
            {countriesQuery.isError ? <div className={styles.mapState} role="alert">{isArabic ? "تعذر تحميل دول الخريطة." : "Unable to load map countries."}</div> : null}
          </div>

          <AnimatePresence mode="wait">
            {focusCountry ? (
              <motion.div
                key={`${focusCountry.id}-${selectedProgram?.id ?? "country"}`}
                className="nr-map-focus-journey"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
                transition={{ duration: 0.32 }}
              >
                <div className="nr-map-focus-topline">
                  <span>{isArabic ? "مسار رحلتك" : "Your journey"}</span>
                  {focusCountry.flagUrl ? <img src={focusCountry.flagUrl} alt="" aria-hidden="true" /> : null}
                </div>
                <div className="nr-map-focus-route">
                  <strong>{isArabic ? focusCountry.nameAr : focusCountry.nameEn}</strong>
                  <span className="nr-map-focus-line"><span className="nr-map-focus-dot" /></span>
                  <strong>{isArabic ? "مكة" : "Makkah"}</strong>
                </div>

                {selectedProgram ? (
                  <div className="nr-map-focus-program">
                    <span>{isArabic ? "البرنامج المختار" : "Selected program"}</span>
                    <strong>{isArabic ? selectedProgram.titleAr : selectedProgram.titleEn}</strong>
                    <div>
                      <small>{formatDuration(selectedProgram.durationDays, selectedProgram.durationNights, isArabic)}</small>
                      <b>{formatPrice(selectedProgram.basePrice, language)} {selectedProgram.currencyCode}</b>
                    </div>
                    <a href={`/programs/${encodeURIComponent(selectedProgram.slug)}`}>{isArabic ? "عرض تفاصيل البرنامج" : "View program details"}<ArrowIcon isArabic={isArabic} /></a>
                  </div>
                ) : focusCountry.hasPublishedPrograms ? (
                  <div className="nr-map-focus-summary">
                    <small>{getProgramsLabel(focusCountry, isArabic)}</small>
                    <a
                      href={`/programs?country=${encodeURIComponent(focusCountry.id)}`}
                      onClick={() => trackMapEvent("map_view_all_clicked", {
                        countryId: focusCountry.id,
                        countryIso2: focusCountry.iso2,
                        source: "journey_card",
                        hasPrograms: true,
                      })}
                    >{isArabic ? "استعرض الرحلات" : "Explore journeys"}<ArrowIcon isArabic={isArabic} /></a>
                  </div>
                ) : (
                  <div className="nr-map-no-programs">
                    <strong>{isArabic ? "لا توجد برامج متاحة حاليًا من هذه الدولة" : "No programs are available from this country yet"}</strong>
                    <p>{isArabic ? "نعمل على إضافة وجهات وبرامج جديدة باستمرار. يمكنك استعراض البرامج المتاحة حاليًا." : "We are continuously adding new origins and programs. You can explore the currently available journeys."}</p>
                    <a href="/programs">{isArabic ? "استعرض جميع البرامج" : "Explore all programs"}<ArrowIcon isArabic={isArabic} /></a>
                  </div>
                )}
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <motion.aside className={styles.floatingPanel} initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <span className={styles.panelKicker}>{selectedCountry ? isArabic ? "الدولة المختارة" : "Selected country" : isArabic ? "استكشف نقاط الانطلاق" : "Explore starting points"}</span>
          <h4>{focusCountry ? isArabic ? focusCountry.nameAr : focusCountry.nameEn : isArabic ? "اختر دولتك" : "Choose your country"}</h4>
          <p>{focusCountry ? getProgramsLabel(focusCountry, isArabic) : isArabic ? "اختر نقطة على الخريطة." : "Choose a point on the map."}</p>
          <div className={styles.metrics}>
            <div><strong>{countries.length}</strong><span>{isArabic ? "دولة مفعّلة" : "Active countries"}</span></div>
            <div><strong>{countriesWithProgramsCount}</strong><span>{isArabic ? "دول لديها برامج" : "With programs"}</span></div>
            <div><strong>{publishedProgramsCount}</strong><span>{isArabic ? "برنامج منشور" : "Programs"}</span></div>
          </div>
          {focusCountry?.hasPublishedPrograms ? (
            <a
              className={styles.cta}
              href={activeProgramsUrl}
              onClick={() => trackMapEvent("map_view_all_clicked", {
                countryId: focusCountry.id,
                countryIso2: focusCountry.iso2,
                source: "journey_card",
                hasPrograms: true,
              })}
            ><span>{isArabic ? `استعرض برامج ${focusCountry.nameAr}` : `Explore ${focusCountry.nameEn} programs`}</span><ArrowIcon isArabic={isArabic} /></a>
          ) : (
            <a className={`${styles.cta} nr-map-all-programs-cta`} href="/programs"><span>{isArabic ? "استعرض البرامج المتاحة" : "Explore available programs"}</span><ArrowIcon isArabic={isArabic} /></a>
          )}
        </motion.aside>

        <AnimatePresence mode="wait">
          {selectedCountry?.hasPublishedPrograms ? (
            <motion.section key={selectedCountry.id} className="nr-map-programs" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>
              <div className="nr-map-programs-head">
                <div><span>{isArabic ? "اختر برنامجًا لتخصيص المسار" : "Select a program to focus the journey"}</span><strong>{isArabic ? `برامج ${selectedCountry.nameAr}` : `${selectedCountry.nameEn} programs`}</strong></div>
                <a
                  href={activeProgramsUrl}
                  onClick={() => trackMapEvent("map_view_all_clicked", {
                    countryId: selectedCountry.id,
                    countryIso2: selectedCountry.iso2,
                    source: "journey_card",
                    hasPrograms: true,
                  })}
                >{isArabic ? "عرض الكل" : "View all"}<ArrowIcon isArabic={isArabic} /></a>
              </div>
              {programsQuery.isLoading ? <div className="nr-map-programs-state">{isArabic ? "جارٍ تحميل البرامج..." : "Loading programs..."}</div> : null}
              {programsQuery.isError ? <div className="nr-map-programs-state" role="alert">{isArabic ? "تعذر تحميل البرامج حاليًا." : "Unable to load programs right now."}</div> : null}
              {(programsQuery.data?.length ?? 0) > 0 ? (
                <div className="nr-map-programs-grid">
                  {programsQuery.data!.map((program) => {
                    const selected = selectedProgramId === program.id;
                    const title = isArabic ? program.titleAr : program.titleEn;
                    return (
                      <button key={program.id} type="button" className={`nr-map-program-card ${selected ? "nr-map-program-card-selected" : ""}`} onClick={() => selectProgram(program)} aria-pressed={selected}>
                        <div className="nr-map-program-media">
                          {program.coverUrl ? <img src={program.coverUrl} alt="" aria-hidden="true" /> : <div className="nr-map-program-placeholder"><KaabaIcon /></div>}
                          {program.isFeatured ? <span>{isArabic ? "مميز" : "Featured"}</span> : null}
                          {selected ? <em>{isArabic ? "مختار" : "Selected"}</em> : null}
                        </div>
                        <div className="nr-map-program-body"><strong>{title}</strong><small>{formatDuration(program.durationDays, program.durationNights, isArabic)}</small><div><span>{isArabic ? "ابتداءً من" : "From"}</span><b>{formatPrice(program.basePrice, language)} {program.currencyCode}</b></div></div>
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </motion.section>
          ) : selectedCountry ? (
            <motion.section key={`${selectedCountry.id}-empty`} className="nr-map-empty-country" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}>
              <span>{isArabic ? "هذه نقطة انطلاق جديدة" : "This is a new starting point"}</span>
              <strong>{isArabic ? `لا توجد برامج منشورة من ${selectedCountry.nameAr} حتى الآن` : `No published programs from ${selectedCountry.nameEn} yet`}</strong>
              <p>{isArabic ? "يمكنك اختيار دولة أخرى أو استعراض جميع البرامج المتاحة حاليًا." : "Choose another country or browse all currently available programs."}</p>
              <a href="/programs">{isArabic ? "استعرض جميع البرامج" : "Explore all programs"}<ArrowIcon isArabic={isArabic} /></a>
            </motion.section>
          ) : null}
        </AnimatePresence>

        <div className={styles.locationTabs}>
          {positionedCountries.filter((country) => country.iso2 !== SAUDI_ISO2).map((country) => {
            const selected = country.id === selectedId;
            const highlighted = country.id === highlightedId;
            return (
              <button key={country.id} type="button" className={[highlighted ? styles.activeTab : "", selected ? "nr-map-selected-tab" : "", !country.hasPublishedPrograms ? "nr-map-empty-tab" : ""].filter(Boolean).join(" ")} onClick={() => selectCountry(country, "chip")} aria-pressed={selected}>
                {isArabic ? country.nameAr : country.nameEn}{country.hasPublishedPrograms ? <span>{country.publishedProgramsCount}</span> : <small>{isArabic ? "قريبًا" : "Soon"}</small>}
              </button>
            );
          })}
        </div>

        <p className={styles.mapHint}>{selectedProgram
          ? isArabic ? "تم تخصيص المسار حسب البرنامج المختار." : "The route is focused on your selected program."
          : selectedCountry?.hasPublishedPrograms
            ? isArabic ? "اختر برنامجًا لعرض تفاصيله داخل مسار الرحلة." : "Select a program to show its details in the journey."
            : selectedCountry
              ? isArabic ? "لا توجد برامج من هذه الدولة حاليًا؛ اختر دولة أخرى أو استعرض جميع البرامج." : "There are no programs from this country yet; choose another country or browse all programs."
              : isArabic ? "يستعرض الوضع التلقائي الدول التي لديها برامج. اختر أي دولة لتثبيت اختيارك." : "Story mode cycles through countries with programs. Choose any country to pin it."}</p>
      </div>

      <style jsx global>{`
        .nr-map-focus-line::after, .nr-map-focus-line > i { display: none !important; content: none !important; }
        .nr-map-touch-point::after { content:""; position:absolute; width:44px; height:44px; top:50%; left:50%; transform:translate(-50%,-50%); border-radius:50%; }
        .nr-map-selected-point { z-index:13 !important; transform:translate(-50%,-50%) scale(1.36) !important; background:#ffc313 !important; box-shadow:0 0 0 10px rgba(255,195,19,.18),0 0 38px rgba(255,195,19,.78) !important; }
        .nr-map-selected-point > small { opacity:1 !important; color:#ffc313 !important; }
        .nr-map-selected-tab { box-shadow:inset 0 0 0 1px rgba(255,195,19,.55) !important; }
        .nr-map-empty-tab { opacity:.68; }
        .nr-map-empty-tab small { margin-inline-start:6px; color:rgba(255,255,255,.5); font-size:7px; }
        .nr-map-focus-journey { position:absolute; z-index:27; inset-inline-end:18px; bottom:18px; width:min(370px,47%); padding:13px 14px; border:1px solid rgba(255,255,255,.15); border-radius:17px; color:#fff; background:rgba(4,20,39,.94); box-shadow:0 18px 44px rgba(0,0,0,.28); backdrop-filter:blur(14px); }
        .nr-map-focus-topline { display:flex; align-items:center; justify-content:space-between; gap:10px; margin-bottom:8px; color:#8fc8ff; font-size:9px; font-weight:900; }
        .nr-map-focus-topline img { width:23px; height:16px; object-fit:cover; border-radius:4px; }
        .nr-map-focus-route { display:grid; grid-template-columns:max-content minmax(54px,1fr) max-content; align-items:center; gap:9px; }
        .nr-map-focus-route strong { font-size:11px; }
        .nr-map-focus-line { position:relative; min-width:54px; height:3px; border-radius:999px; background:linear-gradient(90deg,#176fe8,#2aa9e9,#ffc313); }
        .nr-map-focus-dot { position:absolute; top:50%; left:0; width:10px; height:10px; transform:translateY(-50%); border:2px solid rgba(255,255,255,.94); border-radius:50%; background:#ffc313; box-shadow:0 0 0 4px rgba(255,195,19,.2),0 0 20px rgba(255,195,19,.98); animation:nrMapDotLtrV5 4.2s linear infinite; }
        [dir="rtl"] .nr-map-focus-dot { left:auto; right:0; animation-name:nrMapDotRtlV5; }
        .nr-map-focus-summary { display:flex; align-items:center; justify-content:space-between; gap:10px; margin-top:9px; }
        .nr-map-focus-summary small { color:rgba(255,255,255,.64); font-size:8px; }
        .nr-map-focus-summary a,.nr-map-focus-program a,.nr-map-no-programs a,.nr-map-empty-country a { display:inline-flex; align-items:center; gap:5px; color:#ffc313; font-size:9px; font-weight:900; text-decoration:none; }
        .nr-map-focus-summary svg,.nr-map-focus-program svg,.nr-map-no-programs svg,.nr-map-empty-country svg { width:12px; height:12px; }
        .nr-map-focus-program,.nr-map-no-programs { display:grid; gap:6px; margin-top:10px; padding-top:9px; border-top:1px solid rgba(255,255,255,.1); }
        .nr-map-focus-program > span { color:#8fc8ff; font-size:8px; font-weight:800; }
        .nr-map-focus-program > strong { font-size:11px; }
        .nr-map-focus-program > div { display:flex; justify-content:space-between; gap:10px; }
        .nr-map-focus-program small,.nr-map-no-programs p { color:rgba(255,255,255,.62); font-size:8px; margin:0; }
        .nr-map-focus-program b { color:#ffc313; font-size:10px; }
        .nr-map-no-programs > strong { font-size:10px; }
        .nr-map-programs,.nr-map-empty-country { display:grid; gap:12px; padding:14px 16px 16px; border:1px solid rgba(255,255,255,.11); border-radius:20px; color:#fff; background:rgba(5,25,47,.72); box-shadow:0 16px 42px rgba(0,0,0,.14); backdrop-filter:blur(14px); }
        .nr-map-empty-country { border-color:rgba(255,195,19,.18); }
        .nr-map-empty-country > span { color:#91c6ff; font-size:9px; font-weight:800; }
        .nr-map-empty-country > strong { font-size:16px; }
        .nr-map-empty-country > p { margin:0; color:rgba(255,255,255,.62); font-size:10px; }
        .nr-map-programs-head { display:flex; align-items:center; justify-content:space-between; gap:14px; }
        .nr-map-programs-head div { display:grid; gap:3px; }
        .nr-map-programs-head span { color:#91c6ff; font-size:9px; font-weight:800; }
        .nr-map-programs-head strong { color:#fff; font-size:17px; }
        .nr-map-programs-head > a { display:inline-flex; align-items:center; gap:6px; color:#ffc313; font-size:10px; font-weight:900; text-decoration:none; }
        .nr-map-programs-head svg { width:14px; height:14px; }
        .nr-map-programs-grid { display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:10px; }
        .nr-map-program-card { width:100%; min-width:0; overflow:hidden; padding:0; border:1px solid rgba(255,255,255,.1); border-radius:15px; color:#fff; background:rgba(255,255,255,.055); text-align:start; cursor:pointer; appearance:none; transition:transform .2s ease,border-color .2s ease,background .2s ease,box-shadow .2s ease; }
        .nr-map-program-card:hover,.nr-map-program-card:focus-visible { transform:translateY(-3px); border-color:rgba(255,195,19,.35); background:rgba(255,255,255,.08); outline:none; }
        .nr-map-program-card-selected { border-color:rgba(255,195,19,.68) !important; background:rgba(255,195,19,.08) !important; box-shadow:0 0 0 2px rgba(255,195,19,.13); }
        .nr-map-program-media { position:relative; height:108px; overflow:hidden; background:rgba(255,255,255,.04); }
        .nr-map-program-media img { width:100%; height:100%; object-fit:cover; display:block; }
        .nr-map-program-media > span,.nr-map-program-media > em { position:absolute; top:8px; padding:4px 7px; border-radius:999px; font-size:7px; font-style:normal; font-weight:900; }
        .nr-map-program-media > span { inset-inline-start:8px; color:#102f55; background:#ffc313; }
        .nr-map-program-media > em { inset-inline-end:8px; color:#fff; background:rgba(23,111,232,.88); }
        .nr-map-program-placeholder { display:grid; width:100%; height:100%; place-items:center; color:#ffc313; }
        .nr-map-program-placeholder svg { width:30px; height:30px; }
        .nr-map-program-body { display:grid; gap:6px; padding:10px 11px 11px; }
        .nr-map-program-body > strong { overflow:hidden; color:#fff; font-size:12px; text-overflow:ellipsis; white-space:nowrap; }
        .nr-map-program-body > small { color:rgba(255,255,255,.55); font-size:8px; }
        .nr-map-program-body > div { display:flex; justify-content:space-between; gap:8px; padding-top:5px; border-top:1px solid rgba(255,255,255,.07); }
        .nr-map-program-body > div span { color:rgba(255,255,255,.5); font-size:7px; }
        .nr-map-program-body > div b { color:#ffc313; font-size:11px; }
        .nr-map-programs-state { padding:18px; color:rgba(255,255,255,.62); text-align:center; font-size:10px; }
        .nr-map-all-programs-cta { opacity:.9; }
        @keyframes nrMapDotLtrV5 { from{left:0;opacity:.2} 14%{opacity:1} 84%{opacity:1} to{left:calc(100% - 10px);opacity:.15} }
        @keyframes nrMapDotRtlV5 { from{right:0;opacity:.2} 14%{opacity:1} 84%{opacity:1} to{right:calc(100% - 10px);opacity:.15} }
        @media(max-width:760px){
          .nr-map-focus-journey{position:relative;inset:auto;width:auto;margin:10px;padding:12px 13px;background:rgba(3,18,35,.97)}
          .nr-map-focus-route{grid-template-columns:max-content minmax(76px,1fr) max-content}.nr-map-focus-route strong{font-size:10px}.nr-map-focus-line{min-width:76px}
          .nr-map-programs{padding:12px}.nr-map-programs-grid{display:flex;gap:9px;overflow-x:auto;scroll-snap-type:x proximity;padding-bottom:4px;scrollbar-width:none}.nr-map-programs-grid::-webkit-scrollbar{display:none}.nr-map-program-card{flex:0 0 min(78vw,245px);scroll-snap-align:center}.nr-map-program-media{height:116px}
          .nr-map-empty-country{margin-inline:0;padding:13px}
        }
        @media(prefers-reduced-motion:reduce){.nr-map-focus-dot{animation:none!important}.nr-map-program-card{transition:none}}
      `}</style>
    </motion.section>
  );
}

function ArrowIcon({ isArabic }: { isArabic: boolean }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">{isArabic ? <path d="M19 12H5m6 6-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" /> : <path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />}</svg>;
}

function KaabaIcon() {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true"><path d="M6 5h12v15H6z" /><path d="M6 9h12M9 5v4M15 5v4M10 14h4v6" /></svg>;
}
