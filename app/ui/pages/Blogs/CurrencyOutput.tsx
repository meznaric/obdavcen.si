import { getPrivzeteNastavitve } from "~/constants";
import { allTaxModes } from "~/utils/taxModes";
import { useSelector } from "@xstate/store-react";
import { store } from "~/utils/store";
import type { AnalyzableData } from "~/utils/taxCalculator/types";
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
  taxMode: keyof typeof allTaxModes;
  dataPoint: DataPointTypes;
  revenue?: number;
  expenses?: number;
  // Letna bruto plača iz zaposlitve (za oblike ob zaposlitvi, npr. popoldanski s. p.)
  zaposlitevBruto?: number;
};

// Barve tem so berljive v svetli in temni temi (glej app/tailwind.css)
const colorMap: Record<DataPointTypes, string> = {
  effectiveTaxRate: "text-error",
  expenseRate: "text-error",
  totalExpenses: "text-error",
  cistiPrihodkiRate: "text-success",
  totalTax: "text-error",
  totalRevenue: "text-info",
  totalNet: "text-success",
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
  // Ostane ti: prihodki − davki in prispevki − stroški
  if (dataPoint === "totalNet") {
    return formatCurrency(result.cistiPrihodki);
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
    return "delež stroškov";
  }
  if (dataPoint === "cistiPrihodkiRate") {
    return "delež, ki ti ostane";
  }
  if (dataPoint === "totalTax") {
    return "davki in prispevki skupaj";
  }
  if (dataPoint === "totalRevenue") {
    return "prihodki skupaj";
  }
  if (dataPoint === "totalNet") {
    return "ostane ti: prihodki − davki in prispevki − stroški";
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
  zaposlitevBruto,
}: Props) {
  const currentTaxMode = allTaxModes[taxMode];
  const sharedInputsGlobal = useSelector(store, (state) => state.context);
  // Enake privzete nastavitve kot v kalkulatorju na prvi strani
  const currentSettings = getPrivzeteNastavitve(2026);
  const maxRevenue = currentTaxMode.getMaxRevenue?.(currentSettings) ?? Infinity;
  const sharedInputs: SharedInputs = {
    revenue: Math.min(
      revenue || sharedInputsGlobal.revenue,
      maxRevenue
    ),
    expenses: expenses ?? sharedInputsGlobal.expenses,
    salaryGross1: getMinimalnaOsnova(currentSettings.averageIncomeLastYear),
    zaposlitevBruto: zaposlitevBruto ?? sharedInputsGlobal.zaposlitevBruto,
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
