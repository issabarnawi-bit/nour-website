"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";

import type { Language } from "../../../data/home";
import { createClient } from "../../../../src/lib/supabase/client";
import {
  getPublicCountries,
  type PublicCountry,
} from "../../../../src/features/countries/services";
import styles from "./NourWorldMap.module.css";

type Props = { language: Language };
type MapPosition = { x: number; y: number };

const SAUDI_ISO2 = "SA";
const MAKKAH_COORDINATES = { latitude: 21.4225, longitude: 39.8262 };

function coordinatesToMapPosition(latitude: number, longitude: number): MapPosition {
  const x = ((longitude + 180) / 360) * 100;
  const y = ((90 - latitude) / 180) * 100;
  return {
    x: Math.min(Math.max(x, 1.5), 98.5),
    y: Math.min(Math.max(y, 2), 98),
  };
}

function getProgramsLabel(country: PublicCountry, isArabic: boolean): string {
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

function buildRoutePath(from: MapPosition, to: MapPosition) {
  const midX = (from.x + to.x) / 2;
  const lift = Math.max(6, Math.min(15, Math.abs(from.x - to.x) * 0.08));
  return `M${from.x} ${from.y} C${midX} ${from.y - lift}, ${midX} ${to.y - lift * 0.72}, ${to.x} ${to.y}`;
}

export default function NourWorldMap({ language }: Props) {
  const isArabic = language === "ar";
  const supabase = useMemo(() => createClient(), []);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [paused, setPaused] = useState(false);

  const countriesQuery = useQuery({
    queryKey: ["public", "map-countries"],
    queryFn: () => getPublicCountries(supabase),
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const countries = countriesQuery.data ?? [];
  const countriesWithPositions = useMemo(
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

  useEffect(() => {
    if (!countriesWithPositions.length) {
      setActiveId(null);
      return;
    }
    if (countriesWithPositions.some((country) => country.id === activeId)) return;
    const firstWithPrograms = countriesWithPositions.find(
      (country) => country.iso2 !== SAUDI_ISO2 && country.hasPublishedPrograms,
    );
    setActiveId(firstWithPrograms?.id ?? countriesWithPositions[0].id);
  }, [countriesWithPositions, activeId]);

  const activeCountry = useMemo(
    () => countriesWithPositions.find((country) => country.id === activeId)
      ?? countriesWithPositions[0]
      ?? null,
    [countriesWithPositions, activeId],
  );

  const selectedCountry = useMemo(
    () => selectedId
      ? countriesWithPositions.find((country) => country.id === selectedId) ?? null
      : null,
    [countriesWithPositions, selectedId],
  );

  useEffect(() => {
    if (selectedId && !countriesWithPositions.some((country) => country.id === selectedId)) {
      setSelectedId(null);
    }
  }, [countriesWithPositions, selectedId]);

  const publishedProgramsCount = useMemo(
    () => countries.reduce((total, country) => total + country.publishedProgramsCount, 0),
    [countries],
  );
  const countriesWithProgramsCount = useMemo(
    () => countries.filter((country) => country.hasPublishedPrograms).length,
    [countries],
  );

  useEffect(() => {
    if (paused || selectedId || countriesWithPositions.length <= 1) return;
    const availableCountries = countriesWithPositions.filter(
      (country) => country.iso2 !== SAUDI_ISO2 && country.hasPublishedPrograms,
    );
    if (availableCountries.length <= 1) return;

    const timer = window.setInterval(() => {
      setActiveId((currentId) => {
        const currentIndex = availableCountries.findIndex((country) => country.id === currentId);
        const nextIndex = currentIndex < 0 ? 0 : (currentIndex + 1) % availableCountries.length;
        return availableCountries[nextIndex].id;
      });
    }, 4300);

    return () => window.clearInterval(timer);
  }, [paused, selectedId, countriesWithPositions]);

  const ctaCountry = selectedCountry ?? activeCountry;
  const highlightedId = selectedId ?? activeId;
  const activeProgramsUrl = ctaCountry
    ? `/programs?country=${encodeURIComponent(ctaCountry.id)}`
    : "/programs";

  const routeCountries = useMemo(
    () => countriesWithPositions.filter(
      (country) => country.iso2 !== SAUDI_ISO2 && country.hasPublishedPrograms,
    ),
    [countriesWithPositions],
  );

  const focusedPosition = selectedCountry?.position;

  return (
    <motion.section
      className={styles.panel}
      initial={{ opacity: 0, y: 34 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.16 }}
      transition={{ duration: 0.75, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <header className={styles.sectionIntro}>
        <span className={styles.eyebrow}>{isArabic ? "من العالم إلى مكة" : "From the world to Makkah"}</span>
        <h3>{isArabic ? "اكتشف من أين تبدأ رحلتك إلى مكة" : "Discover where your journey to Makkah begins"}</h3>
        <p>
          {isArabic
            ? "اختر دولتك وشاهد البرامج المتاحة والمسار الذي يربط رحلتك بمكة المكرمة."
            : "Choose your country, view available programs, and see the route connecting your journey to Makkah."}
        </p>
      </header>

      <div className={styles.mapExperience}>
        <div className={styles.mapHeader}>
          <div>
            <small>{isArabic ? "شبكة نور للرحلات" : "Nour journey network"}</small>
            <strong>{isArabic ? "رحلات تنطلق من دول متعددة إلى مكة" : "Journeys connecting multiple countries to Makkah"}</strong>
          </div>
          <span className={styles.live}>
            <i />
            {countriesQuery.isFetching
              ? isArabic ? "جارٍ التحديث" : "Updating"
              : isArabic ? "متصلة بالمنصة" : "Connected"}
          </span>
        </div>

        <div className={styles.map}>
          <div
            className={styles.mapStage}
            style={{
              transform: selectedCountry ? "scale(1.075)" : "scale(1)",
              transformOrigin: focusedPosition
                ? `${focusedPosition.x}% ${focusedPosition.y}%`
                : "50% 50%",
              transition: "transform 700ms cubic-bezier(.22,1,.36,1), transform-origin 700ms cubic-bezier(.22,1,.36,1)",
            }}
          >
            <img className={styles.realisticMap} src="/images/site/world-map-white.svg" alt="" aria-hidden="true" />

            <svg className={styles.routes} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
              <defs>
                <linearGradient id="nourRouteGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#176fe8" stopOpacity="0.28" />
                  <stop offset="62%" stopColor="#2aa9e9" stopOpacity="0.72" />
                  <stop offset="100%" stopColor="#ffc313" stopOpacity="1" />
                </linearGradient>
                <filter id="nourRouteGlow" x="-50%" y="-50%" width="200%" height="200%">
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
                      transition={{ duration: 1.25, delay: 0.24 + index * 0.11, ease: [0.22, 1, 0.36, 1] }}
                    />
                    <motion.path
                      d={routePath}
                      className={isHighlighted ? styles.routeTravelerActive : styles.routeTraveler}
                      strokeDasharray="0.6 3.6"
                      animate={{
                        strokeDashoffset: [0, -16],
                        opacity: isHighlighted ? [0.45, 1, 0.45] : [0.18, 0.55, 0.18],
                      }}
                      transition={{
                        strokeDashoffset: { duration: 2.8 + index * 0.22, repeat: Infinity, ease: "linear" },
                        opacity: { duration: 2.4, repeat: Infinity, ease: "easeInOut", delay: index * 0.16 },
                      }}
                    />
                    {isHighlighted ? (
                      <circle r="0.9" fill="#ffc313" filter="url(#nourRouteGlow)">
                        <animateMotion dur="3s" repeatCount="indefinite" path={routePath} />
                      </circle>
                    ) : null}
                  </g>
                );
              })}
            </svg>

            <motion.div
              className={styles.makkahMarker}
              style={{ left: `${makkahPosition.x}%`, top: `${makkahPosition.y}%` }}
              initial={{ opacity: 0, scale: 0.55 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <span className={styles.makkahPulse} />
              <span className={styles.makkahCore}><KaabaIcon /></span>
              <strong>{isArabic ? "مكة" : "Makkah"}</strong>
            </motion.div>

            {countriesWithPositions.map((country) => {
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
                  ].filter(Boolean).join(" ")}
                  style={{ left: `${country.position.x}%`, top: `${country.position.y}%` }}
                  onMouseEnter={() => {
                    if (!selectedId) setActiveId(country.id);
                    setPaused(true);
                  }}
                  onMouseLeave={() => setPaused(false)}
                  onClick={() => {
                    setActiveId(country.id);
                    setSelectedId((current) => current === country.id ? null : country.id);
                  }}
                  aria-label={isArabic ? `عرض برامج ${country.nameAr}` : `Show programs for ${country.nameEn}`}
                  aria-pressed={isSelected}
                >
                  <span />
                  <small>{isArabic ? country.nameAr : country.nameEn}</small>
                </button>
              );
            })}

            {countriesQuery.isLoading ? (
              <div className={styles.mapState}>{isArabic ? "جارٍ تحميل الدول..." : "Loading countries..."}</div>
            ) : null}
            {countriesQuery.isError ? (
              <div className={styles.mapState} role="alert">{isArabic ? "تعذر تحميل دول الخريطة." : "Unable to load map countries."}</div>
            ) : null}
          </div>

          <AnimatePresence mode="wait">
            {selectedCountry ? (
              <motion.article
                key={selectedCountry.id}
                className={styles.countryCard}
                initial={{ opacity: 0, y: 12, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 8, scale: 0.98 }}
                transition={{ duration: 0.22 }}
              >
                <button
                  type="button"
                  className={styles.cardClose}
                  onClick={() => setSelectedId(null)}
                  aria-label={isArabic ? "إغلاق بطاقة الدولة" : "Close country card"}
                >×</button>
                <span className={styles.pin}><LocationIcon /></span>
                <div>
                  <small>{isArabic ? "نقطة الانطلاق" : "Starting point"}</small>
                  <strong>{isArabic ? selectedCountry.nameAr : selectedCountry.nameEn}</strong>
                  <small>{getProgramsLabel(selectedCountry, isArabic)}</small>
                </div>
              </motion.article>
            ) : null}
          </AnimatePresence>

          <AnimatePresence>
            {selectedCountry ? (
              <motion.div
                className="nr-map-focus-journey"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 8 }}
              >
                <span className="nr-map-focus-label">{isArabic ? "مسار رحلتك" : "Your journey"}</span>
                <div className="nr-map-focus-route">
                  <strong>{isArabic ? selectedCountry.nameAr : selectedCountry.nameEn}</strong>
                  <span className="nr-map-focus-line"><i /></span>
                  <strong>{isArabic ? "مكة" : "Makkah"}</strong>
                </div>
                <small>{getProgramsLabel(selectedCountry, isArabic)}</small>
              </motion.div>
            ) : null}
          </AnimatePresence>
        </div>

        <motion.aside
          className={styles.floatingPanel}
          initial={{ opacity: 0, x: isArabic ? 34 : -34 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.72, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className={styles.panelKicker}>
            {selectedCountry
              ? isArabic ? "الدولة المختارة" : "Selected country"
              : isArabic ? "اختر نقطة الانطلاق" : "Choose your starting point"}
          </span>
          <h4>
            {ctaCountry
              ? isArabic ? `اكتشف برامج ${ctaCountry.nameAr}` : `Explore programs from ${ctaCountry.nameEn}`
              : isArabic ? "اختر دولتك" : "Choose your country"}
          </h4>
          <p>
            {ctaCountry
              ? getProgramsLabel(ctaCountry, isArabic)
              : isArabic ? "اختر نقطة على الخريطة لعرض البرامج." : "Select a point on the map to view programs."}
          </p>

          <div className={styles.metrics}>
            <div><strong>{countries.length}</strong><span>{isArabic ? "دولة مفعّلة" : "Active countries"}</span></div>
            <div><strong>{countriesWithProgramsCount}</strong><span>{isArabic ? "دول لديها برامج" : "With programs"}</span></div>
            <div><strong>{publishedProgramsCount}</strong><span>{isArabic ? "برنامج منشور" : "Programs"}</span></div>
          </div>

          {ctaCountry?.hasPublishedPrograms ? (
            <a className={styles.cta} href={activeProgramsUrl}>
              <span>{isArabic ? `استعرض برامج ${ctaCountry.nameAr}` : `Explore ${ctaCountry.nameEn} programs`}</span>
              <ArrowIcon isArabic={isArabic} />
            </a>
          ) : (
            <span className={`${styles.cta} nr-map-cta-disabled`} aria-disabled="true">
              <span>{isArabic ? "لا توجد برامج متاحة حاليًا" : "No programs available yet"}</span>
            </span>
          )}
        </motion.aside>

        {countriesWithPositions.length > 0 ? (
          <div className={styles.locationTabs}>
            {countriesWithPositions
              .filter((country) => country.iso2 !== SAUDI_ISO2)
              .map((country) => {
                const isSelected = country.id === selectedId;
                const isHighlighted = country.id === highlightedId;
                return (
                  <button
                    key={country.id}
                    type="button"
                    className={[
                      isHighlighted ? styles.activeTab : "",
                      isSelected ? "nr-map-selected-tab" : "",
                    ].filter(Boolean).join(" ")}
                    onClick={() => {
                      setActiveId(country.id);
                      setSelectedId((current) => current === country.id ? null : country.id);
                    }}
                    aria-pressed={isSelected}
                  >
                    {isArabic ? country.nameAr : country.nameEn}
                    {country.hasPublishedPrograms ? <span>{country.publishedProgramsCount}</span> : null}
                  </button>
                );
              })}
          </div>
        ) : null}

        <p className={styles.mapHint}>
          {selectedCountry
            ? isArabic
              ? "تم تثبيت اختيارك وتكبير نقطة الانطلاق. اضغط على الدولة مرة أخرى للعودة إلى العرض العالمي."
              : "Your starting point is pinned and focused. Select it again to return to the world view."
            : isArabic
              ? "اختر دولة من الخريطة أو من القائمة لعرض مسار الرحلة والبرامج المتاحة."
              : "Choose a country on the map or from the list to view its journey route and available programs."}
        </p>
      </div>

      <style jsx global>{`
        .nr-map-selected-point {
          z-index: 13 !important;
          transform: translate(-50%, -50%) scale(1.36) !important;
          background: #ffc313 !important;
          box-shadow: 0 0 0 10px rgba(255,195,19,.18), 0 0 38px rgba(255,195,19,.78) !important;
        }
        .nr-map-selected-point::before { border-color: rgba(255,195,19,.72) !important; }
        .nr-map-selected-point > small {
          opacity: 1 !important;
          border-color: rgba(255,195,19,.3) !important;
          color: #ffc313 !important;
        }
        .nr-map-selected-tab { box-shadow: inset 0 0 0 1px rgba(255,195,19,.55) !important; }
        .nr-map-cta-disabled {
          cursor: not-allowed !important;
          opacity: .58;
          box-shadow: none !important;
          filter: grayscale(.15);
        }
        .nr-map-cta-disabled:hover { transform: none !important; }

        .nr-map-focus-journey {
          position: absolute;
          z-index: 17;
          inset-inline-end: 18px;
          bottom: 18px;
          width: min(330px, 42%);
          padding: 12px 14px;
          border: 1px solid rgba(255,255,255,.15);
          border-radius: 16px;
          color: #fff;
          background: rgba(4,20,39,.82);
          box-shadow: 0 18px 44px rgba(0,0,0,.2);
          backdrop-filter: blur(14px);
        }
        .nr-map-focus-label {
          display: block;
          margin-bottom: 8px;
          color: #8fc8ff;
          font-size: 9px;
          font-weight: 900;
        }
        .nr-map-focus-route {
          display: grid;
          grid-template-columns: max-content 1fr max-content;
          align-items: center;
          gap: 9px;
        }
        .nr-map-focus-route strong { font-size: 11px; }
        .nr-map-focus-line {
          position: relative;
          height: 2px;
          overflow: visible;
          border-radius: 999px;
          background: linear-gradient(90deg, #176fe8, #2aa9e9, #ffc313);
        }
        .nr-map-focus-line i {
          position: absolute;
          top: 50%;
          left: 0;
          width: 7px;
          height: 7px;
          transform: translateY(-50%);
          border-radius: 50%;
          background: #ffc313;
          box-shadow: 0 0 14px rgba(255,195,19,.85);
          animation: nrJourneyTraveler 2.6s linear infinite;
        }
        .nr-map-focus-journey > small {
          display: block;
          margin-top: 7px;
          color: rgba(255,255,255,.58);
          font-size: 8px;
        }
        @keyframes nrJourneyTraveler {
          from { left: 0; }
          to { left: calc(100% - 7px); }
        }
        @media (max-width: 760px) {
          .nr-map-focus-journey {
            inset-inline: 12px;
            bottom: 12px;
            width: auto;
            padding: 10px 12px;
          }
          .nr-map-focus-route strong { font-size: 9px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .nr-map-focus-line i { animation: none; left: calc(100% - 7px); }
        }
      `}</style>
    </motion.section>
  );
}

function ArrowIcon({ isArabic }: { isArabic: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
      {isArabic ? (
        <path d="M19 12H5m6 6-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}

function LocationIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" aria-hidden="true">
      <path d="M12 21s7-4.3 7-11a7 7 0 1 0-14 0c0 6.7 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function KaabaIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
      <path d="M6 5h12v15H6z" />
      <path d="M6 9h12M9 5v4M15 5v4M10 14h4v6" />
    </svg>
  );
}
