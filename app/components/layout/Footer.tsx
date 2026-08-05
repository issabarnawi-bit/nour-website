"use client";

import Image from "next/image";

import type {
  HomeCopy,
  Language,
} from "../../data/home";

import NewsletterSubscribeForm from "../../../src/features/subscribers/components/NewsletterSubscribeForm";
import { usePublicSettings } from "../../../src/features/settings/providers/PublicSettingsProvider";

type FooterProps = {
  t: HomeCopy;
  language: Language;
};

export default function Footer({
  t,
  language,
}: FooterProps) {
  const { getText } = usePublicSettings();

  const platformName = getText(
    language === "ar"
      ? "general.platform_name"
      : "general.platform_name_en",
    language === "ar"
      ? "نور آب"
      : "NourApp",
  );

  const supportPhone = getText(
    "contact.support_phone",
    "+966567488377",
  );

  const whatsappNumber = getText(
    "contact.whatsapp_number",
    supportPhone,
  );

  const supportEmail = getText(
    "contact.support_email",
    "support@nourappglobal.com",
  );

  const websiteUrl = getText(
    "contact.website_url",
    "https://nourappglobal.com",
  );

  const address = getText(
    language === "ar"
      ? "contact.address_ar"
      : "contact.address_en",
    language === "ar"
      ? "المملكة العربية السعودية"
      : "Saudi Arabia",
  );

  const normalizedPhone = supportPhone.replace(
    /[^\d+]/g,
    "",
  );

  const normalizedWhatsappNumber =
    whatsappNumber.replace(/\D/g, "");

  const whatsappUrl = normalizedWhatsappNumber
    ? `https://wa.me/${normalizedWhatsappNumber}`
    : "#";

  const normalizedWebsiteUrl =
    websiteUrl.startsWith("http://") ||
    websiteUrl.startsWith("https://")
      ? websiteUrl
      : `https://${websiteUrl}`;

  const displayedWebsite = websiteUrl
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");

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
                ? `اشترك في تحديثات ${platformName}`
                : `Subscribe to ${platformName} updates`}
            </h2>

            <p>
              {language === "ar"
                ? "احصل على أحدث البرامج والعروض والتحديثات المتعلقة بخدمات العمرة."
                : "Receive the latest programs, offers, and updates related to Umrah services."}
            </p>
          </div>

          <NewsletterSubscribeForm
            language={language}
          />
        </div>
      </section>

      <div className="nr-container nr-footer-content">
        <div className="nr-footer-brand">
          <Image
            src="/images/site/v-logo.png"
            alt={platformName}
            width={170}
            height={58}
          />

          <span>
            © {new Date().getFullYear()}{" "}
            {platformName}.{" "}
            {language === "ar"
              ? "جميع الحقوق محفوظة"
              : "All rights reserved"}
          </span>
        </div>

        <div className="nr-footer-contact">
  <a
    href={`tel:${normalizedPhone}`}
    dir="ltr"
  >
    {supportPhone}
  </a>

  <a
    href={`mailto:${supportEmail}`}
    dir="ltr"
  >
    {supportEmail}
  </a>

  <a
    href={whatsappUrl}
    target="_blank"
    rel="noopener noreferrer"
  >
    {language === "ar"
      ? "تواصل عبر واتساب"
      : "Contact via WhatsApp"}
  </a>

  <a
    href={normalizedWebsiteUrl}
    target="_blank"
    rel="noopener noreferrer"
    dir="ltr"
  >
    {displayedWebsite}
  </a>

  <span>{address}</span>
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