import type { SharedInputs, YearSettings } from "~/constants/types";
import { TreeBreakdown } from "~/ui/common/TreeBreakdown/TreeBreakdown";
import taxModes from "~/utils/taxModes";
import { getDOOTreeData } from "~/utils/treedata";
import { getDOOMinimalnaPlacaData } from "~/utils/taxCalculator/dooMinimalnaPlaca";

interface DOOMinimalnaPlacaProps {
  currentSettings: YearSettings;
  sharedInputs: SharedInputs;
}

export function DOOMinimalnaPlaca({
  currentSettings,
  sharedInputs,
}: DOOMinimalnaPlacaProps) {
  const results = getDOOMinimalnaPlacaData(sharedInputs, currentSettings);

  const treeData = getDOOTreeData({
    label: taxModes.DOOMinimalnaPlaca.shortName,
    currentSettings,
    ...results,
    expenses: sharedInputs.expenses,
    malicaLetna: results.malicaLetna,
    description: "Minimalna plača + najvec dividend",
  });

  return <TreeBreakdown items={treeData} />;
}
