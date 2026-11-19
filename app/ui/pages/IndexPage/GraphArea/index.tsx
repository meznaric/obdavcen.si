import React, { useState } from "react";
import { useParentSize } from "@visx/responsive";
import { Group } from "@visx/group";
import { TooltipWithBounds, defaultStyles, useTooltip } from "@visx/tooltip";
import { localPoint } from "@visx/event";
import { getCistiPrihodki, getExpenses, useChartData } from "./useChartData";
import { useChartScales } from "./useChartScales";
import { TaxZones } from "./TaxZones";
import { AreaCharts } from "./AreaCharts";
import { Axes } from "./Axes";
import { DataPoint } from "./types";
import { TaxModelLines } from "./TaxModelLines";
import { SharedInputs, YearSettings } from "~/constants/types";
import { taxModesByShortName } from "~/utils/taxModes";
import { delez, evri } from "~/utils/numberFormat";

const toolTipStyles = {
  ...defaultStyles,
  backgroundColor: "transparent",
  padding: 0,
};

const height = 500;
const margin = { top: 5 * 15, right: 52, bottom: 60, left: 0 };

export default function GraphArea({
  showOnlyBestRate,
  currentRevenue,
  sharedInputs,
  currentSettings,
}: {
  showOnlyBestRate: boolean;
  currentRevenue: number;
  sharedInputs: SharedInputs;
  currentSettings: YearSettings;
}) {
  const [hoveredZoneIndex, setHoveredZoneIndex] = useState<number | null>(null);
  const [hoverX, setHoverX] = useState<number | null>(null);
  const { width: parentWidth = 900, parentRef } = useParentSize({});
  const width = parentWidth;
  const { chartData, taxZones, taxModelLines, modelsByRevenue } = useChartData(
    sharedInputs,
    currentSettings,
  );
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  const { xScale, yScaleMoney, yScaleRate } = useChartScales(
    chartData,
    xMax,
    yMax,
  );

  const {
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0,
  } = useTooltip<DataPoint | Record<string, DataPoint>>();

  const handlePointerMove = (
    event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>,
  ) => {
    event.preventDefault();
    const { x } = localPoint(event) || { x: 0 };
    const x0 = x - margin.left;
    const xValue = xScale.invert(x0);

    const revenue = Math.round(xValue / 1000) * 1000;

    const index = chartData.reduce((closest, point, i) => {
      const distance = Math.abs(point.revenue - xValue);
      const closestDistance = Math.abs(chartData[closest].revenue - xValue);
      return distance < closestDistance ? i : closest;
    }, 0);

    const zoneIndex = taxZones.findIndex(
      (zone) => xValue >= zone.start && xValue <= zone.end,
    );
    setHoveredZoneIndex(zoneIndex);
    // console.log(taxModelLines);

    setHoverX(x0);
    showTooltip({
      tooltipData: showOnlyBestRate
        ? chartData[index]
        : modelsByRevenue[revenue],
      tooltipLeft: xScale(chartData[index].revenue) + margin.left,
      tooltipTop: yScaleMoney(chartData[index].revenue) + margin.top,
    });
  };

  return (
    <div
      ref={parentRef}
      className="relative w-full select-none overflow-hidden"
    >
      <svg width={width} height={height} className="text-muted">
        <Group left={margin.left} top={margin.top}>
          <Axes
            xScale={xScale}
            yScaleRate={yScaleRate}
            xMax={xMax}
            yMax={yMax}
          />

          <TaxZones
            taxZones={taxZones}
            xScale={xScale}
            yMax={yMax}
            hoveredZoneIndex={hoveredZoneIndex}
            colorful={!showOnlyBestRate}
          />

          {showOnlyBestRate ? (
            <AreaCharts
              chartData={chartData}
              xScale={xScale}
              yScaleMoney={yScaleMoney}
              yScaleRate={yScaleRate}
            />
          ) : (
            <TaxModelLines
              taxModelLines={taxModelLines}
              yScaleRate={yScaleRate}
              xScale={xScale}
            />
          )}

          {/* Hover indicator line */}
          {hoverX !== null && (
            <>
              <line
                x1={hoverX}
                y1={0}
                x2={hoverX}
                y2={yMax}
                stroke="currentColor"
                strokeWidth={1}
                strokeDasharray="4,4"
              />
              <text
                x={hoverX}
                y={yMax + 14}
                textAnchor="middle"
                fill="currentColor"
                fontSize={12}
              >
                {evri(Math.round(xScale.invert(hoverX) / 1000) * 1000)}
              </text>
            </>
          )}

          {/* Current revenue indicator */}
          <g className="text-accent">
            <line
              x1={xScale(currentRevenue)}
              y1={0}
              x2={xScale(currentRevenue)}
              y2={yMax}
              stroke="currentColor"
              strokeWidth={2}
              strokeDasharray="4,4"
            />
            <text
              x={xScale(currentRevenue)}
              y={yMax + 40}
              textAnchor="middle"
              fill="currentColor"
              fontSize={12}
              fontWeight={600}
            >
              {evri(currentRevenue)}
            </text>
          </g>

          <rect
            width={Math.max(xMax, 0)}
            height={yMax}
            fill="transparent"
            onTouchStart={handlePointerMove}
            onTouchMove={handlePointerMove}
            onMouseMove={handlePointerMove}
            onMouseLeave={() => {
              hideTooltip();
              setHoveredZoneIndex(null);
              setHoverX(null);
            }}
            onTouchEnd={() => {
              hideTooltip();
              setHoveredZoneIndex(null);
              setHoverX(null);
            }}
          />
        </Group>
      </svg>

      {tooltipData && (
        <TooltipWithBounds
          key={Math.random()}
          top={tooltipTop}
          left={tooltipLeft}
          style={toolTipStyles}
        >
          {isDataPoint(tooltipData) ? (
            <div className="space-y-1 rounded-lg border border-base-300 bg-base-100 p-3 text-sm text-base-content shadow-md">
              <div className="font-bold">Oblika: {tooltipData.taxModel}</div>
              <div>Prihodki: {evri(tooltipData.revenue)}</div>
              <div className="text-green-700 dark:text-green-400">
                Ostane ti: {evri(getCistiPrihodki(tooltipData))} (
                {delez(tooltipData.cistiPrihodkiRate / 100)})
              </div>
              <div className="text-red-700 dark:text-red-400">
                Davki in prispevki: {evri(tooltipData.tax)} (
                {delez(tooltipData.effectiveTaxRate / 100)})
              </div>
              {tooltipData.expenseRate > 0 && (
                <div className="text-muted">
                  Stroški: {evri(getExpenses(tooltipData))} (
                  {delez(tooltipData.expenseRate / 100)})
                </div>
              )}
            </div>
          ) : (
            <table className="table-sm table-zebra rounded-lg border border-base-300 bg-base-100 text-base-content shadow-md">
              <thead>
                <tr>
                  <th>Oblika</th>
                  <th className="text-green-700 dark:text-green-400">
                    Ostane ti
                  </th>
                  <th className="text-red-700 dark:text-red-400">
                    Davki in prispevki
                  </th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(tooltipData)
                  .sort(
                    ([, a], [, b]) => a.effectiveTaxRate - b.effectiveTaxRate,
                  )
                  .map(([model, data]) => {
                    return (
                      <tr key={model}>
                        <td>
                          <span
                            className="mr-1.5 inline-block size-2.5 rounded-full"
                            style={{
                              backgroundColor: taxModesByShortName[model].color,
                            }}
                            aria-hidden="true"
                          />
                          {model}
                        </td>
                        <td>
                          <span className="font-bold">
                            {delez(data.cistiPrihodkiRate / 100)}
                          </span>
                          <div className="text-sm text-muted">
                            {evri(getCistiPrihodki(data))}
                          </div>
                        </td>
                        <td>
                          <span className="font-bold">
                            {delez(data.effectiveTaxRate / 100)}
                          </span>
                          <div className="text-sm text-muted">
                            {evri(data.tax)}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          )}
        </TooltipWithBounds>
      )}
    </div>
  );
}

function isDataPoint(
  data: DataPoint | Record<string, DataPoint>,
): data is DataPoint {
  return (data as DataPoint).revenue !== undefined;
}
