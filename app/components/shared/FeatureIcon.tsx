export default function FeatureIcon({ index }: { index: number }) {
  const paths = [
    <><path d="M12 3l1.5 4.5L18 9l-4.5 1.5L12 15l-1.5-4.5L6 9l4.5-1.5L12 3z" /><path d="M5 15l.8 2.2L8 18l-2.2.8L5 21l-.8-2.2L2 18l2.2-.8L5 15z" /></>,
    <><rect x="4" y="3" width="16" height="18" rx="3" /><path d="M8 8h8M8 12h5M8 16h7" /></>,
    <><path d="M5 4h14a2 2 0 0 1 2 2v13a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z" /><path d="M8 2v4M16 2v4M3 9h18" /><path d="m8 15 2.2 2.2L16 12" /></>,
    <><path d="m8.5 12.5 3 3a2 2 0 0 0 2.8 0l4.2-4.2a2 2 0 0 0 0-2.8l-2-2a2 2 0 0 0-2.8 0L12 8.2" /><path d="m15.5 11.5-3-3a2 2 0 0 0-2.8 0l-4.2 4.2a2 2 0 0 0 0 2.8l2 2a2 2 0 0 0 2.8 0l1.7-1.7" /></>,
    null,
    <><path d="m12 3 7 3v5c0 4.7-2.8 8.2-7 10-4.2-1.8-7-5.3-7-10V6l7-3z" /><path d="m9 12 2 2 4-4" /></>,
  ];

  return <div className="nr-feature-icon" aria-hidden="true">{index === 4 ? <span className="nr-feature-icon-text">24</span> : <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round">{paths[index] ?? paths[0]}</svg>}</div>;
}
