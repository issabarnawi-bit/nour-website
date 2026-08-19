"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  FileClock,
  FileText,
  UserRound,
} from "lucide-react";

import { useLanguage } from "../../../../../src/core/i18n";
import { createClient } from "../../../../../src/lib/supabase/client";
import {
  getLegalPageById,
  getLegalPageVersions,
} from "../../../../../src/features/legal/services/legal.repository";
import type {
  LegalPage,
  LegalPageVersion,
} from "../../../../../src/features/legal/types/legal";

const copy = {
  ar: {
    back: "العودة إلى التعديل",
    kicker: "المحتوى القانوني",
    title: (name: string) => `سجل إصدارات ${name}`,
    subtitle: "يعرض هذا السجل جميع النسخ التي تم نشرها رسميًا.",
    count: "عدد الإصدارات",
    loading: "جاري تحميل سجل الإصدارات...",
    notFound: "لم يتم العثور على الصفحة القانونية.",
    backToLegal: "العودة إلى المحتوى القانوني",
    noVersions: "لا توجد إصدارات منشورة بعد",
    noVersionsText: "عندما يتم نشر أول إصدار سيظهر هنا تلقائيًا.",
    version: "الإصدار",
    latest: "أحدث إصدار",
    publishedAt: "تاريخ النشر",
    publisher: "الناشر",
    unavailable: "غير متاح",
    arabicTitle: "العنوان العربي",
    englishTitle: "العنوان الإنجليزي",
    showArabic: "عرض المحتوى العربي",
    showEnglish: "عرض المحتوى الإنجليزي",
    loadError: "تعذر تحميل سجل الإصدارات.",
  },
  en: {
    back: "Back to edit",
    kicker: "Legal Content",
    title: (name: string) => `${name} Version History`,
    subtitle: "This history shows every version that was officially published.",
    count: "Versions",
    loading: "Loading version history...",
    notFound: "The legal page could not be found.",
    backToLegal: "Back to Legal Content",
    noVersions: "No published versions yet",
    noVersionsText:
      "The first published version will appear here automatically.",
    version: "Version",
    latest: "Latest version",
    publishedAt: "Published at",
    publisher: "Publisher",
    unavailable: "Unavailable",
    arabicTitle: "Arabic title",
    englishTitle: "English title",
    showArabic: "View Arabic content",
    showEnglish: "View English content",
    loadError: "Unable to load version history.",
  },
} as const;

export default function AdminLegalVersionsPage() {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const t = copy[language];

  const params = useParams<{ id: string }>();
  const legalPageId =
    typeof params?.id === "string" ? params.id : "";

  const supabase = useMemo(() => createClient(), []);

  const [page, setPage] = useState<LegalPage | null>(null);
  const [versions, setVersions] = useState<LegalPageVersion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let mounted = true;

    async function loadData() {
      if (!legalPageId) return;

      try {
        setIsLoading(true);
        setErrorMessage("");

        const [legalPage, legalVersions] = await Promise.all([
          getLegalPageById(supabase, legalPageId),
          getLegalPageVersions(supabase, legalPageId),
        ]);

        if (!mounted) return;

        setPage(legalPage);
        setVersions(legalVersions);
      } catch (error) {
        if (!mounted) return;

        setErrorMessage(
          error instanceof Error ? error.message : t.loadError,
        );
      } finally {
        if (mounted) setIsLoading(false);
      }
    }

    void loadData();

    return () => {
      mounted = false;
    };
  }, [legalPageId, supabase, t.loadError]);

  function formatDate(value: string) {
    return new Intl.DateTimeFormat(
      isArabic ? "ar-SA" : "en-US",
      {
        dateStyle: "medium",
        timeStyle: "short",
      },
    ).format(new Date(value));
  }

  const BackIcon = isArabic ? ArrowRight : ArrowLeft;

  if (isLoading) {
    return (
      <main className="legal-versions-page" dir={isArabic ? "rtl" : "ltr"}>
        <div className="legal-versions-card">{t.loading}</div>
        <style>{styles}</style>
      </main>
    );
  }

  if (!page) {
    return (
      <main className="legal-versions-page" dir={isArabic ? "rtl" : "ltr"}>
        <div className="legal-versions-card">
          <p>{errorMessage || t.notFound}</p>
          <Link href="/admin/legal" className="legal-versions-button">
            {t.backToLegal}
          </Link>
        </div>
        <style>{styles}</style>
      </main>
    );
  }

  const displayTitle = isArabic ? page.titleAr : page.titleEn;

  return (
    <main className="legal-versions-page" dir={isArabic ? "rtl" : "ltr"}>
      <header className="legal-versions-header">
        <div>
          <Link
            href={`/admin/legal/${page.id}`}
            className="legal-versions-back"
          >
            <BackIcon size={17} strokeWidth={1.9} />
            {t.back}
          </Link>

          <span className="legal-versions-kicker">{t.kicker}</span>
          <h1>{t.title(displayTitle)}</h1>
          <p>{t.subtitle}</p>
        </div>

        <div className="legal-versions-summary">
          <span>{t.count}</span>
          <strong>{versions.length}</strong>
        </div>
      </header>

      {errorMessage ? (
        <div className="legal-versions-message">{errorMessage}</div>
      ) : null}

      {versions.length === 0 ? (
        <section className="legal-versions-empty">
          <FileClock size={34} strokeWidth={1.7} />
          <h2>{t.noVersions}</h2>
          <p>{t.noVersionsText}</p>
          <Link
            href={`/admin/legal/${page.id}`}
            className="legal-versions-button"
          >
            {t.back}
          </Link>
        </section>
      ) : (
        <section className="legal-versions-list">
          {versions.map((version, index) => (
            <article key={version.id} className="legal-versions-card">
              <div className="legal-version-top">
                <div className="legal-version-title">
                  <span className="legal-version-icon">
                    <FileText size={20} strokeWidth={1.9} />
                  </span>

                  <div>
                    <span className="legal-version-label">{t.version}</span>
                    <h2>{version.version}</h2>
                  </div>
                </div>

                {index === 0 ? (
                  <span className="legal-version-current">{t.latest}</span>
                ) : null}
              </div>

              <div className="legal-version-meta">
                <div>
                  <CalendarDays size={17} strokeWidth={1.8} />
                  <span>{t.publishedAt}</span>
                  <strong>{formatDate(version.publishedAt)}</strong>
                </div>

                <div>
                  <UserRound size={17} strokeWidth={1.8} />
                  <span>{t.publisher}</span>
                  <strong title={version.publishedBy ?? undefined}>
                    {version.publishedBy
                      ? `${version.publishedBy.slice(0, 8)}…`
                      : t.unavailable}
                  </strong>
                </div>
              </div>

              <div className="legal-version-headings">
                <div>
                  <span>{t.arabicTitle}</span>
                  <strong dir="rtl">{version.titleAr}</strong>
                </div>

                <div>
                  <span>{t.englishTitle}</span>
                  <strong dir="ltr">{version.titleEn}</strong>
                </div>
              </div>

              <div className="legal-version-content-grid">
                <details>
                  <summary>{t.showArabic}</summary>
                  <div className="legal-version-content" dir="rtl">
                    {version.contentAr}
                  </div>
                </details>

                <details>
                  <summary>{t.showEnglish}</summary>
                  <div className="legal-version-content" dir="ltr">
                    {version.contentEn}
                  </div>
                </details>
              </div>
            </article>
          ))}
        </section>
      )}

      <style>{styles}</style>
    </main>
  );
}

const styles = `
  .legal-versions-page {
    display: flex;
    flex-direction: column;
    gap: 22px;
    width: 100%;
    color: var(--nour-text-primary, #15233b);
  }

  .legal-versions-header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 24px;
  }

  .legal-versions-back {
    display: inline-flex;
    align-items: center;
    gap: 7px;
    margin-bottom: 16px;
    color: var(--nour-primary, #176fe8);
    text-decoration: none;
    font-size: 13px;
    font-weight: 800;
  }

  .legal-versions-kicker {
    display: block;
    color: var(--nour-primary, #176fe8);
    font-size: 12px;
    font-weight: 800;
  }

  .legal-versions-header h1 {
    margin: 7px 0 6px;
    color: var(--nour-text-primary, #15233b);
    font-size: clamp(26px, 3vw, 36px);
    line-height: 1.3;
  }

  .legal-versions-header p {
    margin: 0;
    color: var(--nour-text-secondary, #667085);
  }

  .legal-versions-summary,
  .legal-versions-card,
  .legal-versions-empty {
    border: 1px solid var(--nour-border, #e7eaf0);
    background: var(--nour-surface, #ffffff);
    color: var(--nour-text-primary, #15233b);
  }

  .legal-versions-summary {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 120px;
    padding: 15px 18px;
    border-radius: 16px;
  }

  .legal-versions-summary span,
  .legal-version-label,
  .legal-version-meta span,
  .legal-version-headings span {
    color: var(--nour-text-secondary, #667085);
    font-size: 12px;
  }

  .legal-versions-summary strong {
    font-size: 24px;
  }

  .legal-versions-list {
    display: flex;
    flex-direction: column;
    gap: 18px;
  }

  .legal-versions-card {
    padding: 22px;
    border-radius: 20px;
    box-shadow: 0 12px 30px rgba(15, 23, 42, 0.04);
  }

  .legal-version-top {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    gap: 18px;
    margin-bottom: 18px;
  }

  .legal-version-title {
    display: flex;
    align-items: center;
    gap: 12px;
  }

  .legal-version-icon {
    display: grid;
    place-items: center;
    width: 44px;
    height: 44px;
    border-radius: 13px;
    background: rgba(23, 111, 232, 0.1);
    color: var(--nour-primary, #176fe8);
  }

  .legal-version-title h2 {
    margin: 2px 0 0;
    color: var(--nour-text-primary, #15233b);
    font-size: 22px;
  }

  .legal-version-current {
    display: inline-flex;
    align-items: center;
    min-height: 34px;
    padding: 0 12px;
    border-radius: 999px;
    background: rgba(24, 121, 78, 0.12);
    color: #18794e;
    font-size: 12px;
    font-weight: 800;
  }

  .legal-version-meta,
  .legal-version-headings,
  .legal-version-content-grid {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 12px;
  }

  .legal-version-meta {
    margin-bottom: 14px;
  }

  .legal-version-meta > div {
    display: grid;
    grid-template-columns: auto 1fr auto;
    align-items: center;
    gap: 8px;
    min-width: 0;
    padding: 12px 14px;
    border: 1px solid var(--nour-border, #e7eaf0);
    border-radius: 13px;
    background: var(--nour-surface-muted, #f8fafc);
  }

  .legal-version-meta strong {
    overflow: hidden;
    color: var(--nour-text-primary, #15233b);
    text-overflow: ellipsis;
    white-space: nowrap;
    font-size: 13px;
  }

  .legal-version-headings {
    margin-bottom: 14px;
  }

  .legal-version-headings > div {
    display: flex;
    flex-direction: column;
    gap: 5px;
    padding: 13px 14px;
    border: 1px solid var(--nour-border, #e7eaf0);
    border-radius: 13px;
    background: var(--nour-surface-muted, #f8fafc);
  }

  .legal-version-headings strong {
    color: var(--nour-text-primary, #15233b);
    font-size: 14px;
  }

  .legal-version-content-grid details {
    overflow: hidden;
    border: 1px solid var(--nour-border, #e7eaf0);
    border-radius: 13px;
    background: var(--nour-surface-muted, #f8fafc);
  }

  .legal-version-content-grid summary {
    padding: 13px 14px;
    cursor: pointer;
    color: var(--nour-text-primary, #15233b);
    font-size: 13px;
    font-weight: 800;
  }

  .legal-version-content {
    max-height: 360px;
    overflow: auto;
    padding: 16px;
    border-top: 1px solid var(--nour-border, #e7eaf0);
    background: var(--nour-surface, #ffffff);
    color: var(--nour-text-primary, #15233b);
    white-space: pre-wrap;
    line-height: 1.9;
    font-size: 13px;
  }

  .legal-versions-empty {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: 8px;
    min-height: 300px;
    padding: 28px;
    border-style: dashed;
    border-radius: 20px;
    text-align: center;
  }

  .legal-versions-empty h2 {
    margin: 8px 0 0;
    color: var(--nour-text-primary, #15233b);
  }

  .legal-versions-empty p {
    margin: 0 0 10px;
    color: var(--nour-text-secondary, #667085);
  }

  .legal-versions-button {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-height: 42px;
    padding: 0 16px;
    border: 1px solid var(--nour-border, #dfe4ec);
    border-radius: 12px;
    background: var(--nour-surface-muted, #f8fafc);
    color: var(--nour-text-primary, #15233b);
    text-decoration: none;
    font-size: 13px;
    font-weight: 800;
  }

  .legal-versions-message {
    padding: 13px 15px;
    border-radius: 13px;
    background: rgba(180, 35, 24, 0.1);
    color: #d92d20;
    font-size: 13px;
    font-weight: 700;
  }

  @media (max-width: 800px) {
    .legal-versions-header {
      flex-direction: column;
    }

    .legal-version-meta,
    .legal-version-headings,
    .legal-version-content-grid {
      grid-template-columns: 1fr;
    }

    .legal-versions-summary {
      width: 100%;
    }
  }
`;