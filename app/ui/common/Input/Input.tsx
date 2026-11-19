import { forwardRef, useId, type InputHTMLAttributes } from "react";
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
      id,
      ...props
    },
    ref
  ) => {
    const generatedId = useId();
    const inputId = id ?? generatedId;
    const labelId = `${inputId}-label`;
    const errorId = `${inputId}-error`;
    const descriptionId = `${inputId}-description`;
    const hasTextDescription = typeof description === "string";
    // Ime polja je samo napis (brez ikone in gumbov v ovoju `.input`)
    const labelledBy = label ? labelId : undefined;
    const describedBy =
      [error && errorId, hasTextDescription && descriptionId]
        .filter(Boolean)
        .join(" ") || undefined;

    return (
      <div className={twMerge("flex flex-col w-full", className)}>
        {label && (
          <Text
            as="label"
            variant="label"
            id={labelId}
            htmlFor={inputId}
            className="flex select-none items-center justify-between px-1 py-2"
          >
            {label}
          </Text>
        )}
        <label
          className={twMerge(
            "input flex items-center gap-2",
            error && "input-error",
            labelClassName
          )}
        >
          {icon}
          <input
            ref={ref}
            id={inputId}
            aria-labelledby={labelledBy}
            aria-describedby={describedBy}
            aria-invalid={error ? true : undefined}
            className={twMerge("grow", inputClassName)}
            {...props}
          />
          {suffix}
        </label>
        {error && (
          <Text id={errorId} variant="error" className="mt-1">
            {error}
          </Text>
        )}
        {hasTextDescription && (
          <Text id={descriptionId} variant="caption" className="mt-1">
            {description}
          </Text>
        )}
        {!!description && typeof description === "object" && description}
      </div>
    );
  }
);

Input.displayName = "Input";
