import type { ReactNode } from "react";

import Sidebar from "../../src/components/admin/layout/Sidebar";
import Topbar from "../../src/components/admin/layout/Topbar";
import { ToastProvider } from "../../src/core/notifications";
import { ThemeProvider } from "../../src/core/theme";

import "../../src/styles/admin/admin.css";

type AdminLayoutProps = {
  children: ReactNode;
};

export default function AdminLayout({
  children,
}: AdminLayoutProps) {
  return (
    <ThemeProvider>
      <ToastProvider>
        <div className="admin-shell">
          <Sidebar />

          <div className="admin-main">
            <Topbar />

            <main className="admin-content">
              {children}
            </main>
          </div>
        </div>
      </ToastProvider>
    </ThemeProvider>
  );
}