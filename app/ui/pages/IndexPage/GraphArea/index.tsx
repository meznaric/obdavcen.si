import React, { useState } from "react";
import { useParentSize } from "@visx/responsive";
import { Group } from "@visx/group";
import { TooltipWithBounds, defaultStyles, useTooltip } from "@visx/tooltip";
import { localPoint } from "@visx/event";
import formatCurrency from "~/utils/formatCurrency";
import { useChartData } from "./useChartData";
import { useChartScales } from "./useChartScales";
import { TaxZones } from "./TaxZones";
import { AreaCharts } from "./AreaCharts";
import { Axes } from "./Axes";
import { DataPoint } from "./types";
import { TaxModelLines } from "./TaxModelLines";
import { SharedInputs, YearSettings } from "~/constants/types";
import { taxModesByShortName } from "~/utils/taxModes";
import asPercent from "~/utils/asPercent";

const toolTipStyles = {
  ...defaultStyles,
  backgroundColor: "transparent",
  padding: 0,
};

const height = 500;
const margin = { top: 5 * 15, right: 40, bottom: 60, left: 0 };

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
    currentSettings
  );
  const xMax = width - margin.left - margin.right;
  const yMax = height - margin.top - margin.bottom;

  const { xScale, yScaleMoney, yScaleRate } = useChartScales(
    chartData,
    xMax,
    yMax
  );

  const {
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipLeft = 0,
    tooltipTop = 0,
  } = useTooltip<DataPoint | Record<string, DataPoint>>();

  const handlePointerMove = (
    event: React.TouchEvent<SVGRectElement> | React.MouseEvent<SVGRectElement>
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
      (zone) => xValue >= zone.start && xValue <= zone.end
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
      <svg width={width} height={height}>
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
                stroke="#94a3b8"
                strokeWidth={1}
                strokeDasharray="4,4"
              />
              <text
                x={hoverX}
                y={yMax + 14}
                textAnchor="middle"
                fill="#94a3b8"
                fontSize={12}
              >
                {formatCurrency(xScale.invert(hoverX), true)}
              </text>
            </>
          )}

          {/* Current revenue indicator */}
          <line
            x1={xScale(currentRevenue)}
            y1={0}
            x2={xScale(currentRevenue)}
            y2={yMax}
            stroke="#6366f1"
            strokeWidth={2}
            strokeDasharray="4,4"
          />
          <text
            x={xScale(currentRevenue)}
            y={yMax + 40}
            textAnchor="middle"
            fill="#6366f1"
            fontSize={12}
          >
            {formatCurrency(currentRevenue)}
          </text>

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
            <div className="space-y-1 bg-accent-content p-3">
              <div className="font-bold text-neutral-content">
                Model: {tooltipData.taxModel}
              </div>
              <div className="text-blue-500">
                Prihodki: {formatCurrency(tooltipData.revenue, true)}
              </div>
              <div className="text-accent">
                Efektivna davčna mera:{" "}
                {asPercent(tooltipData.effectiveTaxRate / 100)}
              </div>
              <div className="text-red-500">
                Stroški:{" "}
                {formatCurrency(
                  (tooltipData.expenseRate / 100) * tooltipData.revenue,
                  true
                )}
                ({asPercent(tooltipData.expenseRate / 100)})
              </div>
              <div className="text-red-500">
                Davek: {formatCurrency(tooltipData.tax, true)}
              </div>
              <div className="text-green-500">
                Čisti dobiček:{" "}
                {formatCurrency(
                  (tooltipData.cistiPrihodkiRate / 100) * tooltipData.revenue,
                  true
                )}
              </div>
            </div>
          ) : (
            <table className="table-sm table-zebra bg-gray-200 dark:bg-gray-900 text-base-content rounded-lg shadow-md">
              <thead>
                <tr>
                  <th></th>
                  <th className="text-green-500">Čisti dobiček</th>
                  <th className="text-red-500">Davek</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(tooltipData)
                  .sort(
                    ([, a], [, b]) => a.effectiveTaxRate - b.effectiveTaxRate
                  )
                  .map(([model, data]) => {
                    return (
                      <tr key={model}>
                        <td style={{ color: taxModesByShortName[model].color }}>
                          {model}
                        </td>
                        <td>
                          <span className="font-bold">
                            {asPercent(data.cistiPrihodkiRate / 100)}
                          </span>
                          <div className="text-sm text-gray-500">
                            {formatCurrency(
                              (data.cistiPrihodkiRate / 100) * data.revenue,
                              true
                            )}
                          </div>
                        </td>
                        <td>
                          <span className="font-bold">
                            {asPercent(data.effectiveTaxRate / 100)}
                          </span>
                          <div className="text-sm text-gray-500">
                            {formatCurrency(data.tax, true)}
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
  data: DataPoint | Record<string, DataPoint>
): data is DataPoint {
  return (data as DataPoint).revenue !== undefined;
}
