import { AxisBottom, AxisRight, AxisScale } from "@visx/axis";
import { GridRows, GridColumns } from "@visx/grid";
import formatCurrency from "~/utils/formatCurrency";

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
        stroke="rgba(236, 239, 241, 0.2)"
      />
      <GridColumns
        scale={xScale}
        height={yMax}
        strokeDasharray="3,3"
        stroke="rgba(236, 239, 241, 0.2)"
      />

      <AxisBottom
        top={yMax}
        scale={xScale}
        tickFormat={(value) => formatCurrency(value.valueOf(), true)}
        stroke="#e0e0e0"
        tickStroke="#e0e0e0"
        numTicks={5}
        tickLabelProps={{
          fill: "#6b7280",
          fontSize: 12,
          textAnchor: "middle",
          dy: "0.5em",
        }}
      />

      <AxisRight
        scale={yScaleRate}
        left={xMax}
        tickFormat={(value) => `${value.valueOf()}%`}
        stroke="#00cdb8"
        tickStroke="#00cdb8"
        tickLabelProps={{
          fill: "#00cdb8",
          fontSize: 12,
          textAnchor: "start",
          dx: "0.5em",
        }}
      />
    </>
  );
}
