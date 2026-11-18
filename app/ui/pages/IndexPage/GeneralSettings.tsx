import { useNumberFormat, format } from "@react-input/number-format";
import { AnimatePresence, motion } from "framer-motion";
import {
  Alert02Icon,
  ArrowDown01Icon,
  ArrowUp01Icon,
  EuroReceiveIcon,
  EuroSendIcon,
  MinusSignIcon,
  PlusSignIcon,
  Settings03Icon,
} from "hugeicons-react";
import { useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import { SharedInputs, YearSettings } from "~/constants/types";
import useVisibilityState from "~/hooks/useVisibilityState";
import { Button } from "~/ui/common/Button/Button";
import { Card } from "~/ui/common/Card/Card";
import { Input } from "~/ui/common/Input/Input";
import { Text } from "~/ui/common/Text/Text";
import { parseCurrency, currencyOptions } from "~/utils/formatCurrency";
import ExtraSettings from "./ExtraSettings";

interface GeneralSettingsProps {
  sharedInputs: SharedInputs;
  updateSharedInputs: (newSharedInputs: Partial<SharedInputs>) => void;
  currentSettings: YearSettings;
  updateCurrentSettings: (settings: YearSettings) => void;
  haveSettingsChanged: boolean;
}

const useCurrencyInput = (
  value: number,
  onChange: (value: number) => void,
  {
    min,
    max,
  }: {
    min?: number;
    max?: number;
  } = {}
) => {
  const inputRef = useNumberFormat(currencyOptions);

  const increase = () => {
    onChange(Math.min(value + 1000, typeof max === "number" ? max : Infinity));
  };
  const decrease = () => {
    onChange(Math.max(value - 1000, typeof min === "number" ? min : -Infinity));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newVal = parseCurrency(e.target.value || "0");
    onChange(
      Math.min(
        Math.max(newVal, typeof min === "number" ? min : -Infinity),
        typeof max === "number" ? max : Infinity
      )
    );
  };

  const handleIncrease = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    increase();
  };

  const handleDecrease = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    decrease();
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "ArrowUp") {
      e.preventDefault();
      e.stopPropagation();
      increase();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      e.stopPropagation();
      decrease();
    }
  };

  return {
    inputRef,
    handleChange,
    handleIncrease,
    handleDecrease,
    handleKeyPress,
  };
};

function YouHaveChanges() {
  return (
    <div className="flex items-center gap-2 text-accent">
      <Alert02Icon className="size-5" />
      <span className="text-sm opacity-80">Spremenjene nastavitve</span>
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

  return (
    <>
      <AnimatePresence>
        {isAbove && (
          <motion.div
            className="fixed top-0 flex flex-col left-0 w-full px-4 bg-base-100 z-10 shadow-lg shadow-gray-500/50 max-h-full overflow-y-scroll"
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -40 }}
          >
            <div className="flex flex-row justify-center container max-w-screen-lg gap-2 mx-auto">
              <GeneralSettingsContent
                labelClassName="pr-0 @sm:pr-0 @sm:input-md input-sm"
                {...props}
              />
            </div>
            <div className="flex flex-row items-center gap-4 mx-auto">
              <Button
                className="my-2"
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(!isOpen)}
              >
                {isOpen ? (
                  <ArrowUp01Icon className="size-5 inline-block" />
                ) : (
                  <ArrowDown01Icon className="size-5 inline-block" />
                )}
                &nbsp; Več nastavitev
              </Button>
              {haveSettingsChanged && <YouHaveChanges />}
            </div>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="max-w-screen-lg mx-auto"
                >
                  <ExtraSettings
                    currentSettings={currentSettings}
                    updateCurrentSettings={updateCurrentSettings}
                    updateSharedInputs={updateSharedInputs}
                    sharedInputs={sharedInputs}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </AnimatePresence>
      <Card className={twMerge("card-body")} ref={componentRef}>
        <Text variant="h2">Splošne nastavitve</Text>
        <GeneralSettingsContent labelClassName="pr-0" {...props} />
        <div className="flex flex-row items-center gap-4 mt-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => dialogRef.current?.showModal()}
          >
            <Settings03Icon className="size-5" />
            Več nastavitev
          </Button>
          {haveSettingsChanged && <YouHaveChanges />}
        </div>
        <dialog className="modal" ref={dialogRef}>
          <div className="modal-box">
            <h3 className="font-bold text-lg">Dodatne Nastavitve</h3>
            <ExtraSettings
              updateSharedInputs={updateSharedInputs}
              currentSettings={currentSettings}
              updateCurrentSettings={updateCurrentSettings}
              sharedInputs={sharedInputs}
            />
            <form method="dialog">
              <Button variant="accent">Zapri</Button>
            </form>
          </div>
          <form method="dialog" className="modal-backdrop">
            <button>close</button>
          </form>
        </dialog>
      </Card>
    </>
  );
}

function GeneralSettingsContent({
  sharedInputs,
  updateSharedInputs,
  labelClassName,
}: GeneralSettingsProps & { labelClassName?: string }) {
  const revenueInput = useCurrencyInput(
    sharedInputs.revenue,
    (revenue) => updateSharedInputs({ revenue }),
    {}
  );
  const expensesInput = useCurrencyInput(
    sharedInputs.expenses,
    (expenses) => updateSharedInputs({ expenses }),
    {
      max: sharedInputs.revenue,
    }
  );
  return (
    <>
      <div className="@container flex-1">
        <Input
          ref={revenueInput.inputRef}
          icon={<EuroReceiveIcon className="size-5 hidden @sm:block" />}
          onKeyDown={revenueInput.handleKeyPress}
          labelClassName={labelClassName}
          className=""
          inputClassName="w-[96px]"
          suffix={
            <Steppers
              onIncrease={revenueInput.handleIncrease}
              onDecrease={revenueInput.handleDecrease}
            />
          }
          label="Letni prihodki"
          value={format(sharedInputs.revenue, currencyOptions)}
          onChange={revenueInput.handleChange}
        />
      </div>
      <div className="@container flex-1">
        <Input
          labelClassName={labelClassName}
          ref={expensesInput.inputRef}
          icon={<EuroSendIcon className="size-5 hidden @sm:block" />}
          onKeyDown={expensesInput.handleKeyPress}
          inputClassName="w-[96px]"
          suffix={
            <Steppers
              onIncrease={expensesInput.handleIncrease}
              onDecrease={expensesInput.handleDecrease}
            />
          }
          label="Letni stroški"
          value={format(sharedInputs.expenses, currencyOptions)}
          onChange={expensesInput.handleChange}
        />
      </div>
    </>
  );
}

function Steppers({
  onIncrease,
  onDecrease,
}: {
  onIncrease: (e: React.MouseEvent<HTMLButtonElement>) => void;
  onDecrease: (e: React.MouseEvent<HTMLButtonElement>) => void;
}) {
  const handleIncrease = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onIncrease(e);
  };
  const handleDecrease = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();
    onDecrease(e);
  };
  return (
    <div className="flex flex-row h-full aspect-[2] select-none">
      <button
        onClick={handleIncrease}
        className="hover:bg-gray-600 text-base-content border-l-2 border-r-2 border-gray-600 aspect-square"
      >
        <PlusSignIcon className="size-5 mx-auto" />
      </button>
      <button
        onClick={handleDecrease}
        className="hover:bg-gray-600 rounded-r-md text-base-content aspect-square"
      >
        <MinusSignIcon className="size-5 mx-auto" />
      </button>
    </div>
  );
}
