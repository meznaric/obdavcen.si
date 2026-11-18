import { forwardRef, type InputHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";
import { Text } from "../Text/Text";

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  description?: React.ReactNode;
  inputClassName?: string;
  className?: string;
  labelClassName?: string;
  icon?: React.ReactNode;
  suffix?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      error,
      className,
      labelClassName,
      inputClassName,
      icon,
      suffix,
      description,
      ...props
    },
    ref
  ) => {
    return (
      <div className={twMerge("form-control w-full", className)}>
        {label && (
          <Text as="label" variant="label" className="label">
            {label}
          </Text>
        )}
        <label
          className={twMerge(
            "input flex items-center input-bordered gap-2",
            labelClassName
          )}
        >
          {icon}
          <input
            ref={ref}
            className={twMerge("grow", error && "input-error", inputClassName)}
            {...props}
          />
          {suffix}
        </label>
        {error && (
          <Text variant="error" className="mt-1">
            {error}
          </Text>
        )}
        {typeof description === "string" && (
          <Text variant="caption" className="mt-1">
            {description}
          </Text>
        )}
        {!!description && typeof description === "object" && description}
      </div>
    );
  }
);

Input.displayName = "Input";
