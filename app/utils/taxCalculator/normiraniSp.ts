import { SharedInputs, YearSettings } from "~/constants/types";
import { getRealniPrispevek } from "../prispevki";
import izracunDohodnine from "../dohodnina";
import { getDelez } from "./getDelez";

// Normirani odhodki: odstotek prihodkov, a le do normiranOdhodkiMaxPrihodki
// (prvi odstavek 59. člena ZDoh-2: 80 % do 60.000 €, torej največ 48.000 €)
export function getNormiraniExpenses(
  revenue: number,
  normiranSPAcceptedExpenses: number,
  // Podaj currentSettings.normiranOdhodkiMaxPrihodki; privzeta vrednost
  // velja za leti 2025 in 2026
  normiranOdhodkiMaxPrihodki = 60_000
) {
  const normiraniMaxExpenses =
    normiranOdhodkiMaxPrihodki * (normiranSPAcceptedExpenses / 100);

  const expenses = Math.min(
    revenue * (normiranSPAcceptedExpenses / 100),
    normiraniMaxExpenses
  );
  return expenses;
}

/**
 * Ocena lanskih prispevkov normiranca pri enakih prihodkih iz leta v leto.
 * Zavarovalna osnova se določi iz lanskega dobička, ki mu normiranec prišteje
 * lanske prispevke (3. člen Pravilnika o določanju zavarovalne osnove,
 * https://pisrs.si/pregledPredpisa?id=PRAV11769), zato iščemo stalno stanje:
 * začnemo pri najnižjih prispevkih in ponavljamo, dokler se znesek ne ustali
 * (vsak korak zmanjša razliko za približno 70 %).
 */
export function getNormiraniLanskiPrispevki(
  // Prihodki in normirani odhodki (getNormiraniExpenses)
  normiraniInputs: SharedInputs,
  currentSettings: YearSettings
) {
  const { prispevki: najnizjiPrispevki } = getRealniPrispevek(
    0,
    { revenue: 0, expenses: 0, salaryGross1: 0 },
    currentSettings
  );
  let prispevki = najnizjiPrispevki;
  for (let i = 0; i < 50; i++) {
    const { prispevki: naslednji } = getRealniPrispevek(
      prispevki,
      normiraniInputs,
      currentSettings,
      true
    );
    const razlika = Math.abs(naslednji - prispevki);
    prispevki = naslednji;
    if (razlika < 0.005) break;
  }
  return prispevki;
}

export function getNormiraniSPData(
  sharedInputs: SharedInputs,
  currentSettings: YearSettings
) {
  const expenses = getNormiraniExpenses(
    sharedInputs.revenue,
    currentSettings.normiranSPAcceptedExpenses,
    currentSettings.normiranOdhodkiMaxPrihodki
  );
  const normiraniInputs = {
    revenue: sharedInputs.revenue,
    // Pri normirancu so normirani odhodki priznani kot odhodki
    expenses,
    salaryGross1: sharedInputs.salaryGross1,
  };

  const lanskiPrispevkiGuess = getNormiraniLanskiPrispevki(
    normiraniInputs,
    currentSettings
  );

  const lanskiPrispevki =
    sharedInputs.lanskiPrispevki && !isNaN(sharedInputs.lanskiPrispevki)
      ? sharedInputs.lanskiPrispevki
      : lanskiPrispevkiGuess;

  const { prispevki, prispevkiRate, zavarovalnaOsnova, dobicek } =
    getRealniPrispevek(lanskiPrispevki, normiraniInputs, currentSettings, true);

  const taxBase = sharedInputs.revenue - expenses;

  // Progressive tax calculation using brackets (2026+: 20% up to 72k, 35% above)
  const { total: normiraniTax } = izracunDohodnine(
    taxBase,
    currentSettings.normiranTaxBrackets
  );

  const totalTax = normiraniTax + prispevki;
  const effectiveTaxRate = getDelez(totalTax, sharedInputs.revenue);
  const totalNet = sharedInputs.revenue - normiraniTax - prispevki;
  const cistiPrihodki = totalNet - sharedInputs.expenses;
  const cistiPrihodkiRate = getDelez(cistiPrihodki, sharedInputs.revenue);
  const expenseRate = getDelez(expenses, sharedInputs.revenue);

  return {
    cistiPrihodki,
    effectiveTaxRate,
    totalTax,
    totalNet,
    normiraniTax,
    taxBase,
    prispevki,
    lanskiPrispevki,
    zavarovalnaOsnova,
    dobicek,
    prispevkiRate,
    cistiPrihodkiRate,
    expenseRate,
    expenses,
  };
}
