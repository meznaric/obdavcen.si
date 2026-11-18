import { type InputHTMLAttributes } from "react";
import { twMerge } from "tailwind-merge";
import { Text } from "../Text/Text";

interface SliderProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  className?: string;
}

export function Slider({ label, className, ...props }: SliderProps) {
  return (
    <div className="form-control w-full">
      {label && (
        <Text as="label" variant="label" className="label">
          {label}
        </Text>
      )}
      <input
        type="range"
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
