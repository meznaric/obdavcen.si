import { Calendar03Icon, CoinsEuroIcon, MoneyBag02Icon } from "hugeicons-react";
import { twMerge } from "tailwind-merge";
import { dividendeStopnja } from "~/constants/2026/vlaganje";
import CurrencyInput from "~/ui/common/Input/CurrencyInput";
import { Text } from "~/ui/common/Text/Text";
import { let_, odstotek } from "../format";
import type { TipEtf } from "./usePlaner";
import { NAJVEC_DIVIDEND, NAJVEC_LET, usePlaner } from "./usePlaner";

type Props = Pick<
  ReturnType<typeof usePlaner>,
  | "vnos"
  | "posodobi"
  | "tipEtf"
  | "setTipEtf"
  | "dividendniDonos"
  | "setDividendniDonos"
>;

const vrsteEtf: { tip: TipEtf; oznaka: string }[] = [
  { tip: "akumulacijski", oznaka: "Akumulacijski (Acc)" },
  { tip: "distribucijski", oznaka: "Distribucijski (Dist)" },
];

const pozitivno = (vrednost: number) =>
  Number.isFinite(vrednost) ? Math.max(0, vrednost) : 0;

export function PlanerVnos({
  vnos,
  posodobi,
  tipEtf,
  setTipEtf,
  dividendniDonos,
  setDividendniDonos,
}: Props) {
  return (
    <div className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <CurrencyInput
          icon={<MoneyBag02Icon className="size-5" />}
          label="Enkratni vložek"
          placeholder="0 €"
          value={vnos.enkratniVlozek}
          onChange={(v) => posodobi({ enkratniVlozek: pozitivno(v) })}
          labelClassName="pr-0"
        />
        <CurrencyInput
          icon={<CoinsEuroIcon className="size-5" />}
          label="Mesečni vložek"
          placeholder="0 €"
          value={vnos.mesecniVlozek}
          onChange={(v) => posodobi({ mesecniVlozek: pozitivno(v) })}
          labelClassName="pr-0"
        />
      </div>

      <RangeField
        id="letni-donos"
        label="Pričakovani letni donos"
        prikaz={odstotek(vnos.letniDonos, 1)}
        min={0}
        max={12}
        step={0.5}
        vrednost={vnos.letniDonos * 100}
        onChange={(v) => posodobi({ letniDonos: v / 100 })}
        opis="Skupni donos z dividendami, pred davki in provizijami. Donos ni zagotovljen, zato preizkusi več vrednosti."
      />

      <RangeField
        id="leta"
        label="Denar potrebuješ čez"
        prikaz={let_(vnos.leta)}
        min={1}
        max={NAJVEC_LET}
        step={1}
        vrednost={vnos.leta}
        onChange={(v) => posodobi({ leta: v })}
        ikona={<Calendar03Icon className="size-4" />}
      />

      <div className="flex flex-col w-full">
        <Text variant="label" as="span" className="flex select-none items-center justify-between px-1 py-2">
          Vrsta ETF
        </Text>
        <div className="join w-full" role="group" aria-label="Vrsta ETF">
          {vrsteEtf.map(({ tip, oznaka }) => (
            <button
              key={tip}
              type="button"
              aria-pressed={tipEtf === tip}
              className={twMerge(
                "btn btn-sm join-item flex-1",
                tipEtf === tip && "btn-accent"
              )}
              onClick={() => setTipEtf(tip)}
            >
              {oznaka}
            </button>
          ))}
        </div>
        <Text variant="caption" className="mt-1">
          {tipEtf === "akumulacijski"
            ? "Sklad dividende vloži sam. Davek plačaš šele ob prodaji."
            : `Sklad izplačuje dividende. Na navadnem računu od vsakega izplačila plačaš ${odstotek(dividendeStopnja)}, na INR nič. Ostanek znova vložiš.`}
        </Text>
      </div>

      {tipEtf === "distribucijski" && (
        <RangeField
          id="dividendni-donos"
          label="Od tega dividende na leto"
          prikaz={odstotek(dividendniDonos, 2)}
          min={0}
          max={Math.round(Math.min(NAJVEC_DIVIDEND, vnos.letniDonos) * 10000) / 100}
          step={0.25}
          vrednost={dividendniDonos * 100}
          onChange={(v) => setDividendniDonos(v / 100)}
          opis="Del letnega donosa, ki ga sklad izplača kot dividendo."
        />
      )}
    </div>
  );
}

function RangeField({
  id,
  label,
  prikaz,
  vrednost,
  min,
  max,
  step,
  onChange,
  opis,
  ikona,
}: {
  id: string;
  label: string;
  prikaz: string;
  vrednost: number;
  min: number;
  max: number;
  step: number;
  onChange: (vrednost: number) => void;
  opis?: string;
  ikona?: React.ReactNode;
}) {
  return (
    <div className="flex flex-col w-full">
      <div className="flex select-none items-center justify-between px-1 py-2">
        <label htmlFor={id} className="text-sm text-base-content font-medium flex items-center gap-1">
          {ikona}
          {label}
        </label>
        <span className="badge badge-neutral font-semibold">{prikaz}</span>
      </div>
      <input
        id={id}
        type="range"
        className="range range-sm range-accent"
        min={min}
        max={max}
        step={step}
        value={vrednost}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      {opis && (
        <Text variant="caption" className="mt-1">
          {opis}
        </Text>
      )}
    </div>
  );
}
