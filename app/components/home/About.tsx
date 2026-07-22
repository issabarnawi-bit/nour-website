import Image from "next/image";
import { motion } from "framer-motion";
import type { HomeCopy } from "../../data/home";
import { fadeUp } from "../../data/home";

export default function About({ t }: { t: HomeCopy }) {
  return <section className="nr-about" id="about"><div className="nr-container nr-about-grid"><motion.div className="nr-about-copy" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={fadeUp}><span className="nr-kicker">{t.aboutLabel}</span><h2>{t.aboutTitle}</h2><p>{t.aboutText}</p></motion.div><div className="nr-about-visual"><div className="nr-visual-blob" /><Image src="/images/site/rotated-left.png" alt="Nour programs screen" width={650} height={650} /></div></div></section>;
}
