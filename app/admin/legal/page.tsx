"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { FileText, History, PencilLine } from "lucide-react";

import { useLanguage } from "../../../src/core/i18n";
import { createClient } from "../../../src/lib/supabase/client";
import { getLegalPages } from "../../../src/features/legal/services/legal.repository";
import type { LegalPage } from "../../../src/features/legal/types/legal";

const copy = {
  ar: {
    kicker: "إدارة المحتوى",
    title: "المحتوى القانوني",
    description: "إدارة سياسة الخصوصية والشروط والأحكام والإصدارات المنشورة.",
    loading: "جاري تحميل المحتوى القانوني...",
    loadError: "تعذر تحميل المحتوى القانوني.",
    policy: "سياسة",
    terms: "شروط",
    draft: "مسودة",
    published: "منشور",
    inactive: "غير نشط",
    version: "الإصدار",
    lastPublished: "آخر نشر",
    neverPublished: "لم ينشر بعد",
    edit: "تعديل المحتوى",
    versions: "سجل الإصدارات",
    empty: "لا يوجد محتوى قانوني حاليًا.",
  },
  en: {
    kicker: "Content Management",
    title: "Legal Content",
    description:
      "Manage the Privacy Policy, Terms and Conditions, and published versions.",
    loading: "Loading legal content...",
    loadError: "Unable to load legal content.",
    policy: "Policy",
    terms: "Terms",
    draft: "Draft",
    published: "Published",
    inactive: "Inactive",
    version: "Version",
    lastPublished: "Last published",
    neverPublished: "Not published yet",
    edit: "Edit content",
    versions: "Version history",
    empty: "No legal content is available.",
  },
} as const;

export default function AdminLegalPage() {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const t = copy[language];

  const supabase = useMemo(() => createClient(), []);

  const [pages, setPages] = useState<LegalPage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");

  useEffect(() => {
    let isMounted = true;

    async function loadLegalPages() {
      try {
        setIsLoading(true);
        setErrorMessage("");

        const result = await getLegalPages(supabase);

        if (!isMounted) return;
        setPages(result);
      } catch (error) {
        if (!isMounted) return;

        setErrorMessage(
          error instanceof Error ? error.message : t.loadError,
        );
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    void loadLegalPages();

    return () => {
      isMounted = false;
    };
  }, [supabase, t.loadError]);

  const formatPublishedAt = (value: string | null) => {
    if (!value) return t.neverPublished;

    return new Intl.DateTimeFormat(isArabic ? "ar-SA" : "en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  };

  const getStatusLabel = (status: LegalPage["status"]) => {
    if (status === "published") return t.published;
    if (status === "inactive") return t.inactive;
    return t.draft;
  };

  return (
    <main
      className="legal-admin-page"
      dir={isArabic ? "rtl" : "ltr"}
    >
      <header className="legal-admin-header">
        <div>
          <span className="legal-admin-kicker">{t.kicker}</span>
          <h1>{t.title}</h1>
          <p>{t.description}</p>
        </div>
      </header>

      {isLoading ? (
        <div className="legal-admin-panel">{t.loading}</div>
      ) : null}

      {errorMessage ? (
        <div className="legal-admin-message legal-admin-message-error">
          {errorMessage}
        </div>
      ) : null}

      {!isLoading && !errorMessage && pages.length === 0 ? (
        <div className="legal-admin-panel">{t.empty}</div>
      ) : null}

      {!isLoading && !errorMessage && pages.length > 0 ? (
        <section className="legal-admin-grid">
          {pages.map((page) => (
            <article key={page.id} className="legal-admin-card">
              <div className="legal-admin-card-top">
                <div>
                  <span className="legal-admin-type">
                    <FileText size={14} strokeWidth={2} />
                    {page.key === "privacy-policy" ? t.policy : t.terms}
                  </span>

                  <h2>{isArabic ? page.titleAr : page.titleEn}</h2>
                  <p>{isArabic ? page.titleEn : page.titleAr}</p>
                </div>

                <span
                  className={`legal-status legal-status-${page.status}`}
                >
                  {getStatusLabel(page.status)}
                </span>
              </div>

              <div className="legal-admin-meta">
                <div>
                  <span>{t.version}</span>
                  <strong>{page.version}</strong>
                </div>

                <div>
                  <span>{t.lastPublished}</span>
                  <strong>{formatPublishedAt(page.publishedAt)}</strong>
                </div>
              </div>

              <div className="legal-admin-actions">
                <Link
                  href={`/admin/legal/${page.id}`}
                  className="legal-admin-button legal-admin-button-primary"
                >
                  <PencilLine size={16} strokeWidth={1.9} />
                  {t.edit}
                </Link>

                <Link
                  href={`/admin/legal/${page.id}/versions`}
                  className="legal-admin-button legal-admin-button-secondary"
                >
                  <History size={16} strokeWidth={1.9} />
                  {t.versions}
                </Link>
              </div>
            </article>
          ))}
        </section>
      ) : null}

      <style jsx>{`
        .legal-admin-page {
          display: flex;
          flex-direction: column;
          gap: 22px;
          width: 100%;
          color: var(--nour-text-primary, #15233b);
        }

        .legal-admin-header h1 {
          margin: 7px 0 6px;
          font-size: clamp(27px, 3vw, 36px);
          line-height: 1.25;
          color: var(--nour-text-primary, #15233b);
        }

        .legal-admin-header p {
          margin: 0;
          color: var(--nour-text-secondary, #667085);
        }

        .legal-admin-kicker {
          color: var(--nour-primary, #176fe8);
          font-size: 12px;
          font-weight: 800;
        }

        .legal-admin-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 24px;
        }

        .legal-admin-card,
        .legal-admin-panel {
          border: 1px solid var(--nour-border, #e7eaf0);
          border-radius: 20px;
          background: var(--nour-surface, #ffffff);
          color: var(--nour-text-primary, #15233b);
          box-shadow: 0 12px 30px rgba(15, 23, 42, 0.05);
        }

        .legal-admin-card {
          display: flex;
          flex-direction: column;
          gap: 24px;
          padding: 24px;
        }

        .legal-admin-panel {
          padding: 22px;
        }

        .legal-admin-card-top {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 20px;
        }

        .legal-admin-card h2 {
          margin: 9px 0 4px;
          color: var(--nour-text-primary, #15233b);
          font-size: 22px;
          line-height: 1.4;
        }

        .legal-admin-card p {
          margin: 0;
          color: var(--nour-text-secondary, #667085);
        }

        .legal-admin-type {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          padding: 6px 10px;
          border-radius: 999px;
          background: rgba(23, 111, 232, 0.1);
          color: var(--nour-primary, #176fe8);
          font-size: 12px;
          font-weight: 800;
        }

        .legal-status {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-width: 74px;
          padding: 7px 10px;
          border-radius: 999px;
          font-size: 12px;
          font-weight: 800;
        }

        .legal-status-draft {
          background: rgba(245, 158, 11, 0.12);
          color: #b66a00;
        }

        .legal-status-published {
          background: rgba(24, 121, 78, 0.12);
          color: #18794e;
        }

        .legal-status-inactive {
          background: var(--nour-surface-muted, #f2f4f7);
          color: var(--nour-text-secondary, #667085);
        }

        .legal-admin-meta {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        .legal-admin-meta > div {
          display: flex;
          flex-direction: column;
          gap: 6px;
          padding: 14px 16px;
          border: 1px solid var(--nour-border, #e7eaf0);
          border-radius: 14px;
          background: var(--nour-surface-muted, #f8fafc);
        }

        .legal-admin-meta span {
          color: var(--nour-text-secondary, #667085);
          font-size: 12px;
        }

        .legal-admin-meta strong {
          color: var(--nour-text-primary, #15233b);
          font-size: 14px;
        }

        .legal-admin-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: auto;
        }

        .legal-admin-button {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 42px;
          padding: 0 15px;
          border-radius: 12px;
          text-decoration: none;
          font-size: 13px;
          font-weight: 800;
        }

        .legal-admin-button-primary {
          background: var(--nour-primary, #176fe8);
          color: #ffffff;
        }

        .legal-admin-button-secondary {
          border: 1px solid var(--nour-border, #dfe4ec);
          background: var(--nour-surface-muted, #f8fafc);
          color: var(--nour-text-primary, #15233b);
        }

        .legal-admin-message {
          padding: 13px 15px;
          border-radius: 13px;
          font-size: 13px;
          font-weight: 700;
        }

        .legal-admin-message-error {
          background: rgba(180, 35, 24, 0.1);
          color: #d92d20;
        }

        :global(.nr-admin-theme--dark) .legal-admin-card,
        :global(html.dark) .legal-admin-card,
        :global(body.dark) .legal-admin-card,
        :global([data-theme="dark"]) .legal-admin-card,
        :global(.nr-admin-theme--dark) .legal-admin-panel,
        :global(html.dark) .legal-admin-panel,
        :global(body.dark) .legal-admin-panel,
        :global([data-theme="dark"]) .legal-admin-panel {
          background: var(--nour-surface, #101828);
          border-color: var(--nour-border, #263247);
          color: var(--nour-text-primary, #f8fafc);
          box-shadow: none;
        }

        @media (max-width: 900px) {
          .legal-admin-grid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 560px) {
          .legal-admin-card-top {
            flex-direction: column;
          }

          .legal-admin-meta {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </main>
  );
}