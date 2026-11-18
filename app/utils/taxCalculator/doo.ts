import { SharedInputs, YearSettings } from "~/constants/types";
import izracunDohodnine, { getTaxRelief, getOlajsavaVzdrzevaniClani, getPDPZOlajsava } from "../dohodnina";
import {
  getZavarovanecRate,
  getDelodajalecRate,
  getMinimalnaOsnova,
} from "../prispevki";

// Standardno 21 delovnih dni na mesec
const DELOVNI_DNEVI_NA_MESEC = 21;

export function getMalicaLetna(currentSettings: YearSettings) {
  if (currentSettings.malica === false) return 0;
  return currentSettings.malicaDnevniZnesek * DELOVNI_DNEVI_NA_MESEC * 12;
}

// Povračilo stroškov prevoza na delo in z dela
// Neobdavčeno do 0,21 €/km dejanske razdalje
// Vir: Uredba o višini povračil stroškov v zvezi z delom, 3. člen
export function getPrevozniStroskiLetni(currentSettings: YearSettings) {
  if (currentSettings.prevozniStroski !== true) return 0;
  return currentSettings.prevozniStroskiMesecniZnesek * 12;
}

// Regres za letni dopust — neobdavčen do 100% povprečne mesečne plače
// Vir: 44. člen ZDoh-2
export function getRegresLetni(currentSettings: YearSettings) {
  if (currentSettings.regres === false) return 0;
  return currentSettings.averageIncomeLastYear;
}

// Božičnica / Zimski regres — pol minimalne plače
export function getBozicnicaLetna(currentSettings: YearSettings) {
  if (currentSettings.bozicnica === false) return 0;
  return currentSettings.minimalnaPlaca / 2;
}

// Nagrada za poslovno uspešnost — max neobdavčeni znesek
export function getNagradaMax(currentSettings: YearSettings) {
  if (currentSettings.bozicnicaLocenOdNagrade) {
    return currentSettings.averageIncomeLastYear; // 2025: ločen limit
  }
  // 2026+: skupen limit z božičnico
  const bozicnica = getBozicnicaLetna(currentSettings);
  return Math.max(0, currentSettings.averageIncomeLastYear - bozicnica);
}

export function getNagradaLetna(currentSettings: YearSettings) {
  if (currentSettings.nagradaPoslovnaUspesnost === false) return 0;
  const znesek = currentSettings.nagradaZnesek ?? getNagradaMax(currentSettings);
  return Math.min(znesek, getNagradaMax(currentSettings));
}

export function getDOOData(
  sharedInputs: SharedInputs,
  currentSettings: YearSettings,
  salaryGross1: number
) {
  const { incomeTaxBrackets, zavarovanecOZPEur, averageIncomeLastYear } =
    currentSettings;

  // Za družbenika-poslovodjo (člen 16 ZPIZ-2) je minimalna osnova za
  // prispevke 90% povprečne plače, ne glede na dejansko bruto plačo.
  const isDruzbenikPoslovodja = currentSettings.dooDruzbenikPoslovodja !== false;
  const prispevkiBase = isDruzbenikPoslovodja
    ? Math.max(salaryGross1, getMinimalnaOsnova(averageIncomeLastYear, 16) * 12)
    : salaryGross1;

  const taxRelief = getTaxRelief(salaryGross1, currentSettings);
  const olajsavaVzdrzevani = getOlajsavaVzdrzevaniClani(currentSettings);
  const gross1Tax =
    prispevkiBase * getZavarovanecRate(currentSettings) + zavarovanecOZPEur * 12;
  const gross2Tax = prispevkiBase * getDelodajalecRate(currentSettings);
  const salaryGross2 = salaryGross1 + gross2Tax;

  const dohodninaBase = salaryGross1 - taxRelief - gross1Tax - olajsavaVzdrzevani;
  const { total: dohodnina, bracket } = izracunDohodnine(
    dohodninaBase,
    incomeTaxBrackets
  );

  // Povračila stroškov — stroški podjetja, ki zmanjšajo dobiček, a niso obdavčeni za prejemnika
  const malicaLetna = getMalicaLetna(currentSettings);
  const prevozniStroskiLetni = getPrevozniStroskiLetni(currentSettings);
  const regresLetni = getRegresLetni(currentSettings);
  // PDPZ kot strošek delodajalca — zmanjša dobiček, ni obdavčen za zaposlenca
  const pdpzLetni = getPDPZOlajsava(currentSettings);

  // Božičnica / Zimski regres
  const bozicnicaLetna = getBozicnicaLetna(currentSettings);
  const bozicnicaHasPrispevki = !currentSettings.bozicnicaOprostPrispevkov;
  const bozicnicaEmployeeContrib = bozicnicaHasPrispevki
    ? bozicnicaLetna * getZavarovanecRate(currentSettings)
    : 0;
  const bozicnicaEmployerContrib = bozicnicaHasPrispevki
    ? bozicnicaLetna * getDelodajalecRate(currentSettings)
    : 0;
  const bozicnicaCost = bozicnicaLetna + bozicnicaEmployerContrib;
  const bozicnicaNet = bozicnicaLetna - bozicnicaEmployeeContrib;

  // Nagrada za poslovno uspešnost — prispevki se vedno obračunajo
  const nagradaLetna = getNagradaLetna(currentSettings);
  const nagradaEmployeeContrib = nagradaLetna * getZavarovanecRate(currentSettings);
  const nagradaEmployerContrib = nagradaLetna * getDelodajalecRate(currentSettings);
  const nagradaCost = nagradaLetna + nagradaEmployerContrib;
  const nagradaNet = nagradaLetna - nagradaEmployeeContrib;

  const dobicek =
    sharedInputs.revenue - sharedInputs.expenses - salaryGross1 - gross2Tax
    - malicaLetna - prevozniStroskiLetni - regresLetni - pdpzLetni
    - bozicnicaCost - nagradaCost;

  const dobicekTax = Math.max(0, dobicek) * currentSettings.ddpoTaxRate;
  const dobicekNet = dobicek - dobicekTax;

  const dividendsTax = Math.max(0, dobicekNet) * currentSettings.dividendsTaxRate;
  const dividendsNet = dobicekNet - dividendsTax;

  const salaryNet = salaryGross1 - dohodnina - gross1Tax;

  // Povračila se prištejejo k čistim prihodkom (prejeta neobdavčeno)
  const totalNet = salaryNet + dividendsNet + malicaLetna + prevozniStroskiLetni + regresLetni + pdpzLetni
    + bozicnicaNet + nagradaNet;
  const totalPrispevki = gross1Tax + gross2Tax
    + bozicnicaEmployeeContrib + bozicnicaEmployerContrib
    + nagradaEmployeeContrib + nagradaEmployerContrib;

  const totalTax = dohodnina + totalPrispevki + dobicekTax + dividendsTax;
  const effectiveTaxRate = totalTax / sharedInputs.revenue;

  const cistiPrihodki = totalNet;
  const cistiPrihodkiRate = cistiPrihodki / sharedInputs.revenue;
  const expenseRate = sharedInputs.expenses / sharedInputs.revenue;

  return {
    cistiPrihodki,
    cistiPrihodkiRate,
    effectiveTaxRate,
    totalTax,
    dohodnina,
    dohodninaBase,
    salaryGross2,
    gross1Tax,
    gross2Tax,
    salaryNet,
    totalNet,
    totalPrispevki,
    bracket,
    expenseRate,
    dobicekTax,
    dividendsTax,
    dividendsNet,
    taxRelief,
    malicaLetna,
    prevozniStroskiLetni,
    regresLetni,
    pdpzLetni,
    olajsavaVzdrzevani,
    bozicnicaLetna,
    bozicnicaNet,
    bozicnicaEmployeeContrib,
    bozicnicaEmployerContrib,
    nagradaLetna,
    nagradaNet,
    nagradaEmployeeContrib,
    nagradaEmployerContrib,
  };
}
