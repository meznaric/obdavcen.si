import { useId } from "react";
import { ToggleOffIcon, ToggleOnIcon } from "hugeicons-react";
import { Text } from "../Text/Text";
import { twMerge } from "tailwind-merge";

interface ToggleOptionProps {
  label: string;
  description?: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  className?: string;
}

export function ToggleOption({
  className,
  label,
  description,
  value,
  onValueChange,
}: ToggleOptionProps) {
  const descriptionId = useId();

  return (
    <button
      role="switch"
      aria-checked={value}
      aria-label={label}
      aria-describedby={description ? descriptionId : undefined}
      className={twMerge(
        "group flex items-center gap-2 p-2 rounded-lg transition-colors hover:bg-base-200 focus-visible:bg-base-200",
        className
      )}
      onClick={() => onValueChange(!value)}
      onKeyDown={(e) => {
        if (e.key === " " || e.key === "Enter") {
          e.preventDefault();
          onValueChange(!value);
        }
      }}
    >
      {value ? (
        <ToggleOnIcon className="w-8 h-8 text-accent shrink-0" />
      ) : (
        <ToggleOffIcon className="w-8 h-8 shrink-0" />
      )}
      <div className={twMerge("text-left", value && "text-accent")}>
        <Text variant="bodyLarge" className="font-medium">
          {label}
        </Text>
        {description && (
          <Text id={descriptionId} variant="bodySmall" className="text-muted">
            {description}
          </Text>
        )}
      </div>
    </button>
  );
}
