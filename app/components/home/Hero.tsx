"use client";

import Image from "next/image";
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  type Variants,
} from "framer-motion";
import type { MouseEvent, ReactNode } from "react";
import type { HomeCopy } from "../../data/home";

type Props = { t: HomeCopy };

const fadeItem: Variants = {
  hidden: { opacity: 0, y: 24 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.62, ease: [0.22, 1, 0.36, 1] },
  },
};

export default function Hero({ t }: Props) {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const smoothX = useSpring(mouseX, { stiffness: 70, damping: 20 });
  const smoothY = useSpring(mouseY, { stiffness: 70, damping: 20 });

  const phoneX = useTransform(smoothX, [-1, 1], [-14, 14]);
  const phoneY = useTransform(smoothY, [-1, 1], [-10, 10]);
  const backX = useTransform(smoothX, [-1, 1], [10, -10]);
  const backY = useTransform(smoothY, [-1, 1], [7, -7]);
  const glowX = useTransform(smoothX, [-1, 1], [-22, 22]);
  const glowY = useTransform(smoothY, [-1, 1], [-16, 16]);

  const isArabic = t.lang === "English";

  const handleMouseMove = (event: MouseEvent<HTMLElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    mouseX.set(((event.clientX - rect.left) / rect.width) * 2 - 1);
    mouseY.set(((event.clientY - rect.top) / rect.height) * 2 - 1);
  };

  return (
    <section
      className="nr-premium-hero"
      id="home"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => {
        mouseX.set(0);
        mouseY.set(0);
      }}
    >
      <div className="nr-premium-grid" aria-hidden="true" />
      <motion.div className="nr-premium-glow nr-premium-glow-blue" style={{ x: glowX, y: glowY }} />
      <motion.div className="nr-premium-glow nr-premium-glow-gold" style={{ x: backX, y: backY }} />

      <div className="nr-container nr-premium-hero-grid">
        <motion.div
          className="nr-premium-copy"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.12, delayChildren: 0.12 } },
          }}
        >
          <motion.span className="nr-premium-kicker" variants={fadeItem}>
            <SparkleIcon />
            {t.heroEyebrow}
          </motion.span>

          <motion.h1
            initial={{
              opacity: 0,
              x: isArabic ? 120 : -120,
              filter: "blur(6px)",
            }}
            animate={{
              opacity: 1,
              x: 0,
              filter: "blur(0px)",
            }}
            transition={{
              duration: 0.78,
              delay: 0.12,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {isArabic ? (
              <>
                رفيقك الذكي لعمرة أسهل
                <span> وأكثر طمأنينة</span>
              </>            ) : (
              <>
                Your smart companion for an easier
                <span> Umrah journey with peace of mind</span>
              </>
            )}
          </motion.h1>

          <motion.p variants={fadeItem}>
            {isArabic
              ? "من اختيار البرنامج إلى متابعة تفاصيل رحلتك، تجمع نور آب خدمات العمرة في تجربة رقمية واضحة ومتكاملة."
              : "From choosing your program to following your journey, NourApp brings Umrah services together in one clear and integrated digital experience."}
          </motion.p>

          <motion.div className="nr-premium-service-line" variants={fadeItem}>
            <span>{isArabic ? "تأشيرة" : "Visa"}</span>
            <i />
            <span>{isArabic ? "سكن" : "Hotels"}</span>
            <i />
            <span>{isArabic ? "نقل" : "Transport"}</span>
            <i />
            <span>{isArabic ? "إرشاد" : "Guidance"}</span>
            <i />
            <span>{isArabic ? "متابعة الرحلة" : "Journey tracking"}</span>
          </motion.div>

          <motion.div className="nr-premium-actions" variants={fadeItem}>
            <a className="nr-premium-primary" href="#programs">
              <span>{isArabic ? "استعرض برامج العمرة" : "Explore Umrah programs"}</span>
              <ArrowIcon isArabic={isArabic} />
            </a>
            <a className="nr-premium-secondary" href="#features">
              <span>{isArabic ? "استكشف خدمات  نور آب" : "Explore NourApp services"}</span>
              <PlayIcon />
            </a>
          </motion.div>

          <motion.div className="nr-premium-trust" variants={fadeItem}>
            <div>
              <strong>{isArabic ? "خدمات متكاملة" : "Integrated services"}</strong>
              <small>{isArabic ? "من البرنامج إلى المتابعة" : "From program to follow-up"}</small>
            </div>
            <span className="nr-premium-trust-divider" />
            <div>
              <strong>24/7</strong>
              <small>{isArabic ? "دعم ومتابعة" : "Support & follow-up"}</small>
            </div>
            <span className="nr-premium-trust-divider" />
            <div>
              <strong>{isArabic ? "دفع آمن" : "Secure payments"}</strong>
              <small>{isArabic ? "حماية وخصوصية" : "Protection & privacy"}</small>
            </div>
            <span className="nr-premium-trust-divider" />
            <div>
              <strong>{isArabic ? "تكلفة مرنة" : "Flexible pricing"}</strong>
              <small>{isArabic ? "خيارات تناسب ميزانيتك" : "Options for your budget"}</small>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          className="nr-premium-visual"
          initial={{ opacity: 0, scale: 0.92, x: isArabic ? -70 : 70 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.95, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
        >
          <motion.div className="nr-premium-device-glow" style={{ x: glowX, y: glowY }} />

          <motion.div
            className="nr-premium-phone-back-parallax"
            style={{ x: backX, y: backY }}
          >
            <motion.div
              className="nr-premium-phone-back-wrap"
              initial={{
                opacity: 0,
                x: isArabic ? -100 : 100,
                y: 28,
                scale: 0.86,
                rotate: isArabic ? -12 : 12,
              }}
              animate={{
                opacity: 1,
                x: 0,
                y: 0,
                scale: 1,
                rotate: isArabic ? -7 : 7,
              }}
              transition={{
                duration: 0.9,
                delay: 0.22,
                ease: [0.22, 1, 0.36, 1],
              }}
            >
              <Image
                src="/images/site/rotated-right.png"
                alt=""
                width={630}
                height={630}
                priority
                className="nr-premium-phone-back"
              />
            </motion.div>
          </motion.div>

          <motion.div
            className="nr-premium-phone-front-parallax"
            style={{ x: phoneX, y: phoneY }}
          >
            <motion.div
              className="nr-premium-phone-front-wrap"
              initial={{
                opacity: 0,
                y: 80,
                scale: 0.86,
                rotate: isArabic ? -8 : 8,
              }}
              animate={{
                opacity: 1,
                y: 0,
                scale: 1,
                rotate: 0,
              }}
              transition={{
                type: "spring",
                stiffness: 72,
                damping: 16,
                mass: 0.9,
                delay: 0.42,
              }}
            >
              <motion.div
                className="nr-premium-phone-front-float"
                animate={{
                  y: [0, -6, 0],
                  rotate: [-0.35, 0.35, -0.35],
                }}
                transition={{
                  duration: 7.4,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: 1.15,
                }}
              >
                <Image
                  src="/images/site/front-view.png"
                  alt={isArabic ? "واجهة تطبيق نور آب" : "NourApp app interface"}
                  width={420}
                  height={720}
                  priority
                  className="nr-premium-phone-front"
                />
              </motion.div>
            </motion.div>
          </motion.div>

          <FloatingCard className="nr-floating-card nr-floating-card-booking" delay={0.55} icon={<CheckIcon />} title={isArabic ? "تم تأكيد الحجز" : "Booking confirmed"} subtitle={isArabic ? "البرنامج جاهز" : "Program ready"} />
          <FloatingCard className="nr-floating-card nr-floating-card-hotel" delay={0.72} icon={<HotelIcon />} title={isArabic ? "الفندق محجوز" : "Hotel reserved"} subtitle={isArabic ? "قريب من الحرم" : "Near the Haram"} />
          <FloatingCard className="nr-floating-card nr-floating-card-visa" delay={0.88} icon={<VisaIcon />} title={isArabic ? "التأشيرة جاهزة" : "Visa ready"} subtitle={isArabic ? "تحديث فوري" : "Instant update"} />
        </motion.div>
      </div>

      <style jsx global>{`
        .nr-premium-hero {
          position: relative;
          min-height: 770px;
          display: flex;
          align-items: center;
          overflow: hidden;
          isolation: isolate;
          color: #fff;
          background:
            radial-gradient(circle at 12% 18%, rgba(58, 219, 255, 0.16), transparent 24%),
            radial-gradient(circle at 84% 18%, rgba(255, 195, 19, 0.13), transparent 22%),
            linear-gradient(135deg, #0757bd 0%, #0f70e5 46%, #258ff1 72%, #68c3ff 100%);
        }

        .nr-premium-grid {
          position: absolute;
          inset: 0;
          z-index: -1;
          opacity: 0.17;
          background-image:
            linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px);
          background-size: 58px 58px;
          mask-image: linear-gradient(to bottom, transparent, #000 16%, #000 82%, transparent);
        }

        .nr-premium-glow {
          position: absolute;
          z-index: -1;
          border-radius: 50%;
          filter: blur(8px);
          pointer-events: none;
        }

        .nr-premium-glow-blue {
          width: 360px;
          height: 360px;
          top: -160px;
          inset-inline-start: -120px;
          background: rgba(32, 235, 213, 0.36);
        }

        .nr-premium-glow-gold {
          width: 380px;
          height: 380px;
          right: -150px;
          bottom: -220px;
          background: rgba(255, 210, 27, 0.42);
        }

        .nr-premium-hero-grid {
          position: relative;
          z-index: 2;
          width: min(1380px, calc(100% - 32px));
          display: grid;
          grid-template-columns: minmax(0, 1.3fr) minmax(390px, .7fr);
          align-items: center;
          gap: 34px;
          padding-block: 48px 68px;
        }

        .nr-premium-copy {
          max-width: 1040px;
          align-self: start;
          padding-top: 18px;
        }

        .nr-premium-kicker {
          width: fit-content;
          min-height: 38px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding-inline: 15px;
          border: 1px solid rgba(255,255,255,.18);
          border-radius: 999px;
          background: rgba(255,255,255,.1);
          font-size: 13px;
          font-weight: 900;
          backdrop-filter: blur(14px);
        }

        .nr-premium-kicker svg {
          width: 17px;
          height: 17px;
          color: #ffc313;
        }

        .nr-premium-copy h1 {
          max-width: 1040px;
          margin: 18px 0 16px;
          font-size: clamp(36px, 4vw, 56px);
          font-weight: 900;
          line-height: 1.22;
          letter-spacing: 0;
          overflow: visible;
        }

        html[dir="rtl"] .nr-premium-copy h1 {
          letter-spacing: 0;
          word-spacing: 0.025em;
          text-align: right;
        }

        html[dir="rtl"] .nr-premium-title-line {
          text-wrap: pretty;
        }

        .nr-premium-title-line {
          display: block;
          width: 100%;
          padding-block: 0.12em;
          line-height: 1.27;
          text-wrap: balance;
          overflow: visible;
        }

        .nr-premium-title-line + .nr-premium-title-line {
          margin-top: 0.035em;
        }

        .nr-premium-title-line-main {
          color: #fff;
        }

        .nr-premium-title-line-accent {
          color: #ffc313;
          text-shadow: 0 12px 30px rgba(255,195,19,.18);
        }

        .nr-premium-copy > p {
          max-width: 860px;
          margin: 0;
          color: rgba(255,255,255,.82);
          font-size: 18px;
          line-height: 1.9;
        }

        .nr-premium-service-line {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 22px;
          color: rgba(255,255,255,.88);
          font-size: 12px;
          font-weight: 800;
        }

        .nr-premium-service-line i {
          width: 4px;
          height: 4px;
          border-radius: 50%;
          background: #ffc313;
          box-shadow: 0 0 12px rgba(255,195,19,.55);
        }

        .nr-premium-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-top: 31px;
        }

        .nr-premium-actions a {
          min-height: 60px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding-inline: 34px;
          border-radius: 18px;
          font-size: 16px;
          font-weight: 900;
          transition:
            transform .22s ease,
            box-shadow .22s ease,
            border-color .22s ease,
            background .22s ease;
        }

        .nr-premium-actions a svg {
          width: 18px;
          height: 18px;
        }

        .nr-premium-actions a:hover {
          transform: translateY(-4px);
        }

        .nr-premium-primary {
          color: #13365e;
          background: #ffc313;
          box-shadow: 0 18px 38px rgba(255,195,19,.28);
        }

        .nr-premium-secondary {
          color: #fff;
          border: 1px solid rgba(255,255,255,.32);
          background: rgba(255,255,255,.09);
          backdrop-filter: blur(12px);
        }

        .nr-premium-trust {
          display: flex;
          align-items: center;
          flex-wrap: wrap;
          gap: 17px;
          margin-top: 34px;
          color: rgba(255,255,255,.9);
        }

        .nr-premium-trust > div {
          min-width: 92px;
        }

        .nr-premium-trust strong,
        .nr-premium-trust small {
          display: block;
        }

        .nr-premium-trust strong {
          font-size: 14px;
        }

        .nr-premium-trust small {
          margin-top: 3px;
          color: rgba(255,255,255,.65);
          font-size: 10px;
        }

        .nr-premium-trust-divider {
          width: 1px;
          height: 34px;
          background: rgba(255,255,255,.22);
        }

        .nr-premium-visual {
          position: relative;
          min-height: 610px;
          isolation: isolate;
        }

        .nr-premium-device-glow {
          position: absolute;
          width: 430px;
          height: 430px;
          top: 92px;
          left: 50%;
          transform: translateX(-50%);
          border-radius: 50%;
          background: rgba(255,255,255,.26);
          filter: blur(58px);
          opacity: .66;
          pointer-events: none;
        }

        .nr-premium-phone-back-parallax,
        .nr-premium-phone-front-parallax {
          position: absolute;
          will-change: transform;
        }

        /* Premium composition:
           back phone is smaller and clearly separated,
           front phone is the visual focus. */
        .nr-premium-phone-back-parallax {
          width: 430px;
          top: 28px;
          inset-inline-end: 34px;
          z-index: 1;
        }

        .nr-premium-phone-front-parallax {
          width: 305px;
          top: 142px;
          inset-inline-start: 26px;
          z-index: 3;
        }

        .nr-premium-phone-back-wrap,
        .nr-premium-phone-front-wrap,
        .nr-premium-phone-front-float {
          width: 100%;
          transform-origin: 50% 72%;
          will-change: transform, opacity;
        }

        .nr-premium-phone-back,
        .nr-premium-phone-front {
          display: block;
          width: 100%;
          height: auto;
          object-fit: contain;
        }

        .nr-premium-phone-back {
          filter:
            drop-shadow(0 26px 52px rgba(0,0,0,.18))
            drop-shadow(0 0 48px rgba(37,143,241,.14));
        }

        .nr-premium-phone-front {
          filter:
            drop-shadow(0 34px 64px rgba(0,0,0,.25))
            drop-shadow(0 0 58px rgba(37,143,241,.18));
        }

        .nr-floating-card {
          position: absolute;
          z-index: 6;
          min-width: 175px;
          display: flex;
          align-items: center;
          gap: 11px;
          padding: 12px 14px;
          border: 1px solid rgba(255,255,255,.48);
          border-radius: 17px;
          color: #16365d;
          background: rgba(255,255,255,.94);
          box-shadow:
            0 20px 44px rgba(18,67,130,.18),
            inset 0 1px 0 rgba(255,255,255,.9);
          backdrop-filter: blur(18px);
          transition:
            transform .22s ease,
            box-shadow .22s ease,
            border-color .22s ease;
        }

        .nr-floating-card:hover {
          transform: translateY(-3px);
          border-color: rgba(255,195,19,.7);
          box-shadow:
            0 25px 54px rgba(18,67,130,.24),
            0 0 28px rgba(255,195,19,.1);
        }

        .nr-floating-card-icon {
          flex: 0 0 38px;
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border-radius: 12px;
          color: #0f62cf;
          background: #e9f3ff;
        }

        .nr-floating-card-icon svg {
          width: 20px;
          height: 20px;
        }

        .nr-floating-card strong,
        .nr-floating-card small {
          display: block;
        }

        .nr-floating-card strong {
          font-size: 12px;
        }

        .nr-floating-card small {
          margin-top: 3px;
          color: #68809c;
          font-size: 9px;
        }

        .nr-floating-card-booking {
          top: 62px;
          inset-inline-start: -4px;
        }

        .nr-floating-card-hotel {
          top: 286px;
          inset-inline-end: -6px;
        }

        .nr-floating-card-visa {
          bottom: 36px;
          inset-inline-start: 8px;
        }

        @media (max-width: 1020px) {
          .nr-premium-hero {
            min-height: auto;
          }

          .nr-premium-hero-grid {
            grid-template-columns: 1fr;
            gap: 30px;
            padding-block: 54px 56px;
          }

          .nr-premium-visual {
            width: min(100%, 620px);
            min-height: 580px;
            margin-inline: auto;
          }
        }

        @media (max-width: 768px) {
  .nr-premium-hero {
    min-height: auto !important;
    overflow: hidden !important;
  }

  .nr-premium-hero-grid {
    width: calc(100% - 24px) !important;
    grid-template-columns: minmax(0, 1fr) !important;
    gap: 8px !important;
    padding: 24px 0 18px !important;
  }

  .nr-premium-copy {
    width: 100% !important;
    max-width: none !important;
    text-align: center !important;
  }

  .nr-premium-kicker {
    margin-inline: auto !important;
  }

  .nr-premium-copy h1 {
    max-width: 100% !important;
    margin: 17px auto 13px !important;
    font-size: clamp(29px, 8.4vw, 38px) !important;
    line-height: 1.18 !important;
    letter-spacing: 0 !important;
    text-wrap: balance;
  }

  .nr-premium-title-line {
    line-height: 1.24 !important;
    padding-block: .09em !important;
  }

  .nr-premium-title-line + .nr-premium-title-line {
    margin-top: .035em !important;
  }

  .nr-premium-copy > p {
    max-width: 520px !important;
    margin-inline: auto !important;
    font-size: 13px !important;
    line-height: 1.7 !important;
  }

  .nr-premium-service-line {
    justify-content: center !important;
    gap: 8px !important;
    margin-top: 16px !important;
    font-size: 10px !important;
  }

  .nr-premium-actions {
    width: 100% !important;
    display: grid !important;
    grid-template-columns: 1fr !important;
    gap: 9px !important;
    margin-top: 20px !important;
  }

  .nr-premium-actions a {
    width: 100% !important;
    min-height: 52px !important;
    padding-inline: 16px !important;
    border-radius: 15px !important;
    font-size: 14px !important;
  }

  .nr-premium-trust {
    width: 100% !important;
    display: grid !important;
    grid-template-columns: repeat(2, minmax(0, 1fr)) !important;
    gap: 10px 6px !important;
    margin-top: 19px !important;
    text-align: center !important;
  }

  .nr-premium-trust-divider {
    display: none !important;
  }

  .nr-premium-trust > div {
    min-width: 0 !important;
    padding: 9px 5px !important;
    border: 1px solid rgba(255,255,255,.14) !important;
    border-radius: 12px !important;
    background: rgba(255,255,255,.07) !important;
  }

  .nr-premium-trust strong {
    font-size: 10px !important;
    line-height: 1.25 !important;
  }

  .nr-premium-trust small {
    font-size: 7px !important;
    line-height: 1.25 !important;
  }

  .nr-premium-visual {
    position: relative !important;
    width: 100% !important;
    height: 440px !important;
    min-height: 440px !important;
    margin-top: 2px !important;
    overflow: visible !important;
  }

  .nr-premium-device-glow {
    width: 270px !important;
    height: 270px !important;
    top: 84px !important;
    left: 50% !important;
    opacity: .4 !important;
    transform: translateX(-50%) !important;
  }

  .nr-premium-phone-back-parallax {
    width: 225px !important;
    top: 76px !important;
    left: 50% !important;
    right: auto !important;
    inset-inline: auto !important;
    transform: translateX(-78%) !important;
  }

  .nr-premium-phone-front-parallax {
    width: 152px !important;
    top: 142px !important;
    bottom: auto !important;
    left: 50% !important;
    right: auto !important;
    inset-inline: auto !important;
    transform: translateX(8%) !important;
  }

  html[dir="ltr"] .nr-premium-phone-back-parallax {
    transform: translateX(-22%) !important;
  }

  html[dir="ltr"] .nr-premium-phone-front-parallax {
    transform: translateX(-108%) !important;
  }

  .nr-floating-card {
    display: flex !important;
    width: 128px !important;
    min-width: 0 !important;
    gap: 7px !important;
    padding: 8px 9px !important;
    border-radius: 13px !important;
  }

  .nr-floating-card-icon {
    width: 28px !important;
    height: 28px !important;
    flex-basis: 28px !important;
    border-radius: 9px !important;
  }

  .nr-floating-card-icon svg {
    width: 15px !important;
    height: 15px !important;
  }

  .nr-floating-card strong {
    font-size: 9px !important;
    line-height: 1.25 !important;
  }

  .nr-floating-card small {
    margin-top: 2px !important;
    font-size: 7px !important;
    line-height: 1.25 !important;
  }

  .nr-floating-card-booking {
    top: 26px !important;
    right: 8px !important;
    left: auto !important;
  }

  .nr-floating-card-hotel {
    top: 196px !important;
    left: 8px !important;
    right: auto !important;
  }

  .nr-floating-card-visa {
    bottom: 26px !important;
    left: 18px !important;
    right: auto !important;
  }

  html[dir="ltr"] .nr-floating-card-booking {
    left: 8px !important;
    right: auto !important;
  }

  html[dir="ltr"] .nr-floating-card-hotel {
    right: 8px !important;
    left: auto !important;
  }

  html[dir="ltr"] .nr-floating-card-visa {
    right: 18px !important;
    left: auto !important;
  }

}
       @media (max-width: 390px) {
  .nr-premium-copy h1 {
    font-size: 27px !important;
  }

  .nr-premium-title-line {
    line-height: 1.26 !important;
  }

  .nr-premium-visual {
    height: 410px !important;
    min-height: 410px !important;
  }

  .nr-premium-phone-back-parallax {
    width: 205px !important;
  }

  .nr-premium-phone-front-parallax {
    width: 140px !important;
  }

  .nr-floating-card {
    width: 122px !important;
  }

  .nr-floating-card-hotel {
    top: 150px !important;
  }
}

        @media (prefers-reduced-motion: reduce) {
          .nr-premium-phone-front-float {
            transform: none !important;
          }
        }

      `}</style>
    </section>
  );
}

function FloatingCard({ className, delay, icon, title, subtitle }: { className: string; delay: number; icon: ReactNode; title: string; subtitle: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 18, scale: 0.94 }}
      animate={{ opacity: 1, y: [0, -7, 0], scale: 1 }}
      transition={{ opacity: { duration: 0.45, delay }, scale: { duration: 0.45, delay }, y: { duration: 4.6 + delay, repeat: Infinity, ease: "easeInOut", delay } }}
    >
      <span className="nr-floating-card-icon">{icon}</span>
      <div><strong>{title}</strong><small>{subtitle}</small></div>
    </motion.div>
  );
}

function SparkleIcon(){return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"><path d="m12 3 1.6 4.4L18 9l-4.4 1.6L12 15l-1.6-4.4L6 9l4.4-1.6L12 3Z"/></svg>}
function ArrowIcon({isArabic}:{isArabic:boolean}){return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">{isArabic?<path d="M19 12H5m6 6-6-6 6-6" strokeLinecap="round" strokeLinejoin="round"/>:<path d="M5 12h14m-6-6 6 6-6 6" strokeLinecap="round" strokeLinejoin="round"/>}</svg>}
function PlayIcon(){return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><circle cx="12" cy="12" r="9"/><path d="m10 8 6 4-6 4V8Z"/></svg>}
function CheckIcon(){return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m5 12 4 4L19 6"/></svg>}
function HotelIcon(){return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="M4 21V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16"/><path d="M2 21h20M8 7h2M14 7h2M10 21v-5h4v5"/></svg>}
function VisaIcon(){return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><rect x="4" y="3" width="16" height="18" rx="3"/><path d="M8 8h8M8 12h5M8 16h7"/></svg>}