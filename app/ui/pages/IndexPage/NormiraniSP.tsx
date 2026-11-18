import type { SharedInputs, YearSettings } from "~/constants/types";
import {
  Alert01Icon,
  CalculateIcon,
  CapStraightIcon,
  ChartDecreaseIcon,
  Coins01Icon,
  Coins02Icon,
  HealthIcon,
  SaveMoneyEuroIcon,
} from "hugeicons-react";
import {
  TreeBreakdown,
  TreeItem,
} from "~/ui/common/TreeBreakdown/TreeBreakdown";
import formatCurrency from "~/utils/formatCurrency";
import asPercent from "~/utils/asPercent";
import taxModes from "~/utils/taxModes";
import { prispevekItem } from "~/utils/treedata";
import { getNormiraniSPData } from "~/utils/taxCalculator/normiraniSp";

interface NormiraniSPProps {
  currentSettings: YearSettings;
  sharedInputs: SharedInputs;
}

export function NormiraniSP({
  currentSettings,
  sharedInputs,
}: NormiraniSPProps) {
  const { zavarovanecOZPEur } = currentSettings;

  const maxNormiranSPRevenue = currentSettings.normiranMaxRevenue;

  const {
    effectiveTaxRate,
    totalTax,
    totalNet,
    normiraniTax,
    taxBase,
    prispevki,
    lanskiPrispevki,
    zavarovalnaOsnova,
    dobicek,
    prispevkiRate,
    cistiPrihodki,
    cistiPrihodkiRate,
    expenseRate,
    expenses,
  } = getNormiraniSPData(sharedInputs, currentSettings);

  const firstItem: TreeItem =
    sharedInputs.revenue > maxNormiranSPRevenue
      ? {
          icon: <Alert01Icon className="w-5 h-5" />,
          label: taxModes.NormiraniSP.shortName,
          description: `Če presežeš ${formatCurrency(maxNormiranSPRevenue)} dohodkov, naslednje leto izpadeš iz sistema normirancev.`,
          color: "yellow",
        }
      : {
          label: taxModes.NormiraniSP.shortName,
          description: `Največji dovoljeni prihodki so ${formatCurrency(maxNormiranSPRevenue)}`,
        };

  const treeData: TreeItem[] = [
    firstItem,
    {
      label: "Davek",
      value: `${asPercent(effectiveTaxRate)} - ${formatCurrency(totalTax)}`,
      icon: <ChartDecreaseIcon className="w-5 h-5" />,
      color: "red",
      children: [
        {
          label: "Davek na dobiček",
          value: formatCurrency(normiraniTax),
          icon: <ChartDecreaseIcon className="w-5 h-5" />,
          color: "red",
          children: [
            {
              label: "Davčna Osnova",
              value: formatCurrency(taxBase),
              icon: <CapStraightIcon className="w-5 h-5" />,
              color: "gray",
              description: "Izračunana na podlagi = prihodki - priznani stroški",
            },
            ...currentSettings.normiranTaxBrackets.map((bracket) => ({
              label: bracket.maxNumber
                ? `Do ${formatCurrency(bracket.maxNumber)}`
                : "Nad " +
                  formatCurrency(
                    currentSettings.normiranTaxBrackets[
                      currentSettings.normiranTaxBrackets.length - 2
                    ]?.maxNumber ?? 0
                  ),
              value: asPercent(bracket.percentage),
              icon: <CalculateIcon className="w-5 h-5" />,
              color: "gray" as const,
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
              // tooltip:
              //   "https://zakonodaja.com/zakon/zpiz-2/145-clen-osnove-za-samozaposlene-druzbenike-in-kmete",
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
          label: "Priznani Stroški",
          value: `${asPercent(expenseRate)} - ${formatCurrency(expenses)}`,
          icon: <ChartDecreaseIcon className="w-5 h-5" />,
          color: "blue",
          // color: sharedInputs.expenses > 0 ? "red" : "yellow",
        },
      ],
    },
  ];
  return (
    <div className="flex-1">
      <TreeBreakdown items={treeData} />
    </div>
  );
}
