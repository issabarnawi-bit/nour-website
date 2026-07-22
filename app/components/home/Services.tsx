"use client";

import { motion, type Variants } from "framer-motion";
import type { Language } from "../../data/home";

type ServiceIcon =
  | "packages"
  | "visa"
  | "hotel"
  | "transport"
  | "guidance"
  | "support";

type Service = {
  titleAr: string;
  titleEn: string;
  textAr: string;
  textEn: string;
  labelAr: string;
  labelEn: string;
  icon: ServiceIcon;
  accent: "blue" | "gold" | "cyan";
};

const services: Service[] = [
  {
    titleAr: "برامج وباقات العمرة",
    titleEn: "Umrah programs and packages",
    textAr:
      "خيارات مدروسة تناسب الاحتياجات والميزانيات المختلفة، مع تفاصيل واضحة لكل برنامج.",
    textEn:
      "Carefully designed options for different needs and budgets, with clear details for every program.",
    labelAr: "استكشف البرامج",
    labelEn: "Explore programs",
    icon: "packages",
    accent: "blue",
  },
  {
    titleAr: "خدمات التأشيرات",
    titleEn: "Visa services",
    textAr:
      "إجراءات رقمية مبسطة تساعد على تجهيز المتطلبات ومتابعة حالة الطلب بوضوح.",
    textEn:
      "Simplified digital steps for preparing requirements and following application status clearly.",
    labelAr: "تعرف على الخدمة",
    labelEn: "Learn more",
    icon: "visa",
    accent: "gold",
  },
  {
    titleAr: "حجوزات الفنادق",
    titleEn: "Hotel bookings",
    textAr:
      "خيارات سكن متنوعة بالقرب من الحرمين، مع مقارنة واضحة للموقع والخدمات والتكلفة.",
    textEn:
      "A range of accommodation near the holy mosques, with clear comparisons of location, service, and price.",
    labelAr: "استعرض الفنادق",
    labelEn: "Browse hotels",
    icon: "hotel",
    accent: "cyan",
  },
  {
    titleAr: "النقل والتنقلات",
    titleEn: "Transport and transfers",
    textAr:
      "تنسيق خدمات النقل بين المطار والسكن والمشاعر بما يمنح المعتمر راحة وطمأنينة أكبر.",
    textEn:
      "Coordinated transfers between airports, accommodation, and key destinations for greater comfort.",
    labelAr: "تفاصيل النقل",
    labelEn: "Transport details",
    icon: "transport",
    accent: "blue",
  },
  {
    titleAr: "الإرشاد والمساندة",
    titleEn: "Guidance and assistance",
    textAr:
      "معلومات وإرشادات عملية تساعد المعتمر على الاستعداد ومتابعة تفاصيل رحلته بثقة.",
    textEn:
      "Practical information and guidance helping pilgrims prepare and follow their journey confidently.",
    labelAr: "اعرف المزيد",
    labelEn: "Learn more",
    icon: "guidance",
    accent: "gold",
  },
  {
    titleAr: "دعم العملاء",
    titleEn: "Customer support",
    textAr:
      "قنوات تواصل واضحة للرد على الاستفسارات وتقديم المساعدة خلال مراحل الرحلة المختلفة.",
    textEn:
      "Clear support channels for questions and assistance throughout the different stages of the journey.",
    labelAr: "تواصل معنا",
    labelEn: "Contact us",
    icon: "support",
    accent: "cyan",
  },
];

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.1 },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 32 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.58, ease: [0.22, 1, 0.36, 1] },
  },
};

function ServiceIcon({ name }: { name: ServiceIcon }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.8,
    strokeLinecap: "round" as const,
    strokeLinejoin: "round" as const,
    "aria-hidden": true,
  };

  if (name === "packages") {
    return (
      <svg {...common}>
        <path d="M4 7.5 12 3l8 4.5-8 4.5-8-4.5Z" />
        <path d="m4 12 8 4.5 8-4.5M4 16.5 12 21l8-4.5" />
      </svg>
    );
  }

  if (name === "visa") {
    return (
      <svg {...common}>
        <rect x="4" y="3" width="16" height="18" rx="3" />
        <circle cx="9" cy="10" r="2" />
        <path d="M7 16c.8-1.6 3.2-1.6 4 0M14 9h3M14 13h3" />
      </svg>
    );
  }

  if (name === "hotel") {
    return (
      <svg {...common}>
        <path d="M4 21V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16" />
        <path d="M8 7h2M14 7h2M8 11h2M14 11h2M8 15h2M14 15h2M3 21h18" />
      </svg>
    );
  }

  if (name === "transport") {
    return (
      <svg {...common}>
        <path d="M5 17h14l1-5-2-5H6l-2 5 1 5Z" />
        <path d="M7 17v2M17 17v2M6 12h12M8 8h8" />
        <circle cx="8" cy="15" r="1" />
        <circle cx="16" cy="15" r="1" />
      </svg>
    );
  }

  if (name === "guidance") {
    return (
      <svg {...common}>
        <path d="M12 21s7-4.3 7-11a7 7 0 1 0-14 0c0 6.7 7 11 7 11Z" />
        <circle cx="12" cy="10" r="2.5" />
      </svg>
    );
  }

  return (
    <svg {...common}>
      <path d="M4 13v-2a8 8 0 0 1 16 0v2" />
      <path d="M4 13a2 2 0 0 1 2-2h1v6H6a2 2 0 0 1-2-2v-2ZM20 13a2 2 0 0 0-2-2h-1v6h1a2 2 0 0 0 2-2v-2Z" />
      <path d="M17 17c0 2-2 3-5 3" />
    </svg>
  );
}

export default function Services({ language }: { language: Language }) {
  const isArabic = language === "ar";

  return (
    <section className="nr-services" id="features" aria-labelledby="nr-services-title">
      <div className="nr-services-pattern" aria-hidden="true" />

      <div className="nr-container">
        <motion.div
          className="nr-services-heading"
          initial={{ opacity: 0, y: 28 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="nr-kicker nr-services-kicker">
            {isArabic ? "خدمات نور" : "Nour Services"}
          </span>

          <h2 id="nr-services-title">
            {isArabic
              ? "كل ما تحتاجه لرحلة عمرة منظمة في مكان واحد"
              : "Everything you need for an organized Umrah journey in one place"}
          </h2>

          <p>
            {isArabic
              ? "نجمع البرامج والتأشيرات والسكن والنقل والمساندة ضمن تجربة رقمية واضحة، لتسهيل التخطيط وتقليل الخطوات المتفرقة."
              : "We bring programs, visas, accommodation, transport, and support into one clear digital experience, simplifying planning and reducing fragmented steps."}
          </p>
        </motion.div>

        <motion.div
          className="nr-services-grid"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, amount: 0.1 }}
        >
          {services.map((service, index) => (
            <motion.article
              key={service.titleEn}
              className={`nr-service-card nr-service-card-${service.accent}`}
              variants={cardVariants}
              whileHover={{ y: -9 }}
            >
              <div className="nr-service-card-head">
                <span className="nr-service-icon">
                  <ServiceIcon name={service.icon} />
                </span>

                <span className="nr-service-index" aria-hidden="true">
                  {String(index + 1).padStart(2, "0")}
                </span>
              </div>

              <h3>{isArabic ? service.titleAr : service.titleEn}</h3>
              <p>{isArabic ? service.textAr : service.textEn}</p>

              <a
                className="nr-service-link"
                href={service.icon === "support" ? "#contact" : "#journey"}
                aria-label={isArabic ? service.labelAr : service.labelEn}
              >
                <span>{isArabic ? service.labelAr : service.labelEn}</span>
                <span aria-hidden="true">{isArabic ? "←" : "→"}</span>
              </a>
            </motion.article>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
