import React from "react";
import {
  ChartDecreaseIcon,
  BankIcon,
  CapStraightIcon,
  Layers02Icon,
  SaveMoneyEuroIcon,
  Coins01Icon,
  CalculateIcon,
  HealthIcon,
} from "hugeicons-react";
import { YearSettings } from "~/constants/types";
import { TreeItem } from "~/ui/common/TreeBreakdown/TreeBreakdown";
import asPercent from "./asPercent";
import formatCurrency from "./formatCurrency";
import { getZavarovanecRate, getDelodajalecRate } from "./prispevki";

export const prispevekItem = (
  label: string,
  value: number,
  salaryGross1: number
) => ({
  label: `${label}`,
  // tooltip: asPercent(value),
  subValue: asPercent(value),
  value: formatCurrency(salaryGross1 * value),
  color: "red" as const,
});

export function getDOOTreeData({
  label,
  effectiveTaxRate,
  totalTax,
  dohodnina,
  dohodninaBase,
  salaryGross1,
  salaryGross2,
  gross1Tax,
  gross2Tax,
  dobicekTax,
  dividendsTax,
  dividendsNet,
  salaryNet,
  // totalNet,
  cistiPrihodki,
  cistiPrihodkiRate,
  totalPrispevki,
  currentSettings,
  bracket,
  expenseRate,
  expenses,
  description,
  taxRelief,
  malicaLetna = 0,
  prevozniStroskiLetni = 0,
  regresLetni = 0,
  pdpzLetni = 0,
  olajsavaVzdrzevani = 0,
  bozicnicaNet = 0,
  bozicnicaEmployeeContrib = 0,
  bozicnicaEmployerContrib = 0,
  nagradaNet = 0,
  nagradaEmployeeContrib = 0,
  nagradaEmployerContrib = 0,
}: {
  label: string;
  effectiveTaxRate: number;
  totalTax: number;
  dohodnina: number;
  dohodninaBase: number;
  salaryGross1: number;
  cistiPrihodki: number;
  cistiPrihodkiRate: number;
  salaryGross2: number;
  gross1Tax: number;
  gross2Tax: number;
  dobicekTax: number;
  dividendsTax: number;
  dividendsNet: number;
  salaryNet: number;
  totalNet: number;
  totalPrispevki: number;
  currentSettings: YearSettings;
  expenseRate: number;
  expenses: number;
  description?: React.ReactNode | string;
  taxRelief: number;
  malicaLetna?: number;
  prevozniStroskiLetni?: number;
  regresLetni?: number;
  pdpzLetni?: number;
  olajsavaVzdrzevani?: number;
  bozicnicaNet?: number;
  bozicnicaEmployeeContrib?: number;
  bozicnicaEmployerContrib?: number;
  nagradaNet?: number;
  nagradaEmployeeContrib?: number;
  nagradaEmployerContrib?: number;
  bracket: ({
    percentage: number;
    maxNumber?: number | undefined;
  } & {
    toPay: number;
  })[];
}): TreeItem[] {
  return [
    {
      label,
      color: "gray",
      description,
    },
    {
      label: "Davek",
      value: `${asPercent(effectiveTaxRate)} - ${formatCurrency(totalTax)}`,
      icon: <ChartDecreaseIcon className="w-5 h-5" />,
      color: "red",
      children: [
        {
          label: "Dohodnina",
          color: "red",
          value: formatCurrency(dohodnina),
          icon: <BankIcon className="w-5 h-5" />,
          children: [
            {
              label: "Davčna Osnova",
              value: formatCurrency(dohodninaBase),
              icon: <CapStraightIcon className="w-5 h-5" />,
              color: "gray",
              description: "Bruto I. Plača - Bruto I. Davek - Olajšave",
              children: [
                {
                  label: "Splošna olajšava",
                  color: "blue",
                  value: formatCurrency(taxRelief),
                },
                ...(olajsavaVzdrzevani > 0
                  ? [
                      {
                        label: "Olajšava za vzdrževane člane",
                        color: "blue" as const,
                        value: formatCurrency(olajsavaVzdrzevani),
                      },
                    ]
                  : []),
              ],
            },
            ...bracket.map(({ percentage, toPay, maxNumber }) => ({
              label: `${asPercent(percentage)} do ${formatCurrency(
                maxNumber || Infinity
              )}`,
              color: toPay > 0 ? ("red" as const) : ("yellow" as const),
              icon: <Layers02Icon className="w-5 h-5" />,
              value: formatCurrency(toPay),
            })),
          ],
        },
        {
          label: "Davek na dividende",
          color: dividendsTax > 0 ? "red" : "yellow",
          value: formatCurrency(dividendsTax),
          icon: <ChartDecreaseIcon className="w-5 h-5" />,
        },
        {
          label: "Davek na dobiček",
          color: dobicekTax > 0 ? "red" : "yellow",
          value: formatCurrency(dobicekTax),
          icon: <ChartDecreaseIcon className="w-5 h-5" />,
        },
        {
          label: "Prispevki",
          color: "red",
          value: formatCurrency(totalPrispevki),
          icon: <SaveMoneyEuroIcon className="w-5 h-5" />,
          children: [
            {
              label: "Prispevki bazirajo na Bruto I. Placi",
              value: formatCurrency(salaryGross1),
              icon: <CalculateIcon className="w-5 h-5" />,
              color: "gray",
            },
            {
              label: `Bruto I. Davek (${asPercent(
                getZavarovanecRate(currentSettings)
              )} + OZP)`,
              value: formatCurrency(gross1Tax),
              icon: <ChartDecreaseIcon className="w-5 h-5" />,
              color: "red",
              children: [
                {
                  color: "red",
                  label: "Obvezni zdravstveni prispevek",
                  tooltip: "35 € mesecni pavsal",
                  value: formatCurrency(currentSettings.zavarovanecOZPEur * 12),
                  icon: <HealthIcon className="w-5 h-5" />,
                },
                prispevekItem(
                  "PIZ",
                  currentSettings.zavarovanecPIZrate,
                  salaryGross1
                ),
                prispevekItem(
                  "Zdravstveno zavarovanje",
                  currentSettings.zavarovanecZZZSrate,
                  salaryGross1
                ),
                prispevekItem(
                  "Starsevsko varstvo",
                  currentSettings.zavarovanecStarsevsko,
                  salaryGross1
                ),
                prispevekItem(
                  "Primer Brezposelnost",
                  currentSettings.zavarovanecBrezposelnost,
                  salaryGross1
                ),
              ],
            },
            {
              label: `Bruto II. Davek (${asPercent(
                getDelodajalecRate(currentSettings)
              )})`,
              value: formatCurrency(gross2Tax),
              icon: <ChartDecreaseIcon className="w-5 h-5" />,
              color: "red",
              children: [
                prispevekItem(
                  "PIZ",
                  currentSettings.delodajalecPIZrate,
                  salaryGross1
                ),
                prispevekItem(
                  "Zdravstveno zavarovanje",
                  currentSettings.delodajalecZZZSrate,
                  salaryGross1
                ),
                prispevekItem(
                  "Starsevsko varstvo",
                  currentSettings.delodajalecStarsevsko,
                  salaryGross1
                ),
                prispevekItem(
                  "Primer Brezposelnost",
                  currentSettings.delodajalecBrezposelnost,
                  salaryGross1
                ),
                prispevekItem(
                  "Za poskodbe in bolezni",
                  currentSettings.delodajalecPoskodbe,
                  salaryGross1
                ),
              ],
            },
            ...(bozicnicaEmployeeContrib + bozicnicaEmployerContrib > 0
              ? [
                  {
                    label: "Prispevki božičnica",
                    value: formatCurrency(bozicnicaEmployeeContrib + bozicnicaEmployerContrib),
                    icon: <SaveMoneyEuroIcon className="w-5 h-5" />,
                    color: "red" as const,
                    description: "Prispevki na božičnico (zavarovanec + delodajalec)",
                  },
                ]
              : []),
            ...(nagradaEmployeeContrib + nagradaEmployerContrib > 0
              ? [
                  {
                    label: "Prispevki nagrada",
                    value: formatCurrency(nagradaEmployeeContrib + nagradaEmployerContrib),
                    icon: <SaveMoneyEuroIcon className="w-5 h-5" />,
                    color: "red" as const,
                    description: "Prispevki na nagrado za poslovno uspešnost (zavarovanec + delodajalec)",
                  },
                ]
              : []),
          ],
        },
      ],
    },
    {
      label: "Čisti prihodki",
      // value: formatCurrency(totalNet),
      value: `${asPercent(cistiPrihodkiRate)} - ${formatCurrency(
        cistiPrihodki
      )}`,
      icon: <Coins01Icon className="w-5 h-5" />,
      color: "green",
      children: [
        {
          label: "Neto Plača",
          value: formatCurrency(salaryNet),
          icon: <Coins01Icon className="w-5 h-5" />,
          color: "green",
          children: [
            {
              label: "Bruto I. Plača",
              value: formatCurrency(salaryGross1),
              icon: <Coins01Icon className="w-5 h-5" />,
              color: "gray",
            },
            {
              label: "Bruto II. Plača - Strosek Podjetja",
              value: formatCurrency(salaryGross2),
              icon: <Coins01Icon className="w-5 h-5" />,
              color: "gray",
            },
          ],
        },
        {
          label: "Dividende",
          value: formatCurrency(dividendsNet),
          icon: <Coins01Icon className="w-5 h-5" />,
          color: dividendsNet > 0 ? "green" : "yellow",
        },
        ...(malicaLetna > 0
          ? [
              {
                label: "Malica",
                value: formatCurrency(malicaLetna),
                icon: <Coins01Icon className="w-5 h-5" />,
                color: "green" as const,
                description: "Povračilo stroškov prehrane — neobdavčeno",
              },
            ]
          : []),
        ...(prevozniStroskiLetni > 0
          ? [
              {
                label: "Prevozni stroški",
                value: formatCurrency(prevozniStroskiLetni),
                icon: <Coins01Icon className="w-5 h-5" />,
                color: "green" as const,
                description: "Povračilo stroškov prevoza na delo — neobdavčeno",
              },
            ]
          : []),
        ...(regresLetni > 0
          ? [
              {
                label: "Regres",
                value: formatCurrency(regresLetni),
                icon: <Coins01Icon className="w-5 h-5" />,
                color: "green" as const,
                description: "Regres za letni dopust — neobdavčen do 100% povprečne plače",
              },
            ]
          : []),
        ...(pdpzLetni > 0
          ? [
              {
                label: "PDPZ",
                value: formatCurrency(pdpzLetni),
                icon: <Coins01Icon className="w-5 h-5" />,
                color: "green" as const,
                description: "Prostovoljno dodatno pokojninsko zavarovanje — strošek podjetja",
              },
            ]
          : []),
        ...(bozicnicaNet > 0
          ? [
              {
                label: "Božičnica",
                value: formatCurrency(bozicnicaNet),
                icon: <Coins01Icon className="w-5 h-5" />,
                color: "green" as const,
                description: "Božičnica / zimski regres — neobdavčena",
              },
            ]
          : []),
        ...(nagradaNet > 0
          ? [
              {
                label: "Nagrada",
                value: formatCurrency(nagradaNet),
                icon: <Coins01Icon className="w-5 h-5" />,
                color: "green" as const,
                description: "Nagrada za poslovno uspešnost — neobdavčena do povprečne plače",
              },
            ]
          : []),
        {
          label: "Stroški",
          value: `${asPercent(expenseRate)} - ${formatCurrency(expenses)}`,
          icon: <ChartDecreaseIcon className="w-5 h-5" />,
          color: expenses > 0 ? "red" : "yellow",
        },
      ],
    },
  ];
}
