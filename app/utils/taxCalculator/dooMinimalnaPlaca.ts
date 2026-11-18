import { SharedInputs, YearSettings } from "~/constants/types";
import { getDOOData } from "./doo";

export function getDOOMinimalnaPlacaData(
  sharedInputs: SharedInputs,
  currentSettings: YearSettings
) {
  const { minimalnaPlaca } = currentSettings;
  const salaryGross1 = minimalnaPlaca * 12;

  const data = getDOOData(sharedInputs, currentSettings, salaryGross1);

  return {
    ...data,
    salaryGross1,
  };
}
