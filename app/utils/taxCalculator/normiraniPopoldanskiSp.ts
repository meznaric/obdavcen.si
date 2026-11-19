import { IncomeTaxBrackets, SharedInputs, YearSettings } from "~/constants/types";
import { getDelez } from "./getDelez";
import { getPopoldanskiPrispevki } from "../prispevki";
import izracunDohodnine from "../dohodnina";

// Normirani odhodki po pasovih prihodkov (vsak pas ima svoj odstotek),
// npr. 80 % prvih 12.500 €, 40 % do 30.000 €, 0 % nad tem
export function getNormiraniOdhodkiPoPasovih(
  revenue: number,
  pasovi: IncomeTaxBrackets
) {
  return izracunDohodnine(revenue, pasovi).total;
}

/**
 * Normirani popoldanski s. p.
 * Dohodnina normiranca je dokončen davek in se ne všteva v letno davčno
 * osnovo, zato plača iz zaposlitve nanjo ne vpliva. Olajšave se uveljavijo
 * pri plači.
 * https://fu.gov.si/fileadmin/Internet/Davki_in_druge_dajatve/Podrocja/Dohodnina/Dohodek_iz_dejavnosti/Opis/Davki_za_zacetnike_-_fizicne_osebe_ki_opravljajo_dejavnost.pdf
 */
export function getNormiraniPopoldanskiSPData(
  sharedInputs: SharedInputs,
  currentSettings: YearSettings
) {
  const normiraniOdhodki = getNormiraniOdhodkiPoPasovih(
    sharedInputs.revenue,
    currentSettings.normiranPopoldanskiOdhodki
  );
  const taxBase = sharedInputs.revenue - normiraniOdhodki;
  const { total: normiraniTax } = izracunDohodnine(
    taxBase,
    currentSettings.normiranPopoldanskiTaxBrackets
  );

  const prispevki = getPopoldanskiPrispevki(currentSettings);

  const totalTax = normiraniTax + prispevki.skupaj;
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
    totalNet,
    normiraniTax,
    normiraniOdhodki,
    taxBase,
    prispevki,
  };
}
