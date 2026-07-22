"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { HomeCopy, Language } from "../../data/home";
import { appScreens, fadeUp } from "../../data/home";

type Props = { t: HomeCopy; language: Language; activeScreen: number; onScreenChange: (index: number) => void };

export default function Showcase({ t, language, activeScreen, onScreenChange }: Props) {
  return <section className="nr-showcase"><div className="nr-container nr-showcase-grid">
    <motion.div className="nour-screen-carousel" initial={{ opacity: 0, x: language === "ar" ? 110 : -110 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}>
      <div className="nour-screen-carousel-glow" aria-hidden="true" /><div className="nour-phone-frame"><span className="nour-phone-side-button nour-phone-side-button-one" aria-hidden="true" /><span className="nour-phone-side-button nour-phone-side-button-two" aria-hidden="true" /><span className="nour-phone-side-button nour-phone-side-button-three" aria-hidden="true" /><div className="nour-phone-screen" aria-live="polite"><span className="nour-phone-island" aria-hidden="true" />
        <AnimatePresence mode="wait" initial={false}><motion.div key={appScreens[activeScreen].src} className="nour-screen-slide" initial={{ opacity: 0, x: language === "ar" ? 60 : -60, scale: 0.985 }} animate={{ opacity: 1, x: 0, scale: 1 }} exit={{ opacity: 0, x: language === "ar" ? -60 : 60, scale: 0.985 }} transition={{ duration: 0.48, ease: [0.22, 1, 0.36, 1] }}><Image src={appScreens[activeScreen].src} alt={language === "ar" ? appScreens[activeScreen].altAr : appScreens[activeScreen].altEn} fill sizes="(max-width: 680px) 220px, 270px" className="nour-screen-image" priority={activeScreen === 0} /></motion.div></AnimatePresence>
        <span className="nour-phone-home-line" aria-hidden="true" /></div></div>
      <div className="nour-screen-dots" aria-label={language === "ar" ? "التنقل بين واجهات تطبيق نور" : "Navigate Nour app screens"}>{appScreens.map((screen, index) => <button key={screen.src} type="button" className={activeScreen === index ? "nour-screen-dot is-active" : "nour-screen-dot"} onClick={() => onScreenChange(index)} aria-label={language === "ar" ? `عرض شاشة التطبيق رقم ${index + 1}` : `Show app screen ${index + 1}`} aria-current={activeScreen === index ? "true" : undefined} />)}</div>
    </motion.div>
    <motion.div className="nr-showcase-copy" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={fadeUp}><h2>{t.showcaseTitle}</h2><p>{t.showcaseText}</p><ul><li>{language === "ar" ? "برامج وباقات واضحة" : "Clear programs and packages"}</li><li>{language === "ar" ? "تفاصيل الرحلة في مكان واحد" : "Journey details in one place"}</li><li>{language === "ar" ? "تجربة سريعة وآمنة" : "A fast and secure experience"}</li></ul></motion.div>
  </div></section>;
}
