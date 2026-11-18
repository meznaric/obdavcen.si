import { SharedInputs, YearSettings } from "~/constants/types";
import { getDelodajalecRate } from "../prispevki";
import { getPDPZOlajsava } from "../dohodnina";
import { getDOOData, getMalicaLetna, getPrevozniStroskiLetni, getRegresLetni, getBozicnicaLetna, getNagradaLetna } from "./doo";

export function getDOONajvecjaPlacaData(
  sharedInputs: SharedInputs,
  currentSettings: YearSettings
) {
  // Povračila so stroški podjetja pred izračunom največje plače
  const malicaLetna = getMalicaLetna(currentSettings);
  const prevozniStroskiLetni = getPrevozniStroskiLetni(currentSettings);
  const regresLetni = getRegresLetni(currentSettings);
  const pdpzLetni = getPDPZOlajsava(currentSettings);

  // Božičnica in nagrada — stroški podjetja (bruto + delodajalčevi prispevki)
  const bozicnicaLetna = getBozicnicaLetna(currentSettings);
  const bozicnicaCost = bozicnicaLetna + (
    currentSettings.bozicnicaOprostPrispevkov
      ? 0
      : bozicnicaLetna * getDelodajalecRate(currentSettings)
  );
  const nagradaLetna = getNagradaLetna(currentSettings);
  const nagradaCost = nagradaLetna + nagradaLetna * getDelodajalecRate(currentSettings);

  const salaryGross1 =
    (sharedInputs.revenue - sharedInputs.expenses - malicaLetna - prevozniStroskiLetni - regresLetni - pdpzLetni
      - bozicnicaCost - nagradaCost) /
    (1 + getDelodajalecRate(currentSettings));

  const data = getDOOData(sharedInputs, currentSettings, salaryGross1);

  return {
    ...data,
    salaryGross1,
  };
}
