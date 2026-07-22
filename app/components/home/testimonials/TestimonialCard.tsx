import Image from "next/image";
import type { Testimonial } from "../../../data/testimonials";
import type { Language } from "../../../data/home";
import StarRating from "./StarRating";
import styles from "./Testimonials.module.css";

type Props = {
  testimonial: Testimonial;
  language: Language;
  active?: boolean;
};

export default function TestimonialCard({
  testimonial,
  language,
  active = false,
}: Props) {
  const quote =
    language === "ar"
      ? testimonial.quoteAr
      : testimonial.quoteEn;

  return (
    <article
      className={`${styles.card} ${
        active ? styles.activeCard : styles.sideCard
      }`}
    >
      <div className={styles.cardTop}>
        <span className={styles.verified}>
          <span className={styles.verifiedIcon}>✓</span>
          {language === "ar"
            ? "تجربة موثقة"
            : "Verified experience"}
        </span>

        <StarRating
          value={testimonial.rating}
          label={
            language === "ar"
              ? `${testimonial.rating} من 5`
              : `${testimonial.rating} out of 5`
          }
        />
      </div>

      <blockquote>“{quote}”</blockquote>

      <footer className={styles.customer}>
        <div className={styles.avatar}>
          <Image
            src={testimonial.avatar}
            alt={testimonial.name}
            fill
            sizes={active ? "116px" : "78px"}
          />
        </div>

        <div className={styles.customerInfo}>
          <strong>{testimonial.name}</strong>
          <span>{testimonial.country}</span>
          <small>{testimonial.date}</small>
        </div>
      </footer>
    </article>
  );
}
