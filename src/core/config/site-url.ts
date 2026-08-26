const DEFAULT_SITE_URL = "https://nourappglobal.com";

function normalizeSiteUrl(value?: string | null): string {
  const raw = value?.trim();
  if (!raw) return DEFAULT_SITE_URL;

  const withProtocol =
    raw.startsWith("http://") || raw.startsWith("https://")
      ? raw
      : `https://${raw}`;

  try {
    const url = new URL(withProtocol);
    url.pathname = "/";
    url.search = "";
    url.hash = "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return DEFAULT_SITE_URL;
  }
}

export function getConfiguredSiteUrl(fallback?: string | null): string {
  return normalizeSiteUrl(process.env.NEXT_PUBLIC_SITE_URL || fallback);
}

export function getConfiguredSiteOrigin(fallback?: string | null): URL {
  return new URL(getConfiguredSiteUrl(fallback));
}
