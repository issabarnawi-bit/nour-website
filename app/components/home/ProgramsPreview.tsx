"use client";

import Image from "next/image";
import { motion, type Variants } from "framer-motion";
import type { Language } from "../../data/home";
import { programs } from "../../data/programs";

type Props = {
  language: Language;
};

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.14,
    },
  },
};

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 34,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.62,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

function formatPrice(value: number, language: Language) {
  return new Intl.NumberFormat(language === "ar" ? "ar-SA" : "en-US").format(
    value,
  );
}

function getProgramCopy(
  program: (typeof programs)[number],
  language: Language,
) {
  if (language === "ar") {
    return {
      title: program.titleAr,
      description: program.shortDescriptionAr,
      badge: program.badgeAr,
      duration:
        program.duration === "7 Days"
          ? "7 أيام"
          : program.duration === "10 Days"
            ? "10 أيام"
            : program.duration === "12 Days"
              ? "12 يومًا"
              : program.duration,
      hotel:
        program.hotel === "4★ Hotel"
          ? "فندق 4 نجوم"
          : program.hotel === "5★ Hotel"
            ? "فندق 5 نجوم"
            : program.hotel === "Luxury Suite"
              ? "جناح فاخر"
              : program.hotel,
      transport:
        program.transport === "Included"
          ? "النقل مشمول"
          : program.transport === "VIP Transport"
            ? "نقل مميز"
            : program.transport === "Private Transfer"
              ? "نقل خاص"
              : program.transport,
    };
  }

  return {
    title: program.titleEn,
    description: program.shortDescriptionEn,
    badge: program.badgeEn,
    duration: program.duration,
    hotel: program.hotel,
    transport: program.transport,
  };
}

export default function ProgramsPreview({ language }: Props) {
  const featuredPrograms = programs.filter((program) => program.featured);

  return (
    <section
      className="nr-programs-preview"
      id="programs"
      dir={language === "ar" ? "rtl" : "ltr"}
      aria-labelledby="nr-programs-title"
    >
      <div className="nr-programs-orb nr-programs-orb-one" aria-hidden="true" />
      <div className="nr-programs-orb nr-programs-orb-two" aria-hidden="true" />

      <div className="nr-container">
        <motion.div
          className="nr-programs-heading"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="nr-programs-kicker">
            {language === "ar" ? "برامج مختارة" : "Featured Programs"}
          </span>

          <div className="nr-programs-heading-row">
            <div>
              <h2 id="nr-programs-title" lang={language === "ar" ? "ar" : "en"}>
                {language === "ar"
                  ? "اختر البرنامج المناسب لرحلتك"
                  : "Choose the right program for your journey"}
              </h2>

              <p>
                {language === "ar"
                  ? "برامج متنوعة تجمع السكن والنقل والخدمات المساندة، مع خيارات تناسب الاحتياجات والميزانيات المختلفة."
                  : "Explore Umrah programs that combine accommodation, transport, and supporting services for different needs and budgets."}
              </p>
            </div>

            <a className="nr-programs-all-link" href="/programs">
              <span>
                {language === "ar"
                  ? "عرض جميع البرامج"
                  : "View all programs"}
              </span>
              <ArrowIcon language={language} />
            </a>
          </div>
        </motion.div>

        <motion.div
          className="nr-programs-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
        >
          {featuredPrograms.map((program, index) => {
            const copy = getProgramCopy(program, language);

            return (
              <motion.article
                key={program.id}
                className={`nr-program-card nr-program-card-${program.category}`}
                variants={cardVariants}
                whileHover={{ y: -10 }}
              >
                <div className="nr-program-media">
                  <Image
                    src={program.image}
                    alt={copy.title}
                    fill
                    sizes="(max-width: 760px) 88vw, (max-width: 1100px) 46vw, 370px"
                    className="nr-program-image"
                  />

                  <div className="nr-program-overlay" aria-hidden="true" />

                  {copy.badge && (
                    <span className="nr-program-badge">{copy.badge}</span>
                  )}

                  <span className="nr-program-index">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="nr-program-body">
                  <div className="nr-program-title-row">
                    <div>
                      <span className="nr-program-category">
                        {language === "ar"
                          ? program.category === "economy"
                            ? "اقتصادي"
                            : program.category === "premium"
                              ? "مميز"
                              : "كبار الشخصيات"
                          : program.category === "economy"
                            ? "Economy"
                            : program.category === "premium"
                              ? "Premium"
                              : "VIP"}
                      </span>

                      <h3>{copy.title}</h3>
                    </div>

                    <span className="nr-program-rating" aria-label="5 stars">
                      ★ 5.0
                    </span>
                  </div>

                  <p className="nr-program-description">{copy.description}</p>

                  <div className="nr-program-features">
                    <span>
                      <CalendarIcon />
                      {copy.duration}
                    </span>

                    <span>
                      <HotelIcon />
                      {copy.hotel}
                    </span>

                    <span>
                      <TransportIcon />
                      {copy.transport}
                    </span>
                  </div>

                  <div className="nr-program-divider" />

                  <div className="nr-program-footer">
                    <div className="nr-program-price">
                      <small>
                        {language === "ar" ? "يبدأ من" : "Starting from"}
                      </small>

                      <strong>
                        {formatPrice(program.priceFrom, language)}
                        <span>
                          {language === "ar" ? " ر.س" : " SAR"}
                        </span>
                      </strong>
                    </div>

                    <div className="nr-program-actions">
                      <a
                        className="nr-program-details"
                        href={`/programs/${program.slug}`}
                      >
                        {language === "ar" ? "التفاصيل" : "Details"}
                      </a>

                      <a
                        className="nr-program-primary"
                        href="#contact"
                      >
                        <span>
                          {language === "ar"
                            ? "ابدأ عبر نور"
                            : "Start with Nour"}
                        </span>
                        <ArrowIcon language={language} />
                      </a>
                    </div>
                  </div>
                </div>
              </motion.article>
            );
          })}
        </motion.div>

        <motion.div
          className="nr-programs-note"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <InfoIcon />
          <p>
            {language === "ar"
              ? "الأسعار والبرامج المعروضة حاليًا تجريبية، وسيتم تحديثها وربطها بالنظام الرسمي لاحقًا."
              : "The programs and prices shown are currently illustrative and will later be connected to the official system."}
          </p>
        </motion.div>
      </div>

      <style jsx global>{`
        .nr-programs-preview {
          position: relative;
          overflow: hidden;
          padding: 108px 0;
          background:
            linear-gradient(
              180deg,
              color-mix(in srgb, var(--nr-soft) 65%, transparent),
              var(--nr-bg)
            );
          scroll-margin-top: 108px;
        }

        .nr-programs-preview::before {
          content: "";
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.33;
          background-image:
            linear-gradient(
              rgba(23, 111, 232, 0.055) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(23, 111, 232, 0.055) 1px,
              transparent 1px
            );
          background-size: 52px 52px;
          mask-image: linear-gradient(
            to bottom,
            transparent,
            #000 18%,
            #000 78%,
            transparent
          );
        }

        .nr-programs-preview .nr-container {
          position: relative;
          z-index: 2;
        }

        .nr-programs-orb {
          position: absolute;
          border-radius: 50%;
          filter: blur(10px);
          pointer-events: none;
        }

        .nr-programs-orb-one {
          width: 380px;
          height: 380px;
          top: -210px;
          inset-inline-start: -180px;
          background: rgba(23, 111, 232, 0.12);
        }

        .nr-programs-orb-two {
          width: 330px;
          height: 330px;
          right: -170px;
          bottom: -180px;
          background: rgba(255, 195, 19, 0.12);
        }

        .nr-programs-heading {
          margin-bottom: 45px;
        }

        .nr-programs-kicker {
          display: inline-flex;
          align-items: center;
          min-height: 34px;
          padding-inline: 14px;
          border: 1px solid rgba(23, 111, 232, 0.14);
          border-radius: 999px;
          color: var(--nr-blue);
          background: color-mix(in srgb, var(--nr-blue) 8%, var(--nr-card));
          font-size: 12px;
          font-weight: 900;
        }

        .nr-programs-heading-row {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 35px;
          margin-top: 16px;
        }

        .nr-programs-heading-row > div {
          max-width: 760px;
        }

        .nr-programs-heading h2 {
          margin: 0;
          color: var(--nr-text);
          font-size: clamp(34px, 4vw, 54px);
          line-height: 1.25;
        }

        .nr-programs-heading p {
          max-width: 720px;
          margin: 16px 0 0;
          color: var(--nr-muted);
          font-size: 16px;
          line-height: 1.9;
        }

        .nr-programs-all-link {
          flex: 0 0 auto;
          min-height: 46px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          padding-inline: 17px;
          border: 1px solid var(--nr-border);
          border-radius: 14px;
          color: var(--nr-text);
          background: var(--nr-card);
          font-size: 13px;
          font-weight: 900;
          box-shadow: 0 12px 28px rgba(18, 67, 130, 0.06);
          transition:
            transform 0.2s ease,
            border-color 0.2s ease,
            color 0.2s ease;
        }

        .nr-programs-all-link svg {
          width: 17px;
          height: 17px;
          transition: transform 0.2s ease;
        }

        .nr-programs-all-link:hover {
          color: var(--nr-blue);
          border-color: rgba(23, 111, 232, 0.28);
          transform: translateY(-2px);
        }

        html[dir="rtl"] .nr-programs-all-link:hover svg {
          transform: translateX(-3px);
        }

        html[dir="ltr"] .nr-programs-all-link:hover svg {
          transform: translateX(3px);
        }

        .nr-programs-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 22px;
        }

        .nr-program-card {
          position: relative;
          z-index: 2;
          min-width: 0;
          opacity: 1;
          visibility: visible;
          overflow: hidden;
          border: 1px solid var(--nr-border);
          border-radius: 27px;
          background: var(--nr-card);
          box-shadow: 0 20px 58px rgba(18, 67, 130, 0.09);
          transition:
            border-color 0.25s ease,
            box-shadow 0.25s ease;
        }

        .nr-program-card:hover {
         border-color: rgba(23, 111, 232, 0.34);
         box-shadow: 0 35px 90px rgba(18, 67, 130, 0.18);
        }

        .nr-program-media {
         position: relative;
         height: 310px;
         overflow: hidden;
         background: #dbe8f8;
        }
        .nr-program-image {
          object-fit: cover;
          transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .nr-program-card:hover .nr-program-image {
          transform: scale(1.12);
        }

        .nr-program-overlay {
          position: absolute;
          inset: 0;
          background:
          linear-gradient(
          180deg,
          rgba(4, 20, 43, 0.02) 0%,
          rgba(4, 20, 43, 0.08) 25%,
          rgba(4, 20, 43, 0.48) 62%,
          rgba(4, 20, 43, 0.92) 100%
         ),
          linear-gradient(
          135deg,
         rgba(23, 111, 232, 0.18),
         transparent 45%
        );
    }  

        .nr-program-badge {
          position: absolute;
          top: 17px;
          inset-inline-start: 17px;
          z-index: 2;
          min-height: 30px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding-inline: 12px;
          border-radius: 999px;
          color: #14335c;
          background: #ffc313;
          box-shadow: 0 10px 25px rgba(255, 195, 19, 0.25);
          font-size: 11px;
          font-weight: 900;
        }

        .nr-program-index {
          position: absolute;
          inset-inline-end: 17px;
          bottom: 13px;
          z-index: 2;
          color: rgba(255, 255, 255, 0.82);
          font-size: 31px;
          font-weight: 900;
          letter-spacing: 0.04em;
        }

        .nr-program-body {
          padding: 23px;
        }

        .nr-program-title-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 15px;
        }

        .nr-program-category {
          display: block;
          margin-bottom: 6px;
          color: var(--nr-blue);
          font-size: 11px;
          font-weight: 900;
        }

        .nr-program-title-row h3 {
          margin: 0;
          color: var(--nr-text);
          font-size: 21px;
          line-height: 1.4;
        }

        .nr-program-rating {
          flex: 0 0 auto;
          min-height: 29px;
          display: inline-flex;
          align-items: center;
          padding-inline: 9px;
          border-radius: 999px;
          color: #735800;
          background: rgba(255, 195, 19, 0.15);
          font-size: 11px;
          font-weight: 900;
          white-space: nowrap;
        }

        .nr-program-description {
          min-height: 58px;
          margin: 13px 0 17px;
          color: var(--nr-muted);
          font-size: 13px;
          line-height: 1.75;
        }

        .nr-program-features {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 7px;
        }

        .nr-program-features span {
          min-width: 0;
          min-height: 62px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 6px;
          padding: 8px 5px;
          border: 1px solid var(--nr-border);
          border-radius: 13px;
          color: var(--nr-muted);
          background: var(--nr-soft);
          font-size: 10px;
          font-weight: 800;
          text-align: center;
        }

        .nr-program-features svg {
          width: 18px;
          height: 18px;
          color: var(--nr-blue);
        }

        .nr-program-divider {
          height: 1px;
          margin: 20px 0;
          background: var(--nr-border);
        }

        .nr-program-footer {
          display: flex;
          align-items: flex-end;
          justify-content: space-between;
          gap: 12px;
        }

        .nr-program-price small {
         display: block;
         margin-bottom: 7px;
         color: var(--nr-muted);
         font-size: 12px;
         font-weight: 800;
         letter-spacing: 0.03em;
        }

        .nr-program-price strong {
          display: block;
         color: var(--nr-text);
         font-size: 38px;
         font-weight: 900;
         line-height: 0.95;
         } 

        .nr-program-price strong span {
         margin-inline-start: 4px;
         color: var(--nr-muted);
         font-size: 12px;
         font-weight: 800;
        }

        .nr-program-actions {
          display: flex;
          align-items: center;
          gap: 7px;
        }

        .nr-program-details,
        .nr-program-primary {
          min-height: 41px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 900;
          white-space: nowrap;
          transition:
            transform 0.2s ease,
            border-color 0.2s ease,
            box-shadow 0.2s ease;
        }

        .nr-program-details {
          padding-inline: 12px;
          border: 1px solid var(--nr-border);
          color: var(--nr-text);
          background: var(--nr-card);
        }

        .nr-program-primary {
          gap: 6px;
          padding-inline: 13px;
          color: #ffffff;
          background: var(--nr-blue);
          box-shadow: 0 11px 25px rgba(23, 111, 232, 0.2);
        }

        .nr-program-primary svg {
          width: 15px;
          height: 15px;
        }

        .nr-program-details:hover,
        .nr-program-primary:hover {
          transform: translateY(-2px);
        }

        .nr-program-details:hover {
          border-color: rgba(23, 111, 232, 0.3);
        }

        .nr-program-primary:hover {
          box-shadow: 0 15px 31px rgba(23, 111, 232, 0.28);
        }

        .nr-programs-preview a:focus-visible {
          outline: 3px solid rgba(23, 111, 232, 0.28);
          outline-offset: 4px;
        }

        .nr-programs-note {
          max-width: 830px;
          display: flex;
          align-items: flex-start;
          justify-content: center;
          gap: 9px;
          margin: 28px auto 0;
          color: var(--nr-muted);
          text-align: center;
        }

        .nr-programs-note svg {
          flex: 0 0 18px;
          width: 18px;
          height: 18px;
          margin-top: 2px;
          color: var(--nr-blue);
        }

        .nr-programs-note p {
          margin: 0;
          font-size: 11px;
          line-height: 1.7;
        }


        html[data-theme="dark"] .nr-programs-preview {
          background:
            radial-gradient(
              circle at 10% 14%,
              rgba(23, 111, 232, 0.14),
              transparent 24%
            ),
            radial-gradient(
              circle at 90% 86%,
              rgba(255, 195, 19, 0.09),
              transparent 24%
            ),
            linear-gradient(180deg, #07182c, #0a213d);
        }

        html[data-theme="dark"] .nr-program-card {
          border-color: rgba(255, 255, 255, 0.1);
          background: rgba(255, 255, 255, 0.055);
          box-shadow: 0 24px 64px rgba(0, 0, 0, 0.24);
        }

        html[data-theme="dark"] .nr-program-features span {
          border-color: rgba(255, 255, 255, 0.08);
          background: rgba(255, 255, 255, 0.045);
        }

        @media (max-width: 1080px) {
          .nr-programs-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }

          .nr-program-card:last-child {
            grid-column: 1 / -1;
            width: min(100%, 520px);
            justify-self: center;
          }
        }

        @media (max-width: 760px) {
          .nr-programs-preview {
            padding: 78px 0;
          }

          .nr-programs-heading-row {
            align-items: flex-start;
            flex-direction: column;
            gap: 22px;
          }

          .nr-programs-all-link {
            width: 100%;
          }

          .nr-programs-grid {
            display: flex;
            gap: 14px;
            overflow-x: auto;
            margin-inline: calc((100vw - 100%) / -2);
            padding-inline: max(13px, calc((100vw - 100%) / 2));
            padding-bottom: 18px;
            scroll-snap-type: x mandatory;
            scrollbar-width: none;
          }

          .nr-programs-grid::-webkit-scrollbar {
            display: none;
          }

          .nr-program-card,
          .nr-program-card:last-child {
            flex: 0 0 min(87vw, 390px);
            width: auto;
            grid-column: auto;
            scroll-snap-align: center;
          }

          .nr-program-media {
            height: 270px;
          }
        }

        @media (max-width: 430px) {
          .nr-programs-heading h2 {
            font-size: 32px;
          }

          .nr-program-body {
            padding: 19px;
          }

          .nr-program-footer {
            align-items: stretch;
            flex-direction: column;
          }

          .nr-program-actions {
            display: grid;
            grid-template-columns: 0.8fr 1.2fr;
          }

          .nr-program-details,
          .nr-program-primary {
            width: 100%;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .nr-program-card,
          .nr-program-image,
          .nr-programs-preview a,
          .nr-programs-preview svg {
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}

function CalendarIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="3" y="5" width="18" height="16" rx="3" />
      <path d="M8 3v4M16 3v4M3 10h18" strokeLinecap="round" />
    </svg>
  );
}

function HotelIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 21V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16" />
      <path d="M2 21h20M8 7h2M14 7h2M8 11h2M14 11h2M10 21v-5h4v5" strokeLinecap="round" />
    </svg>
  );
}

function TransportIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <rect x="4" y="3" width="16" height="16" rx="3" />
      <path d="M7 19v2M17 19v2M4 11h16M8 7h8" strokeLinecap="round" />
      <circle cx="8" cy="15" r="1" fill="currentColor" stroke="none" />
      <circle cx="16" cy="15" r="1" fill="currentColor" stroke="none" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
      <circle cx="12" cy="12" r="9" />
      <path d="M12 11v5M12 8h.01" strokeLinecap="round" />
    </svg>
  );
}

function ArrowIcon({ language }: { language: Language }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      {language === "ar" ? (
        <path d="M19 12H5m6 6-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
      ) : (
        <path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round" />
      )}
    </svg>
  );
}