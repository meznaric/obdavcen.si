import type {
  PrispevkiSettings,
  SharedInputs,
  YearSettings,
} from "~/constants/types";
import izracunDohodnine, { getTaxRelief, getOlajsavaVzdrzevaniClani, getPDPZOlajsava } from "../dohodnina";
import {
  getZavarovanecRate,
  getDelodajalecRate,
  getOsnovaZaPrispevkeIzPlace,
  getPovprecnaPlacaMesecno,
  getOZPLetno,
} from "../prispevki";
import { getDelez } from "./getDelez";

/**
 * Lastnik d. o. o. je poslovodja brez pogodbe o zaposlitvi (16. člen ZPIZ-2,
 * zavarovalna podlaga 040). Privzeto (ni nastavljeno) je lastnik v svoji
 * družbi zaposlen (14. člen, podlaga 001).
 * FURS, Plačevanje prispevkov za socialno varnost za zavarovance – družbenike:
 * https://www.fu.gov.si/fileadmin/Internet/Davki_in_druge_dajatve/Podrocja/Prispevki_za_socialno_varnost/Opis/Placevanje_prispevkov_za_socialno_varnost_za_zavarovance_-_druzbenike.doc
 */
export function isDruzbenikPoslovodja(currentSettings: YearSettings) {
  return currentSettings.dooDruzbenikPoslovodja === true;
}

// Stopnje prispevkov za lastnika d. o. o. Družbeniki – poslovodje od leta
// 2018 (ZUTD-D) niso več vključeni v zavarovanje za primer brezposelnosti.
export function getDOOPrispevkiSettings(
  currentSettings: YearSettings
): PrispevkiSettings {
  if (!isDruzbenikPoslovodja(currentSettings)) return currentSettings;
  return {
    ...currentSettings,
    zavarovanecBrezposelnost: 0,
    delodajalecBrezposelnost: 0,
  };
}

// Obvezni prispevki za PIZ (zavarovanec + delodajalec) od letne osnove —
// zgornja meja za neobdavčeno premijo PDPZ je 24 % tega zneska
export function getPIZPrispevkiDOO(
  letnaOsnova: number,
  currentSettings: YearSettings
) {
  return (
    letnaOsnova *
    (currentSettings.zavarovanecPIZrate + currentSettings.delodajalecPIZrate)
  );
}

// Standardno 21 delovnih dni na mesec
const DELOVNI_DNEVI_NA_MESEC = 21;

export function getMalicaLetna(currentSettings: YearSettings) {
  if (currentSettings.malica === false) return 0;
  return currentSettings.malicaDnevniZnesek * DELOVNI_DNEVI_NA_MESEC * 12;
}

// Povračilo stroškov prevoza na delo in z dela
// Neobdavčeno do 0,21 €/km dejanske razdalje, vsak mesec najmanj do 140 €
// Vir: Uredba o davčni obravnavi povračil stroškov in drugih dohodkov iz
// delovnega razmerja, 3. člen. Malica in prevoz sta neobdavčena tudi za
// poslovodjo brez pogodbe o zaposlitvi (FURS, Dohodek iz delovnega razmerja).
export function getPrevozniStroskiLetni(currentSettings: YearSettings) {
  if (currentSettings.prevozniStroski !== true) return 0;
  return currentSettings.prevozniStroskiMesecniZnesek * 12;
}

// Regres za letni dopust — neobdavčen do 100 % povprečne mesečne plače
// (44. člen ZDoh-2). Pravica delavca (131. člen ZDR-1), zato ga poslovodja
// brez pogodbe o zaposlitvi ne prejme.
// https://www.fu.gov.si/fileadmin/Internet/Davki_in_druge_dajatve/Podrocja/Dohodnina/Dohodek_iz_zaposlitve/Opis/Regres_za_letni_dopust.doc
export function getRegresLetni(currentSettings: YearSettings) {
  if (currentSettings.regres === false) return 0;
  if (isDruzbenikPoslovodja(currentSettings)) return 0;
  return currentSettings.regresZnesek ?? currentSettings.povprecnaPlacaDavcnoLeto;
}

// Božičnica / zimski regres — pol minimalne plače. Pravica delavca (ZPZR).
export function getBozicnicaLetna(currentSettings: YearSettings) {
  if (currentSettings.bozicnica === false) return 0;
  if (isDruzbenikPoslovodja(currentSettings)) return 0;
  return currentSettings.minimalnaPlaca / 2;
}

// Nagrada za poslovno uspešnost — max neobdavčeni znesek
export function getNagradaMax(currentSettings: YearSettings) {
  if (currentSettings.bozicnicaLocenOdNagrade) {
    return currentSettings.povprecnaPlacaDavcnoLeto; // 2025: ločen limit
  }
  // 2026+: skupen limit z božičnico
  const bozicnica = getBozicnicaLetna(currentSettings);
  return Math.max(0, currentSettings.povprecnaPlacaDavcnoLeto - bozicnica);
}

// Plačilo za poslovno uspešnost je neobdavčeno le, če ga prejmejo delavci
// (12. točka prvega odstavka 44. člena ZDoh-2)
// https://www.fu.gov.si/fileadmin/Internet/Davki_in_druge_dajatve/Podrocja/Dohodnina/Dohodek_iz_zaposlitve/Opis/Placilo_za_poslovno_uspesnost_za_izplacila_od_1_1_2023_dalje.doc
export function getNagradaLetna(currentSettings: YearSettings) {
  if (currentSettings.nagradaPoslovnaUspesnost === false) return 0;
  if (isDruzbenikPoslovodja(currentSettings)) return 0;
  const znesek = currentSettings.nagradaZnesek ?? getNagradaMax(currentSettings);
  return Math.min(znesek, getNagradaMax(currentSettings));
}

export function getDOOData(
  sharedInputs: SharedInputs,
  currentSettings: YearSettings,
  salaryGross1: number
) {
  const { incomeTaxBrackets } = currentSettings;

  // Za družbenika-poslovodjo (16. člen ZPIZ-2) je osnova za prispevke ves
  // prejemek za poslovodenje, najmanj 90 % in največ 3,5-kratnik povprečne
  // plače. Lastnik, zaposlen v svoji družbi, ima kot vsak zaposleni najnižjo
  // osnovo 60 % PP in nima najvišje (144. člen ZPIZ-2); brez plače ni
  // zaposlen in prispevkov ni.
  const druzbenikPoslovodja = isDruzbenikPoslovodja(currentSettings);
  const prispevkiSettings = getDOOPrispevkiSettings(currentSettings);
  const zavarovanecRate = getZavarovanecRate(prispevkiSettings);
  const delodajalecRate = getDelodajalecRate(prispevkiSettings);
  const prispevkiBase =
    druzbenikPoslovodja || salaryGross1 > 0
      ? getOsnovaZaPrispevkeIzPlace(
          salaryGross1,
          getPovprecnaPlacaMesecno(currentSettings),
          druzbenikPoslovodja ? 16 : 14
        )
      : 0;
  // Pri zaposlenem prispevke zavarovanca in delodajalca od razlike med plačo in
  // najnižjo osnovo plača delodajalec, zato ne zmanjšajo plače in davčne osnove
  // (FURS, Brošura o plačevanju prispevkov za socialno varnost)
  // https://www.fu.gov.si/fileadmin/Internet/Davki_in_druge_dajatve/Podrocja/Prispevki_za_socialno_varnost/Opis/Brosura_o_placevanju_prispevkov_za_socialno_varnost.doc
  const zavarovanecBase = druzbenikPoslovodja ? prispevkiBase : salaryGross1;

  // Skupni dohodek za dodatno splošno olajšavo je bruto plača
  const taxRelief = getTaxRelief(salaryGross1, currentSettings);
  const olajsavaVzdrzevani = getOlajsavaVzdrzevaniClani(currentSettings);
  const gross1Tax =
    zavarovanecBase * zavarovanecRate + getOZPLetno(currentSettings);
  const gross2Tax =
    prispevkiBase * delodajalecRate +
    (prispevkiBase - zavarovanecBase) * zavarovanecRate;
  const salaryGross2 = salaryGross1 + gross2Tax;

  // Davčna osnova ne more biti negativna
  const dohodninaBase = Math.max(
    0,
    salaryGross1 - taxRelief - gross1Tax - olajsavaVzdrzevani
  );
  const { total: dohodnina, bracket } = izracunDohodnine(
    dohodninaBase,
    incomeTaxBrackets
  );

  // Povračila stroškov — stroški podjetja, ki zmanjšajo dobiček, a niso obdavčeni za prejemnika
  const malicaLetna = getMalicaLetna(currentSettings);
  const prevozniStroskiLetni = getPrevozniStroskiLetni(currentSettings);
  const regresLetni = getRegresLetni(currentSettings);
  // PDPZ kot strošek delodajalca — zmanjša dobiček, ni obdavčen za
  // zaposlenca do 24 % obveznih prispevkov za PIZ (44. člen ZDoh-2)
  const pdpzLetni = getPDPZOlajsava(
    currentSettings,
    getPIZPrispevkiDOO(prispevkiBase, currentSettings)
  );

  // Božičnica / Zimski regres
  const bozicnicaLetna = getBozicnicaLetna(currentSettings);
  const bozicnicaHasPrispevki = !currentSettings.bozicnicaOprostPrispevkov;
  const bozicnicaEmployeeContrib = bozicnicaHasPrispevki
    ? bozicnicaLetna * zavarovanecRate
    : 0;
  const bozicnicaEmployerContrib = bozicnicaHasPrispevki
    ? bozicnicaLetna * delodajalecRate
    : 0;
  const bozicnicaCost = bozicnicaLetna + bozicnicaEmployerContrib;
  const bozicnicaNet = bozicnicaLetna - bozicnicaEmployeeContrib;

  // Nagrada za poslovno uspešnost — prispevki se vedno obračunajo
  const nagradaLetna = getNagradaLetna(currentSettings);
  const nagradaEmployeeContrib = nagradaLetna * zavarovanecRate;
  const nagradaEmployerContrib = nagradaLetna * delodajalecRate;
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
  const effectiveTaxRate = getDelez(totalTax, sharedInputs.revenue);

  const cistiPrihodki = totalNet;
  const cistiPrihodkiRate = getDelez(cistiPrihodki, sharedInputs.revenue);
  const expenseRate = getDelez(sharedInputs.expenses, sharedInputs.revenue);

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
