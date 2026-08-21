"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useLanguage } from "../src/core/i18n";

import SiteEnhancements from "./components/SiteEnhancements";
import SiteIntro from "./components/SiteIntro";
import Header from "./components/layout/Header";
import Footer from "./components/layout/Footer";

import Hero from "./components/home/Hero";
import ProgramsPreview from "./components/home/ProgramsPreview";
import Services from "./components/home/Services";
import NourWorldMap from "./components/home/why-nour/NourWorldMap";
import Journey from "./components/home/Journey";
import Showcase from "./components/home/Showcase";
import WhyNour from "./components/home/WhyNour";
import Statistics from "./components/home/NourStatistics";
import Payments from "./components/home/Payments";
import CTA from "./components/home/CTA";

import {
  appScreens,
  copy,
  sectionIds,
  type SectionId,
  type Theme,
} from "./data/home";

export default function Home() {
  const {
    language,
    toggleLanguage,
  } = useLanguage();

  const [theme, setTheme] =
    useState<Theme>("light");

  const [menuOpen, setMenuOpen] =
    useState(false);

  const [activeSection, setActiveSection] =
    useState<SectionId>("home");

  const [activeScreen, setActiveScreen] =
    useState(0);

  const t = copy[language];

  const navItems = useMemo(
    () =>
      sectionIds.map(
        (id, index) => ({
          id,
          label: t.nav[index],
        }),
      ),
    [t],
  );

  useEffect(() => {
    const timer =
      window.setInterval(() => {
        setActiveScreen(
          (current) =>
            (current + 1) %
            appScreens.length,
        );
      }, 3500);

    return () =>
      window.clearInterval(timer);
  }, []);

  useEffect(() => {
    const savedTheme =
      localStorage.getItem(
        "nour-theme",
      );

    setTheme(
      savedTheme === "dark"
        ? "dark"
        : "light",
    );
  }, []);

  useEffect(() => {
    document.documentElement.dataset.theme =
      theme;

    localStorage.setItem(
      "nour-theme",
      theme,
    );
  }, [theme]);

  useEffect(() => {
    const sections =
      sectionIds
        .map((id) =>
          document.getElementById(id),
        )
        .filter(
          (
            section,
          ): section is HTMLElement =>
            Boolean(section),
        );

    if (!sections.length) {
      return;
    }

    const observer =
      new IntersectionObserver(
        (entries) => {
          const current =
            entries
              .filter(
                (entry) =>
                  entry.isIntersecting,
              )
              .sort(
                (a, b) =>
                  b.intersectionRatio -
                  a.intersectionRatio,
              )[0]?.target.id as
              | SectionId
              | undefined;

          if (current) {
            setActiveSection(current);
          }
        },
        {
          rootMargin:
            "-25% 0px -60% 0px",
          threshold: [
            0.05,
            0.2,
            0.45,
            0.7,
          ],
        },
      );

    sections.forEach(
      (section) =>
        observer.observe(section),
    );

    return () =>
      observer.disconnect();
  }, []);

  return (
    <main className="nour-redesign">
      <SiteIntro language={language} />
      <SiteEnhancements />

      <Header
        t={t}
        language={language}
        theme={theme}
        menuOpen={menuOpen}
        activeSection={activeSection}
        navItems={navItems}
        onLanguageChange={
          toggleLanguage
        }
        onThemeChange={() =>
          setTheme((current) =>
            current === "light"
              ? "dark"
              : "light",
          )
        }
        onMenuToggle={() =>
          setMenuOpen(
            (current) => !current,
          )
        }
        onMenuClose={() =>
          setMenuOpen(false)
        }
      />

      <Hero t={t} />

      <ProgramsPreview
        language={language}
      />

      <Services
        language={language}
      />

      <div id="world-map">
        <NourWorldMap
          language={language}
        />
      </div>

      <Journey
        t={t}
        language={language}
      />

      <Showcase
        t={t}
        language={language}
        activeScreen={activeScreen}
        onScreenChange={
          setActiveScreen
        }
      />

      <div id="about">
        <WhyNour
          language={language}
        />
      </div>

      <Statistics
        language={language}
      />

      <Payments
        language={language}
      />

      <CTA
        t={t}
        language={language}
      />

      <Footer
        t={t}
        language={language}
      />
    </main>
  );
}
