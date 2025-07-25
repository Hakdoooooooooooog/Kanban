"use client";

import React from "react";

interface ButtonProps {
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "secondary" | "destructive" | "ghost" | "disabled";
  className?: string;
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
}

const Button = ({
  size = "md",
  variant = "primary",
  className = "",
  children,
  onClick,
  disabled = false,
}: ButtonProps) => {
  const baseStyles =
    "inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50";

  const sizeStyles = {
    sm: "px-3 py-1.5 text-xs h-8 min-w-[64px]",
    md: "px-6 py-2.5 text-sm h-10 min-w-[80px]",
    lg: "px-8 py-3 text-base h-12 min-w-[96px]",
  };

  const variantStyles = {
    primary:
      "bg-primary text-white hover:bg-primary/90 focus:ring-primary/50 shadow-sm",
    secondary:
      "bg-secondary text-white hover:bg-secondary/90 focus:ring-secondary/50 shadow-sm",
    destructive:
      "bg-red-500 text-white hover:bg-red-600 focus:ring-red-500/50 shadow-sm",
    ghost:
      "bg-transparent text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800 focus:ring-gray-500/50",
    disabled:
      "bg-gray-200 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed",
  };

  return (
    <button
      className={`${baseStyles} ${sizeStyles[size]} ${
        disabled ? variantStyles.disabled : variantStyles[variant]
      } ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {children}
    </button>
  );
};

export default Button;
