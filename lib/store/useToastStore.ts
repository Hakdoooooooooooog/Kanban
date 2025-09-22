import { create } from "zustand";

export interface Toast {
  id: string;
  type: "error" | "success" | "warning" | "info";
  title: string;
  message?: string;
  duration?: number;
  isVisible?: boolean;
}

interface ToastStore {
  toasts: Toast[];
  addToast: (toast: Omit<Toast, "id" | "isVisible">) => void;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
  showError: (title: string, message?: string, duration?: number) => void;
  showSuccess: (title: string, message?: string, duration?: number) => void;
  showWarning: (title: string, message?: string, duration?: number) => void;
  showInfo: (title: string, message?: string, duration?: number) => void;
}

const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],

  addToast: (toast) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      ...toast,
      id,
      isVisible: true,
      duration: toast.duration ?? 5000, // Default 5 seconds
    };

    set((state) => ({
      toasts: [...state.toasts, newToast],
    }));

    // Auto-remove toast after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, newToast.duration);
    }
  },

  removeToast: (id) => {
    set((state) => ({
      toasts: state.toasts.filter((toast) => toast.id !== id),
    }));
  },

  clearAllToasts: () => {
    set({ toasts: [] });
  },

  // Helper methods for different toast types
  showError: (title, message, duration) => {
    get().addToast({
      type: "error",
      title,
      message,
      duration,
    });
  },

  showSuccess: (title, message, duration) => {
    get().addToast({
      type: "success",
      title,
      message,
      duration,
    });
  },

  showWarning: (title, message, duration) => {
    get().addToast({
      type: "warning",
      title,
      message,
      duration,
    });
  },

  showInfo: (title, message, duration) => {
    get().addToast({
      type: "info",
      title,
      message,
      duration,
    });
  },
}));

export default useToastStore;
