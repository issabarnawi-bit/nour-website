type TableSkeletonProps = {
  rows?: number;
  columns?: number;
};

export default function TableSkeleton({
  rows = 5,
  columns = 7,
}: TableSkeletonProps) {
  return (
    <div
      className="nr-table-skeleton"
      role="status"
      aria-label="جارٍ تحميل الجدول"
    >
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div
          key={rowIndex}
          className="nr-table-skeleton-row"
          style={{
            gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: columns }).map(
            (_, columnIndex) => (
              <span
                key={columnIndex}
                className="nr-skeleton-block"
              />
            ),
          )}
        </div>
      ))}
    </div>
  );
}