"use client";

import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import type { MouseEvent, ReactNode } from "react";
import type { Language } from "../../data/home";

type Props = {
  language: Language;
};

type Reason = {
  id: string;
  titleAr: string;
  titleEn: string;
  descriptionAr: string;
  descriptionEn: string;
  icon: ReactNode;
  accent: "blue" | "gold" | "cyan" | "green" | "violet" | "rose";
};

const cardVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 34,
    scale: 0.96,
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.62,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function WhyNour({ language }: Props) {
  const isArabic = language === "ar";
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, {
    stiffness: 85,
    damping: 24,
  });

  const smoothY = useSpring(mouseY, {
    stiffness: 85,
    damping: 24,
  });

  const glowX = useTransform(smoothX, [-1, 1], [-35, 35]);
  const glowY = useTransform(smoothY, [-1, 1], [-24, 24]);

  const handleMouseMove = (event: MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set(((event.clientX - rect.left) / rect.width) * 2 - 1);
    mouseY.set(((event.clientY - rect.top) / rect.height) * 2 - 1);
  };

  const reasons: Reason[] = [
    {
      id: "trust",
      titleAr: "موثوقية في كل خطوة",
      titleEn: "Trust at every step",
      descriptionAr:
        "تجربة واضحة وآمنة تساعدك على اتخاذ القرار ومتابعة تفاصيل رحلتك بثقة.",
      descriptionEn:
        "A clear and secure experience that helps you make decisions and follow every journey detail with confidence.",
      icon: <ShieldIcon />,
      accent: "blue",
    },
    {
      id: "speed",
      titleAr: "تجربة أسرع وأسهل",
      titleEn: "Faster and easier",
      descriptionAr:
        "استعرض الخدمات والبرامج وانتقل بين خطوات الرحلة من مكان واحد دون تعقيد.",
      descriptionEn:
        "Explore services and programs, then move through your journey from one simple place.",
      icon: <BoltIcon />,
      accent: "gold",
    },
    {
      id: "payments",
      titleAr: "دفع آمن ومرن",
      titleEn: "Secure flexible payments",
      descriptionAr:
        "وسائل دفع متعددة وتجربة تحفظ خصوصيتك وتمنحك وضوحًا أكبر قبل إتمام الطلب.",
      descriptionEn:
        "Multiple payment options with a privacy-focused experience and clear order details.",
      icon: <WalletIcon />,
      accent: "cyan",
    },
    {
      id: "support",
      titleAr: "دعم متواصل",
      titleEn: "Continuous support",
      descriptionAr:
        "مساندة قبل الرحلة وأثناءها للإجابة عن الاستفسارات ومتابعة الاحتياجات.",
      descriptionEn:
        "Support before and during the journey to answer questions and follow your needs.",
      icon: <HeadsetIcon />,
      accent: "green",
    },
    {
      id: "digital",
      titleAr: "تجربة رقمية متكاملة",
      titleEn: "Integrated digital journey",
      descriptionAr:
        "كل ما تحتاجه للعمرة في واجهة حديثة تجمع المعلومات والخدمات والمتابعة.",
      descriptionEn:
        "Everything needed for Umrah in a modern experience combining information, services, and tracking.",
      icon: <PhoneIcon />,
      accent: "violet",
    },
    {
      id: "network",
      titleAr: "شبكة خدمات قابلة للتوسع",
      titleEn: "A growing service network",
      descriptionAr:
        "منصة مصممة لدعم خدمات متعددة وشركاء أكثر مع توسع نور مستقبلًا.",
      descriptionEn:
        "A platform designed to support more services and partners as Nour continues to grow.",
      icon: <GlobeIcon />,
      accent: "rose",
    },
  ];

  return (
    <section
      className="nr-why-premium"
      id="why-nour"
      dir={isArabic ? "rtl" : "ltr"}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        mouseX.set(0);
        mouseY.set(0);
      }}
    >
      <div className="nr-why-grid-pattern" aria-hidden="true" />

      <motion.div
        className="nr-why-glow nr-why-glow-blue"
        style={{ x: glowX, y: glowY }}
        aria-hidden="true"
      />

      <motion.div
        className="nr-why-glow nr-why-glow-gold"
        style={{ x: glowX, y: glowY }}
        aria-hidden="true"
      />

      <div className="nr-container nr-why-inner">
        <motion.header
          className="nr-why-heading"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.35 }}
          transition={{
            duration: 0.65,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <span className="nr-why-kicker">
            <SparkleIcon />
            {isArabic ? "لماذا نور" : "Why Nour"}
          </span>

          <h2
            lang={isArabic ? "ar" : "en"}
            dir={isArabic ? "rtl" : "ltr"}
          >
            {isArabic
              ? "لماذا يختار العملاء نور لرحلة عمرة أكثر سهولة؟"
              : "Why do customers choose Nour for a smoother Umrah journey?"}
          </h2>

          <p
            lang={isArabic ? "ar" : "en"}
            dir={isArabic ? "rtl" : "ltr"}
          >
            {isArabic
              ? "نجمع بين التقنية، الوضوح، والدعم لنقدم تجربة تساعد العميل على فهم الخيارات واتخاذ الخطوة التالية بثقة."
              : "We combine technology, clarity, and support to help customers understand their options and move forward with confidence."}
          </p>
        </motion.header>

        <motion.div
          className="nr-why-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.12 }}
          variants={{
            hidden: {},
            visible: {
              transition: {
                staggerChildren: 0.11,
              },
            },
          }}
        >
          {reasons.map((reason, index) => (
            <motion.article
              key={reason.id}
              className={`nr-why-card nr-why-card-${reason.accent}`}
              variants={cardVariants}
              whileHover={{
                y: -12,
                scale: 1.025,
              }}
            >
              <div className="nr-why-card-top">
                <span className="nr-why-icon">{reason.icon}</span>
                <span className="nr-why-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <h3>
                {isArabic ? reason.titleAr : reason.titleEn}
              </h3>

              <p>
                {isArabic
                  ? reason.descriptionAr
                  : reason.descriptionEn}
              </p>

              <span className="nr-why-line" aria-hidden="true" />
            </motion.article>
          ))}
        </motion.div>
      </div>

      <style jsx global>{`
        .nr-why-heading {
          text-align: center;
        }

        .nr-why-premium[dir="ltr"] .nr-why-heading h2,
        .nr-why-premium[dir="ltr"] .nr-why-heading p,
        .nr-why-premium[dir="ltr"] .nr-why-kicker {
          direction: ltr;
          unicode-bidi: isolate;
        }

        .nr-why-premium[dir="rtl"] .nr-why-heading h2,
        .nr-why-premium[dir="rtl"] .nr-why-heading p,
        .nr-why-premium[dir="rtl"] .nr-why-kicker {
          direction: rtl;
          unicode-bidi: isolate;
        }
        .nr-why-premium {
          position: relative;
          overflow: hidden;
          padding: 108px 0;
          background:
            radial-gradient(
              circle at 10% 14%,
              rgba(23, 111, 232, 0.1),
              transparent 24%
            ),
            radial-gradient(
              circle at 90% 85%,
              rgba(255, 195, 19, 0.11),
              transparent 24%
            ),
            linear-gradient(
              180deg,
              color-mix(in srgb, var(--nr-bg) 90%, #eef6ff),
              var(--nr-soft)
            );
          scroll-margin-top: 105px;
        }

        .nr-why-grid-pattern {
          position: absolute;
          inset: 0;
          opacity: 0.34;
          pointer-events: none;
          background-image:
            linear-gradient(
              rgba(23, 111, 232, 0.05) 1px,
              transparent 1px
            ),
            linear-gradient(
              90deg,
              rgba(23, 111, 232, 0.05) 1px,
              transparent 1px
            );
          background-size: 52px 52px;
          mask-image: linear-gradient(
            to bottom,
            transparent,
            #000 18%,
            #000 82%,
            transparent
          );
        }

        .nr-why-glow {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(16px);
        }

        .nr-why-glow-blue {
          width: 360px;
          height: 360px;
          top: -190px;
          inset-inline-start: -170px;
          background: rgba(23, 111, 232, 0.14);
        }

        .nr-why-glow-gold {
          width: 330px;
          height: 330px;
          right: -170px;
          bottom: -185px;
          background: rgba(255, 195, 19, 0.15);
        }

        .nr-why-inner {
          position: relative;
          z-index: 2;
        }

        .nr-why-heading {
          max-width: 850px;
          margin: 0 auto 48px;
          text-align: center;
        }

        .nr-why-kicker {
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
            var(--nr-card) 84%,
            rgba(23, 111, 232, 0.1)
          );
          box-shadow: 0 12px 28px rgba(23, 111, 232, 0.08);
          font-size: 12px;
          font-weight: 900;
          backdrop-filter: blur(12px);
        }

        .nr-why-kicker svg {
          width: 17px;
          height: 17px;
          color: var(--nr-gold);
        }

        .nr-why-heading h2 {
          margin: 18px 0 15px;
          color: var(--nr-text);
          font-size: clamp(36px, 4.5vw, 58px);
          line-height: 1.22;
          letter-spacing: -0.025em;
          text-wrap: balance;
          unicode-bidi: plaintext;
        }

        .nr-why-heading p {
          max-width: 760px;
          margin: 0 auto;
          color: var(--nr-muted);
          font-size: 16px;
          line-height: 1.9;
        }

        .nr-why-grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 20px;
        }

        .nr-why-card {
          position: relative;
          min-height: 280px;
          overflow: hidden;
          padding: 27px;
          border: 1px solid var(--nr-border);
          border-radius: 26px;
          background:
            linear-gradient(
              145deg,
              color-mix(in srgb, var(--nr-card) 92%, transparent),
              color-mix(in srgb, var(--nr-card) 78%, transparent)
            );
          box-shadow:
            0 22px 58px rgba(18, 67, 130, 0.08),
            inset 0 1px 0 rgba(255, 255, 255, 0.42);
          backdrop-filter: blur(18px);
          -webkit-backdrop-filter: blur(18px);
          transition:
            border-color 0.25s ease,
            box-shadow 0.25s ease;
        }

        .nr-why-card::before {
          content: "";
          position: absolute;
          width: 170px;
          height: 170px;
          inset-inline-end: -90px;
          bottom: -110px;
          border-radius: 50%;
          opacity: 0.13;
          background: currentColor;
          transition:
            transform 0.35s ease,
            opacity 0.35s ease;
        }

        .nr-why-card:hover {
          border-color: color-mix(
            in srgb,
            currentColor 30%,
            var(--nr-border)
          );
          box-shadow:
            0 32px 78px rgba(18, 67, 130, 0.16),
            0 0 35px color-mix(
              in srgb,
              currentColor 10%,
              transparent
            );
        }

        .nr-why-card:hover::before {
          transform: scale(1.18);
          opacity: 0.2;
        }

        .nr-why-card-blue {
          color: #176fe8;
        }

        .nr-why-card-gold {
          color: #d89e00;
        }

        .nr-why-card-cyan {
          color: #00a9c8;
        }

        .nr-why-card-green {
          color: #12a56d;
        }

        .nr-why-card-violet {
          color: #7757d9;
        }

        .nr-why-card-rose {
          color: #e6537a;
        }

        .nr-why-card-top {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 15px;
          margin-bottom: 26px;
        }

        .nr-why-icon {
          width: 58px;
          height: 58px;
          display: grid;
          place-items: center;
          border: 1px solid
            color-mix(in srgb, currentColor 18%, transparent);
          border-radius: 18px;
          color: currentColor;
          background: color-mix(
            in srgb,
            currentColor 10%,
            var(--nr-card)
          );
          box-shadow: 0 14px 30px
            color-mix(in srgb, currentColor 12%, transparent);
          transition:
            transform 0.3s ease,
            box-shadow 0.3s ease;
        }

        .nr-why-card:hover .nr-why-icon {
          transform: translateY(-4px) rotate(-4deg) scale(1.08);
          box-shadow: 0 18px 38px
            color-mix(in srgb, currentColor 18%, transparent);
        }

        html[dir="ltr"] .nr-why-card:hover .nr-why-icon {
          transform: translateY(-4px) rotate(4deg) scale(1.08);
        }

        .nr-why-icon svg {
          width: 28px;
          height: 28px;
        }

        .nr-why-number {
          color: color-mix(
            in srgb,
            var(--nr-muted) 32%,
            transparent
          );
          font-size: 28px;
          font-weight: 900;
          letter-spacing: 0.04em;
        }

        .nr-why-card h3 {
          position: relative;
          z-index: 2;
          margin: 0 0 10px;
          color: var(--nr-text);
          font-size: 21px;
          line-height: 1.45;
        }

        .nr-why-card p {
          position: relative;
          z-index: 2;
          margin: 0;
          color: var(--nr-muted);
          font-size: 13px;
          line-height: 1.85;
        }

        .nr-why-line {
          position: absolute;
          inset-inline-start: 27px;
          bottom: 23px;
          z-index: 2;
          width: 42px;
          height: 3px;
          border-radius: 999px;
          background: currentColor;
          transition: width 0.25s ease;
        }

        .nr-why-card:hover .nr-why-line {
          width: 80px;
        }

        html[data-theme="dark"] .nr-why-premium {
          background:
            radial-gradient(
              circle at 10% 14%,
              rgba(23, 111, 232, 0.16),
              transparent 24%
            ),
            radial-gradient(
              circle at 90% 85%,
              rgba(255, 195, 19, 0.1),
              transparent 24%
            ),
            linear-gradient(180deg, #07182c, #0a213d);
        }

        html[data-theme="dark"] .nr-why-card {
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

        @media (max-width: 980px) {
          .nr-why-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
          }
        }

        @media (max-width: 620px) {
          .nr-why-premium {
            padding: 76px 0;
          }

          .nr-why-heading {
            margin-bottom: 32px;
          }

          .nr-why-heading h2 {
            font-size: clamp(34px, 10vw, 43px);
          }

          .nr-why-heading p {
            font-size: 14px;
          }

          .nr-why-grid {
            grid-template-columns: 1fr;
            gap: 14px;
          }

          .nr-why-card {
            min-height: 245px;
            padding: 23px;
          }

          .nr-why-line {
            inset-inline-start: 23px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .nr-why-card,
          .nr-why-icon,
          .nr-why-line,
          .nr-why-card::before {
            transition: none !important;
          }
        }
      `}</style>
    </section>
  );
}

function SparkleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
    >
      <path d="m12 3 1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3Z" />
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

function BoltIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
    >
      <path d="m13 2-8 12h7l-1 8 8-12h-7l1-8Z" />
    </svg>
  );
}

function WalletIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
    >
      <path d="M4 6.5A2.5 2.5 0 0 1 6.5 4H19v16H6.5A2.5 2.5 0 0 1 4 17.5v-11Z" />
      <path d="M4 8h15M15 12h6v4h-6a2 2 0 0 1 0-4Z" />
    </svg>
  );
}

function HeadsetIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
    >
      <path d="M4 13v-2a8 8 0 0 1 16 0v2" />
      <path d="M4 13a2 2 0 0 0 2 2h1V9H6a2 2 0 0 0-2 2v2ZM20 13a2 2 0 0 1-2 2h-1V9h1a2 2 0 0 1 2 2v2Z" />
      <path d="M17 17c-.7 2-2.3 3-5 3" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
    >
      <rect x="7" y="2.5" width="10" height="19" rx="2.5" />
      <path d="M10 6h4M11 18h2" />
    </svg>
  );
}

function GlobeIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3c2.2 2.5 3.3 5.5 3.3 9S14.2 18.5 12 21M12 3C9.8 5.5 8.7 8.5 8.7 12S9.8 18.5 12 21" />
    </svg>
  );
}