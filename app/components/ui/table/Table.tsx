import type {
  ReactNode,
  TableHTMLAttributes,
} from "react";

type TableProps = TableHTMLAttributes<HTMLTableElement> & {
  children: ReactNode;
};

export default function Table({
  children,
  className = "",
  ...props
}: TableProps) {
  return (
    <div className="nr-table-wrapper">
      <table
        className={`nr-table ${className}`.trim()}
        {...props}
      >
        {children}
      </table>
    </div>
  );
}