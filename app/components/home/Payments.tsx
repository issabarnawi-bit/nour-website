"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import type { Language } from "../../data/home";
import { fadeUp, paymentMethods } from "../../data/home";

type ExtraPaymentMethod = {
  nameAr: string;
  nameEn: string;
  type: "digital" | "card" | "bank";
  labelAr: string;
  labelEn: string;
  textLogo: string;
};

const extraPaymentMethods: ExtraPaymentMethod[] = [
  {
    nameAr: "إس تي سي باي",
    nameEn: "STC Pay",
    type: "digital",
    labelAr: "دفع رقمي",
    labelEn: "Digital payment",
    textLogo: "stc pay",
  },
  {
    nameAr: "جوجل باي",
    nameEn: "Google Pay",
    type: "digital",
    labelAr: "دفع سريع",
    labelEn: "Fast payment",
    textLogo: "G Pay",
  },
  {
    nameAr: "أمريكان إكسبريس",
    nameEn: "American Express",
    type: "card",
    labelAr: "بطاقة ائتمانية",
    labelEn: "Credit card",
    textLogo: "AMEX",
  },
  {
    nameAr: "يونيون باي",
    nameEn: "UnionPay",
    type: "card",
    labelAr: "بطاقة دولية",
    labelEn: "International card",
    textLogo: "UnionPay",
  },
  {
    nameAr: "تحويل بنكي",
    nameEn: "Bank Transfer",
    type: "bank",
    labelAr: "تحويل مباشر",
    labelEn: "Direct transfer",
    textLogo: "BANK",
  },
];

export default function Payments({
  language,
}: {
  language: Language;
}) {
  const isArabic = language === "ar";

  return (
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
            {isArabic
              ? "خيارات دفع مرنة"
              : "Flexible Payment Options"}
          </span>

          <h2>
            {isArabic
              ? "ادفع بالطريقة التي تناسبك"
              : "Pay the way that suits you"}
          </h2>

          <p>
            {isArabic
              ? "نوفر وسائل دفع إلكترونية متعددة، بالإضافة إلى خيارات الدفع المرن من خلال تابي وتمارا، مع تجهيز المنصة لإضافة وسائل دفع أخرى مستقبلًا."
              : "Choose from multiple electronic payment methods, including flexible payment through Tabby and Tamara, with more options planned for future activation."}
          </p>
        </motion.div>

        <div className="nr-payment-layout">
          <div className="nr-payment-marquee" aria-label={isArabic ? "وسائل الدفع المتاحة" : "Available payment methods"}>
            <div className="nr-payment-marquee-fade nr-payment-marquee-fade-start" aria-hidden="true" />
            <div className="nr-payment-marquee-fade nr-payment-marquee-fade-end" aria-hidden="true" />

            <motion.div
              className="nr-payment-marquee-track"
              animate={{ x: isArabic ? ["0%", "-50%"] : ["-50%", "0%"] }}
              transition={{
                duration: 34,
                ease: "linear",
                repeat: Infinity,
              }}
            >
              {[0, 1].map((copyIndex) => (
                <div
                  className="nr-payment-marquee-group"
                  key={`payment-group-${copyIndex}`}
                  aria-hidden={copyIndex === 1}
                >
                  {paymentMethods.map((method) => (
                    <motion.article
                      className={`nr-payment-card ${
                        method.type === "installment"
                          ? "nr-installment-card"
                          : ""
                      }`}
                      key={`${copyIndex}-${method.nameEn}`}
                      whileHover={{ y: -8, scale: 1.02 }}
                    >
                      <div className="nr-payment-logo">
                        <Image
                          src={method.image}
                          alt={isArabic ? method.nameAr : method.nameEn}
                          width={160}
                          height={70}
                        />
                      </div>

                      <strong>
                        {isArabic ? method.nameAr : method.nameEn}
                      </strong>

                      {method.type === "installment" && (
                        <span className="nr-installment-label">
                          {isArabic
                            ? "قسّم قيمة الحجز"
                            : "Split your booking"}
                        </span>
                      )}
                    </motion.article>
                  ))}

                  {extraPaymentMethods.map((method) => (
                    <motion.article
                      className="nr-payment-card nr-payment-card-upcoming"
                      key={`${copyIndex}-${method.nameEn}`}
                      whileHover={{ y: -8, scale: 1.02 }}
                    >
                      <span className="nr-payment-status">
                        {isArabic ? "قريبًا" : "Coming soon"}
                      </span>

                      <div className="nr-payment-logo nr-payment-text-logo">
                        <span>{method.textLogo}</span>
                      </div>

                      <strong>
                        {isArabic ? method.nameAr : method.nameEn}
                      </strong>

                      <span className="nr-installment-label">
                        {isArabic ? method.labelAr : method.labelEn}
                      </span>
                    </motion.article>
                  ))}
                </div>
              ))}
            </motion.div>
          </div>

          <aside className="nr-payment-info">
            <div className="nr-payment-info-item">
              <span className="nr-payment-info-icon">✓</span>
              <div>
                <strong>
                  {isArabic
                    ? "دفع آمن ومحمي"
                    : "Secure payments"}
                </strong>
                <p>
                  {isArabic
                    ? "تتم معالجة المعاملات من خلال مزودي دفع آمنين."
                    : "Transactions are processed through secure payment providers."}
                </p>
              </div>
            </div>

            <div className="nr-payment-info-item">
              <span className="nr-payment-info-icon">4</span>
              <div>
                <strong>
                  {isArabic
                    ? "الدفع المرن"
                    : "Flexible payments"}
                </strong>
                <p>
                  {isArabic
                    ? "يمكن تقسيم قيمة الحجز من خلال تابي وتمارا حسب الأهلية والشروط."
                    : "Eligible bookings may be split through Tabby or Tamara, subject to their terms."}
                </p>
              </div>
            </div>

            <div className="nr-payment-info-item">
              <span className="nr-payment-info-icon">+</span>
              <div>
                <strong>
                  {isArabic
                    ? "وسائل إضافية قريبًا"
                    : "More options coming soon"}
                </strong>
                <p>
                  {isArabic
                    ? "يمكن تفعيل وسائل الدفع الجديدة لاحقًا من لوحة التحكم بعد اعتمادها رسميًا."
                    : "New payment methods can later be activated from the admin dashboard once officially approved."}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <style jsx global>{`
        .nr-payment-layout {
          align-items: start;
        }

        .nr-payment-marquee {
          position: relative;
          min-width: 0;
          overflow: hidden;
          padding: 14px 0 22px;
          border-radius: 24px;
        }

        .nr-payment-marquee-track {
          display: flex;
          width: max-content;
          will-change: transform;
        }

        .nr-payment-marquee-group {
          display: flex;
          flex: 0 0 auto;
          align-items: stretch;
          gap: 14px;
          padding-inline-end: 14px;
        }

        .nr-payment-marquee .nr-payment-card {
          position: relative;
          flex: 0 0 205px;
          width: 205px;
          min-height: 190px;
        }

        .nr-payment-card-upcoming {
          border-style: dashed;
          opacity: 0.88;
        }

        .nr-payment-status {
          position: absolute;
          top: 10px;
          inset-inline-end: 10px;
          z-index: 2;
          display: inline-flex;
          min-height: 24px;
          align-items: center;
          padding-inline: 8px;
          border-radius: 999px;
          color: #176fe8;
          background: rgba(23, 111, 232, 0.09);
          font-size: 9px;
          font-weight: 900;
        }

        .nr-payment-text-logo {
          display: grid;
          place-items: center;
        }

        .nr-payment-text-logo span {
          color: var(--nr-text);
          font-size: 18px;
          font-weight: 950;
          letter-spacing: -0.02em;
        }

        .nr-payment-marquee-fade {
          position: absolute;
          top: 0;
          bottom: 0;
          z-index: 4;
          width: 74px;
          pointer-events: none;
        }

        .nr-payment-marquee-fade-start {
          inset-inline-start: 0;
          background: linear-gradient(
            to right,
            var(--nr-bg),
            transparent
          );
        }

        [dir="rtl"] .nr-payment-marquee-fade-start {
          background: linear-gradient(
            to left,
            var(--nr-bg),
            transparent
          );
        }

        .nr-payment-marquee-fade-end {
          inset-inline-end: 0;
          background: linear-gradient(
            to left,
            var(--nr-bg),
            transparent
          );
        }

        [dir="rtl"] .nr-payment-marquee-fade-end {
          background: linear-gradient(
            to right,
            var(--nr-bg),
            transparent
          );
        }

        .nr-payment-marquee:hover .nr-payment-marquee-track {
          animation-play-state: paused;
        }

        @media (max-width: 760px) {
          .nr-payment-marquee {
            width: calc(100vw - 26px);
            margin-inline: auto;
          }

          .nr-payment-marquee .nr-payment-card {
            flex-basis: 176px;
            width: 176px;
            min-height: 176px;
          }

          .nr-payment-marquee-fade {
            width: 38px;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .nr-payment-marquee {
            overflow-x: auto;
          }

          .nr-payment-marquee-track {
            transform: none !important;
          }

          .nr-payment-marquee-group:nth-child(2) {
            display: none;
          }
        }
      `}</style>
    </section>
  );
}