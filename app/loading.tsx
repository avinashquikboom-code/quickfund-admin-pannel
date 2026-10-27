export default function Loading() {
  return (
    <main aria-label="Loading workspace" className="loading-page">
      <div className="skeleton skeleton-heading" />
      <div className="stats-grid">
        {Array.from({ length: 8 }, (_, i) => (
          <div className="skeleton skeleton-card" key={i} />
        ))}
      </div>
      <div className="charts-grid">
        <div className="skeleton skeleton-chart" />
        <div className="skeleton skeleton-chart" />
      </div>
    </main>
  );
}
