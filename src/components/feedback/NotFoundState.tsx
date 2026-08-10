export function NotFoundState({ message }: { message: string }) {
  return (
    <div className="feedback-state feedback-not-found" role="status">
      <strong>Not found</strong>
      <span>{message}</span>
    </div>
  );
}
