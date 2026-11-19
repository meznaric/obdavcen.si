import { BankIcon, HealthIcon, SaveMoneyEuroIcon } from "hugeicons-react";
import {
  TreeBreakdown,
  type TreeItem,
} from "~/ui/common/TreeBreakdown/TreeBreakdown";
import { evri, stopnja } from "~/utils/numberFormat";
import { getTujiDelodajalecData } from "~/utils/taxCalculator/tujiDelodajalec";
import {
  davkiInPrispevkiItem,
  kakoGaDobis,
  ostaneTiRacunItem,
  stroskiItems,
} from "~/utils/treedata";
import type { BreakdownProps } from "./types";

export function TujiDelodajalecBreakdown({
  currentSettings,
  sharedInputs,
}: BreakdownProps) {
  const {
    totalTax,
    cistiPrihodki,
    osnova,
    prispevkiZavarovanca,
    prispevkiDelodajalca,
    ozp,
    dohodnina,
    davcnaOsnova,
    mejnaStopnja,
  } = getTujiDelodajalecData(sharedInputs, currentSettings);
  const prihodki = sharedInputs.revenue;
  const naOsnovo = (znesek: number) =>
    osnova > 0 ? `${stopnja(znesek / osnova)} osnove` : undefined;

  const treeData: TreeItem[] = [
    davkiInPrispevkiItem(totalTax, prihodki, [
      {
        label: "Prispevki zavarovanca (iz plače)",
        tooltip: `Osnova ${evri(osnova)}, najmanj 60\u00a0% povprečne plače`,
        value: evri(prispevkiZavarovanca),
        subValue: naOsnovo(prispevkiZavarovanca),
        icon: <SaveMoneyEuroIcon className="size-5" />,
        color: "red",
      },
      {
        label: "Prispevki delodajalca (na plačo)",
        tooltip:
          "Plačaš jih sam, ker tuji delodajalec ni plačnik prispevkov v Sloveniji",
        value: evri(prispevkiDelodajalca),
        subValue: naOsnovo(prispevkiDelodajalca),
        icon: <SaveMoneyEuroIcon className="size-5" />,
        color: "red",
      },
      {
        label: "Obvezni zdravstveni prispevek (OZP)",
        value: evri(ozp),
        icon: <HealthIcon className="size-5" />,
        color: "red",
      },
      {
        label: "Dohodnina",
        tooltip: `Davčna osnova ${evri(davcnaOsnova)}; akontacijo plačuješ po odločbi FURS`,
        value: evri(dohodnina),
        subValue: `mejna stopnja ${stopnja(mejnaStopnja)}`,
        icon: <BankIcon className="size-5" />,
        color: "red",
      },
    ]),
    ...stroskiItems(
      sharedInputs,
      "Niso davčno priznani – plačaš jih iz neto plače"
    ),
    ostaneTiRacunItem({
      ostane: cistiPrihodki,
      prihodki,
      prihodkiLabel: "Bruto plača",
      kakoGaDobis: kakoGaDobis.tujiDelodajalec,
      stroski: sharedInputs.expenses,
      odbitki: [
        {
          label: "Prispevki",
          znesek: prispevkiZavarovanca + prispevkiDelodajalca + ozp,
        },
        { label: "Dohodnina", znesek: dohodnina },
      ],
    }),
  ];

  return <TreeBreakdown items={treeData} />;
}
