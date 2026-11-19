// Primerjave med oblikami, izračunane s kalkulatorji (za članke), da
// številke v besedilu ne zastarajo.
// Vse primerjave uporabljajo »Ostane ti«: prihodki − davki in prispevki − stroški.
import type { YearSettings } from "~/constants/types";
import { getDOOMinimalnaPlacaData } from "./taxCalculator/dooMinimalnaPlaca";
import { getDOONajvecjaPlacaData } from "./taxCalculator/dooNajvecjaPlaca";
import { getNormiraniSPData } from "./taxCalculator/normiraniSp";
import { getSPData } from "./taxCalculator/sp";

type Kalkulator = (
  inputs: { revenue: number; expenses: number; salaryGross1: number },
  settings: YearSettings
) => { cistiPrihodki: number };

function getNeto(
  kalkulator: Kalkulator,
  revenue: number,
  expenses: number,
  settings: YearSettings
) {
  return kalkulator({ revenue, expenses, salaryGross1: 0 }, settings)
    .cistiPrihodki;
}

export function getNetoSP(revenue: number, expenses: number, settings: YearSettings) {
  return getNeto(getSPData, revenue, expenses, settings);
}

export function getNetoNormiraniSP(
  revenue: number,
  expenses: number,
  settings: YearSettings
) {
  return getNeto(getNormiraniSPData, revenue, expenses, settings);
}

export function getNetoDOOMinimalnaPlaca(
  revenue: number,
  expenses: number,
  settings: YearSettings
) {
  return getNeto(getDOOMinimalnaPlacaData, revenue, expenses, settings);
}

export function getNetoDOONajvecjaPlaca(
  revenue: number,
  expenses: number,
  settings: YearSettings
) {
  return getNeto(getDOONajvecjaPlacaData, revenue, expenses, settings);
}

// Boljša od obeh strategij d. o. o.
export function getNetoDOO(revenue: number, expenses: number, settings: YearSettings) {
  return Math.max(
    getNetoDOOMinimalnaPlaca(revenue, expenses, settings),
    getNetoDOONajvecjaPlaca(revenue, expenses, settings)
  );
}

// Najboljša oblika, ki ni normirani s. p. (s. p. ali d. o. o.)
export function getNetoBrezNormiranca(
  revenue: number,
  expenses: number,
  settings: YearSettings
) {
  return Math.max(
    getNetoSP(revenue, expenses, settings),
    getNetoDOO(revenue, expenses, settings)
  );
}

// Bisekcija za naraščajočo funkcijo: najmanjši x v [od, do], pri katerem je
// pogoj izpolnjen (null, če ni izpolnjen niti pri `do`)
function najmanjsiX(
  pogoj: (x: number) => boolean,
  od: number,
  do_: number,
  natancnost: number
) {
  if (!pogoj(do_)) return null;
  if (pogoj(od)) return od;
  let spodaj = od;
  let zgoraj = do_;
  while (zgoraj - spodaj > natancnost) {
    const sredina = (spodaj + zgoraj) / 2;
    if (pogoj(sredina)) zgoraj = sredina;
    else spodaj = sredina;
  }
  return zgoraj;
}

const zaokrozi = (znesek: number, na: number) => Math.round(znesek / na) * na;

/**
 * Mrtva cona: koliko prihodkov potrebuješ s s. p. ali d. o. o., da ti ostane
 * vsaj toliko kot normirancu s prihodki `prihodkiNormiranca` (privzeto meja za
 * normirance). Stroški so pri obeh enaki. Zaokroženo na 500 €.
 */
export function getMrtvaCona(
  settings: YearSettings,
  expenses = 0,
  prihodkiNormiranca = settings.normiranMaxRevenue
) {
  const cilj = getNetoNormiraniSP(prihodkiNormiranca, expenses, settings);
  const prihodki = najmanjsiX(
    (revenue) => getNetoBrezNormiranca(revenue, expenses, settings) >= cilj,
    expenses,
    10 * prihodkiNormiranca,
    10
  );
  return prihodki === null ? null : zaokrozi(prihodki, 500);
}

/**
 * Pri kolikšnih stroških mrtva cona izgine: s. p. ali d. o. o. z enakimi
 * prihodki (meja za normirance) in stroški ti prinese vsaj toliko kot
 * normirani s. p. Zaokroženo na 500 €.
 */
export function getMrtvaConaKonec(settings: YearSettings) {
  const prihodki = settings.normiranMaxRevenue;
  const stroski = najmanjsiX(
    (expenses) =>
      getNetoBrezNormiranca(prihodki, expenses, settings) >=
      getNetoNormiraniSP(prihodki, expenses, settings),
    0,
    prihodki,
    10
  );
  return stroski === null ? null : zaokrozi(stroski, 500);
}

/**
 * Delež stroškov (v odstotkih prihodkov), nad katerim je d. o. o. pri danih
 * prihodkih boljši od normiranega s. p. (null, če ni nikoli do 90 %).
 */
export function getDelezStroskovDOOBoljsi(revenue: number, settings: YearSettings) {
  const delez = najmanjsiX(
    (d) =>
      getNetoDOO(revenue, revenue * d, settings) >
      getNetoNormiraniSP(revenue, revenue * d, settings),
    0,
    0.9,
    0.001
  );
  return delez === null ? null : Math.round(delez * 100);
}

/**
 * Razpon prihodkov, v katerem je s. p. pri danih stroških slabši od obeh
 * strategij d. o. o. Pregled po 500 €; vrne prvi tak razpon.
 */
export function getSPSlabsiOdObehDOO(
  settings: YearSettings,
  expenses = 0,
  doPrihodkov = 400_000
) {
  let od: number | null = null;
  for (let revenue = expenses + 500; revenue <= doPrihodkov; revenue += 500) {
    const sp = getNetoSP(revenue, expenses, settings);
    const slabsi =
      sp < getNetoDOOMinimalnaPlaca(revenue, expenses, settings) &&
      sp < getNetoDOONajvecjaPlaca(revenue, expenses, settings);
    if (slabsi && od === null) od = revenue;
    if (!slabsi && od !== null) return { od, do: revenue - 500 };
  }
  return od === null ? null : { od, do: doPrihodkov };
}
