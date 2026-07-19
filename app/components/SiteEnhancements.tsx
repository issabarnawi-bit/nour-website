"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const revealSelectors = [
  ".nr-goals",
  ".nr-about",
  ".nr-features",
  ".nr-journey",
  ".nr-showcase",
  ".nr-payments",
  ".nr-cta",
  ".nr-footer",
  ".nr-goals article",
  ".nr-feature-grid article",
  ".nr-journey-step",
  ".nr-payment-card",
  ".nr-payment-info-item",
].join(", ");

export default function SiteEnhancements() {
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const updateScroll = () => {
      const scrollTop = window.scrollY;
      const scrollableHeight =
        document.documentElement.scrollHeight - window.innerHeight;

      const nextProgress =
        scrollableHeight > 0
          ? Math.min((scrollTop / scrollableHeight) * 100, 100)
          : 0;

      setProgress(nextProgress);
      setShowTop(scrollTop > 550);
    };

    updateScroll();

    window.addEventListener("scroll", updateScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", updateScroll);
    };
  }, []);

  useEffect(() => {
    const elements =
      document.querySelectorAll<HTMLElement>(revealSelectors);

    if (!elements.length) return;

    elements.forEach((element, index) => {
      element.classList.add("nr-reveal");

      const delay = Math.min((index % 6) * 70, 350);

      element.style.setProperty(
        "--nr-reveal-delay",
        `${delay}ms`,
      );
    });

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;

          const element = entry.target as HTMLElement;

          element.classList.add("is-visible");
          observer.unobserve(element);
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -55px 0px",
      },
    );

    elements.forEach((element) => {
      observer.observe(element);
    });

    return () => {
      observer.disconnect();
    };
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  return (
    <>
      <div
        className="modern-scroll-progress"
        style={{ width: `${progress}%` }}
        aria-hidden="true"
      />

      <motion.a
        className="modern-whatsapp"
        href="https://wa.me/966567488377"
        target="_blank"
        rel="noreferrer"
        aria-label="التواصل عبر واتساب"
        initial={{
          opacity: 0,
          scale: 0.8,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        whileHover={{
          y: -4,
          scale: 1.05,
        }}
        whileTap={{
          scale: 0.92,
        }}
      >
        <span>◉</span>
      </motion.a>

      <AnimatePresence>
        {showTop && (
          <motion.button
            className="modern-back-top"
            type="button"
            aria-label="العودة إلى أعلى الصفحة"
            onClick={scrollToTop}
            initial={{
              opacity: 0,
              scale: 0.8,
              y: 12,
            }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
            }}
            exit={{
              opacity: 0,
              scale: 0.8,
              y: 12,
            }}
            whileHover={{
              y: -4,
            }}
            whileTap={{
              scale: 0.92,
            }}
          >
            ↑
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}