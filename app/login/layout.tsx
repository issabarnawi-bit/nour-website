import type { ReactNode } from "react";
import "../../src/styles/admin/admin.css";

type LoginLayoutProps = {
  children: ReactNode;
};

export default function LoginLayout({
  children,
}: LoginLayoutProps) {
  return (
    <div className="nr-login-layout">
      {children}
    </div>
  );
}