"use client";

import { AnimatePresence, motion, useMotionValue } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Language } from "../../../data/home";
import { testimonials } from "../../../data/testimonials";
import TestimonialCard from "./TestimonialCard";
import styles from "./Testimonials.module.css";

type Props = {
  language: Language;
};

const DRAG_THRESHOLD = 65;

export default function Testimonials({ language }: Props) {
  const featured = useMemo(
    () => testimonials.filter((item) => item.featured),
    [],
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const dragX = useMotionValue(0);

  const goTo = useCallback(
    (index: number) => {
      if (!featured.length) return;

      const next =
        ((index % featured.length) + featured.length) %
        featured.length;

      setActiveIndex(next);
    },
    [featured.length],
  );

  useEffect(() => {
    if (paused || featured.length < 2) return;

    const timer = window.setInterval(() => {
      setActiveIndex(
        (current) => (current + 1) % featured.length,
      );
    }, 5200);

    return () => window.clearInterval(timer);
  }, [featured.length, paused]);

  if (!featured.length) return null;

  const previousIndex =
    (activeIndex - 1 + featured.length) % featured.length;
  const nextIndex = (activeIndex + 1) % featured.length;

  const visibleItems = [
    {
      testimonial: featured[previousIndex],
      position: "previous" as const,
    },
    {
      testimonial: featured[activeIndex],
      position: "active" as const,
    },
    {
      testimonial: featured[nextIndex],
      position: "next" as const,
    },
  ];

  const stats = [
    {
      value: "+2500",
      labelAr: "معتمر",
      labelEn: "Pilgrims",
    },
    {
      value: "98%",
      labelAr: "رضا العملاء",
      labelEn: "Customer satisfaction",
    },
    {
      value: "4.9/5",
      labelAr: "متوسط التقييم",
      labelEn: "Average rating",
    },
  ];

  return (
    <section
      className={styles.section}
      id="testimonials"
      dir={language === "ar" ? "rtl" : "ltr"}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
      aria-labelledby="testimonials-title"
    >
      <div className={styles.glowTop} aria-hidden="true" />
      <div className={styles.glowBottom} aria-hidden="true" />

      <div className={styles.container}>
        <motion.header
          className={styles.heading}
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className={styles.kicker}>
            <span className={styles.kickerStars}>★★★★★</span>
            {language === "ar"
              ? "آراء من وثقوا ب نور آب"
              : "Stories from those who trusted NourApp"}
          </span>

          <h2 id="testimonials-title">
            {language === "ar"
              ? "تجارب تعكس جودة الخدمة وراحة الرحلة"
              : "Experiences that reflect service quality and journey comfort"}
          </h2>

          <p>
            {language === "ar"
              ? "مراجعات وتجارب توضح كيف ساعدت  نور آب المعتمرين على التخطيط والمتابعة بثقة ووضوح. سيتم استبدال البيانات التجريبية بالمراجعات الرسمية المعتمدة لاحقًا."
              : "Reviews that show how NourApp helped pilgrims plan and follow their journeys with confidence and clarity. Illustrative content will be replaced with approved reviews later."}
          </p>
        </motion.header>

        <motion.div
          className={styles.stats}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.35 }}
          variants={{
            hidden: {},
            visible: { transition: { staggerChildren: 0.1 } },
          }}
        >
          {stats.map((stat) => (
            <motion.div
              key={stat.value}
              className={styles.statItem}
              variants={{
                hidden: { opacity: 0, y: 18 },
                visible: {
                  opacity: 1,
                  y: 0,
                  transition: { duration: 0.5 },
                },
              }}
            >
              <strong>{stat.value}</strong>
              <span>
                {language === "ar" ? stat.labelAr : stat.labelEn}
              </span>
            </motion.div>
          ))}
        </motion.div>

        <div className={styles.topRow}>
          <div className={styles.arrows}>
            <button
              type="button"
              onClick={() => goTo(activeIndex - 1)}
              aria-label={
                language === "ar"
                  ? "التجربة السابقة"
                  : "Previous review"
              }
            >
              {language === "ar" ? "→" : "←"}
            </button>

            <button
              type="button"
              onClick={() => goTo(activeIndex + 1)}
              aria-label={
                language === "ar"
                  ? "التجربة التالية"
                  : "Next review"
              }
            >
              {language === "ar" ? "←" : "→"}
            </button>
          </div>

          <div className={styles.trustSummary}>
            <span className={styles.stars}>★★★★★</span>
            <div>
              <strong>
                {language === "ar"
                  ? "تجارب موثوقة"
                  : "Verified experiences"}
              </strong>
              <small>
                {language === "ar"
                  ? "تقييمات من رحلات وتجارب حقيقية"
                  : "Ratings from real journeys and experiences"}
              </small>
            </div>
          </div>
        </div>

        <motion.div
          className={styles.carousel}
          aria-live="polite"
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.12}
          style={{ x: dragX }}
          onDragStart={() => setPaused(true)}
          onDragEnd={(_, info) => {
            setPaused(false);

            if (info.offset.x > DRAG_THRESHOLD) {
              goTo(activeIndex - 1);
            } else if (info.offset.x < -DRAG_THRESHOLD) {
              goTo(activeIndex + 1);
            }

            dragX.set(0);
          }}
        >
          <AnimatePresence mode="popLayout" initial={false}>
            {visibleItems.map(({ testimonial, position }) => (
              <motion.div
                key={`${testimonial.id}-${position}`}
                className={`${styles.slot} ${styles[position]}`}
                layout
                initial={{ opacity: 0, scale: 0.94 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94 }}
                transition={{
                  duration: 0.45,
                  ease: [0.22, 1, 0.36, 1],
                }}
              >
                <TestimonialCard
                  testimonial={testimonial}
                  language={language}
                  active={position === "active"}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>

        <div className={styles.dots}>
          {featured.map((item, index) => (
            <button
              key={item.id}
              type="button"
              className={
                activeIndex === index
                  ? styles.activeDot
                  : ""
              }
              onClick={() => goTo(index)}
              aria-label={
                language === "ar"
                  ? `عرض التجربة رقم ${index + 1}`
                  : `Show review ${index + 1}`
              }
              aria-current={
                activeIndex === index ? "true" : undefined
              }
            />
          ))}
        </div>

        <motion.div
          className={styles.cta}
          initial={{ opacity: 0, y: 22 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.45 }}
          transition={{ duration: 0.55 }}
        >
          <div>
            <strong>
              {language === "ar"
                ? "انضم إلى آلاف المعتمرين الذين اختاروا  نور آب"
                : "Join thousands of pilgrims who chose NourApp"}
            </strong>
            <span>
              {language === "ar"
                ? "ابدأ التخطيط لرحلتك من مكان واحد"
                : "Start planning your journey from one place"}
            </span>
          </div>

          <a className={styles.allReviews} href="#programs">
            <span>
              {language === "ar"
                ? "ابدأ رحلتك الآن"
                : "Start your journey"}
            </span>
            <span aria-hidden="true">
              {language === "ar" ? "←" : "→"}
            </span>
          </a>
        </motion.div>
      </div>
    </section>
  );
}