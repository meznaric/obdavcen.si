import { TreeBreakdown } from "~/ui/common/TreeBreakdown/TreeBreakdown";
import {
  getSlovenskiDelodajalecData,
  getSlovenskiDelodajalecSettings,
} from "~/utils/taxCalculator/slovenskiDelodajalec";
import { getDOOTreeData } from "~/utils/treedata";
import type { BreakdownProps } from "./types";

export function SlovenskiDelodajalecBreakdown({
  currentSettings,
  sharedInputs,
}: BreakdownProps) {
  return (
    <TreeBreakdown
      items={getDOOTreeData({
        result: getSlovenskiDelodajalecData(sharedInputs, currentSettings),
        sharedInputs,
        currentSettings: getSlovenskiDelodajalecSettings(currentSettings),
        oblika: "slovenskiDelodajalec",
      })}
    />
  );
}
