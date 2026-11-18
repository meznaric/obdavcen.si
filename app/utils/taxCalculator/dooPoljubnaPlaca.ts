import { SharedInputs, YearSettings } from "~/constants/types";
import { getDOOData } from "./doo";

export function getDOOPoljubnaPlacaData(
  sharedInputs: SharedInputs,
  currentSettings: YearSettings
) {
  const data = getDOOData(
    sharedInputs,
    currentSettings,
    sharedInputs.salaryGross1
  );

  return {
    ...data,
    salaryGross1: sharedInputs.salaryGross1,
  };
}
