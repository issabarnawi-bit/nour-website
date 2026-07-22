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

          <motion.h1 variants={fadeItem}>
            {isArabic ? (
              <>
                رفيقك الذكي لرحلة عمرة
                <span> أكثر راحة وأمانًا</span>
              </>
            ) : (
              <>
                Your smart companion for a
                <span> smoother Umrah journey</span>
              </>
            )}
          </motion.h1>

          <motion.p variants={fadeItem}>
            {isArabic
              ? "جميع خدمات العمرة في تجربة رقمية واحدة، من استعراض البرامج واختيار الخدمات وحتى متابعة تفاصيل الرحلة بسهولة وثقة."
              : "Discover programs, compare services, and follow your journey through one clear, secure, and integrated digital experience."}
          </motion.p>

          <motion.div className="nr-premium-actions" variants={fadeItem}>
            <a className="nr-premium-primary" href="#programs">
              <span>{isArabic ? "ابدأ رحلتك" : "Start your journey"}</span>
              <ArrowIcon isArabic={isArabic} />
            </a>
            <a className="nr-premium-secondary" href="#features">
              <span>{isArabic ? "استكشف خدمات نور" : "Explore Nour services"}</span>
              <PlayIcon />
            </a>
          </motion.div>

          <motion.div className="nr-premium-trust" variants={fadeItem}>
            <div>
              <span className="nr-premium-stars">★★★★★</span>
              <strong>{isArabic ? "تجربة رقمية موثوقة" : "A trusted digital experience"}</strong>
            </div>
            <span className="nr-premium-trust-divider" />
            <div>
              <strong>24/7</strong>
              <small>{isArabic ? "دعم متواصل" : "Continuous support"}</small>
            </div>
            <span className="nr-premium-trust-divider" />
            <div>
              <strong>{isArabic ? "آمن" : "Secure"}</strong>
              <small>{isArabic ? "دفع وخصوصية" : "Payments & privacy"}</small>
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

          <motion.div className="nr-premium-phone-back-wrap" style={{ x: backX, y: backY }}>
            <Image src="/images/site/rotated-right.png" alt="" width={630} height={630} priority className="nr-premium-phone-back" />
          </motion.div>

          <motion.div
            className="nr-premium-phone-front-wrap"
            style={{ x: phoneX, y: phoneY }}
            animate={{ y: [0, -18, 0], rotate: [-2, 2, -2] }}
            transition={{ duration: 5.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <Image src="/images/site/front-view.png" alt={isArabic ? "واجهة تطبيق نور" : "Nour app interface"} width={420} height={720} priority className="nr-premium-phone-front" />
          </motion.div>

          <FloatingCard className="nr-floating-card nr-floating-card-booking" delay={0.55} icon={<CheckIcon />} title={isArabic ? "تم تأكيد الحجز" : "Booking confirmed"} subtitle={isArabic ? "البرنامج جاهز" : "Program ready"} />
          <FloatingCard className="nr-floating-card nr-floating-card-hotel" delay={0.72} icon={<HotelIcon />} title={isArabic ? "الفندق محجوز" : "Hotel reserved"} subtitle={isArabic ? "قريب من الحرم" : "Near the Haram"} />
          <FloatingCard className="nr-floating-card nr-floating-card-visa" delay={0.88} icon={<VisaIcon />} title={isArabic ? "التأشيرة جاهزة" : "Visa ready"} subtitle={isArabic ? "تحديث فوري" : "Instant update"} />
          <FloatingCard className="nr-floating-card nr-floating-card-rating" delay={1.02} icon={<StarIcon />} title="4.9 / 5" subtitle={isArabic ? "تقييم التجربة" : "Experience rating"} />
        </motion.div>
      </div>

      <style jsx global>{`
        .nr-premium-hero{position:relative;min-height:770px;display:flex;align-items:center;overflow:hidden;isolation:isolate;color:#fff;background:radial-gradient(circle at 12% 18%,rgba(58,219,255,.16),transparent 24%),radial-gradient(circle at 84% 18%,rgba(255,195,19,.13),transparent 22%),linear-gradient(135deg,#0757bd 0%,#0f70e5 46%,#258ff1 72%,#68c3ff 100%)}
        .nr-premium-grid{position:absolute;inset:0;z-index:-1;opacity:.17;background-image:linear-gradient(rgba(255,255,255,.08) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.08) 1px,transparent 1px);background-size:58px 58px;mask-image:linear-gradient(to bottom,transparent,#000 16%,#000 82%,transparent)}
        .nr-premium-glow{position:absolute;z-index:-1;border-radius:50%;filter:blur(8px);pointer-events:none}.nr-premium-glow-blue{width:360px;height:360px;top:-160px;inset-inline-start:-120px;background:rgba(32,235,213,.36)}.nr-premium-glow-gold{width:380px;height:380px;right:-150px;bottom:-220px;background:rgba(255,210,27,.42)}
        .nr-premium-hero-grid{position:relative;z-index:2;width:min(1240px,calc(100% - 40px));display:grid;grid-template-columns:minmax(0,1fr) minmax(460px,.95fr);align-items:center;gap:48px;padding-block:88px 84px}.nr-premium-copy{max-width:720px}
        .nr-premium-kicker{width:fit-content;min-height:38px;display:inline-flex;align-items:center;gap:8px;padding-inline:15px;border:1px solid rgba(255,255,255,.18);border-radius:999px;background:rgba(255,255,255,.1);font-size:13px;font-weight:900;backdrop-filter:blur(14px)}.nr-premium-kicker svg{width:17px;height:17px;color:#ffc313}
        .nr-premium-copy h1{max-width:730px;margin:23px 0 19px;font-size:clamp(42px,5.3vw,72px);font-weight:900;line-height:1.05;letter-spacing:-.035em}.nr-premium-copy h1 span{display:block;color:#ffc313;text-shadow:0 12px 30px rgba(255,195,19,.18)}.nr-premium-copy>p{max-width:690px;margin:0;color:rgba(255,255,255,.82);font-size:18px;line-height:1.9}
        .nr-premium-actions{display:flex;flex-wrap:wrap;gap:12px;margin-top:31px}.nr-premium-actions a{min-height:60px;display:inline-flex;align-items:center;justify-content:center;gap:10px;padding-inline:34px;border-radius:18px;font-size:16px;font-weight:900;transition:transform .22s ease,box-shadow .22s ease,border-color .22s ease,background .22s ease}.nr-premium-actions a svg{width:18px;height:18px}.nr-premium-actions a:hover{transform:translateY(-4px)}.nr-premium-primary{color:#13365e;background:#ffc313;box-shadow:0 18px 38px rgba(255,195,19,.28)}.nr-premium-secondary{color:#fff;border:1px solid rgba(255,255,255,.32);background:rgba(255,255,255,.09);backdrop-filter:blur(12px)}
        .nr-premium-trust{display:flex;align-items:center;gap:17px;margin-top:34px;color:rgba(255,255,255,.9)}.nr-premium-trust strong,.nr-premium-trust small{display:block}.nr-premium-trust strong{font-size:14px}.nr-premium-trust small{margin-top:3px;color:rgba(255,255,255,.65);font-size:10px}.nr-premium-stars{display:block;margin-bottom:4px;color:#ffc313;font-size:13px}.nr-premium-trust-divider{width:1px;height:34px;background:rgba(255,255,255,.22)}
        .nr-premium-visual{position:relative;min-height:620px}.nr-premium-device-glow{position:absolute;width:470px;height:470px;top:70px;left:50%;transform:translateX(-50%);border-radius:50%;background:rgba(255,255,255,.35);filter:blur(60px);opacity:.7;pointer-events:none}.nr-premium-phone-back-wrap,.nr-premium-phone-front-wrap{position:absolute}.nr-premium-phone-back-wrap{width:570px;top:-8px;inset-inline-end:-64px}.nr-premium-phone-front-wrap{width:350px;bottom:-24px;inset-inline-start:8px;z-index:3}.nr-premium-phone-back,.nr-premium-phone-front{width:100%;height:auto;object-fit:contain}.nr-premium-phone-back{filter:drop-shadow(0 30px 60px rgba(0,0,0,.2)) drop-shadow(0 0 65px rgba(37,143,241,.2))}.nr-premium-phone-front{filter:drop-shadow(0 35px 70px rgba(0,0,0,.28)) drop-shadow(0 0 80px rgba(37,143,241,.25))}
        .nr-floating-card{position:absolute;z-index:5;min-width:175px;display:flex;align-items:center;gap:11px;padding:12px 14px;border:1px solid rgba(255,255,255,.42);border-radius:17px;color:#16365d;background:rgba(255,255,255,.9);box-shadow:0 22px 48px rgba(18,67,130,.2),inset 0 1px 0 rgba(255,255,255,.8);backdrop-filter:blur(18px);transition:box-shadow .25s ease,border-color .25s ease}.nr-floating-card:hover{border-color:rgba(255,195,19,.7);box-shadow:0 27px 58px rgba(18,67,130,.28),0 0 30px rgba(255,195,19,.12)}.nr-floating-card-icon{flex:0 0 38px;width:38px;height:38px;display:grid;place-items:center;border-radius:12px;color:#0f62cf;background:#e9f3ff}.nr-floating-card-icon svg{width:20px;height:20px}.nr-floating-card strong,.nr-floating-card small{display:block}.nr-floating-card strong{font-size:12px}.nr-floating-card small{margin-top:3px;color:#68809c;font-size:9px}.nr-floating-card-booking{top:78px;inset-inline-start:-30px}.nr-floating-card-hotel{top:210px;inset-inline-end:-35px}.nr-floating-card-visa{bottom:108px;inset-inline-end:-5px}.nr-floating-card-rating{bottom:22px;inset-inline-start:-38px}
        @media(max-width:1020px){.nr-premium-hero{min-height:auto}.nr-premium-hero-grid{grid-template-columns:1fr;gap:30px;padding-block:72px 64px}.nr-premium-visual{width:min(100%,620px);min-height:580px;margin-inline:auto}}
@media (max-width: 620px) {
  .nr-premium-hero {
    min-height: auto;
    align-items: flex-start;
  }

  .nr-premium-hero-grid {
    width: min(100% - 24px, 1240px);
    grid-template-columns: 1fr;
    gap: 20px;
    padding-block: 48px 28px;
  }

  .nr-premium-copy {
    width: 100%;
    max-width: none;
    text-align: center;
  }

  .nr-premium-kicker {
    margin-inline: auto;
  }

  .nr-premium-copy h1 {
    max-width: 100%;
    margin: 20px auto 16px;
    font-size: clamp(35px, 10.7vw, 47px);
    line-height: 1.08;
    letter-spacing: -0.025em;
    text-wrap: balance;
  }

  .nr-premium-copy h1 span {
    margin-top: 2px;
  }

  .nr-premium-copy > p {
    max-width: 540px;
    margin-inline: auto;
    font-size: 14px;
    line-height: 1.8;
  }

  .nr-premium-actions {
    width: 100%;
    flex-direction: column;
    gap: 10px;
    margin-top: 25px;
  }

  .nr-premium-actions a {
    width: 100%;
    min-height: 58px;
    padding-inline: 20px;
    border-radius: 17px;
    font-size: 15px;
  }

  .nr-premium-trust {
    width: 100%;
    display: grid;
    grid-template-columns: repeat(3, minmax(0, 1fr));
    align-items: start;
    gap: 7px;
    margin-top: 26px;
    text-align: center;
  }

  .nr-premium-trust-divider {
    display: none;
  }

  .nr-premium-trust > div {
    min-width: 0;
  }

  .nr-premium-trust strong {
    font-size: 12px;
    line-height: 1.35;
  }

  .nr-premium-trust small {
    font-size: 9px;
    line-height: 1.35;
  }

  .nr-premium-stars {
    font-size: 11px;
    white-space: nowrap;
  }

  .nr-premium-visual {
    width: 100%;
    min-height: 555px;
    margin-top: 4px;
    overflow: hidden;
  }

  .nr-premium-device-glow {
    width: 350px;
    height: 350px;
    top: 95px;
    opacity: 0.52;
  }

  .nr-premium-phone-back-wrap {
    width: 345px;
    top: 52px;
    inset-inline-start: -72px;
    inset-inline-end: auto;
  }

  .nr-premium-phone-front-wrap {
    width: 205px;
    right: 14px;
    left: auto;
    bottom: 33px;
  }

  html[dir="ltr"] .nr-premium-phone-back-wrap {
    right: -72px;
    left: auto;
  }

  html[dir="ltr"] .nr-premium-phone-front-wrap {
    right: auto;
    left: 14px;
  }

  .nr-floating-card {
    min-width: 0;
    width: 154px;
    gap: 8px;
    padding: 9px 10px;
    border-radius: 14px;
  }

  .nr-floating-card-icon {
    width: 31px;
    height: 31px;
    flex-basis: 31px;
    border-radius: 10px;
  }

  .nr-floating-card-icon svg {
    width: 17px;
    height: 17px;
  }

  .nr-floating-card strong {
    font-size: 10px;
    line-height: 1.3;
  }

  .nr-floating-card small {
    font-size: 8px;
    line-height: 1.3;
  }

  .nr-floating-card-booking {
    top: 45px;
    right: 0;
    left: auto;
  }

  .nr-floating-card-hotel {
    top: 222px;
    left: 0;
    right: auto;
  }

  .nr-floating-card-visa {
    left: 0;
    right: auto;
    bottom: 72px;
  }

  .nr-floating-card-rating {
    right: 0;
    left: auto;
    bottom: 5px;
  }

  html[dir="ltr"] .nr-floating-card-booking {
    left: 0;
    right: auto;
  }

  html[dir="ltr"] .nr-floating-card-hotel {
    right: 0;
    left: auto;
  }

  html[dir="ltr"] .nr-floating-card-visa {
    right: 0;
    left: auto;
  }

  html[dir="ltr"] .nr-floating-card-rating {
    left: 0;
    right: auto;
  }
}
  @media (max-width: 390px) {
  .nr-premium-copy h1 {
    font-size: 35px;
  }

  .nr-premium-trust {
    gap: 3px;
  }

  .nr-premium-visual {
    min-height: 515px;
  }

  .nr-premium-phone-back-wrap {
    width: 310px;
    inset-inline-start: -75px;
  }

  .nr-premium-phone-front-wrap {
    width: 188px;
    right: 8px;
  }

  .nr-floating-card {
    width: 142px;
  }

  .nr-floating-card-hotel {
    top: 205px;
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
function StarIcon(){return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9"><path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z"/></svg>}