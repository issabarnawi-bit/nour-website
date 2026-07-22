import Image from "next/image";
import { motion } from "framer-motion";
import type { Language } from "../../data/home";
import { fadeUp, paymentMethods } from "../../data/home";

export default function Payments({ language }: { language: Language }) {
  return <section className="nr-payments" id="payments"><div className="nr-container">
    <motion.div className="nr-payment-heading" initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.25 }} variants={fadeUp}><span className="nr-kicker nr-payment-kicker">{language === "ar" ? "خيارات دفع مرنة" : "Flexible Payment Options"}</span><h2>{language === "ar" ? "ادفع بالطريقة التي تناسبك" : "Pay the way that suits you"}</h2><p>{language === "ar" ? "نوفر وسائل دفع إلكترونية متعددة، بالإضافة إلى خيارات الدفع المرن من خلال تابي وتمارا." : "Choose from multiple electronic payment methods, including flexible payment options through Tabby and Tamara."}</p></motion.div>
    <div className="nr-payment-layout"><div className="nr-payment-methods">{paymentMethods.map((method) => <motion.article className={`nr-payment-card ${method.type === "installment" ? "nr-installment-card" : ""}`} key={method.nameEn} initial="hidden" whileInView="visible" viewport={{ once: true, amount: 0.2 }} variants={fadeUp} whileHover={{ y: -8, scale: 1.02 }}><div className="nr-payment-logo"><Image src={method.image} alt={language === "ar" ? method.nameAr : method.nameEn} width={160} height={70} /></div><strong>{language === "ar" ? method.nameAr : method.nameEn}</strong>{method.type === "installment" && <span className="nr-installment-label">{language === "ar" ? "قسّم قيمة الحجز" : "Split your booking"}</span>}</motion.article>)}</div>
      <aside className="nr-payment-info"><div className="nr-payment-info-item"><span className="nr-payment-info-icon">✓</span><div><strong>{language === "ar" ? "دفع آمن ومحمي" : "Secure payments"}</strong><p>{language === "ar" ? "تتم معالجة المعاملات من خلال مزودي دفع آمنين." : "Transactions are processed through secure payment providers."}</p></div></div><div className="nr-payment-info-item"><span className="nr-payment-info-icon">4</span><div><strong>{language === "ar" ? "الدفع المرن" : "Flexible payments"}</strong><p>{language === "ar" ? "يمكن تقسيم قيمة الحجز من خلال تابي وتمارا حسب الأهلية والشروط." : "Eligible bookings may be split through Tabby or Tamara, subject to their terms."}</p></div></div></aside>
    </div>
  </div></section>;
}
