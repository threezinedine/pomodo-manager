import { create } from 'zustand';
import type { ToastOptions } from './useToast';

export type ToastId = string;

export interface ToastItem extends ToastOptions {
  id: ToastId;
  /** Unix timestamp (ms) when the toast was created. Used to calculate remaining time. */
  startTime: number;
}

interface ToastState {
  toasts: ToastItem[];
  add: (options: ToastOptions) => ToastId;
  dismiss: (id: ToastId) => void;
  clear: () => void;
}

// Nanoid-lite counter to avoid a runtime dep
let _counter = 0;
const nextId = (): ToastId =>
  `${Date.now()}-${++_counter}-${Math.random().toString(36).slice(2, 7)}`;

const DEFAULT_DURATION = 4000;

export const useToastStore = create<ToastState>((set, get) => ({
  toasts: [],

  add: (options) => {
    const id = nextId();
    const duration =
      options.duration !== undefined ? options.duration : DEFAULT_DURATION;
    const startTime = Date.now();

    set((state) => ({
      toasts: [...state.toasts, { ...options, id, duration, startTime }],
    }));

    if (duration > 0) {
      setTimeout(() => get().dismiss(id), duration);
    }

    return id;
  },

  dismiss: (id) => {
    set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) }));
  },

  clear: () => set({ toasts: [] }),
}));
