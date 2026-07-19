"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

export default function SiteEnhancements() {
  const [progress, setProgress] = useState(0);
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const update = () => {
      const top = window.scrollY;
      const max = document.documentElement.scrollHeight - window.innerHeight;

      setProgress(max > 0 ? Math.min((top / max) * 100, 100) : 0);
      setShowTop(top > 550);
    };

    update();
    window.addEventListener("scroll", update, { passive: true });

    return () => window.removeEventListener("scroll", update);
  }, []);

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
        aria-label="WhatsApp"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        whileHover={{ y: -4, scale: 1.05 }}
      >
        <span>◉</span>
      </motion.a>

      <AnimatePresence>
        {showTop && (
          <motion.button
            className="modern-back-top"
            type="button"
            aria-label="Back to top"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            initial={{ opacity: 0, scale: 0.8, y: 12 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 12 }}
            whileHover={{ y: -4 }}
          >
            ↑
          </motion.button>
        )}
      </AnimatePresence>
    </>
  );
}