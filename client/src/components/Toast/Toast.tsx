import React, { useEffect, useRef, useState } from 'react';
import type { ToastVariant } from './useToast';
import styles from './Toast.module.scss';

// ── SVG Icons ───────────────────────────────────────────────

const SuccessIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
      clipRule="evenodd"
    />
  </svg>
);

const ErrorIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16ZM8.28 7.22a.75.75 0 0 0-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 1 0 1.06 1.06L10 11.06l1.72 1.72a.75.75 0 1 0 1.06-1.06L11.06 10l1.72-1.72a.75.75 0 0 0-1.06-1.06L10 8.94 8.28 7.22Z"
      clipRule="evenodd"
    />
  </svg>
);

const WarningIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495ZM10 5a.75.75 0 0 1 .75.75v3.5a.75.75 0 0 1-1.5 0v-3.5A.75.75 0 0 1 10 5Zm0 9a1 1 0 1 0 0-2 1 1 0 0 0 0 2Z"
      clipRule="evenodd"
    />
  </svg>
);

const InfoIcon = () => (
  <svg viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
    <path
      fillRule="evenodd"
      d="M18 10a8 8 0 1 1-16 0 8 8 0 0 1 16 0Zm-7-4a1 1 0 1 1-2 0 1 1 0 0 1 2 0ZM9 9a.75.75 0 0 0 0 1.5h.253a.25.25 0 0 1 .244.304l-.459 2.066A1.75 1.75 0 0 0 10.747 15H11a.75.75 0 0 0 0-1.5h-.253a.25.25 0 0 1-.244-.304l.459-2.066A1.75 1.75 0 0 0 9.253 9H9Z"
      clipRule="evenodd"
    />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 16 16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
    <path d="M4 4l8 8M12 4l-8 8" />
  </svg>
);

// ── Icon map ────────────────────────────────────────────────

const ICONS: Record<ToastVariant, React.ReactElement> = {
  success: <SuccessIcon />,
  error: <ErrorIcon />,
  warning: <WarningIcon />,
  info: <InfoIcon />,
};

// ── Component ──────────────────────────────────────────────

export interface ToastProps {
  /** Unique identifier used by ToastContainer for dismissal. */
  id: string;
  message: string;
  variant?: ToastVariant;
  title?: string;
  /** Duration in ms used to drive the progress bar animation. Pass 0 to disable. */
  duration?: number;
  /** Unix timestamp (ms) when the toast was created. */
  startTime: number;
  onDismiss: (id: string) => void;
}

export const Toast = ({
  id,
  message,
  variant = 'info',
  title,
  duration = 4000,
  startTime,
  onDismiss,
}: ToastProps) => {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // When duration=0 the progress bar is hidden; when >0 it animates.
  const hasProgress = duration > 0;

  // Calculate remaining time in case the toast was queued before rendering.
  const [remaining, setRemaining] = useState(() => {
    const elapsed = Date.now() - startTime;
    return Math.max(0, duration - elapsed);
  });

  useEffect(() => {
    if (!hasProgress || remaining <= 0) return;

    const tick = () => {
      const elapsed = Date.now() - startTime;
      const left = Math.max(0, duration - elapsed);
      setRemaining(left);
      if (left <= 0) {
        onDismiss(id);
      }
    };

    // Re-sync on every second so the progress bar is accurate
    const interval = setInterval(tick, 100);
    timerRef.current = setTimeout(() => onDismiss(id), remaining);

    return () => {
      clearInterval(interval);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [hasProgress, duration, startTime, remaining, id, onDismiss]);

  const handleMouseEnter = () => {
    // Pause: clear the auto-dismiss timer so it doesn't fire while hovering
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
  };

  const handleMouseLeave = () => {
    // Resume: restart with the current remaining time
    if (hasProgress && remaining > 0) {
      timerRef.current = setTimeout(() => onDismiss(id), remaining);
    }
  };

  // Fraction of time remaining (1 = full, 0 = expired)
  const progress = duration > 0 ? remaining / duration : 1;

  return (
    <div
      role="alert"
      aria-live="polite"
      className={`${styles.toast} ${styles[variant]}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {hasProgress && (
        <div
          className={`${styles.progressBar} ${styles[`${variant}Progress`]}`}
          style={{
            transform: `scaleX(${progress})`,
            transformOrigin: 'left center',
          }}
          aria-hidden="true"
        />
      )}

      <span className={`${styles.icon} ${styles[variant]}`} aria-hidden="true">
        {ICONS[variant]}
      </span>

      <div className={styles.body}>
        {title && <p className={styles.title}>{title}</p>}
        <p className={styles.message}>{message}</p>
      </div>

      <button
        type="button"
        className={styles.dismissBtn}
        onClick={() => onDismiss(id)}
        aria-label="Dismiss notification"
      >
        <CloseIcon />
      </button>
    </div>
  );
};
