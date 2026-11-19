import { AnimatePresence, motion } from "motion/react";
import {
  Alert02Icon,
  ArrowDown01Icon,
  ArrowUp01Icon,
  Briefcase01Icon,
  EuroReceiveIcon,
  EuroSendIcon,
  MinusSignIcon,
  PlusSignIcon,
  Settings03Icon,
} from "hugeicons-react";
import { useEffect, useId, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import type { SharedInputs, YearSettings } from "~/constants/types";
import useVisibilityState from "~/hooks/useVisibilityState";
import { Button } from "~/ui/common/Button/Button";
import CurrencyInput from "~/ui/common/Input/CurrencyInput";
import { Text } from "~/ui/common/Text/Text";
import { evri } from "~/utils/numberFormat";
import ExtraSettings from "./ExtraSettings";
import type {
  UpdateCurrentSettings,
  UpdateSharedInputs,
} from "./useSharedInputs";

type Vnosi = SharedInputs & { imaZaposlitev: boolean };

interface GeneralSettingsProps {
  sharedInputs: Vnosi;
  updateSharedInputs: UpdateSharedInputs;
  currentSettings: YearSettings;
  updateCurrentSettings: UpdateCurrentSettings;
  haveSettingsChanged: boolean;
}

// Znesek v celih evrih z gumboma +/− in puščicama gor/dol (po 1.000 €)
const useCurrencyInput = (
  value: number,
  onChange: (value: number) => void,
  { min = 0, max = Infinity }: { min?: number; max?: number } = {}
) => {
  const omeji = (v: number) => Math.min(Math.max(v, min), max);

  const increase = () => onChange(omeji(value + 1000));
  const decrease = () => onChange(omeji(value - 1000));

  const handleChange = (v: number) => onChange(omeji(v));

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      increase();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      decrease();
    }
  };

  return { handleChange, increase, decrease, handleKeyPress };
};

function YouHaveChanges() {
  return (
    <span className="flex items-center gap-2 text-sm text-accent">
      <Alert02Icon className="size-5" aria-hidden="true" />
      Spremenjene nastavitve
    </span>
  );
}

// Opozori, če je letna plača nižja od 12 minimalnih plač – vse tri oblike ob
// zaposlitvi zahtevajo zaposlitev za polni delovni čas, pogosta napaka pa je
// vnos mesečne namesto letne plače.
function PlacaDescription({
  zaposlitevBruto,
  minimalnaPlaca,
}: {
  zaposlitevBruto: number;
  minimalnaPlaca: number;
}) {
  if (zaposlitevBruto <= 0) return null;
  const letnaMinimalnaPlaca = minimalnaPlaca * 12;
  if (zaposlitevBruto < letnaMinimalnaPlaca) {
    return (
      <Text
        variant="caption"
        className="mt-1 block text-amber-800 dark:text-amber-300"
      >
        Za polni delovni čas je letna bruto plača najmanj{" "}
        {evri(letnaMinimalnaPlaca)} (12 minimalnih plač).
      </Text>
    );
  }
  return (
    <Text variant="caption" className="mt-1 block">
      {evri(zaposlitevBruto / 12)} bruto na mesec
    </Text>
  );
}

function ZaposlitevQuestion({
  imaZaposlitev,
  onChange,
}: {
  imaZaposlitev: boolean;
  onChange: (imaZaposlitev: boolean) => void;
}) {
  const name = useId();
  const labelId = useId();
  const options = [
    { value: false, label: "Ne, to bo moj edini dohodek" },
    { value: true, label: "Da, to bo dodaten dohodek" },
  ];
  return (
    // id je sidro za povezave /#zaposlitev (članek, novosti); scroll-mt pusti
    // prostor za lepljivo vrstico z vnosi na vrhu
    <div
      id="zaposlitev"
      role="radiogroup"
      aria-labelledby={labelId}
      className="mt-3 scroll-mt-40 sm:flex sm:items-center sm:gap-4"
    >
      <span
        id={labelId}
        className="block shrink-0 px-1 py-2 text-sm font-medium sm:py-0"
      >
        Že imaš redno zaposlitev?
      </span>
      <span className="grid grid-cols-1 gap-2 sm:flex sm:flex-wrap">
        {options.map(({ value, label }) => (
          <label
            key={label}
            className={twMerge(
              "flex cursor-pointer items-center gap-2 rounded-field border border-base-300 px-3 py-2 text-sm transition-colors hover:bg-base-200 has-focus-visible:outline-2 has-focus-visible:outline-accent",
              imaZaposlitev === value &&
                "border-accent bg-accent/10 font-medium hover:bg-accent/10"
            )}
          >
            <input
              type="radio"
              name={name}
              className="radio radio-xs radio-accent"
              checked={imaZaposlitev === value}
              onChange={() => onChange(value)}
            />
            {label}
          </label>
        ))}
      </span>
    </div>
  );
}

export function GeneralSettings(props: GeneralSettingsProps) {
  const [componentRef, visibilityState] = useVisibilityState();
  const isAbove = visibilityState === "above";
  const {
    currentSettings,
    updateCurrentSettings,
    updateSharedInputs,
    haveSettingsChanged,
    sharedInputs,
  } = props;
  const dialogRef = useRef<HTMLDialogElement>(null);
  const [isOpen, setIsOpen] = useState(false);

  // Povezave /#zaposlitev odprejo primerjavo ob redni zaposlitvi
  useEffect(() => {
    if (window.location.hash !== "#zaposlitev") return;
    updateSharedInputs({ imaZaposlitev: true });
    requestAnimationFrame(() =>
      document.getElementById("zaposlitev")?.scrollIntoView()
    );
  }, [updateSharedInputs]);

  const extraSettings = (
    <ExtraSettings
      currentSettings={currentSettings}
      updateCurrentSettings={updateCurrentSettings}
      updateSharedInputs={updateSharedInputs}
      sharedInputs={sharedInputs}
    />
  );

  return (
    <>
      <AnimatePresence>
        {isAbove && (
          <motion.div
            className="fixed top-0 left-0 z-10 flex max-h-full w-full flex-col overflow-y-auto border-b border-base-300 bg-base-100 px-4 shadow-lg"
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
          >
            <div className="container mx-auto flex max-w-(--breakpoint-lg) flex-row justify-center gap-2">
              <CurrencyFields
                compact
                labelClassName="input-sm pr-0 @sm:h-10 @sm:pl-3"
                {...props}
              />
            </div>
            <div className="mx-auto flex flex-row items-center gap-4">
              <Button
                className="my-1"
                variant="ghost"
                size="sm"
                aria-expanded={isOpen}
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? (
                  <ArrowUp01Icon className="size-5" aria-hidden="true" />
                ) : (
                  <ArrowDown01Icon className="size-5" aria-hidden="true" />
                )}
                Več nastavitev
              </Button>
              {haveSettingsChanged && <YouHaveChanges />}
            </div>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="mx-auto w-full max-w-(--breakpoint-lg)"
                >
                  {extraSettings}
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
      <div
        ref={componentRef}
        className="rounded-box border border-base-300 bg-base-100 p-4 shadow-sm sm:px-6 sm:py-4"
      >
        <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:grid-cols-2">
          <CurrencyFields labelClassName="pr-0" {...props} />
        </div>
        <ZaposlitevQuestion
          imaZaposlitev={sharedInputs.imaZaposlitev}
          onChange={(imaZaposlitev) => updateSharedInputs({ imaZaposlitev })}
        />
        <AnimatePresence initial={false}>
          {sharedInputs.imaZaposlitev && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="-mx-1 overflow-hidden"
            >
              {/* Odmik, da overflow-hidden ne odreže obrobe ob fokusu */}
              <div className="p-1 sm:w-1/2 sm:pr-3">
                <PlacaField {...props} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2">
          <Button
            variant="ghost"
            size="sm"
            className="-ml-3 h-auto min-h-8 max-w-[calc(100%+0.75rem)] shrink flex-nowrap justify-start py-1 text-left whitespace-normal"
            onClick={() => dialogRef.current?.showModal()}
          >
            <Settings03Icon className="size-5" aria-hidden="true" />
            Več nastavitev (olajšave, prvo leto s.&nbsp;p., d.&nbsp;o.&nbsp;o.)
          </Button>
          {haveSettingsChanged && <YouHaveChanges />}
        </div>
        <dialog
          className="modal"
          ref={dialogRef}
          aria-labelledby="dodatne-nastavitve"
        >
          <div className="modal-box">
            <h3 id="dodatne-nastavitve" className="text-lg font-bold">
              Dodatne nastavitve
            </h3>
            {extraSettings}
            <form method="dialog">
              <Button variant="accent">Zapri</Button>
            </form>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>Zapri</button>
          </form>
        </dialog>
      </div>
    </>
  );
}

// Polje za plačo, na katerega skoči gumb »Imam redno zaposlitev« v lestvici
export const PLACA_INPUT_ID = "placa-iz-zaposlitve";

function PlacaField({
  sharedInputs,
  updateSharedInputs,
  currentSettings,
  compact,
  labelClassName,
}: GeneralSettingsProps & { compact?: boolean; labelClassName?: string }) {
  const zaposlitevBruto = sharedInputs.zaposlitevBruto ?? 0;
  const placaInput = useCurrencyInput(zaposlitevBruto, (value) =>
    updateSharedInputs({ zaposlitevBruto: value })
  );
  return (
    <div className="@container flex-1">
      <CurrencyInput
        icon={
          <Briefcase01Icon
            className="hidden size-5 @sm:block"
            aria-hidden="true"
          />
        }
        onKeyDown={placaInput.handleKeyPress}
        labelClassName={labelClassName}
        inputClassName="w-[96px]"
        suffix={
          <Steppers
            onIncrease={placaInput.increase}
            onDecrease={placaInput.decrease}
          />
        }
        id={compact ? undefined : PLACA_INPUT_ID}
        label={compact ? "Bruto plača" : "Letna bruto plača iz zaposlitve"}
        placeholder="npr. 30.000 €"
        value={zaposlitevBruto}
        onChange={placaInput.handleChange}
        description={
          compact ? undefined : (
            <>
              <Text variant="caption" className="mt-1 block">
                Primerjamo popoldanski s.&nbsp;p., normirani popoldanski s.&nbsp;p. in
                d.&nbsp;o.&nbsp;o. ob zaposlitvi.
              </Text>
              <PlacaDescription
                zaposlitevBruto={zaposlitevBruto}
                minimalnaPlaca={currentSettings.minimalnaPlaca}
              />
            </>
          )
        }
      />
    </div>
  );
}

function CurrencyFields(
  props: GeneralSettingsProps & { labelClassName?: string; compact?: boolean }
) {
  const { sharedInputs, updateSharedInputs, labelClassName, compact } = props;
  const revenueInput = useCurrencyInput(sharedInputs.revenue, (revenue) =>
    updateSharedInputs({ revenue })
  );
  const expensesInput = useCurrencyInput(
    sharedInputs.expenses,
    (expenses) => updateSharedInputs({ expenses }),
    { max: sharedInputs.revenue }
  );
  return (
    <>
      <div className="@container flex-1">
        <CurrencyInput
          icon={
            <EuroReceiveIcon
              className="hidden size-5 @sm:block"
              aria-hidden="true"
            />
          }
          onKeyDown={revenueInput.handleKeyPress}
          labelClassName={labelClassName}
          inputClassName="w-[96px]"
          suffix={
            <Steppers
              onIncrease={revenueInput.increase}
              onDecrease={revenueInput.decrease}
            />
          }
          label="Letni prihodki"
          placeholder="0 €"
          value={sharedInputs.revenue}
          onChange={revenueInput.handleChange}
          description={
            compact
              ? undefined
              : sharedInputs.imaZaposlitev
                ? "Prihodki iz dejavnosti poleg plače, brez DDV."
                : "Kar boš na leto zaračunal, brez DDV. Pri zaposlitvi vpiši, koliko te na leto stane delodajalec: pri tujem bruto plačo, pri slovenskem tudi njegove prispevke, regres in povračila."
          }
        />
      </div>
      <div className="@container flex-1">
        <CurrencyInput
          labelClassName={labelClassName}
          icon={
            <EuroSendIcon
              className="hidden size-5 @sm:block"
              aria-hidden="true"
            />
          }
          onKeyDown={expensesInput.handleKeyPress}
          inputClassName="w-[96px]"
          suffix={
            <Steppers
              onIncrease={expensesInput.increase}
              onDecrease={expensesInput.decrease}
            />
          }
          label="Letni stroški"
          placeholder="0 €"
          value={sharedInputs.expenses}
          onChange={expensesInput.handleChange}
          description={
            compact
              ? undefined
              : "Poslovni stroški, npr. oprema, programi in računovodstvo. Pri s. p. (razen normiranega) in d. o. o. znižajo davke, pri drugih oblikah jih plačaš iz tega, kar ti ostane."
          }
        />
      </div>
      {compact && sharedInputs.imaZaposlitev && <PlacaField {...props} />}
    </>
  );
}

function Steppers({
  onIncrease,
  onDecrease,
}: {
  onIncrease: () => void;
  onDecrease: () => void;
}) {
  const handle =
    (action: () => void) => (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      e.stopPropagation();
      action();
    };
  return (
    <span className="flex aspect-[2] h-full flex-row select-none">
      <button
        type="button"
        aria-label="Povečaj za 1.000 €"
        onClick={handle(onIncrease)}
        className="aspect-square border-x border-base-300 text-base-content hover:bg-base-200"
      >
        <PlusSignIcon className="mx-auto size-5" aria-hidden="true" />
      </button>
      <button
        type="button"
        aria-label="Zmanjšaj za 1.000 €"
        onClick={handle(onDecrease)}
        className="aspect-square rounded-r-md text-base-content hover:bg-base-200"
      >
        <MinusSignIcon className="mx-auto size-5" aria-hidden="true" />
      </button>
    </span>
  );
}
