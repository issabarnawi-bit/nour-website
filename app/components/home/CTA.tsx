import Image from "next/image";
import type { HomeCopy, Language } from "../../data/home";
import AppStoreBadge from "../shared/AppStoreBadge";

export default function CTA({ t, language }: { t: HomeCopy; language: Language }) {
  return <section className="nr-cta" id="contact"><div className="nr-container nr-cta-card"><div><h2>{t.ctaTitle}</h2><p>{t.ctaText}</p><div className="nr-store-buttons"><AppStoreBadge language={language} /><span className="nr-store-badge is-disabled" aria-label={language === "ar" ? "Google Play — قريبًا" : "Google Play — coming soon"}><Image src="/stores/google-play-badge.jpg" alt="Google Play" width={176} height={52} /></span><span className="nr-store-badge is-disabled" aria-label={language === "ar" ? "AppGallery — قريبًا" : "AppGallery — coming soon"}><Image src="/stores/appgallery-badge.jpg" alt="AppGallery" width={180} height={52} /></span></div></div><Image src="/images/site/front-view.png" alt="Nour app" width={300} height={540} /></div></section>;
}
