"use client";

import { useEffect, useMemo, useState } from "react";
import SiteEnhancements from "./components/SiteEnhancements";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";
import Hero from "./components/home/Hero";
import WhyNour from "./components/home/WhyNour";
import Goals from "./components/home/Goals";
import About from "./components/home/About";
import Services from "./components/home/Services";
import ProgramsPreview from "./components/home/ProgramsPreview";
import TrustMetrics from "./components/home/TrustMetrics";
import Journey from "./components/home/Journey";
import Testimonials from "./components/home/testimonials";
import Showcase from "./components/home/Showcase";
import Payments from "./components/home/Payments";
import CTA from "./components/home/CTA";
import {
  appScreens,
  copy,
  sectionIds,
  type Language,
  type SectionId,
  type Theme,
} from "./data/home";

export default function Home() {
  const [language, setLanguage] = useState<Language>("ar");
  const [theme, setTheme] = useState<Theme>("light");
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>("home");
  const [activeScreen, setActiveScreen] = useState(0);
  const t = copy[language];

  const navItems = useMemo(
    () => sectionIds.map((id, index) => ({ id, label: t.nav[index] })),
    [t],
  );

  useEffect(() => {
    const timer = window.setInterval(
      () =>
        setActiveScreen(
          (current) => (current + 1) % appScreens.length,
        ),
      3500,
    );

    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const savedLanguage = localStorage.getItem("nour-language");
    const savedTheme = localStorage.getItem("nour-theme");

    setLanguage(savedLanguage === "en" ? "en" : "ar");
    setTheme(savedTheme === "dark" ? "dark" : "light");
  }, []);

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = language === "ar" ? "rtl" : "ltr";
    document.documentElement.dataset.theme = theme;

    localStorage.setItem("nour-language", language);
    localStorage.setItem("nour-theme", theme);
  }, [language, theme]);

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter((section): section is HTMLElement => Boolean(section));

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const current = entries
          .filter((entry) => entry.isIntersecting)
          .sort(
            (a, b) =>
              b.intersectionRatio - a.intersectionRatio,
          )[0]?.target.id as SectionId | undefined;

        if (current) setActiveSection(current);
      },
      {
        rootMargin: "-25% 0px -60% 0px",
        threshold: [0.05, 0.2, 0.45, 0.7],
      },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, []);

  return (
    <main className="nour-redesign">
      <SiteEnhancements />

      <Header
        t={t}
        language={language}
        theme={theme}
        menuOpen={menuOpen}
        activeSection={activeSection}
        navItems={navItems}
        onLanguageChange={() =>
          setLanguage((current) =>
            current === "ar" ? "en" : "ar",
          )
        }
        onThemeChange={() =>
          setTheme((current) =>
            current === "light" ? "dark" : "light",
          )
        }
        onMenuToggle={() =>
          setMenuOpen((current) => !current)
        }
        onMenuClose={() => setMenuOpen(false)}
      />

      <Hero t={t} />
      <WhyNour language={language} />
      <Goals t={t} />
      <About t={t} />
      <Services language={language} />
      <ProgramsPreview language={language} />
      <TrustMetrics language={language} />
      <Journey t={t} language={language} />
      <Testimonials language={language} />

      <Showcase
        t={t}
        language={language}
        activeScreen={activeScreen}
        onScreenChange={setActiveScreen}
      />

      <Payments language={language} />
      <CTA t={t} language={language} />
      <Footer t={t} language={language} />
    </main>
  );
}
