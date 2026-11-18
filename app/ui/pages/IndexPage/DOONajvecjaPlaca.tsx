import type { SharedInputs, YearSettings } from "~/constants/types";
import { TreeBreakdown } from "~/ui/common/TreeBreakdown/TreeBreakdown";
import taxModes from "~/utils/taxModes";
import { getDOOTreeData } from "~/utils/treedata";
import { getDOONajvecjaPlacaData } from "~/utils/taxCalculator/dooNajvecjaPlaca";

interface DOONajvecjaPlacaProps {
  currentSettings: YearSettings;
  sharedInputs: SharedInputs;
}

export function DOONajvecjaPlaca({
  currentSettings,
  sharedInputs,
}: DOONajvecjaPlacaProps) {
  const results = getDOONajvecjaPlacaData(sharedInputs, currentSettings);

  const treeData = getDOOTreeData({
    label: taxModes.DOONajvecjaPlaca.shortName,
    ...results,
    // Najvecja placa ne uporablja dividend in ne ostane dobicka
    dobicekTax: 0,
    dividendsTax: 0,
    dividendsNet: 0,
    currentSettings,
    expenses: sharedInputs.expenses,
    malicaLetna: results.malicaLetna,
    description: "Najvecja placa + brez dividend",
  });
  return <TreeBreakdown items={treeData} />;
}
