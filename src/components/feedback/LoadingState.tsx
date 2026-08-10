export function LoadingState({ label = 'Loading…' }: { label?: string }) {
  return <div className="feedback-state" role="status" aria-live="polite">{label}</div>;
}
