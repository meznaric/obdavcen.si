import { AxisBottom, AxisLeft } from "@visx/axis";
import { GridRows } from "@visx/grid";
import { Group } from "@visx/group";
import { useParentSize } from "@visx/responsive";
import { scaleBand, scaleLinear } from "@visx/scale";
import { Bar, LinePath } from "@visx/shape";
import { curveStepAfter } from "@visx/curve";
import { twMerge } from "tailwind-merge";
import { dobicekIzKapitalaStopnje } from "~/constants/2026/vlaganje";
import type { LetoPoteka } from "~/utils/vlaganje";
import { evriCeli, odstotek, poLetih } from "../format";

const visina = 300;
const rob = { top: 16, right: 12, bottom: 40, left: 44 };

// Barve kot razredi Tailwind, besedilo in osi pa v barvi besedila (currentColor),
// da graf deluje v svetlem in temnem načinu.
const barve = {
  stolpec: { fill: "fill-red-500", bg: "bg-red-500" },
  izbran: { fill: "fill-amber-600", bg: "bg-amber-600" },
  inr: { stroke: "stroke-indigo-500", bg: "bg-indigo-500" },
};

// Strežnik (Node) in brskalnik lahko izračunata potence na zadnji decimalki
// različno, zato koordinate zaokrožimo, da se SSR in hidracija ujemata.
const r2 = (v: number) => Math.round(v * 100) / 100;

export function GrafPoLetih({
  potek,
  izbranoLeto,
  onIzberi,
}: {
  potek: LetoPoteka[];
  izbranoLeto: number;
  onIzberi: (leta: number) => void;
}) {
  const { width: sirina = 800, parentRef } = useParentSize({ debounceTime: 50 });
  const xMax = Math.max(0, sirina - rob.left - rob.right);
  const yMax = visina - rob.top - rob.bottom;

  const xScale = scaleBand<number>({
    domain: potek.map((p) => p.leta),
    range: [0, xMax],
    padding: 0.2,
  });
  const najvisja = Math.max(
    dobicekIzKapitalaStopnje[0].stopnja,
    ...potek.map((p) => Math.max(p.stopnjaNaDonos, p.inrStopnjaNaDonos))
  );
  const yScale = scaleLinear<number>({
    domain: [0, najvisja * 1.1],
    range: [yMax, 0],
    nice: true,
  });
  const pragovi = dobicekIzKapitalaStopnje
    .map((s) => s.odLet)
    .filter((leta) => leta > 0);
  const sredina = (leta: number) => (xScale(leta) ?? 0) + xScale.bandwidth() / 2;

  return (
    <div ref={parentRef} className="w-full select-none">
      <svg
        width={sirina}
        height={visina}
        role="img"
        aria-label="Delež donosa, ki ga pojedo davki, glede na leto prodaje"
        className="text-base-content/80"
      >
        <Group left={rob.left} top={rob.top}>
          <GridRows
            scale={yScale}
            width={xMax}
            numTicks={5}
            strokeDasharray="3,3"
            stroke="currentColor"
            strokeOpacity={0.2}
          />
          {pragovi.map((leta) => {
            const x = xScale(leta);
            if (x === undefined) return null;
            const levo = x - (xScale.step() - xScale.bandwidth()) / 2;
            return (
              <g key={leta}>
                <line
                  x1={levo}
                  x2={levo}
                  y1={0}
                  y2={yMax}
                  stroke="currentColor"
                  strokeOpacity={0.5}
                  strokeDasharray="4,4"
                />
                <text x={levo + 4} y={10} fontSize={11} fill="currentColor">
                  {leta} let
                </text>
              </g>
            );
          })}
          {potek.map((p) => {
            const x = xScale(p.leta) ?? 0;
            const y = r2(yScale(p.stopnjaNaDonos));
            const izbran = p.leta === izbranoLeto;
            return (
              <g key={p.leta}>
                <Bar
                  x={x}
                  y={y}
                  width={xScale.bandwidth()}
                  height={r2(yMax - y)}
                  className={izbran ? barve.izbran.fill : barve.stolpec.fill}
                  rx={2}
                />
                {/* Nevidna večja površina za klik in namig. Za tipkovnico je
                    namenjen drsnik »Denar potrebuješ čez«. */}
                <rect
                  aria-hidden="true"
                  x={x - (xScale.step() - xScale.bandwidth()) / 2}
                  y={0}
                  width={xScale.step()}
                  height={yMax}
                  fill="transparent"
                  className="cursor-pointer"
                  onClick={() => onIzberi(p.leta)}
                >
                  <title>
                    {`Prodaja ${poLetih(p.leta)}: navadni račun ${odstotek(p.stopnjaNaDonos, 1)} donosa (ostane ${evriCeli(p.neto)}), INR ${odstotek(p.inrStopnjaNaDonos, 1)} (ostane ${evriCeli(p.inrNeto)})`}
                  </title>
                </rect>
              </g>
            );
          })}
          <LinePath
            data={potek}
            x={(p) => sredina(p.leta)}
            y={(p) => r2(yScale(p.inrStopnjaNaDonos))}
            className={barve.inr.stroke}
            strokeWidth={2.5}
            curve={curveStepAfter}
          />
          <AxisLeft
            scale={yScale}
            numTicks={5}
            tickFormat={(v) => odstotek(Number(v))}
            stroke="currentColor"
            tickStroke="currentColor"
            tickLabelProps={{ fill: "currentColor", fontSize: 11, textAnchor: "end", dx: -4, dy: 3 }}
          />
          <AxisBottom
            top={yMax}
            scale={xScale}
            tickValues={potek.map((p) => p.leta).filter((l) => l === 1 || l % 5 === 0)}
            stroke="currentColor"
            tickStroke="currentColor"
            tickLabelProps={{ fill: "currentColor", fontSize: 11, textAnchor: "middle" }}
            label="Leto prodaje"
            labelProps={{ fill: "currentColor", fontSize: 11, textAnchor: "middle" }}
          />
        </Group>
      </svg>
      <div className="flex flex-wrap justify-center gap-4 text-xs mt-1">
        <Legenda barva={barve.stolpec.bg} oblika="kvadrat">
          Navadni račun: davki v % donosa
        </Legenda>
        <Legenda barva={barve.izbran.bg} oblika="kvadrat">
          Tvoje izbrano leto
        </Legenda>
        <Legenda barva={barve.inr.bg} oblika="crta">
          INR: davki v % donosa
        </Legenda>
      </div>
    </div>
  );
}

function Legenda({
  barva,
  oblika,
  children,
}: {
  barva: string;
  oblika: "kvadrat" | "crta";
  children: React.ReactNode;
}) {
  return (
    <span className="flex items-center gap-1.5">
      <span
        className={twMerge(
          oblika === "kvadrat" ? "size-3 rounded-xs" : "w-4 h-0.5",
          barva
        )}
      />
      {children}
    </span>
  );
}
