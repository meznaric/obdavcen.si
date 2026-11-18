import { SharedInputs, YearSettings } from "~/constants/types";
import { getNormiraniSPData } from "./taxCalculator/normiraniSp";
import { getSPData } from "./taxCalculator/sp";
import { AnalyzableData } from "./taxCalculator/types";
import { getDOONajvecjaPlacaData } from "./taxCalculator/dooNajvecjaPlaca";
import { getDOOMinimalnaPlacaData } from "./taxCalculator/dooMinimalnaPlaca";
import { getDOOPoljubnaPlacaData } from "./taxCalculator/dooPoljubnaPlaca";

type TaxModeSettings = {
  shortName: string;
  color: string;
  tailwindColor: string;
  calculator: (
    sharedInputs: SharedInputs,
    currentSettings: YearSettings
  ) => AnalyzableData;
  getMaxRevenue?: (settings: YearSettings) => number;
};

const taxModes: Record<string, TaxModeSettings> = {
  SP: {
    shortName: "S.P.",
    color: "#f97316",
    tailwindColor: "orange-500",
    calculator: getSPData,
  },
  NormiraniSP: {
    shortName: "Normirani S.P.",
    color: "#eab308",
    tailwindColor: "yellow-500",
    calculator: getNormiraniSPData,
    getMaxRevenue: (settings) => settings.normiranMaxRevenue,
  },
  DOONajvecjaPlaca: {
    shortName: "D.O.O. Največja Plača",
    color: "#22c55e",
    tailwindColor: "green-500",
    calculator: getDOONajvecjaPlacaData,
  },
  DOOMinimalnaPlaca: {
    shortName: "D.O.O. Največ Dividend",
    color: "#0d9488",
    tailwindColor: "teal-500",
    calculator: getDOOMinimalnaPlacaData,
  },
  DOOPoljubnaPlaca: {
    shortName: "D.O.O. Poljubna Plača",
    color: "#3d4998",
    tailwindColor: "teal-500",
    calculator: getDOOPoljubnaPlacaData,
  },
};

export const taxModesByShortName = Object.fromEntries(
  Object.entries(taxModes).map(([, mode]) => [mode.shortName, mode])
);

export default taxModes;
