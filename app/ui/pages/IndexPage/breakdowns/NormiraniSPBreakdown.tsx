import { BankIcon, CapStraightIcon } from "hugeicons-react";
import {
  TreeBreakdown,
  type TreeItem,
} from "~/ui/common/TreeBreakdown/TreeBreakdown";
import izracunDohodnine from "~/utils/dohodnina";
import { delez, evri } from "~/utils/numberFormat";
import { getNormiraniSPData } from "~/utils/taxCalculator/normiraniSp";
import {
  davkiInPrispevkiItem,
  kakoGaDobis,
  ostaneTiRacunItem,
  razrediItems,
  spPrispevkiItem,
  stroskiItems,
} from "~/utils/treedata";
import type { BreakdownProps } from "./types";

export function NormiraniSPBreakdown({
  currentSettings,
  sharedInputs,
}: BreakdownProps) {
  const {
    totalTax,
    normiraniTax,
    taxBase,
    prispevki,
    lanskiPrispevki,
    zavarovalnaOsnova,
    dobicek,
    prispevkiRate,
    cistiPrihodki,
    expenses: normiraniOdhodki,
  } = getNormiraniSPData(sharedInputs, currentSettings);
  const { bracket } = izracunDohodnine(
    taxBase,
    currentSettings.normiranTaxBrackets
  );
  const prihodki = sharedInputs.revenue;

  const treeData: TreeItem[] = [
    davkiInPrispevkiItem(totalTax, prihodki, [
      {
        label: "Dohodnina",
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
                tooltip:
                  prihodki > 0
                    ? `${delez(normiraniOdhodki / prihodki)} prihodkov`
                    : undefined,
                value: evri(normiraniOdhodki),
                color: "blue",
              },
            ],
          },
          ...razrediItems(bracket),
        ],
      },
      spPrispevkiItem({
        prispevki,
        zavarovalnaOsnova,
        prispevkiRate,
        lanskiPrispevki,
        dobicek,
        settings: currentSettings,
      }),
    ]),
    ...stroskiItems(
      sharedInputs,
      "Ne znižajo davkov – namesto njih se priznajo normirani odhodki"
    ),
    ostaneTiRacunItem({
      ostane: cistiPrihodki,
      prihodki,
      kakoGaDobis: kakoGaDobis.sp,
      stroski: sharedInputs.expenses,
      odbitki: [
        { label: "Prispevki", znesek: prispevki },
        { label: "Dohodnina", znesek: normiraniTax },
      ],
    }),
  ];

  return <TreeBreakdown items={treeData} />;
}
