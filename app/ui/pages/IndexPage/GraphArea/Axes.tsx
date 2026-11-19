import { AxisBottom, AxisRight, AxisScale } from "@visx/axis";
import { GridRows, GridColumns } from "@visx/grid";
import { evri } from "~/utils/numberFormat";

interface AxesProps {
  xScale: AxisScale;
  yScaleRate: AxisScale;
  xMax: number;
  yMax: number;
}

export function Axes({ xScale, yScaleRate, xMax, yMax }: AxesProps) {
  return (
    <>
      <GridRows
        scale={yScaleRate}
        width={xMax}
        strokeDasharray="3,3"
        stroke="currentColor"
        strokeOpacity={0.25}
      />
      <GridColumns
        scale={xScale}
        height={yMax}
        strokeDasharray="3,3"
        stroke="currentColor"
        strokeOpacity={0.25}
      />

      <AxisBottom
        top={yMax}
        scale={xScale}
        tickFormat={(value) => evri(value.valueOf())}
        stroke="currentColor"
        tickStroke="currentColor"
        numTicks={5}
        tickLabelProps={{
          fill: "currentColor",
          fontSize: 12,
          textAnchor: "middle",
          dy: "0.5em",
        }}
      />

      <AxisRight
        scale={yScaleRate}
        left={xMax}
        tickFormat={(value) => `${value.valueOf()}\u00a0%`}
        stroke="#00cdb8"
        tickStroke="#00cdb8"
        tickLabelProps={{
          fill: "currentColor",
          fontSize: 12,
          textAnchor: "start",
          dx: "0.5em",
        }}
      />
    </>
  );
}
