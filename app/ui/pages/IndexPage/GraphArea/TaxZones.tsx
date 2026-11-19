import React from "react";
import { Line } from "@visx/shape";
import { Text } from "@visx/text";
import { PatternLines } from "@visx/pattern";
import { TaxZone } from "./types";
import { taxModesByShortName } from "~/utils/taxModes";

const taxZoneColors = ["#64748b", "#6b7280", "#71717a", "#737373"];

interface TaxZonesProps {
  taxZones: TaxZone[];
  xScale: (value: number) => number;
  yMax: number;
  hoveredZoneIndex: number | null;
  colorful: boolean;
}

export function TaxZones({
  taxZones,
  xScale,
  yMax,
  hoveredZoneIndex,
  colorful,
}: TaxZonesProps) {
  const getColor = (index: number, model: string) => {
    if (!colorful) {
      return taxZoneColors[index];
    }
    return taxModesByShortName[model].color;
  };
  return (
    <>
      {taxZones.map((zone, index) => {
        const lineOffset = 2;
        const color = getColor(index, zone.model);
        return (
          <React.Fragment key={index}>
            <PatternLines
              height={8}
              width={8}
              stroke={color}
              strokeWidth={1}
              orientation={[
                index % 2 === 0 ? "diagonal" : "diagonalRightToLeft",
              ]}
              id={`pattern-${index}`}
            />
            <rect
              x={xScale(zone.start)}
              y={0}
              width={Math.max(xScale(zone.end) - xScale(zone.start), 0)}
              fill={`url(#pattern-${index % 4})`}
              height={yMax}
              opacity={index === hoveredZoneIndex ? 0.9 : 0.5}
            />
            <g>
              <Line
                from={{ x: xScale(zone.start) + 10, y: -5 - lineOffset }}
                to={{ x: xScale(zone.end) - 10, y: -5 - lineOffset }}
                stroke={color}
                strokeWidth={2}
                opacity={index === hoveredZoneIndex ? 1 : 0.5}
              />
              <polygon
                points={`${xScale(zone.start) + 2},${-5 - lineOffset} ${
                  xScale(zone.start) + 8
                },${-9 - lineOffset} ${xScale(zone.start) + 8},${
                  -1 - lineOffset
                }`}
                fill={color}
                opacity={index === hoveredZoneIndex ? 1 : 0.5}
              />
              <polygon
                points={`${xScale(zone.end) - 2},${-5 - lineOffset} ${
                  xScale(zone.end) - 8
                },${-9 - lineOffset} ${xScale(zone.end) - 8},${
                  -1 - lineOffset
                }`}
                fill={color}
                opacity={index === hoveredZoneIndex ? 1 : 0.5}
              />
              <Text
                x={xScale(zone.start)}
                y={(index % 4) * -15 - 15}
                textAnchor="start"
                fill="currentColor"
                fontSize={12}
                fontWeight={index === hoveredZoneIndex ? 700 : 500}
              >
                {zone.model}
              </Text>
            </g>
          </React.Fragment>
        );
      })}
    </>
  );
}
