interface PlaceholderPageProps {
  title: string;
  description: string;
}

export function PlaceholderPage({ title, description }: PlaceholderPageProps) {
  return (
    <section className="page-card">
      <p className="eyebrow">Milestone 1 · Delivery 1</p>
      <h1>{title}</h1>
      <p>{description}</p>
      <div className="status-grid" aria-label="Foundation status">
        <article>
          <strong>Routing</strong>
          <span>Ready</span>
        </article>
        <article>
          <strong>Responsive shell</strong>
          <span>Ready</span>
        </article>
        <article>
          <strong>Bitcoin provider</strong>
          <span>Next</span>
        </article>
      </div>
    </section>
  );
}
