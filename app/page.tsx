"use client";

import Image from "next/image";
import { useEffect, useState } from "react";
import { motion, type Variants } from "framer-motion";
import SiteEnhancements from "./components/SiteEnhancements";

type Language = "ar" | "en";
type Theme = "light" | "dark";
type SectionId = "home" | "about" | "features" | "journey" | "payments" | "contact";

const sectionIds: SectionId[] = ["home", "about", "features", "journey", "payments", "contact"];

const copy = {
  ar: {nav: [
  "الرئيسية",
  "عن نور",
  "المزايا",
  "كيف تعمل",
  "وسائل الدفع",
  "تواصل معنا",
],
    heroEyebrow: "تطبيق نور للعمرة",
    heroTitle: "رحلتك إلى العمرة تبدأ من نور",
    heroText:
  "اكتشف برامج عمرة متنوعة، قارن بين الباقات والخدمات، وأكمل حجزك بسهولة ضمن تجربة رقمية واضحة وآمنة.",
    discover: "اكتشف نور",
    contact: "تواصل معنا",
    goalsTitle: "أهداف نور",
    goals: [
      ["سهولة الوصول", "إلى برامج وخدمات العمرة"],
      ["تجربة مريحة", "من البحث وحتى الحجز"],
      ["كفاءة أعلى", "في إدارة تفاصيل الرحلة"],
      ["وضوح وثقة", "في الخدمات والأسعار"],
    ],
    aboutLabel: "عن نور",
    aboutTitle: "منصة ذكية لرحلة عمرة أكثر راحة",
    aboutText:
  "نور منصة رقمية متكاملة تجمع برامج العمرة، السكن، النقل والخدمات المساندة في تجربة واحدة واضحة، لتمنح المعتمر رحلة أكثر سهولة وثقة من لحظة الاختيار وحتى إتمام الرحلة.",
      featuresLabel: "ماذا نقدم",
    featuresTitle: "أفضل المزايا في تطبيق واحد",
    features: [
      ["باقات عمرة متنوعة", "خيارات تناسب الاحتياجات والميزانيات المختلفة."],
      ["واجهة سهلة الاستخدام", "تجربة بسيطة وواضحة لجميع المستخدمين."],
      ["حجز سريع ومباشر", "إجراءات مختصرة ووثائق واضحة."],
      ["شراكات موثوقة", "مقدمو خدمات معتمدون وجودة يمكن الاعتماد عليها."],
      ["دعم على مدار الساعة", "مساندة مستمرة خلال مراحل الرحلة."],
      ["الأمان والخصوصية", "حماية البيانات والمعاملات الرقمية."],
    ],
    showcaseTitle: "كل ما يحتاجه المعتمر في تطبيق واحد",
    showcaseText:
      "استعرض البرامج، راجع تفاصيل الرحلة، وتابع السكن والنقل والخدمات من خلال تجربة متكاملة.",
    ctaTitle: "رفيق رحلتك إلى السعادة",
    ctaText: "تطبيق نور سيكون متاحًا قريبًا على Android وiOS.",
    journeyLabel: "كيف تعمل نور؟",
journeyTitle: "رحلتك تبدأ في أربع خطوات بسيطة",
journeyText:
  "من اختيار برنامج العمرة إلى متابعة تفاصيل الرحلة، تجمع نور كل الخطوات في تجربة رقمية واحدة.",
journeySteps: [
  {
    number: "01",
    title: "استعرض البرامج",
    text: "تصفح برامج وباقات العمرة المتاحة واختر ما يناسب احتياجاتك.",
  },
  {
    number: "02",
    title: "قارن الخدمات",
    text: "قارن بين السكن والنقل والخدمات والأسعار بكل وضوح.",
  },
  {
    number: "03",
    title: "أكمل الحجز",
    text: "أدخل بياناتك، اختر وسيلة الدفع، وأكد الحجز بأمان.",
  },
  {
    number: "04",
    title: "تابع رحلتك",
    text: "احصل على تفاصيل البرنامج والتحديثات من خلال تطبيق نور.",
  },
],
    footer: "© 2026 نور. جميع الحقوق محفوظة.",
    lang: "English",
  },
  en: {
    nav: [
  "Home",
  "About",
  "Features",
  "How It Works",
  "Payments",
  "Contact",
],
    heroEyebrow: "Nour Umrah App",
    heroTitle: "Your Umrah journey begins with Nour",
   heroText:
  "Discover diverse Umrah programs, compare packages and services, and complete your booking through a clear and secure digital experience.",
    discover: "Discover Nour",
    contact: "Contact Us",
    goalsTitle: "Nour Goals",
    goals: [
      ["Easy access", "to Umrah programs and services"],
      ["Comfortable experience", "from discovery to booking"],
      ["Greater efficiency", "in managing journey details"],
      ["Clarity and trust", "in services and prices"],
    ],
    aboutLabel: "About Nour",
    aboutTitle: "A smarter platform for a more comfortable Umrah journey",
    aboutText:
  "Nour brings Umrah programs, accommodation, transport, and supporting services together in one clear digital experience, helping pilgrims plan and complete their journey with greater ease and confidence.",
    featuresLabel: "What We Offer",
    featuresTitle: "The best features in one app",
    features: [
      ["Wide range of packages", "Options for different needs and budgets."],
      ["Simple user interface", "A clear experience for every user."],
      ["Fast direct booking", "Shorter steps and clear documentation."],
      ["Reliable partnerships", "Trusted providers and dependable quality."],
      ["24/7 support", "Continuous assistance throughout the journey."],
      ["Security and privacy", "Protection for personal data and transactions."],
    ],
    showcaseTitle: "Everything a pilgrim needs in one app",
    showcaseText:
      "Explore programs, review journey details, and follow accommodation, transport, and services in one integrated experience.",
    ctaTitle: "Your happiness journey companion",
    ctaText: "Nour will soon be available on Android and iOS.",
    journeyLabel: "How Nour Works",
journeyTitle: "Your journey begins in four simple steps",
journeyText:
  "From choosing an Umrah program to following your journey, Nour brings every step into one digital experience.",
journeySteps: [
  {
    number: "01",
    title: "Explore programs",
    text: "Browse available Umrah programs and choose the option that suits you.",
  },
  {
    number: "02",
    title: "Compare services",
    text: "Compare accommodation, transport, services, and prices clearly.",
  },
  {
    number: "03",
    title: "Complete booking",
    text: "Enter your details, select a payment method, and confirm securely.",
  },
  {
    number: "04",
    title: "Follow your journey",
    text: "Access program information and updates through the Nour app.",
  },
],
    footer: "© 2026 Nour. All rights reserved.",
    lang: "العربية",
  },
} as const;

const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] },
  },
};

const paymentMethods = [
  {
    nameAr: "مدى",
    nameEn: "Mada",
    image: "/images/payments/mada.png",
    type: "card",
  },
  {
    nameAr: "فيزا",
    nameEn: "Visa",
    image: "/images/payments/visa.png",
    type: "card",
  },
  {
    nameAr: "ماستركارد",
    nameEn: "Mastercard",
    image: "/images/payments/mastercard.png",
    type: "card",
  },
  {
    nameAr: "Apple Pay",
    nameEn: "Apple Pay",
    image: "/images/payments/apple-pay.png",
    type: "wallet",
  },
  {
    nameAr: "تابي",
    nameEn: "Tabby",
    image: "/images/payments/tabby.png",
    type: "installment",
  },
  {
    nameAr: "تمارا",
    nameEn: "Tamara",
    image: "/images/payments/tamara.png",
    type: "installment",
  },
];

function FeatureIcon({ index }: { index: number }) {
  const icons = [
    <svg
      key="packages"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" />
      <path d="M5 15l.8 2.2L8 18l-2.2.8L5 21l-.8-2.2L2 18l2.2-.8L5 15z" />
      <path d="M19 13l.7 1.8 1.8.7-1.8.7L19 18l-.7-1.8-1.8-.7 1.8-.7L19 13z" />
    </svg>,
    <svg
      key="interface"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="4" y="3" width="16" height="18" rx="3" />
      <path d="M8 8h8M8 12h5M8 16h7" />
    </svg>,
    <svg
      key="booking"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M5 4h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" />
      <path d="M8 2v4M16 2v4M3 9h18" />
      <path d="m8 15 2.2 2.2L16 12" />
    </svg>,
    <svg
      key="partners"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m8.5 12.5 3 3a2 2 0 0 0 2.8 0l4.2-4.2a2 2 0 0 0 0-2.8l-2-2a2 2 0 0 0-2.8 0L12 8.2" />
      <path d="m15.5 11.5-3-3a2 2 0 0 0-2.8 0l-4.2 4.2a2 2 0 0 0 0 2.8l2 2a2 2 0 0 0 2.8 0l1.7-1.7" />
    </svg>,
    <span key="support" className="nr-feature-icon-text" aria-hidden="true">
      24
    </span>,
    <svg
      key="security"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m12 3 7 3v5c0 4.7-2.8 8.2-7 10-4.2-1.8-7-5.3-7-10V6l7-3z" />
      <path d="m9 12 2 2 4-4" />
    </svg>,
  ];

  return (
    <div className="nr-feature-icon" aria-hidden="true">
      {icons[index] ?? icons[0]}
    </div>
  );
}

function AppStoreBadge({ language }: { language: Language }) {
  return (
    <span
      className="nr-store-badge nr-store-badge-custom is-disabled"
      aria-label={
        language === "ar"
          ? "متوفر قريبًا على App Store"
          : "Coming soon on the App Store"
      }
    >
      <svg
        className="nr-store-apple-icon"
        viewBox="0 0 24 24"
        fill="currentColor"
        aria-hidden="true"
      >
        <path d="M16.7 12.1c0-2.8 2.3-4.2 2.4-4.3a5.1 5.1 0 0 0-4-2.2c-1.7-.2-3.3 1-4.2 1-.9 0-2.2-1-3.7-1-1.9 0-3.7 1.1-4.7 2.8-2 3.4-.5 8.5 1.4 11.2.9 1.3 2 2.8 3.5 2.7 1.4-.1 1.9-.9 3.6-.9 1.7 0 2.2.9 3.7.9 1.5 0 2.5-1.3 3.4-2.7 1.1-1.5 1.5-3 1.5-3.1-.1 0-2.9-1.1-2.9-4.4zM14 3.8c.8-1 1.3-2.3 1.2-3.6-1.2.1-2.6.8-3.4 1.8-.7.8-1.4 2.2-1.2 3.5 1.3.1 2.6-.7 3.4-1.7z" />
      </svg>

      <span className="nr-store-badge-copy">
        <small>{language === "ar" ? "قريبًا على" : "Coming soon on"}</small>
        <strong>App Store</strong>
      </span>
    </span>
  );
}

export default function Home() {
  const [language, setLanguage] = useState<Language>("ar");
  const [theme, setTheme] = useState<Theme>("light");
  const t = copy[language];
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<SectionId>("home");

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
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0]
          ?.target.id as SectionId | undefined;

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

  const navItems = sectionIds.map((id, index) => ({
    id,
    label: t.nav[index],
  }));

  const getNavClassName = (id: SectionId) =>
    activeSection === id ? "is-active" : undefined;

  return (
    <main className="nour-redesign">
      <SiteEnhancements />
      <header className="nr-header">
  <div className="nr-container nr-nav">
    <a className="nr-logo" href="#home" aria-label="Nour">
      <Image
        src="/images/site/v-logo.png"
        alt="Nour"
        width={210}
        height={70}
        priority
      />
    </a>

    <nav
      className="nr-desktop-nav"
      aria-label={language === "ar" ? "التنقل الرئيسي" : "Main navigation"}
    >
      {navItems.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={getNavClassName(item.id)}
          aria-current={activeSection === item.id ? "page" : undefined}
        >
          {item.label}
        </a>
      ))}
    </nav>

    <div className="nr-controls">
      <button
        type="button"
        onClick={() =>
          setLanguage(language === "ar" ? "en" : "ar")
        }
      >
        {t.lang}
      </button>

      <button
        type="button"
        className="nr-theme"
        onClick={() =>
          setTheme(theme === "light" ? "dark" : "light")
        }
        aria-label="Theme"
      >
        {theme === "light" ? "☾" : "☀"}
      </button>

      <button
        type="button"
        className={`nr-menu-button ${
          menuOpen ? "is-open" : ""
        }`}
        onClick={() => setMenuOpen(!menuOpen)}
        aria-label="Menu"
        aria-expanded={menuOpen}
      >
        <span />
        <span />
        <span />
      </button>
    </div>
  </div>

  {menuOpen && (
    <motion.nav
      className="nr-mobile-menu"
      aria-label={language === "ar" ? "قائمة الجوال" : "Mobile navigation"}
      initial={{ opacity: 0, y: -15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
    >
      {navItems.map((item) => (
        <a
          key={item.id}
          href={`#${item.id}`}
          className={getNavClassName(item.id)}
          aria-current={activeSection === item.id ? "page" : undefined}
          onClick={() => setMenuOpen(false)}
        >
          {item.label}
        </a>
      ))}
    </motion.nav>
  )}
</header>

      <section className="nr-hero" id="home">
        <div className="nr-orb nr-orb-one" />
        <div className="nr-orb nr-orb-two" />

        <div className="nr-container nr-hero-grid">
          <motion.div initial="hidden" animate="visible" variants={fadeUp}>
            <span className="nr-kicker">{t.heroEyebrow}</span>
            <h1>{t.heroTitle}</h1>
            <p>{t.heroText}</p>
            <div className="nr-actions">
              <a className="nr-primary" href="#features">{t.discover}</a>
              <a className="nr-secondary" href="#contact">{t.contact}</a>
            </div>
          </motion.div>

          <motion.div
            className="nr-phones"
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: "easeOut" }}
          >
            <Image
              className="nr-phone-back"
              src="/images/site/rotated-right.png"
              alt="Nour booking screen"
              width={630}
              height={630}
              priority
            />
            <Image
              className="nr-phone-front"
              src="/images/site/front-view.png"
              alt="Nour app home screen"
              width={420}
              height={720}
              priority
            />
          </motion.div>
        </div>
      </section>

      <section className="nr-goals">
        <div className="nr-container">
          <h2>{t.goalsTitle}</h2>
          <div className="nr-goals-grid">
            {t.goals.map(([title, text], i) => (
              <motion.article
                key={title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.25 }}
                variants={fadeUp}
              >
                <span>{String(i + 1).padStart(2, "0")}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>

      <section className="nr-about" id="about">
        <div className="nr-container nr-about-grid">
          <motion.div
            className="nr-about-copy"
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={fadeUp}
          >
            <span className="nr-kicker">{t.aboutLabel}</span>
            <h2>{t.aboutTitle}</h2>
            <p>{t.aboutText}</p>
          </motion.div>

          <div className="nr-about-visual">
            <div className="nr-visual-blob" />
            <Image
              src="/images/site/rotated-left.png"
              alt="Nour programs screen"
              width={650}
              height={650}
            />
          </div>
        </div>
      </section>

      <section className="nr-features" id="features">
        <div className="nr-container">
          <div className="nr-heading">
            <span className="nr-kicker">{t.featuresLabel}</span>
            <h2>{t.featuresTitle}</h2>
          </div>

          <div className="nr-feature-grid">
            {t.features.map(([title, text], i) => (
              <motion.article
                key={title}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.2 }}
                variants={fadeUp}
              >
                <FeatureIcon index={i} />
                <h3>{title}</h3>
                <p>{text}</p>
              </motion.article>
            ))}
          </div>
        </div>
      </section>
      <section className="nr-journey" id="journey">
  <div className="nr-container">
    <motion.div
      className="nr-journey-heading"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={fadeUp}
    >
      <span className="nr-kicker nr-journey-kicker">
        {t.journeyLabel}
      </span>

      <h2>{t.journeyTitle}</h2>

      <p>{t.journeyText}</p>
    </motion.div>

    <motion.div
      className="nr-journey-steps"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.15 }}
      variants={{
        hidden: {},
        visible: {
          transition: {
            staggerChildren: 0.14,
          },
        },
      }}
    >
      {t.journeySteps.map((step, index) => (
        <motion.article
          className="nr-journey-step"
          key={step.number}
          variants={fadeUp}
          whileHover={{
            y: -8,
          }}
        >
          <div className="nr-step-top">
            <span className="nr-step-number">
              {step.number}
            </span>

            <span className="nr-step-icon">
              {["⌕", "⇄", "✓", "◉"][index]}
            </span>
          </div>

          <h3>{step.title}</h3>

          <p>{step.text}</p>

          {index < t.journeySteps.length - 1 && (
            <span className="nr-step-arrow">
              {language === "ar" ? "←" : "→"}
            </span>
          )}
        </motion.article>
      ))}
    </motion.div>
  </div>
</section>

      <section className="nr-showcase">
        <div className="nr-container nr-showcase-grid">
          <div className="nr-showcase-devices">
            <Image src="/images/site/tilted-right.png" alt="Nour booking details" width={460} height={650} />
            <Image src="/images/site/front-view.png" alt="Nour app" width={360} height={620} />
          </div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.25 }}
            variants={fadeUp}
          >
            <h2>{t.showcaseTitle}</h2>
            <p>{t.showcaseText}</p>
            <ul>
              <li>{language === "ar" ? "برامج وباقات واضحة" : "Clear programs and packages"}</li>
              <li>{language === "ar" ? "تفاصيل الرحلة في مكان واحد" : "Journey details in one place"}</li>
              <li>{language === "ar" ? "تجربة سريعة وآمنة" : "A fast and secure experience"}</li>
            </ul>
          </motion.div>
        </div>
      </section>
<section className="nr-payments" id="payments">
  <div className="nr-container">
    <motion.div
      className="nr-payment-heading"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, amount: 0.25 }}
      variants={fadeUp}
    >
      <span className="nr-kicker nr-payment-kicker">
        {language === "ar"
          ? "خيارات دفع مرنة"
          : "Flexible Payment Options"}
      </span>

      <h2>
        {language === "ar"
          ? "ادفع بالطريقة التي تناسبك"
          : "Pay the way that suits you"}
      </h2>

      <p>
        {language === "ar"
          ? "نوفر وسائل دفع إلكترونية متعددة، بالإضافة إلى خيارات الدفع المرن من خلال تابي وتمارا."
          : "Choose from multiple electronic payment methods, including flexible payment options through Tabby and Tamara."}
      </p>
    </motion.div>

    <div className="nr-payment-layout">
      <div className="nr-payment-methods">
        {paymentMethods.map((method) => (
          <motion.article
            className={`nr-payment-card ${
              method.type === "installment"
                ? "nr-installment-card"
                : ""
            }`}
            key={method.nameEn}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeUp}
            whileHover={{
              y: -8,
              scale: 1.02,
            }}
          >
            <div className="nr-payment-logo">
              <Image
                src={method.image}
                alt={
                  language === "ar"
                    ? method.nameAr
                    : method.nameEn
                }
                width={160}
                height={70}
              />
            </div>

            <strong>
              {language === "ar"
                ? method.nameAr
                : method.nameEn}
            </strong>

            {method.type === "installment" && (
              <span className="nr-installment-label">
                {language === "ar"
                  ? "قسّم قيمة الحجز"
                  : "Split your booking"}
              </span>
            )}
          </motion.article>
        ))}
      </div>

      <aside className="nr-payment-info">
        <div className="nr-payment-info-item">
          <span className="nr-payment-info-icon">✓</span>

          <div>
            <strong>
              {language === "ar"
                ? "دفع آمن ومحمي"
                : "Secure payments"}
            </strong>

            <p>
              {language === "ar"
                ? "تتم معالجة المعاملات من خلال مزودي دفع آمنين."
                : "Transactions are processed through secure payment providers."}
            </p>
          </div>
        </div>

        <div className="nr-payment-info-item">
          <span className="nr-payment-info-icon">4</span>

          <div>
            <strong>
              {language === "ar"
                ? "الدفع المرن"
                : "Flexible payments"}
            </strong>

            <p>
              {language === "ar"
                ? "يمكن تقسيم قيمة الحجز من خلال تابي وتمارا حسب الأهلية والشروط."
                : "Eligible bookings may be split through Tabby or Tamara, subject to their terms."}
            </p>
          </div>
        </div>
      </aside>
    </div>
  </div>
</section>
      <section className="nr-cta" id="contact">
        <div className="nr-container nr-cta-card">
          <div>
            <h2>{t.ctaTitle}</h2>
            <p>{t.ctaText}</p>
            <div className="nr-store-buttons">
  <AppStoreBadge language={language} />

  <span className="nr-store-badge is-disabled" aria-label={language === "ar" ? "Google Play — قريبًا" : "Google Play — coming soon"}>
    <Image src="/stores/google-play-badge.jpg" alt="Google Play" width={176} height={52} />
  </span>

  <span className="nr-store-badge is-disabled" aria-label={language === "ar" ? "AppGallery — قريبًا" : "AppGallery — coming soon"}>
    <Image src="/stores/appgallery-badge.jpg" alt="AppGallery" width={180} height={52} />
  </span>
</div>
          </div>
          <Image src="/images/site/front-view.png" alt="Nour app" width={300} height={540} />
        </div>
      </section>

      <footer className="nr-footer">
        <div className="nr-container nr-footer-content">
          <div className="nr-footer-brand">
            <Image
              src="/images/site/v-logo.png"
              alt="Nour"
              width={170}
              height={58}
            />
            <span>{t.footer}</span>
          </div>

          <div className="nr-footer-contact">
            <a href="tel:+966567488377" dir="ltr">
              +966 56 748 8377
            </a>

            <a
              href="https://nourappglobal.com"
              target="_blank"
              rel="noreferrer"
            >
              nourappglobal.com
            </a>
          </div>

          <div className="nr-footer-links">
            <a href="/privacy">
              {language === "ar" ? "سياسة الخصوصية" : "Privacy Policy"}
            </a>

            <a href="/terms">
              {language === "ar" ? "الشروط والأحكام" : "Terms and Conditions"}
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}