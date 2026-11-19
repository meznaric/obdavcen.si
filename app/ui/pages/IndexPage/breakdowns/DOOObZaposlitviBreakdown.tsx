import { ChartDecreaseIcon } from "hugeicons-react";
import {
  TreeBreakdown,
  type TreeItem,
} from "~/ui/common/TreeBreakdown/TreeBreakdown";
import { evri, stopnja } from "~/utils/numberFormat";
import { getDOOObZaposlitviData } from "~/utils/taxCalculator/dooObZaposlitvi";
import {
  davkiInPrispevkiItem,
  ostaneTiRacunItem,
  stroskiItems,
} from "~/utils/treedata";
import type { BreakdownProps } from "./types";

export function DOOObZaposlitviBreakdown({
  currentSettings,
  sharedInputs,
}: BreakdownProps) {
  const {
    totalTax,
    dobicek,
    dobicekTax,
    dividendsTax,
    dividendsNet,
    cistiPrihodki,
  } = getDOOObZaposlitviData(sharedInputs, currentSettings);
  const prihodki = sharedInputs.revenue;

  const treeData: TreeItem[] = [
    davkiInPrispevkiItem(totalTax, prihodki, [
      {
        label: "Davek od dohodkov pravnih oseb",
        tooltip: `Davek od dobička podjetja (${evri(dobicek)})`,
        value: evri(dobicekTax),
        subValue: stopnja(currentSettings.ddpoTaxRate),
        icon: <ChartDecreaseIcon className="size-5" />,
        color: dobicekTax > 0 ? "red" : "gray",
        muted: dobicekTax <= 0,
      },
      {
        label: "Davek od dividend",
        value: evri(dividendsTax),
        subValue: stopnja(currentSettings.dividendsTaxRate),
        icon: <ChartDecreaseIcon className="size-5" />,
        color: dividendsTax > 0 ? "red" : "gray",
        muted: dividendsTax <= 0,
      },
    ]),
    ...stroskiItems(sharedInputs, "Znižajo dobiček podjetja"),
    ostaneTiRacunItem({
      ostane: cistiPrihodki,
      prihodki,
      kakoGaDobis:
        dividendsNet < 0
          ? "Podjetje je v izgubi, pokriješ jo sam. Plača iz zaposlitve tu ni vključena."
          : "Dobiček podjetja izplačaš kot dividende, ki ne vplivajo na dohodnino od plače. Plača iz zaposlitve tu ni vključena.",
      stroski: sharedInputs.expenses,
      odbitki: [
        { label: "Davek od dohodkov pravnih oseb", znesek: dobicekTax },
        { label: "Davek od dividend", znesek: dividendsTax },
      ],
    }),
  ];

  return <TreeBreakdown items={treeData} />;
}
