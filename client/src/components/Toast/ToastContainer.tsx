import React from 'react';
import { useToastStore } from './toastStore';
import { Toast } from './Toast';
import styles from './ToastContainer.module.scss';

/**
 * Renders all active toasts and must be mounted once high in the component
 * tree (e.g. inside `App`). Import and drop `<ToastContainer />` — nothing
 * else needs to be done.
 */
export const ToastContainer = () => {
  const { toasts, dismiss } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div className={styles.container} aria-label="Notifications" role="region">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          id={toast.id}
          message={toast.message}
          variant={toast.variant}
          title={toast.title}
          duration={toast.duration}
          startTime={toast.startTime}
          onDismiss={dismiss}
        />
      ))}
    </div>
  );
};
