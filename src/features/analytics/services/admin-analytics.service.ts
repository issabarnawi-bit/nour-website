import type { SupabaseClient } from "@supabase/supabase-js";

export type AdminAnalyticsSummary = {
  visitsToday: number;
  visitsLast7Days: number;
  visitsLast30Days: number;
  uniqueVisitorsToday: number;
  totalSubscribers: number;
  activeSubscribers: number;
};

function getStartOfToday(): string {
  const date = new Date();

  date.setHours(0, 0, 0, 0);

  return date.toISOString();
}

function getStartDate(daysAgo: number): string {
  const date = new Date();

  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() - daysAgo);

  return date.toISOString();
}

async function countRows(
  query: PromiseLike<{
    count: number | null;
    error: { message: string } | null;
  }>,
): Promise<number> {
  const { count, error } = await query;

  if (error) {
    throw new Error(error.message);
  }

  return count ?? 0;
}

export async function getAdminAnalyticsSummary(
  supabase: SupabaseClient,
): Promise<AdminAnalyticsSummary> {
  const todayStart = getStartOfToday();
  const last7DaysStart = getStartDate(6);
  const last30DaysStart = getStartDate(29);

  const [
    visitsToday,
    visitsLast7Days,
    visitsLast30Days,
    totalSubscribers,
    activeSubscribers,
  ] = await Promise.all([
    countRows(
      supabase
        .from("page_visits")
        .select("id", {
          count: "exact",
          head: true,
        })
        .gte("visited_at", todayStart),
    ),

    countRows(
      supabase
        .from("page_visits")
        .select("id", {
          count: "exact",
          head: true,
        })
        .gte("visited_at", last7DaysStart),
    ),

    countRows(
      supabase
        .from("page_visits")
        .select("id", {
          count: "exact",
          head: true,
        })
        .gte("visited_at", last30DaysStart),
    ),

    countRows(
      supabase
        .from("newsletter_subscribers")
        .select("id", {
          count: "exact",
          head: true,
        })
        .is("deleted_at", null),
    ),

    countRows(
      supabase
        .from("newsletter_subscribers")
        .select("id", {
          count: "exact",
          head: true,
        })
        .eq("status", "active")
        .is("deleted_at", null),
    ),
  ]);

  const {
    data: todayVisits,
    error: todayVisitsError,
  } = await supabase
    .from("page_visits")
    .select("session_id")
    .gte("visited_at", todayStart);

  if (todayVisitsError) {
    throw new Error(todayVisitsError.message);
  }

  const uniqueVisitorsToday = new Set(
    (todayVisits ?? []).map(
      (visit) => visit.session_id,
    ),
  ).size;

  return {
    visitsToday,
    visitsLast7Days,
    visitsLast30Days,
    uniqueVisitorsToday,
    totalSubscribers,
    activeSubscribers,
  };
}