"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useMemo, useState } from "react";
import type { Language } from "../../../data/home";
import { testimonials } from "../../../data/testimonials";
import TestimonialCard from "./TestimonialCard";
import styles from "./Testimonials.module.css";

type Props = {
  language: Language;
};

export default function Testimonials({ language }: Props) {
  const featured = useMemo(
    () => testimonials.filter((item) => item.featured),
    [],
  );

  const [activeIndex, setActiveIndex] = useState(0);
  const [paused, setPaused] = useState(false);

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

  return (
    <section
      className={styles.section}
      id="testimonials"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocusCapture={() => setPaused(true)}
      onBlurCapture={() => setPaused(false)}
    >
      <div className={styles.glowTop} aria-hidden="true" />
      <div className={styles.glowBottom} aria-hidden="true" />

      <div className={styles.container}>
        <header className={styles.heading}>
          <span className={styles.kicker}>
            {language === "ar"
              ? "قصص وتجارب"
              : "Stories & experiences"}
          </span>

          <h2>
            {language === "ar"
              ? "ماذا قال معتمرونا عن تجربتهم؟"
              : "What did our pilgrims say about their experience?"}
          </h2>

          <p>
            {language === "ar"
              ? "تجارب حقيقية موثقة توضح جودة الخدمة، وسيتم استبدال البيانات التجريبية بالمراجعات المعتمدة لاحقًا."
              : "Verified experiences that reflect our service quality. Illustrative content will be replaced with approved reviews later."}
          </p>
        </header>

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
            <strong>
              {language === "ar"
                ? "تجارب موثوقة"
                : "Verified experiences"}
            </strong>
          </div>
        </div>

        <div
          className={styles.carousel}
          aria-live="polite"
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
        </div>

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

        <a className={styles.allReviews} href="#contact">
          <span>
            {language === "ar"
              ? "عرض جميع التجارب"
              : "View all experiences"}
          </span>
          <span aria-hidden="true">
            {language === "ar" ? "←" : "→"}
          </span>
        </a>
      </div>
    </section>
  );
}
