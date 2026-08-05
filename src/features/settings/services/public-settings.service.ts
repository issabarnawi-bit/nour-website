import type { SupabaseClient } from "@supabase/supabase-js";

export type PublicSettingGroup =
  | "general"
  | "contact"
  | "booking"
  | "payment"
  | "social"
  | "seo";

export type PublicSettingValueType =
  | "text"
  | "number"
  | "boolean"
  | "email"
  | "phone"
  | "url"
  | "json";

export type PublicPlatformSetting = {
  settingKey: string;
  settingGroup: PublicSettingGroup;
  valueType: PublicSettingValueType;
  value: unknown;
  updatedAt: string;
};

type PublicPlatformSettingRow = {
  setting_key: string;
  setting_group: PublicSettingGroup;
  value_type: PublicSettingValueType;
  value_json: unknown;
  updated_at: string;
};

export type PublicSettingsMap = Record<string, unknown>;

function mapPublicSetting(
  row: PublicPlatformSettingRow,
): PublicPlatformSetting {
  return {
    settingKey: row.setting_key,
    settingGroup: row.setting_group,
    valueType: row.value_type,
    value: row.value_json,
    updatedAt: row.updated_at,
  };
}

export async function getPublicPlatformSettings(
  supabase: SupabaseClient,
): Promise<PublicPlatformSetting[]> {
  const { data, error } = await supabase.rpc(
    "get_public_platform_settings",
  );

  if (error) {
    throw new Error(
      `Failed to load public platform settings: ${error.message}`,
    );
  }

  const rows =
    (data ?? []) as PublicPlatformSettingRow[];

  return rows.map(mapPublicSetting);
}

export async function getPublicSettingsMap(
  supabase: SupabaseClient,
): Promise<PublicSettingsMap> {
  const settings =
    await getPublicPlatformSettings(supabase);

  return settings.reduce<PublicSettingsMap>(
    (result, setting) => {
      result[setting.settingKey] =
        setting.value;

      return result;
    },
    {},
  );
}

export function getPublicSettingValue<T>(
  settings: PublicSettingsMap,
  settingKey: string,
  fallbackValue: T,
): T {
  const value = settings[settingKey];

  if (
    value === null ||
    value === undefined
  ) {
    return fallbackValue;
  }

  return value as T;
}

export function getPublicTextSetting(
  settings: PublicSettingsMap,
  settingKey: string,
  fallbackValue = "",
): string {
  const value = settings[settingKey];

  if (
    typeof value !== "string" ||
    value.trim().length === 0
  ) {
    return fallbackValue;
  }

  return value.trim();
}

export function getPublicBooleanSetting(
  settings: PublicSettingsMap,
  settingKey: string,
  fallbackValue = false,
): boolean {
  const value = settings[settingKey];

  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalizedValue = value
      .trim()
      .toLowerCase();

    if (normalizedValue === "true") {
      return true;
    }

    if (normalizedValue === "false") {
      return false;
    }
  }

  if (typeof value === "number") {
    if (value === 1) {
      return true;
    }

    if (value === 0) {
      return false;
    }
  }

  return fallbackValue;
}

export function getPublicNumberSetting(
  settings: PublicSettingsMap,
  settingKey: string,
  fallbackValue = 0,
): number {
  const value = settings[settingKey];

  if (typeof value === "number") {
    return Number.isFinite(value)
      ? value
      : fallbackValue;
  }

  if (
    typeof value !== "string" ||
    value.trim().length === 0
  ) {
    return fallbackValue;
  }

  const parsedValue = Number(value);

  return Number.isFinite(parsedValue)
    ? parsedValue
    : fallbackValue;
}

export function getPublicArraySetting<T>(
  settings: PublicSettingsMap,
  settingKey: string,
  fallbackValue: T[] = [],
): T[] {
  const value = settings[settingKey];

  if (Array.isArray(value)) {
    return value as T[];
  }

  return fallbackValue;
}

export function getPublicObjectSetting<
  T extends Record<string, unknown>,
>(
  settings: PublicSettingsMap,
  settingKey: string,
  fallbackValue: T,
): T {
  const value = settings[settingKey];

  if (
    typeof value === "object" &&
    value !== null &&
    !Array.isArray(value)
  ) {
    return value as T;
  }

  return fallbackValue;
}