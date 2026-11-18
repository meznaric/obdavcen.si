import { LinePath } from "@visx/shape";
import { curveMonotoneX } from "@visx/curve";
import { Group } from "@visx/group";
import { taxModesByShortName } from "~/utils/taxModes";
import { PositionScale } from "@visx/shape/lib/types";

interface TaxModelLinesProps {
  taxModelLines: Record<
    string,
    Array<{
      revenue: number;
      effectiveTaxRate: number;
      taxModel: string;
    }>
  >;
  xScale: PositionScale;
  yScaleRate: PositionScale;
  // xScale: (value: number) => number;
  // yScaleRate: (value: number) => number;
}

export function TaxModelLines({
  taxModelLines,
  xScale,
  yScaleRate,
}: TaxModelLinesProps) {
  return (
    <Group>
      <defs>
        <clipPath id="graph-area">
          <rect
            x={0}
            y={0}
            width={xScale.range()[1]}
            height={yScaleRate.range()[0]}
          />
        </clipPath>
      </defs>
      <Group clipPath="url(#graph-area)">
        {Object.entries(taxModelLines).map(([model, data]) => (
          <LinePath
            key={model}
            data={data}
            x={(d) => xScale(d.revenue) || 0}
            y={(d) => yScaleRate(d.effectiveTaxRate) || 0}
            stroke={taxModesByShortName[model].color}
            strokeWidth={1.5}
            curve={curveMonotoneX}
          />
        ))}
      </Group>
    </Group>
  );
}
