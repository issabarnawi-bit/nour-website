import type { ReactNode } from "react";
import Badge from "./Badge";
import styles from "./ui.module.css";

type Props = {
  eyebrow?: ReactNode;
  title: ReactNode;
  description?: ReactNode;
  align?: "start" | "center";
  inverse?: boolean;
  className?: string;
};

export default function SectionTitle({
  eyebrow,
  title,
  description,
  align = "start",
  inverse = false,
  className = "",
}: Props) {
  return (
    <header
      className={[
        styles.sectionTitle,
        styles[`align_${align}`],
        inverse ? styles.inverse : "",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {eyebrow ? <Badge tone={inverse ? "gold" : "blue"}>{eyebrow}</Badge> : null}
      <h2>{title}</h2>
      {description ? <p>{description}</p> : null}
    </header>
  );
}
