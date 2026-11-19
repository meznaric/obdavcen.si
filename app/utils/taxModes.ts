import { SharedInputs, YearSettings } from "~/constants/types";
import { getNormiraniSPData } from "./taxCalculator/normiraniSp";
import { getSPData } from "./taxCalculator/sp";
import { AnalyzableData } from "./taxCalculator/types";
import { getDOONajvecjaPlacaData } from "./taxCalculator/dooNajvecjaPlaca";
import { getDOOMinimalnaPlacaData } from "./taxCalculator/dooMinimalnaPlaca";
import { getDOOPoljubnaPlacaData } from "./taxCalculator/dooPoljubnaPlaca";
import { getPopoldanskiSPData } from "./taxCalculator/popoldanskiSp";
import { getNormiraniPopoldanskiSPData } from "./taxCalculator/normiraniPopoldanskiSp";
import { getDOOObZaposlitviData } from "./taxCalculator/dooObZaposlitvi";
import { getTujiDelodajalecData } from "./taxCalculator/tujiDelodajalec";
import { getPodjemnaPogodbaData } from "./taxCalculator/podjemnaPogodba";
import { getSlovenskiDelodajalecData } from "./taxCalculator/slovenskiDelodajalec";

// Vsi kalkulatorji vrnejo tudi »Ostane ti« v evrih:
// prihodki − davki in prispevki − stroški
export type TaxModeResult = AnalyzableData & { cistiPrihodki: number };

export type TaxModeSettings = {
  // Ime oblike – enako v primerjavi, grafu in opisih
  shortName: string;
  // Kratek opis v eni vrstici (»Kaj je to?«)
  about: string;
  // Članek z razlago oblike
  articlePath?: string;
  // Strategije d. o. o. so v primerjavi združene v eno vrstico
  group?: "DOO";
  // Ime strategije znotraj skupine (gumb za izbiro strategije)
  strategy?: string;
  color: string;
  calculator: (
    sharedInputs: SharedInputs,
    currentSettings: YearSettings
  ) => TaxModeResult;
  getMaxRevenue?: (settings: YearSettings) => number;
};

const taxModes: Record<string, TaxModeSettings> = {
  SP: {
    shortName: "S.\u00a0p.",
    about: "Dohodnino in prispevke plačaš od dobička.",
    articlePath: "/izplacilo/sp",
    color: "#f97316",
    calculator: getSPData,
  },
  NormiraniSP: {
    shortName: "Normirani s.\u00a0p.",
    about: "Del prihodkov se prizna kot normirani odhodki, stroškov ne dokazuješ.",
    articlePath: "/izplacilo/normirani-sp",
    color: "#eab308",
    calculator: getNormiraniSPData,
    getMaxRevenue: (settings) => settings.normiranMaxRevenue,
  },
  DOONajvecjaPlaca: {
    shortName: "D.\u00a0o.\u00a0o. – največja plača",
    about: "Ves dobiček izplačaš kot plačo, brez dividend.",
    articlePath: "/izplacilo/doo",
    group: "DOO",
    strategy: "Največja plača",
    color: "#22c55e",
    calculator: getDOONajvecjaPlacaData,
  },
  DOOMinimalnaPlaca: {
    shortName: "D.\u00a0o.\u00a0o. – največ dividend",
    about: "Minimalna plača, preostanek dobička kot dividende.",
    articlePath: "/izplacilo/doo",
    group: "DOO",
    strategy: "Največ dividend",
    color: "#0d9488",
    calculator: getDOOMinimalnaPlacaData,
  },
  DOOPoljubnaPlaca: {
    shortName: "D.\u00a0o.\u00a0o. – plača po izbiri",
    about: "Plačo izbereš sam, preostanek dobička izplačaš kot dividende.",
    articlePath: "/izplacilo/doo",
    group: "DOO",
    strategy: "Plača po izbiri",
    color: "#3d4998",
    calculator: getDOOPoljubnaPlacaData,
  },
  TujiDelodajalec: {
    shortName: "Zaposlitev pri tujem delodajalcu",
    about: "Prispevke in dohodnino od plače plačaš sam.",
    color: "#6366f1",
    calculator: getTujiDelodajalecData,
  },
  SlovenskiDelodajalec: {
    shortName: "Zaposlitev v slovenskem podjetju",
    about:
      "Prihodki so ves strošek delodajalca zate: plača s prispevki, regres, božičnica in povračila.",
    color: "#0891b2",
    calculator: getSlovenskiDelodajalecData,
  },
  PodjemnaPogodba: {
    shortName: "Podjemna ali avtorska pogodba",
    about: "Pogodba za posamezno delo, brez odprtja dejavnosti.",
    color: "#78716c",
    calculator: getPodjemnaPogodbaData,
  },
};

// Oblike, ki dohodek iz dejavnosti združujejo z obstoječo zaposlitvijo.
// Prikazane so v primerjavi za tiste z redno zaposlitvijo, ne pa v grafu, saj
// prikazujejo le dodatne davke ob plači in niso neposredno primerljive z
// oblikami, kjer je dejavnost edini vir dohodka.
export const zaposlitevTaxModes: Record<string, TaxModeSettings> = {
  PopoldanskiSP: {
    shortName: "Popoldanski s.\u00a0p.",
    about: "Pavšalni prispevki, dobiček se obdavči skupaj s plačo.",
    articlePath: "/izplacilo/popoldanski-sp",
    color: "#ec4899",
    calculator: getPopoldanskiSPData,
  },
  NormiraniPopoldanskiSP: {
    shortName: "Normirani popoldanski s.\u00a0p.",
    about: "Pavšalni prispevki in dokončen davek, plača nanj ne vpliva.",
    articlePath: "/izplacilo/popoldanski-sp",
    color: "#a855f7",
    calculator: getNormiraniPopoldanskiSPData,
    getMaxRevenue: (settings) => settings.normiranPopoldanskiMaxRevenue,
  },
  DOOObZaposlitvi: {
    shortName: "D.\u00a0o.\u00a0o. ob zaposlitvi",
    about: "Brez plače, ves dobiček izplačaš kot dividende.",
    articlePath: "/izplacilo/doo",
    color: "#0ea5e9",
    calculator: getDOOObZaposlitviData,
  },
};

// Imena uporabljajo nedeljive presledke (\u00a0), da se »s. p.« in »d. o. o.«
// ne prelomita čez vrstico.
export const allTaxModes = { ...taxModes, ...zaposlitevTaxModes };

export const taxModesByShortName = Object.fromEntries(
  Object.entries(allTaxModes).map(([, mode]) => [mode.shortName, mode])
);

export default taxModes;
