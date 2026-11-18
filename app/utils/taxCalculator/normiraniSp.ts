import { SharedInputs, YearSettings } from "~/constants/types";
import { getMinimalnaOsnova, getRealniPrispevek } from "../prispevki";
import izracunDohodnine from "../dohodnina";

export function getNormiraniExpenses(
  revenue: number,
  normiranSPAcceptedExpenses: number
) {
  const normiraniMaxExpenses = 60_000 * (normiranSPAcceptedExpenses / 100);

  const expenses = Math.min(
    revenue * (normiranSPAcceptedExpenses / 100),
    normiraniMaxExpenses
  );
  return expenses;
}

export function getNormiraniSPData(
  sharedInputs: SharedInputs,
  currentSettings: YearSettings
) {
  const expenses = getNormiraniExpenses(
    sharedInputs.revenue,
    currentSettings.normiranSPAcceptedExpenses
  );

  const { prispevki: lanskiPrispevkiGuess } = getRealniPrispevek(
    getMinimalnaOsnova(currentSettings.averageIncomeLastYear, currentSettings.spZavarovanecClen),
    {
      revenue: sharedInputs.revenue,
      // Pri normirancu je 80% dohodkov priznanih kot odhodki
      expenses,
      salaryGross1: sharedInputs.salaryGross1,
    },
    currentSettings
  );

  const lanskiPrispevki =
    sharedInputs.lanskiPrispevki && !isNaN(sharedInputs.lanskiPrispevki)
      ? sharedInputs.lanskiPrispevki
      : lanskiPrispevkiGuess;

  // We simulate 2 years of prispevki to get the most accurate result
  // 1st year you were paying minimal
  // 2nd year prispevki are more realistic
  const { prispevki, prispevkiRate, zavarovalnaOsnova, dobicek } =
    getRealniPrispevek(
      lanskiPrispevki,
      {
        revenue: sharedInputs.revenue,
        // Pri normirancu je 80% dohodkov priznanih kot odhodki
        expenses,
        // This doesn't actually matter in this scenario
        salaryGross1: sharedInputs.salaryGross1,
      },
      currentSettings
    );

  const taxBase = sharedInputs.revenue - expenses;

  // Progressive tax calculation using brackets (2026+: 20% up to 72k, 35% above)
  const { total: normiraniTax } = izracunDohodnine(
    taxBase,
    currentSettings.normiranTaxBrackets
  );

  const totalTax = normiraniTax + prispevki;
  const effectiveTaxRate = (normiraniTax + prispevki) / sharedInputs.revenue;
  const totalNet = sharedInputs.revenue - normiraniTax - prispevki;
  const cistiPrihodki = totalNet - sharedInputs.expenses;
  const cistiPrihodkiRate = cistiPrihodki / sharedInputs.revenue;
  const expenseRate = expenses / sharedInputs.revenue;

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
