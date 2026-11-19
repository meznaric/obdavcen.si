import { useId, type InputHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";
import { Text } from "../Text/Text";

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  className?: string;
}

export function Slider({ label, className, id, ...props }: SliderProps) {
  const generatedId = useId();
  const inputId = id ?? generatedId;

  return (
    <div className="flex flex-col w-full">
      {label && (
        <Text
          as="label"
          variant="label"
          htmlFor={inputId}
          className="flex select-none items-center justify-between px-1 py-2"
        >
          {label}
        </Text>
      )}
      <input
        type="range"
        id={inputId}
        className={twMerge("range", className)}
        {...props}
      />
      {props.min && props.max && (
        <div className="w-full flex justify-between text-xs px-2">
          <span>{props.min}</span>
          <span>{props.max}</span>
        </div>
      )}
    </div>
  );
}
