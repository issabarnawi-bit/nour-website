"use client";

import Link from "next/link";

import {
  getAdminTranslations,
  useLanguage,
} from "../../../core/i18n";

export default function Sidebar() {
  const { language } = useLanguage();
  const t = getAdminTranslations(language);

  const navigationItems = [
    {
      label: t.sidebar.dashboard,
      href: "/admin/dashboard",
      icon: "⌂",
    },
    {
      label: t.sidebar.countries,
      href: "/admin/countries",
      icon: "◎",
    },
    {
      label: t.sidebar.programs,
      href: "/admin/programs",
      icon: "▣",
    },
    {
      label: t.sidebar.media,
      href: "/admin/media",
      icon: "□",
    },
    {
      label: t.sidebar.users,
      href: "/admin/users",
      icon: "◇",
    },
    {
      label:
        language === "ar"
          ? "الإعدادات"
          : "Settings",
      href: "/admin/settings",
      icon: "⚙",
    },
  ];

  return (
    <aside className="nr-admin-sidebar">
      <div className="nr-admin-sidebar-brand">
        <span
          className="nr-admin-sidebar-logo"
          aria-hidden="true"
        >
          ن
        </span>

        <div className="nr-admin-sidebar-brand-text">
          <strong>NourApp Platform</strong>

          <small>
            {language === "ar"
              ? "لوحة الإدارة"
              : "Admin Panel"}
          </small>
        </div>
      </div>

      <nav
        className="nr-admin-sidebar-nav"
        aria-label={
          language === "ar"
            ? "التنقل في لوحة التحكم"
            : "Admin navigation"
        }
      >
        {navigationItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="nr-admin-sidebar-link"
          >
            <span
              className="nr-admin-sidebar-link-icon"
              aria-hidden="true"
            >
              {item.icon}
            </span>

            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="nr-admin-sidebar-footer">
        <div className="nr-admin-sidebar-status">
          <span
            className="nr-admin-sidebar-status-dot"
            aria-hidden="true"
          />

          <div>
            <strong>
              {language === "ar"
                ? "النظام متصل"
                : "System Online"}
            </strong>

            <small>
              Supabase Production
            </small>
          </div>
        </div>
      </div>
    </aside>
  );
}