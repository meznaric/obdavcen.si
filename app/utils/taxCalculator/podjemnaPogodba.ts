import { SharedInputs, YearSettings } from "~/constants/types";
import { getLetniZnesek, getOZPLetno } from "../prispevki";
import { getLetnaDohodninaZaposlenega } from "./popoldanskiSp";
import { getDelez } from "./getDelez";

/**
 * Podjemna ali avtorska pogodba s tujim naročnikom kot edini vir dohodka.
 * Prejemnik sam plača vse prispevke (od 90 % dohodka), ker tuji izplačevalec
 * ni plačnik davka. Akontacija 25 % je le predplačilo — dohodek se všteva v
 * letno davčno osnovo in obdavči po dohodninski lestvici.
 * Ker dohodek iz pogodbe ne daje zdravstvenega zavarovanja, plača še
 * prispevek samoplačnika (21. točka 15. člena ZZVZZ) in OZP.
 * https://www.fu.gov.si/fileadmin/Internet/Davki_in_druge_dajatve/Podrocja/Dohodnina/Dohodek_iz_zaposlitve/Opis/Drugo_pogodbeno_razmerje.docx
 */
export function getPodjemnaPogodbaData(
  sharedInputs: SharedInputs,
  currentSettings: YearSettings
) {
  const dohodek = sharedInputs.revenue;
  const normiraniStroski = dohodek * currentSettings.pogodbaNormiraniStroski;
  const osnova = dohodek - normiraniStroski;

  const doRate = getLetniZnesek(currentSettings.pogodbaDO) / 12;
  const pizPrejemnik = osnova * currentSettings.pogodbaPIZPrejemnik;
  const pizIzplacevalec = osnova * currentSettings.pogodbaPIZIzplacevalec;
  const zz = osnova * currentSettings.pogodbaZZ;
  const dolgotrajnaOskrba = osnova * doRate;
  const prispevkiOdPogodbe = pizPrejemnik + pizIzplacevalec + zz + dolgotrajnaOskrba;

  const zzSamoplacnik =
    dohodek > 0 ? getLetniZnesek(currentSettings.samoplacniskiZZ) : 0;
  // Samoplačnik plača tudi prispevek za dolgotrajno oskrbo
  const doSamoplacnik =
    dohodek > 0 ? getLetniZnesek(currentSettings.samoplacniskiDO) : 0;
  const ozp = dohodek > 0 ? getOZPLetno(currentSettings) : 0;

  // Davčno osnovo zmanjšajo prispevki, ki bremenijo prejemnika (PIZ 15,5 %,
  // ZZ 6,36 %, DO). Delež izplačevalca 8,85 %, ki ga plača prejemnik sam, in
  // pavšalni prispevek samoplačnika konzervativno ne zmanjšata osnove.
  const { dohodnina, davcnaOsnova, mejnaStopnja } =
    getLetnaDohodninaZaposlenega(
      dohodek,
      0,
      currentSettings,
      normiraniStroski + pizPrejemnik + zz + dolgotrajnaOskrba
    );

  const prispevki = prispevkiOdPogodbe + zzSamoplacnik + doSamoplacnik + ozp;
  const totalTax = prispevki + dohodnina;
  // Dejanski stroški nad normiranimi niso priznani — plačaš jih iz neto
  const totalNet = dohodek - totalTax - sharedInputs.expenses;

  return {
    cistiPrihodki: totalNet,
    cistiPrihodkiRate: getDelez(totalNet, sharedInputs.revenue),
    effectiveTaxRate: getDelez(totalTax, sharedInputs.revenue),
    expenseRate: getDelez(sharedInputs.expenses, sharedInputs.revenue),
    totalTax,
    totalNet,
    normiraniStroski,
    osnova,
    pizPrejemnik,
    pizIzplacevalec,
    zz,
    dolgotrajnaOskrba,
    prispevkiOdPogodbe,
    zzSamoplacnik,
    doSamoplacnik,
    ozp,
    prispevki,
    dohodnina,
    davcnaOsnova,
    mejnaStopnja,
  };
}
