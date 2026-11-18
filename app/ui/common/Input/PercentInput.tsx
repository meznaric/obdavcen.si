import React from "react";
import { Input, InputProps } from "./Input";
import {
  NumberFormatOptions,
  format,
  unformat,
  useNumberFormat,
} from "@react-input/number-format";

type Props = Omit<InputProps, "onChange"> & {
  onChange?: (value: number) => void;
  value: number;
};

const defaultOptions: NumberFormatOptions = {
  format: "percent",
  maximumFractionDigits: 2,
  minimumFractionDigits: 1,
};

export default function PercentInput({ onChange, value, ...props }: Props) {
  const ref = useNumberFormat(defaultOptions);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = Number(unformat(e.target.value, "sl-SI"));
    onChange?.(newVal);
  };
  return (
    <Input
      type="text"
      ref={ref}
      onChange={handleChange}
      value={format(value, defaultOptions)}
      {...props}
    />
  );
}
