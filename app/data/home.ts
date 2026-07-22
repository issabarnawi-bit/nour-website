import type { Variants } from "framer-motion";

export type Language = "ar" | "en";
export type Theme = "light" | "dark";
export type SectionId = "home" | "about" | "features" | "journey" | "payments" | "contact";

export const sectionIds: SectionId[] = ["home", "about", "features", "journey", "payments", "contact"];

export const copy = {
  ar: {
    nav: ["الرئيسية", "عن نور", "المزايا", "كيف تعمل", "وسائل الدفع", "تواصل معنا"],
    heroEyebrow: "تطبيق نور للعمرة",
    heroTitle: "رحلتك إلى العمرة تبدأ من نور",
    heroText: "اكتشف برامج عمرة متنوعة، قارن بين الباقات والخدمات، وأكمل حجزك بسهولة ضمن تجربة رقمية واضحة وآمنة.",
    discover: "اكتشف نور",
    contact: "تواصل معنا",
    goalsTitle: "أهداف نور",
    goals: [["سهولة الوصول", "إلى برامج وخدمات العمرة"], ["تجربة مريحة", "من البحث وحتى الحجز"], ["كفاءة أعلى", "في إدارة تفاصيل الرحلة"], ["وضوح وثقة", "في الخدمات والأسعار"]],
    aboutLabel: "عن نور",
    aboutTitle: "منصة ذكية لرحلة عمرة أكثر راحة",
    aboutText: "نور منصة رقمية متكاملة تجمع برامج العمرة، السكن، النقل والخدمات المساندة في تجربة واحدة واضحة، لتمنح المعتمر رحلة أكثر سهولة وثقة من لحظة الاختيار وحتى إتمام الرحلة.",
    featuresLabel: "ماذا نقدم",
    featuresTitle: "أفضل المزايا في تطبيق واحد",
    features: [["باقات عمرة متنوعة", "خيارات تناسب الاحتياجات والميزانيات المختلفة."], ["واجهة سهلة الاستخدام", "تجربة بسيطة وواضحة لجميع المستخدمين."], ["حجز سريع ومباشر", "إجراءات مختصرة ووثائق واضحة."], ["شراكات موثوقة", "مقدمو خدمات معتمدون وجودة يمكن الاعتماد عليها."], ["دعم على مدار الساعة", "مساندة مستمرة خلال مراحل الرحلة."], ["الأمان والخصوصية", "حماية البيانات والمعاملات الرقمية."]],
    showcaseTitle: "كل ما يحتاجه المعتمر في تطبيق واحد",
    showcaseText: "استعرض البرامج، راجع تفاصيل الرحلة، وتابع السكن والنقل والخدمات من خلال تجربة متكاملة.",
    ctaTitle: "رفيق رحلتك إلى السعادة",
    ctaText: "تطبيق نور سيكون متاحًا قريبًا على Android وiOS.",
    journeyLabel: "كيف تعمل نور؟",
    journeyTitle: "رحلتك تبدأ في أربع خطوات بسيطة",
    journeyText: "من اختيار برنامج العمرة إلى متابعة تفاصيل الرحلة، تجمع نور كل الخطوات في تجربة رقمية واحدة.",
    journeySteps: [
      { number: "01", title: "استعرض البرامج", text: "تصفح برامج وباقات العمرة المتاحة واختر ما يناسب احتياجاتك." },
      { number: "02", title: "قارن الخدمات", text: "قارن بين السكن والنقل والخدمات والأسعار بكل وضوح." },
      { number: "03", title: "أكمل الحجز", text: "أدخل بياناتك، اختر وسيلة الدفع، وأكد الحجز بأمان." },
      { number: "04", title: "تابع رحلتك", text: "احصل على تفاصيل البرنامج والتحديثات من خلال تطبيق نور." },
    ],
    footer: "© 2026 نور. جميع الحقوق محفوظة.",
    lang: "English",
  },
  en: {
    nav: ["Home", "About", "Features", "How It Works", "Payments", "Contact"],
    heroEyebrow: "Nour Umrah App",
    heroTitle: "Your Umrah journey begins with Nour",
    heroText: "Discover diverse Umrah programs, compare packages and services, and complete your booking through a clear and secure digital experience.",
    discover: "Discover Nour",
    contact: "Contact Us",
    goalsTitle: "Nour Goals",
    goals: [["Easy access", "to Umrah programs and services"], ["Comfortable experience", "from discovery to booking"], ["Greater efficiency", "in managing journey details"], ["Clarity and trust", "in services and prices"]],
    aboutLabel: "About Nour",
    aboutTitle: "A smarter platform for a more comfortable Umrah journey",
    aboutText: "Nour brings Umrah programs, accommodation, transport, and supporting services together in one clear digital experience, helping pilgrims plan and complete their journey with greater ease and confidence.",
    featuresLabel: "What We Offer",
    featuresTitle: "The best features in one app",
    features: [["Wide range of packages", "Options for different needs and budgets."], ["Simple user interface", "A clear experience for every user."], ["Fast direct booking", "Shorter steps and clear documentation."], ["Reliable partnerships", "Trusted providers and dependable quality."], ["24/7 support", "Continuous assistance throughout the journey."], ["Security and privacy", "Protection for personal data and transactions."]],
    showcaseTitle: "Everything a pilgrim needs in one app",
    showcaseText: "Explore programs, review journey details, and follow accommodation, transport, and services in one integrated experience.",
    ctaTitle: "Your happiness journey companion",
    ctaText: "Nour will soon be available on Android and iOS.",
    journeyLabel: "How Nour Works",
    journeyTitle: "Your journey begins in four simple steps",
    journeyText: "From choosing an Umrah program to following your journey, Nour brings every step into one digital experience.",
    journeySteps: [
      { number: "01", title: "Explore programs", text: "Browse available Umrah programs and choose the option that suits you." },
      { number: "02", title: "Compare services", text: "Compare accommodation, transport, services, and prices clearly." },
      { number: "03", title: "Complete booking", text: "Enter your details, select a payment method, and confirm securely." },
      { number: "04", title: "Follow your journey", text: "Access program information and updates through the Nour app." },
    ],
    footer: "© 2026 Nour. All rights reserved.",
    lang: "العربية",
  },
} as const;

export type HomeCopy = (typeof copy)[Language];

export const fadeUp: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.65, ease: [0.22, 1, 0.36, 1] } },
};

export const paymentMethods = [
  { nameAr: "مدى", nameEn: "Mada", image: "/images/payments/mada.png", type: "card" },
  { nameAr: "فيزا", nameEn: "Visa", image: "/images/payments/visa.png", type: "card" },
  { nameAr: "ماستركارد", nameEn: "Mastercard", image: "/images/payments/mastercard.png", type: "card" },
  { nameAr: "Apple Pay", nameEn: "Apple Pay", image: "/images/payments/apple-pay.png", type: "wallet" },
  { nameAr: "تابي", nameEn: "Tabby", image: "/images/payments/tabby.png", type: "installment" },
  { nameAr: "تمارا", nameEn: "Tamara", image: "/images/payments/tamara.png", type: "installment" },
] as const;

export const appScreens = [
  { src: "/images/app-screens/home.png", altAr: "الصفحة الرئيسية في تطبيق نور", altEn: "Nour app home screen" },
  { src: "/images/app-screens/packages.png", altAr: "صفحة برامج العمرة", altEn: "Umrah packages screen" },
  { src: "/images/app-screens/package-details.png", altAr: "تفاصيل برنامج العمرة", altEn: "Umrah package details screen" },
  { src: "/images/app-screens/booking.png", altAr: "صفحة حجز برنامج العمرة", altEn: "Umrah booking screen" },
  { src: "/images/app-screens/trip.png", altAr: "صفحة متابعة الرحلة", altEn: "Journey tracking screen" },
] as const;
