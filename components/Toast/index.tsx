"use client";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { gsap } from "gsap";
import useToastStore, { Toast } from "../../lib/store/useToastStore";
import { mergeClassnames } from "../../lib/utils";
import XIcon from "../SVGIcons/XIcon";

interface ToastItemProps {
  toast: Toast;
  index: number;
  totalToasts: number;
  onRemove: (id: string) => void;
}

const ToastItem = ({ toast, index, totalToasts, onRemove }: ToastItemProps) => {
  const [isLeaving, setIsLeaving] = useState(false);
  const [hasAnimatedIn, setHasAnimatedIn] = useState(false);
  const toastRef = useRef<HTMLDivElement>(null);

  const handleRemove = useCallback(() => {
    setIsLeaving(true);

    if (toastRef.current) {
      const tl = gsap.timeline({
        onComplete: () => {
          onRemove(toast.id);
        },
      });

      // Shrink and fade slightly
      tl.to(toastRef.current, {
        scale: 0.95,
        opacity: 0.8,
        duration: 0.1,
        ease: "power2.out",
      })
        // Slide out with rotation and scale down
        .to(
          toastRef.current,
          {
            x: 450,
            rotation: 8,
            scale: 0.7,
            opacity: 0,
            duration: 0.4,
            ease: "back.in(1.7)",
          },
          "-=0.05"
        ); // Start slightly before first animation ends

      // Add a subtle blur effect during exit
      tl.to(
        toastRef.current,
        {
          filter: "blur(2px)",
          duration: 0.3,
          ease: "power2.in",
        },
        "-=0.3"
      );
    } else {
      setTimeout(() => {
        onRemove(toast.id);
      }, 500);
    }
  }, [toast.id, onRemove]);

  useEffect(() => {
    if (toastRef.current && !hasAnimatedIn && !isLeaving) {
      const scale = 1 - (totalToasts - 1 - index) * 0.05;
      const yOffset = (totalToasts - 1 - index) * -8;
      const zIndex = index + 1;

      const tl = gsap.timeline({
        onComplete: () => {
          setHasAnimatedIn(true);
        },
      });

      // Set initial off-screen state with rotation
      gsap.set(toastRef.current, {
        x: 450,
        opacity: 0,
        scale: 0.6,
        rotation: -5,
        y: 20,
        zIndex: zIndex,
        filter: "blur(1px)",
      });

      //  Slide in with rotation correction
      tl.to(toastRef.current, {
        x: 0,
        rotation: 0,
        scale: scale * 0.9, // Start slightly smaller
        opacity: 0.7,
        filter: "blur(0px)",
        duration: 0.3,
        ease: "power2.out",
      })
        // Bounce to final position with scale
        .to(
          toastRef.current,
          {
            scale: scale,
            y: yOffset,
            opacity: 1,
            duration: 0.35,
            ease: "back.out(1.4)",
          },
          "-=0.1"
        ); // Overlap slightly for smoothness
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update stack position when other toasts are added/removed
  useEffect(() => {
    if (toastRef.current && hasAnimatedIn && !isLeaving) {
      const scale = 1 - (totalToasts - 1 - index) * 0.05;
      const yOffset = (totalToasts - 1 - index) * -8;
      const zIndex = index + 1;

      gsap.to(toastRef.current, {
        scale: scale,
        y: yOffset,
        zIndex: zIndex,
        duration: 0.3,
        ease: "power2.out",
      });
    }
  }, [index, totalToasts, hasAnimatedIn, isLeaving]);

  // Auto-hide toast after duration
  useEffect(() => {
    if (isLeaving || !hasAnimatedIn) return;

    // Start exit animation after duration
    const timer = setTimeout(() => {
      if (toast.duration && toast.duration > 0) {
        handleRemove();
      }
    }, toast.duration || 5000);

    return () => clearTimeout(timer);
  }, [toast.duration, isLeaving, hasAnimatedIn, handleRemove]);

  const getToastStyles = () => {
    const baseStyles =
      "min-w-[300px] max-w-[500px] p-4 rounded-lg shadow-lg border absolute transform-gpu pointer-events-auto";

    const typeStyles = {
      error:
        "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-800 dark:text-red-200",
      success:
        "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800 text-green-800 dark:text-green-200",
      warning:
        "bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800 text-yellow-800 dark:text-yellow-200",
      info: "bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200",
    };

    return mergeClassnames(baseStyles, typeStyles[toast.type]);
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

  const handleMouseEnter = useCallback(() => {
    if (toastRef.current && !isLeaving) {
      gsap.to(toastRef.current, {
        scale: (1 - (totalToasts - 1 - index) * 0.05) * 1.02, // Slightly larger
        rotation: 1,
        duration: 0.2,
        ease: "power2.out",
      });
    }
  }, [index, totalToasts, isLeaving]);

  const handleMouseLeave = useCallback(() => {
    if (toastRef.current && !isLeaving) {
      const originalScale = 1 - (totalToasts - 1 - index) * 0.05;
      gsap.to(toastRef.current, {
        scale: originalScale,
        rotation: 0,
        duration: 0.2,
        ease: "power2.out",
      });
    }
  }, [index, totalToasts, isLeaving]);

  return (
    <div
      ref={toastRef}
      className={getToastStyles()}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
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

const ToastContainer = ({ limit }: { limit?: number } = {}) => {
  const { toasts, removeToast, maxToasts, setMaxToasts } = useToastStore();

  useEffect(() => {
    if (limit !== undefined && limit !== maxToasts) {
      setMaxToasts(limit);
    }
  }, [limit, maxToasts, setMaxToasts]);

  if (toasts.length === 0) return null;

  return (
    <div
      className="fixed bottom-4 right-4 z-50 pointer-events-none"
      style={{ width: "16vw", height: "8vh" }}
      role="region"
      aria-label="Notifications"
    >
      <div className="relative">
        {toasts.map((toast, index) => (
          <ToastItem
            key={toast.id}
            toast={toast}
            index={index}
            totalToasts={toasts.length}
            onRemove={removeToast}
          />
        ))}
      </div>
    </div>
  );
};

export default ToastContainer;
