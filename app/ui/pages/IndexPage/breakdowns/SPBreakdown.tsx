import { BankIcon, CapStraightIcon } from "hugeicons-react";
import {
  TreeBreakdown,
  type TreeItem,
} from "~/ui/common/TreeBreakdown/TreeBreakdown";
import { evri } from "~/utils/numberFormat";
import { getSPData } from "~/utils/taxCalculator/sp";
import {
  davkiInPrispevkiItem,
  kakoGaDobis,
  ostaneTiRacunItem,
  razrediItems,
  spPrispevkiItem,
  stroskiItems,
} from "~/utils/treedata";
import type { BreakdownProps } from "./types";

export function SPBreakdown({ currentSettings, sharedInputs }: BreakdownProps) {
  const {
    totalTax,
    taxBase,
    dohodnina,
    prispevki,
    lanskiPrispevki,
    zavarovalnaOsnova,
    dobicek,
    bracket,
    prispevkiRate,
    cistiPrihodki,
    taxRelief,
    olajsavaVzdrzevani,
    pdpzOlajsava,
  } = getSPData(sharedInputs, currentSettings);
  const prihodki = sharedInputs.revenue;

  const odbitki: TreeItem[] = [
    { label: "Stroški", value: evri(sharedInputs.expenses) },
    { label: "Prispevki", value: evri(prispevki) },
    { label: "Splošna olajšava", value: evri(taxRelief) },
    {
      label: "Olajšava za vzdrževane družinske člane",
      value: evri(olajsavaVzdrzevani),
      hidden: olajsavaVzdrzevani <= 0,
    },
    {
      label: "Olajšava za dodatno pokojninsko zavarovanje",
      value: evri(pdpzOlajsava),
      hidden: pdpzOlajsava <= 0,
    },
  ]
    .filter((item) => !("hidden" in item && item.hidden))
    .map(({ label, value }) => ({ label, value, color: "blue" as const }));

  const treeData: TreeItem[] = [
    davkiInPrispevkiItem(totalTax, prihodki, [
      {
        label: "Dohodnina",
        color: "red",
        value: evri(dohodnina),
        icon: <BankIcon className="size-5" />,
        children: [
          {
            label: "Davčna osnova",
            value: evri(taxBase),
            icon: <CapStraightIcon className="size-5" />,
            color: "gray",
            description: "Prihodki − stroški − prispevki − olajšave",
            children: odbitki,
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
    ...stroskiItems(sharedInputs, "Znižajo davčno osnovo"),
    ostaneTiRacunItem({
      ostane: cistiPrihodki,
      prihodki,
      kakoGaDobis: kakoGaDobis.sp,
      stroski: sharedInputs.expenses,
      odbitki: [
        { label: "Prispevki", znesek: prispevki },
        { label: "Dohodnina", znesek: dohodnina },
      ],
    }),
  ];

  return <TreeBreakdown items={treeData} />;
}
