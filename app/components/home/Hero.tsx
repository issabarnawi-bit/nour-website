"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { HomeCopy } from "../../data/home";

type Props = { t: HomeCopy };

export default function Hero({ t }: Props) {
  const isArabic = t.lang === "English";

  return (
    <section className="nr-premium-hero" id="home">
      <motion.div
        className="nr-premium-haram-bg"
        aria-hidden="true"
        initial={{ scale: 1.035, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }}
      />

      <div className="nr-premium-haram-overlay" aria-hidden="true" />
      <div className="nr-premium-hero-orb nr-premium-hero-orb-top" aria-hidden="true" />
      <div className="nr-premium-hero-orb nr-premium-hero-orb-bottom" aria-hidden="true" />

      <div className="nr-container nr-premium-hero-inner">
        <motion.div
          className="nr-premium-copy"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.68, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.72, delay: 0.06, ease: [0.22, 1, 0.36, 1] }}
          >
            {isArabic ? (
              <>
                <span className="nr-premium-title-line nr-premium-title-line-main">
                  رفيقك الذكي لعمرة
                </span>
                <span className="nr-premium-title-line nr-premium-title-line-second">
                  أسهل وأكثر طمأنينة
                </span>
              </>
            ) : (
              <>
                <span className="nr-premium-title-line nr-premium-title-line-main">
                  Your smart companion for Umrah
                </span>
                <span className="nr-premium-title-line nr-premium-title-line-second">
                  Easier, calmer, and more reassuring
                </span>
              </>
            )}
          </motion.h1>

          <motion.div
            className="nr-premium-title-divider"
            aria-hidden="true"
            initial={{ scaleX: 0, opacity: 0 }}
            animate={{ scaleX: 1, opacity: 1 }}
            transition={{ duration: 0.66, delay: 0.22, ease: [0.22, 1, 0.36, 1] }}
          >
            <span />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.58, delay: 0.26 }}
          >
            {isArabic
              ? "من اختيار البرنامج إلى متابعة رحلتك، تجمع نور آب خدمات العمرة في تطبيق واحد لتجربة أسهل وأكثر أمانًا."
              : "From choosing your program to following your journey, NourApp brings Umrah services together in one app for an easier and safer experience."}
          </motion.p>

          <motion.div
            className="nr-premium-actions"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.58, delay: 0.34 }}
          >
            <a className="nr-premium-primary" href="#programs">
              <span>{isArabic ? "تصفح البرامج" : "Browse programs"}</span>
              <span className="nr-premium-button-arrow" aria-hidden="true">
                {isArabic ? "‹" : "›"}
              </span>
            </a>

            <a className="nr-premium-secondary" href="#contact">
              <span>{isArabic ? "حمّل التطبيق الآن" : "Download the app"}</span>
              <span className="nr-premium-download-icon" aria-hidden="true">↓</span>
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          className="nr-premium-device-stage"
          initial={{ opacity: 0, y: 52, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.82, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="nr-premium-device-glow" aria-hidden="true" />

          <motion.div
            animate={{ y: [0, -5, 0] }}
            transition={{ duration: 7.6, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image
              src="/images/site/front-view.png"
              alt={isArabic ? "واجهة تطبيق نور آب" : "NourApp app interface"}
              width={430}
              height={760}
              priority
              className="nr-premium-phone-front"
            />
          </motion.div>
        </motion.div>
      </div>

      <style jsx global>{`
        .nr-premium-hero {
          position: relative;
          min-height: 730px;
          display: flex;
          align-items: flex-start;
          overflow: hidden;
          isolation: isolate;
          color: #fff;
          background: #0964d8;
        }

        .nr-premium-haram-bg {
          position: absolute;
          inset: 0;
          z-index: -5;
          background: url("/images/site/haram-statistics-bg.jpg") center 54% / cover no-repeat;
          filter: saturate(.98) contrast(1.03) brightness(.88);
          transform-origin: center;
          pointer-events: none;
        }

        .nr-premium-haram-overlay {
          position: absolute;
          inset: 0;
          z-index: -4;
          pointer-events: none;
          background:
            linear-gradient(
              180deg,
              rgba(8, 103, 221, .72) 0%,
              rgba(7, 95, 210, .74) 52%,
              rgba(4, 75, 176, .84) 100%
            ),
            radial-gradient(
              circle at 50% 34%,
              rgba(35, 164, 255, .22),
              transparent 42%
            );
        }

        .nr-premium-hero::after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -3;
          pointer-events: none;
          background: linear-gradient(
            90deg,
            rgba(0, 44, 112, .14),
            transparent 24%,
            transparent 76%,
            rgba(0, 44, 112, .1)
          );
        }

        .nr-premium-hero-orb {
          position: absolute;
          z-index: -2;
          border-radius: 50%;
          pointer-events: none;
        }

        .nr-premium-hero-orb-top {
          width: 280px;
          height: 280px;
          top: -165px;
          inset-inline-end: -65px;
          background: rgba(38, 209, 247, .22);
        }

        .nr-premium-hero-orb-bottom {
          width: 400px;
          height: 400px;
          bottom: -292px;
          inset-inline-start: 12%;
          border: 1px solid rgba(255, 255, 255, .07);
          background: rgba(42, 128, 235, .1);
        }

        .nr-premium-hero-inner {
          position: relative;
          z-index: 2;
          width: min(1400px, calc(100% - 36px));
          min-height: 730px;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: clamp(50px, 5vw, 72px);
        }

        .nr-premium-copy {
          width: min(1120px, 100%);
          margin-inline: auto;
          text-align: center;
        }

        .nr-premium-copy h1 {
          width: 100%;
          margin: 0;
          color: #fff;
          font-size: clamp(46px, 4.8vw, 74px);
          font-weight: 800;
          line-height: 1.11;
          letter-spacing: 0;
          text-shadow: 0 8px 22px rgba(0, 38, 105, .2);
        }

        .nr-premium-title-line {
          display: block;
          width: 100%;
          text-wrap: balance;
        }

        .nr-premium-title-line-main,
        .nr-premium-title-line-second {
          white-space: nowrap;
        }

        .nr-premium-title-line-second {
          margin-top: .1em;
        }

        .nr-premium-title-divider {
          position: relative;
          width: min(820px, 78%);
          height: 2px;
          margin: 24px auto 18px;
          transform-origin: center;
          background: linear-gradient(
            90deg,
            transparent,
            rgba(255,255,255,.36) 18%,
            rgba(255,255,255,.36) 82%,
            transparent
          );
        }

        .nr-premium-title-divider span {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 0 13px rgba(255,255,255,.82);
          transform: translate(-50%, -50%) rotate(45deg);
        }

        .nr-premium-copy > p {
          width: min(780px, 94%);
          margin: 0 auto;
          color: rgba(255,255,255,.93);
          font-size: clamp(15px, 1.18vw, 19px);
          line-height: 1.82;
          font-weight: 500;
          text-wrap: balance;
          text-shadow: 0 2px 14px rgba(0, 47, 122, .18);
        }

        .nr-premium-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 14px;
          margin-top: 24px;
        }

        .nr-premium-actions a {
          min-width: 250px;
          min-height: 56px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding-inline: 26px;
          border-radius: 16px;
          font-size: 15px;
          font-weight: 800;
          transition:
            transform .22s ease,
            box-shadow .22s ease,
            background .22s ease,
            border-color .22s ease;
        }

        .nr-premium-actions a:hover {
          transform: translateY(-3px);
        }

        .nr-premium-primary {
          color: #0966d8;
          background: #fff;
          box-shadow: 0 14px 30px rgba(1, 45, 115, .18);
        }

        .nr-premium-primary:hover {
          box-shadow: 0 18px 38px rgba(1, 45, 115, .24);
        }

        .nr-premium-secondary {
          color: #fff;
          border: 1.5px solid rgba(255,255,255,.7);
          background: rgba(11, 104, 218, .22);
          backdrop-filter: blur(12px);
        }

        .nr-premium-secondary:hover {
          border-color: rgba(255,255,255,.9);
          background: rgba(255,255,255,.1);
        }

        .nr-premium-button-arrow {
          font-size: 27px;
          line-height: 0;
          margin-top: -2px;
        }

        .nr-premium-download-icon {
          font-size: 20px;
          line-height: 1;
        }

        .nr-premium-device-stage {
          position: relative;
          width: min(390px, 48vw);
          height: 250px;
          margin-top: 18px;
          display: flex;
          justify-content: center;
          align-items: flex-start;
        }

        .nr-premium-device-stage > div:last-child {
          position: relative;
          z-index: 2;
          width: 100%;
        }

        .nr-premium-device-glow {
          position: absolute;
          width: 330px;
          height: 160px;
          top: 28px;
          left: 50%;
          transform: translateX(-50%);
          border-radius: 50%;
          background: rgba(255,255,255,.16);
          filter: blur(42px);
          pointer-events: none;
        }

        .nr-premium-phone-front {
          display: block;
          width: 100%;
          height: auto;
          object-fit: contain;
          filter: drop-shadow(0 22px 38px rgba(0, 24, 76, .28));
        }

        @media (max-width: 1020px) {
          .nr-premium-hero,
          .nr-premium-hero-inner {
            min-height: 690px;
          }

          .nr-premium-copy h1 {
            font-size: clamp(42px, 5.6vw, 64px);
          }

          .nr-premium-title-line-main,
          .nr-premium-title-line-second {
            white-space: normal;
          }

          .nr-premium-device-stage {
            width: min(360px, 55vw);
            margin-top: 16px;
          }
        }

        @media (max-width: 768px) {
          .nr-premium-hero,
          .nr-premium-hero-inner {
            min-height: 650px;
          }

          .nr-premium-haram-bg {
            background-position: 50% center;
            filter: saturate(.95) contrast(1.02) brightness(.84);
          }

          .nr-premium-haram-overlay {
            background:
              linear-gradient(
                180deg,
                rgba(8, 103, 221, .76) 0%,
                rgba(7, 95, 210, .78) 54%,
                rgba(4, 75, 176, .86) 100%
              );
          }

          .nr-premium-hero-inner {
            width: calc(100% - 24px);
            padding-top: 44px;
          }

          .nr-premium-copy h1 {
            font-size: clamp(33px, 8.7vw, 46px);
            line-height: 1.15;
          }

          .nr-premium-title-line-main,
          .nr-premium-title-line-second {
            white-space: normal;
          }

          .nr-premium-title-line-second {
            margin-top: .16em;
          }

          .nr-premium-title-divider {
            width: 88%;
            margin: 20px auto 16px;
          }

          .nr-premium-copy > p {
            width: min(560px, 96%);
            font-size: 14px;
            line-height: 1.72;
          }

          .nr-premium-actions {
            gap: 10px;
            margin-top: 20px;
          }

          .nr-premium-actions a {
            min-width: 214px;
            min-height: 52px;
            padding-inline: 20px;
            border-radius: 14px;
            font-size: 14px;
          }

          .nr-premium-device-stage {
            width: min(320px, 65vw);
            height: 198px;
            margin-top: 16px;
          }
        }

        @media (max-width: 520px) {
          .nr-premium-hero,
          .nr-premium-hero-inner {
            min-height: 625px;
          }

          .nr-premium-hero-inner {
            padding-top: 34px;
          }

          .nr-premium-copy h1 {
            font-size: clamp(30px, 10vw, 40px);
          }

          .nr-premium-copy > p {
            font-size: 13px;
            line-height: 1.68;
          }

          .nr-premium-actions {
            width: min(100%, 340px);
            margin-inline: auto;
          }

          .nr-premium-actions a {
            width: 100%;
            min-width: 0;
          }

          .nr-premium-device-stage {
            width: min(285px, 72vw);
            height: 176px;
            margin-top: 14px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .nr-premium-device-stage > div:last-child {
            transform: none !important;
          }
        }
      `}</style>
    </section>
  );
}
