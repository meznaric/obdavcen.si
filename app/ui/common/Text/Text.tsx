import { twMerge } from "tailwind-merge";
import { createElement, type HTMLAttributes, type ReactNode } from "react";

type TextVariant =
  | "h1"
  | "h2"
  | "h3"
  | "body"
  | "bodyLarge"
  | "bodySmall"
  | "caption"
  | "label"
  | "error"
  | "link";

interface TextProps extends HTMLAttributes<HTMLElement> {
  variant?: TextVariant;
  children: ReactNode;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
  // Za `as="label"`
  htmlFor?: string;
}

const variantClasses: Record<TextVariant, string> = {
  h1: "text-4xl font-bold tracking-tight",
  h2: "text-3xl font-semibold tracking-tight",
  h3: "text-2xl font-semibold",
  body: "text-base",
  bodyLarge: "text-lg",
  bodySmall: "text-sm",
  caption: "text-sm text-muted",
  label: "text-sm font-medium",
  error: "text-sm text-error",
  link: "text-primary hover:underline cursor-pointer",
};

const variantElements: Record<TextVariant, keyof React.JSX.IntrinsicElements> = {
  h1: "h1",
  h2: "h2",
  h3: "h3",
  body: "p",
  bodyLarge: "p",
  bodySmall: "p",
  caption: "span",
  label: "label",
  error: "span",
  link: "a",
};

export function Text({
  variant = "body",
  children,
  className,
  as,
  ...props
}: TextProps) {
  return createElement(
    as || variantElements[variant],
    { className: twMerge(variantClasses[variant], className), ...props },
    children
  );
}
