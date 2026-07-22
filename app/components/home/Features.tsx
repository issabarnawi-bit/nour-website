import { motion } from "framer-motion";
import type { HomeCopy } from "../../data/home";
import { fadeUp } from "../../data/home";
import FeatureIcon from "../shared/FeatureIcon";

export default function Features({ t }: { t: HomeCopy }) {
  return <section className="nr-features" id="features"><div className="nr-container"><div className="nr-heading"><span className="nr-kicker">{t.featuresLabel}</span><h2>{t.featuresTitle}</h2></div><div className="nr-feature-grid">{t.features.map(([title, text], i) => <motion.article key={title} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeUp}><FeatureIcon index={i} /><h3>{title}</h3><p>{text}</p></motion.article>)}</div></div></section>;
}
