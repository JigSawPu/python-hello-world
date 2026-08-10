interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({ title = 'Unable to complete the request', message, onRetry }: ErrorStateProps) {
  return (
    <div className="feedback-state feedback-error" role="alert">
      <strong>{title}</strong>
      <span>{message}</span>
      {onRetry && <button type="button" onClick={onRetry}>Retry</button>}
    </div>
  );
}
