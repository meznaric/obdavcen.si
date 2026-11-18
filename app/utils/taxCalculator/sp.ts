import { SharedInputs, YearSettings } from "~/constants/types";
import { getMinimalnaOsnova, getRealniPrispevek } from "../prispevki";
import izracunDohodnine, { getTaxRelief, getOlajsavaVzdrzevaniClani, getPDPZOlajsava } from "../dohodnina";

export function getSPData(
  sharedInputs: SharedInputs,
  currentSettings: YearSettings
) {
  const { incomeTaxBrackets, averageIncomeLastYear } = currentSettings;

  // We simulate 2 years of prispevki to get the most accurate result
  // 1st year you were paying minimal
  // 2nd year prispevki are more realistic
  const { prispevki: lanskiPrispevkiGuess } = getRealniPrispevek(
    getMinimalnaOsnova(averageIncomeLastYear, currentSettings.spZavarovanecClen),
    sharedInputs,
    currentSettings
  );

  const lanskiPrispevki =
    sharedInputs.lanskiPrispevki && !isNaN(sharedInputs.lanskiPrispevki)
      ? sharedInputs.lanskiPrispevki
      : lanskiPrispevkiGuess;

  const { prispevki, prispevkiRate, zavarovalnaOsnova, dobicek } =
    getRealniPrispevek(lanskiPrispevki, sharedInputs, currentSettings);

  const taxRelief = getTaxRelief(sharedInputs.revenue, currentSettings);
  const olajsavaVzdrzevani = getOlajsavaVzdrzevaniClani(currentSettings);
  const pdpzOlajsava = getPDPZOlajsava(currentSettings);

  const taxBase =
    sharedInputs.revenue - prispevki - taxRelief - sharedInputs.expenses - olajsavaVzdrzevani - pdpzOlajsava;

  const { total: dohodnina, bracket } = izracunDohodnine(
    taxBase,
    incomeTaxBrackets
  );

  const totalTax = dohodnina + prispevki;
  const totalNet = sharedInputs.revenue - totalTax;
  const effectiveTaxRate = totalTax / sharedInputs.revenue;
  const cistiPrihodki = totalNet - sharedInputs.expenses;
  const cistiPrihodkiRate = cistiPrihodki / sharedInputs.revenue;
  const expenseRate = sharedInputs.expenses / sharedInputs.revenue;

  return {
    cistiPrihodki,
    cistiPrihodkiRate,
    effectiveTaxRate,
    expenseRate,
    totalTax,
    dohodnina,
    totalNet,
    prispevki,
    lanskiPrispevki,
    zavarovalnaOsnova,
    dobicek,
    bracket,
    taxBase,
    prispevkiRate,
    taxRelief,
    olajsavaVzdrzevani,
    pdpzOlajsava,
  };
}
