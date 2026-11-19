import React from "react";
import { Input, InputProps } from "./Input";
import { format } from "@react-input/number-format";
import { currencyOptions } from "~/utils/formatCurrency";

type Props = Omit<InputProps, "onChange" | "value"> & {
  onChange?: (value: number) => void;
  value: number;
};

const onlyDigits = (text: string) => text.replace(/\D/g, "");

// Kazalec postavi za `digits` števk; ločila tisočic in znak € preskoči.
function placeCaretAfterDigits(input: HTMLInputElement, digits: number) {
  let position = 0;
  for (let seen = 0; position < input.value.length && seen < digits; position++) {
    if (/\d/.test(input.value[position])) seen++;
  }
  input.setSelectionRange(position, position);
}

/*
  Znesek v celih evrih, ki se oblikuje že med tipkanjem (75.000 €).

  Ne uporabljamo `useNumberFormat` iz @react-input/number-format: ta pritisk
  tipke zavrne, če pride, preden se izvede njegov `setTimeout`. Na strani, ki
  ob vsakem vnosu veliko računa, se tako pri hitrem tipkanju števke izgubijo
  (»75000« postane »700 €«). Tu vrednost vedno preberemo iz polja, zato se
  noben pritisk ne izgubi.
*/
export default function CurrencyInput({ onChange, value, ...props }: Props) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.currentTarget;
    const caret = input.selectionStart ?? input.value.length;
    const digitsBeforeCaret = onlyDigits(input.value.slice(0, caret)).length;

    onChange?.(Number(onlyDigits(input.value)));

    // React polje v istem dogodku nastavi na oblikovano vrednost in kazalec
    // premakne na konec; vrnemo ga za isto števko.
    queueMicrotask(() => {
      if (document.activeElement === input) {
        placeCaretAfterDigits(input, digitsBeforeCaret);
      }
    });
  };

  return (
    <Input
      inputMode="numeric"
      onChange={handleChange}
      value={value ? format(value, currencyOptions) : ""}
      {...props}
    />
  );
}
