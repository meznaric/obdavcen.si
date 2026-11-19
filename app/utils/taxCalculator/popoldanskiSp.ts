import { SharedInputs, YearSettings } from "~/constants/types";
import {
  getOZPLetno,
  getPopoldanskiPrispevki,
  getZavarovanecRate,
} from "../prispevki";
import izracunDohodnine, {
  getOlajsavaVzdrzevaniClani,
  getPDPZOlajsava,
  getTaxRelief,
} from "../dohodnina";
import { getDelez } from "./getDelez";

// Popoldanski s. p. je mogoč le ob zaposlitvi za polni delovni čas
export function hasZaposlitev(sharedInputs: SharedInputs) {
  return (sharedInputs.zaposlitevBruto ?? 0) > 0;
}

/**
 * Letna dohodnina zaposlenega, ki ima poleg plače še dohodek iz dejavnosti.
 * Dohodek iz dejavnosti z dejanskimi odhodki se všteva v letno davčno osnovo
 * skupaj s plačo, zato se obdavči po mejni stopnji zaposlenega.
 * https://fu.gov.si/fileadmin/Internet/Davki_in_druge_dajatve/Podrocja/Dohodnina/Dohodek_iz_dejavnosti/Opis/Davki_za_zacetnike_-_fizicne_osebe_ki_opravljajo_dejavnost.pdf
 */
export function getLetnaDohodninaZaposlenega(
  zaposlitevBruto: number,
  dohodekIzDejavnosti: number,
  currentSettings: YearSettings,
  // Zneski, ki zmanjšajo davčno osnovo (prispevki, normirani stroški);
  // privzeto prispevki delojemalca iz plače (enako kot pri plači v d. o. o.)
  odbitki = zaposlitevBruto > 0
    ? zaposlitevBruto * getZavarovanecRate(currentSettings) +
      getOZPLetno(currentSettings)
    : 0,
  // Skupni dohodek za dodatno splošno olajšavo; dobiček iz dejavnosti se vanj
  // šteje brez obračunanih prispevkov (4. odstavek 111. člena ZDoh-2)
  // https://pisrs.si/pregledPredpisa?id=ZAKO4697
  skupniDohodek = zaposlitevBruto + dohodekIzDejavnosti
) {
  // Splošna olajšava je odvisna od skupnega dohodka
  const taxRelief = getTaxRelief(skupniDohodek, currentSettings);
  const olajsave =
    taxRelief +
    getOlajsavaVzdrzevaniClani(currentSettings) +
    // Meja PDPZ: 24 % prispevkov za PIZ iz plače (delavec in delodajalec)
    getPDPZOlajsava(
      currentSettings,
      zaposlitevBruto *
        (currentSettings.zavarovanecPIZrate + currentSettings.delodajalecPIZrate)
    );

  const davcnaOsnova = Math.max(
    0,
    zaposlitevBruto - odbitki + dohodekIzDejavnosti - olajsave
  );
  const { total: dohodnina, bracket } = izracunDohodnine(
    davcnaOsnova,
    currentSettings.incomeTaxBrackets
  );
  const mejnaStopnja =
    [...bracket].reverse().find((b) => b.toPay > 0)?.percentage ?? 0;

  return { dohodnina, davcnaOsnova, taxRelief, mejnaStopnja };
}

/**
 * Popoldanski s. p. z dejanskimi odhodki.
 * Vrne davke in prispevke, ki jih povzroči s. p. — razliko med dohodnino
 * "plača + s. p." in "samo plača" ter pavšalne prispevke — da je primerljiv
 * z ostalimi oblikami pri enakih prihodkih.
 */
export function getPopoldanskiSPData(
  sharedInputs: SharedInputs,
  currentSettings: YearSettings
) {
  const zaposlitevBruto = sharedInputs.zaposlitevBruto ?? 0;
  const prispevki = getPopoldanskiPrispevki(currentSettings);

  // Obvezni prispevki zavezanca so priznan odhodek (56. člen ZDoh-2)
  // https://pisrs.si/pregledPredpisa?id=ZAKO4697
  const dobicek =
    sharedInputs.revenue - sharedInputs.expenses - prispevki.skupaj;
  // Izguba iz dejavnosti ne zmanjša davčne osnove od plače
  const davcnaOsnovaSP = Math.max(0, dobicek);

  const samoPlaca = getLetnaDohodninaZaposlenega(
    zaposlitevBruto,
    0,
    currentSettings
  );
  const placaInSP = getLetnaDohodninaZaposlenega(
    zaposlitevBruto,
    davcnaOsnovaSP,
    currentSettings,
    undefined,
    zaposlitevBruto +
      Math.max(0, sharedInputs.revenue - sharedInputs.expenses)
  );
  const dohodnina = placaInSP.dohodnina - samoPlaca.dohodnina;

  const totalTax = dohodnina + prispevki.skupaj;
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
    dohodnina,
    dobicek,
    davcnaOsnovaSP,
    dohodninaSamoPlaca: samoPlaca.dohodnina,
    dohodninaSkupaj: placaInSP.dohodnina,
    mejnaStopnja: placaInSP.mejnaStopnja,
    prispevki,
  };
}
