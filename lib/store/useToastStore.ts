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
  maxToasts: number;
  addToast: (toast: Omit<Toast, "id" | "isVisible">) => void;
  removeToast: (id: string) => void;
  clearAllToasts: () => void;
  setMaxToasts: (limit: number) => void;
  showError: (title: string, message?: string, duration?: number) => void;
  showSuccess: (title: string, message?: string, duration?: number) => void;
  showWarning: (title: string, message?: string, duration?: number) => void;
  showInfo: (title: string, message?: string, duration?: number) => void;
}

const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],
  maxToasts: 5, // Default limit of 5 toasts

  addToast: (toast) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newToast: Toast = {
      ...toast,
      id,
      isVisible: true,
      duration: toast.duration ?? 5000, // Default 5 seconds
    };

    set((state) => {
      const updatedToasts = [...state.toasts, newToast];

      // Enforce the limit by removing oldest toasts if we exceed maxToasts
      if (updatedToasts.length > state.maxToasts) {
        // Remove the oldest toasts that exceed the limit
        return {
          toasts: updatedToasts.slice(updatedToasts.length - state.maxToasts),
        };
      }

      return { toasts: updatedToasts };
    });

    // Auto-remove toast after duration
    if (newToast.duration && newToast.duration > 0) {
      setTimeout(() => {
        get().removeToast(id);
      }, newToast.duration);
    }
  },

  setMaxToasts: (limit) => {
    set((state) => {
      const newLimit = Math.max(1, limit); // Ensure at least 1 toast can be shown
      let updatedToasts = state.toasts;

      // If current toasts exceed new limit, remove oldest ones
      if (updatedToasts.length > newLimit) {
        updatedToasts = updatedToasts.slice(updatedToasts.length - newLimit);
      }

      return {
        maxToasts: newLimit,
        toasts: updatedToasts,
      };
    });
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
