import React, { useEffect } from 'react';

export default function Toast({ message, onDismiss, duration = 3200 }) {
  useEffect(() => {
    if (!message) return undefined;
    const t = setTimeout(onDismiss, duration);
    return () => clearTimeout(t);
  }, [message, duration, onDismiss]);

  if (!message) return null;

  return (
    <div className="app-toast" role="status" aria-live="polite">
      <span>{message}</span>
      <button type="button" className="app-toast-dismiss" onClick={onDismiss} aria-label="Dismiss">
        ×
      </button>
    </div>
  );
}
