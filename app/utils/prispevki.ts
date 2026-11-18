import {
  PrispevkiSettings,
  SharedInputs,
  YearSettings,
} from "~/constants/types";

export function getZavarovanecRate(p: PrispevkiSettings) {
  return (
    p.zavarovanecPIZrate +
    p.zavarovanecZZZSrate +
    p.zavarovanecStarsevsko +
    p.zavarovanecBrezposelnost +
    p.zavarovanecDOrate
  );
}

export function getDelodajalecRate(p: PrispevkiSettings) {
  return (
    p.delodajalecPIZrate +
    p.delodajalecZZZSrate +
    p.delodajalecStarsevsko +
    p.delodajalecBrezposelnost +
    p.delodajalecPoskodbe +
    p.delodajalecDOrate
  );
}

export function getPrispevkiRate(prispevki: PrispevkiSettings) {
  return getZavarovanecRate(prispevki) + getDelodajalecRate(prispevki);
}

interface ZavarovalnaOsnovaInput {
  dobicek: number; // Profit of the insured
  averageIncomeLastYear: number; // Average annual salary in Slovenia
  /**
   * 15 = Samozaposlen
   * 16 = Druzbenik
   * 17 = Kmet
   */
  zavarovanecClen?: 15 | 16 | 17; // Article number from ZPIZ-2
}

export function getMinimalnaOsnova(
  averageIncomeLastYear: number,
  zavarovanecClen: 15 | 16 | 17 | undefined = 15
) {
  return averageIncomeLastYear * (zavarovanecClen === 16 ? 0.9 : 0.6);
}

/**
 *
 * Implementirano po https://zakonodaja.com/pravilnik/zpiz-2-pdzo/2-clen-zavarovalna-osnova
 */
export function getZavarovalnaOsnova(input: ZavarovalnaOsnovaInput): number {
  const { dobicek, averageIncomeLastYear, zavarovanecClen = 15 } = input;

  let osnova = dobicek / 12;

  if (zavarovanecClen === 15 || zavarovanecClen === 17) {
    osnova *= 0.75;
  }

  const minimalnaOsnova = getMinimalnaOsnova(
    averageIncomeLastYear,
    zavarovanecClen
  );

  const maksimalnaOsnova = averageIncomeLastYear * 3.5;

  // Ensure osnova is within minimum and maximum bounds
  if (osnova < minimalnaOsnova) {
    osnova = minimalnaOsnova;
  } else if (osnova > maksimalnaOsnova) {
    osnova = maksimalnaOsnova;
  }

  return osnova * 12;
}

type DobicekInputs = {
  revenue: number; // davčno priznani prihodki
  expenses: number; // odhodki
  lastYearPrispevki: number; // obračunani prispevki lansko leto
};

/**
 *
 * Implementirano po: https://zakonodaja.com/pravilnik/zpiz-2-pdzo/3-clen-dolocitev-dobicka-za-zavarovanca-iz-15-clena-zpiz-2
 */
export function getDobicek(inputs: DobicekInputs): number {
  const { revenue, expenses, lastYearPrispevki } = inputs;

  // 1. Calculate the profit based on paragraph (2)
  const razlika = revenue - expenses;
  let dobicek = razlika;

  // 2. Apply paragraph (3) - if profit difference is less than or equal to zero, use contributions as profit
  if (razlika <= 0) {
    dobicek = lastYearPrispevki;
  }

  return dobicek;
}

export function getRealniPrispevek(
  lanskiPrispevki: number,
  sharedInputs: SharedInputs,
  currentSettings: YearSettings
) {
  const dobicek = getDobicek({
    lastYearPrispevki: lanskiPrispevki,
    expenses: sharedInputs.expenses,
    revenue: sharedInputs.revenue,
  });

  const zavarovanecClen = currentSettings.spZavarovanecClen ?? 15;

  const zavarovalnaOsnova = getZavarovalnaOsnova({
    dobicek,
    averageIncomeLastYear: currentSettings.averageIncomeLastYear,
    zavarovanecClen,
  });

  // Znižani PIZ prispevki za novo registrirane S.P. (ZPIZ-2, člen 145, odstavek 14)
  const znizanje = currentSettings.spZnizaniPrispevki;
  const pizMultiplier = znizanje === 'prvo' ? 0.5 : znizanje === 'drugo' ? 0.7 : 1;

  const effectiveSettings: PrispevkiSettings = pizMultiplier < 1
    ? {
        ...currentSettings,
        zavarovanecPIZrate: currentSettings.zavarovanecPIZrate * pizMultiplier,
        delodajalecPIZrate: currentSettings.delodajalecPIZrate * pizMultiplier,
      }
    : currentSettings;

  const prispevkiRate = getPrispevkiRate(effectiveSettings);
  const prispevki =
    zavarovalnaOsnova * prispevkiRate + currentSettings.zavarovanecOZPEur * 12;
  return { prispevki, prispevkiRate, zavarovalnaOsnova, dobicek };
}
