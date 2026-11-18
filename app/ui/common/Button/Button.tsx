import { twMerge } from "tailwind-merge";
import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?:
    | "primary"
    | "secondary"
    | "outline"
    | "neutral"
    | "accent"
    | "ghost"
    | "success"
    | "info"
    | "warning"
    | "error";
  size?: "xs" | "sm" | "md" | "lg";
}

export function Button({
  variant = "primary",
  size = "md",
  className,
  children,
  ...props
}: ButtonProps) {
  const baseClasses = "btn";
  const variantClasses = {
    primary: "btn-primary",
    secondary: "btn-secondary",
    outline: "btn-outline",
    neutral: "btn-neutral",
    accent: "btn-accent",
    ghost: "btn-ghost",
    success: "btn-success",
    info: "btn-info",
    warning: "btn-warning",
    error: "btn-error",
  };
  const sizeClasses = {
    xs: "btn-xs",
    sm: "btn-sm",
    md: "",
    lg: "btn-lg",
  };

  return (
    <button
      className={twMerge(
        baseClasses,
        variantClasses[variant],
        sizeClasses[size],
        className
      )}
      {...props}
    >
      {children}
    </button>
  );
}
