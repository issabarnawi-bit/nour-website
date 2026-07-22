"use client";

import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import type { MouseEvent } from "react";
import type { HomeCopy } from "../../data/home";

type Props = {
  t: HomeCopy;
};

const copyVariants: Variants = {
  hidden: {
    opacity: 0,
    y: 28,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.68,
      ease: [0.22, 1, 0.36, 1],
    },
  },
};

export default function About({ t }: Props) {
  const isArabic = t.lang === "English";

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const smoothX = useSpring(mouseX, {
    stiffness: 80,
    damping: 24,
  });

  const smoothY = useSpring(mouseY, {
    stiffness: 80,
    damping: 24,
  });

  const phoneX = useTransform(smoothX, [-1, 1], [-12, 12]);
  const phoneY = useTransform(smoothY, [-1, 1], [-9, 9]);
  const glowX = useTransform(smoothX, [-1, 1], [-22, 22]);
  const glowY = useTransform(smoothY, [-1, 1], [-18, 18]);

  const handleMouseMove = (event: MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();

    mouseX.set(
      ((event.clientX - rect.left) / rect.width) * 2 - 1,
    );
    mouseY.set(
      ((event.clientY - rect.top) / rect.height) * 2 - 1,
    );
  };

  return (
    <section
      className="nr-about-premium"
      id="about"
      dir={isArabic ? "rtl" : "ltr"}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        mouseX.set(0);
        mouseY.set(0);
      }}
    >
      <div className="nr-about-pattern" aria-hidden="true" />

      <motion.div
        className="nr-about-glow nr-about-glow-blue"
        style={{ x: glowX, y: glowY }}
        aria-hidden="true"
      />

      <motion.div
        className="nr-about-glow nr-about-glow-gold"
        style={{ x: glowX, y: glowY }}
        aria-hidden="true"
      />

      <div className="nr-container nr-about-premium-grid">
        <motion.div
          className="nr-about-premium-copy"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.25 }}
          variants={copyVariants}
        >
          <span className="nr-about-kicker">
            <SparkleIcon />
            {t.aboutLabel}
          </span>

          <h2 lang={isArabic ? "ar" : "en"}>
            {t.aboutTitle}
          </h2>

          <p>{t.aboutText}</p>

          <div className="nr-about-highlights">
            <div>
              <span className="nr-about-highlight-icon">
                <PhoneIcon />
              </span>

              <div>
                <strong>
                  {isArabic
                    ? "تجربة رقمية متكاملة"
                    : "Integrated digital experience"}
                </strong>

                <small>
                  {isArabic
                    ? "واجهة واحدة تجمع الخدمات والمتابعة."
                    : "One interface for services and journey tracking."}
                </small>
              </div>
            </div>

            <div>
              <span className="nr-about-highlight-icon">
                <ShieldIcon />
              </span>

              <div>
                <strong>
                  {isArabic
                    ? "وضوح وثقة"
                    : "Clarity and trust"}
                </strong>

                <small>
                  {isArabic
                    ? "معلومات مرتبة وخيارات سهلة الفهم."
                    : "Clear information and easy-to-understand options."}
                </small>
              </div>
            </div>
          </div>

          <a className="nr-about-link" href="#features">
            <span>
              {isArabic
                ? "اكتشف خدمات نور"
                : "Discover Nour services"}
            </span>

            <ArrowIcon isArabic={isArabic} />
          </a>
        </motion.div>

        <motion.div
          className="nr-about-premium-visual"
          initial={{
            opacity: 0,
            scale: 0.94,
            x: isArabic ? -55 : 55,
          }}
          whileInView={{
            opacity: 1,
            scale: 1,
            x: 0,
          }}
          viewport={{ once: true, amount: 0.2 }}
          transition={{
            duration: 0.82,
            ease: [0.22, 1, 0.36, 1],
          }}
        >
          <motion.div
            className="nr-about-device-glow"
            style={{ x: glowX, y: glowY }}
            aria-hidden="true"
          />

          <motion.div
            className="nr-about-phone-wrap"
            style={{ x: phoneX, y: phoneY }}
            animate={{
              y: [0, -14, 0],
              rotate: [-2.5, 1.5, -2.5],
            }}
            transition={{
              duration: 6.5,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <Image
              src="/images/site/rotated-left.png"
              alt={
                isArabic
                  ? "واجهة برامج نور"
                  : "Nour programs screen"
              }
              width={650}
              height={650}
              className="nr-about-phone"
            />
          </motion.div>

          <motion.div
            className="nr-about-mini-card nr-about-mini-card-top"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              delay: 0.35,
            }}
          >
            <span className="nr-about-mini-icon">
              <CheckIcon />
            </span>

            <div>
              <strong>
                {isArabic
                  ? "رحلة منظمة"
                  : "Organized journey"}
              </strong>

              <small>
                {isArabic
                  ? "كل التفاصيل في مكان واحد"
                  : "All details in one place"}
              </small>
            </div>
          </motion.div>

          <motion.div
            className="nr-about-mini-card nr-about-mini-card-bottom"
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{
              duration: 0.5,
              delay: 0.52,
            }}
          >
            <span className="nr-about-mini-icon nr-about-mini-icon-gold">
              <StarIcon />
            </span>

            <div>
              <strong>
                {isArabic
                  ? "تجربة أكثر راحة"
                  : "A smoother experience"}
              </strong>

              <small>
                {isArabic
                  ? "تصميم واضح وسهل الاستخدام"
                  : "Clear and easy to use"}
              </small>
            </div>
          </motion.div>
        </motion.div>
      </div>

      <style jsx global>{`
        .nr-about-premium {
          position: relative;
          overflow: hidden;
          padding: 104px 0;
          background:
            radial-gradient(
              circle at 12% 16%,
              rgba(23, 111, 232, 0.11),
              transparent 25%
            ),
            radial-gradient(
              circle at 88% 84%,
              rgba(255, 195, 19, 0.12),
              transparent 24%
            ),
            linear-gradient(
              180deg,
              color-mix(
                in srgb,
                var(--nr-bg) 94%,
                #eef6ff
              ),
              var(--nr-soft)
            );
          scroll-margin-top: 105px;
        }

        .nr-about-pattern {
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
            #000 18%,
            #000 82%,
            transparent
          );
        }

        .nr-about-glow {
          position: absolute;
          border-radius: 50%;
          pointer-events: none;
          filter: blur(20px);
        }

        .nr-about-glow-blue {
          width: 360px;
          height: 360px;
          top: -190px;
          inset-inline-start: -170px;
          background: rgba(23, 111, 232, 0.14);
        }

        .nr-about-glow-gold {
          width: 330px;
          height: 330px;
          right: -170px;
          bottom: -190px;
          background: rgba(255, 195, 19, 0.15);
        }

        .nr-about-premium-grid {
          position: relative;
          z-index: 2;
          display: grid;
          grid-template-columns:
            minmax(0, 1fr)
            minmax(420px, 0.9fr);
          align-items: center;
          gap: 58px;
        }

        .nr-about-premium-copy {
          position: relative;
          z-index: 5;
          max-width: 650px;
        }

        .nr-about-kicker {
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
          box-shadow: 0 12px 28px rgba(23, 111, 232, 0.08);
          font-size: 12px;
          font-weight: 900;
          backdrop-filter: blur(12px);
        }

        .nr-about-kicker svg {
          width: 17px;
          height: 17px;
          color: var(--nr-gold);
        }

        .nr-about-premium-copy h2 {
          margin: 19px 0 17px;
          color: var(--nr-text);
          font-size: clamp(38px, 4.8vw, 61px);
          line-height: 1.18;
          letter-spacing: -0.025em;
          text-wrap: balance;
        }

        .nr-about-premium-copy > p {
          margin: 0;
          color: var(--nr-muted);
          font-size: 16px;
          line-height: 1.95;
        }

        .nr-about-highlights {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
          margin-top: 28px;
        }

        .nr-about-highlights > div {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 16px;
          border: 1px solid var(--nr-border);
          border-radius: 18px;
          background: color-mix(
            in srgb,
            var(--nr-card) 88%,
            transparent
          );
          box-shadow: 0 15px 36px rgba(18, 67, 130, 0.06);
          backdrop-filter: blur(12px);
        }

        .nr-about-highlight-icon {
          flex: 0 0 42px;
          width: 42px;
          height: 42px;
          display: grid;
          place-items: center;
          border-radius: 13px;
          color: var(--nr-blue);
          background: color-mix(
            in srgb,
            var(--nr-blue) 9%,
            var(--nr-card)
          );
        }

        .nr-about-highlight-icon svg {
          width: 21px;
          height: 21px;
        }

        .nr-about-highlights strong,
        .nr-about-highlights small {
          display: block;
        }

        .nr-about-highlights strong {
          color: var(--nr-text);
          font-size: 13px;
        }

        .nr-about-highlights small {
          margin-top: 4px;
          color: var(--nr-muted);
          font-size: 10px;
          line-height: 1.6;
        }

        .nr-about-link {
          width: fit-content;
          min-height: 50px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 9px;
          margin-top: 28px;
          padding-inline: 21px;
          border-radius: 15px;
          color: #fff;
          background: var(--nr-blue);
          box-shadow: 0 15px 34px rgba(23, 111, 232, 0.22);
          font-size: 13px;
          font-weight: 900;
          transition:
            transform 0.22s ease,
            box-shadow 0.22s ease;
        }

        .nr-about-link:hover {
          transform: translateY(-3px);
          box-shadow: 0 21px 42px rgba(23, 111, 232, 0.29);
        }

        .nr-about-link svg {
          width: 17px;
          height: 17px;
        }

        .nr-about-premium-visual {
          position: relative;
          min-height: 520px;
        }

        .nr-about-device-glow {
          position: absolute;
          width: 430px;
          height: 430px;
          top: 82px;
          left: 50%;
          translate: -50% 0;
          border-radius: 50%;
          background: rgba(23, 111, 232, 0.17);
          filter: blur(55px);
        }

        .nr-about-phone-wrap {
          position: absolute;
          width: 470px;
          top: 34px;
          left: 50%;
          translate: -50% 0;
          z-index: 2;
        }

        .nr-about-phone {
          width: 100%;
          height: auto;
          object-fit: contain;
          filter:
            drop-shadow(0 34px 66px rgba(18, 67, 130, 0.2))
            drop-shadow(0 0 75px rgba(23, 111, 232, 0.13));
        }

        .nr-about-mini-card {
          position: absolute;
          z-index: 4;
          min-width: 185px;
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 13px 14px;
          border: 1px solid rgba(255, 255, 255, 0.48);
          border-radius: 17px;
          color: #16365d;
          background: rgba(255, 255, 255, 0.9);
          box-shadow:
            0 24px 54px rgba(18, 67, 130, 0.18),
            inset 0 1px 0 rgba(255, 255, 255, 0.85);
          backdrop-filter: blur(18px);
        }

        .nr-about-mini-card-top {
          top: 105px;
          inset-inline-start: 12px;
        }

        .nr-about-mini-card-bottom {
          right: 8px;
          bottom: 72px;
        }

        .nr-about-mini-icon {
          flex: 0 0 39px;
          width: 39px;
          height: 39px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          color: var(--nr-blue);
          background: #eaf3ff;
        }

        .nr-about-mini-icon-gold {
          color: #9b7400;
          background: #fff4c7;
        }

        .nr-about-mini-icon svg {
          width: 20px;
          height: 20px;
        }

        .nr-about-mini-card strong,
        .nr-about-mini-card small {
          display: block;
        }

        .nr-about-mini-card strong {
          font-size: 12px;
          font-weight: 900;
        }

        .nr-about-mini-card small {
          margin-top: 3px;
          color: #68809c;
          font-size: 9px;
        }

        html[data-theme="dark"] .nr-about-premium {
          background:
            radial-gradient(
              circle at 12% 16%,
              rgba(23, 111, 232, 0.16),
              transparent 25%
            ),
            radial-gradient(
              circle at 88% 84%,
              rgba(255, 195, 19, 0.1),
              transparent 24%
            ),
            linear-gradient(180deg, #07182c, #0a213d);
        }

        html[data-theme="dark"] .nr-about-highlights > div {
          background: rgba(255, 255, 255, 0.055);
          border-color: rgba(255, 255, 255, 0.1);
          box-shadow: 0 18px 45px rgba(0, 0, 0, 0.2);
        }

        @media (max-width: 1020px) {
          .nr-about-premium-grid {
            grid-template-columns: 1fr;
            gap: 30px;
          }

          .nr-about-premium-copy {
            max-width: 760px;
          }

          .nr-about-premium-visual {
            width: min(100%, 620px);
            min-height: 520px;
            margin-inline: auto;
          }
        }

        @media (max-width: 620px) {
          .nr-about-premium {
            padding: 76px 0;
          }

          .nr-about-premium-grid {
            gap: 20px;
          }

          .nr-about-premium-copy {
            text-align: center;
          }

          .nr-about-kicker {
            margin-inline: auto;
          }

          .nr-about-premium-copy h2 {
            margin-top: 17px;
            font-size: clamp(34px, 10vw, 43px);
            line-height: 1.2;
          }

          .nr-about-premium-copy > p {
            font-size: 14px;
            line-height: 1.82;
          }

          .nr-about-highlights {
            grid-template-columns: 1fr;
          }

          .nr-about-highlights > div {
            text-align: start;
          }

          .nr-about-link {
            width: 100%;
          }

          .nr-about-premium-visual {
            min-height: 430px;
            overflow: hidden;
          }

          .nr-about-device-glow {
            width: 300px;
            height: 300px;
            top: 70px;
          }

          .nr-about-phone-wrap {
            width: 360px;
            top: 20px;
          }

          .nr-about-mini-card {
            min-width: 0;
            width: 145px;
            gap: 8px;
            padding: 9px 10px;
            border-radius: 14px;
          }

          .nr-about-mini-card-top {
            top: 58px;
            inset-inline-start: 0;
          }

          .nr-about-mini-card-bottom {
            right: 0;
            bottom: 45px;
          }

          .nr-about-mini-icon {
            width: 31px;
            height: 31px;
            flex-basis: 31px;
          }

          .nr-about-mini-card strong {
            font-size: 10px;
          }

          .nr-about-mini-card small {
            font-size: 7px;
          }
        }

        @media (max-width: 390px) {
          .nr-about-premium-visual {
            min-height: 400px;
          }

          .nr-about-phone-wrap {
            width: 325px;
          }

          .nr-about-mini-card {
            width: 132px;
          }
        }


        /* Consistent desktop/mobile layout */
        .nr-about-premium-copy {
          grid-area: copy;
        }

        .nr-about-premium-visual {
          grid-area: visual;
        }

        .nr-about-premium[dir="rtl"] .nr-about-premium-grid {
          grid-template-areas: "visual copy";
        }

        .nr-about-premium[dir="ltr"] .nr-about-premium-grid {
          grid-template-areas: "copy visual";
        }

        @media (max-width: 1020px) {
          .nr-about-premium[dir="rtl"] .nr-about-premium-grid,
          .nr-about-premium[dir="ltr"] .nr-about-premium-grid {
            grid-template-columns: minmax(0, 1fr);
            grid-template-areas:
              "copy"
              "visual";
          }

          .nr-about-premium-copy {
            width: min(100%, 760px);
            margin-inline: auto;
            text-align: center;
          }

          .nr-about-kicker {
            margin-inline: auto;
          }

          .nr-about-premium-copy > p {
            max-width: 700px;
            margin-inline: auto;
          }

          .nr-about-highlights {
            max-width: 700px;
            margin-inline: auto;
            margin-top: 28px;
          }

          .nr-about-link {
            margin-inline: auto;
          }
        }

        @media (max-width: 620px) {
          .nr-about-premium {
            padding: 70px 0 58px;
          }

          .nr-about-premium-grid {
            width: min(100% - 26px, 1240px);
            gap: 26px;
          }

          .nr-about-premium-copy {
            text-align: center;
          }

          .nr-about-premium-copy h2 {
            max-width: 540px;
            margin: 17px auto 14px;
            font-size: clamp(32px, 9.4vw, 42px);
            line-height: 1.18;
            text-wrap: balance;
          }

          .nr-about-premium-copy > p {
            max-width: 520px;
            font-size: 13px;
            line-height: 1.78;
          }

          .nr-about-highlights {
            grid-template-columns: 1fr;
            gap: 10px;
            width: 100%;
            margin-top: 22px;
          }

          .nr-about-highlights > div {
            min-height: 74px;
            padding: 13px 14px;
            text-align: start;
          }

          .nr-about-highlight-icon {
            width: 38px;
            height: 38px;
            flex-basis: 38px;
          }

          .nr-about-link {
            width: 100%;
            min-height: 52px;
            margin-top: 20px;
          }

          .nr-about-premium-visual {
            width: 100%;
            height: 410px;
            min-height: 410px;
            margin: 0 auto;
            overflow: hidden;
          }

          .nr-about-device-glow {
            width: 280px;
            height: 280px;
            top: 70px;
            left: 50%;
          }

          .nr-about-phone-wrap {
            width: 315px;
            top: 28px;
            left: 50%;
          }

          .nr-about-mini-card {
            width: 138px;
            min-width: 0;
            gap: 7px;
            padding: 9px 10px;
            border-radius: 14px;
          }

          .nr-about-mini-card-top {
            top: 44px;
            inset-inline-start: 4px;
          }

          .nr-about-mini-card-bottom {
            right: 4px;
            bottom: 40px;
          }

          .nr-about-mini-icon {
            width: 30px;
            height: 30px;
            flex-basis: 30px;
          }

          .nr-about-mini-icon svg {
            width: 16px;
            height: 16px;
          }

          .nr-about-mini-card strong {
            font-size: 9px;
            line-height: 1.25;
          }

          .nr-about-mini-card small {
            font-size: 7px;
            line-height: 1.3;
          }

          .nr-about-premium[dir="ltr"] .nr-about-mini-card-top {
            left: 4px;
            right: auto;
          }

          .nr-about-premium[dir="ltr"] .nr-about-mini-card-bottom {
            left: auto;
            right: 4px;
          }
        }

        @media (max-width: 390px) {
          .nr-about-premium-grid {
            width: min(100% - 20px, 1240px);
          }

          .nr-about-premium-copy h2 {
            font-size: 30px;
          }

          .nr-about-premium-visual {
            height: 375px;
            min-height: 375px;
          }

          .nr-about-phone-wrap {
            width: 285px;
          }

          .nr-about-mini-card {
            width: 126px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .nr-about-link {
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

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
    >
      <path
        d="m5 12 4 4L19 6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function StarIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
    >
      <path
        d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z"
        strokeLinejoin="round"
      />
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