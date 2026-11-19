import { BankIcon, CapStraightIcon } from "hugeicons-react";
import type { IncomeTaxBrackets } from "~/constants/types";
import {
  TreeBreakdown,
  type TreeItem,
} from "~/ui/common/TreeBreakdown/TreeBreakdown";
import izracunDohodnine from "~/utils/dohodnina";
import { evri, stopnja } from "~/utils/numberFormat";
import { getNormiraniPopoldanskiSPData } from "~/utils/taxCalculator/normiraniPopoldanskiSp";
import {
  davkiInPrispevkiItem,
  getPopoldanskiPrispevkiTreeItem,
  kakoGaDobis,
  ostaneTiRacunItem,
  razrediItems,
  stroskiItems,
} from "~/utils/treedata";
import type { BreakdownProps } from "./types";

// »Do 12.500 € prihodkov« / »Nad 30.000 € prihodkov« za vsak pas
function getPasLabel(pasovi: IncomeTaxBrackets, index: number) {
  const { maxNumber } = pasovi[index];
  if (maxNumber) {
    return `Do ${evri(maxNumber)} prihodkov`;
  }
  return `Nad ${evri(pasovi[index - 1]?.maxNumber ?? 0)} prihodkov`;
}

export function NormiraniPopoldanskiSPBreakdown({
  currentSettings,
  sharedInputs,
}: BreakdownProps) {
  const { normiranPopoldanskiOdhodki, normiranPopoldanskiTaxBrackets } =
    currentSettings;
  const {
    totalTax,
    normiraniTax,
    normiraniOdhodki,
    taxBase,
    prispevki,
    cistiPrihodki,
  } = getNormiraniPopoldanskiSPData(sharedInputs, currentSettings);
  const { bracket } = izracunDohodnine(taxBase, normiranPopoldanskiTaxBrackets);
  const prihodki = sharedInputs.revenue;

  const treeData: TreeItem[] = [
    davkiInPrispevkiItem(totalTax, prihodki, [
      {
        label: "Dohodnina",
        tooltip: "Dokončen davek, plača nanj ne vpliva",
        value: evri(normiraniTax),
        icon: <BankIcon className="size-5" />,
        color: "red",
        children: [
          {
            label: "Davčna osnova",
            value: evri(taxBase),
            icon: <CapStraightIcon className="size-5" />,
            color: "gray",
            description: "Prihodki − normirani odhodki",
            children: [
              {
                label: "Normirani odhodki",
                value: evri(normiraniOdhodki),
                color: "blue",
                children: normiranPopoldanskiOdhodki.map((pas, index) => ({
                  label: getPasLabel(normiranPopoldanskiOdhodki, index),
                  value: stopnja(pas.percentage),
                  color: "gray" as const,
                })),
              },
            ],
          },
          ...razrediItems(bracket),
        ],
      },
      getPopoldanskiPrispevkiTreeItem(prispevki),
    ]),
    ...stroskiItems(
      sharedInputs,
      "Ne znižajo davkov – namesto njih se priznajo normirani odhodki"
    ),
    ostaneTiRacunItem({
      ostane: cistiPrihodki,
      prihodki,
      prihodkiLabel: "Prihodki s.\u00a0p.",
      kakoGaDobis: kakoGaDobis.popoldanskiSp,
      stroski: sharedInputs.expenses,
      odbitki: [
        { label: "Prispevki (pavšal)", znesek: prispevki.skupaj },
        { label: "Dohodnina", znesek: normiraniTax },
      ],
    }),
  ];

  return <TreeBreakdown items={treeData} />;
}
