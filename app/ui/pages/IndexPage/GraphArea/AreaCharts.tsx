import { AreaClosed, LinePath } from "@visx/shape";
import { curveMonotoneX } from "@visx/curve";
import { DataPoint } from "./types";
import {
  getCistiPrihodki,
  getExpenses,
  getRevenue,
  getTax,
  getTaxRate,
} from "./useChartData";
import { PositionScale } from "@visx/shape/lib/types";

interface AreaChartsProps {
  chartData: DataPoint[];
  xScale: (value: number) => number;
  yScaleMoney: (value: number) => number;
  yScaleRate: (value: number) => number;
}

export function AreaCharts({
  chartData,
  xScale,
  yScaleMoney,
  yScaleRate,
}: AreaChartsProps) {
  return (
    <>
      <AreaClosed<DataPoint>
        data={chartData}
        x={(d) => xScale(getRevenue(d))}
        y={(d) => yScaleMoney(getTax(d) + getCistiPrihodki(d) + getExpenses(d))}
        y0={(d) => yScaleMoney(getTax(d) + getCistiPrihodki(d))}
        yScale={yScaleMoney as PositionScale}
        curve={curveMonotoneX}
        fill="#b93b3baa"
      />

      <AreaClosed<DataPoint>
        data={chartData}
        x={(d) => xScale(getRevenue(d))}
        y={(d) => yScaleMoney(getTax(d) + getCistiPrihodki(d))}
        y0={(d) => yScaleMoney(getCistiPrihodki(d))}
        yScale={yScaleMoney as PositionScale}
        curve={curveMonotoneX}
        fill="#991b1baa"
      />

      <AreaClosed<DataPoint>
        data={chartData}
        x={(d) => xScale(getRevenue(d))}
        y={(d) => yScaleMoney(getCistiPrihodki(d))}
        yScale={yScaleMoney as PositionScale}
        curve={curveMonotoneX}
        fill="#166534aa"
      />

      <LinePath<DataPoint>
        data={chartData}
        x={(d) => xScale(getRevenue(d))}
        y={(d) => yScaleRate(getTaxRate(d))}
        stroke="#00cdb8"
        strokeWidth={2}
        curve={curveMonotoneX}
      />
    </>
  );
}
