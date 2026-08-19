"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { useLanguage } from "../../src/core/i18n";
import { createClient } from "../../src/lib/supabase/client";

import {
  getPublishedLegalPage,
} from "../../src/features/legal/services/public-legal.repository";

import {
  parseLegalContent,
} from "../../src/features/legal/utils/legal-content";

export default function PrivacyPage() {
  const { language } = useLanguage();
  const isArabic = language === "ar";

  const supabase = useMemo(() => createClient(), []);

  const [published, setPublished] = useState<{
    titleAr: string;
    titleEn: string;
    contentAr: string;
    contentEn: string;
    version: string;
    publishedAt: string;
  } | null>(null);

  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadPublishedPrivacy() {
      try {
        setLoadError("");

        const result = await getPublishedLegalPage(
          supabase,
          "privacy-policy",
        );

        if (mounted) {
          setPublished(result);
        }
      } catch (error) {
        if (!mounted) {
          return;
        }

        setLoadError(
          error instanceof Error
            ? error.message
            : isArabic
              ? "تعذر تحميل سياسة الخصوصية."
              : "Unable to load the Privacy Policy.",
        );
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    }

    void loadPublishedPrivacy();

    return () => {
      mounted = false;
    };
  }, [supabase, isArabic]);

  const pageTitle = published
    ? isArabic
      ? published.titleAr
      : published.titleEn
    : isArabic
      ? "سياسة الخصوصية"
      : "Privacy Policy";

  const publishedContent = published
    ? isArabic
      ? published.contentAr
      : published.contentEn
    : "";

  const sections = useMemo(
    () => parseLegalContent(publishedContent),
    [publishedContent],
  );

  const publishedDate = published?.publishedAt
    ? new Intl.DateTimeFormat(
        isArabic ? "ar-SA" : "en-US",
        {
          year: "numeric",
          month: "long",
          day: "numeric",
        },
      ).format(new Date(published.publishedAt))
    : null;

  return (
    <main className="legal-page" dir={isArabic ? "rtl" : "ltr"}>
      <div
        className="legal-page-glow legal-page-glow-one"
        aria-hidden="true"
      />
      <div
        className="legal-page-glow legal-page-glow-two"
        aria-hidden="true"
      />

      <header className="legal-header">
        <div
          className="container legal-navigation"
          aria-label={isArabic ? "التنقل القانوني" : "Legal navigation"}
        >
          <Link href="/" className="legal-brand">
            <Image
              src="/images/site/v-logo.png"
              alt={isArabic ? "شعار نور آب" : "NourApp logo"}
              width={92}
              height={92}
              priority
            />

            <span className="legal-brand-copy">
              <small>
                {isArabic
                  ? "رفيق رحلتك إلى العمرة"
                  : "Your companion for the Umrah journey"}
              </small>
            </span>
          </Link>

          <Link href="/" className="back-home">
            {isArabic ? "العودة إلى الرئيسية ←" : "← Back to Home"}
          </Link>
        </div>
      </header>

      <section className="legal-hero">
        <div className="container legal-hero-inner">
          <span className="section-label">
            <span aria-hidden="true">✦</span>{" "}
            {isArabic ? "الوثائق القانونية" : "Legal Documents"}
          </span>

          <h1>{pageTitle}</h1>

          <p>
            {isArabic
              ? "توضح هذه السياسة كيفية جمع بيانات المستخدمين واستخدامها وحمايتها عند استخدام موقع وتطبيق وخدمات منصة نور آب."
              : "This Policy explains how user data is collected, used, and protected when using the NourApp website, application, and services."}
          </p>

          {published ? (
            <div className="legal-meta">
              {publishedDate ? (
                <span>
                  {isArabic
                    ? `آخر تحديث: ${publishedDate}`
                    : `Last updated: ${publishedDate}`}
                </span>
              ) : null}

              <span>
                {isArabic
                  ? `الإصدار: ${published.version}`
                  : `Version: ${published.version}`}
              </span>
            </div>
          ) : null}
        </div>
      </section>

      <section className="legal-content-section">
        <div className="container legal-layout">
          {sections.length > 0 ? (
            <aside className="legal-sidebar">
              <strong>
                {isArabic ? "محتويات الصفحة" : "On this page"}
              </strong>

              <nav>
                {sections.map((section, index) => (
                  <a
                    href={`#section-${index + 1}`}
                    key={`${section.title}-${index}`}
                  >
                    {section.title}
                  </a>
                ))}
              </nav>
            </aside>
          ) : null}

          <article
            className="legal-document"
            aria-label={pageTitle}
          >
            {isLoading ? (
              <div className="legal-notice">
                {isArabic
                  ? "جارٍ تحميل النسخة المنشورة..."
                  : "Loading the published version..."}
              </div>
            ) : loadError ? (
              <div className="legal-notice">
                {isArabic
                  ? "تعذر تحميل سياسة الخصوصية حاليًا."
                  : "The Privacy Policy could not be loaded at this time."}
              </div>
            ) : sections.length === 0 ? (
              <div className="legal-notice">
                {isArabic
                  ? "لا توجد نسخة منشورة من سياسة الخصوصية حاليًا."
                  : "No published Privacy Policy is currently available."}
              </div>
            ) : (
              <>
                <div className="legal-notice">
                  {isArabic
                    ? "يرجى قراءة هذه السياسة بعناية قبل إنشاء حساب أو استخدام خدمات منصة نور آب."
                    : "Please read this Policy carefully before creating an account or using NourApp services."}
                </div>

                {sections.map((section, index) => (
                  <section
                    className="legal-section"
                    id={`section-${index + 1}`}
                    key={`${section.title}-${index}`}
                  >
                    <h2>{section.title}</h2>

                    {section.content?.map(
                      (paragraph, paragraphIndex) => (
                        <p key={`${index}-p-${paragraphIndex}`}>
                          {paragraph}
                        </p>
                      ),
                    )}

                    {section.items?.length ? (
                      <ul>
                        {section.items.map((item, itemIndex) => (
                          <li key={`${index}-i-${itemIndex}`}>
                            {item}
                          </li>
                        ))}
                      </ul>
                    ) : null}
                  </section>
                ))}
              </>
            )}
          </article>
        </div>
      </section>

      <footer className="legal-footer">
        <div className="legal-footer-orb" aria-hidden="true" />

        <div className="container">
          <span>
            {isArabic
              ? "© 2026 نور آب. جميع الحقوق محفوظة."
              : "© 2026 NourApp. All rights reserved."}
          </span>

          <div>
            <Link href="/privacy">
              {isArabic ? "سياسة الخصوصية" : "Privacy Policy"}
            </Link>

            <Link href="/terms">
              {isArabic ? "الشروط والأحكام" : "Terms & Conditions"}
            </Link>
          </div>
        </div>
      </footer>
    </main>
  );
}