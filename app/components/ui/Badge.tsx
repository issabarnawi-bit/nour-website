import type { ReactNode } from "react";
import styles from "./ui.module.css";

type Props = {
  children: ReactNode;
  tone?: "blue" | "gold" | "neutral" | "success";
  className?: string;
};

export default function Badge({
  children,
  tone = "blue",
  className = "",
}: Props) {
  return (
    <span className={`${styles.badge} ${styles[`badge_${tone}`]} ${className}`}>
      {children}
    </span>
  );
}
