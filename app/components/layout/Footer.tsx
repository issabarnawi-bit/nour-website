"use client";

import type { ComponentType } from "react";
import Image from "next/image";
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaTiktok,
  FaXTwitter,
  FaYoutube,
} from "react-icons/fa6";

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

type SocialIcon = ComponentType<{
  size?: number;
  "aria-hidden"?: boolean;
}>;

type SocialLink = {
  key: string;
  label: string;
  url: string;
  icon: SocialIcon;
};

function normalizeExternalUrl(value: string): string {
  const trimmedValue = value.trim();

  if (!trimmedValue) {
    return "";
  }

  if (
    trimmedValue.startsWith("http://") ||
    trimmedValue.startsWith("https://")
  ) {
    return trimmedValue;
  }

  return `https://${trimmedValue}`;
}

export default function Footer({
  language,
}: FooterProps) {
  const { getText } = usePublicSettings();

  const isArabic = language === "ar";

  const platformName = getText(
    isArabic
      ? "general.platform_name"
      : "general.platform_name_en",
    isArabic ? "نور آب" : "NourApp",
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
    isArabic
      ? "contact.address_ar"
      : "contact.address_en",
    isArabic
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
    : "";

  const normalizedWebsiteUrl =
    normalizeExternalUrl(websiteUrl);

  const displayedWebsite = websiteUrl
    .trim()
    .replace(/^https?:\/\//, "")
    .replace(/\/$/, "");

  const socialLinks: SocialLink[] = [
    {
      key: "facebook",
      label: "Facebook",
      url: getText(
        "social.facebook_url",
        "",
      ),
      icon: FaFacebookF,
    },
    {
      key: "instagram",
      label: "Instagram",
      url: getText(
        "social.instagram_url",
        "",
      ),
      icon: FaInstagram,
    },
    {
      key: "x",
      label: "X",
      url: getText(
        "social.x_url",
        "",
      ),
      icon: FaXTwitter,
    },
    {
      key: "youtube",
      label: "YouTube",
      url: getText(
        "social.youtube_url",
        "",
      ),
      icon: FaYoutube,
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      url: getText(
        "social.linkedin_url",
        "",
      ),
      icon: FaLinkedinIn,
    },
    {
      key: "tiktok",
      label: "TikTok",
      url: getText(
        "social.tiktok_url",
        "",
      ),
      icon: FaTiktok,
    },
  ]
    .filter(
      (socialLink) =>
        socialLink.url.trim().length > 0,
    )
    .map((socialLink) => ({
      ...socialLink,
      url: normalizeExternalUrl(
        socialLink.url,
      ),
    }));

  return (
    <footer className="nr-footer">
      <section className="nr-newsletter">
        <div className="nr-container nr-newsletter-grid">
          <div className="nr-newsletter-copy">
            <span className="nr-kicker">
              {isArabic
                ? "ابقَ على اطلاع"
                : "Stay informed"}
            </span>

            <h2>
              {isArabic
                ? `اشترك في تحديثات ${platformName}`
                : `Subscribe to ${platformName} updates`}
            </h2>

            <p>
              {isArabic
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
            {isArabic
              ? "جميع الحقوق محفوظة"
              : "All rights reserved"}
          </span>

          {socialLinks.length > 0 ? (
            <div
              className="nr-footer-social"
              aria-label={
                isArabic
                  ? "روابط التواصل الاجتماعي"
                  : "Social media links"
              }
            >
              {socialLinks.map(
                (socialLink) => {
                  const Icon =
                    socialLink.icon;

                  return (
                    <a
                      key={socialLink.key}
                      href={socialLink.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={
                        socialLink.label
                      }
                      title={
                        socialLink.label
                      }
                    >
                      <Icon
                        size={19}
                        aria-hidden={true}
                      />
                    </a>
                  );
                },
              )}
            </div>
          ) : null}
        </div>

        <div className="nr-footer-contact">
          {normalizedPhone ? (
            <a
              href={`tel:${normalizedPhone}`}
              dir="ltr"
            >
              {supportPhone}
            </a>
          ) : null}

          {supportEmail ? (
            <a
              href={`mailto:${supportEmail}`}
              dir="ltr"
            >
              {supportEmail}
            </a>
          ) : null}

          {whatsappUrl ? (
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
            >
              {isArabic
                ? "تواصل عبر واتساب"
                : "Contact via WhatsApp"}
            </a>
          ) : null}

          {normalizedWebsiteUrl ? (
            <a
              href={normalizedWebsiteUrl}
              target="_blank"
              rel="noopener noreferrer"
              dir="ltr"
            >
              {displayedWebsite}
            </a>
          ) : null}

          {address ? (
            <span>{address}</span>
          ) : null}
        </div>

        <div className="nr-footer-links">
          <a href="/privacy">
            {isArabic
              ? "سياسة الخصوصية"
              : "Privacy Policy"}
          </a>

          <a href="/terms">
            {isArabic
              ? "الشروط والأحكام"
              : "Terms and Conditions"}
          </a>
        </div>
      </div>
    </footer>
  );
}