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
  return (
    <button
      role="switch"
      aria-checked={value}
      aria-label={label}
      className={twMerge(
        "group flex items-center gap-2 p-2 rounded-lg hover:bg-gray-200 focus:outline-none focus:bg-gray-200 transition-colors dark:hover:bg-gray-800 dark:focus:bg-gray-800",
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
        <ToggleOnIcon className="w-8 h-8 text-accent transition-colors group-hover:text-accent/90 shrink-0" />
      ) : (
        <ToggleOffIcon className="w-8 h-8 transition-colors group-hover:text-gray-700 shrink-0" />
      )}
      <div
        className={twMerge(
          "text-left",
          value ? "text-accent" : "text-gray-700"
        )}
      >
        <Text variant="bodyLarge" className="font-medium">
          {label}
        </Text>
        {description && (
          <Text variant="bodySmall" className="text-gray-500">
            {description}
          </Text>
        )}
      </div>
    </button>
  );
}
