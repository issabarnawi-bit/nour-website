"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import type { Language } from "../../../data/home";
import styles from "./NourWorldMap.module.css";

type Props = {
  language: Language;
};

type Location = {
  id: string;
  x: number;
  y: number;
  nameAr: string;
  nameEn: string;
  titleAr: string;
  titleEn: string;
  textAr: string;
  textEn: string;
  tone?: "blue" | "gold";
};

const locations: Location[] = [
  {
    id: "nigeria",
    x: 45,
    y: 58,
    nameAr: "نيجيريا",
    nameEn: "Nigeria",
    titleAr: "خدمات وبرامج العمرة",
    titleEn: "Umrah services & programs",
    textAr: "تجهيز المتطلبات، استعراض البرامج، ومتابعة الرحلة من تجربة رقمية واحدة.",
    textEn: "Prepare requirements, explore programs, and follow the journey in one digital experience.",
  },
  {
    id: "egypt",
    x: 54,
    y: 45,
    nameAr: "مصر",
    nameEn: "Egypt",
    titleAr: "خيارات سفر متكاملة",
    titleEn: "Integrated travel options",
    textAr: "خدمات تأشيرات وسكن ونقل مع تفاصيل واضحة تساعد على المقارنة والاختيار.",
    textEn: "Visa, accommodation, and transport services with clear details for easier comparison.",
  },
  {
    id: "turkey",
    x: 58,
    y: 34,
    nameAr: "تركيا",
    nameEn: "Türkiye",
    titleAr: "تخطيط أكثر سهولة",
    titleEn: "Simpler planning",
    textAr: "برامج متنوعة ومتابعة منظمة لمراحل الحجز والاستعداد للرحلة.",
    textEn: "Flexible programs and organized follow-up across booking and journey preparation.",
  },
  {
    id: "saudi",
    x: 62,
    y: 51,
    nameAr: "مكة المكرمة",
    nameEn: "Makkah",
    titleAr: "الوجهة الرئيسية",
    titleEn: "The main destination",
    textAr: "فنادق ونقل وإرشاد وخدمات مساندة تركز على راحة المعتمر ووضوح تجربته.",
    textEn: "Hotels, transfers, guidance, and assistance focused on pilgrim comfort and clarity.",
    tone: "gold",
  },
  {
    id: "malaysia",
    x: 82,
    y: 60,
    nameAr: "ماليزيا",
    nameEn: "Malaysia",
    titleAr: "خيارات مرنة للرحلة",
    titleEn: "Flexible journey options",
    textAr: "برامج تناسب الأفراد والمجموعات مع وسائل دفع مرنة ومتابعة رقمية.",
    textEn: "Programs for individuals and groups with flexible payment and digital follow-up.",
  },
  {
    id: "indonesia",
    x: 87,
    y: 68,
    nameAr: "إندونيسيا",
    nameEn: "Indonesia",
    titleAr: "خدمة قابلة للتوسع",
    titleEn: "A scalable service",
    textAr: "تجربة رقمية مصممة لخدمة أسواق متعددة وشركاء أكثر مع توسع  نور آب.",
    textEn: "A digital experience designed for multiple markets and a growing partner network.",
  },
];

export default function NourWorldMap({ language }: Props) {
  const isArabic = language === "ar";
  const [activeId, setActiveId] = useState("saudi");
  const [paused, setPaused] = useState(false);

  const active = useMemo(
    () => locations.find((location) => location.id === activeId) ?? locations[0],
    [activeId],
  );

  useEffect(() => {
    if (paused) return;

    const timer = window.setInterval(() => {
      setActiveId((current) => {
        const currentIndex = locations.findIndex((item) => item.id === current);
        return locations[(currentIndex + 1) % locations.length].id;
      });
    }, 3600);

    return () => window.clearInterval(timer);
  }, [paused]);

  return (
    <motion.div
      className={styles.panel}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className={styles.copy}>
        <span className={styles.eyebrow}>
          {isArabic ? "نطاق  نور آب العالمي" : "NourApp global reach"}
        </span>
        <h3>
          {isArabic
            ? "خدمات تربط المعتمرين بمكة من دول متعددة"
            : "Services connecting pilgrims to Makkah from multiple countries"}
        </h3>
        <p>
          {isArabic
            ? "اضغط على أي نقطة لاستعراض نموذج للخدمات المتاحة في كل سوق. البيانات المعروضة توضيحية وقابلة للتحديث عند اعتماد نطاق التشغيل الرسمي."
            : "Select any point to preview services for each market. Displayed locations are illustrative and can be updated once the official operating scope is approved."}
        </p>

        <div className={styles.metrics}>
          <div>
            <strong>18+</strong>
            <span>{isArabic ? "دولة مستهدفة" : "Target countries"}</span>
          </div>
          <div>
            <strong>24/7</strong>
            <span>{isArabic ? "دعم متواصل" : "Continuous support"}</span>
          </div>
          <div>
            <strong>1</strong>
            <span>{isArabic ? "تجربة رقمية" : "Digital experience"}</span>
          </div>
        </div>

        <a className={styles.cta} href="#programs">
          <span>{isArabic ? "استكشف برامج  نور آب" : "Explore NourApp programs"}</span>
          <ArrowIcon isArabic={isArabic} />
        </a>
      </div>

      <div className={styles.mapArea}>
        <div className={styles.mapHeader}>
          <div>
            <small>{isArabic ? "شبكة الخدمات" : "Service network"}</small>
            <strong>{isArabic ? "اختر موقعًا على الخريطة" : "Choose a location on the map"}</strong>
          </div>
          <span className={styles.live}>
            <i />
            {isArabic ? "تفاعلية" : "Interactive"}
          </span>
        </div>

        <div className={styles.map}>
          <svg
            className={styles.world}
            viewBox="0 0 1000 500"
            role="img"
            aria-label={isArabic ? "خريطة عالم تفاعلية" : "Interactive world map"}
          >
            <g className={styles.continents}>
              <path d="M74 146 111 111 180 100 218 118 243 154 226 179 193 184 174 211 139 203 115 229 88 212 91 177Z" />
              <path d="M217 229 245 249 257 292 282 332 266 377 237 420 219 391 224 351 203 312 185 269Z" />
              <path d="M400 123 438 104 489 111 516 131 500 152 462 151 443 171 410 161 389 145Z" />
              <path d="M451 172 495 161 541 178 562 211 548 252 522 278 504 329 475 353 457 320 447 276 422 240 427 201Z" />
              <path d="M503 121 567 99 641 102 701 119 769 119 834 151 862 184 844 214 793 215 756 197 712 210 686 247 653 244 632 215 594 207 565 174 526 165Z" />
              <path d="M663 240 703 251 724 286 755 306 742 332 703 326 676 299 649 270Z" />
              <path d="M807 330 846 313 886 330 905 361 881 382 835 378 808 355Z" />
              <path d="M917 399 935 391 946 405 936 417 918 414Z" />
            </g>

            <g className={styles.decorLines}>
              <path d="M90 80H910" />
              <path d="M65 250H935" />
              <path d="M120 420H880" />
              <path d="M250 45V455" />
              <path d="M500 35V465" />
              <path d="M750 45V455" />
            </g>
          </svg>

          <svg className={styles.routes} viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
            {locations
              .filter((location) => location.id !== "saudi")
              .map((location) => (
                <motion.path
                  key={location.id}
                  d={`M${location.x} ${location.y} C${(location.x + 62) / 2} ${location.y - 8}, ${(location.x + 62) / 2} 49, 62 51`}
                  initial={{ pathLength: 0, opacity: 0 }}
                  whileInView={{ pathLength: 1, opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 1.2, delay: 0.25 }}
                />
              ))}
          </svg>

          {locations.map((location) => {
            const isActive = location.id === activeId;

            return (
              <button
                key={location.id}
                type="button"
                className={`${styles.point} ${
                  location.tone === "gold" ? styles.goldPoint : ""
                } ${isActive ? styles.activePoint : ""}`}
                style={{ left: `${location.x}%`, top: `${location.y}%` }}
                onClick={() => setActiveId(location.id)}
                onFocus={() => {
                  setPaused(true);
                  setActiveId(location.id);
                }}
                onBlur={() => setPaused(false)}
                aria-label={
                  isArabic
                    ? `عرض خدمات ${location.nameAr}`
                    : `Show services for ${location.nameEn}`
                }
                aria-pressed={isActive}
              >
                <span />
              </button>
            );
          })}

          <AnimatePresence mode="wait">
            <motion.article
              key={active.id}
              className={styles.card}
              initial={{ opacity: 0, y: 12, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.97 }}
              transition={{ duration: 0.28 }}
              style={{
                left: `${Math.min(Math.max(active.x, 24), 76)}%`,
                top: `${active.y < 44 ? active.y + 10 : active.y - 9}%`,
              }}
            >
              <div className={styles.cardTop}>
                <span className={styles.pin}>
                  {active.tone === "gold" ? <KaabaIcon /> : <LocationIcon />}
                </span>
                <div>
                  <small>{isArabic ? active.nameAr : active.nameEn}</small>
                  <strong>{isArabic ? active.titleAr : active.titleEn}</strong>
                </div>
              </div>
              <p>{isArabic ? active.textAr : active.textEn}</p>
            </motion.article>
          </AnimatePresence>
        </div>

        <div className={styles.locationTabs}>
          {locations.map((location) => (
            <button
              key={location.id}
              type="button"
              className={location.id === activeId ? styles.activeTab : ""}
              onClick={() => setActiveId(location.id)}
            >
              {isArabic ? location.nameAr : location.nameEn}
            </button>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function ArrowIcon({ isArabic }: { isArabic: boolean }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
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
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M12 21s7-4.3 7-11a7 7 0 1 0-14 0c0 6.7 7 11 7 11Z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}

function KaabaIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M6 5h12v15H6z" />
      <path d="M6 9h12M9 5v4M15 5v4M10 14h4v6" />
    </svg>
  );
}