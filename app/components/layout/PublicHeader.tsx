"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";

import type { Language, Theme } from "../../data/home";
import { createClient } from "../../../src/lib/supabase/client";

type NavItem = { id: string; label: string };

type Props = {
  language: Language;
  theme: Theme;
  menuOpen: boolean;
  activeSection: string;
  navItems: NavItem[];
  onLanguageChange: () => void;
  onThemeChange: () => void;
  onMenuToggle: () => void;
  onMenuClose: () => void;
};

export default function PublicHeader({
  language,
  theme,
  menuOpen,
  activeSection,
  navItems,
  onLanguageChange,
  onThemeChange,
  onMenuToggle,
  onMenuClose,
}: Props) {
  const isArabic = language === "ar";
  const supabase = useMemo(() => createClient(), []);
  const [signedIn, setSignedIn] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => setSignedIn(Boolean(data.session)));
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setSignedIn(Boolean(session)));
    return () => data.subscription.unsubscribe();
  }, [supabase]);

  useEffect(() => {
    const update = () => setScrolled(window.scrollY > 18);
    update();
    window.addEventListener("scroll", update, { passive: true });
    return () => window.removeEventListener("scroll", update);
  }, []);

  useEffect(() => {
    const closeOnDesktop = () => {
      if (window.innerWidth > 980 && menuOpen) onMenuClose();
    };
    window.addEventListener("resize", closeOnDesktop);
    return () => window.removeEventListener("resize", closeOnDesktop);
  }, [menuOpen, onMenuClose]);

  const accountHref = signedIn ? "/account/profile" : "/account/login";
  const accountLabel = signedIn
    ? isArabic ? "حسابي" : "My account"
    : isArabic ? "تسجيل الدخول" : "Sign in";

  return (
    <header className={`nr-public-header ${scrolled ? "is-scrolled" : ""}`}>
      <div className="nr-public-topbar">
        <div className="nr-container nr-public-topbar-inner">
          <div className="nr-public-trust">
            <span><ShieldIcon />{isArabic ? "حجز آمن وبيانات محمية" : "Secure booking & protected data"}</span>
            <span className="nr-public-trust-secondary">{isArabic ? "دعم المعتمر طوال الرحلة" : "Pilgrim support throughout the journey"}</span>
          </div>
          <a href="tel:+966567488377" dir="ltr">+966 56 748 8377</a>
        </div>
      </div>

      <div className="nr-public-navbar">
        <div className="nr-container nr-public-navbar-inner">
          <a href="/#home" className="nr-public-logo" aria-label={isArabic ? "الرئيسية" : "Home"} onClick={onMenuClose}>
            <Image src="/images/site/v-logo.png" alt="NourApp" width={150} height={58} priority />
          </a>

          <nav className="nr-public-desktop-nav" aria-label={isArabic ? "التنقل الرئيسي" : "Main navigation"}>
            {navItems.map((item) => (
              <a key={item.id} href={`/#${item.id}`} className={activeSection === item.id ? "is-active" : ""}>
                {item.label}
              </a>
            ))}
          </nav>

          <div className="nr-public-actions">
            <button type="button" className="nr-public-control" onClick={onLanguageChange} aria-label={isArabic ? "Switch to English" : "التبديل إلى العربية"}>
              <GlobeIcon /><span>{isArabic ? "EN" : "AR"}</span>
            </button>
            <button type="button" className="nr-public-control nr-public-theme" onClick={onThemeChange} aria-label={isArabic ? "تغيير المظهر" : "Change theme"}>
              {theme === "light" ? <MoonIcon /> : <SunIcon />}
            </button>
            <Link href={accountHref} className="nr-public-login" onClick={onMenuClose}>
              <UserIcon /><span>{accountLabel}</span>
            </Link>
            <button type="button" className={`nr-public-menu ${menuOpen ? "is-open" : ""}`} onClick={onMenuToggle} aria-expanded={menuOpen} aria-label={isArabic ? "فتح القائمة" : "Open menu"}>
              <span /><span /><span />
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen ? (
          <motion.div className="nr-public-mobile-shell" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
            <nav className="nr-container nr-public-mobile-nav">
              {navItems.map((item) => (
                <a key={item.id} href={`/#${item.id}`} className={activeSection === item.id ? "is-active" : ""} onClick={onMenuClose}>
                  <span>{item.label}</span><ArrowIcon />
                </a>
              ))}
              <div className="nr-public-mobile-secondary">
                <Link href="/programs" onClick={onMenuClose}>{isArabic ? "جميع برامج العمرة" : "All Umrah programs"}</Link>
                <Link href="/articles" onClick={onMenuClose}>{isArabic ? "دليل ومقالات العمرة" : "Umrah guides & articles"}</Link>
              </div>
              <Link href={accountHref} className="nr-public-mobile-login" onClick={onMenuClose}><UserIcon />{accountLabel}</Link>
            </nav>
          </motion.div>
        ) : null}
      </AnimatePresence>

      <style jsx global>{`
        .nr-public-header{position:sticky;top:0;z-index:1000;width:100%;transition:box-shadow .25s ease}.nr-public-header.is-scrolled{box-shadow:0 14px 38px rgba(8,43,88,.12)}
        .nr-public-topbar{min-height:32px;background:#071e3d;color:#eaf2ff;font-size:11px;font-weight:800}.nr-public-topbar-inner,.nr-public-trust,.nr-public-navbar-inner,.nr-public-actions,.nr-public-control,.nr-public-login,.nr-public-mobile-login{display:flex;align-items:center}.nr-public-topbar-inner{min-height:32px;justify-content:space-between;gap:18px}.nr-public-trust{gap:20px}.nr-public-trust span{display:flex;align-items:center;gap:6px}.nr-public-trust svg{width:14px;color:#ffc313}.nr-public-topbar a{color:#fff}
        .nr-public-navbar{border-bottom:1px solid var(--nr-border);background:color-mix(in srgb,var(--nr-bg) 94%,transparent);backdrop-filter:blur(18px)}.nr-public-navbar-inner{min-height:72px;justify-content:space-between;gap:22px}.nr-public-logo{display:flex;align-items:center;flex:0 0 auto}.nr-public-logo img{width:70px;height:54px;object-fit:contain;padding:4px;border-radius:11px;background:#fff}
        .nr-public-desktop-nav{display:flex;align-items:center;justify-content:center;gap:clamp(16px,1.7vw,26px);margin-inline:auto}.nr-public-desktop-nav a{position:relative;padding:24px 0 21px;color:var(--nr-text);font-size:13px;font-weight:850;white-space:nowrap;transition:color .2s ease}.nr-public-desktop-nav a:after{content:"";position:absolute;inset-inline-start:50%;bottom:14px;width:0;height:3px;border-radius:999px;background:#ffc313;transform:translateX(-50%);transition:width .22s ease}.nr-public-desktop-nav a:hover,.nr-public-desktop-nav a.is-active{color:#176fe8}.nr-public-desktop-nav a:hover:after,.nr-public-desktop-nav a.is-active:after{width:76%}
        .nr-public-actions{gap:8px;flex:0 0 auto}.nr-public-control,.nr-public-menu{border:1px solid var(--nr-border);background:var(--nr-card);color:var(--nr-text);cursor:pointer}.nr-public-control{min-height:40px;gap:5px;padding:0 10px;border-radius:12px;font-weight:900}.nr-public-control svg{width:16px}.nr-public-theme{width:40px;padding:0;justify-content:center}.nr-public-login{min-height:42px;gap:8px;padding:0 16px;border-radius:13px;background:#176fe8;color:#fff;font-size:13px;font-weight:900;box-shadow:0 10px 24px rgba(23,111,232,.22);transition:transform .2s ease,box-shadow .2s ease}.nr-public-login:hover{transform:translateY(-2px);box-shadow:0 14px 30px rgba(23,111,232,.28)}.nr-public-login svg,.nr-public-mobile-login svg{width:17px}
        .nr-public-menu{display:none;width:42px;height:42px;border-radius:12px;padding:10px}.nr-public-menu span{display:block;height:2px;margin:4px 0;border-radius:99px;background:currentColor}.nr-public-mobile-shell{display:none;border-bottom:1px solid var(--nr-border);background:var(--nr-bg);box-shadow:0 20px 40px rgba(8,43,88,.1)}.nr-public-mobile-nav{display:grid;gap:4px;padding-block:14px 18px}.nr-public-mobile-nav>a:not(.nr-public-mobile-login){display:flex;align-items:center;justify-content:space-between;padding:12px 4px;border-bottom:1px solid var(--nr-border);color:var(--nr-text);font-weight:850}.nr-public-mobile-nav>a.is-active{color:#176fe8}.nr-public-mobile-nav svg{width:16px}.nr-public-mobile-secondary{display:grid;grid-template-columns:1fr 1fr;gap:8px;padding:10px 0}.nr-public-mobile-secondary a{padding:11px;border-radius:11px;background:var(--nr-soft);color:var(--nr-text);font-size:12px;font-weight:800;text-align:center}.nr-public-mobile-login{justify-content:center;gap:8px;min-height:44px;border-radius:12px;background:#176fe8;color:#fff;font-weight:900}
        @media(max-width:1100px){.nr-public-desktop-nav{gap:14px}.nr-public-desktop-nav a{font-size:12px}.nr-public-login{padding:0 12px}}
        @media(max-width:980px){.nr-public-desktop-nav{display:none}.nr-public-menu{display:block}.nr-public-mobile-shell{display:block}.nr-public-navbar-inner{min-height:66px}.nr-public-login span{display:none}.nr-public-login{width:42px;padding:0;justify-content:center}.nr-public-trust-secondary{display:none}}
        @media(max-width:560px){.nr-public-topbar{display:none}.nr-public-navbar-inner{gap:10px}.nr-public-logo img{width:62px;height:48px}.nr-public-control span{display:none}.nr-public-control{width:38px;padding:0;justify-content:center}.nr-public-actions{gap:6px}.nr-public-mobile-secondary{grid-template-columns:1fr}}
      `}</style>
    </header>
  );
}

function ShieldIcon(){return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 3 5 6v5c0 5 3.5 8.5 7 10 3.5-1.5 7-5 7-10V6l-7-3Z"/><path d="m9 12 2 2 4-4"/></svg>}
function GlobeIcon(){return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="9"/><path d="M3 12h18M12 3a15 15 0 0 1 0 18M12 3a15 15 0 0 0 0 18"/></svg>}
function UserIcon(){return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="8" r="4"/><path d="M4 21a8 8 0 0 1 16 0"/></svg>}
function MoonIcon(){return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 15.5A8.5 8.5 0 0 1 8.5 4 8 8 0 1 0 20 15.5Z"/></svg>}
function SunIcon(){return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M4.93 19.07l1.41-1.41M17.66 6.34l1.41-1.41"/></svg>}
function ArrowIcon(){return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="m9 18 6-6-6-6"/></svg>}
