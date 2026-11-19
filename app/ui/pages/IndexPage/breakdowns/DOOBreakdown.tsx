import { TreeBreakdown } from "~/ui/common/TreeBreakdown/TreeBreakdown";
import { getDOOMinimalnaPlacaData } from "~/utils/taxCalculator/dooMinimalnaPlaca";
import { getDOONajvecjaPlacaData } from "~/utils/taxCalculator/dooNajvecjaPlaca";
import { getDOOPoljubnaPlacaData } from "~/utils/taxCalculator/dooPoljubnaPlaca";
import { getDOOTreeData } from "~/utils/treedata";
import type { BreakdownProps } from "./types";

export type DOOStrategija =
  | "DOOMinimalnaPlaca"
  | "DOONajvecjaPlaca"
  | "DOOPoljubnaPlaca";

const kalkulatorji = {
  DOOMinimalnaPlaca: getDOOMinimalnaPlacaData,
  DOONajvecjaPlaca: getDOONajvecjaPlacaData,
  DOOPoljubnaPlaca: getDOOPoljubnaPlacaData,
} satisfies Record<DOOStrategija, unknown>;

export function DOOBreakdown({
  strategija,
  currentSettings,
  sharedInputs,
}: BreakdownProps & { strategija: DOOStrategija }) {
  const result = kalkulatorji[strategija](sharedInputs, currentSettings);
  return (
    <TreeBreakdown
      items={getDOOTreeData({ result, sharedInputs, currentSettings })}
    />
  );
}
