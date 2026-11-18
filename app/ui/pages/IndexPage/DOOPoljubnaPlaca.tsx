import type { SharedInputs, YearSettings } from "~/constants/types";
import { TreeBreakdown } from "~/ui/common/TreeBreakdown/TreeBreakdown";
import taxModes from "~/utils/taxModes";
import { getDOOTreeData } from "~/utils/treedata";
import { getDOOPoljubnaPlacaData } from "~/utils/taxCalculator/dooPoljubnaPlaca";
import CurrencyInput from "~/ui/common/Input/CurrencyInput";
import { Text } from "~/ui/common/Text/Text";

interface DOOPoljubnaPlacaProps {
  currentSettings: YearSettings;
  sharedInputs: SharedInputs;
  updateSharedInputs: (newSharedInputs: Partial<SharedInputs>) => void;
}

export function DOOPoljubnaPlaca({
  currentSettings,
  sharedInputs,
  updateSharedInputs,
}: DOOPoljubnaPlacaProps) {
  const results = getDOOPoljubnaPlacaData(sharedInputs, currentSettings);

  const treeData = getDOOTreeData({
    label: taxModes.DOOPoljubnaPlaca.shortName,
    currentSettings,
    ...results,
    expenses: sharedInputs.expenses,
    malicaLetna: results.malicaLetna,
    description: (
      <div className="flex flex-row p-2 items-center gap-2">
        <Text variant="bodySmall" className="text-gray-400 flex-shrink-0">
          Bruto I. Plača
        </Text>
        <CurrencyInput
          labelClassName="input-sm"
          inputClassName="w-32"
          value={results.salaryGross1}
          onChange={(salaryGross1) => updateSharedInputs({ salaryGross1 })}
        />
      </div>
    ),
  });

  return (
    <>
      <TreeBreakdown items={treeData} />
    </>
  );
}
