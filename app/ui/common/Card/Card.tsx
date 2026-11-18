import { forwardRef, type ReactNode } from "react";
import { twMerge } from "tailwind-merge";

interface CardProps {
  children: ReactNode;
  className?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(
  ({ children, className }, ref) => {
    return (
      <div
        ref={ref}
        className={twMerge(
          "card bg-base-100 shadow-xl overflow-hidden rounded-md",
          className
        )}
      >
        {children}
      </div>
    );
  }
);

Card.displayName = "Card";
