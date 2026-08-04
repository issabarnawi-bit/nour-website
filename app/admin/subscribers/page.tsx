"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  Download,
  Languages,
  Mail,
  RefreshCw,
  Search,
  ShieldCheck,
  UserMinus,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useLanguage } from "../../../src/core/i18n";
import { createClient } from "../../../src/lib/supabase/client";

type SubscriberStatus =
  | "pending"
  | "active"
  | "unsubscribed"
  | "blocked";

type SubscriberChannel =
  | "email"
  | "whatsapp"
  | "email_and_whatsapp";

type SubscriberRow = {
  id: string;
  full_name: string | null;
  email: string | null;
  phone: string | null;
  country_code: string | null;
  preferred_language: string;
  preferred_channel: SubscriberChannel;
  status: SubscriberStatus;
  consent_given: boolean;
  consent_at: string | null;
  consent_source: string | null;
  source_page: string | null;
  confirmed_at: string | null;
  unsubscribed_at: string | null;
  created_at: string;
  updated_at: string;
};

type SummaryCard = {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
};

type StatusFilter = "all" | SubscriberStatus;
type LanguageFilter = "all" | "ar" | "en";

const countryNames: Record<
  string,
  {
    ar: string;
    en: string;
  }
> = {
  SA: {
    ar: "السعودية",
    en: "Saudi Arabia",
  },
  NG: {
    ar: "نيجيريا",
    en: "Nigeria",
  },
  AE: {
    ar: "الإمارات",
    en: "United Arab Emirates",
  },
  BH: {
    ar: "البحرين",
    en: "Bahrain",
  },
  KW: {
    ar: "الكويت",
    en: "Kuwait",
  },
  OM: {
    ar: "عُمان",
    en: "Oman",
  },
  QA: {
    ar: "قطر",
    en: "Qatar",
  },
  EG: {
    ar: "مصر",
    en: "Egypt",
  },
  PK: {
    ar: "باكستان",
    en: "Pakistan",
  },
  IN: {
    ar: "الهند",
    en: "India",
  },
  ID: {
    ar: "إندونيسيا",
    en: "Indonesia",
  },
  MY: {
    ar: "ماليزيا",
    en: "Malaysia",
  },
  GB: {
    ar: "المملكة المتحدة",
    en: "United Kingdom",
  },
  US: {
    ar: "الولايات المتحدة",
    en: "United States",
  },
};

const subscribersCopy = {
  ar: {
    pageTitle: "إدارة المشتركين",
    pageDescription:
      "عرض المشتركين ومراجعة الموافقات وتحديث حالات الاشتراك وتصدير البيانات.",
    dashboard: "لوحة التحكم",
    refresh: "تحديث البيانات",
    exportCsv: "تصدير CSV",

    totalSubscribers: "إجمالي المشتركين",
    totalSubscribersDescription:
      "جميع سجلات الاشتراك غير المحذوفة",

    activeSubscribers: "المشتركون النشطون",
    activeSubscribersDescription:
      "المشتركون المتاح إرسال التحديثات إليهم",

    unsubscribedSubscribers: "ألغوا الاشتراك",
    unsubscribedSubscribersDescription:
      "المشتركون الذين أوقفوا استلام التحديثات",

    consentedSubscribers: "موافقات صريحة",
    consentedSubscribersDescription:
      "السجلات التي تحتوي موافقة موثقة",

    subscribersList: "قائمة المشتركين",
    subscribersListDescription:
      "ابحث وصفِّ البيانات حسب الحالة واللغة والدولة.",

    searchPlaceholder:
      "البحث بالاسم أو البريد أو رقم الجوال...",
    allStatuses: "جميع الحالات",
    allLanguages: "جميع اللغات",
    allCountries: "جميع الدول",

    active: "نشط",
    pending: "قيد التأكيد",
    unsubscribed: "ملغي الاشتراك",
    blocked: "محظور",

    arabic: "العربية",
    english: "الإنجليزية",
    unknown: "غير محدد",

    subscriber: "المشترك",
    country: "الدولة",
    language: "اللغة",
    channel: "القناة",
    status: "الحالة",
    consent: "الموافقة",
    source: "المصدر",
    joinedAt: "تاريخ الاشتراك",
    actions: "الإجراءات",

    email: "البريد",
    whatsapp: "واتساب",
    emailAndWhatsapp: "البريد وواتساب",

    consentGiven: "موافق",
    consentMissing: "غير مسجلة",

    activate: "تفعيل",
    unsubscribe: "إلغاء الاشتراك",
    block: "حظر",

    loading: "جارٍ تحميل المشتركين...",
    noData: "لا توجد سجلات مطابقة.",
    loadError:
      "تعذر تحميل المشتركين. تأكد من صلاحية subscribers.read.",
    updateSuccess: "تم تحديث حالة المشترك.",
    updateError:
      "تعذر تحديث حالة المشترك. تأكد من صلاحية subscribers.manage.",
    exportError:
      "لا توجد بيانات قابلة للتصدير.",
    exportSuccess: "تم تجهيز ملف التصدير.",

    results: "نتيجة",
  },

  en: {
    pageTitle: "Subscriber Management",
    pageDescription:
      "View subscribers, review consent records, update subscription statuses, and export data.",
    dashboard: "Dashboard",
    refresh: "Refresh data",
    exportCsv: "Export CSV",

    totalSubscribers: "Total subscribers",
    totalSubscribersDescription:
      "All non-deleted subscription records",

    activeSubscribers: "Active subscribers",
    activeSubscribersDescription:
      "Subscribers eligible to receive updates",

    unsubscribedSubscribers: "Unsubscribed",
    unsubscribedSubscribersDescription:
      "Subscribers who stopped receiving updates",

    consentedSubscribers: "Explicit consents",
    consentedSubscribersDescription:
      "Records with documented consent",

    subscribersList: "Subscribers list",
    subscribersListDescription:
      "Search and filter records by status, language, and country.",

    searchPlaceholder:
      "Search by name, email, or phone...",
    allStatuses: "All statuses",
    allLanguages: "All languages",
    allCountries: "All countries",

    active: "Active",
    pending: "Pending confirmation",
    unsubscribed: "Unsubscribed",
    blocked: "Blocked",

    arabic: "Arabic",
    english: "English",
    unknown: "Not specified",

    subscriber: "Subscriber",
    country: "Country",
    language: "Language",
    channel: "Channel",
    status: "Status",
    consent: "Consent",
    source: "Source",
    joinedAt: "Joined",
    actions: "Actions",

    email: "Email",
    whatsapp: "WhatsApp",
    emailAndWhatsapp: "Email and WhatsApp",

    consentGiven: "Granted",
    consentMissing: "Not recorded",

    activate: "Activate",
    unsubscribe: "Unsubscribe",
    block: "Block",

    loading: "Loading subscribers...",
    noData: "No matching records were found.",
    loadError:
      "Unable to load subscribers. Verify the subscribers.read permission.",
    updateSuccess: "Subscriber status was updated.",
    updateError:
      "Unable to update subscriber status. Verify the subscribers.manage permission.",
    exportError:
      "There is no data available for export.",
    exportSuccess: "The export file was prepared.",

    results: "results",
  },
} as const;

async function getSubscribers(
  supabase: ReturnType<typeof createClient>,
): Promise<SubscriberRow[]> {
  const { data, error } = await supabase
    .from("newsletter_subscribers")
    .select(
      `
        id,
        full_name,
        email,
        phone,
        country_code,
        preferred_language,
        preferred_channel,
        status,
        consent_given,
        consent_at,
        consent_source,
        source_page,
        confirmed_at,
        unsubscribed_at,
        created_at,
        updated_at
      `,
    )
    .is("deleted_at", null)
    .order("created_at", {
      ascending: false,
    })
    .limit(2000);

  if (error) {
    throw new Error(error.message);
  }

  return (data ?? []) as SubscriberRow[];
}

async function updateSubscriberStatus(
  supabase: ReturnType<typeof createClient>,
  subscriberId: string,
  status: SubscriberStatus,
): Promise<void> {
  const updateValues: {
    status: SubscriberStatus;
    unsubscribed_at: string | null;
    blocked_at: string | null;
    confirmed_at?: string;
  } = {
    status,
    unsubscribed_at:
      status === "unsubscribed"
        ? new Date().toISOString()
        : null,
    blocked_at:
      status === "blocked"
        ? new Date().toISOString()
        : null,
  };

  if (status === "active") {
    updateValues.confirmed_at =
      new Date().toISOString();
  }

  const { error } = await supabase
    .from("newsletter_subscribers")
    .update(updateValues)
    .eq("id", subscriberId)
    .is("deleted_at", null);

  if (error) {
    throw new Error(error.message);
  }
}

function escapeCsvValue(
  value: string | number | boolean | null | undefined,
): string {
  const text =
    value === null || value === undefined
      ? ""
      : String(value);

  return `"${text.replaceAll('"', '""')}"`;
}

function downloadSubscribersCsv(
  subscribers: SubscriberRow[],
): void {
  const headers = [
    "id",
    "full_name",
    "email",
    "phone",
    "country_code",
    "preferred_language",
    "preferred_channel",
    "status",
    "consent_given",
    "consent_at",
    "consent_source",
    "source_page",
    "confirmed_at",
    "unsubscribed_at",
    "created_at",
  ];

  const rows = subscribers.map((subscriber) =>
    [
      subscriber.id,
      subscriber.full_name,
      subscriber.email,
      subscriber.phone,
      subscriber.country_code,
      subscriber.preferred_language,
      subscriber.preferred_channel,
      subscriber.status,
      subscriber.consent_given,
      subscriber.consent_at,
      subscriber.consent_source,
      subscriber.source_page,
      subscriber.confirmed_at,
      subscriber.unsubscribed_at,
      subscriber.created_at,
    ]
      .map(escapeCsvValue)
      .join(","),
  );

  const csvContent = [
    headers.map(escapeCsvValue).join(","),
    ...rows,
  ].join("\r\n");

  const csvWithBom = `\uFEFF${csvContent}`;

  const blob = new Blob([csvWithBom], {
    type: "text/csv;charset=utf-8",
  });

  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement("a");

  link.href = downloadUrl;
  link.download = `nourapp-subscribers-${
    new Date().toISOString().split("T")[0]
  }.csv`;

  document.body.appendChild(link);
  link.click();
  link.remove();

  URL.revokeObjectURL(downloadUrl);
}

export default function AdminSubscribersPage() {
  const { language } = useLanguage();

  const isArabic = language === "ar";
  const t = subscribersCopy[language];
  const getCountryLabel = (
  countryCode: string | null,
): string => {
  if (!countryCode) {
    return t.unknown;
  }

  const normalizedCode =
    countryCode.trim().toUpperCase();

  const country =
    countryNames[normalizedCode];

  if (!country) {
    return normalizedCode;
  }

  return isArabic
    ? country.ar
    : country.en;
};

  

  const queryClient = useQueryClient();

  const supabase = useMemo(
    () => createClient(),
    [],
  );

  const [searchValue, setSearchValue] =
    useState("");

  const [statusFilter, setStatusFilter] =
    useState<StatusFilter>("all");

  const [languageFilter, setLanguageFilter] =
    useState<LanguageFilter>("all");

  const [countryFilter, setCountryFilter] =
    useState("all");

  const [feedback, setFeedback] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);

  const subscribersQuery = useQuery({
    queryKey: [
      "admin",
      "subscribers",
      "list",
    ],
    queryFn: () => getSubscribers(supabase),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const statusMutation = useMutation({
    mutationFn: ({
      subscriberId,
      status,
    }: {
      subscriberId: string;
      status: SubscriberStatus;
    }) =>
      updateSubscriberStatus(
        supabase,
        subscriberId,
        status,
      ),

    onSuccess: async () => {
      setFeedback({
        type: "success",
        message: t.updateSuccess,
      });

      await queryClient.invalidateQueries({
        queryKey: [
          "admin",
          "subscribers",
        ],
      });
    },

    onError: () => {
      setFeedback({
        type: "error",
        message: t.updateError,
      });
    },
  });

  const subscribers =
    subscribersQuery.data ?? [];

  const countries = useMemo(() => {
    return Array.from(
      new Set(
        subscribers
          .map(
            (subscriber) =>
              subscriber.country_code,
          )
          .filter(
            (
              countryCode,
            ): countryCode is string =>
              Boolean(countryCode),
          ),
      ),
    ).sort();
  }, [subscribers]);

  const filteredSubscribers = useMemo(() => {
    const normalizedSearch =
      searchValue.trim().toLowerCase();

    return subscribers.filter(
      (subscriber) => {
        const matchesSearch =
          normalizedSearch.length === 0 ||
          [
            subscriber.full_name,
            subscriber.email,
            subscriber.phone,
          ].some((value) =>
            value
              ?.toLowerCase()
              .includes(normalizedSearch),
          );

        const matchesStatus =
          statusFilter === "all" ||
          subscriber.status ===
            statusFilter;

        const matchesLanguage =
          languageFilter === "all" ||
          subscriber.preferred_language ===
            languageFilter;

        const matchesCountry =
          countryFilter === "all" ||
          subscriber.country_code ===
            countryFilter;

        return (
          matchesSearch &&
          matchesStatus &&
          matchesLanguage &&
          matchesCountry
        );
      },
    );
  }, [
    subscribers,
    searchValue,
    statusFilter,
    languageFilter,
    countryFilter,
  ]);

  const activeSubscribers =
    subscribers.filter(
      (subscriber) =>
        subscriber.status === "active",
    ).length;

  const unsubscribedSubscribers =
    subscribers.filter(
      (subscriber) =>
        subscriber.status ===
        "unsubscribed",
    ).length;

  const consentedSubscribers =
    subscribers.filter(
      (subscriber) =>
        subscriber.consent_given,
    ).length;

  const formatNumber = (
    value: number,
  ): string => {
    return new Intl.NumberFormat(
      isArabic ? "ar-SA" : "en-US",
    ).format(value);
  };

  const formatDate = (
    value: string | null,
  ): string => {
    if (!value) {
      return t.unknown;
    }

    return new Intl.DateTimeFormat(
      isArabic ? "ar-SA" : "en-US",
      {
        dateStyle: "medium",
        timeStyle: "short",
      },
    ).format(new Date(value));
  };

  const getStatusLabel = (
    status: SubscriberStatus,
  ): string => {
    return t[status];
  };

  const getLanguageLabel = (
    value: string,
  ): string => {
    if (value === "ar") {
      return t.arabic;
    }

    if (value === "en") {
      return t.english;
    }

    return t.unknown;
  };

  const getChannelLabel = (
    value: SubscriberChannel,
  ): string => {
    if (value === "email") {
      return t.email;
    }

    if (value === "whatsapp") {
      return t.whatsapp;
    }

    return t.emailAndWhatsapp;
  };

  const summaryCards: SummaryCard[] = [
    {
      title: t.totalSubscribers,
      value: formatNumber(
        subscribers.length,
      ),
      description:
        t.totalSubscribersDescription,
      icon: Users,
    },
    {
      title: t.activeSubscribers,
      value: formatNumber(
        activeSubscribers,
      ),
      description:
        t.activeSubscribersDescription,
      icon: CheckCircle2,
    },
    {
      title:
        t.unsubscribedSubscribers,
      value: formatNumber(
        unsubscribedSubscribers,
      ),
      description:
        t.unsubscribedSubscribersDescription,
      icon: UserMinus,
    },
    {
      title: t.consentedSubscribers,
      value: formatNumber(
        consentedSubscribers,
      ),
      description:
        t.consentedSubscribersDescription,
      icon: ShieldCheck,
    },
  ];

  const BackArrow = isArabic
    ? ArrowRight
    : ArrowLeft;

  function handleExport() {
    if (
      filteredSubscribers.length === 0
    ) {
      setFeedback({
        type: "error",
        message: t.exportError,
      });

      return;
    }

    downloadSubscribersCsv(
      filteredSubscribers,
    );

    setFeedback({
      type: "success",
      message: t.exportSuccess,
    });
  }

  return (
    <section className="nr-subscribers-page">
      <header className="nr-subscribers-header">
        <div>
          <Link
            href="/admin/dashboard"
            className="nr-subscribers-back"
          >
            <BackArrow
              size={18}
              strokeWidth={1.9}
              aria-hidden={true}
            />

            <span>{t.dashboard}</span>
          </Link>

          <span className="nr-dashboard-kicker">
            Subscribers
          </span>

          <h1>{t.pageTitle}</h1>

          <p>{t.pageDescription}</p>
        </div>

        <div className="nr-subscribers-header-actions">
          <button
            type="button"
            className="nr-subscribers-secondary-button"
            onClick={() => {
              void subscribersQuery.refetch();
            }}
            disabled={
              subscribersQuery.isFetching
            }
          >
            <RefreshCw
              size={18}
              strokeWidth={1.9}
              aria-hidden={true}
              className={
                subscribersQuery.isFetching
                  ? "nr-subscribers-refresh-icon--loading"
                  : undefined
              }
            />

            <span>{t.refresh}</span>
          </button>

          <button
            type="button"
            className="nr-subscribers-primary-button"
            onClick={handleExport}
          >
            <Download
              size={18}
              strokeWidth={1.9}
              aria-hidden={true}
            />

            <span>{t.exportCsv}</span>
          </button>
        </div>
      </header>

      {feedback ? (
        <div
          className={`nr-subscribers-alert nr-subscribers-alert--${feedback.type}`}
          role={
            feedback.type === "error"
              ? "alert"
              : "status"
          }
        >
          {feedback.message}
        </div>
      ) : null}

      {subscribersQuery.isError ? (
        <div
          className="nr-subscribers-alert nr-subscribers-alert--error"
          role="alert"
        >
          {t.loadError}
        </div>
      ) : null}

      <div className="nr-subscribers-summary-grid">
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <article
              key={card.title}
              className="nr-subscribers-summary-card"
            >
              <span className="nr-subscribers-summary-icon">
                <Icon
                  size={24}
                  strokeWidth={1.9}
                  aria-hidden={true}
                />
              </span>

              <div>
                <span className="nr-subscribers-summary-title">
                  {card.title}
                </span>

                <strong>{card.value}</strong>

                <p>
                  {card.description}
                </p>
              </div>
            </article>
          );
        })}
      </div>

      <section className="nr-subscribers-panel">
        <div className="nr-subscribers-panel-heading">
          <div>
            <span className="nr-dashboard-kicker">
              Management
            </span>

            <h2>
              {t.subscribersList}
            </h2>

            <p>
              {
                t.subscribersListDescription
              }
            </p>
          </div>

          <span className="nr-subscribers-results-count">
            {formatNumber(
              filteredSubscribers.length,
            )}{" "}
            {t.results}
          </span>
        </div>

        <div className="nr-subscribers-filters">
          <label className="nr-subscribers-search">
            <Search
              size={19}
              strokeWidth={1.9}
              aria-hidden={true}
            />

            <input
              type="search"
              value={searchValue}
              onChange={(event) => {
                setSearchValue(
                  event.target.value,
                );
              }}
              placeholder={
                t.searchPlaceholder
              }
            />
          </label>

          <select
            value={statusFilter}
            onChange={(event) => {
              setStatusFilter(
                event.target
                  .value as StatusFilter,
              );
            }}
            aria-label={t.status}
          >
            <option value="all">
              {t.allStatuses}
            </option>

            <option value="active">
              {t.active}
            </option>

            <option value="pending">
              {t.pending}
            </option>

            <option value="unsubscribed">
              {t.unsubscribed}
            </option>

            <option value="blocked">
              {t.blocked}
            </option>
          </select>

          <select
            value={languageFilter}
            onChange={(event) => {
              setLanguageFilter(
                event.target
                  .value as LanguageFilter,
              );
            }}
            aria-label={t.language}
          >
            <option value="all">
              {t.allLanguages}
            </option>

            <option value="ar">
              {t.arabic}
            </option>

            <option value="en">
              {t.english}
            </option>
          </select>

          <select
            value={countryFilter}
            onChange={(event) => {
              setCountryFilter(
                event.target.value,
              );
            }}
            aria-label={t.country}
          >
            <option value="all">
              {t.allCountries}
            </option>

           {countries.map(
  (countryCode) => (
    <option
      key={countryCode}
      value={countryCode}
    >
      {getCountryLabel(countryCode)}
      {" — "}
      {countryCode}
    </option>
  ),
)}
          </select>
        </div>

        <div className="nr-subscribers-table-wrap">
          <div className="nr-subscribers-table">
            <div className="nr-subscribers-table-row nr-subscribers-table-head">
              <span>{t.subscriber}</span>
              <span>{t.country}</span>
              <span>{t.language}</span>
              <span>{t.channel}</span>
              <span>{t.status}</span>
              <span>{t.consent}</span>
              <span>{t.source}</span>
              <span>{t.joinedAt}</span>
              <span>{t.actions}</span>
            </div>

            {subscribersQuery.isLoading ? (
              <div className="nr-subscribers-table-state">
                {t.loading}
              </div>
            ) : filteredSubscribers.length ? (
              filteredSubscribers.map(
                (subscriber) => (
                  <div
                    key={subscriber.id}
                    className="nr-subscribers-table-row"
                  >
                    <div className="nr-subscribers-person">
                      <span className="nr-subscribers-person-icon">
                        <Mail
                          size={18}
                          strokeWidth={1.9}
                          aria-hidden={true}
                        />
                      </span>

                      <div>
                        <strong>
                          {subscriber.full_name ??
                            t.unknown}
                        </strong>

                        <span dir="ltr">
                          {subscriber.email ??
                            subscriber.phone ??
                            t.unknown}
                        </span>
                      </div>
                    </div>

                    <div className="nr-subscribers-country">
  <strong>
    {getCountryLabel(
      subscriber.country_code,
    )}
  </strong>

  {subscriber.country_code ? (
    <small dir="ltr">
      {subscriber.country_code.toUpperCase()}
    </small>
  ) : null}
</div>

                    <span className="nr-subscribers-language">
                      <Languages
                        size={16}
                        strokeWidth={1.9}
                        aria-hidden={true}
                      />

                      {getLanguageLabel(
                        subscriber.preferred_language,
                      )}
                    </span>

                    <span>
                      {getChannelLabel(
                        subscriber.preferred_channel,
                      )}
                    </span>

                    <span
                      className={`nr-subscribers-status nr-subscribers-status--${subscriber.status}`}
                    >
                      {getStatusLabel(
                        subscriber.status,
                      )}
                    </span>

                    <span>
                      {subscriber.consent_given
                        ? t.consentGiven
                        : t.consentMissing}
                    </span>

                    <span
                      title={
                        subscriber.consent_source ??
                        subscriber.source_page ??
                        undefined
                      }
                    >
                      {subscriber.consent_source ??
                        subscriber.source_page ??
                        t.unknown}
                    </span>

                    <small>
                      {formatDate(
                        subscriber.created_at,
                      )}
                    </small>

                    <div className="nr-subscribers-row-actions">
                      {subscriber.status !==
                      "active" ? (
                        <button
                          type="button"
                          onClick={() => {
                            statusMutation.mutate(
                              {
                                subscriberId:
                                  subscriber.id,
                                status:
                                  "active",
                              },
                            );
                          }}
                          disabled={
                            statusMutation.isPending
                          }
                        >
                          {t.activate}
                        </button>
                      ) : null}

                      {subscriber.status !==
                      "unsubscribed" ? (
                        <button
                          type="button"
                          onClick={() => {
                            statusMutation.mutate(
                              {
                                subscriberId:
                                  subscriber.id,
                                status:
                                  "unsubscribed",
                              },
                            );
                          }}
                          disabled={
                            statusMutation.isPending
                          }
                        >
                          {t.unsubscribe}
                        </button>
                      ) : null}

                      {subscriber.status !==
                      "blocked" ? (
                        <button
                          type="button"
                          className="nr-subscribers-danger-action"
                          onClick={() => {
                            statusMutation.mutate(
                              {
                                subscriberId:
                                  subscriber.id,
                                status:
                                  "blocked",
                              },
                            );
                          }}
                          disabled={
                            statusMutation.isPending
                          }
                        >
                          {t.block}
                        </button>
                      ) : null}
                    </div>
                  </div>
                ),
              )
            ) : (
              <div className="nr-subscribers-table-state">
                {t.noData}
              </div>
            )}
          </div>
        </div>
      </section>
    </section>
  );
}