import type { ReactNode } from "react";

type TableHeaderProps = {
  title: string;
  description?: string;
  children?: ReactNode;
};

export default function TableHeader({
  title,
  description,
  children,
}: TableHeaderProps) {
  return (
    <div className="nr-table-header">
      <div className="nr-table-header-copy">
        <h2>{title}</h2>

        {description ? <p>{description}</p> : null}
      </div>

      {children ? (
        <div className="nr-table-header-actions">
          {children}
        </div>
      ) : null}
    </div>
  );
}