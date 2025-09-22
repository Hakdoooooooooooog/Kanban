import useToastStore from "../../lib/store/useToastStore";

/**
 * Toast utility functions for easy access throughout the application
 * These functions provide a simple API to show different types of toast notifications
 */

export const toast = {
  /**
   * Show an error toast notification
   * @param title - The main error message
   * @param message - Optional detailed error description
   * @param duration - Optional duration in milliseconds (default: 5000)
   */
  error: (title: string, message?: string, duration?: number) => {
    useToastStore.getState().showError(title, message, duration);
  },

  /**
   * Show a success toast notification
   * @param title - The main success message
   * @param message - Optional detailed success description
   * @param duration - Optional duration in milliseconds (default: 5000)
   */
  success: (title: string, message?: string, duration?: number) => {
    useToastStore.getState().showSuccess(title, message, duration);
  },

  /**
   * Show a warning toast notification
   * @param title - The main warning message
   * @param message - Optional detailed warning description
   * @param duration - Optional duration in milliseconds (default: 5000)
   */
  warning: (title: string, message?: string, duration?: number) => {
    useToastStore.getState().showWarning(title, message, duration);
  },

  /**
   * Show an info toast notification
   * @param title - The main info message
   * @param message - Optional detailed info description
   * @param duration - Optional duration in milliseconds (default: 5000)
   */
  info: (title: string, message?: string, duration?: number) => {
    useToastStore.getState().showInfo(title, message, duration);
  },

  /**
   * Clear all toast notifications
   */
  clearAll: () => {
    useToastStore.getState().clearAllToasts();
  },

  /**
   * Remove a specific toast notification by ID
   * @param id - The ID of the toast to remove
   */
  remove: (id: string) => {
    useToastStore.getState().removeToast(id);
  },

  /**
   * Set the maximum number of toasts that can be displayed simultaneously
   * @param limit - Maximum number of toasts (minimum 1)
   */
  setLimit: (limit: number) => {
    useToastStore.getState().setMaxToasts(limit);
  },

  /**
   * Get the current maximum toast limit
   * @returns The current maximum number of toasts
   */
  getLimit: () => {
    return useToastStore.getState().maxToasts;
  },
};

/**
 * Hook-based toast functions (for use within React components)
 * Returns the toast utility functions with proper React context
 */
export const useToast = () => {
  const {
    showError,
    showSuccess,
    showWarning,
    showInfo,
    clearAllToasts,
    removeToast,
    setMaxToasts,
    maxToasts,
  } = useToastStore();

  return {
    error: showError,
    success: showSuccess,
    warning: showWarning,
    info: showInfo,
    clearAll: clearAllToasts,
    remove: removeToast,
    setLimit: setMaxToasts,
    getLimit: () => maxToasts,
  };
};

// Common error scenarios helpers
export const errorToasts = {
  /**
   * Show a generic network error toast
   */
  networkError: () => {
    toast.error(
      "Network Error",
      "Failed to connect to the server. Please check your internet connection.",
      6000
    );
  },

  /**
   * Show a validation error toast
   * @param field - The field name that failed validation
   * @param message - The validation error message
   */
  validationError: (field: string, message?: string) => {
    toast.error(
      `${field} Validation Failed`,
      message || `Please check the ${field.toLowerCase()} field and try again.`
    );
  },

  /**
   * Show a permission denied error toast
   */
  permissionDenied: () => {
    toast.error(
      "Permission Denied",
      "You don't have permission to perform this action."
    );
  },

  /**
   * Show a generic server error toast
   */
  serverError: () => {
    toast.error(
      "Server Error",
      "Something went wrong on our end. Please try again later.",
      6000
    );
  },

  /**
   * Show a data not found error toast
   * @param item - The item that was not found
   */
  notFound: (item: string = "resource") => {
    toast.error(
      "Not Found",
      `The ${item} you're looking for could not be found.`
    );
  },

  /**
   * Show an unauthorized error toast
   */
  unauthorized: () => {
    toast.error("Authentication Required", "Please log in to continue.", 6000);
  },
};
