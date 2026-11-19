import { SharedInputs, YearSettings } from "~/constants/types";
import { getMinimalnaOsnova, getRealniPrispevek } from "../prispevki";
import izracunDohodnine, { getTaxRelief, getOlajsavaVzdrzevaniClani, getPDPZOlajsava } from "../dohodnina";
import { getDelez } from "./getDelez";

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

  const { prispevki, prispevkiRate, zavarovalnaOsnova, dobicek, pizPrispevki } =
    getRealniPrispevek(lanskiPrispevki, sharedInputs, currentSettings);

  // Za dodatno splošno olajšavo se kot dohodek iz dejavnosti šteje dobiček
  // brez obračunanih prispevkov (4. odstavek 111. člena ZDoh-2), ne prihodki
  // https://pisrs.si/pregledPredpisa?id=ZAKO4697
  const taxRelief = getTaxRelief(
    Math.max(0, sharedInputs.revenue - sharedInputs.expenses),
    currentSettings
  );
  const olajsavaVzdrzevani = getOlajsavaVzdrzevaniClani(currentSettings);
  const pdpzOlajsava = getPDPZOlajsava(currentSettings, pizPrispevki);

  // Davčna osnova ne more biti negativna
  const taxBase = Math.max(
    0,
    sharedInputs.revenue - prispevki - taxRelief - sharedInputs.expenses - olajsavaVzdrzevani - pdpzOlajsava
  );

  const { total: dohodnina, bracket } = izracunDohodnine(
    taxBase,
    incomeTaxBrackets
  );

  const totalTax = dohodnina + prispevki;
  const totalNet = sharedInputs.revenue - totalTax;
  const effectiveTaxRate = getDelez(totalTax, sharedInputs.revenue);
  const cistiPrihodki = totalNet - sharedInputs.expenses;
  const cistiPrihodkiRate = getDelez(cistiPrihodki, sharedInputs.revenue);
  const expenseRate = getDelez(sharedInputs.expenses, sharedInputs.revenue);

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
