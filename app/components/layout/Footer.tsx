import Image from "next/image";

import type {
  HomeCopy,
  Language,
} from "../../data/home";

import NewsletterSubscribeForm from "../../../src/features/subscribers/components/NewsletterSubscribeForm";

type FooterProps = {
  t: HomeCopy;
  language: Language;
};

export default function Footer({
  t,
  language,
}: FooterProps) {
  return (
    <footer className="nr-footer">
      <section className="nr-newsletter">
        <div className="nr-container nr-newsletter-grid">
          <div className="nr-newsletter-copy">
            <span className="nr-kicker">
              {language === "ar"
                ? "ابقَ على اطلاع"
                : "Stay informed"}
            </span>

            <h2>
              {language === "ar"
                ? "اشترك في تحديثات نور آب"
                : "Subscribe to NourApp updates"}
            </h2>

            <p>
              {language === "ar"
                ? "احصل على أحدث البرامج والعروض والتحديثات المتعلقة بخدمات العمرة."
                : "Receive the latest programs, offers, and updates related to Umrah services."}
            </p>
          </div>

          <NewsletterSubscribeForm language={language} />
        </div>
      </section>

      <div className="nr-container nr-footer-content">
        <div className="nr-footer-brand">
          <Image
            src="/images/site/v-logo.png"
            alt="NourApp"
            width={170}
            height={58}
          />

          <span>{t.footer}</span>
        </div>

        <div className="nr-footer-contact">
          <a
            href="tel:+966567488377"
            dir="ltr"
          >
            +966 56 748 8377
          </a>

          <a
            href="https://NourAppappglobal.com"
            target="_blank"
            rel="noreferrer"
          >
            NourAppappglobal.com
          </a>
        </div>

        <div className="nr-footer-links">
          <a href="/privacy">
            {language === "ar"
              ? "سياسة الخصوصية"
              : "Privacy Policy"}
          </a>

          <a href="/terms">
            {language === "ar"
              ? "الشروط والأحكام"
              : "Terms and Conditions"}
          </a>
        </div>
      </div>
    </footer>
  );
}