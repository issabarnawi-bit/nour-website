"use client";

import { motion, type Variants } from "framer-motion";
import type { HomeCopy } from "../../data/home";

type Props = {
  t: HomeCopy;
};

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 28,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.58,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function Goals({ t }: Props) {
  const isArabic = t.lang === "English";

  return (
    <section
      className="nr-goals-premium"
      id="goals"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <div className="nr-goals-pattern" aria-hidden="true" />
      <div className="nr-goals-glow nr-goals-glow-blue" aria-hidden="true" />
      <div className="nr-goals-glow nr-goals-glow-gold" aria-hidden="true" />

      <div className="nr-container nr-goals-inner">
        <motion.header
          className="nr-goals-heading"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{
            duration: 0.62,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <span className="nr-goals-kicker">
            <TargetIcon />
            {isArabic ? "رؤية نور" : "Nour vision"}
          </span>

          <h2 lang={isArabic ? "ar" : "en"}>
            {t.goalsTitle}
          </h2>

          <p>
            {isArabic
              ? "أهداف واضحة تقود تجربة نور نحو رحلة عمرة أكثر سهولة وراحة وثقة."
              : "Clear goals guiding Nour toward a simpler, more comfortable, and more trusted Umrah journey."}
          </p>
        </motion.header>

        <motion.div
          className="nr-goals-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.16 }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.12,
              },
            },
          }}
        >
          {t.goals.map(([title, text], index) => (
            <motion.article
              key={`${title}-${index}`}
              className="nr-goal-card"
              variants={cardVariants}
              whileHover={{
                y: -10,
                scale: 1.02,
              }}
            >
              <div className="nr-goal-card-top">
                <span className="nr-goal-number">
                  {String(index + 1).padStart(2, "0")}
                </span>

                <span className="nr-goal-icon">
                  {getGoalIcon(index)}
                </span>
              </div>

              <h3>{title}</h3>
              <p>{text}</p>

              <span className="nr-goal-line" aria-hidden="true" />
            </motion.article>
          ))}
        </motion.div>
      </div>

      <style jsx global>{`
        .nr-goals-premium {
          position: relative;
          overflow: hidden;
          padding: 100px 0;
          background:
            radial-gradient(
              circle at 8% 18%,
              rgba(23, 111, 232, 0.1),
              transparent 24%
            ),
            radial-gradient(
              circle at 92% 82%,
              rgba(255, 195, 19, 0.12),
              transparent 24%
            ),
            linear-gradient(
              180deg,
              color-mix(in srgb, var(--nr-soft) 88%, #ffffff),
              color-mix(in srgb, var(--nr-bg) 94%, #edf5ff)
            );
          scroll-margin-top: 105px;
        }

        .nr-goals-pattern {
          position: absolute;
          inset: 0;
          opacity: 0.3;
          pointer-events: none;
          background-image:
            linear-gradient(
              rgba(23, 111, 232, 0.045) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(23, 111, 232, 0.045) 1px,
              transparent 1px
            );
          background-size: 54px 54px;
          mask-image: linear-gradient(
            to bottom,
            transparent,
            #000 16%,
            #000 84%,
            transparent
          );
        }

        .nr-goals-glow {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(24px);
        }

        .nr-goals-glow-blue {
          width: 330px;
          height: 330px;
          top: -190px;
          inset-inline-start: -160px;
          background: rgba(23, 111, 232, 0.14);
        }

        .nr-goals-glow-gold {
          width: 330px;
          height: 330px;
          right: -170px;
          bottom: -190px;
          background: rgba(255, 195, 19, 0.15);
        }

        .nr-goals-inner {
          position: relative;
          z-index: 2;
        }

        .nr-goals-heading {
          max-width: 820px;
          margin: 0 auto 44px;
          text-align: center;
        }

        .nr-goals-kicker {
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
            rgba(23, 111, 232, 0.09)
          );
          box-shadow: 0 12px 28px rgba(23, 111, 232, 0.08);
          font-size: 12px;
          font-weight: 900;
          backdrop-filter: blur(12px);
        }

        .nr-goals-kicker svg {
          width: 17px;
          height: 17px;
          color: var(--nr-gold);
        }

        .nr-goals-heading h2 {
          margin: 18px 0 14px;
          color: var(--nr-text);
          font-size: clamp(38px, 4.6vw, 58px);
          line-height: 1.2;
          letter-spacing: -0.025em;
          text-wrap: balance;
        }

        .nr-goals-heading p {
          max-width: 700px;
          margin: 0 auto;
          color: var(--nr-muted);
          font-size: 15px;
          line-height: 1.85;
        }

        .nr-goals-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 18px;
        }

        .nr-goal-card {
          position: relative;
          min-height: 265px;
          overflow: hidden;
          padding: 25px;
          border: 1px solid var(--nr-border);
          border-radius: 25px;
          background:
            linear-gradient(
              145deg,
              color-mix(in srgb, var(--nr-card) 94%, transparent),
              color-mix(in srgb, var(--nr-card) 82%, transparent)
            );
          box-shadow:
            0 22px 54px rgba(18, 67, 130, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.46);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          transition:
            border-color 0.25s ease,
            box-shadow 0.25s ease;
        }

        .nr-goal-card::before {
          content: "";
          position: absolute;
          width: 170px;
          height: 170px;
          inset-inline-start: -100px;
          top: -110px;
          border-radius: 50%;
          background: rgba(255, 195, 19, 0.15);
          transition:
            transform 0.35s ease,
            opacity 0.35s ease;
        }

        .nr-goal-card:hover {
          border-color: rgba(255, 195, 19, 0.48);
          box-shadow:
            0 34px 76px rgba(18, 67, 130, 0.16),
            0 0 34px rgba(255, 195, 19, 0.09);
        }

        .nr-goal-card:hover::before {
          transform: scale(1.2);
        }

        .nr-goal-card-top {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 14px;
          margin-bottom: 34px;
        }

        .nr-goal-number {
          color: var(--nr-gold);
          font-size: 27px;
          font-weight: 900;
          letter-spacing: 0.04em;
        }

        .nr-goal-icon {
          width: 52px;
          height: 52px;
          display: grid;
          place-items: center;
          border: 1px solid rgba(23, 111, 232, 0.16);
          border-radius: 17px;
          color: var(--nr-blue);
          background: color-mix(
            in srgb,
            var(--nr-blue) 9%,
            var(--nr-card)
          );
          box-shadow: 0 14px 28px rgba(23, 111, 232, 0.1);
          transition:
            transform 0.3s ease,
            box-shadow 0.3s ease;
        }

        .nr-goal-card:hover .nr-goal-icon {
          transform: translateY(-4px) rotate(-4deg) scale(1.08);
          box-shadow: 0 18px 38px rgba(23, 111, 232, 0.18);
        }

        html[dir="ltr"] .nr-goal-card:hover .nr-goal-icon {
          transform: translateY(-4px) rotate(4deg) scale(1.08);
        }

        .nr-goal-icon svg {
          width: 25px;
          height: 25px;
        }

        .nr-goal-card h3 {
          position: relative;
          z-index: 2;
          margin: 0 0 10px;
          color: var(--nr-text);
          font-size: 20px;
          line-height: 1.45;
        }

        .nr-goal-card p {
          position: relative;
          z-index: 2;
          margin: 0;
          color: var(--nr-muted);
          font-size: 13px;
          line-height: 1.8;
        }

        .nr-goal-line {
          position: absolute;
          inset-inline-start: 25px;
          bottom: 22px;
          width: 42px;
          height: 3px;
          border-radius: 999px;
          background: var(--nr-gold);
          transition: width 0.25s ease;
        }

        .nr-goal-card:hover .nr-goal-line {
          width: 78px;
        }

        html[data-theme="dark"] .nr-goals-premium {
          background:
            radial-gradient(
              circle at 8% 18%,
              rgba(23, 111, 232, 0.15),
              transparent 24%
            ),
            radial-gradient(
              circle at 92% 82%,
              rgba(255, 195, 19, 0.09),
              transparent 24%
            ),
            linear-gradient(180deg, #081a30, #0a223d);
        }

        html[data-theme="dark"] .nr-goal-card {
          background:
            linear-gradient(
              145deg,
              rgba(255, 255, 255, 0.07),
              rgba(255, 255, 255, 0.035)
            );
          border-color: rgba(255, 255, 255, 0.1);
          box-shadow:
            0 22px 58px rgba(0, 0, 0, 0.22),
            inset 0 1px 0 rgba(255, 255, 255, 0.035);
        }

        @media (max-width: 1050px) {
          .nr-goals-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 620px) {
          .nr-goals-premium {
            padding: 76px 0;
          }

          .nr-goals-heading {
            margin-bottom: 32px;
          }

          .nr-goals-heading h2 {
            font-size: clamp(34px, 10vw, 43px);
          }

          .nr-goals-heading p {
            font-size: 14px;
          }

          .nr-goals-grid {
            grid-template-columns: 1fr;
            gap: 14px;
          }

          .nr-goal-card {
            min-height: 235px;
            padding: 22px;
          }

          .nr-goal-card-top {
            margin-bottom: 26px;
          }

          .nr-goal-line {
            inset-inline-start: 22px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .nr-goal-card,
          .nr-goal-icon,
          .nr-goal-line,
          .nr-goal-card::before {
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}

function getGoalIcon(index: number) {
  const icons = [
    <CompassIcon key="compass" />,
    <HeartIcon key="heart" />,
    <SparkIcon key="spark" />,
    <ShieldIcon key="shield" />,
  ];

  return icons[index % icons.length];
}

function TargetIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <circle cx="12" cy="12" r="8" />
      <circle cx="12" cy="12" r="3" />
      <path d="m15 9 5-5M17 4h3v3" />
    </svg>
  );
}

function CompassIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="m15.5 8.5-2.2 4.8-4.8 2.2 2.2-4.8 4.8-2.2Z" />
    </svg>
  );
}

function HeartIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
    >
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8L12 21l8.8-8.6a5.5 5.5 0 0 0 0-7.8Z" />
    </svg>
  );
}

function SparkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
    >
      <path d="m12 3 1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Z" />
      <path d="m5 16 .7 1.8 1.8.7-1.8.7L5 21l-.7-1.8-1.8-.7 1.8-.7L5 16Z" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
    >
      <path d="m12 3 7 3v5c0 4.7-2.8 8.2-7 10-4.2-1.8-7-5.3-7-10V6l7-3Z" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  );
}