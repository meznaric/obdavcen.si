import { IncomeTaxBrackets, YearSettings } from "~/constants/types";

export default function izracunDohodnine(
  taxBase: number,
  brackets: IncomeTaxBrackets
) {
  return brackets.reduce(
    (acc, curr) => {
      const { maxNumber, percentage } = curr;

      // No taxable income left
      if (acc.taxBaseLeft <= 0) {
        acc.bracket.push({
          percentage,
          maxNumber,
          toPay: 0,
        });
        return acc;
      }

      const taxableAmount = maxNumber
        ? Math.min(acc.taxBaseLeft, maxNumber - (acc.prevMaxNumber ?? 0))
        : acc.taxBaseLeft;

      const toPay = taxableAmount * percentage;

      acc.bracket.push({
        percentage,
        maxNumber,
        toPay,
      });

      acc.total += toPay;
      acc.taxBaseLeft -= taxableAmount;
      acc.prevMaxNumber = maxNumber;

      return acc;
    },
    {
      bracket: [] as (IncomeTaxBrackets[0] & { toPay: number })[],
      total: 0,
      taxBaseLeft: taxBase,
      prevMaxNumber: 0 as number | undefined,
    }
  );
}

export function getTaxRelief(bruto: number, currentSettings: YearSettings) {
  if (bruto > currentSettings.taxReliefThreshold) {
    return currentSettings.generalTaxRelief;
  }
  return (
    currentSettings.generalTaxRelief +
    (currentSettings.taxReliefFormulaConst - 1.17259 * bruto)
  );
}

// Posebna olajšava za vzdrževane družinske člane (114. člen ZDoh-2)
// Vsak otrok ima svojo višino olajšave (progresivno narašča)
export function getOlajsavaVzdrzevaniClani(currentSettings: YearSettings) {
  const steviloOtrok = currentSettings.steviloOtrok ?? 0;
  const { olajsavaZaOtroka, olajsavaZaDrugeClane } = currentSettings;

  let olajsavaOtroci = 0;
  for (let i = 0; i < steviloOtrok; i++) {
    if (i < olajsavaZaOtroka.length) {
      olajsavaOtroci += olajsavaZaOtroka[i];
    } else {
      // Za 6.+ otroka: zadnji znani + prirastek (razlika med 5. in 4.)
      const prirastek =
        olajsavaZaOtroka[olajsavaZaOtroka.length - 1] -
        olajsavaZaOtroka[olajsavaZaOtroka.length - 2];
      olajsavaOtroci +=
        olajsavaZaOtroka[olajsavaZaOtroka.length - 1] +
        prirastek * (i - olajsavaZaOtroka.length + 1);
    }
  }

  const olajsavaDrugiClani = currentSettings.vzdrzevaniDrugiClani
    ? olajsavaZaDrugeClane
    : 0;

  return olajsavaOtroci + olajsavaDrugiClani;
}

// Olajšava za prostovoljno dodatno pokojninsko zavarovanje (117. člen ZDoh-2)
// Za S.P.: zmanjša davčno osnovo za dohodnino
export function getPDPZOlajsava(currentSettings: YearSettings) {
  if (!currentSettings.pdpz) return 0;
  return currentSettings.pdpzZnesek ?? 0;
}
