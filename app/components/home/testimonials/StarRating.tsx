import styles from "./Testimonials.module.css";

type Props = {
  value: number;
  label?: string;
};

export default function StarRating({ value, label }: Props) {
  const safeValue = Math.max(0, Math.min(5, Math.round(value)));

  return (
    <div
      className={styles.stars}
      aria-label={label ?? `${safeValue} out of 5 stars`}
    >
      {Array.from({ length: 5 }, (_, index) => (
        <span
          key={index}
          className={index < safeValue ? styles.filled : ""}
        >
          ★
        </span>
      ))}
    </div>
  );
}
