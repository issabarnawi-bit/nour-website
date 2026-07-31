import type { HTMLAttributes, ReactNode } from "react";

type BadgeVariant =
  | "primary"
  | "success"
  | "warning"
  | "danger"
  | "neutral";

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  children: ReactNode;
  variant?: BadgeVariant;
};

export default function Badge({
  children,
  variant = "neutral",
  className = "",
  ...props
}: BadgeProps) {
  return (
    <span
      className={`nr-badge nr-badge-${variant} ${className}`.trim()}
      {...props}
    >
      {children}
    </span>
  );
}