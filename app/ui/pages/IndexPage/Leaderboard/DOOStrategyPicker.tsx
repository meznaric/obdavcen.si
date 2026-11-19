import { useId } from "react";
import { twMerge } from "tailwind-merge";
import type { SharedInputs, YearSettings } from "~/constants/types";
import CurrencyInput from "~/ui/common/Input/CurrencyInput";
import { evri } from "~/utils/numberFormat";
import taxModes from "~/utils/taxModes";
import type { DOOStrategija } from "../breakdowns/DOOBreakdown";
import type { UpdateSharedInputs } from "../useSharedInputs";
import type { DOOIzbira, Vrstica } from "./useLeaderboard";

interface DOOStrategyPickerProps {
  doo: NonNullable<Vrstica["doo"]>;
  dooIzbira: DOOIzbira;
  onDOOIzbira: (izbira: DOOIzbira) => void;
  currentSettings: YearSettings;
  sharedInputs: SharedInputs;
  updateSharedInputs: UpdateSharedInputs;
}

export function DOOStrategyPicker({
  doo,
  dooIzbira,
  onDOOIzbira,
  currentSettings,
  sharedInputs,
  updateSharedInputs,
}: DOOStrategyPickerProps) {
  const name = useId();
  const letnaMinimalnaPlaca = currentSettings.minimalnaPlaca * 12;
  const placa = sharedInputs.salaryGross1;

  function izberi(modeId: DOOStrategija) {
    if (modeId === "DOOPoljubnaPlaca" && placa <= 0) {
      // Brez vnesene plače začnemo pri minimalni plači
      updateSharedInputs({ salaryGross1: letnaMinimalnaPlaca });
    }
    // Izbira najugodnejše pomeni samodejno izbiro, ki sledi vnosom
    onDOOIzbira(modeId === doo.najugodnejsa ? "samodejno" : modeId);
  }

  return (
    <fieldset className="space-y-2">
      <legend className="mb-2 text-sm font-semibold">
        Kako izplačaš denar iz d.&nbsp;o.&nbsp;o.?
      </legend>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
        {doo.strategije.map(({ modeId, ostane }) => {
          const izbrana = doo.prikazana === modeId;
          const brezPlace = modeId === "DOOPoljubnaPlaca" && placa <= 0;
          return (
            <label
              key={modeId}
              className={twMerge(
                "flex cursor-pointer items-start justify-between gap-2 rounded-md border border-base-300 px-3 py-2 text-sm transition-colors hover:bg-base-200/60 has-focus-visible:outline-2 has-focus-visible:outline-accent",
                izbrana && "border-accent bg-accent/10 hover:bg-accent/10"
              )}
            >
              <input
                type="radio"
                name={name}
                className="sr-only"
                checked={izbrana}
                onChange={() => izberi(modeId)}
              />
              <span className="min-w-0">
                <span className="block font-medium">
                  {taxModes[modeId].strategy}
                </span>
                <span className="block text-xs text-muted tabular-nums">
                  {brezPlace ? "Plačo vpišeš sam" : `Ostane ${evri(ostane)}`}
                </span>
              </span>
              {doo.najugodnejsa === modeId && (
                <span className="badge badge-sm shrink-0 badge-accent">
                  najugodnejša
                </span>
              )}
            </label>
          );
        })}
      </div>
      {doo.prikazana === "DOOPoljubnaPlaca" && (
        <CurrencyInput
          label="Bruto plača I na leto"
          className="max-w-xs"
          value={placa}
          onChange={(salaryGross1) => updateSharedInputs({ salaryGross1 })}
          description={
            placa > 0 ? `${evri(placa / 12)} bruto na mesec` : undefined
          }
        />
      )}
      {dooIzbira !== "samodejno" && doo.prikazana !== doo.najugodnejsa && (
        <button
          type="button"
          className="link link-accent text-sm font-medium"
          onClick={() => onDOOIzbira("samodejno")}
        >
          Pokaži najugodnejšo možnost
        </button>
      )}
    </fieldset>
  );
}
