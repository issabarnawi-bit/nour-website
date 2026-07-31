import type { ReactNode } from "react";
import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

type AdminShellProps = {
  children: ReactNode;
};

export default function AdminShell({
  children,
}: AdminShellProps) {
  return (
    <div className="nr-admin">
      <Sidebar />

      <div className="nr-admin-content">
        <Topbar />

        <main className="nr-admin-main">
          {children}
        </main>
      </div>
    </div>
  );
}