"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import type { Language } from "../../data/home";

type Props = { language: Language };

const metrics = [
  {
    id: "satisfaction",
    value: 98,
    suffix: "%",
    labelAr: "رضا العملاء",
    labelEn: "Customer satisfaction",
    noteAr: "مؤشر تجريبي حتى اعتماد البيانات الرسمية",
    noteEn: "Illustrative until official data is approved",
    icon: "rating",
  },
  {
    id: "pilgrims",
    value: 2500,
    suffix: "+",
    labelAr: "معتمر",
    labelEn: "Pilgrims",
    noteAr: "استفادوا من خدمات وتجارب نور",
    noteEn: "Served through Nour journeys and services",
    icon: "pilgrims",
  },
  {
    id: "countries",
    value: 18,
    suffix: "",
    labelAr: "دولة",
    labelEn: "Countries",
    noteAr: "نطاق خدمة قابل للتوسع",
    noteEn: "A growing international service network",
    icon: "countries",
  },
  {
    id: "support",
    value: 24,
    suffix: "/7",
    labelAr: "دعم متواصل",
    labelEn: "Continuous support",
    noteAr: "مساندة خلال مراحل الرحلة",
    noteEn: "Assistance throughout the journey",
    icon: "support",
  },
] as const;

function AnimatedNumber({ value, suffix }: { value: number; suffix: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!inView) return;

    const duration = 1350;
    const startTime = performance.now();

    const update = (now: number) => {
      const progress = Math.min((now - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(value * eased));

      if (progress < 1) requestAnimationFrame(update);
    };

    const frame = requestAnimationFrame(update);
    return () => cancelAnimationFrame(frame);
  }, [inView, value]);

  return (
    <span ref={ref} className="nr-trust-metric-value">
      {new Intl.NumberFormat("en-US").format(displayValue)}
      {suffix}
    </span>
  );
}

export default function TrustMetrics({ language }: Props) {
  return (
    <section className="nr-trust-metrics" aria-labelledby="trust-metrics-title">
      <div className="nr-container">
        <motion.div
          className="nr-trust-metrics-heading"
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="nr-trust-metrics-stars">★★★★★</span>
          <span className="nr-trust-metrics-kicker">
            {language === "ar" ? "ثقة تبدأ من التجربة" : "Trust built through experience"}
          </span>
          <h2 id="trust-metrics-title">
            {language === "ar"
              ? "أرقام تعكس التزام نور بخدمة المعتمرين"
              : "Numbers that reflect Nour’s commitment to pilgrims"}
          </h2>
          <p>
            {language === "ar"
              ? "المؤشرات المعروضة حاليًا تجريبية، وسيتم استبدالها بالأرقام الرسمية المعتمدة عند توفرها."
              : "These metrics are currently illustrative and will be replaced with approved official figures."}
          </p>
        </motion.div>

        <motion.div
          className="nr-trust-metrics-grid"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.15 }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.12 } } }}
        >
          {metrics.map((metric, index) => (
            <motion.article
              key={metric.id}
              className="nr-trust-metric-card"
              variants={{
                hidden: { opacity: 0, y: 28 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.58, ease: [0.22, 1, 0.36, 1] },
                },
              }}
              whileHover={{ y: -8 }}
            >
              <div className="nr-trust-metric-top">
                <span className="nr-trust-metric-icon">
                  <MetricIcon type={metric.icon} />
                </span>
                <span className="nr-trust-metric-index">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <AnimatedNumber value={metric.value} suffix={metric.suffix} />
              <h3>{language === "ar" ? metric.labelAr : metric.labelEn}</h3>
              <p>{language === "ar" ? metric.noteAr : metric.noteEn}</p>
              <span className="nr-trust-metric-line" />
            </motion.article>
          ))}
        </motion.div>
      </div>

      <style jsx global>{`
        .nr-trust-metrics {
          position: relative;
          overflow: hidden;
          padding: 104px 0;
          color: #fff;
          background:
            radial-gradient(circle at 12% 18%, rgba(23,111,232,.14), transparent 28%),
            radial-gradient(circle at 88% 80%, rgba(255,195,19,.12), transparent 27%),
            linear-gradient(145deg, #07182d 0%, #0a274a 54%, #0c315c 100%);
        }

        .nr-trust-metrics::before {
          content: "";
          position: absolute;
          inset: 0;
          opacity: .18;
          pointer-events: none;
          background-image:
            linear-gradient(rgba(255,255,255,.08) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.08) 1px, transparent 1px);
          background-size: 48px 48px;
          mask-image: linear-gradient(to bottom, transparent, #000 20%, #000 80%, transparent);
        }

        .nr-trust-metrics .nr-container { position: relative; z-index: 2; }
        .nr-trust-metrics-heading { max-width: 790px; margin-bottom: 44px; }
        .nr-trust-metrics-stars {
          display: block;
          margin-bottom: 10px;
          color: #ffc313;
          font-size: 16px;
          letter-spacing: .15em;
        }

        .nr-trust-metrics-kicker {
          display: inline-flex;
          min-height: 33px;
          align-items: center;
          padding-inline: 13px;
          border: 1px solid rgba(255,255,255,.13);
          border-radius: 999px;
          color: #dceaff;
          background: rgba(255,255,255,.08);
          font-size: 12px;
          font-weight: 900;
          backdrop-filter: blur(12px);
        }

        .nr-trust-metrics-heading h2 {
          margin: 17px 0 14px;
          color: #fff;
          font-size: clamp(34px, 4vw, 54px);
          line-height: 1.28;
        }

        .nr-trust-metrics-heading p {
          max-width: 720px;
          margin: 0;
          color: rgba(255,255,255,.7);
          font-size: 15px;
          line-height: 1.9;
        }

        .nr-trust-metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0,1fr));
          gap: 18px;
        }

        .nr-trust-metric-card {
          position: relative;
          min-height: 285px;
          overflow: hidden;
          padding: 24px;
          border: 1px solid rgba(255,255,255,.12);
          border-radius: 25px;
          background: linear-gradient(145deg, rgba(255,255,255,.11), rgba(255,255,255,.045));
          box-shadow: 0 24px 62px rgba(0,0,0,.18);
          backdrop-filter: blur(16px);
          transition: border-color .24s ease, box-shadow .24s ease;
        }

        .nr-trust-metric-card::before {
          content: "";
          position: absolute;
          width: 170px;
          height: 170px;
          inset-inline-end: -85px;
          bottom: -105px;
          border-radius: 50%;
          background: rgba(23,111,232,.18);
          transition: transform .35s ease;
        }

        .nr-trust-metric-card:hover {
          border-color: rgba(255,195,19,.38);
          box-shadow: 0 34px 78px rgba(0,0,0,.26);
        }

        .nr-trust-metric-card:hover::before { transform: scale(1.18); }

        .nr-trust-metric-top {
          position: relative;
          z-index: 2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 28px;
        }

        .nr-trust-metric-icon {
          width: 50px;
          height: 50px;
          display: grid;
          place-items: center;
          border-radius: 15px;
          color: #102b4e;
          background: #ffc313;
          box-shadow: 0 14px 30px rgba(255,195,19,.2);
        }

        .nr-trust-metric-icon svg { width: 24px; height: 24px; }
        .nr-trust-metric-index {
          color: rgba(255,255,255,.27);
          font-size: 25px;
          font-weight: 900;
        }

        .nr-trust-metric-value {
          position: relative;
          z-index: 2;
          display: block;
          color: #fff;
          font-size: clamp(40px, 4vw, 54px);
          font-weight: 950;
          line-height: 1;
          letter-spacing: -.035em;
        }

        .nr-trust-metric-card h3 {
          position: relative;
          z-index: 2;
          margin: 13px 0 7px;
          color: #fff;
          font-size: 18px;
        }

        .nr-trust-metric-card p {
          position: relative;
          z-index: 2;
          margin: 0;
          color: rgba(255,255,255,.62);
          font-size: 12px;
          line-height: 1.75;
        }

        .nr-trust-metric-line {
          position: absolute;
          inset-inline-start: 24px;
          bottom: 21px;
          z-index: 2;
          width: 42px;
          height: 3px;
          border-radius: 999px;
          background: #ffc313;
          transition: width .25s ease;
        }

        .nr-trust-metric-card:hover .nr-trust-metric-line { width: 76px; }

        @media (max-width: 1020px) {
          .nr-trust-metrics-grid { grid-template-columns: repeat(2, minmax(0,1fr)); }
        }

        @media (max-width: 620px) {
          .nr-trust-metrics { padding: 76px 0; }
          .nr-trust-metrics-heading { margin-bottom: 30px; }
          .nr-trust-metrics-grid { grid-template-columns: 1fr; gap: 13px; }
          .nr-trust-metric-card { min-height: 235px; }
        }
      `}</style>
    </section>
  );
}

function MetricIcon({ type }: { type: (typeof metrics)[number]["icon"] }) {
  if (type === "rating") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
        <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" strokeLinejoin="round" />
      </svg>
    );
  }

  if (type === "pilgrims") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
        <circle cx="9" cy="8" r="3" />
        <path d="M3.5 20c.5-4 2.3-6 5.5-6s5 2 5.5 6" strokeLinecap="round" />
        <circle cx="17" cy="9" r="2.4" />
        <path d="M15.4 14.6c3.2-.1 4.7 1.6 5.1 4.9" strokeLinecap="round" />
      </svg>
    );
  }

  if (type === "countries") {
    return (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
        <circle cx="12" cy="12" r="9" />
        <path d="M3 12h18M12 3c2.2 2.5 3.3 5.5 3.3 9S14.2 18.5 12 21M12 3C9.8 5.5 8.7 8.5 8.7 12S9.8 18.5 12 21" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9">
      <path d="M4 13v-2a8 8 0 0 1 16 0v2" strokeLinecap="round" />
      <path d="M4 13a2 2 0 0 0 2 2h1v-6H6a2 2 0 0 0-2 2v2ZM20 13a2 2 0 0 1-2 2h-1v-6h1a2 2 0 0 1 2 2v2Z" />
      <path d="M17 17c-.7 2-2.3 3-5 3" strokeLinecap="round" />
    </svg>
  );
}