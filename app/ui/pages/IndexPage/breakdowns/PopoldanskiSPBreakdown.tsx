import {
  BankIcon,
  CalculateIcon,
  CapStraightIcon,
  Layers02Icon,
} from "hugeicons-react";
import {
  TreeBreakdown,
  type TreeItem,
} from "~/ui/common/TreeBreakdown/TreeBreakdown";
import { evri, stopnja } from "~/utils/numberFormat";
import { getPopoldanskiSPData } from "~/utils/taxCalculator/popoldanskiSp";
import {
  davkiInPrispevkiItem,
  getPopoldanskiPrispevkiTreeItem,
  kakoGaDobis,
  ostaneTiRacunItem,
  stroskiItems,
} from "~/utils/treedata";
import type { BreakdownProps } from "./types";

export function PopoldanskiSPBreakdown({
  currentSettings,
  sharedInputs,
}: BreakdownProps) {
  const {
    totalTax,
    dohodnina,
    davcnaOsnovaSP,
    dohodninaSamoPlaca,
    dohodninaSkupaj,
    mejnaStopnja,
    prispevki,
    cistiPrihodki,
  } = getPopoldanskiSPData(sharedInputs, currentSettings);
  const prihodki = sharedInputs.revenue;

  const treeData: TreeItem[] = [
    davkiInPrispevkiItem(totalTax, prihodki, [
      {
        label: "Dohodnina zaradi s. p.",
        tooltip: "Dohodnina od plače in s. p. − dohodnina samo od plače",
        value: evri(dohodnina),
        icon: <BankIcon className="size-5" />,
        color: "red",
        children: [
          {
            label: "Davčna osnova s. p.",
            value: evri(davcnaOsnovaSP),
            icon: <CapStraightIcon className="size-5" />,
            color: "gray",
            description: "Prihodki − stroški − prispevki",
          },
          {
            label: "Dohodnina od plače in s. p.",
            value: evri(dohodninaSkupaj),
            icon: <Layers02Icon className="size-5" />,
            color: "gray",
          },
          {
            label: "Dohodnina samo od plače",
            value: evri(dohodninaSamoPlaca),
            icon: <Layers02Icon className="size-5" />,
            color: "gray",
          },
          {
            label: "Mejna stopnja",
            value: stopnja(mejnaStopnja),
            icon: <CalculateIcon className="size-5" />,
            color: "gray",
          },
        ],
      },
      getPopoldanskiPrispevkiTreeItem(prispevki),
    ]),
    ...stroskiItems(sharedInputs, "Znižajo davčno osnovo"),
    ostaneTiRacunItem({
      ostane: cistiPrihodki,
      prihodki,
      prihodkiLabel: "Prihodki s.\u00a0p.",
      kakoGaDobis: kakoGaDobis.popoldanskiSp,
      stroski: sharedInputs.expenses,
      odbitki: [
        { label: "Prispevki (pavšal)", znesek: prispevki.skupaj },
        { label: "Dohodnina zaradi s.\u00a0p.", znesek: dohodnina },
      ],
    }),
  ];

  return <TreeBreakdown items={treeData} />;
}
