import type { SharedInputs, YearSettings } from "~/constants/types";
import { getDOONajvecjaPlacaData } from "./dooNajvecjaPlaca";
import { getDelez } from "./getDelez";

/*
  Nastavitve za zaposlenega v slovenskem podjetju: zavarovan je kot delavec
  (14. člen ZPIZ-2), prejme regres v zakonski višini minimalne plače (131.
  člen ZDR-1), božičnico in povračila po nastavitvah, ne pa nagrade za
  poslovno uspešnost, ki je delodajalec ni dolžan izplačati.
*/
export function getSlovenskiDelodajalecSettings(
  currentSettings: YearSettings
): YearSettings {
  return {
    ...currentSettings,
    dooDruzbenikPoslovodja: false,
    regres: true,
    regresZnesek: currentSettings.minimalnaPlaca,
    nagradaPoslovnaUspesnost: false,
  };
}

/**
 * Zaposlitev v slovenskem podjetju. Da je primerljiva z drugimi oblikami, so
 * prihodki ves letni strošek delodajalca zate: bruto plača II (plača in
 * prispevki delodajalca), regres, božičnica in povračila (malica, prevoz).
 * Delodajalec obračuna in plača prispevke in akontacijo dohodnine. Račun je
 * enak kot pri največji plači v d. o. o., kjer si zaposlen.
 * Stroški niso davčno priznani – plačaš jih iz neto plače.
 * Pri prihodkih, ki ne pokrijejo minimalne plače, je dividendsNet negativen:
 * to je znesek, ki manjka do stroška delodajalca pri minimalni plači.
 */
export function getSlovenskiDelodajalecData(
  sharedInputs: SharedInputs,
  currentSettings: YearSettings
) {
  const settings = getSlovenskiDelodajalecSettings(currentSettings);
  const data = getDOONajvecjaPlacaData(
    { ...sharedInputs, expenses: 0 },
    settings
  );
  const cistiPrihodki = data.cistiPrihodki - sharedInputs.expenses;
  return {
    ...data,
    cistiPrihodki,
    cistiPrihodkiRate: getDelez(cistiPrihodki, sharedInputs.revenue),
    expenses: sharedInputs.expenses,
    expenseRate: getDelez(sharedInputs.expenses, sharedInputs.revenue),
  };
}
