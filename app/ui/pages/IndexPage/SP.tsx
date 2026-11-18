import type { SharedInputs, YearSettings } from "~/constants/types";
import {
  TreeBreakdown,
  TreeItem,
} from "~/ui/common/TreeBreakdown/TreeBreakdown";
import formatCurrency from "~/utils/formatCurrency";
import asPercent from "~/utils/asPercent";
import {
  ChartDecreaseIcon,
  CapStraightIcon,
  CalculateIcon,
  Coins01Icon,
  Layers02Icon,
  SaveMoneyEuroIcon,
  BankIcon,
  HealthIcon,
  Coins02Icon,
} from "hugeicons-react";
import taxModes from "~/utils/taxModes";
import { prispevekItem } from "~/utils/treedata";
import { getSPData } from "~/utils/taxCalculator/sp";

interface SPProps {
  currentSettings: YearSettings;
  sharedInputs: SharedInputs;
}

export function SP({ currentSettings, sharedInputs }: SPProps) {
  const { zavarovanecOZPEur } = currentSettings;

  const {
    effectiveTaxRate,
    totalTax,
    taxBase,
    dohodnina,
    totalNet,
    prispevki,
    lanskiPrispevki,
    zavarovalnaOsnova,
    dobicek,
    bracket,
    prispevkiRate,
    cistiPrihodki,
    cistiPrihodkiRate,
    expenseRate,
    taxRelief,
    olajsavaVzdrzevani,
    pdpzOlajsava,
  } = getSPData(sharedInputs, currentSettings);

  const treeData: TreeItem[] = [
    {
      label: taxModes.SP.shortName,
      color: "gray",
      description: "Tukaj smatramo polni SP",
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
              value: formatCurrency(taxBase),
              icon: <CapStraightIcon className="w-5 h-5" />,
              color: "gray",
              description: "Prihodki - Prispevki - Olajšave - Stroški",
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
                ...(pdpzOlajsava > 0
                  ? [
                      {
                        label: "PDPZ olajšava",
                        color: "blue" as const,
                        value: formatCurrency(pdpzOlajsava),
                      },
                    ]
                  : []),
                {
                  label: "Stroški",
                  color: "blue",
                  value: formatCurrency(sharedInputs.expenses),
                },
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
          label: "Prispevki",
          value: formatCurrency(prispevki),
          icon: <SaveMoneyEuroIcon className="w-5 h-5" />,
          color: "red",
          children: [
            {
              icon: <HealthIcon className="w-5 h-5" />,
              label: "Obvezni zdravstveni prispevek",
              tooltip: "35 € mesecni pavsal",
              value: formatCurrency(zavarovanecOZPEur * 12),
              color: "red",
            },
            {
              label: "Zavarovalna osnova",
              value: formatCurrency(zavarovalnaOsnova),
              icon: <CalculateIcon className="w-5 h-5" />,
              color: "gray",
              tooltip: "ZPIZ-2 145-clen",
              children: [
                {
                  label: "Lanski Prispevki",
                  value: formatCurrency(lanskiPrispevki),
                },
                {
                  label: "Dobiček",
                  value: formatCurrency(dobicek),
                },
              ],
            },
            {
              label: "Procentualni prispevki",
              value: formatCurrency(zavarovalnaOsnova * prispevkiRate),
              subValue: asPercent(prispevkiRate),
              icon: <CalculateIcon className="w-5 h-5" />,
              color: "red",
              children: [
                prispevekItem(
                  "PIZ",
                  currentSettings.zavarovanecPIZrate +
                    currentSettings.delodajalecPIZrate,
                  zavarovalnaOsnova
                ),
                prispevekItem(
                  "Zdravstveno zavarovanje",
                  currentSettings.zavarovanecZZZSrate +
                    currentSettings.delodajalecZZZSrate,
                  zavarovalnaOsnova
                ),
                prispevekItem(
                  "Starsevsko varstvo",
                  currentSettings.zavarovanecStarsevsko +
                    currentSettings.delodajalecStarsevsko,
                  zavarovalnaOsnova
                ),
                prispevekItem(
                  "Primer Brezposelnost",
                  currentSettings.zavarovanecBrezposelnost +
                    currentSettings.delodajalecBrezposelnost,
                  zavarovalnaOsnova
                ),
                prispevekItem(
                  "Za poskodbe in bolezni",
                  currentSettings.delodajalecPoskodbe,
                  zavarovalnaOsnova
                ),
                ...(currentSettings.zavarovanecDOrate > 0
                  ? [
                      prispevekItem(
                        "Dolgotrajne oskrbe",
                        currentSettings.zavarovanecDOrate +
                          currentSettings.delodajalecDOrate,
                        zavarovalnaOsnova
                      ),
                    ]
                  : []),
              ],
            },
          ],
        },
      ],
    },
    {
      label: "Čisti prihodki",
      value: `${asPercent(cistiPrihodkiRate)} - ${formatCurrency(
        cistiPrihodki
      )}`,
      icon: <Coins02Icon className="w-5 h-5" />,
      color: "green",
      children: [
        {
          label: "Neto",
          value: formatCurrency(totalNet),
          icon: <Coins01Icon className="w-5 h-5" />,
          color: "green",
        },
        {
          label: "Stroški",
          value: `${asPercent(expenseRate)} - ${formatCurrency(
            sharedInputs.expenses
          )}`,
          icon: <ChartDecreaseIcon className="w-5 h-5" />,
          color: sharedInputs.expenses > 0 ? "red" : "yellow",
        },
      ],
    },
  ];

  return <TreeBreakdown items={treeData} />;
}
