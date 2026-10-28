interface ErrorMessageProps {
  message?: string;
  id?: string;
}

export default function ErrorMessage({ message, id }: ErrorMessageProps) {
  if (!message) return null;
  return (
    <p id={id} role="alert" className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
        <circle cx="6" cy="6" r="5.5" stroke="currentColor" />
        <path d="M6 3.5v3M6 8h.01" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      </svg>
      {message}
    </p>
  );
}
