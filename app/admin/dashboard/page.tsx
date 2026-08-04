"use client";

import { useMemo } from "react";
import Image from "next/image";
import Link from "next/link";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  ArrowUpRight,
  CalendarDays,
  Globe2,
  ImagePlus,
  PlusCircle,
  Settings2,
  UserCheck,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { useLanguage } from "../../../src/core/i18n";
import { createClient } from "../../../src/lib/supabase/client";
import { getAdminAnalyticsSummary } from "../../../src/features/analytics/services/admin-analytics.service";

const dashboardCopy = {
  ar: {
    management: "لوحة إدارة نور",
    welcome: "مرحبًا بك في NourApp Platform",
    welcomeText:
      "أدر الدول والبرامج والمحتوى والمستخدمين من مكان واحد، وتابع آخر التحديثات والأنشطة داخل المنصة.",
    managePrograms: "إدارة البرامج",
    shortcut: "اختصار سريع",
    startManaging: "ابدأ بإدارة محتوى المنصة",
    startManagingText:
      "أضف البرامج والدول وارفع الصور، ثم راجع المحتوى قبل النشر.",
    goToPrograms: "الانتقال إلى البرامج",
    countries: "الدول",
    programs: "البرامج",
    users: "المستخدمون",
    media: "الوسائط",
    quickAccess: "الوصول السريع",
    quickActions: "الإجراءات السريعة",
    addProgram: "إضافة برنامج",
    addProgramDescription: "إنشاء برنامج عمرة جديد وإعداده للنشر.",
    addCountry: "إضافة دولة",
    addCountryDescription: "إضافة دولة وتحديد العملة والمنطقة الزمنية.",
    uploadMedia: "رفع وسائط",
    uploadMediaDescription: "إضافة صور وملفات جديدة إلى المكتبة.",
    manageUsers: "إدارة المستخدمين",
    manageUsersDescription: "مراجعة المستخدمين والأدوار والصلاحيات.",
    notifications: "التنبيهات",
    latestNotifications: "آخر الإشعارات",
    programsUpdated: "تم تحديث وحدة البرامج",
    programsUpdatedDescription:
      "اكتملت الصلاحيات وسلة المحذوفات وسجل التدقيق.",
    mediaReady: "مكتبة الوسائط جاهزة",
    mediaReadyDescription: "يمكن الآن مراجعة الصور والملفات المرفوعة.",
    reviewData: "مراجعة البيانات",
    reviewDataDescription: "تأكد من إضافة بيانات الدول قبل نشر البرامج.",
    momentsAgo: "منذ قليل",
    today: "اليوم",
    yesterday: "أمس",
    viewNotifications: "عرض جميع الإشعارات",
    activityLog: "سجل النشاط",
    latestActivity: "آخر الأنشطة",
    operation: "العملية",
    module: "الوحدة",
    status: "الحالة",
    time: "الوقت",
    updateProgram: "تحديث برنامج",
    uploadImage: "رفع صورة",
    addUser: "إضافة مستخدم",
    completed: "مكتمل",
    pendingReview: "قيد المراجعة",
    recentAccess: "الوصول الأخير",
    recentPages: "الصفحات المستخدمة مؤخرًا",
    mediaLibrary: "مكتبة الوسائط",
    countriesManagement: "إدارة الدول",
    usersPermissions: "المستخدمون والصلاحيات",
  },
  en: {
    management: "Nour Administration",
    welcome: "Welcome to NourApp Platform",
    welcomeText:
      "Manage countries, programs, content, and users from one place, and follow the latest platform updates and activities.",
    managePrograms: "Manage Programs",
    shortcut: "Quick Shortcut",
    startManaging: "Start Managing Platform Content",
    startManagingText:
      "Add programs and countries, upload media, and review content before publishing.",
    goToPrograms: "Go to Programs",
    countries: "Countries",
    programs: "Programs",
    users: "Users",
    media: "Media",
    quickAccess: "Quick Access",
    quickActions: "Quick Actions",
    addProgram: "Add Program",
    addProgramDescription:
      "Create a new Umrah program and prepare it for publishing.",
    addCountry: "Add Country",
    addCountryDescription:
      "Add a country and configure its currency and timezone.",
    uploadMedia: "Upload Media",
    uploadMediaDescription: "Add new images and files to the media library.",
    manageUsers: "Manage Users",
    manageUsersDescription: "Review users, roles, and permissions.",
    notifications: "Notifications",
    latestNotifications: "Latest Notifications",
    programsUpdated: "Programs Module Updated",
    programsUpdatedDescription:
      "Permissions, recycle bin, and audit logs are complete.",
    mediaReady: "Media Library Ready",
    mediaReadyDescription: "Uploaded images and files can now be reviewed.",
    reviewData: "Review Data",
    reviewDataDescription:
      "Make sure country information is complete before publishing programs.",
    momentsAgo: "A moment ago",
    today: "Today",
    yesterday: "Yesterday",
    viewNotifications: "View All Notifications",
    activityLog: "Activity Log",
    latestActivity: "Latest Activities",
    operation: "Operation",
    module: "Module",
    status: "Status",
    time: "Time",
    updateProgram: "Update Program",
    uploadImage: "Upload Image",
    addUser: "Add User",
    completed: "Completed",
    pendingReview: "Under Review",
    recentAccess: "Recent Access",
    recentPages: "Recently Used Pages",
    mediaLibrary: "Media Library",
    countriesManagement: "Country Management",
    usersPermissions: "Users and Permissions",
  },
} as const;

type OverviewCard = {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  href: string;
};

type QuickAction = {
  title: string;
  description: string;
  href: string;
  icon: LucideIcon;
};

export default function AdminDashboardPage() {
  const { language } = useLanguage();
  const isArabic = language === "ar";
  const t = dashboardCopy[language];

  const supabase = useMemo(() => createClient(), []);

  const {
    data: analytics,
    isLoading: isAnalyticsLoading,
    isError: isAnalyticsError,
  } = useQuery({
    queryKey: ["admin", "analytics", "summary"],
    queryFn: () => getAdminAnalyticsSummary(supabase),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const today = new Intl.DateTimeFormat(isArabic ? "ar-SA" : "en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const formatNumber = (value?: number) => {
    if (isAnalyticsLoading) return "...";
    if (isAnalyticsError) return "—";

    return new Intl.NumberFormat(isArabic ? "ar-SA" : "en-US").format(
      value ?? 0,
    );
  };

  const overviewCards: OverviewCard[] = [
    {
      title: isArabic ? "زيارات اليوم" : "Today's visits",
      value: formatNumber(analytics?.visitsToday),
      description: isArabic
        ? "إجمالي زيارات صفحات الموقع اليوم"
        : "Total website page visits today",
      icon: Activity,
      href: "/admin/analytics",
    },
    {
      title: isArabic ? "الزوار الفريدون" : "Unique visitors",
      value: formatNumber(analytics?.uniqueVisitorsToday),
      description: isArabic
        ? "عدد الجلسات المميزة المسجلة اليوم"
        : "Distinct visitor sessions recorded today",
      icon: Users,
      href: "/admin/analytics",
    },
    {
      title: isArabic ? "زيارات آخر 30 يومًا" : "Visits in 30 days",
      value: formatNumber(analytics?.visitsLast30Days),
      description: isArabic
        ? "إجمالي الزيارات خلال آخر 30 يومًا"
        : "Total visits during the last 30 days",
      icon: CalendarDays,
      href: "/admin/analytics",
    },
    {
      title: isArabic ? "المشتركون النشطون" : "Active subscribers",
      value: formatNumber(analytics?.activeSubscribers),
      description: isArabic
        ? `من أصل ${formatNumber(analytics?.totalSubscribers)} مشترك`
        : `Out of ${formatNumber(analytics?.totalSubscribers)} subscribers`,
      icon: UserCheck,
      href: "/admin/subscribers",
    },
  ];

  const quickActions: QuickAction[] = [
    {
      title: t.addProgram,
      description: t.addProgramDescription,
      href: "/admin/programs",
      icon: PlusCircle,
    },
    {
      title: t.addCountry,
      description: t.addCountryDescription,
      href: "/admin/countries",
      icon: Globe2,
    },
    {
      title: t.uploadMedia,
      description: t.uploadMediaDescription,
      href: "/admin/media",
      icon: ImagePlus,
    },
    {
      title: t.manageUsers,
      description: t.manageUsersDescription,
      href: "/admin/users",
      icon: Settings2,
    },
  ];

  const arrow = isArabic ? "←" : "→";

  return (
    <section className="nr-dashboard nr-portal-dashboard">
      <div className="nr-portal-grid">
        <article className="nr-portal-welcome">
          <div className="nr-portal-avatar">
            <Image
              src="/images/nour-logo.jpg"
              alt="NourApp"
              width={56}
              height={56}
              priority
            />
          </div>

          <div className="nr-portal-welcome-copy">
            <span className="nr-dashboard-kicker">{t.management}</span>
            <h1>{t.welcome}</h1>
            <p>{t.welcomeText}</p>

            <div className="nr-portal-date">
              <span aria-hidden={true}>◷</span>
              <span>{today}</span>
            </div>
          </div>

          <Link href="/admin/programs" className="nr-portal-primary-action">
            {t.managePrograms}
          </Link>
        </article>

        <article className="nr-portal-highlight">
          <div>
            <span className="nr-dashboard-kicker">{t.shortcut}</span>
            <h2>{t.startManaging}</h2>
            <p>{t.startManagingText}</p>

            <Link href="/admin/programs" className="nr-portal-text-link">
              {t.goToPrograms}
              <span aria-hidden={true}>{arrow}</span>
            </Link>
          </div>

          <div className="nr-portal-highlight-illustration">
            <Image
              src="/images/nour-logo.jpg"
              alt="NourApp"
              width={118}
              height={118}
              priority
            />
          </div>
        </article>
      </div>

      <div className="nr-portal-stats">
        {overviewCards.map((card) => {
          const Icon = card.icon;

          return (
            <Link
              key={card.title}
              href={card.href}
              className="nr-portal-stat-card"
            >
              <span className="nr-portal-stat-icon" aria-hidden={true}>
                <Icon size={24} strokeWidth={2} />
              </span>

              <div className="nr-portal-stat-content">
                <span className="nr-portal-stat-title">{card.title}</span>
                <strong className="nr-portal-stat-value">{card.value}</strong>
                <span className="nr-portal-stat-description">
                  {card.description}
                </span>
              </div>

              <span className="nr-portal-stat-arrow" aria-hidden={true}>
                <ArrowUpRight size={19} strokeWidth={1.8} />
              </span>
            </Link>
          );
        })}
      </div>

      <div className="nr-portal-content-grid">
        <section className="nr-portal-panel">
          <div className="nr-portal-panel-heading">
            <div>
              <span className="nr-dashboard-kicker">{t.quickAccess}</span>
              <h2>{t.quickActions}</h2>
            </div>
          </div>

          <div className="nr-portal-actions-list">
            {quickActions.map((action) => {
              const ActionIcon = action.icon;

              return (
                <Link
                  key={action.title}
                  href={action.href}
                  className="nr-portal-action-item"
                >
                  <span className="nr-portal-action-icon" aria-hidden={true}>
                    <ActionIcon size={22} strokeWidth={2} />
                  </span>

                  <div>
                    <strong>{action.title}</strong>
                    <p>{action.description}</p>
                  </div>

                  <span className="nr-portal-action-arrow">{arrow}</span>
                </Link>
              );
            })}
          </div>
        </section>

        <section className="nr-portal-panel">
          <div className="nr-portal-panel-heading">
            <div>
              <span className="nr-dashboard-kicker">{t.notifications}</span>
              <h2>{t.latestNotifications}</h2>
            </div>
            <span className="nr-portal-count">3</span>
          </div>

          <div className="nr-portal-feed">
            <article>
              <span className="nr-portal-feed-dot nr-portal-feed-dot--success" />
              <div>
                <strong>{t.programsUpdated}</strong>
                <p>{t.programsUpdatedDescription}</p>
                <small>{t.momentsAgo}</small>
              </div>
            </article>

            <article>
              <span className="nr-portal-feed-dot" />
              <div>
                <strong>{t.mediaReady}</strong>
                <p>{t.mediaReadyDescription}</p>
                <small>{t.today}</small>
              </div>
            </article>

            <article>
              <span className="nr-portal-feed-dot nr-portal-feed-dot--warning" />
              <div>
                <strong>{t.reviewData}</strong>
                <p>{t.reviewDataDescription}</p>
                <small>{t.today}</small>
              </div>
            </article>
          </div>

          <Link href="/admin/dashboard" className="nr-portal-panel-footer">
            {t.viewNotifications}
          </Link>
        </section>

        <section className="nr-portal-panel nr-portal-activity-panel">
          <div className="nr-portal-panel-heading">
            <div>
              <span className="nr-dashboard-kicker">{t.activityLog}</span>
              <h2>{t.latestActivity}</h2>
            </div>
          </div>

          <div className="nr-portal-activity-table">
            <div className="nr-portal-activity-row nr-portal-activity-head">
              <span>{t.operation}</span>
              <span>{t.module}</span>
              <span>{t.status}</span>
              <span>{t.time}</span>
            </div>

            <div className="nr-portal-activity-row">
              <strong>{t.updateProgram}</strong>
              <span>{t.programs}</span>
              <span className="nr-portal-status nr-portal-status--success">
                {t.completed}
              </span>
              <small>{t.momentsAgo}</small>
            </div>

            <div className="nr-portal-activity-row">
              <strong>{t.uploadImage}</strong>
              <span>{t.media}</span>
              <span className="nr-portal-status nr-portal-status--success">
                {t.completed}
              </span>
              <small>{t.today}</small>
            </div>

            <div className="nr-portal-activity-row">
              <strong>{t.addUser}</strong>
              <span>{t.users}</span>
              <span className="nr-portal-status nr-portal-status--pending">
                {t.pendingReview}
              </span>
              <small>{t.yesterday}</small>
            </div>
          </div>
        </section>
      </div>

      <section className="nr-portal-panel nr-portal-recent">
        <div className="nr-portal-panel-heading">
          <div>
            <span className="nr-dashboard-kicker">{t.recentAccess}</span>
            <h2>{t.recentPages}</h2>
          </div>
        </div>

        <div className="nr-portal-recent-links">
          <Link href="/admin/programs">
            {t.managePrograms}
            <span>{arrow}</span>
          </Link>
          <Link href="/admin/media">
            {t.mediaLibrary}
            <span>{arrow}</span>
          </Link>
          <Link href="/admin/countries">
            {t.countriesManagement}
            <span>{arrow}</span>
          </Link>
          <Link href="/admin/users">
            {t.usersPermissions}
            <span>{arrow}</span>
          </Link>
        </div>
      </section>
    </section>
  );
}