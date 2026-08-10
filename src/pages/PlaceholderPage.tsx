interface PlaceholderPageProps {
  title: string;
  description: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <section className="page-card">
      <p className="eyebrow">Milestone 1 · Delivery 4 validation</p>
      <h1>{title}</h1>
      <p>{description}</p>
      <div className="status-grid" aria-label="Foundation status">
        <article><strong>Routing</strong><span>Validated</span></article>
        <article><strong>Bitcoin provider</strong><span>Validated</span></article>
        <article><strong>Search</strong><span>Validated</span></article>
      </div>
    </section>
  );
}
