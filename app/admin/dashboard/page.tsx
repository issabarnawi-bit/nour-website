"use client";

import Link from "next/link";
import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  Activity,
  ArrowUpRight,
  BriefcaseBusiness,
  CalendarCheck2,
  CalendarDays,
  CheckCircle2,
  CircleDollarSign,
  Clock3,
  FolderOpen,
  Handshake,
  ImagePlus,
  PlusCircle,
  Scale,
  Settings2,
  UserCheck,
  Users,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import { useLanguage } from "../../../src/core/i18n";
import { createClient } from "../../../src/lib/supabase/client";
import { getAdminAnalyticsSummary } from "../../../src/features/analytics/services/admin-analytics.service";

type BookingStatus = "pending_payment" | "confirmed" | "cancelled" | "expired" | "refunded";

type BookingRow = {
  id: string;
  reference: string;
  contact_name: string;
  travelers_count: number;
  total_amount: number | string;
  currency_code: string;
  status: BookingStatus;
  payment_status: string;
  created_at: string;
  programs: { title_ar: string; title_en: string } | { title_ar: string; title_en: string }[] | null;
};

type OverviewCard = {
  title: string;
  value: string;
  description: string;
  icon: LucideIcon;
  href: string;
  tone?: "blue" | "green" | "gold" | "violet";
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
  const supabase = useMemo(() => createClient(), []);

  const analyticsQuery = useQuery({
    queryKey: ["admin", "analytics", "summary"],
    queryFn: () => getAdminAnalyticsSummary(supabase),
    staleTime: 60 * 1000,
    refetchOnWindowFocus: true,
  });

  const applicationsQuery = useQuery({
    queryKey: ["admin", "applications", "new-counts"],
    queryFn: async () => {
      const [jobsResult, partnersResult] = await Promise.all([
        supabase.from("job_applications").select("id", { count: "exact", head: true }).eq("status", "new").is("deleted_at", null),
        supabase.from("partner_applications").select("id", { count: "exact", head: true }).eq("status", "new").is("deleted_at", null),
      ]);
      if (jobsResult.error) throw jobsResult.error;
      if (partnersResult.error) throw partnersResult.error;
      return { jobs: jobsResult.count ?? 0, partners: partnersResult.count ?? 0 };
    },
    staleTime: 30 * 1000,
    refetchOnWindowFocus: true,
  });

  const bookingsQuery = useQuery({
    queryKey: ["admin", "bookings", "dashboard"],
    queryFn: async () => {
      const [pending, confirmed, total, recent] = await Promise.all([
        supabase.from("bookings").select("id", { count: "exact", head: true }).eq("status", "pending_payment").is("deleted_at", null),
        supabase.from("bookings").select("id", { count: "exact", head: true }).eq("status", "confirmed").is("deleted_at", null),
        supabase.from("bookings").select("id", { count: "exact", head: true }).is("deleted_at", null),
        supabase
          .from("bookings")
          .select("id,reference,contact_name,travelers_count,total_amount,currency_code,status,payment_status,created_at,programs(title_ar,title_en)")
          .is("deleted_at", null)
          .order("created_at", { ascending: false })
          .limit(5),
      ]);

      for (const result of [pending, confirmed, total, recent]) {
        if (result.error) throw result.error;
      }

      return {
        pending: pending.count ?? 0,
        confirmed: confirmed.count ?? 0,
        total: total.count ?? 0,
        recent: (recent.data ?? []) as BookingRow[],
      };
    },
    staleTime: 20 * 1000,
    refetchOnWindowFocus: true,
  });

  const today = new Intl.DateTimeFormat(isArabic ? "ar-SA" : "en-US", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date());

  const number = (value: number | undefined, loading: boolean, error: boolean) => {
    if (loading) return "...";
    if (error) return "—";
    return new Intl.NumberFormat(isArabic ? "ar-SA" : "en-US").format(value ?? 0);
  };

  const overviewCards: OverviewCard[] = [
    {
      title: isArabic ? "زيارات اليوم" : "Today's visits",
      value: number(analyticsQuery.data?.visitsToday, analyticsQuery.isLoading, analyticsQuery.isError),
      description: isArabic ? "إجمالي زيارات صفحات الموقع اليوم" : "Total website page visits today",
      icon: Activity,
      href: "/admin/analytics",
      tone: "blue",
    },
    {
      title: isArabic ? "الزوار الفريدون" : "Unique visitors",
      value: number(analyticsQuery.data?.uniqueVisitorsToday, analyticsQuery.isLoading, analyticsQuery.isError),
      description: isArabic ? "الجلسات المميزة المسجلة اليوم" : "Distinct visitor sessions today",
      icon: Users,
      href: "/admin/analytics",
      tone: "violet",
    },
    {
      title: isArabic ? "حجوزات بانتظار الدفع" : "Pending payment",
      value: number(bookingsQuery.data?.pending, bookingsQuery.isLoading, bookingsQuery.isError),
      description: isArabic ? "حجوزات نشطة تحتاج متابعة الدفع" : "Active bookings awaiting payment",
      icon: Clock3,
      href: "/admin/bookings?status=pending_payment",
      tone: "gold",
    },
    {
      title: isArabic ? "الحجوزات المؤكدة" : "Confirmed bookings",
      value: number(bookingsQuery.data?.confirmed, bookingsQuery.isLoading, bookingsQuery.isError),
      description: isArabic ? `من أصل ${number(bookingsQuery.data?.total, bookingsQuery.isLoading, bookingsQuery.isError)} حجز` : `Out of ${number(bookingsQuery.data?.total, bookingsQuery.isLoading, bookingsQuery.isError)} bookings`,
      icon: CheckCircle2,
      href: "/admin/bookings?status=confirmed",
      tone: "green",
    },
    {
      title: isArabic ? "طلبات انضمام جديدة" : "New join applications",
      value: number(applicationsQuery.data?.jobs, applicationsQuery.isLoading, applicationsQuery.isError),
      description: isArabic ? "طلبات بانتظار المراجعة" : "Applications awaiting review",
      icon: BriefcaseBusiness,
      href: "/admin/applications",
      tone: "blue",
    },
    {
      title: isArabic ? "طلبات شراكة جديدة" : "New partner applications",
      value: number(applicationsQuery.data?.partners, applicationsQuery.isLoading, applicationsQuery.isError),
      description: isArabic ? "طلبات شراكة بانتظار المراجعة" : "Partnership requests awaiting review",
      icon: Handshake,
      href: "/admin/partners",
      tone: "violet",
    },
  ];

  const quickActions: QuickAction[] = [
    { title: isArabic ? "إدارة الحجوزات" : "Manage bookings", description: isArabic ? "راجع الحجوزات وحالات الدفع والتأكيد." : "Review bookings, payment, and confirmation status.", href: "/admin/bookings", icon: CalendarCheck2 },
    { title: isArabic ? "إضافة برنامج" : "Add program", description: isArabic ? "أنشئ برنامج عمرة وجهّزه للنشر." : "Create an Umrah program and prepare it for publishing.", href: "/admin/programs", icon: PlusCircle },
    { title: isArabic ? "إدارة البرامج" : "Manage programs", description: isArabic ? "راجع المواعيد والأسعار والمحتوى التفصيلي." : "Review departures, pricing, and detailed content.", href: "/admin/programs", icon: FolderOpen },
    { title: isArabic ? "رفع وسائط" : "Upload media", description: isArabic ? "أضف الصور والملفات إلى مكتبة الوسائط." : "Add images and files to the media library.", href: "/admin/media", icon: ImagePlus },
    { title: isArabic ? "إدارة المستخدمين" : "Manage users", description: isArabic ? "راجع المستخدمين والأدوار والصلاحيات." : "Review users, roles, and permissions.", href: "/admin/users", icon: Settings2 },
    { title: isArabic ? "المحتوى القانوني" : "Legal content", description: isArabic ? "راجع الشروط وسياسة الخصوصية والإصدارات." : "Review terms, privacy policy, and versions.", href: "/admin/legal", icon: Scale },
  ];

  const statusLabel = (status: BookingStatus) => {
    const ar: Record<BookingStatus, string> = { pending_payment: "بانتظار الدفع", confirmed: "مؤكد", cancelled: "ملغي", expired: "منتهي", refunded: "مسترد" };
    const en: Record<BookingStatus, string> = { pending_payment: "Pending payment", confirmed: "Confirmed", cancelled: "Cancelled", expired: "Expired", refunded: "Refunded" };
    return (isArabic ? ar : en)[status];
  };

  const formatMoney = (value: number | string, currency: string) =>
    `${new Intl.NumberFormat(isArabic ? "ar-SA" : "en-US", { maximumFractionDigits: 2 }).format(Number(value) || 0)} ${currency}`;

  const formatDate = (value: string) =>
    new Intl.DateTimeFormat(isArabic ? "ar-SA" : "en-US", { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" }).format(new Date(value));

  const getProgramTitle = (row: BookingRow) => {
    const program = Array.isArray(row.programs) ? row.programs[0] : row.programs;
    return program ? (isArabic ? program.title_ar : program.title_en) : (isArabic ? "برنامج عمرة" : "Umrah program");
  };

  return (
    <section className="nr-dashboard nr-ops-dashboard" dir={isArabic ? "rtl" : "ltr"}>
      <header className="nr-ops-head">
        <div>
          <span className="nr-dashboard-kicker">{isArabic ? "لوحة إدارة نور" : "Nour Administration"}</span>
          <h1>{isArabic ? "نظرة تشغيلية على المنصة" : "Platform operations overview"}</h1>
          <p>{isArabic ? "تابع الحجوزات والزوار والطلبات من شاشة واحدة، وانتقل مباشرة إلى المهام التي تحتاج متابعة." : "Track bookings, visitors, and applications from one place and jump directly to items that need attention."}</p>
        </div>
        <div className="nr-ops-date"><CalendarDays size={17} /><span>{today}</span></div>
      </header>

      <div className="nr-ops-stats">
        {overviewCards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.title} href={card.href} className={`nr-ops-stat is-${card.tone ?? "blue"}`}>
              <div className="nr-ops-stat-top"><span className="nr-ops-icon"><Icon size={21} /></span><ArrowUpRight size={17} /></div>
              <strong>{card.value}</strong>
              <span className="nr-ops-stat-title">{card.title}</span>
              <small>{card.description}</small>
            </Link>
          );
        })}
      </div>

      <div className="nr-ops-grid">
        <section className="nr-ops-panel nr-ops-bookings-panel">
          <div className="nr-ops-panel-head">
            <div><span>{isArabic ? "الحجوزات" : "Bookings"}</span><h2>{isArabic ? "أحدث الحجوزات" : "Latest bookings"}</h2></div>
            <Link href="/admin/bookings">{isArabic ? "عرض الكل" : "View all"}<ArrowUpRight size={16} /></Link>
          </div>

          {bookingsQuery.isLoading ? <div className="nr-ops-empty">{isArabic ? "جارٍ تحميل الحجوزات..." : "Loading bookings..."}</div> : null}
          {bookingsQuery.isError ? <div className="nr-ops-empty is-error">{isArabic ? "تعذر تحميل بيانات الحجوزات." : "Unable to load booking data."}</div> : null}
          {!bookingsQuery.isLoading && !bookingsQuery.isError && bookingsQuery.data?.recent.length === 0 ? <div className="nr-ops-empty">{isArabic ? "لا توجد حجوزات حتى الآن." : "No bookings yet."}</div> : null}

          {bookingsQuery.data?.recent.length ? (
            <div className="nr-ops-bookings">
              {bookingsQuery.data.recent.map((booking) => (
                <Link href={`/admin/bookings?booking=${booking.id}`} key={booking.id} className="nr-ops-booking-row">
                  <div className="nr-ops-booking-main"><strong>{booking.reference}</strong><span>{getProgramTitle(booking)}</span><small>{booking.contact_name}</small></div>
                  <div className="nr-ops-booking-meta"><span>{booking.travelers_count} {isArabic ? "مسافر" : "traveler(s)"}</span><strong>{formatMoney(booking.total_amount, booking.currency_code)}</strong></div>
                  <div className="nr-ops-booking-end"><span className={`nr-ops-status is-${booking.status}`}>{statusLabel(booking.status)}</span><small>{formatDate(booking.created_at)}</small></div>
                </Link>
              ))}
            </div>
          ) : null}
        </section>

        <section className="nr-ops-panel">
          <div className="nr-ops-panel-head"><div><span>{isArabic ? "وصول سريع" : "Quick access"}</span><h2>{isArabic ? "الإجراءات الأساسية" : "Core actions"}</h2></div></div>
          <div className="nr-ops-actions">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return <Link href={action.href} key={action.title} className="nr-ops-action"><span><Icon size={20} /></span><div><strong>{action.title}</strong><p>{action.description}</p></div><ArrowUpRight size={17} /></Link>;
            })}
          </div>
        </section>
      </div>

      <section className="nr-ops-health">
        <div><span className="nr-ops-health-icon"><CircleDollarSign size={20} /></span><div><strong>{isArabic ? "الحجز التشغيلي" : "Booking operations"}</strong><p>{isArabic ? "الحجوزات المحجوزة مؤقتًا تحتاج متابعة الدفع قبل انتهاء مدة الحجز." : "Temporary booking holds need payment follow-up before they expire."}</p></div><Link href="/admin/bookings?status=pending_payment">{isArabic ? "متابعة" : "Review"}</Link></div>
        <div><span className="nr-ops-health-icon"><UserCheck size={20} /></span><div><strong>{isArabic ? "المشتركون النشطون" : "Active subscribers"}</strong><p>{number(analyticsQuery.data?.activeSubscribers, analyticsQuery.isLoading, analyticsQuery.isError)} {isArabic ? "مشترك نشط" : "active subscribers"}</p></div><Link href="/admin/subscribers">{isArabic ? "عرض" : "View"}</Link></div>
        <div><span className="nr-ops-health-icon"><CalendarCheck2 size={20} /></span><div><strong>{isArabic ? "إجمالي الحجوزات" : "Total bookings"}</strong><p>{number(bookingsQuery.data?.total, bookingsQuery.isLoading, bookingsQuery.isError)} {isArabic ? "حجز مسجل" : "recorded bookings"}</p></div><Link href="/admin/bookings">{isArabic ? "إدارة" : "Manage"}</Link></div>
      </section>

      <style jsx>{`
        .nr-ops-dashboard{display:grid;gap:22px}.nr-ops-head{display:flex;align-items:flex-end;justify-content:space-between;gap:28px;padding:4px 2px}.nr-ops-head h1{margin:7px 0 8px;font-size:clamp(28px,3vw,40px);line-height:1.2}.nr-ops-head p{max-width:760px;margin:0;color:var(--admin-text-muted,#93a4bd);line-height:1.75}.nr-ops-date{display:flex;align-items:center;gap:8px;min-height:44px;padding:0 14px;border:1px solid var(--admin-border,rgba(148,163,184,.18));border-radius:14px;background:var(--admin-card,rgba(255,255,255,.04));color:var(--admin-text-muted,#93a4bd);font-size:12px;font-weight:800;white-space:nowrap}.nr-ops-stats{display:grid;grid-template-columns:repeat(6,minmax(0,1fr));gap:12px}.nr-ops-stat{position:relative;display:grid;gap:6px;min-height:170px;padding:17px;border:1px solid var(--admin-border,rgba(148,163,184,.18));border-radius:18px;background:var(--admin-card,#fff);color:inherit;text-decoration:none;overflow:hidden;transition:transform .2s ease,border-color .2s ease,box-shadow .2s ease}.nr-ops-stat:hover{transform:translateY(-3px);border-color:rgba(23,111,232,.3);box-shadow:0 16px 34px rgba(15,52,92,.08)}.nr-ops-stat:before{content:"";position:absolute;inset-inline-start:0;top:0;width:4px;height:100%;background:#176fe8}.nr-ops-stat.is-green:before{background:#1a9a61}.nr-ops-stat.is-gold:before{background:#e2a900}.nr-ops-stat.is-violet:before{background:#7857d8}.nr-ops-stat-top{display:flex;align-items:center;justify-content:space-between;color:var(--admin-text-muted,#93a4bd)}.nr-ops-icon{display:grid;place-items:center;width:39px;height:39px;border-radius:12px;background:rgba(23,111,232,.09);color:#176fe8}.nr-ops-stat.is-green .nr-ops-icon{background:rgba(26,154,97,.09);color:#1a9a61}.nr-ops-stat.is-gold .nr-ops-icon{background:rgba(226,169,0,.11);color:#9a7400}.nr-ops-stat.is-violet .nr-ops-icon{background:rgba(120,87,216,.1);color:#7857d8}.nr-ops-stat>strong{font-size:30px;line-height:1}.nr-ops-stat-title{font-size:12px;font-weight:900}.nr-ops-stat small{color:var(--admin-text-muted,#93a4bd);font-size:10px;line-height:1.5}.nr-ops-grid{display:grid;grid-template-columns:minmax(0,1.55fr) minmax(320px,.75fr);gap:16px}.nr-ops-panel{padding:20px;border:1px solid var(--admin-border,rgba(148,163,184,.18));border-radius:20px;background:var(--admin-card,#fff)}.nr-ops-panel-head{display:flex;align-items:center;justify-content:space-between;gap:18px;margin-bottom:15px}.nr-ops-panel-head span{color:#176fe8;font-size:10px;font-weight:900}.nr-ops-panel-head h2{margin:4px 0 0;font-size:20px}.nr-ops-panel-head>a{display:flex;align-items:center;gap:5px;color:#176fe8;font-size:11px;font-weight:900}.nr-ops-bookings{display:grid}.nr-ops-booking-row{display:grid;grid-template-columns:minmax(0,1.4fr) minmax(120px,.65fr) minmax(130px,.65fr);align-items:center;gap:14px;padding:14px 4px;border-top:1px solid var(--admin-border,rgba(148,163,184,.14));color:inherit;text-decoration:none}.nr-ops-booking-row:first-child{border-top:0}.nr-ops-booking-row:hover{background:rgba(23,111,232,.025)}.nr-ops-booking-main,.nr-ops-booking-meta,.nr-ops-booking-end{display:grid;gap:4px}.nr-ops-booking-main strong{font-size:13px}.nr-ops-booking-main span,.nr-ops-booking-main small,.nr-ops-booking-meta span,.nr-ops-booking-end small{color:var(--admin-text-muted,#93a4bd);font-size:10px}.nr-ops-booking-meta strong{font-size:12px}.nr-ops-booking-end{justify-items:end}.nr-ops-status{display:inline-flex;align-items:center;justify-content:center;min-height:25px;padding:0 8px;border-radius:999px;background:rgba(226,169,0,.1);color:#9a7400;font-size:9px;font-weight:900}.nr-ops-status.is-confirmed{background:rgba(26,154,97,.1);color:#1a7c50}.nr-ops-status.is-cancelled,.nr-ops-status.is-expired{background:rgba(197,54,54,.08);color:#b23b3b}.nr-ops-status.is-refunded{background:rgba(120,87,216,.09);color:#7857d8}.nr-ops-actions{display:grid;gap:7px}.nr-ops-action{display:grid;grid-template-columns:40px minmax(0,1fr) 18px;align-items:center;gap:10px;padding:10px;border-radius:13px;color:inherit;text-decoration:none;transition:background .2s ease}.nr-ops-action:hover{background:var(--admin-soft,rgba(23,111,232,.05))}.nr-ops-action>span{display:grid;place-items:center;width:40px;height:40px;border-radius:12px;background:rgba(23,111,232,.08);color:#176fe8}.nr-ops-action strong{font-size:12px}.nr-ops-action p{margin:3px 0 0;color:var(--admin-text-muted,#93a4bd);font-size:9px;line-height:1.45}.nr-ops-action>svg{color:var(--admin-text-muted,#93a4bd)}.nr-ops-empty{display:grid;place-items:center;min-height:190px;color:var(--admin-text-muted,#93a4bd);font-size:12px}.nr-ops-empty.is-error{color:#b23b3b}.nr-ops-health{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:12px}.nr-ops-health>div{display:grid;grid-template-columns:42px minmax(0,1fr) auto;align-items:center;gap:11px;padding:15px;border:1px solid var(--admin-border,rgba(148,163,184,.18));border-radius:17px;background:var(--admin-card,#fff)}.nr-ops-health-icon{display:grid;place-items:center;width:42px;height:42px;border-radius:12px;background:rgba(23,111,232,.08);color:#176fe8}.nr-ops-health strong{font-size:12px}.nr-ops-health p{margin:3px 0 0;color:var(--admin-text-muted,#93a4bd);font-size:9px;line-height:1.45}.nr-ops-health a{color:#176fe8;font-size:10px;font-weight:900}.nr-dashboard-kicker{color:#176fe8;font-size:10px;font-weight:900;letter-spacing:.02em}@media(max-width:1500px){.nr-ops-stats{grid-template-columns:repeat(3,minmax(0,1fr))}}@media(max-width:1050px){.nr-ops-grid{grid-template-columns:1fr}.nr-ops-health{grid-template-columns:1fr}}@media(max-width:760px){.nr-ops-head{align-items:flex-start;flex-direction:column}.nr-ops-stats{grid-template-columns:repeat(2,minmax(0,1fr))}.nr-ops-booking-row{grid-template-columns:1fr}.nr-ops-booking-end{justify-items:start}}@media(max-width:520px){.nr-ops-stats{grid-template-columns:1fr}}
      `}</style>
    </section>
  );
}
