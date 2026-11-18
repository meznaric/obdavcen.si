import { settingsByYear } from "~/constants";
import taxModes from "~/utils/taxModes";
import { useSelector } from "@xstate/store/react";
import { store } from "~/utils/store";
import { AnalyzableData } from "~/utils/taxCalculator/types";
import formatCurrency from "~/utils/formatCurrency";
import { twMerge } from "tailwind-merge";
import { SharedInputs } from "~/constants/types";
import { getMinimalnaOsnova } from "~/utils/prispevki";
import asPercent from "~/utils/asPercent";

type DataPointTypes =
  | "effectiveTaxRate"
  | "expenseRate"
  | "cistiPrihodkiRate"
  | "totalTax"
  | "totalRevenue"
  | "totalNet"
  | "totalExpenses";

type Props = {
  taxMode: keyof typeof taxModes;
  dataPoint: DataPointTypes;
  revenue?: number;
  expenses?: number;
};

const colorMap: Record<DataPointTypes, string> = {
  effectiveTaxRate: "text-orange-500",
  expenseRate: "text-red-500",
  totalExpenses: "text-red-500",
  cistiPrihodkiRate: "text-green-500",
  totalTax: "text-red-500",
  totalRevenue: "text-blue-500",
  totalNet: "text-green-500",
};

function getDataPoint(
  result: AnalyzableData,
  dataPoint: DataPointTypes,
  sharedInputs: SharedInputs
) {
  if (dataPoint === "effectiveTaxRate") {
    return asPercent(result.effectiveTaxRate);
  }
  if (dataPoint === "expenseRate") {
    return asPercent(result.expenseRate);
  }
  if (dataPoint === "cistiPrihodkiRate") {
    return asPercent(result.cistiPrihodkiRate);
  }
  if (dataPoint === "totalTax") {
    return formatCurrency(result.totalTax);
  }
  if (dataPoint === "totalRevenue") {
    return formatCurrency(sharedInputs.revenue);
  }
  if (dataPoint === "totalNet") {
    return formatCurrency(sharedInputs.revenue - result.totalTax);
  }
  if (dataPoint === "totalExpenses") {
    return formatCurrency(sharedInputs.expenses);
  }
  return 0;
}

function getDataPointName(dataPoint: DataPointTypes) {
  if (dataPoint === "effectiveTaxRate") {
    return "efektivna davčna stopnja";
  }
  if (dataPoint === "expenseRate") {
    return "procent stroškov";
  }
  if (dataPoint === "cistiPrihodkiRate") {
    return "procent čistih prihodkov";
  }
  if (dataPoint === "totalTax") {
    return "davki skupaj";
  }
  if (dataPoint === "totalRevenue") {
    return "čisti prihodki skupaj";
  }
  if (dataPoint === "totalNet") {
    return "davki skupaj";
  }
  if (dataPoint === "totalExpenses") {
    return "stroški skupaj";
  }
  return 0;
}

export default function CurrencyOutput({
  taxMode,
  dataPoint,
  revenue,
  expenses,
}: Props) {
  const currentTaxMode = taxModes[taxMode];
  const sharedInputsGlobal = useSelector(store, (state) => state.context);
  const currentSettings = settingsByYear[2026];
  const maxRevenue = currentTaxMode.getMaxRevenue?.(currentSettings) ?? Infinity;
  const sharedInputs: SharedInputs = {
    revenue: Math.min(
      revenue || sharedInputsGlobal.revenue,
      maxRevenue
    ),
    expenses: expenses ?? sharedInputsGlobal.expenses,
    salaryGross1: getMinimalnaOsnova(currentSettings.averageIncomeLastYear),
  };
  const result = currentTaxMode.calculator(sharedInputs, currentSettings);
  return (
    <span
      className={twMerge("tooltip font-bold", colorMap[dataPoint])}
      data-tip={getDataPointName(dataPoint)}
    >
      {getDataPoint(result, dataPoint, sharedInputs)}
    </span>
  );
}
