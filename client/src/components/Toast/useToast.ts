import { useCallback } from 'react';
import { useToastStore } from './toastStore';

export type ToastVariant = 'success' | 'error' | 'warning' | 'info';

export interface ToastOptions {
  /** Toast message text. Required. */
  message: string;
  /** Variant controls icon and colour. Default: 'info'. */
  variant?: ToastVariant;
  /** Auto-dismiss after N milliseconds. Default: 4000. Pass 0 to disable. */
  duration?: number;
  /** Accessible title shown in bold above the message. */
  title?: string;
}

/**
 * Hook for triggering toasts from any component.
 *
 * @example
 * const toast = useToast();
 * toast.success('Task saved!');
 * toast.error('Failed to save', { title: 'Oops' });
 * toast.info('Syncing…', { duration: 2000 });
 */
export const useToast = () => {
  const add = useToastStore((s) => s.add);

  const success = useCallback(
    (message: string, options?: Omit<ToastOptions, 'message' | 'variant'>) =>
      add({ message, variant: 'success', ...options }),
    [add],
  );

  const error = useCallback(
    (message: string, options?: Omit<ToastOptions, 'message' | 'variant'>) =>
      add({ message, variant: 'error', ...options }),
    [add],
  );

  const warning = useCallback(
    (message: string, options?: Omit<ToastOptions, 'message' | 'variant'>) =>
      add({ message, variant: 'warning', ...options }),
    [add],
  );

  const info = useCallback(
    (message: string, options?: Omit<ToastOptions, 'message' | 'variant'>) =>
      add({ message, variant: 'info', ...options }),
    [add],
  );

  return { success, error, warning, info };
};
