import { BankIcon, HealthIcon, SaveMoneyEuroIcon } from "hugeicons-react";
import {
  TreeBreakdown,
  type TreeItem,
} from "~/ui/common/TreeBreakdown/TreeBreakdown";
import { evri, evriInCenti, stopnja } from "~/utils/numberFormat";
import { getPodjemnaPogodbaData } from "~/utils/taxCalculator/podjemnaPogodba";
import {
  davkiInPrispevkiItem,
  kakoGaDobis,
  ostaneTiRacunItem,
  stroskiItems,
} from "~/utils/treedata";
import type { BreakdownProps } from "./types";

export function PodjemnaPogodbaBreakdown({
  currentSettings,
  sharedInputs,
}: BreakdownProps) {
  const {
    totalTax,
    cistiPrihodki,
    normiraniStroski,
    osnova,
    pizPrejemnik,
    pizIzplacevalec,
    zz,
    dolgotrajnaOskrba,
    prispevkiOdPogodbe,
    zzSamoplacnik,
    doSamoplacnik,
    ozp,
    dohodnina,
    davcnaOsnova,
    mejnaStopnja,
  } = getPodjemnaPogodbaData(sharedInputs, currentSettings);
  const prihodki = sharedInputs.revenue;
  const normiraniDelez = stopnja(currentSettings.pogodbaNormiraniStroski);

  const treeData: TreeItem[] = [
    davkiInPrispevkiItem(totalTax, prihodki, [
      {
        label: "Prispevki od pogodbe",
        tooltip: `Osnova ${evri(osnova)}: dohodek − ${normiraniDelez} normiranih stroškov`,
        value: evri(prispevkiOdPogodbe),
        icon: <SaveMoneyEuroIcon className="size-5" />,
        color: "red",
        children: [
          {
            label: "PIZ prejemnik",
            value: evri(pizPrejemnik),
            subValue: stopnja(currentSettings.pogodbaPIZPrejemnik),
            color: "red",
          },
          {
            label: "PIZ izplačevalec",
            tooltip: "Plačaš ga sam, ker tuji naročnik ni plačnik davka",
            value: evri(pizIzplacevalec),
            subValue: stopnja(currentSettings.pogodbaPIZIzplacevalec),
            color: "red",
          },
          {
            label: "Zdravstveno zavarovanje",
            value: evri(zz),
            subValue: stopnja(currentSettings.pogodbaZZ),
            color: "red",
          },
          {
            label: "Dolgotrajna oskrba",
            value: evri(dolgotrajnaOskrba),
            subValue: osnova > 0 ? stopnja(dolgotrajnaOskrba / osnova) : undefined,
            color: dolgotrajnaOskrba > 0 ? "red" : "gray",
            muted: dolgotrajnaOskrba <= 0,
          },
        ],
      },
      {
        label: "Zdravstveno zavarovanje (samoplačnik)",
        tooltip:
          "Pogodba ti ne zagotavlja zdravstvenega zavarovanja – če nimaš druge podlage, se zavaruješ sam",
        value: evri(zzSamoplacnik),
        icon: <HealthIcon className="size-5" />,
        color: "red",
      },
      {
        label: "Dolgotrajna oskrba (samoplačnik)",
        tooltip: `Kot samoplačnik plačaš še ${evriInCenti(doSamoplacnik / 12)} na mesec (1\u00a0% od 25\u00a0% povprečne letne plače)`,
        value: evri(doSamoplacnik),
        icon: <HealthIcon className="size-5" />,
        color: doSamoplacnik > 0 ? "red" : "gray",
        muted: doSamoplacnik <= 0,
      },
      {
        label: "Obvezni zdravstveni prispevek (OZP)",
        value: evri(ozp),
        icon: <HealthIcon className="size-5" />,
        color: "red",
      },
      {
        label: "Dohodnina",
        tooltip: `Davčna osnova ${evri(davcnaOsnova)} (normirani stroški ${evri(normiraniStroski)}). 25-odstotna akontacija je le predplačilo.`,
        value: evri(dohodnina),
        subValue: `mejna stopnja ${stopnja(mejnaStopnja)}`,
        icon: <BankIcon className="size-5" />,
        color: "red",
      },
    ]),
    ...stroskiItems(
      sharedInputs,
      `Dejanski stroški niso priznani – upošteva se le ${normiraniDelez} normiranih stroškov`
    ),
    ostaneTiRacunItem({
      ostane: cistiPrihodki,
      prihodki,
      prihodkiLabel: "Znesek pogodb",
      kakoGaDobis: kakoGaDobis.podjemna,
      stroski: sharedInputs.expenses,
      odbitki: [
        {
          label: "Prispevki",
          znesek: prispevkiOdPogodbe + zzSamoplacnik + doSamoplacnik + ozp,
        },
        { label: "Dohodnina", znesek: dohodnina },
      ],
    }),
  ];

  return <TreeBreakdown items={treeData} />;
}
