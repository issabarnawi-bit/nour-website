import type { HTMLAttributes, ReactNode } from "react";
import styles from "./ui.module.css";

type Props = HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
};

export default function Container({
  children,
  className = "",
  ...rest
}: Props) {
  return (
    <div className={`${styles.container} ${className}`} {...rest}>
      {children}
    </div>
  );
}
