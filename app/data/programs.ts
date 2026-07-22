export type ProgramCategory =
  | "economy"
  | "premium"
  | "vip";

export interface Program {
  id: number;
  slug: string;

  titleAr: string;
  titleEn: string;

  shortDescriptionAr: string;
  shortDescriptionEn: string;

  duration: string;

  hotel: string;

  transport: string;

  priceFrom: number;

  currency: "SAR";

  image: string;

  badgeAr?: string;
  badgeEn?: string;

  category: ProgramCategory;

  featured: boolean;
}

export const programs: Program[] = [
  {
    id: 1,
    slug: "economy-umrah",

    titleAr: "برنامج العمرة الاقتصادي",
    titleEn: "Economy Umrah",

    shortDescriptionAr:
      "أفضل خيار للباحثين عن رحلة اقتصادية مع خدمات متكاملة.",

    shortDescriptionEn:
      "Affordable Umrah package with complete services.",

    duration: "7 Days",

    hotel: "4★ Hotel",

    transport: "Included",

    priceFrom: 2499,

    currency: "SAR",

    image: "/images/programs/economy.png",

    badgeAr: "الأكثر طلبًا",
    badgeEn: "Most Popular",

    category: "economy",

    featured: true,
  },

  {
    id: 2,
    slug: "premium-umrah",

    titleAr: "برنامج العمرة المميز",
    titleEn: "Premium Umrah",

    shortDescriptionAr:
      "إقامة مريحة وخدمات إضافية بالقرب من الحرم.",

    shortDescriptionEn:
      "Premium accommodation close to the Haram.",

    duration: "10 Days",

    hotel: "5★ Hotel",

    transport: "VIP Transport",

    priceFrom: 4299,

    currency: "SAR",

    image: "/images/programs/premium.png",

    badgeAr: "الأفضل قيمة",
    badgeEn: "Best Value",

    category: "premium",

    featured: true,
  },

  {
    id: 3,
    slug: "vip-umrah",

    titleAr: "برنامج كبار الشخصيات",

    titleEn: "VIP Umrah",

    shortDescriptionAr:
      "تجربة فاخرة بأعلى مستوى من الخدمات.",

    shortDescriptionEn:
      "Luxury Umrah experience with premium services.",

    duration: "12 Days",

    hotel: "Luxury Suite",

    transport: "Private Transfer",

    priceFrom: 7499,

    currency: "SAR",

    image: "/images/programs/vip.png",

    badgeAr: "VIP",

    badgeEn: "VIP",

    category: "vip",

    featured: true,
  },
];