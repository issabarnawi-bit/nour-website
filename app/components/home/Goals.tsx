import { motion } from "framer-motion";
import type { HomeCopy } from "../../data/home";
import { fadeUp } from "../../data/home";

export default function Goals({ t }: { t: HomeCopy }) {
  return <section className="nr-goals"><div className="nr-container"><h2>{t.goalsTitle}</h2><div className="nr-goals-grid">{t.goals.map(([title, text], i) => <motion.article key={title} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={fadeUp}><span>{String(i + 1).padStart(2, "0")}</span><h3>{title}</h3><p>{text}</p></motion.article>)}</div></div></section>;
}
