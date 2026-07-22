export type Testimonial = {
  id: number;
  featured: boolean;
  name: string;
  country: string;
  avatar: string;
  rating: number;
  date: string;
  quoteAr: string;
  quoteEn: string;
};

export const testimonials: Testimonial[] = [
  {
    id: 1,
    featured: true,
    name: "أحمد جمعة ",
    country: "السودان",
    avatar: "/images/avatars/avatar-1.png",
    rating: 5,
    date: "2026",
    quoteAr: "كانت أول عمرة لي، وكل تفاصيل الرحلة كانت واضحة وسهلة من البداية وحتى الوصول إلى مكة.",
    quoteEn: "My first Umrah journey was smooth from booking until arriving in Makkah.",
  },
  {
    id: 2,
    featured: true,
    name: "معاذ",
    country: "السعودية",
    avatar: "/images/avatars/avatar-2.png",
    rating: 5,
    date: "2026",
    quoteAr: "أعجبني وضوح الأسعار وسرعة الدعم، وكانت جميع الخدمات منظمة بشكل احترافي.",
    quoteEn: "Transparent pricing and excellent support made the whole experience stress-free.",
  },
  {
    id: 3,
    featured: true,
    name: "محمد الخاتم ",
    country: "السودان",
    avatar: "/images/avatars/avatar-3.png",
    rating: 5,
    date: "2026",
    quoteAr: "من أفضل المنصات التي استخدمتها لترتيب رحلة العمرة، أنصح بها بكل ثقة.",
    quoteEn: "One of the best platforms I've used to organize an Umrah journey.",
  },
  {
    id: 4,
    featured: false,
    name: "فاطمة",
    country: "المغرب",
    avatar: "/images/avatars/avatar-4.webp",
    rating: 5,
    date: "2026",
    quoteAr: "سهولة الحجز والمتابعة أعطتني راحة كبيرة طوال الرحلة.",
    quoteEn: "Booking and trip tracking were incredibly simple and reassuring.",
  },
];
