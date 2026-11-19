import {
  ChartDecreaseIcon,
  BankIcon,
  CapStraightIcon,
  Layers02Icon,
  SaveMoneyEuroIcon,
  Coins01Icon,
  Coins02Icon,
  CalculateIcon,
  HealthIcon,
  Invoice01Icon,
  Alert01Icon,
} from "hugeicons-react";
import {
  IncomeTaxBrackets,
  PrispevkiSettings,
  SharedInputs,
  YearSettings,
} from "~/constants/types";
import { TreeItem } from "~/ui/common/TreeBreakdown/TreeBreakdown";
import { evri, evriInCenti, evriInDelez, stopnja } from "./numberFormat";
import {
  getZavarovanecRate,
  getDelodajalecRate,
  getPopoldanskiPrispevki,
  getOZPLetno,
} from "./prispevki";
import { getDOOPrispevkiSettings, type getDOOData } from "./taxCalculator/doo";

const iconClassName = "size-5";

// Prispevek po stopnji od osnove, npr. »PIZ 2.756 € / 15,5 %«
export function prispevekItem(
  label: string,
  rate: number,
  osnova: number
): TreeItem {
  return {
    label,
    subValue: stopnja(rate),
    value: evri(osnova * rate),
    color: "red",
  };
}

// Obvezni zdravstveni prispevek (OZP) – letni znesek in mesečni pavšali
export function ozpItem(settings: PrispevkiSettings): TreeItem {
  const tooltip = settings.zavarovanecOZP
    .map(({ odMeseca, znesek }, index) =>
      index === 0
        ? `${evriInCenti(znesek)} na mesec`
        : `${evriInCenti(znesek)} od 1. ${odMeseca}.`
    )
    .join(", ");
  return {
    icon: <HealthIcon className={iconClassName} />,
    label: "Obvezni zdravstveni prispevek (OZP)",
    tooltip,
    value: evri(getOZPLetno(settings)),
    color: "red",
  };
}

// Pavšalni prispevki popoldanskega s. p. (zavarovan na podlagi zaposlitve)
export function getPopoldanskiPrispevkiTreeItem(
  prispevki: ReturnType<typeof getPopoldanskiPrispevki>
): TreeItem {
  return {
    label: "Prispevki (pavšal)",
    value: evri(prispevki.skupaj),
    icon: <SaveMoneyEuroIcon className={iconClassName} />,
    color: "red",
    children: [
      {
        label: "PIZ – poškodbe pri delu",
        tooltip: "Pavšal, pokojninska doba iz s. p. ne teče",
        value: evri(prispevki.piz),
        color: "red",
      },
      {
        label: "ZZ – poškodbe pri delu",
        tooltip: "0,53 % povprečne plače",
        value: evri(prispevki.zzPoskodbe),
        color: "red",
      },
      {
        icon: <HealthIcon className={iconClassName} />,
        label: "Zdravstveno zavarovanje",
        tooltip: "6,36 % od 25 % povprečne plače",
        value: evri(prispevki.zz),
        color: "red",
      },
      ...(prispevki.dolgotrajnaOskrba > 0
        ? [
            {
              label: "Dolgotrajna oskrba",
              tooltip: "1 % od 25 % povprečne plače",
              value: evri(prispevki.dolgotrajnaOskrba),
              color: "red" as const,
            },
          ]
        : []),
    ],
  };
}

/*
  Najvišja raven drevesa ima enake vrstice kot trak v primerjavi:
  »Davki in prispevki«, »Stroški« in »Ostane ti«. Deleži so od prihodkov.
*/
export function davkiInPrispevkiItem(
  totalTax: number,
  prihodki: number,
  children: TreeItem[]
): TreeItem {
  return {
    label: "Davki in prispevki",
    value: evriInDelez(totalTax, prihodki),
    icon: <ChartDecreaseIcon className={iconClassName} />,
    color: "red",
    children,
  };
}

export function stroskiItems(
  sharedInputs: SharedInputs,
  tooltip?: string
): TreeItem[] {
  if (sharedInputs.expenses <= 0) return [];
  return [
    {
      label: "Stroški",
      value: evriInDelez(sharedInputs.expenses, sharedInputs.revenue),
      icon: <Invoice01Icon className={iconClassName} />,
      color: "gray",
      tooltip,
    },
  ];
}

export function ostaneTiItem(
  ostane: number,
  prihodki: number,
  children?: TreeItem[],
  description?: string
): TreeItem {
  return {
    label: "Ostane ti",
    tooltip: "Prihodki − davki in prispevki − stroški",
    value: evriInDelez(ostane, prihodki),
    subValue: ostane > 0 ? `${evri(ostane / 12)} na mesec` : undefined,
    icon: <Coins02Icon className={iconClassName} />,
    color: ostane >= 0 ? "green" : "yellow",
    description,
    children: children && children.length > 0 ? children : undefined,
  };
}

/*
  »Ostane ti« pri oblikah, kjer ves denar dobiš v eni obliki (dvig dobička
  s. p., izplačilo pogodbe, plača): opis, kako ga dobiš, in račun od prihodkov
  do zneska. Postavke se seštejejo v »Ostane ti«, tako kot pri d. o. o. plača,
  dividende in povračila.
*/
export function ostaneTiRacunItem({
  ostane,
  prihodki,
  kakoGaDobis,
  prihodkiLabel = "Prihodki",
  odbitki,
  stroski,
}: {
  ostane: number;
  prihodki: number;
  kakoGaDobis: string;
  prihodkiLabel?: string;
  odbitki: { label: string; znesek: number }[];
  stroski: number;
}): TreeItem {
  const racun: TreeItem[] = [
    {
      label: prihodkiLabel,
      value: evri(prihodki),
      icon: <Coins01Icon className={iconClassName} />,
      color: "gray",
    },
    ...(stroski > 0
      ? [
          {
            label: "Stroški",
            value: evri(-stroski),
            icon: <Invoice01Icon className={iconClassName} />,
            color: "gray" as const,
          },
        ]
      : []),
    ...odbitki
      .filter(({ znesek }) => znesek >= 0.5)
      .map(({ label, znesek }) => ({
        label,
        value: evri(-znesek),
        icon: <ChartDecreaseIcon className={iconClassName} />,
        color: "red" as const,
      })),
  ];
  return ostaneTiItem(ostane, prihodki, racun, kakoGaDobis);
}

const dvigDobicka =
  "Dobiček dvigneš s poslovnega računa kot zasebni dvig, brez dodatnega davka.";

export const kakoGaDobis = {
  sp: dvigDobicka,
  popoldanskiSp: `${dvigDobicka} Plača iz zaposlitve tu ni vključena.`,
  podjemna:
    "Naročnik ti izplača celoten znesek pogodbe, davke in prispevke plačaš sam.",
  tujiDelodajalec:
    "Delodajalec ti izplača celotno plačo, prispevke (tudi delodajalčeve) in dohodnino plačaš sam.",
  slovenskiDelodajalec:
    "Delodajalec ti izplača neto plačo, regres, božičnico in povračila, prispevke in dohodnino pa obračuna in plača sam.",
};

// Davčni razredi: »Do 72.000 €« / »Nad 72.000 €«, stopnja in plačani znesek
export function razrediItems(
  bracket: (IncomeTaxBrackets[number] & { toPay: number })[]
): TreeItem[] {
  return bracket.map(({ percentage, toPay, maxNumber }, index) => ({
    label: maxNumber
      ? `Do ${evri(maxNumber)}`
      : `Nad ${evri(bracket[index - 1]?.maxNumber ?? 0)}`,
    subValue: stopnja(percentage),
    value: evri(toPay),
    icon: <Layers02Icon className={iconClassName} />,
    color: toPay > 0 ? ("red" as const) : ("gray" as const),
    muted: toPay <= 0,
  }));
}

/*
  Prispevki s. p. in normiranega s. p. (15. člen ZPIZ-2): OZP in prispevki od
  zavarovalne osnove. PIZ je izračunan kot ostanek, da se postavke seštejejo
  v skupni znesek tudi pri znižanih prispevkih za PIZ v prvih dveh letih.
*/
export function spPrispevkiItem({
  prispevki,
  zavarovalnaOsnova,
  prispevkiRate,
  lanskiPrispevki,
  dobicek,
  settings,
}: {
  prispevki: number;
  zavarovalnaOsnova: number;
  prispevkiRate: number;
  lanskiPrispevki: number;
  dobicek: number;
  settings: YearSettings;
}): TreeItem {
  const s = settings;
  const odOsnove = zavarovalnaOsnova * prispevkiRate;
  const ostali = [
    {
      label: "Zdravstveno zavarovanje",
      rate: s.zavarovanecZZZSrate + s.delodajalecZZZSrate,
    },
    {
      label: "Starševsko varstvo",
      rate: s.zavarovanecStarsevsko + s.delodajalecStarsevsko,
    },
    {
      label: "Zaposlovanje",
      rate: s.zavarovanecBrezposelnost + s.delodajalecBrezposelnost,
    },
    { label: "Poškodbe pri delu", rate: s.delodajalecPoskodbe },
    {
      label: "Dolgotrajna oskrba",
      rate: s.zavarovanecDOrate + s.delodajalecDOrate,
    },
  ].filter(({ rate }) => rate > 0);
  const pizRate = Math.max(
    0,
    prispevkiRate - ostali.reduce((vsota, { rate }) => vsota + rate, 0)
  );

  return {
    label: "Prispevki",
    value: evri(prispevki),
    icon: <SaveMoneyEuroIcon className={iconClassName} />,
    color: "red",
    children: [
      ozpItem(settings),
      {
        label: "Zavarovalna osnova",
        tooltip: "Iz dobička, med najnižjo in najvišjo osnovo",
        value: evri(zavarovalnaOsnova),
        icon: <CalculateIcon className={iconClassName} />,
        color: "gray",
        children: [
          {
            label: "Dobiček za izračun prispevkov",
            value: evri(dobicek),
            color: "gray",
          },
          {
            label: "Lanski prispevki",
            tooltip: "Ocena, če si imel lani enake prihodke",
            value: evri(lanskiPrispevki),
            color: "gray",
          },
        ],
      },
      {
        label: "Prispevki od zavarovalne osnove",
        value: evri(odOsnove),
        subValue: stopnja(prispevkiRate),
        icon: <CalculateIcon className={iconClassName} />,
        color: "red",
        children: [
          prispevekItem("PIZ", pizRate, zavarovalnaOsnova),
          ...ostali.map(({ label, rate }) =>
            prispevekItem(label, rate, zavarovalnaOsnova)
          ),
        ],
      },
    ],
  };
}

type DOOResult = ReturnType<typeof getDOOData> & {
  salaryGross1: number;
  // Če jih kalkulator vrne, jih uporabimo; sicer jih izračunamo iz zneskov
  prispevkiBase?: number;
  zavarovanecBase?: number;
};

// Osnovi za prispevke iz zneskov kalkulatorja (doo.ts):
//   iz plače   = osnovaZavarovanca × stopnjaZavarovanca + OZP
//   na plačo   = osnova × stopnjaDelodajalca + (osnova − osnovaZavarovanca) × stopnjaZavarovanca
function getDOOOsnove(result: DOOResult, settings: YearSettings) {
  const zavarovanecRate = getZavarovanecRate(getDOOPrispevkiSettings(settings));
  const delodajalecRate = getDelodajalecRate(getDOOPrispevkiSettings(settings));
  const ozp = result.gross1Tax > 0 ? getOZPLetno(settings) : 0;
  const zavarovanecBase =
    result.zavarovanecBase ??
    Math.max(0, (result.gross1Tax - ozp) / zavarovanecRate);
  const prispevkiBase =
    result.prispevkiBase ??
    (result.gross2Tax + zavarovanecBase * zavarovanecRate) /
      (delodajalecRate + zavarovanecRate);
  return { zavarovanecBase, prispevkiBase, ozp };
}

function prispevkiZavarovancaItems(osnova: number, s: PrispevkiSettings) {
  return [
    prispevekItem("PIZ", s.zavarovanecPIZrate, osnova),
    prispevekItem("Zdravstveno zavarovanje", s.zavarovanecZZZSrate, osnova),
    prispevekItem("Starševsko varstvo", s.zavarovanecStarsevsko, osnova),
    prispevekItem("Zaposlovanje", s.zavarovanecBrezposelnost, osnova),
    ...(s.zavarovanecDOrate > 0
      ? [prispevekItem("Dolgotrajna oskrba", s.zavarovanecDOrate, osnova)]
      : []),
  ].filter((item) => item.subValue !== stopnja(0));
}

function prispevkiDelodajalcaItems(osnova: number, s: PrispevkiSettings) {
  return [
    prispevekItem("PIZ", s.delodajalecPIZrate, osnova),
    prispevekItem("Zdravstveno zavarovanje", s.delodajalecZZZSrate, osnova),
    prispevekItem("Starševsko varstvo", s.delodajalecStarsevsko, osnova),
    prispevekItem("Zaposlovanje", s.delodajalecBrezposelnost, osnova),
    prispevekItem("Poškodbe pri delu", s.delodajalecPoskodbe, osnova),
    ...(s.delodajalecDOrate > 0
      ? [prispevekItem("Dolgotrajna oskrba", s.delodajalecDOrate, osnova)]
      : []),
  ].filter((item) => item.subValue !== stopnja(0));
}

export function getDOOTreeData({
  result,
  sharedInputs,
  currentSettings,
  oblika = "doo",
}: {
  result: DOOResult;
  sharedInputs: SharedInputs;
  currentSettings: YearSettings;
  // »slovenskiDelodajalec«: zaposlitev v slovenskem podjetju po istem računu,
  // brez davka od dobička in dividend; stroške plačaš iz neto plače
  oblika?: "doo" | "slovenskiDelodajalec";
}): TreeItem[] {
  const zaposlitev = oblika === "slovenskiDelodajalec";
  const {
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
    cistiPrihodki,
    totalPrispevki,
    bracket,
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
  } = result;
  const prihodki = sharedInputs.revenue;
  const isDruzbenikPoslovodja = currentSettings.dooDruzbenikPoslovodja === true;
  // Poslovodja brez pogodbe o zaposlitvi ne plačuje prispevkov za zaposlovanje
  const prispevkiSettings = getDOOPrispevkiSettings(currentSettings);
  const { zavarovanecBase, prispevkiBase, ozp } = getDOOOsnove(
    result,
    currentSettings
  );
  const zavarovanecRate = getZavarovanecRate(prispevkiSettings);
  const razlikaDoNajnizjeOsnove =
    Math.max(0, prispevkiBase - zavarovanecBase) * zavarovanecRate;

  // Pozitiven dobiček se izplača kot dividende, izgubo pokrije lastnik
  const izguba = dividendsNet < -0.5;

  const prispevkiChildren: TreeItem[] = [
    {
      label: "Osnova za prispevke",
      value: evri(prispevkiBase),
      tooltip: isDruzbenikPoslovodja
        ? "Bruto plača I, najmanj 90 % in največ 3,5-kratnik povprečne plače"
        : "Bruto plača I; prispevki delodajalca najmanj od 60 % povprečne plače",
      icon: <CalculateIcon className={iconClassName} />,
      color: "gray",
    },
    {
      label: "Prispevki zavarovanca (iz plače)",
      tooltip: `${stopnja(zavarovanecRate)} in OZP`,
      value: evri(gross1Tax),
      icon: <SaveMoneyEuroIcon className={iconClassName} />,
      color: "red",
      children: [
        ...(ozp > 0 ? [ozpItem(currentSettings)] : []),
        ...prispevkiZavarovancaItems(zavarovanecBase, prispevkiSettings),
      ],
    },
    {
      label: "Prispevki delodajalca (na plačo)",
      tooltip: stopnja(getDelodajalecRate(prispevkiSettings)),
      value: evri(gross2Tax),
      icon: <SaveMoneyEuroIcon className={iconClassName} />,
      color: "red",
      children: [
        ...prispevkiDelodajalcaItems(prispevkiBase, prispevkiSettings),
        ...(razlikaDoNajnizjeOsnove >= 0.5
          ? [
              {
                label: "Razlika do najnižje osnove",
                tooltip:
                  "Prispevke zavarovanca od razlike do 60 % povprečne plače plača podjetje",
                value: evri(razlikaDoNajnizjeOsnove),
                color: "red" as const,
              },
            ]
          : []),
      ],
    },
    ...(bozicnicaEmployeeContrib + bozicnicaEmployerContrib > 0
      ? [
          {
            label: "Prispevki od božičnice",
            tooltip: "Prispevki zavarovanca in delodajalca",
            value: evri(bozicnicaEmployeeContrib + bozicnicaEmployerContrib),
            icon: <SaveMoneyEuroIcon className={iconClassName} />,
            color: "red" as const,
          },
        ]
      : []),
    ...(nagradaEmployeeContrib + nagradaEmployerContrib > 0
      ? [
          {
            label: "Prispevki od nagrade",
            tooltip: "Prispevki zavarovanca in delodajalca",
            value: evri(nagradaEmployeeContrib + nagradaEmployerContrib),
            icon: <SaveMoneyEuroIcon className={iconClassName} />,
            color: "red" as const,
          },
        ]
      : []),
  ];

  const ostaneChildren: TreeItem[] = [
    {
      label: "Neto plača",
      value: evri(salaryNet),
      icon: <Coins01Icon className={iconClassName} />,
      color: "green",
      children: [
        {
          label: "Bruto plača I",
          value: evri(salaryGross1),
          color: "gray",
        },
        {
          label: "Bruto plača II",
          tooltip: "Strošek podjetja: bruto plača I in prispevki delodajalca",
          value: evri(salaryGross2),
          color: "gray",
        },
      ],
    },
    ...(izguba
      ? [
          {
            label: "Izguba podjetja",
            tooltip: "Pokriješ jo sam",
            value: evri(dividendsNet),
            icon: <Alert01Icon className={iconClassName} />,
            color: "yellow" as const,
          },
        ]
      : dividendsNet >= 0.5
        ? [
            {
              label: "Dividende",
              tooltip: "Po davku od dobička in davku od dividend",
              value: evri(dividendsNet),
              icon: <Coins01Icon className={iconClassName} />,
              color: "green" as const,
            },
          ]
        : []),
    ...[
      {
        amount: malicaLetna,
        label: "Malica",
        tooltip: "Povračilo stroškov prehrane – neobdavčeno",
      },
      {
        amount: prevozniStroskiLetni,
        label: "Prevoz na delo",
        tooltip: "Povračilo stroškov prevoza – neobdavčeno",
      },
      {
        amount: regresLetni,
        label: "Regres",
        tooltip: "Regres za letni dopust – neobdavčen do 100 % povprečne plače",
      },
      {
        amount: pdpzLetni,
        label: "Dodatno pokojninsko zavarovanje",
        tooltip: `Premija, ki jo plača podjetje – neobdavčena do 24\u00a0% obveznih prispevkov za PIZ (največ ${evri(currentSettings.pdpzMaxZnesek)})`,
      },
      {
        amount: bozicnicaNet,
        label: "Božičnica",
        tooltip: "Božičnica oziroma zimski regres",
      },
      {
        amount: nagradaNet,
        label: "Nagrada za poslovno uspešnost",
        tooltip: "Neobdavčena do povprečne plače",
      },
    ]
      .filter(({ amount }) => amount > 0)
      .map(({ amount, label, tooltip }) => ({
        label,
        tooltip,
        value: evri(amount),
        icon: <Coins01Icon className={iconClassName} />,
        color: "green" as const,
      })),
    // Pri zaposlitvi stroške plačaš iz neto plače, zato jih tu odštejemo
    ...(zaposlitev && sharedInputs.expenses > 0
      ? [
          {
            label: "Stroški",
            value: evri(-sharedInputs.expenses),
            icon: <Invoice01Icon className={iconClassName} />,
            color: "gray" as const,
          },
        ]
      : []),
  ];

  return [
    davkiInPrispevkiItem(totalTax, prihodki, [
      {
        label: "Dohodnina",
        color: "red",
        value: evri(dohodnina),
        icon: <BankIcon className={iconClassName} />,
        children: [
          {
            label: "Davčna osnova",
            value: evri(dohodninaBase),
            icon: <CapStraightIcon className={iconClassName} />,
            color: "gray",
            description:
              "Bruto plača I − prispevki zavarovanca − OZP − olajšave",
            children: [
              {
                label: "Splošna olajšava",
                color: "blue",
                value: evri(taxRelief),
              },
              ...(olajsavaVzdrzevani > 0
                ? [
                    {
                      label: "Olajšava za vzdrževane družinske člane",
                      color: "blue" as const,
                      value: evri(olajsavaVzdrzevani),
                    },
                  ]
                : []),
            ],
          },
          ...razrediItems(bracket),
        ],
      },
      {
        label: "Prispevki",
        color: "red",
        value: evri(totalPrispevki),
        icon: <SaveMoneyEuroIcon className={iconClassName} />,
        children: prispevkiChildren,
      },
      ...(zaposlitev
        ? []
        : [
            {
              label: "Davek od dohodkov pravnih oseb",
              tooltip: "Davek od dobička podjetja",
              subValue: stopnja(currentSettings.ddpoTaxRate),
              value: evri(dobicekTax),
              icon: <ChartDecreaseIcon className={iconClassName} />,
              color: dobicekTax > 0.5 ? ("red" as const) : ("gray" as const),
              muted: dobicekTax <= 0.5,
            },
            {
              label: "Davek od dividend",
              subValue: stopnja(currentSettings.dividendsTaxRate),
              value: evri(dividendsTax),
              icon: <ChartDecreaseIcon className={iconClassName} />,
              color:
                dividendsTax > 0.5 ? ("red" as const) : ("gray" as const),
              muted: dividendsTax <= 0.5,
            },
          ]),
    ]),
    ...stroskiItems(
      sharedInputs,
      zaposlitev
        ? "Niso davčno priznani – plačaš jih iz neto plače"
        : "Znižajo dobiček podjetja"
    ),
    ostaneTiItem(
      cistiPrihodki,
      prihodki,
      ostaneChildren,
      zaposlitev
        ? kakoGaDobis.slovenskiDelodajalec
        : "Iz podjetja dobiš neto plačo, dividende in druga izplačila, ki so do zakonskih zneskov neobdavčena."
    ),
  ];
}
