import { motion } from "framer-motion";
import type { HomeCopy, Language } from "../../data/home";
import { fadeUp } from "../../data/home";

export default function Journey({ t, language }: { t: HomeCopy; language: Language }) {
  return <section className="nr-journey" id="journey"><div className="nr-container">
    <motion.div className="nr-journey-heading" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={fadeUp}><span className="nr-kicker nr-journey-kicker">{t.journeyLabel}</span><h2>{t.journeyTitle}</h2><p>{t.journeyText}</p></motion.div>
    <motion.div className="nr-journey-steps" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.15 }} variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.14 } } }}>
      {t.journeySteps.map((step, index) => <motion.article className="nr-journey-step" key={step.number} variants={fadeUp} whileHover={{ y: -8 }}><div className="nr-step-top"><span className="nr-step-number">{step.number}</span><span className="nr-step-icon">{["⌕", "⇄", "✓", "◉"][index]}</span></div><h3>{step.title}</h3><p>{step.text}</p>{index < t.journeySteps.length - 1 && <span className="nr-step-arrow">{language === "ar" ? "←" : "→"}</span>}</motion.article>)}
    </motion.div>
  </div></section>;
}
