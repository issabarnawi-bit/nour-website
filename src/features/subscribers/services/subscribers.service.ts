import { createBrowserClient } from "@supabase/ssr";

export type SubscriberLanguage = "ar" | "en";

export type SubscriberChannel =
  | "email"
  | "whatsapp"
  | "email_and_whatsapp";

export type SubscribeToUpdatesInput = {
  fullName?: string;
  email?: string;
  phone?: string;
  countryCode?: string;
  preferredLanguage?: SubscriberLanguage;
  preferredChannel?: SubscriberChannel;
  consentGiven: boolean;
  consentSource?: string;
  sourcePage?: string;
};

export type SubscribeToUpdatesResult = {
  subscriberId: string;
  status: "active";
  subscribed: true;
};

function createSupabaseBrowserClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL;

  const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error(
      "Supabase browser environment variables are missing.",
    );
  }

  return createBrowserClient(
    supabaseUrl,
    supabaseKey,
  );
}

function normalizeOptionalValue(
  value?: string,
): string | null {
  const normalizedValue = value?.trim();

  return normalizedValue || null;
}

export async function subscribeToUpdates(
  input: SubscribeToUpdatesInput,
): Promise<SubscribeToUpdatesResult> {
  if (!input.consentGiven) {
    throw new Error(
      "يجب الموافقة على استلام التحديثات.",
    );
  }

  const email =
    normalizeOptionalValue(input.email)?.toLowerCase() ??
    null;

  const phone =
    normalizeOptionalValue(input.phone);

  if (!email && !phone) {
    throw new Error(
      "يرجى إدخال البريد الإلكتروني أو رقم الجوال.",
    );
  }

  const supabase =
    createSupabaseBrowserClient();

  const { data, error } = await supabase.rpc(
    "subscribe_to_updates",
    {
      p_full_name:
        normalizeOptionalValue(input.fullName),
      p_email: email,
      p_phone: phone,
      p_country_code:
        normalizeOptionalValue(
          input.countryCode,
        )?.toUpperCase() ?? null,
      p_preferred_language:
        input.preferredLanguage ?? "ar",
      p_preferred_channel:
        input.preferredChannel ?? "email",
      p_consent_given:
        input.consentGiven,
      p_consent_source:
        normalizeOptionalValue(
          input.consentSource,
        ),
      p_source_page:
        normalizeOptionalValue(
          input.sourcePage,
        ),
    },
  );

  if (error) {
    throw new Error(
      error.message ||
        "تعذر تسجيل الاشتراك في الوقت الحالي.",
    );
  }

  const result = data as {
    subscriber_id?: string;
    status?: string;
    subscribed?: boolean;
  } | null;

  if (
    !result?.subscriber_id ||
    result.status !== "active" ||
    result.subscribed !== true
  ) {
    throw new Error(
      "تم استلام استجابة غير متوقعة من نظام الاشتراك.",
    );
  }

  return {
    subscriberId: result.subscriber_id,
    status: "active",
    subscribed: true,
  };
}