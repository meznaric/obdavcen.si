import { SharedInputs, YearSettings } from "~/constants/types";
import { getDelez } from "./getDelez";
import {
  getDelodajalecRate,
  getMesecniZnesek,
  getMinimalnaOsnova,
  getOZPLetno,
  getPovprecnaPlacaMesecno,
  getZavarovanecRate,
} from "../prispevki";
import { getLetnaDohodninaZaposlenega } from "./popoldanskiSp";

const MESECI = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12];

/**
 * Zaposlitev pri tujem delodajalcu (brez poslovne enote v Sloveniji).
 * Prihodki = dogovorjena letna bruto plača (Bruto I). Delavec sam plača
 * prispevke zavarovanca in delodajalca (skupaj 40,20 %, od 1. 7. 2025; prej
 * 38,20 %) ter OZP, dohodnino pa po odločbi FURS (DOHZAP1) in letni odmeri.
 * Prispevek za dolgotrajno oskrbo (2 %) plača v celoti kot zavarovanec.
 * Najnižja osnova je 60 % zadnje znane povprečne letne plače na mesec.
 * https://www.fu.gov.si/fileadmin/Internet/Davki_in_druge_dajatve/Podrocja/Prispevki_za_socialno_varnost/Opis/Placevanje_prispevkov_za_socialno_varnost_za_zaposlene_pri_tujem_delodajalcu.doc
 * https://edavki.durs.si/OpenPortal/Dokumenti/doh_zap1.n.sl.pdf
 */
export function getTujiDelodajalecData(
  sharedInputs: SharedInputs,
  currentSettings: YearSettings
) {
  const bruto = sharedInputs.revenue;
  const povprecnaPlaca = getPovprecnaPlacaMesecno(currentSettings);

  // Letna osnova za prispevke: mesečna plača, a najmanj 60 % PP
  const osnova =
    bruto > 0
      ? MESECI.reduce(
          (vsota, mesec) =>
            vsota +
            Math.max(
              bruto / 12,
              getMinimalnaOsnova(getMesecniZnesek(povprecnaPlaca, mesec))
            ),
          0
        )
      : 0;

  // DO 2 % je v celoti prispevek zavarovanca (55. člen ZDOsk-1)
  const doRate = currentSettings.delodajalecDOrate;
  const prispevkiZavarovanca =
    osnova * (getZavarovanecRate(currentSettings) + doRate);
  const prispevkiDelodajalca =
    osnova * (getDelodajalecRate(currentSettings) - doRate);
  const ozp = bruto > 0 ? getOZPLetno(currentSettings) : 0;

  // Davčno osnovo zmanjšajo prispevki zavarovanca (41. člen ZDoh-2). Ali jo
  // zmanjša tudi delež delodajalca, ki ga plača delavec sam, FURS izrecno ne
  // pojasnjuje — zato ga konzervativno ne odštejemo.
  const { dohodnina, davcnaOsnova, mejnaStopnja } =
    getLetnaDohodninaZaposlenega(
      bruto,
      0,
      currentSettings,
      prispevkiZavarovanca + ozp
    );

  const prispevki = prispevkiZavarovanca + prispevkiDelodajalca + ozp;
  const totalTax = prispevki + dohodnina;
  // Stroški niso davčno priznani — plačaš jih iz neto plače
  const totalNet = bruto - totalTax - sharedInputs.expenses;

  return {
    cistiPrihodki: totalNet,
    cistiPrihodkiRate: getDelez(totalNet, sharedInputs.revenue),
    effectiveTaxRate: getDelez(totalTax, sharedInputs.revenue),
    expenseRate: getDelez(sharedInputs.expenses, sharedInputs.revenue),
    totalTax,
    totalNet,
    osnova,
    prispevki,
    prispevkiZavarovanca,
    prispevkiDelodajalca,
    ozp,
    dohodnina,
    davcnaOsnova,
    mejnaStopnja,
  };
}
