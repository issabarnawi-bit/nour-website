import type { Language } from "../../data/home";

export default function AppStoreBadge({ language }: { language: Language }) {
  return (
    <span className="nr-store-badge nr-store-badge-custom is-disabled" aria-label={language === "ar" ? "متوفر قريبًا على App Store" : "Coming soon on the App Store"}>
      <svg className="nr-store-apple-icon" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M16.7 12.1c0-2.8 2.3-4.2 2.4-4.3a5.1 5.1 0 0 0-4-2.2c-1.7-.2-3.3 1-4.2 1-.9 0-2.2-1-3.7-1-1.9 0-3.7 1.1-4.7 2.8-2 3.4-.5 8.5 1.4 11.2.9 1.3 2 2.8 3.5 2.7 1.4-.1 1.9-.9 3.6-.9 1.7 0 2.2.9 3.7.9 1.5 0 2.5-1.3 3.4-2.7 1.1-1.5 1.5-3 1.5-3.1-.1 0-2.9-1.1-2.9-4.4zM14 3.8c.8-1 1.3-2.3 1.2-3.6-1.2.1-2.6.8-3.4 1.8-.7.8-1.4 2.2-1.2 3.5 1.3.1 2.6-.7 3.4-1.7z" /></svg>
      <span className="nr-store-badge-copy"><small>{language === "ar" ? "قريبًا على" : "Coming soon on"}</small><strong>App Store</strong></span>
    </span>
  );
}
