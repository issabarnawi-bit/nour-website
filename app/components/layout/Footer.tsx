import Image from "next/image";
import type { HomeCopy, Language } from "../../data/home";

export default function Footer({ t, language }: { t: HomeCopy; language: Language }) {
  return <footer className="nr-footer"><div className="nr-container nr-footer-content">
    <div className="nr-footer-brand"><Image src="/images/site/v-logo.png" alt="Nour" width={170} height={58} /><span>{t.footer}</span></div>
    <div className="nr-footer-contact"><a href="tel:+966567488377" dir="ltr">+966 56 748 8377</a><a href="https://nourappglobal.com" target="_blank" rel="noreferrer">nourappglobal.com</a></div>
    <div className="nr-footer-links"><a href="/privacy">{language === "ar" ? "سياسة الخصوصية" : "Privacy Policy"}</a><a href="/terms">{language === "ar" ? "الشروط والأحكام" : "Terms and Conditions"}</a></div>
  </div></footer>;
}
