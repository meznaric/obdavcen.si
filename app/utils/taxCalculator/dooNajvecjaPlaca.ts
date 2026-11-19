import type { SharedInputs, YearSettings } from "~/constants/types";
import {
  getDelodajalecRate,
  getOsnovaZaPrispevkeIzPlace,
  getPovprecnaPlacaMesecno,
  getZavarovanecRate,
} from "../prispevki";
import { getPDPZOlajsava } from "../dohodnina";
import {
  getDOOData,
  getDOOPrispevkiSettings,
  getMalicaLetna,
  getPIZPrispevkiDOO,
  getPrevozniStroskiLetni,
  getRegresLetni,
  getBozicnicaLetna,
  getNagradaLetna,
  isDruzbenikPoslovodja,
} from "./doo";

export function getDOONajvecjaPlacaData(
  sharedInputs: SharedInputs,
  currentSettings: YearSettings
) {
  const prispevkiSettings = getDOOPrispevkiSettings(currentSettings);
  const delodajalecRate = getDelodajalecRate(prispevkiSettings);
  const zavarovanecRate = getZavarovanecRate(prispevkiSettings);
  const druzbenikPoslovodja = isDruzbenikPoslovodja(currentSettings);
  const povprecnaPlacaMesecno = getPovprecnaPlacaMesecno(currentSettings);

  // Povračila so stroški podjetja pred izračunom največje plače
  const malicaLetna = getMalicaLetna(currentSettings);
  const prevozniStroskiLetni = getPrevozniStroskiLetni(currentSettings);
  const regresLetni = getRegresLetni(currentSettings);

  // Božičnica in nagrada — stroški podjetja (bruto + delodajalčevi prispevki)
  const bozicnicaLetna = getBozicnicaLetna(currentSettings);
  const bozicnicaCost = bozicnicaLetna + (
    currentSettings.bozicnicaOprostPrispevkov
      ? 0
      : bozicnicaLetna * delodajalecRate
  );
  const nagradaLetna = getNagradaLetna(currentSettings);
  const nagradaCost = nagradaLetna + nagradaLetna * delodajalecRate;

  const naVoljo =
    sharedInputs.revenue - sharedInputs.expenses - malicaLetna -
    prevozniStroskiLetni - regresLetni - bozicnicaCost - nagradaCost;

  // Največja plača, pri kateri podjetju ne ostane dobička:
  // plača + prispevki delodajalca od osnove (+ pri zaposlenem prispevki
  // zavarovanca od razlike do najnižje osnove) + premija PDPZ = na voljo.
  // Osnova je omejena z najnižjo (60 % oz. 90 % PP) in pri poslovodji z
  // najvišjo osnovo (3,5-kratnik PP), PDPZ pa s 24 % prispevkov za PIZ,
  // zato plačo poiščemo s ponavljanjem (vsak korak zmanjša napako vsaj za
  // 75 %).
  let placa = naVoljo / (1 + delodajalecRate);
  let pdpzLetni = 0;
  for (let i = 0; i < 50; i++) {
    const osnova = getOsnovaZaPrispevkeIzPlace(
      Math.max(0, placa),
      povprecnaPlacaMesecno,
      druzbenikPoslovodja ? 16 : 14
    );
    pdpzLetni = getPDPZOlajsava(
      currentSettings,
      getPIZPrispevkiDOO(osnova, currentSettings)
    );
    const prispevkiOdRazlike = druzbenikPoslovodja
      ? 0
      : (osnova - Math.max(0, placa)) * zavarovanecRate;
    const naslednja =
      naVoljo - pdpzLetni - osnova * delodajalecRate - prispevkiOdRazlike;
    const razlika = Math.abs(naslednja - placa);
    placa = naslednja;
    if (razlika < 0.001) break;
  }

  // Zaposleni za polni delovni čas mora prejeti vsaj minimalno plačo
  // (Zakon o minimalni plači). Če je podjetje ne zmore, posluje z izgubo.
  // https://www.gov.si/teme/minimalna-placa/
  const salaryGross1 = Math.max(placa, currentSettings.minimalnaPlaca * 12);

  const data = getDOOData(sharedInputs, currentSettings, salaryGross1);

  return {
    ...data,
    salaryGross1,
  };
}
