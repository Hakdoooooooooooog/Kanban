"use client";
import React from "react";
import { mergeClassnames } from "../lib/utils";

interface ButtonProps {
  size?: "sm" | "lg";
  variant?: "primary" | "secondary" | "destructive" | "ghost" | "disabled";
  disabled?: boolean;
  children: React.ReactNode;
  props: React.ComponentProps<"button">;
}

const Button = ({
  size = "sm",
  variant = "primary",
  disabled = false,
  children,
  props,
}: ButtonProps) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  const sizeStyles = {
    sm: "px-6 py-2.5 text-sm h-10 min-w-[80px]",
    lg: "px-8 py-3 text-base h-12 min-w-[96px]",
  };

  const variantStyles = {
    primary:
      "bg-primary text-white hover:bg-primary/90 focus:ring-primary/50 shadow-sm",
    secondary:
      "bg-white text-primary border border-gray-700 hover:bg-gray-300 focus:ring-gray-500/50 shadow-sm",
    destructive:
      "bg-red-600 text-white hover:bg-red-400 focus:ring-red-500/50 shadow-sm",
    ghost:
      "bg-transparent text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-500/50",
    disabled:
      "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed",
  };

  const { className: propsClassName, ...restProps } = props;

  return (
    <button
      className={mergeClassnames(
        baseStyles,
        sizeStyles[size],
        variantStyles[variant],
        propsClassName
      )}
      {...restProps}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
