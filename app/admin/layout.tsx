import type { ReactNode } from "react";

import Sidebar from "../../src/components/admin/layout/Sidebar";
import Topbar from "../../src/components/admin/layout/Topbar";
import QueryProvider from "../../src/components/providers/QueryProvider";
import { LanguageProvider } from "../../src/core/i18n";
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
    <QueryProvider>
      <ThemeProvider>
        <LanguageProvider>
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
        </LanguageProvider>
      </ThemeProvider>
    </QueryProvider>
  );
}