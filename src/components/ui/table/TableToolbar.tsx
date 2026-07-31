import type { ReactNode } from "react";

type TableToolbarProps = {
  search?: ReactNode;
  filters?: ReactNode;
  actions?: ReactNode;
};

export default function TableToolbar({
  search,
  filters,
  actions,
}: TableToolbarProps) {
  return (
    <div className="nr-table-toolbar">
      <div className="nr-table-toolbar-start">
        {search}
        {filters}
      </div>

      <div className="nr-table-toolbar-end">
        {actions}
      </div>
    </div>
  );
}