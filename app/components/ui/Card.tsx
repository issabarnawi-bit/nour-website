import type { HTMLAttributes, ReactNode } from "react";
import styles from "./ui.module.css";

type Props = HTMLAttributes<HTMLElement> & {
  children: ReactNode;
  glass?: boolean;
};

export default function Card({
  children,
  glass = false,
  className = "",
  ...rest
}: Props) {
  return (
    <article
      className={`${styles.card} ${glass ? styles.glass : ""} ${className}`}
      {...rest}
    >
      {children}
    </article>
  );
}
