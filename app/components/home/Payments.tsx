"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import {
  Check,
  Clock3,
  Plus,
  ShieldCheck,
} from "lucide-react";

import type { Language } from "../../data/home";
import {
  fadeUp,
  paymentMethods,
} from "../../data/home";

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
  const isArabic =
    language === "ar";

  return (
    <section
      className="nr-payments nr-payments-modern"
      id="payments"
    >
      <div className="nr-container">
        <motion.div
          className="nr-payment-heading nr-payment-heading-centered"
          initial="hidden"
          whileInView="visible"
          viewport={{
            once: true,
            amount: 0.25,
          }}
          variants={fadeUp}
        >
          <span className="nr-kicker nr-payment-kicker">
            {isArabic
              ? "خيارات دفع مرنة وآمنة"
              : "Flexible & Secure Payments"}
          </span>

          <h2>
            {isArabic
              ? "ادفع بالطريقة التي تناسب رحلتك"
              : "Pay the way that suits your journey"}
          </h2>

          <p>
            {isArabic
              ? "اختر من وسائل دفع إلكترونية متعددة، مع خيارات دفع مرن عبر تابي وتمارا، ووسائل إضافية يتم تفعيلها تباعًا."
              : "Choose from multiple electronic payment methods, with flexible payment through Tabby and Tamara and more options rolling out over time."}
          </p>
        </motion.div>

        <div className="nr-payment-modern-shell">
          <div className="nr-payment-methods nr-payment-methods-modern">
            {paymentMethods.map(
              (method) => (
                <motion.article
                  className={`nr-payment-card ${
                    method.type ===
                    "installment"
                      ? "nr-installment-card"
                      : ""
                  }`}
                  key={method.nameEn}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{
                    once: true,
                    amount: 0.15,
                  }}
                  variants={fadeUp}
                  whileHover={{
                    y: -5,
                    scale: 1.015,
                  }}
                >
                  <div className="nr-payment-logo">
                    <Image
                      src={method.image}
                      alt={
                        isArabic
                          ? method.nameAr
                          : method.nameEn
                      }
                      width={160}
                      height={70}
                    />
                  </div>

                  <strong>
                    {isArabic
                      ? method.nameAr
                      : method.nameEn}
                  </strong>

                  <span
                    className={`nr-payment-kind ${
                      method.type ===
                      "installment"
                        ? "is-flexible"
                        : ""
                    }`}
                  >
                    {method.type ===
                    "installment"
                      ? isArabic
                        ? "دفع مرن"
                        : "Flexible payment"
                      : isArabic
                        ? "دفع مباشر"
                        : "Direct payment"}
                  </span>
                </motion.article>
              ),
            )}

            {extraPaymentMethods.map(
              (method) => (
                <motion.article
                  className="nr-payment-card nr-payment-card-upcoming"
                  key={method.nameEn}
                  initial="hidden"
                  whileInView="visible"
                  viewport={{
                    once: true,
                    amount: 0.15,
                  }}
                  variants={fadeUp}
                  whileHover={{
                    y: -5,
                    scale: 1.015,
                  }}
                >
                  <span className="nr-payment-status">
                    {isArabic
                      ? "قريبًا"
                      : "Coming soon"}
                  </span>

                  <div className="nr-payment-logo nr-payment-text-logo">
                    <span>
                      {method.textLogo}
                    </span>
                  </div>

                  <strong>
                    {isArabic
                      ? method.nameAr
                      : method.nameEn}
                  </strong>

                  <span className="nr-payment-kind">
                    {isArabic
                      ? method.labelAr
                      : method.labelEn}
                  </span>
                </motion.article>
              ),
            )}
          </div>

          <div className="nr-payment-benefits">
            <article>
              <span className="nr-payment-benefit-icon">
                <ShieldCheck />
              </span>

              <div>
                <strong>
                  {isArabic
                    ? "دفع آمن"
                    : "Secure payments"}
                </strong>

                <p>
                  {isArabic
                    ? "معالجة موثوقة للمدفوعات عبر مزودي الدفع المعتمدين."
                    : "Trusted payment processing through approved providers."}
                </p>
              </div>
            </article>

            <article>
              <span className="nr-payment-benefit-icon">
                <Clock3 />
              </span>

              <div>
                <strong>
                  {isArabic
                    ? "دفع مرن"
                    : "Flexible payments"}
                </strong>

                <p>
                  {isArabic
                    ? "قسّم قيمة الحجز عبر تابي أو تمارا حسب الأهلية والشروط."
                    : "Split eligible bookings with Tabby or Tamara, subject to their terms."}
                </p>
              </div>
            </article>

            <article>
              <span className="nr-payment-benefit-icon">
                <Plus />
              </span>

              <div>
                <strong>
                  {isArabic
                    ? "خيارات إضافية"
                    : "More options"}
                </strong>

                <p>
                  {isArabic
                    ? "نضيف وسائل جديدة تدريجيًا بعد اعتمادها وتفعيلها."
                    : "More payment methods can be enabled as they are approved."}
                </p>
              </div>
            </article>
          </div>

          <div className="nr-payment-security-note">
            <Check />
            <span>
              {isArabic
                ? "إتمام الحجز والدفع يتم من خلال تجربة نور آب الآمنة."
                : "Booking and payment are completed through the secure NourApp experience."}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}