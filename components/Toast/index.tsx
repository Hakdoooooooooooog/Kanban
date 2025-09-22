"use client";
import React, { useEffect, useState } from "react";
import useToastStore, { Toast } from "../../lib/store/useToastStore";
import { mergeClassnames } from "../../lib/utils";
import XIcon from "../SVGIcons/XIcon";

interface ToastItemProps {
  toast: Toast;
  onRemove: (id: string) => void;
}

const ToastItem = ({ toast, onRemove }: ToastItemProps) => {
  const [isLeaving, setIsLeaving] = useState(false);

  const handleRemove = () => {
    setIsLeaving(true);
    // Wait for animation to complete before removing
    setTimeout(() => {
      onRemove(toast.id);
    }, 300);
  };

  // Auto-hide toast when leaving animation starts
  useEffect(() => {
    if (isLeaving) return;

    // Start exit animation 300ms before actual removal
    const timer = setTimeout(() => {
      if (toast.duration && toast.duration > 0) {
        setIsLeaving(true);
      }
    }, Math.max(0, (toast.duration || 5000) - 300));

    return () => clearTimeout(timer);
  }, [toast.duration, isLeaving]);

  const getToastStyles = () => {
    const baseStyles =
      "min-w-[300px] max-w-[500px] p-4 rounded-lg shadow-lg border transition-all duration-300 ease-in-out transform";

    const typeStyles = {
      error:
        "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200",
      success:
        "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200",
      warning:
        "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200",
      info: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200",
    };

    const animationStyles = isLeaving
      ? "translate-x-full opacity-0 scale-95"
      : "translate-x-0 opacity-100 scale-100";

    return mergeClassnames(baseStyles, typeStyles[toast.type], animationStyles);
  };

  const getIconColor = () => {
    const iconColors = {
      error: "text-red-500 dark:text-red-400",
      success: "text-green-500 dark:text-green-400",
      warning: "text-yellow-500 dark:text-yellow-400",
      info: "text-blue-500 dark:text-blue-400",
    };
    return iconColors[toast.type];
  };

  const getIcon = () => {
    const iconClass = mergeClassnames("w-5 h-5 flex-shrink-0", getIconColor());

    switch (toast.type) {
      case "error":
        return (
          <svg
            className={iconClass}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "success":
        return (
          <svg
            className={iconClass}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
      case "warning":
        return (
          <svg
            className={iconClass}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"
            />
          </svg>
        );
      case "info":
        return (
          <svg
            className={iconClass}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        );
    }
  };

  return (
    <div className={getToastStyles()}>
      <div className="flex items-start gap-3">
        {getIcon()}
        <div className="flex-1 min-w-0">
          <div className="font-medium text-sm">{toast.title}</div>
          {toast.message && (
            <div className="text-xs mt-1 opacity-80">{toast.message}</div>
          )}
        </div>
        <button
          onClick={handleRemove}
          className="flex-shrink-0 p-1 rounded-md hover:bg-black/5 dark:hover:bg-white/5 transition-colors duration-200"
          aria-label="Close notification"
        >
          <XIcon className="w-4 h-4 opacity-60 hover:opacity-100" />
        </button>
      </div>
    </div>
  );
};

const ToastContainer = () => {
  const { toasts, removeToast } = useToastStore();

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex flex-col gap-2"
      role="region"
      aria-label="Notifications"
    >
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={removeToast} />
      ))}
    </div>
  );
};

export default ToastContainer;
