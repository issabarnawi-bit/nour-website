import { createServerClient } from "@supabase/ssr";
import {
  NextResponse,
  type NextRequest,
} from "next/server";

async function readMaintenanceMode(
  supabase: ReturnType<typeof createServerClient>,
): Promise<boolean> {
  try {
    const { data, error } = await supabase.rpc(
      "get_maintenance_mode",
    );

    if (error) {
      return false;
    }

    return data === true;
  } catch {
    return false;
  }
}

export async function updateSession(
  request: NextRequest,
) {
  let response = NextResponse.next({
    request,
  });

  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const supabasePublishableKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

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

  const isMaintenanceRoute =
    pathname === "/maintenance";

  const isApiRoute =
    pathname.startsWith("/api");

  // تطبيق وضع الصيانة على الموقع العام فقط
  if (
    !isAdminRoute &&
    !isMaintenanceRoute &&
    !isApiRoute
  ) {
    const maintenanceMode =
      await readMaintenanceMode(supabase);

    if (maintenanceMode) {
      const maintenanceUrl =
        request.nextUrl.clone();

      maintenanceUrl.pathname =
        "/maintenance";

      maintenanceUrl.search = "";

      return NextResponse.rewrite(
        maintenanceUrl,
      );
    }
  }

  // إذا انتهت الصيانة والمستخدم على صفحة الصيانة
  if (isMaintenanceRoute) {
    const maintenanceMode =
      await readMaintenanceMode(supabase);

    if (!maintenanceMode) {
      const homeUrl =
        request.nextUrl.clone();

      homeUrl.pathname = "/";
      homeUrl.search = "";

      return NextResponse.redirect(
        homeUrl,
      );
    }
  }

  // لا نحتاج فحص Auth للموقع العام
  if (!isAdminRoute) {
    return response;
  }

  const { data: claimsData } =
    await supabase.auth.getClaims();

  const claims =
    claimsData?.claims ?? null;

  // حماية صفحات الإدارة
  if (
    !claims &&
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

  // إذا كان المستخدم مسجلًا وفتح صفحة الدخول
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