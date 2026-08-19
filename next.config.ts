import type { NextConfig } from "next";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;

let supabaseOrigin = "";

try {
  if (supabaseUrl) {
    supabaseOrigin = new URL(supabaseUrl).origin;
  }
} catch {
  supabaseOrigin = "";
}

const contentSecurityPolicy = `
  default-src 'self';
  base-uri 'self';
  form-action 'self';
  frame-ancestors 'none';
  object-src 'none';

  script-src
    'self'
    'unsafe-inline'
    'unsafe-eval';

  style-src
    'self'
    'unsafe-inline';

  img-src
    'self'
    data:
    blob:
    ${supabaseOrigin};

  font-src
    'self'
    data:;

  connect-src
    'self'
    ${supabaseOrigin}
    wss://*.supabase.co
    https://*.supabase.co;

  media-src
    'self'
    blob:
    ${supabaseOrigin};

  frame-src
    'none';

  worker-src
    'self'
    blob:;

  manifest-src
    'self';

  upgrade-insecure-requests;
`
  .replace(/\s{2,}/g, " ")
  .trim();

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: contentSecurityPolicy,
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "X-Frame-Options",
    value: "DENY",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value:
      "camera=(), microphone=(), geolocation=(), browsing-topics=(), payment=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=31536000",
  },
  {
    key: "X-DNS-Prefetch-Control",
    value: "off",
  },
];

const nextConfig: NextConfig = {
  poweredByHeader: false,

  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;