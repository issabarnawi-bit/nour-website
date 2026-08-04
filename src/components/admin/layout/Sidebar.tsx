"use client";

import Image from "next/image";
import Link from "next/link";
import {
  BarChart3,
  CircleGauge,
  FolderOpen,
  Globe2,
  Images,
  Settings,
  Users,
} from "lucide-react";

import type { LucideIcon } from "lucide-react";

import {
  getAdminTranslations,
  useLanguage,
} from "../../../core/i18n";

type SidebarNavigationItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

export default function Sidebar() {
  const { language } = useLanguage();
  const t = getAdminTranslations(language);

  const navigationItems: SidebarNavigationItem[] = [
    {
      label: t.sidebar.dashboard,
      href: "/admin/dashboard",
      icon: CircleGauge,
    },
    {
      label: t.sidebar.countries,
      href: "/admin/countries",
      icon: Globe2,
    },
    {
      label: t.sidebar.programs,
      href: "/admin/programs",
      icon: FolderOpen,
    },
    {
      label: t.sidebar.media,
      href: "/admin/media",
      icon: Images,
    },
    {
      label: t.sidebar.users,
      href: "/admin/users",
      icon: Users,
    },
    {
      label:
        language === "ar"
          ? "التحليلات"
          : "Analytics",
      href: "/admin/analytics",
      icon: BarChart3,
    },
    {
      label:
        language === "ar"
          ? "الإعدادات"
          : "Settings",
      href: "/admin/settings",
      icon: Settings,
    },
  ];

  return (
    <aside className="nr-admin-sidebar">
      <div className="nr-admin-sidebar-brand">
        <span className="nr-admin-sidebar-logo">
          <Image
            src="/images/nour-logo.jpg"
            alt="NourApp"
            width={34}
            height={34}
            priority
          />
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
        {navigationItems.map((item) => {
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              className="nr-admin-sidebar-link"
              title={item.label}
            >
              <span
                className="nr-admin-sidebar-link-icon"
                aria-hidden={true}
              >
                <Icon
                  size={20}
                  strokeWidth={1.9}
                />
              </span>

              <span className="nr-admin-sidebar-link-label">
                {item.label}
              </span>
            </Link>
          );
        })}
      </nav>

      <div className="nr-admin-sidebar-footer">
        <div className="nr-admin-sidebar-status">
          <span
            className="nr-admin-sidebar-status-dot"
            aria-hidden={true}
          />

          <div>
            <strong>
              {language === "ar"
                ? "النظام متصل"
                : "System Online"}
            </strong>

            <small>Supabase Production</small>
          </div>
        </div>
      </div>
    </aside>
  );
}