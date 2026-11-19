import {
  Alert01Icon,
  ChartDecreaseIcon,
  ChartIncreaseIcon,
  CoinsEuroIcon,
  SaveMoneyEuroIcon,
} from "hugeicons-react";
import {
  dividendeStopnja,
  dobicekIzKapitalaStopnje,
  inr as inrLimiti,
  normiraniStroskiDelez,
  vlaganjePreverjeno,
} from "~/constants/2026/vlaganje";
import {
  TreeBreakdown,
  type TreeItem,
} from "~/ui/common/TreeBreakdown/TreeBreakdown";
import {
  delezDavkovVDonosu,
  type RezultatInr,
  type RezultatRacuna,
} from "~/utils/vlaganje";
import { ZunanjaPovezava } from "../Faq/gradniki";
import { viri } from "../Faq/viri";
import { evriCeli, let_, odstotek, poLetih } from "../format";

const ikona = "w-5 h-5";
const ns = odstotek(normiraniStroskiDelez);
// Pod to razliko (v evrih) rečemo, da ti na obeh računih ostane približno enako.
const ENAKO_POD = 10;

/** "manj kot 5 let", "5–10 let", … za stopnjo iz lestvice. */
function obdobjeZaStopnjo(stopnja: number) {
  const i = dobicekIzKapitalaStopnje.findIndex((s) => s.stopnja === stopnja);
  if (i < 0) return "";
  const od = dobicekIzKapitalaStopnje[i].odLet;
  const naslednji = dobicekIzKapitalaStopnje[i + 1]?.odLet;
  if (od === 0) return `imetništvo manj kot ${let_(naslednji)}`;
  return naslednji
    ? `imetništvo ${od}–${let_(naslednji)}`
    : `imetništvo vsaj ${let_(od)}`;
}

function nicli<T>(seznam: (T | false | null | undefined)[]): T[] {
  return seznam.filter(Boolean) as T[];
}

/** "Davki (17,8 % donosa)": delež donosa, ki ga pojedo davki. */
function davkiOznaka(r: Parameters<typeof delezDavkovVDonosu>[0]) {
  return `Davki (${odstotek(delezDavkovVDonosu(r), 1)} donosa)`;
}

function navadenItems(r: RezultatRacuna): TreeItem[] {
  const p = r.davekObProdaji;
  const oprostitevLet =
    dobicekIzKapitalaStopnje[dobicekIzKapitalaStopnje.length - 1].odLet;
  return [
    {
      label: "Navadni borzni račun",
      description:
        "Npr. IBKR, Trade Republic ali slovenska banka. Ob prodaji oddaš Doh-KDVP, za dividende Doh-Div.",
    },
    {
      label: "Vloženo",
      value: evriCeli(r.vlozeno),
      icon: <CoinsEuroIcon className={ikona} />,
      color: "blue",
    },
    {
      label: "Vrednost ob prodaji",
      value: evriCeli(r.vrednost),
      icon: <ChartIncreaseIcon className={ikona} />,
      color: "indigo",
    },
    {
      label: davkiOznaka(r),
      value: evriCeli(r.skupajDavki),
      icon: <ChartDecreaseIcon className={ikona} />,
      color: "red",
      children: nicli<TreeItem>([
        ...p.poStopnjah.map((s) => ({
          label: `Dobiček iz kapitala ${odstotek(s.stopnja)}`,
          tooltip: `${obdobjeZaStopnjo(s.stopnja)}, osnova ${evriCeli(s.davcnaOsnova)}`,
          value: evriCeli(s.davek),
          color: "red" as const,
        })),
        p.oproscenDobicek > 0 && {
          label: "Oproščeno",
          tooltip: `del, ki si ga imel vsaj ${let_(oprostitevLet)}, dobiček ${evriCeli(p.oproscenDobicek)}`,
          value: evriCeli(0),
          color: "green",
        },
        p.normiraniStroski > 0 && {
          label: `Normirani stroški ${ns} + ${ns}`,
          tooltip: "zmanjšajo davčno osnovo (ne plačaš jih)",
          value: `−${evriCeli(p.normiraniStroski)}`,
          color: "gray",
        },
        r.davekNaDividende > 0 && {
          label: "Davek od dividend (Doh-Div)",
          tooltip: `${odstotek(dividendeStopnja)} od vsakega izplačila, plačan sproti`,
          value: evriCeli(r.davekNaDividende),
          color: "red",
        },
      ]),
    },
    {
      label: "Ostane ti",
      value: evriCeli(r.neto),
      icon: <SaveMoneyEuroIcon className={ikona} />,
      color: "green",
    },
  ];
}

function inrItems(r: RezultatInr): TreeItem[] {
  const vrednost = r.vrednostInr + (r.presezek?.vrednost ?? 0);
  return [
    {
      label: "INR – individualni naložbeni račun",
      description: r.oproscen
        ? `Prvo izplačilo vsaj ${let_(inrLimiti.oprostitevPoLetih)} po odprtju je brez davka.`
        : `Med vlaganjem ni davka; ob izplačilu ${odstotek(inrLimiti.stopnja)} od donosa (vrednost − vplačila).`,
    },
    {
      label: "Vloženo",
      tooltip: r.presezek
        ? `od tega ${evriCeli(r.presezek.vlozeno)} nad limiti INR`
        : undefined,
      value: evriCeli(r.vlozeno),
      icon: <CoinsEuroIcon className={ikona} />,
      color: "blue",
    },
    {
      label: "Vrednost ob izplačilu",
      value: evriCeli(vrednost),
      icon: <ChartIncreaseIcon className={ikona} />,
      color: "indigo",
    },
    {
      label: davkiOznaka(r),
      value: evriCeli(r.skupajDavki),
      icon: <ChartDecreaseIcon className={ikona} />,
      color: "red",
      children: nicli<TreeItem>([
        {
          label: r.oproscen
            ? "INR: oproščeno"
            : `INR: ${odstotek(inrLimiti.stopnja)} od donosa`,
          tooltip: r.oproscen
            ? `izplačilo vsaj ${let_(inrLimiti.oprostitevPoLetih)} po odprtju, donos ${evriCeli(r.donosInr)}`
            : `ponudnik davek odtegne sam, donos ${evriCeli(r.donosInr)}`,
          value: evriCeli(r.davekInr),
          color: r.oproscen ? "green" : "red",
        },
        r.presezek && {
          label: "Presežek na navadnem računu",
          tooltip: "vplačila nad limiti INR",
          value: evriCeli(r.presezek.skupajDavki),
          color: "red",
        },
      ]),
    },
    {
      label: "Ostane ti",
      value: evriCeli(r.neto),
      icon: <SaveMoneyEuroIcon className={ikona} />,
      color: "green",
    },
  ];
}

function sodba(razlika: number, leta: number) {
  const po = poLetih(leta).replace(/^po/, "Po");
  if (razlika >= ENAKO_POD)
    return `${po} ti na INR ostane ${evriCeli(razlika)} več kot na navadnem računu.`;
  if (razlika <= -ENAKO_POD)
    return `${po} ti na navadnem računu ostane ${evriCeli(-razlika)} več kot na INR.`;
  return `${po} ti na obeh računih ostane približno enako.`;
}

export function PlanerRezultat({
  navaden,
  inr,
  leta,
}: {
  navaden: RezultatRacuna;
  inr: RezultatInr;
  leta: number;
}) {
  return (
    <div className="space-y-4">
      <div className="text-center space-y-1">
        <p className="text-lg font-semibold">
          {sodba(inr.neto - navaden.neto, leta)}
        </p>
        <p className="text-sm">
          Po plačilu davkov ti ostane: na navadnem računu{" "}
          <strong>{evriCeli(navaden.neto)}</strong>, na INR{" "}
          <strong>{evriCeli(inr.neto)}</strong>.
        </p>
        <p className="text-sm opacity-80">
          Provizije posrednika in ponudnika INR niso upoštevane.
        </p>
      </div>

      {inr.presezek && (
        <div className="alert alert-warning text-sm" role="status">
          <Alert01Icon className="w-5 h-5" />
          <span>
            Tvoj načrt presega limite INR ({evriCeli(inrLimiti.prvoLetoLimit)} v
            letu odprtja, nato {evriCeli(inrLimiti.letniLimit)} na leto, skupaj
            največ {evriCeli(inrLimiti.skupniLimit)}). Presežek{" "}
            {evriCeli(inr.presezek.vlozeno)} je v primerjavi upoštevan na navadnem
            računu.
          </span>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start">
        <div className="bg-gray-900 rounded-lg">
          <TreeBreakdown items={navadenItems(navaden)} />
        </div>
        <div className="bg-gray-900 rounded-lg">
          <TreeBreakdown items={inrItems(inr)} />
        </div>
      </div>

      <PolegDavka />
    </div>
  );
}

function PolegDavka() {
  return (
    <div className="text-sm space-y-2">
      <p className="font-semibold">Poleg davka upoštevaj še</p>
      <ul className="list-disc pl-5 space-y-1">
        <li>
          INR odpreš pri ponudniku iz{" "}
          <ZunanjaPovezava href={viri.inrRegister.url}>registra ATVP</ZunanjaPovezava>.
          Tuji spletni posredniki, kot sta IBKR in Trade Republic, na seznamu niso
          (stanje {vlaganjePreverjeno}).
        </li>
        <li>
          Na INR vplačaš največ {evriCeli(inrLimiti.prvoLetoLimit)} v letu odprtja,
          nato {evriCeli(inrLimiti.letniLimit)} na leto, skupaj največ{" "}
          {evriCeli(inrLimiti.skupniLimit)}. Odpreš ga lahko le enkrat.
        </li>
        <li>
          Na INR ne oddajaš napovedi, davek ob izplačilu odtegne ponudnik. Na
          navadnem računu oddaš Doh-KDVP za vsako leto, v katerem kaj prodaš, in
          Doh-Div za vsako leto, v katerem prejmeš dividende.
        </li>
        <li>
          Ponudniki imajo različne provizije in nabor skladov. Planer provizij ne
          upošteva, zato pred odločitvijo primerjaj cenike.{" "}
          <a href="#inr" className="link">
            Več o INR
          </a>
        </li>
      </ul>
    </div>
  );
}
