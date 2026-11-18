import { useMemo } from "react";
import { scaleLinear } from "@visx/scale";
import { DataPoint } from "./types";
import { getRevenue } from "./useChartData";

export function useChartScales(
  chartData: DataPoint[],
  xMax: number,
  yMax: number
) {
  const xScale = useMemo(
    () =>
      scaleLinear<number>({
        range: [0, xMax],
        domain: [
          Math.min(...chartData.map(getRevenue)),
          Math.max(...chartData.map(getRevenue)),
        ],
      }),
    [xMax, chartData]
  );

  const yScaleMoney = useMemo(
    () =>
      scaleLinear<number>({
        range: [yMax, 0],
        domain: [0, Math.max(...chartData.map(getRevenue)) * 1.5],
        nice: true,
      }),
    [yMax, chartData]
  );

  const yScaleRate = useMemo(
    () =>
      scaleLinear<number>({
        range: [yMax, 0],
        domain: [0, 100],
      }),
    [yMax]
  );

  return { xScale, yScaleMoney, yScaleRate };
}
