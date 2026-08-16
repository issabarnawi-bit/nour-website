"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { HomeCopy, Language } from "../../data/home";
import { appScreens, fadeUp } from "../../data/home";

type Props = {
  t: HomeCopy;
  language: Language;
  activeScreen: number;
  onScreenChange: (index: number) => void;
};

export default function Showcase({
  t,
  language,
  activeScreen,
  onScreenChange,
}: Props) {
  const isArabic = language === "ar";
  const safeActiveScreen = Math.min(
    Math.max(activeScreen, 0),
    Math.max(appScreens.length - 1, 0),
  );
  const currentScreen = appScreens[safeActiveScreen];

  return (
    <section
      className="nr-showcase-premium"
      id="showcase"
      dir={isArabic ? "rtl" : "ltr"}
      aria-labelledby="nr-showcase-title"
    >
      <div className="nr-showcase-pattern" aria-hidden="true" />
      <div className="nr-showcase-orb nr-showcase-orb-blue" aria-hidden="true" />
      <div className="nr-showcase-orb nr-showcase-orb-gold" aria-hidden="true" />

      <div className="nr-container nr-showcase-premium-grid">
        <motion.div
          className="nr-showcase-device-stage"
          initial={{
            opacity: 0,
            x: isArabic ? 80 : -80,
            scale: 0.96,
          }}
          whileInView={{
            opacity: 1,
            x: 0,
            scale: 1,
          }}
          viewport={{ once: true, amount: 0.18 }}
          transition={{
            duration: 0.82,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <div className="nr-showcase-device-glow" aria-hidden="true" />
          <div className="nr-showcase-device-ring" aria-hidden="true" />

          <div className="NourApp-phone-frame">
            <span
              className="NourApp-phone-side-button NourApp-phone-side-button-one"
              aria-hidden="true"
            />
            <span
              className="NourApp-phone-side-button NourApp-phone-side-button-two"
              aria-hidden="true"
            />
            <span
              className="NourApp-phone-side-button NourApp-phone-side-button-three"
              aria-hidden="true"
            />

            <div className="NourApp-phone-screen" aria-live="polite">
              <span className="NourApp-phone-island" aria-hidden="true" />

              {currentScreen ? (
                <AnimatePresence mode="wait" initial={false}>
                  <motion.div
                    key={currentScreen.src}
                    className="NourApp-screen-slide"
                    initial={{
                      opacity: 0,
                      x: isArabic ? 46 : -46,
                      scale: 0.99,
                    }}
                    animate={{
                      opacity: 1,
                      x: 0,
                      scale: 1,
                    }}
                    exit={{
                      opacity: 0,
                      x: isArabic ? -46 : 46,
                      scale: 0.99,
                    }}
                    transition={{
                      duration: 0.42,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                  >
                    <Image
                      src={currentScreen.src}
                      alt={
                        isArabic
                          ? currentScreen.altAr
                          : currentScreen.altEn
                      }
                      fill
                      sizes="(max-width: 680px) 220px, 280px"
                      className="NourApp-screen-image"
                      priority={safeActiveScreen === 0}
                    />
                  </motion.div>
                </AnimatePresence>
              ) : null}

              <span className="NourApp-phone-home-line" aria-hidden="true" />
            </div>
          </div>

          <div
            className="NourApp-screen-dots"
            aria-label={
              isArabic
                ? "التنقل بين واجهات تطبيق نور آب"
                : "Navigate NourApp app screens"
            }
          >
            {appScreens.map((screen, index) => (
              <button
                key={screen.src}
                type="button"
                className={
                  safeActiveScreen === index
                    ? "NourApp-screen-dot is-active"
                    : "NourApp-screen-dot"
                }
                onClick={() => onScreenChange(index)}
                aria-label={
                  isArabic
                    ? `عرض شاشة التطبيق رقم ${index + 1}`
                    : `Show app screen ${index + 1}`
                }
                aria-current={safeActiveScreen === index ? "true" : undefined}
              />
            ))}
          </div>

          <div className="nr-showcase-device-caption">
            <span>
              {isArabic ? "تجربة التطبيق" : "App experience"}
            </span>
            <strong>
              {String(safeActiveScreen + 1).padStart(2, "0")}
              <small>/ {String(appScreens.length).padStart(2, "0")}</small>
            </strong>
          </div>
        </motion.div>

        <motion.div
          className="nr-showcase-copy-premium"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.22 }}
          variants={fadeUp}
        >
          <span className="nr-showcase-kicker">
            <PhoneSparkIcon />
            {isArabic ? "تطبيق نور آب" : "NourApp mobile experience"}
          </span>

          <h2 id="nr-showcase-title">{t.showcaseTitle}</h2>
          <p>{t.showcaseText}</p>

          <div className="nr-showcase-features">
            <article>
              <span><PackageIcon /></span>
              <div>
                <h3>
                  {isArabic
                    ? "برامج واضحة وسهلة المقارنة"
                    : "Clear programs, easy to compare"}
                </h3>
                <p>
                  {isArabic
                    ? "استعرض تفاصيل البرنامج والسعر والمدة قبل اتخاذ القرار."
                    : "Review program details, pricing, and duration before you decide."}
                </p>
              </div>
            </article>

            <article>
              <span><JourneyIcon /></span>
              <div>
                <h3>
                  {isArabic
                    ? "تفاصيل الرحلة في مكان واحد"
                    : "Your journey in one place"}
                </h3>
                <p>
                  {isArabic
                    ? "السكن والنقل والتأشيرة والخدمات المرتبطة برحلتك في واجهة واحدة."
                    : "Accommodation, transport, visa, and journey services in one interface."}
                </p>
              </div>
            </article>

            <article>
              <span><ShieldCheckIcon /></span>
              <div>
                <h3>
                  {isArabic
                    ? "تجربة أسرع وأكثر طمأنينة"
                    : "A faster, more reassuring experience"}
                </h3>
                <p>
                  {isArabic
                    ? "واجهة بسيطة ودفع آمن ومتابعة أوضح لخطوات الرحلة."
                    : "A simple interface, secure payments, and clearer journey tracking."}
                </p>
              </div>
            </article>
          </div>

          <div className="nr-showcase-bottom">
            <div className="nr-showcase-badge">
              <span className="nr-showcase-badge-dot" />
              <div>
                <small>
                  {isArabic ? "مصمم للمعتمر" : "Built for pilgrims"}
                </small>
                <strong>
                  {isArabic
                    ? "تجربة رقمية عربية وإنجليزية"
                    : "Arabic and English digital experience"}
                </strong>
              </div>
            </div>

            <a className="nr-showcase-cta" href="#contact">
              <span>
                {isArabic ? "ابدأ رحلتك" : "Start your journey"}
              </span>
              <ArrowIcon isArabic={isArabic} />
            </a>
          </div>
        </motion.div>
      </div>

      <style jsx global>{`
        .nr-showcase-premium {
          position: relative;
          overflow: hidden;
          padding: 96px 0 102px;
          background:
            radial-gradient(
              circle at 14% 18%,
              rgba(23, 111, 232, 0.1),
              transparent 24%
            ),
            radial-gradient(
              circle at 88% 82%,
              rgba(255, 195, 19, 0.1),
              transparent 23%
            ),
            linear-gradient(
              180deg,
              color-mix(in srgb, var(--nr-bg) 96%, #eef6ff),
              color-mix(in srgb, var(--nr-soft) 88%, #ffffff)
            );
          scroll-margin-top: 105px;
        }

        .nr-showcase-pattern {
          position: absolute;
          inset: 0;
          pointer-events: none;
          opacity: 0.22;
          background-image:
            radial-gradient(
              circle at center,
              rgba(23, 111, 232, 0.11) 1px,
              transparent 1.2px
            );
          background-size: 28px 28px;
          mask-image: linear-gradient(
            to bottom,
            transparent,
            #000 16%,
            #000 84%,
            transparent
          );
        }

        .nr-showcase-orb {
          position: absolute;
          width: 360px;
          height: 360px;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(26px);
        }

        .nr-showcase-orb-blue {
          inset-inline-start: -190px;
          top: -160px;
          background: rgba(23, 111, 232, 0.14);
        }

        .nr-showcase-orb-gold {
          inset-inline-end: -190px;
          bottom: -180px;
          background: rgba(255, 195, 19, 0.12);
        }

        .nr-showcase-premium-grid {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns: minmax(360px, 0.9fr) minmax(0, 1.1fr);
          align-items: center;
          gap: clamp(54px, 7vw, 100px);
        }

        .nr-showcase-device-stage {
          position: relative;
          min-height: 548px;
          display: grid;
          place-items: center;
          align-content: center;
          padding-inline: 70px;
        }

        .nr-showcase-device-glow {
          position: absolute;
          width: min(360px, 86%);
          aspect-ratio: 1;
          border-radius: 50%;
          background:
            radial-gradient(
              circle,
              rgba(23, 111, 232, 0.22),
              rgba(42, 169, 233, 0.09) 48%,
              transparent 72%
            );
          filter: blur(4px);
        }

        .nr-showcase-device-ring {
          position: absolute;
          width: min(360px, 84%);
          aspect-ratio: 1;
          border: 1px solid rgba(23, 111, 232, 0.14);
          border-radius: 50%;
          box-shadow:
            inset 0 0 0 18px rgba(23, 111, 232, 0.025),
            0 0 90px rgba(23, 111, 232, 0.06);
        }

        .NourApp-phone-frame {
          position: relative;
          z-index: 3;
          width: 244px;
          height: 494px;
          padding: 8px;
          border: 1px solid rgba(255, 255, 255, 0.55);
          border-radius: 43px;
          background:
            linear-gradient(145deg, #222a36, #06080c 60%, #171d28);
          box-shadow:
            0 36px 76px rgba(6, 18, 36, 0.25),
            0 12px 28px rgba(6, 18, 36, 0.2),
            inset 0 0 0 2px rgba(255, 255, 255, 0.09);
        }

        .NourApp-phone-frame::after {
          content: "";
          position: absolute;
          inset: 4px;
          pointer-events: none;
          border: 1px solid rgba(255, 255, 255, 0.06);
          border-radius: 39px;
        }

        .NourApp-phone-screen {
          position: relative;
          width: 100%;
          height: 100%;
          overflow: hidden;
          border-radius: 36px;
          background: #f7f9fc;
        }

        .NourApp-screen-slide {
          position: absolute;
          inset: 0;
        }

        .NourApp-screen-image {
          object-fit: contain;
          object-position: center top;
          background: #f7f9fc;
        }

        .NourApp-phone-island {
          position: absolute;
          z-index: 9;
          top: 10px;
          left: 50%;
          width: 76px;
          height: 23px;
          transform: translateX(-50%);
          border-radius: 999px;
          background: rgba(5, 7, 10, 0.96);
          box-shadow: inset 0 0 0 1px rgba(255, 255, 255, 0.04);
        }

        .NourApp-phone-home-line {
          position: absolute;
          z-index: 9;
          left: 50%;
          bottom: 9px;
          width: 92px;
          height: 4px;
          transform: translateX(-50%);
          border-radius: 999px;
          background: rgba(15, 24, 36, 0.76);
        }

        .NourApp-phone-side-button {
          position: absolute;
          width: 4px;
          border-radius: 4px;
          background: linear-gradient(180deg, #303845, #11151d);
        }

        .NourApp-phone-side-button-one {
          top: 112px;
          left: -4px;
          height: 34px;
        }

        .NourApp-phone-side-button-two {
          top: 162px;
          left: -4px;
          height: 62px;
        }

        .NourApp-phone-side-button-three {
          top: 132px;
          right: -4px;
          height: 78px;
        }

        .NourApp-screen-dots {
          position: relative;
          z-index: 5;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 7px;
          margin-top: 12px;
        }

        .NourApp-screen-dot {
          width: 8px;
          height: 8px;
          padding: 0;
          border: 0;
          border-radius: 999px;
          background: color-mix(in srgb, var(--nr-muted) 30%, transparent);
          cursor: pointer;
          transition:
            width 0.22s ease,
            background 0.22s ease,
            transform 0.22s ease;
        }

        .NourApp-screen-dot:hover {
          transform: scale(1.18);
        }

        .NourApp-screen-dot.is-active {
          width: 28px;
          background: linear-gradient(90deg, #176fe8, #ffc313);
        }

        .nr-showcase-device-caption {
          position: absolute;
          z-index: 5;
          inset-inline-end: 48px;
          bottom: 72px;
          min-width: 116px;
          display: grid;
          gap: 5px;
          padding: 12px 14px;
          border: 1px solid var(--nr-border);
          border-radius: 16px;
          background: color-mix(in srgb, var(--nr-card) 90%, transparent);
          box-shadow: 0 18px 42px rgba(15, 55, 108, 0.11);
          backdrop-filter: blur(16px);
        }

        .nr-showcase-device-caption span {
          color: var(--nr-muted);
          font-size: 9px;
          font-weight: 800;
        }

        .nr-showcase-device-caption strong {
          color: var(--nr-blue);
          font-size: 22px;
          line-height: 1;
        }

        .nr-showcase-device-caption strong small {
          color: var(--nr-muted);
          font-size: 10px;
          font-weight: 700;
        }

        .nr-showcase-copy-premium {
          max-width: 680px;
        }

        .nr-showcase-kicker {
          display: inline-flex;
          min-height: 36px;
          align-items: center;
          gap: 8px;
          padding-inline: 15px;
          border: 1px solid rgba(23, 111, 232, 0.15);
          border-radius: 999px;
          color: var(--nr-blue);
          background: color-mix(
            in srgb,
            var(--nr-card) 86%,
            rgba(23, 111, 232, 0.08)
          );
          font-size: 12px;
          font-weight: 900;
          box-shadow: 0 12px 28px rgba(23, 111, 232, 0.08);
        }

        .nr-showcase-kicker svg {
          width: 17px;
          height: 17px;
          color: var(--nr-gold);
        }

        .nr-showcase-copy-premium h2 {
          max-width: 660px;
          margin: 18px 0 15px;
          color: var(--nr-text);
          font-size: clamp(35px, 4vw, 52px);
          line-height: 1.14;
          letter-spacing: -0.025em;
          text-wrap: balance;
        }

        .nr-showcase-copy-premium > p {
          max-width: 620px;
          margin: 0;
          color: var(--nr-muted);
          font-size: 15px;
          line-height: 1.85;
        }

        .nr-showcase-features {
          display: grid;
          gap: 11px;
          margin-top: 28px;
        }

        .nr-showcase-features article {
          display: grid;
          grid-template-columns: 46px minmax(0, 1fr);
          gap: 13px;
          align-items: start;
          padding: 14px 15px;
          border: 1px solid var(--nr-border);
          border-radius: 17px;
          background: color-mix(in srgb, var(--nr-card) 78%, transparent);
          transition:
            transform 0.22s ease,
            border-color 0.22s ease,
            box-shadow 0.22s ease;
        }

        .nr-showcase-features article:hover {
          transform: translateY(-3px);
          border-color: rgba(23, 111, 232, 0.24);
          box-shadow: 0 14px 32px rgba(19, 72, 140, 0.08);
        }

        .nr-showcase-features article > span {
          width: 46px;
          height: 46px;
          display: grid;
          place-items: center;
          border-radius: 14px;
          color: var(--nr-blue);
          background: color-mix(in srgb, var(--nr-blue) 9%, var(--nr-card));
        }

        .nr-showcase-features article > span svg {
          width: 22px;
          height: 22px;
        }

        .nr-showcase-features h3 {
          margin: 1px 0 4px;
          color: var(--nr-text);
          font-size: 14px;
          line-height: 1.5;
        }

        .nr-showcase-features p {
          margin: 0;
          color: var(--nr-muted);
          font-size: 11px;
          line-height: 1.65;
        }

        .nr-showcase-bottom {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 18px;
          margin-top: 24px;
        }

        .nr-showcase-badge {
          display: flex;
          align-items: center;
          gap: 10px;
        }

        .nr-showcase-badge-dot {
          width: 11px;
          height: 11px;
          flex: 0 0 auto;
          border-radius: 50%;
          background: #26d795;
          box-shadow: 0 0 0 6px rgba(38, 215, 149, 0.1);
        }

        .nr-showcase-badge small,
        .nr-showcase-badge strong {
          display: block;
        }

        .nr-showcase-badge small {
          color: var(--nr-muted);
          font-size: 8px;
          font-weight: 800;
        }

        .nr-showcase-badge strong {
          margin-top: 2px;
          color: var(--nr-text);
          font-size: 11px;
        }

        .nr-showcase-cta {
          min-height: 46px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          padding-inline: 17px;
          border-radius: 14px;
          color: #102b4e;
          background: #ffc313;
          box-shadow: 0 14px 32px rgba(255, 195, 19, 0.22);
          font-size: 12px;
          font-weight: 900;
          white-space: nowrap;
          transition:
            transform 0.22s ease,
            box-shadow 0.22s ease;
        }

        .nr-showcase-cta:hover {
          transform: translateY(-2px);
          box-shadow: 0 18px 38px rgba(255, 195, 19, 0.3);
        }

        .nr-showcase-cta svg {
          width: 17px;
          height: 17px;
        }

        html[data-theme="dark"] .nr-showcase-premium {
          background:
            radial-gradient(
              circle at 14% 18%,
              rgba(23, 111, 232, 0.16),
              transparent 24%
            ),
            radial-gradient(
              circle at 88% 82%,
              rgba(255, 195, 19, 0.08),
              transparent 23%
            ),
            linear-gradient(180deg, #07182c, #0a213d);
        }

        html[data-theme="dark"] .nr-showcase-features article,
        html[data-theme="dark"] .nr-showcase-device-caption {
          background: rgba(255, 255, 255, 0.045);
          border-color: rgba(255, 255, 255, 0.09);
        }

        @media (max-width: 980px) {
          .nr-showcase-premium-grid {
            grid-template-columns: 1fr;
            gap: 44px;
          }

          .nr-showcase-copy-premium {
            max-width: 760px;
            margin-inline: auto;
            text-align: center;
          }

          .nr-showcase-copy-premium h2,
          .nr-showcase-copy-premium > p {
            margin-inline: auto;
          }

          .nr-showcase-features {
            max-width: 680px;
            margin-inline: auto;
            margin-top: 26px;
            text-align: start;
          }

          .nr-showcase-bottom {
            max-width: 680px;
            margin-inline: auto;
            margin-top: 24px;
          }

          .nr-showcase-device-stage {
            min-height: 520px;
            padding-inline: 52px;
          }
        }

        @media (max-width: 620px) {
          .nr-showcase-premium {
            padding: 68px 0 74px;
          }

          .nr-showcase-premium-grid {
            gap: 34px;
          }

          .nr-showcase-device-stage {
            min-height: 444px;
            padding-inline: 34px;
          }

          .NourApp-phone-frame {
            width: 214px;
            height: 434px;
            border-radius: 34px;
          }

          .NourApp-phone-frame::after {
            border-radius: 38px;
          }

          .NourApp-phone-screen {
            border-radius: 31px;
          }

          .NourApp-phone-island {
            width: 66px;
            height: 20px;
          }

          .nr-showcase-device-ring {
            width: min(330px, 92%);
          }

          .nr-showcase-device-glow {
            width: min(330px, 94%);
          }

          .nr-showcase-device-caption {
            inset-inline-end: 26px;
            bottom: 60px;
            min-width: 112px;
            padding: 10px 11px;
          }

          .nr-showcase-copy-premium h2 {
            font-size: clamp(31px, 9.2vw, 40px);
          }

          .nr-showcase-copy-premium > p {
            font-size: 14px;
          }

          .nr-showcase-features {
            gap: 9px;
          }

          .nr-showcase-features article {
            grid-template-columns: 42px minmax(0, 1fr);
            padding: 12px 13px;
          }

          .nr-showcase-features article > span {
            width: 42px;
            height: 42px;
          }

          .nr-showcase-bottom {
            align-items: stretch;
            flex-direction: column;
          }

          .nr-showcase-cta {
            width: 100%;
          }
        }

        @media (max-width: 420px) {
          .nr-showcase-device-stage {
            min-height: 410px;
            padding-inline: 18px;
          }

          .NourApp-phone-frame {
            width: 198px;
            height: 402px;
          }

          .nr-showcase-device-caption {
            display: none;
          }

          .nr-showcase-copy-premium h2 {
            font-size: clamp(29px, 8.8vw, 36px);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .nr-showcase-features article,
          .nr-showcase-cta,
          .NourApp-screen-dot {
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}

function PhoneSparkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      aria-hidden="true"
    >
      <rect x="6" y="2.5" width="12" height="19" rx="3" />
      <path d="M10 5h4M10 18.5h4" strokeLinecap="round" />
      <path d="m19 6 .7 1.8 1.8.7-1.8.7L19 11l-.7-1.8-1.8-.7 1.8-.7L19 6Z" />
    </svg>
  );
}

function PackageIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="M4 7.5 12 3l8 4.5-8 4.5-8-4.5Z" />
      <path d="m4 12 8 4.5 8-4.5M4 16.5 12 21l8-4.5" />
    </svg>
  );
}

function JourneyIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <circle cx="6" cy="17" r="2" />
      <circle cx="18" cy="7" r="2" />
      <path d="M8 17h2.5c4.8 0 6.5-2.3 6.5-6.3V9" strokeLinecap="round" />
    </svg>
  );
}

function ShieldCheckIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
      <path d="m12 3 7 3v5c0 4.7-2.8 8.2-7 10-4.2-1.8-7-5.3-7-10V6l7-3Z" />
      <path d="m9 12 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ArrowIcon({ isArabic }: { isArabic: boolean }) {
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