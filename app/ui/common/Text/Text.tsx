import { twMerge } from "tailwind-merge";
import type { ReactNode } from "react";

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

interface TextProps {
  variant?: TextVariant;
  children: ReactNode;
  className?: string;
  as?: keyof JSX.IntrinsicElements;
}

const variantClasses: Record<TextVariant, string> = {
  h1: "text-4xl font-bold tracking-tight",
  h2: "text-3xl font-semibold tracking-tight",
  h3: "text-2xl font-semibold",
  body: "text-base",
  bodyLarge: "text-lg",
  bodySmall: "text-sm",
  caption: "text-sm text-gray-600",
  label: "text-sm font-medium",
  error: "text-sm text-error",
  link: "text-primary hover:underline cursor-pointer",
};

const variantElements: Record<TextVariant, keyof JSX.IntrinsicElements> = {
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

export function Text({ variant = "body", children, className, as }: TextProps) {
  const Element = as || variantElements[variant];
  
  return (
    <Element className={twMerge(variantClasses[variant], className)}>
      {children}
    </Element>
  );
}
