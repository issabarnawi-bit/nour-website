import { createServerClient } from "@supabase/ssr";
import {
  NextResponse,
  type NextRequest,
} from "next/server";

export async function updateSession(
  request: NextRequest,
) {
  let response = NextResponse.next({
    request,
  });

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const supabasePublishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabasePublishableKey) {
    throw new Error(
      "Supabase environment variables are missing.",
    );
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabasePublishableKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },

        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => {
            request.cookies.set(name, value);
          });

          response = NextResponse.next({
            request,
          });

          cookiesToSet.forEach(
            ({ name, value, options }) => {
              response.cookies.set(
                name,
                value,
                options,
              );
            },
          );
        },
      },
    },
  );

  const { data: claimsData } =
    await supabase.auth.getClaims();

  const claims = claimsData?.claims ?? null;
  const pathname = request.nextUrl.pathname;

  const isAdminRoute =
    pathname.startsWith("/admin");

  const isAdminLoginRoute =
    pathname === "/admin/login";

  const isAdminInviteRoute =
    pathname === "/admin/invite";

  const isPublicAdminRoute =
    isAdminLoginRoute ||
    isAdminInviteRoute;

  // حماية جميع صفحات الإدارة
  // باستثناء تسجيل الدخول وتفعيل الدعوة
  if (
    !claims &&
    isAdminRoute &&
    !isPublicAdminRoute
  ) {
    const redirectUrl =
      request.nextUrl.clone();

    redirectUrl.pathname =
      "/admin/login";

    redirectUrl.search = "";

    return NextResponse.redirect(
      redirectUrl,
    );
  }

  // إذا كان المستخدم مسجلًا بالفعل
  // ودخل صفحة تسجيل الدخول
  if (
    claims &&
    isAdminLoginRoute
  ) {
    const redirectUrl =
      request.nextUrl.clone();

    redirectUrl.pathname =
      "/admin/dashboard";

    redirectUrl.search = "";

    return NextResponse.redirect(
      redirectUrl,
    );
  }

  return response;
}