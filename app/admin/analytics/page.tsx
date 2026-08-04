"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  Activity,
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Clock3,
  Globe2,
  Languages,
  MonitorSmartphone,
  MousePointerClick,
  RefreshCw,
  Smartphone,
  Tablet,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

import { useLanguage } from "../../../src/core/i18n";
import { createClient } from "../../../src/lib/supabase/client";
import { getAdminAnalyticsSummary } from "../../../src/features/analytics/services/admin-analytics.service";

type DeviceType =
  | "desktop"
  | "mobile"
  | "tablet"
  | "bot"
  | "unknown";

type PageVisitRow = {
  id: string;
  session_id: string;
  page_path: string;
  page_title: string | null;
  language: string | null;
  device_type: DeviceType | null;
  country_code: string | null;
  referrer: string | null;
  visited_at: string;
};

type AnalyticsDetails = {
  latestVisits: PageVisitRow[];
  topPages: Array<{
    pagePath: string;
    visits: number;
  }>;
  deviceBreakdown: Array<{
    device: DeviceType;
    visits: number;
  }>;
  languageBreakdown: Array<{
    language: string;
    visits: number;
  }>;
};

type SummaryCard = {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
};

const analyticsCopy = {
  ar: {
    pageTitle: "تحليلات الزيارات",
    pageDescription:
      "تابع حركة الزوار، الصفحات الأكثر زيارة، الأجهزة واللغات المستخدمة.",
    dashboard: "لوحة التحكم",
    refresh: "تحديث البيانات",

    todayVisits: "زيارات اليوم",
    todayVisitsDescription:
      "إجمالي زيارات صفحات الموقع اليوم",

    uniqueVisitors: "الزوار الفريدون",
    uniqueVisitorsDescription:
      "عدد الجلسات المميزة المسجلة اليوم",

    sevenDaysVisits: "زيارات آخر 7 أيام",
    sevenDaysVisitsDescription:
      "إجمالي الزيارات خلال آخر 7 أيام",

    thirtyDaysVisits: "زيارات آخر 30 يومًا",
    thirtyDaysVisitsDescription:
      "إجمالي الزيارات خلال آخر 30 يومًا",

    topPages: "الصفحات الأكثر زيارة",
    topPagesDescription:
      "أكثر صفحات الموقع نشاطًا خلال آخر 30 يومًا",

    deviceDistribution: "توزيع الأجهزة",
    deviceDistributionDescription:
      "الأجهزة المستخدمة في تصفح الموقع",

    languageDistribution: "توزيع اللغات",
    languageDistributionDescription:
      "اللغات المسجلة في زيارات الموقع",

    latestVisits: "آخر الزيارات",
    latestVisitsDescription:
      "أحدث الزيارات المسجلة داخل الموقع",

    page: "الصفحة",
    title: "العنوان",
    language: "اللغة",
    device: "الجهاز",
    country: "الدولة",
    time: "الوقت",

    visits: "زيارة",
    noData: "لا توجد بيانات متاحة حاليًا.",
    loading: "جارٍ تحميل التحليلات...",
    loadError:
      "تعذر تحميل بيانات التحليلات. تأكد من صلاحية analytics.read.",

    desktop: "كمبيوتر",
    mobile: "جوال",
    tablet: "جهاز لوحي",
    bot: "روبوت",
    unknown: "غير معروف",

    arabic: "العربية",
    english: "الإنجليزية",
    other: "أخرى",
    unknownLanguage: "غير معروفة",
    unknownCountry: "غير محددة",
    untitled: "بدون عنوان",
  },

  en: {
    pageTitle: "Visitor Analytics",
    pageDescription:
      "Monitor visitors, popular pages, devices, and website languages.",
    dashboard: "Dashboard",
    refresh: "Refresh data",

    todayVisits: "Today's visits",
    todayVisitsDescription:
      "Total website page visits today",

    uniqueVisitors: "Unique visitors",
    uniqueVisitorsDescription:
      "Distinct visitor sessions recorded today",

    sevenDaysVisits: "Visits in 7 days",
    sevenDaysVisitsDescription:
      "Total visits during the last 7 days",

    thirtyDaysVisits: "Visits in 30 days",
    thirtyDaysVisitsDescription:
      "Total visits during the last 30 days",

    topPages: "Most visited pages",
    topPagesDescription:
      "The most active website pages during the last 30 days",

    deviceDistribution: "Device distribution",
    deviceDistributionDescription:
      "Devices used to browse the website",

    languageDistribution: "Language distribution",
    languageDistributionDescription:
      "Languages recorded in website visits",

    latestVisits: "Latest visits",
    latestVisitsDescription:
      "Most recent website visits",

    page: "Page",
    title: "Title",
    language: "Language",
    device: "Device",
    country: "Country",
    time: "Time",

    visits: "visits",
    noData: "No data is currently available.",
    loading: "Loading analytics...",
    loadError:
      "Unable to load analytics. Verify the analytics.read permission.",

    desktop: "Desktop",
    mobile: "Mobile",
    tablet: "Tablet",
    bot: "Bot",
    unknown: "Unknown",

    arabic: "Arabic",
    english: "English",
    other: "Other",
    unknownLanguage: "Unknown",
    unknownCountry: "Not specified",
    untitled: "Untitled",
  },
} as const;

function getDateStart(daysAgo: number): string {
  const date = new Date();

  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - daysAgo);

  return date.toISOString();
}

async function getAnalyticsDetails(
  supabase: ReturnType<typeof createClient>,
): Promise<AnalyticsDetails> {
  const last30DaysStart = getDateStart(29);

  const [
    latestVisitsResponse,
    periodVisitsResponse,
  ] = await Promise.all([
    supabase
      .from("page_visits")
      .select(
        `
          id,
          session_id,
          page_path,
          page_title,
          language,
          device_type,
          country_code,
          referrer,
          visited_at
        `,
      )
      .order("visited_at", {
        ascending: false,
      })
      .limit(20),

    supabase
      .from("page_visits")
      .select(
        `
          page_path,
          language,
          device_type
        `,
      )
      .gte("visited_at", last30DaysStart)
      .limit(10000),
  ]);

  if (latestVisitsResponse.error) {
    throw new Error(
      latestVisitsResponse.error.message,
    );
  }

  if (periodVisitsResponse.error) {
    throw new Error(
      periodVisitsResponse.error.message,
    );
  }

  const latestVisits =
    (latestVisitsResponse.data ??
      []) as PageVisitRow[];

  const periodVisits =
    periodVisitsResponse.data ?? [];

  const pageCounts = new Map<string, number>();
  const deviceCounts = new Map<
    DeviceType,
    number
  >();
  const languageCounts = new Map<
    string,
    number
  >();

  periodVisits.forEach((visit) => {
    const pagePath =
      visit.page_path?.trim() || "/";

    pageCounts.set(
      pagePath,
      (pageCounts.get(pagePath) ?? 0) + 1,
    );

    const device =
      (visit.device_type ??
        "unknown") as DeviceType;

    deviceCounts.set(
      device,
      (deviceCounts.get(device) ?? 0) + 1,
    );

    const language =
      visit.language?.trim().toLowerCase() ||
      "unknown";

    languageCounts.set(
      language,
      (languageCounts.get(language) ?? 0) + 1,
    );
  });

  const topPages = Array.from(
    pageCounts.entries(),
  )
    .map(([pagePath, visits]) => ({
      pagePath,
      visits,
    }))
    .sort((a, b) => b.visits - a.visits)
    .slice(0, 8);

  const deviceBreakdown = Array.from(
    deviceCounts.entries(),
  )
    .map(([device, visits]) => ({
      device,
      visits,
    }))
    .sort((a, b) => b.visits - a.visits);

  const languageBreakdown = Array.from(
    languageCounts.entries(),
  )
    .map(([language, visits]) => ({
      language,
      visits,
    }))
    .sort((a, b) => b.visits - a.visits);

  return {
    latestVisits,
    topPages,
    deviceBreakdown,
    languageBreakdown,
  };
}

function getDeviceIcon(
  device: DeviceType,
): LucideIcon {
  switch (device) {
    case "mobile":
      return Smartphone;

    case "tablet":
      return Tablet;

    case "desktop":
      return MonitorSmartphone;

    default:
      return MousePointerClick;
  }
}

export default function AdminAnalyticsPage() {
  const { language } = useLanguage();

  const isArabic = language === "ar";
  const t = analyticsCopy[language];

  const supabase = useMemo(
    () => createClient(),
    [],
  );

  const summaryQuery = useQuery({
    queryKey: [
      "admin",
      "analytics",
      "summary",
    ],
    queryFn: () =>
      getAdminAnalyticsSummary(supabase),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const detailsQuery = useQuery({
    queryKey: [
      "admin",
      "analytics",
      "details",
    ],
    queryFn: () =>
      getAnalyticsDetails(supabase),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const isLoading =
    summaryQuery.isLoading ||
    detailsQuery.isLoading;

  const isError =
    summaryQuery.isError ||
    detailsQuery.isError;

  const summary = summaryQuery.data;
  const details = detailsQuery.data;

  const formatNumber = (
    value?: number,
  ): string => {
    if (isLoading) {
      return "...";
    }

    if (isError) {
      return "—";
    }

    return new Intl.NumberFormat(
      isArabic ? "ar-SA" : "en-US",
    ).format(value ?? 0);
  };

  const formatDate = (
    value: string,
  ): string => {
    return new Intl.DateTimeFormat(
      isArabic ? "ar-SA" : "en-US",
      {
        dateStyle: "medium",
        timeStyle: "short",
      },
    ).format(new Date(value));
  };

  const getLanguageLabel = (
    value: string | null,
  ): string => {
    if (value === "ar") {
      return t.arabic;
    }

    if (value === "en") {
      return t.english;
    }

    if (!value || value === "unknown") {
      return t.unknownLanguage;
    }

    return t.other;
  };

  const getDeviceLabel = (
    value: DeviceType | null,
  ): string => {
    const device = value ?? "unknown";

    return t[device];
  };

  const summaryCards: SummaryCard[] = [
    {
      title: t.todayVisits,
      value: formatNumber(
        summary?.visitsToday,
      ),
      description:
        t.todayVisitsDescription,
      icon: Activity,
    },
    {
      title: t.uniqueVisitors,
      value: formatNumber(
        summary?.uniqueVisitorsToday,
      ),
      description:
        t.uniqueVisitorsDescription,
      icon: Users,
    },
    {
      title: t.sevenDaysVisits,
      value: formatNumber(
        summary?.visitsLast7Days,
      ),
      description:
        t.sevenDaysVisitsDescription,
      icon: CalendarDays,
    },
    {
      title: t.thirtyDaysVisits,
      value: formatNumber(
        summary?.visitsLast30Days,
      ),
      description:
        t.thirtyDaysVisitsDescription,
      icon: Clock3,
    },
  ];

  const maxPageVisits = Math.max(
    1,
    ...(details?.topPages.map(
      (item) => item.visits,
    ) ?? [1]),
  );

  const maxDeviceVisits = Math.max(
    1,
    ...(details?.deviceBreakdown.map(
      (item) => item.visits,
    ) ?? [1]),
  );

  const maxLanguageVisits = Math.max(
    1,
    ...(details?.languageBreakdown.map(
      (item) => item.visits,
    ) ?? [1]),
  );

  const BackArrow = isArabic
    ? ArrowRight
    : ArrowLeft;

  async function handleRefresh() {
    await Promise.all([
      summaryQuery.refetch(),
      detailsQuery.refetch(),
    ]);
  }

  return (
    <section className="nr-analytics-page">
      <header className="nr-analytics-header">
        <div>
          <Link
            href="/admin/dashboard"
            className="nr-analytics-back"
          >
            <BackArrow
              size={18}
              strokeWidth={1.9}
              aria-hidden={true}
            />

            <span>{t.dashboard}</span>
          </Link>

          <span className="nr-dashboard-kicker">
            Analytics
          </span>

          <h1>{t.pageTitle}</h1>

          <p>{t.pageDescription}</p>
        </div>

        <button
          type="button"
          className="nr-analytics-refresh"
          onClick={() => {
            void handleRefresh();
          }}
          disabled={
            summaryQuery.isFetching ||
            detailsQuery.isFetching
          }
        >
          <RefreshCw
            size={18}
            strokeWidth={1.9}
            aria-hidden={true}
            className={
              summaryQuery.isFetching ||
              detailsQuery.isFetching
                ? "nr-analytics-refresh-icon--loading"
                : undefined
            }
          />

          <span>{t.refresh}</span>
        </button>
      </header>

      {isError ? (
        <div
          className="nr-analytics-alert nr-analytics-alert--error"
          role="alert"
        >
          {t.loadError}
        </div>
      ) : null}

      <div className="nr-analytics-summary-grid">
        {summaryCards.map((card) => {
          const Icon = card.icon;

          return (
            <article
              key={card.title}
              className="nr-analytics-summary-card"
            >
              <span className="nr-analytics-summary-icon">
                <Icon
                  size={24}
                  strokeWidth={1.9}
                  aria-hidden={true}
                />
              </span>

              <div>
                <span className="nr-analytics-summary-title">
                  {card.title}
                </span>

                <strong>
                  {card.value}
                </strong>

                <p>
                  {card.description}
                </p>
              </div>
            </article>
          );
        })}
      </div>

      <div className="nr-analytics-content-grid">
        <section className="nr-analytics-panel nr-analytics-panel--wide">
          <div className="nr-analytics-panel-heading">
            <div>
              <span className="nr-dashboard-kicker">
                Traffic
              </span>

              <h2>{t.topPages}</h2>

              <p>
                {t.topPagesDescription}
              </p>
            </div>

            <Globe2
              size={22}
              strokeWidth={1.8}
              aria-hidden={true}
            />
          </div>

          <div className="nr-analytics-bars">
            {isLoading ? (
              <p className="nr-analytics-empty">
                {t.loading}
              </p>
            ) : details?.topPages.length ? (
              details.topPages.map(
                (item) => {
                  const percentage =
                    (item.visits /
                      maxPageVisits) *
                    100;

                  return (
                    <div
                      key={item.pagePath}
                      className="nr-analytics-bar-item"
                    >
                      <div className="nr-analytics-bar-label">
                        <strong>
                          {item.pagePath}
                        </strong>

                        <span>
                          {formatNumber(
                            item.visits,
                          )}{" "}
                          {t.visits}
                        </span>
                      </div>

                      <div className="nr-analytics-bar-track">
                        <span
                          style={{
                            width: `${percentage}%`,
                          }}
                        />
                      </div>
                    </div>
                  );
                },
              )
            ) : (
              <p className="nr-analytics-empty">
                {t.noData}
              </p>
            )}
          </div>
        </section>

        <section className="nr-analytics-panel">
          <div className="nr-analytics-panel-heading">
            <div>
              <span className="nr-dashboard-kicker">
                Devices
              </span>

              <h2>
                {t.deviceDistribution}
              </h2>

              <p>
                {
                  t.deviceDistributionDescription
                }
              </p>
            </div>

            <MonitorSmartphone
              size={22}
              strokeWidth={1.8}
              aria-hidden={true}
            />
          </div>

          <div className="nr-analytics-breakdown-list">
            {isLoading ? (
              <p className="nr-analytics-empty">
                {t.loading}
              </p>
            ) : details?.deviceBreakdown
                .length ? (
              details.deviceBreakdown.map(
                (item) => {
                  const DeviceIcon =
                    getDeviceIcon(
                      item.device,
                    );

                  const percentage =
                    (item.visits /
                      maxDeviceVisits) *
                    100;

                  return (
                    <div
                      key={item.device}
                      className="nr-analytics-breakdown-item"
                    >
                      <span className="nr-analytics-breakdown-icon">
                        <DeviceIcon
                          size={19}
                          strokeWidth={1.9}
                          aria-hidden={true}
                        />
                      </span>

                      <div>
                        <div className="nr-analytics-breakdown-label">
                          <strong>
                            {getDeviceLabel(
                              item.device,
                            )}
                          </strong>

                          <span>
                            {formatNumber(
                              item.visits,
                            )}
                          </span>
                        </div>

                        <div className="nr-analytics-bar-track">
                          <span
                            style={{
                              width: `${percentage}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                },
              )
            ) : (
              <p className="nr-analytics-empty">
                {t.noData}
              </p>
            )}
          </div>
        </section>

        <section className="nr-analytics-panel">
          <div className="nr-analytics-panel-heading">
            <div>
              <span className="nr-dashboard-kicker">
                Languages
              </span>

              <h2>
                {t.languageDistribution}
              </h2>

              <p>
                {
                  t.languageDistributionDescription
                }
              </p>
            </div>

            <Languages
              size={22}
              strokeWidth={1.8}
              aria-hidden={true}
            />
          </div>

          <div className="nr-analytics-breakdown-list">
            {isLoading ? (
              <p className="nr-analytics-empty">
                {t.loading}
              </p>
            ) : details?.languageBreakdown
                .length ? (
              details.languageBreakdown.map(
                (item) => {
                  const percentage =
                    (item.visits /
                      maxLanguageVisits) *
                    100;

                  return (
                    <div
                      key={item.language}
                      className="nr-analytics-breakdown-item"
                    >
                      <span className="nr-analytics-breakdown-icon">
                        <Languages
                          size={19}
                          strokeWidth={1.9}
                          aria-hidden={true}
                        />
                      </span>

                      <div>
                        <div className="nr-analytics-breakdown-label">
                          <strong>
                            {getLanguageLabel(
                              item.language,
                            )}
                          </strong>

                          <span>
                            {formatNumber(
                              item.visits,
                            )}
                          </span>
                        </div>

                        <div className="nr-analytics-bar-track">
                          <span
                            style={{
                              width: `${percentage}%`,
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  );
                },
              )
            ) : (
              <p className="nr-analytics-empty">
                {t.noData}
              </p>
            )}
          </div>
        </section>
      </div>

      <section className="nr-analytics-panel nr-analytics-visits-panel">
        <div className="nr-analytics-panel-heading">
          <div>
            <span className="nr-dashboard-kicker">
              Recent
            </span>

            <h2>{t.latestVisits}</h2>

            <p>
              {t.latestVisitsDescription}
            </p>
          </div>

          <Activity
            size={22}
            strokeWidth={1.8}
            aria-hidden={true}
          />
        </div>

        <div className="nr-analytics-table-wrap">
          <div className="nr-analytics-table">
            <div className="nr-analytics-table-row nr-analytics-table-head">
              <span>{t.page}</span>
              <span>{t.title}</span>
              <span>{t.language}</span>
              <span>{t.device}</span>
              <span>{t.country}</span>
              <span>{t.time}</span>
            </div>

            {isLoading ? (
              <div className="nr-analytics-table-state">
                {t.loading}
              </div>
            ) : details?.latestVisits.length ? (
              details.latestVisits.map(
                (visit) => (
                  <div
                    key={visit.id}
                    className="nr-analytics-table-row"
                  >
                    <strong
                      dir="ltr"
                      title={visit.page_path}
                    >
                      {visit.page_path}
                    </strong>

                    <span>
                      {visit.page_title ??
                        t.untitled}
                    </span>

                    <span>
                      {getLanguageLabel(
                        visit.language,
                      )}
                    </span>

                    <span>
                      {getDeviceLabel(
                        visit.device_type,
                      )}
                    </span>

                    <span>
                      {visit.country_code ??
                        t.unknownCountry}
                    </span>

                    <small>
                      {formatDate(
                        visit.visited_at,
                      )}
                    </small>
                  </div>
                ),
              )
            ) : (
              <div className="nr-analytics-table-state">
                {t.noData}
              </div>
            )}
          </div>
        </div>
      </section>
    </section>
  );
}