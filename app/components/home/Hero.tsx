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
        initial={{ scale: 1.04, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
      />
      <div className="nr-premium-haram-overlay" aria-hidden="true" />
      <div className="nr-premium-hero-orb nr-premium-hero-orb-top" aria-hidden="true" />
      <div className="nr-premium-hero-orb nr-premium-hero-orb-bottom" aria-hidden="true" />

      <div className="nr-container nr-premium-hero-inner">
        <motion.div
          className="nr-premium-copy"
          initial={{ opacity: 0, y: 28 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.72, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.78, delay: 0.08, ease: [0.22, 1, 0.36, 1] }}
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
            transition={{ duration: 0.72, delay: 0.28, ease: [0.22, 1, 0.36, 1] }}
          >
            <span />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.3 }}
          >
            {isArabic
              ? "من اختيار البرنامج إلى متابعة تفاصيل رحلتك، تجمع نور آب خدمات العمرة في تطبيق واحد لتستمتع بتجربة مريحة وآمنة."
              : "From choosing your program to following every detail of your journey, NourApp brings Umrah services together in one app for a comfortable and secure experience."}
          </motion.p>

          <motion.div
            className="nr-premium-actions"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.65, delay: 0.4 }}
          >
            <a className="nr-premium-primary" href="#programs">
              <span>{isArabic ? "تصفح البرامج" : "Browse programs"}</span>
              <span className="nr-premium-button-arrow" aria-hidden="true">
                {isArabic ? "‹" : "›"}
              </span>
            </a>

            <a className="nr-premium-secondary" href="#download">
              <span>{isArabic ? "حمّل التطبيق الآن" : "Download the app"}</span>
              <span className="nr-premium-download-icon" aria-hidden="true">↓</span>
            </a>
          </motion.div>
        </motion.div>

        <motion.div
          className="nr-premium-device-stage"
          initial={{ opacity: 0, y: 70, scale: 0.94 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.9, delay: 0.48, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="nr-premium-device-glow" aria-hidden="true" />
          <motion.div
            animate={{ y: [0, -7, 0] }}
            transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
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
          min-height: 780px;
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
          background: url("/images/site/hero-haram-bg.jpg") center 58% / cover no-repeat;
          filter: saturate(.96) contrast(1.03) brightness(.82);
          transform-origin: center;
          pointer-events: none;
        }

        .nr-premium-haram-overlay {
          position: absolute;
          inset: 0;
          z-index: -4;
          pointer-events: none;
          background:
            linear-gradient(180deg, rgba(8, 103, 221, .88) 0%, rgba(7, 95, 210, .88) 52%, rgba(4, 75, 176, .94) 100%),
            radial-gradient(circle at 50% 35%, rgba(30, 150, 255, .28), transparent 42%);
        }

        .nr-premium-hero::after {
          content: "";
          position: absolute;
          inset: 0;
          z-index: -3;
          pointer-events: none;
          background:
            linear-gradient(90deg, rgba(0, 54, 137, .12), transparent 24%, transparent 76%, rgba(0, 54, 137, .08));
        }

        .nr-premium-hero-orb {
          position: absolute;
          z-index: -2;
          border-radius: 50%;
          pointer-events: none;
        }

        .nr-premium-hero-orb-top {
          width: 300px;
          height: 300px;
          top: -165px;
          inset-inline-end: -75px;
          background: rgba(38, 209, 247, .28);
        }

        .nr-premium-hero-orb-bottom {
          width: 440px;
          height: 440px;
          bottom: -310px;
          inset-inline-start: 12%;
          border: 1px solid rgba(255, 255, 255, .08);
          background: rgba(42, 128, 235, .12);
        }

        .nr-premium-hero-inner {
          position: relative;
          z-index: 2;
          width: min(1440px, calc(100% - 36px));
          min-height: 780px;
          display: flex;
          flex-direction: column;
          align-items: center;
          padding-top: clamp(66px, 7vw, 104px);
        }

        .nr-premium-copy {
          width: min(1180px, 100%);
          margin-inline: auto;
          text-align: center;
        }

        .nr-premium-copy h1 {
          width: 100%;
          margin: 0;
          color: #fff;
          font-size: clamp(48px, 5.45vw, 82px);
          font-weight: 800;
          line-height: 1.12;
          letter-spacing: 0;
          text-shadow: 0 9px 24px rgba(0, 38, 105, .2);
        }

        .nr-premium-title-line {
          display: block;
          width: 100%;
          text-wrap: balance;
        }

        .nr-premium-title-line-main {
          white-space: nowrap;
        }

        .nr-premium-title-line-second {
          margin-top: .12em;
          white-space: nowrap;
        }

        .nr-premium-title-divider {
          position: relative;
          width: min(920px, 84%);
          height: 2px;
          margin: 30px auto 22px;
          transform-origin: center;
          background: linear-gradient(90deg, transparent, rgba(255,255,255,.4) 18%, rgba(255,255,255,.4) 82%, transparent);
        }

        .nr-premium-title-divider span {
          position: absolute;
          top: 50%;
          left: 50%;
          width: 9px;
          height: 9px;
          border-radius: 50%;
          background: #fff;
          box-shadow: 0 0 14px rgba(255,255,255,.9);
          transform: translate(-50%, -50%) rotate(45deg);
        }

        .nr-premium-copy > p {
          width: min(900px, 100%);
          margin: 0 auto;
          color: rgba(255,255,255,.92);
          font-size: clamp(16px, 1.45vw, 22px);
          line-height: 1.9;
          font-weight: 500;
          text-wrap: balance;
        }

        .nr-premium-actions {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;
          gap: 18px;
          margin-top: 30px;
        }

        .nr-premium-actions a {
          min-width: 285px;
          min-height: 62px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 12px;
          padding-inline: 30px;
          border-radius: 18px;
          font-size: 17px;
          font-weight: 800;
          transition: transform .22s ease, box-shadow .22s ease, background .22s ease;
        }

        .nr-premium-actions a:hover {
          transform: translateY(-3px);
        }

        .nr-premium-primary {
          color: #0966d8;
          background: #fff;
          box-shadow: 0 16px 35px rgba(1, 45, 115, .18);
        }

        .nr-premium-primary:hover {
          box-shadow: 0 20px 44px rgba(1, 45, 115, .24);
        }

        .nr-premium-secondary {
          color: #fff;
          border: 1.5px solid rgba(255,255,255,.72);
          background: rgba(11, 104, 218, .22);
          backdrop-filter: blur(12px);
        }

        .nr-premium-button-arrow {
          font-size: 30px;
          line-height: 0;
          margin-top: -2px;
        }

        .nr-premium-download-icon {
          font-size: 22px;
          line-height: 1;
        }

        .nr-premium-device-stage {
          position: relative;
          width: min(420px, 52vw);
          height: 255px;
          margin-top: 32px;
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
          width: 360px;
          height: 180px;
          top: 40px;
          left: 50%;
          transform: translateX(-50%);
          border-radius: 50%;
          background: rgba(255,255,255,.18);
          filter: blur(45px);
          pointer-events: none;
        }

        .nr-premium-phone-front {
          display: block;
          width: 100%;
          height: auto;
          object-fit: contain;
          filter: drop-shadow(0 24px 40px rgba(0, 24, 76, .3));
        }

        @media (max-width: 1020px) {
          .nr-premium-hero,
          .nr-premium-hero-inner {
            min-height: 720px;
          }

          .nr-premium-copy h1 {
            font-size: clamp(44px, 6vw, 66px);
          }

          .nr-premium-title-line-main,
          .nr-premium-title-line-second {
            white-space: normal;
          }
        }

        @media (max-width: 768px) {
          .nr-premium-hero {
            min-height: 690px;
          }

          .nr-premium-haram-bg {
            background-position: 48% center;
            filter: saturate(.92) contrast(1.02) brightness(.78);
          }

          .nr-premium-hero-inner {
            min-height: 690px;
            width: calc(100% - 24px);
            padding-top: 56px;
          }

          .nr-premium-copy h1 {
            font-size: clamp(34px, 9vw, 48px);
            line-height: 1.16;
          }

          .nr-premium-title-line-main,
          .nr-premium-title-line-second {
            white-space: normal;
          }

          .nr-premium-title-line-second {
            margin-top: .18em;
          }

          .nr-premium-title-divider {
            width: 90%;
            margin: 24px auto 18px;
          }

          .nr-premium-copy > p {
            width: min(580px, 96%);
            font-size: 14px;
            line-height: 1.8;
          }

          .nr-premium-actions {
            gap: 12px;
            margin-top: 24px;
          }

          .nr-premium-actions a {
            min-width: 220px;
            min-height: 54px;
            padding-inline: 22px;
            border-radius: 15px;
            font-size: 14px;
          }

          .nr-premium-device-stage {
            width: min(340px, 66vw);
            height: 210px;
            margin-top: 26px;
          }
        }

        @media (max-width: 520px) {
          .nr-premium-hero,
          .nr-premium-hero-inner {
            min-height: 660px;
          }

          .nr-premium-hero-inner {
            padding-top: 44px;
          }

          .nr-premium-copy h1 {
            font-size: clamp(31px, 10.2vw, 42px);
          }

          .nr-premium-copy > p {
            font-size: 13px;
            line-height: 1.75;
          }

          .nr-premium-actions {
            width: min(100%, 360px);
            margin-inline: auto;
          }

          .nr-premium-actions a {
            width: 100%;
            min-width: 0;
          }

          .nr-premium-device-stage {
            width: min(300px, 74vw);
            height: 190px;
            margin-top: 22px;
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
