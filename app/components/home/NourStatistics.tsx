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
    descriptionAr: "ضمن شبكة خدمات نور المتنامية",
    descriptionEn: "Across Nour's growing service network",
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

function AnimatedNumber({ value, start }: { value: number; start: boolean }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    if (!start) return;

    const duration = 1500;
    const startedAt = performance.now();
    let frameId = 0;

    const tick = (now: number) => {
      const progress = Math.min((now - startedAt) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayValue(Math.round(value * eased));

      if (progress < 1) frameId = requestAnimationFrame(tick);
    };

    frameId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameId);
  }, [start, value]);

  return <>{displayValue.toLocaleString("en-US")}</>;
}

export default function Statistics({ language }: { language: Language }) {
  const sectionRef = useRef<HTMLElement | null>(null);
  const isInView = useInView(sectionRef, { once: true, amount: 0.35 });

  return (
    <section className="nr-statistics" aria-labelledby="nr-statistics-title" ref={sectionRef}>
      <div className="nr-container">
        <motion.div
          className="nr-statistics-heading"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.3 }}
          variants={fadeUp}
        >
          <span className="nr-kicker nr-statistics-kicker">
            {language === "ar" ? "نور بالأرقام" : "Nour in Numbers"}
          </span>
          <h2 id="nr-statistics-title">
            {language === "ar"
              ? "رؤية تنمو لخدمة ضيوف الرحمن"
              : "A growing vision to serve the Guests of Allah"}
          </h2>
          <p>
            {language === "ar"
              ? "مؤشرات مستهدفة تعكس طموح نور في بناء منظومة موثوقة ومتكاملة لخدمات العمرة."
              : "Target indicators reflecting Nour's ambition to build a trusted, integrated Umrah services ecosystem."}
          </p>
        </motion.div>

        <div className="nr-statistics-grid">
          {statistics.map((stat, index) => (
            <motion.article
              key={stat.labelEn}
              className="nr-statistic-card"
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, amount: 0.25 }}
              variants={{
                hidden: { opacity: 0, y: 28 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.55, delay: index * 0.08 },
                },
              }}
            >
              <span className="nr-statistic-index" aria-hidden="true">
                {String(index + 1).padStart(2, "0")}
              </span>

              <strong className="nr-statistic-value" dir="ltr">
                <AnimatedNumber value={stat.value} start={isInView} />
                <span>{stat.suffix}</span>
              </strong>

              <h3>{language === "ar" ? stat.labelAr : stat.labelEn}</h3>
              <p>{language === "ar" ? stat.descriptionAr : stat.descriptionEn}</p>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}
