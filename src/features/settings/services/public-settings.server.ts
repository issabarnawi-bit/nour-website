import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

type PublicSettingRow = {
  setting_key: string;
  value_json: unknown;
};

export type PublicServerSettingsMap = Record<
  string,
  unknown
>;

function getSupabaseEnvironment() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const supabaseKey =
    process.env
      .NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    return null;
  }

  return {
    supabaseUrl,
    supabaseKey,
  };
}

export async function getPublicServerSettings(): Promise<PublicServerSettingsMap> {
  const environment =
    getSupabaseEnvironment();

  /*
   * لا نوقف تشغيل الموقع عند غياب المتغيرات.
   * ستستخدم generateMetadata القيم الاحتياطية.
   */
  if (!environment) {
    console.error(
      "Supabase environment variables are missing. Expected NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY.",
    );

    return {};
  }

  const cookieStore = await cookies();

  const supabase = createServerClient(
    environment.supabaseUrl,
    environment.supabaseKey,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },

        setAll() {
          /*
           * هذه الخدمة مخصصة للقراءة داخل generateMetadata،
           * لذلك لا نعدّل ملفات الارتباط هنا.
           */
        },
      },
    },
  );

  const { data, error } = await supabase.rpc(
    "get_public_platform_settings",
  );

  if (error) {
    console.error(
      "Failed to load public platform settings:",
      error.message,
    );

    return {};
  }

  const rows =
    (data ?? []) as PublicSettingRow[];

  return rows.reduce<PublicServerSettingsMap>(
    (result, setting) => {
      result[setting.setting_key] =
        setting.value_json;

      return result;
    },
    {},
  );
}

export function getServerTextSetting(
  settings: PublicServerSettingsMap,
  key: string,
  fallbackValue: string,
): string {
  const value = settings[key];

  if (
    typeof value !== "string" ||
    value.trim().length === 0
  ) {
    return fallbackValue;
  }

  return value.trim();
}