import { NumberFormatOptions } from "@react-input/number-format";

export const currencyOptions: NumberFormatOptions & {
  locales?: Intl.LocalesArgument;
} = {
  locales: "sl-SI",
  format: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
};

export default function formatCurrency(value: number, short = false) {
  return value.toLocaleString("sl-SI", {
    style: "currency",
    currency: "EUR",
    minimumFractionDigits: short ? 0 : 2,
    maximumFractionDigits: short ? 0 : 2,
    // sl-SI privzeto ne loči štirimestnih števil (9721 €), na strani pišemo 9.721 €
    useGrouping: "always",
  });
}

export function parseCurrency(value: string) {
  return parseFloat(value.replace(/[^0-9,-]+/g, "").replace(",", "."));
}
