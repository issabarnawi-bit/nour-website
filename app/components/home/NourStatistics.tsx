"use client";

import { useEffect, useRef, useState } from "react";
import { motion, useInView } from "framer-motion";
import { fadeUp, type Language } from "../../data/home";

type Statistic = {
  value: number;
  suffix: string;
  labelAr: string;
  labelEn: string;
  descriptionAr: string;
  descriptionEn: string;
};

const statistics: Statistic[] = [
  {
    value: 12000,
    suffix: "+",
    labelAr: "معتمر",
    labelEn: "Pilgrims",
    descriptionAr: "نطمح لخدمتهم عبر تجربة رقمية متكاملة",
    descriptionEn: "Our target through an integrated digital experience",
  },
  {
    value: 50,
    suffix: "+",
    labelAr: "شريك خدمة",
    labelEn: "Service partners",
    descriptionAr: "ضمن شبكة خدمات نور آب المتنامية",
    descriptionEn: "Across NourApp's growing service network",
  },
  {
    value: 18,
    suffix: "+",
    labelAr: "دولة مستهدفة",
    labelEn: "Target markets",
    descriptionAr: "لتسهيل رحلة المعتمر من مختلف الدول",
    descriptionEn: "Making Umrah easier for pilgrims worldwide",
  },
  {
    value: 24,
    suffix: "/7",
    labelAr: "دعم ومساندة",
    labelEn: "Support",
    descriptionAr: "مساندة مستمرة خلال مراحل الرحلة",
    descriptionEn: "Continuous assistance throughout the journey",
  },
];

function AnimatedNumber({
  value,
  start,
}: {
  value: number;
  start: boolean;
}) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!start) return;

    const duration = 1500;
    const startedAt = performance.now();
    let frameId = 0;

    const tick = (now: number) => {
      const progress = Math.min(
        (now - startedAt) / duration,
        1,
      );

      const eased =
        1 - Math.pow(1 - progress, 3);

      setDisplayValue(
        Math.round(value * eased),
      );

      if (progress < 1) {
        frameId =
          requestAnimationFrame(tick);
      }
    };

    frameId =
      requestAnimationFrame(tick);

    return () =>
      cancelAnimationFrame(frameId);
  }, [start, value]);

  return (
    <>
      {displayValue.toLocaleString("en-US")}
    </>
  );
}

export default function Statistics({
  language,
}: {
  language: Language;
}) {
  const sectionRef =
    useRef<HTMLElement | null>(null);

  const isInView = useInView(
    sectionRef,
    {
      once: true,
      amount: 0.35,
    },
  );

  return (
    <section
      className="nr-statistics nr-statistics-haram"
      aria-labelledby="nr-statistics-title"
      ref={sectionRef}
    >
      <div
        className="nr-statistics-haram-bg"
        aria-hidden="true"
      />

      <div
        className="nr-statistics-haram-overlay"
        aria-hidden="true"
      />

      <motion.div
        className="nr-statistics-haram-glow"
        aria-hidden="true"
        initial={{
          opacity: 0,
          scale: 1.06,
        }}
        whileInView={{
          opacity: 1,
          scale: 1,
        }}
        viewport={{
          once: true,
          amount: 0.2,
        }}
        transition={{
          duration: 1.4,
          ease: [0.22, 1, 0.36, 1],
        }}
      />


      <div
        className="nr-statistics-kaaba-marker"
        aria-hidden="true"
      >
        <span className="nr-statistics-kaaba-pulse" />
        <span className="nr-statistics-kaaba-dot" />
      </div>

      <div className="nr-container nr-statistics-content">
        <motion.div
          className="nr-statistics-heading"
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.3,
          }}
          variants={fadeUp}
        >
          <span className="nr-kicker nr-statistics-kicker">
            {language === "ar"
              ? "نور آب بالأرقام"
              : "NourApp in Numbers"}
          </span>

          <h2 id="nr-statistics-title">
            {language === "ar"
              ? "رؤية تنمو لخدمة ضيوف الرحمن"
              : "A growing vision to serve the Guests of Allah"}
          </h2>

          <p>
            {language === "ar"
              ? "مؤشرات مستهدفة تعكس طموح نور آب في بناء منظومة موثوقة ومتكاملة لخدمات العمرة."
              : "Target indicators reflecting NourApp's ambition to build a trusted, integrated Umrah services ecosystem."}
          </p>
        </motion.div>

        <div className="nr-statistics-grid">
          {statistics.map(
            (stat, index) => (
              <motion.article
                key={stat.labelEn}
                className="nr-statistic-card nr-statistic-card-glass"
                initial="hidden"
                whileInView="visible"
                viewport={{
                  once: true,
                  amount: 0.25,
                }}
                variants={{
                  hidden: {
                    opacity: 0,
                    y: 28,
                  },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      duration: 0.55,
                      delay:
                        index * 0.08,
                    },
                  },
                }}
              >
                <span
                  className="nr-statistic-index"
                  aria-hidden="true"
                >
                  {String(
                    index + 1,
                  ).padStart(2, "0")}
                </span>

                <strong
                  className="nr-statistic-value"
                  dir="ltr"
                >
                  <AnimatedNumber
                    value={stat.value}
                    start={isInView}
                  />
                  <span>
                    {stat.suffix}
                  </span>
                </strong>

                <h3>
                  {language === "ar"
                    ? stat.labelAr
                    : stat.labelEn}
                </h3>

                <p>
                  {language === "ar"
                    ? stat.descriptionAr
                    : stat.descriptionEn}
                </p>
              </motion.article>
            ),
          )}
        </div>
      </div>

      <style jsx global>{`
        .nr-statistics-haram {
          position: relative;
          isolation: isolate;
          overflow: hidden;
          padding-block: 104px 118px;
          background: #f5f8fd;
        }

        .nr-statistics-haram-bg {
          position: absolute;
          inset: 0;
          z-index: -4;
          background:
            url("/images/site/haram-statistics-bg.jpg")
            center 62% / 116% auto no-repeat;
          transform: scale(1.035);
          filter:
            saturate(1.04)
            contrast(1.03)
            brightness(0.98);
        }

        .nr-statistics-haram-overlay {
          position: absolute;
          inset: 0;
          z-index: -3;
          background:
            linear-gradient(
              90deg,
              rgba(245, 248, 253, 0.72)
                0%,
              rgba(255, 255, 255, 0.56)
                45%,
              rgba(255, 249, 231, 0.66)
                100%
            );
        }

        .nr-statistics-haram-glow {
          position: absolute;
          inset: 0;
          z-index: -2;
          pointer-events: none;
          background:
            radial-gradient(
              circle at 12% 18%,
              rgba(23, 111, 232, 0.08),
              transparent 32%
            ),
            radial-gradient(
              circle at 88% 70%,
              rgba(255, 195, 19, 0.1),
              transparent 30%
            ),
            radial-gradient(
              circle at 46% 78%,
              rgba(255, 195, 19, 0.18),
              rgba(255, 195, 19, 0.07) 13%,
              transparent 27%
            );
        }

        .nr-statistics-content {
          position: relative;
          z-index: 2;
        }

        .nr-statistics-kaaba-marker {
          position: absolute;
          z-index: 1;
          left: 46%;
          top: 78%;
          width: 18px;
          height: 18px;
          transform: translate(-50%, -50%);
          pointer-events: none;
        }

        .nr-statistics-kaaba-dot {
          position: absolute;
          inset: 3px;
          border-radius: 4px;
          background: #ffc313;
          box-shadow:
            0 0 0 4px rgba(255, 195, 19, 0.16),
            0 0 24px rgba(255, 195, 19, 0.55);
        }

        .nr-statistics-kaaba-pulse {
          position: absolute;
          inset: -9px;
          border: 1px solid rgba(255, 195, 19, 0.62);
          border-radius: 50%;
          animation: nr-statistics-kaaba-pulse 2.2s ease-out infinite;
        }

        @keyframes nr-statistics-kaaba-pulse {
          0% {
            transform: scale(0.55);
            opacity: 0.9;
          }

          100% {
            transform: scale(1.75);
            opacity: 0;
          }
        }


        .nr-statistics-haram
          .nr-statistics-heading h2 {
          color: #15233b;
        }

        .nr-statistics-haram
          .nr-statistics-heading p {
          color: #6d7b91;
        }

        .nr-statistic-card-glass {
          border: 1px solid
            rgba(255, 255, 255, 0.72);
          background:
            linear-gradient(
              145deg,
              rgba(255, 255, 255, 0.74),
              rgba(255, 255, 255, 0.52)
            );
          box-shadow:
            0 20px 45px
              rgba(15, 23, 42, 0.1),
            inset 0 1px 0
              rgba(
                255,
                255,
                255,
                0.78
              );
          backdrop-filter: blur(15px);
          -webkit-backdrop-filter:
            blur(15px);
        }

        .nr-statistic-card-glass:hover {
          border-color:
            rgba(
              23,
              111,
              232,
              0.24
            );
          box-shadow:
            0 26px 54px
              rgba(
                15,
                23,
                42,
                0.13
              ),
            0 0 36px
              rgba(
                255,
                195,
                19,
                0.08
              );
        }

        html[data-theme="dark"]
          .nr-statistics-haram,
        html.dark
          .nr-statistics-haram,
        body.dark
          .nr-statistics-haram {
          background: #07182d;
        }

        html[data-theme="dark"]
          .nr-statistics-haram-overlay,
        html.dark
          .nr-statistics-haram-overlay,
        body.dark
          .nr-statistics-haram-overlay {
          background:
            linear-gradient(
              90deg,
              rgba(
                  7,
                  24,
                  45,
                  0.82
                )
                0%,
              rgba(
                  9,
                  39,
                  72,
                  0.68
                )
                48%,
              rgba(
                  7,
                  24,
                  45,
                  0.80
                )
                100%
            );
        }

        html[data-theme="dark"]
          .nr-statistics-haram
          .nr-statistics-heading
          h2,
        html.dark
          .nr-statistics-haram
          .nr-statistics-heading
          h2,
        body.dark
          .nr-statistics-haram
          .nr-statistics-heading
          h2 {
          color: #f1f5f9;
        }

        html[data-theme="dark"]
          .nr-statistics-haram
          .nr-statistics-heading
          p,
        html.dark
          .nr-statistics-haram
          .nr-statistics-heading
          p,
        body.dark
          .nr-statistics-haram
          .nr-statistics-heading
          p {
          color: #a9b6c9;
        }

        html[data-theme="dark"]
          .nr-statistic-card-glass,
        html.dark
          .nr-statistic-card-glass,
        body.dark
          .nr-statistic-card-glass {
          border-color:
            rgba(
              255,
              255,
              255,
              0.11
            );
          background:
            linear-gradient(
              145deg,
              rgba(
                  17,
                  40,
                  70,
                  0.78
                ),
              rgba(
                  10,
                  34,
                  62,
                  0.66
                )
            );
          box-shadow:
            0 20px 50px
              rgba(0, 0, 0, 0.24),
            inset 0 1px 0
              rgba(
                255,
                255,
                255,
                0.05
              );
        }

        html[data-theme="dark"]
          .nr-statistic-card-glass
          h3,
        html.dark
          .nr-statistic-card-glass
          h3,
        body.dark
          .nr-statistic-card-glass
          h3 {
          color: #f1f5f9;
        }

        html[data-theme="dark"]
          .nr-statistic-card-glass
          p,
        html.dark
          .nr-statistic-card-glass
          p,
        body.dark
          .nr-statistic-card-glass
          p {
          color: #9fb0c5;
        }

        @media (max-width: 768px) {
          .nr-statistics-haram {
            padding-block: 72px 86px;
          }

          .nr-statistics-haram-bg {
            background-position:
              center 64%;
            background-size:
              150% auto;
          }

          .nr-statistics-kaaba-marker {
            left: 48%;
            top: 80%;
            transform:
              translate(-50%, -50%)
              scale(0.82);
          }

          .nr-statistics-haram-overlay {
            background:
              linear-gradient(
                180deg,
                rgba(
                    245,
                    248,
                    253,
                    0.78
                  )
                  0%,
                rgba(
                    255,
                    255,
                    255,
                    0.62
                  )
                  48%,
                rgba(
                    255,
                    249,
                    231,
                    0.72
                  )
                  100%
              );
          }

          html[data-theme="dark"]
            .nr-statistics-haram-overlay,
          html.dark
            .nr-statistics-haram-overlay,
          body.dark
            .nr-statistics-haram-overlay {
            background:
              linear-gradient(
                180deg,
                rgba(
                    7,
                    24,
                    45,
                    0.84
                  )
                  0%,
                rgba(
                    9,
                    39,
                    72,
                    0.72
                  )
                  50%,
                rgba(
                    7,
                    24,
                    45,
                    0.82
                  )
                  100%
              );
          }
        }
          .nr-statistics-haram {
  padding-block: 52px 60px;
}

.nr-statistics-haram .nr-statistics-heading {
  max-width: 94%;
  margin-inline: auto;
  margin-bottom: 26px;
  text-align: center;
}

.nr-statistics-haram .nr-statistics-heading h2 {
  font-size: clamp(28px, 8vw, 38px);
  line-height: 1.2;
}

.nr-statistics-haram .nr-statistics-grid {
  grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
  gap: 10px !important;
}

.nr-statistics-haram .nr-statistic-card {
  min-height: 175px !important;
  padding: 18px 14px !important;
  border-radius: 18px !important;
}

.nr-statistics-haram .nr-statistic-value {
  margin-top: 22px !important;
  font-size: clamp(34px, 9vw, 46px) !important;
  line-height: 1 !important;
}

.nr-statistics-haram .nr-statistic-card h3 {
  margin-top: 20px !important;
  font-size: 14px !important;
}

.nr-statistics-haram .nr-statistic-card p {
  margin-top: 6px !important;
  font-size: 9px !important;
  line-height: 1.5 !important;
}

        @media (
          prefers-reduced-motion: reduce
        ) {
          .nr-statistics-haram-glow {
            transform: none !important;
          }

          .nr-statistics-kaaba-pulse {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}