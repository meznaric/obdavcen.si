import type { SharedInputs, YearSettings } from "~/constants/types";
import { evri, stopnja } from "./numberFormat";
import { getDelodajalecRate } from "./prispevki";

/*
  Opozorila in pogoji za posamezne oblike v primerjavi.

  - izkljuceno: oblika pri teh prihodkih ne pride v poštev; ni razvrščena
    (enako kot v grafu, ki jo nad mejo izpusti)
  - opozorilo:  razvrščena, a z omejitvijo, ki jo moraš poznati
  - pogoj:      razvrščena, velja le v določenem položaju
  - namig:      nasvet, viden le v podrobnem izračunu
*/
export type NoteLevel = "izkljuceno" | "opozorilo" | "pogoj" | "namig";

export interface Note {
  level: NoteLevel;
  // Kratka oznaka v vrstici (2–5 besed)
  kratko?: string;
  // Celotno besedilo v podrobnem izračunu
  besedilo: string;
  // Del povedi za povzetek, npr. »je primerna le za občasno delo«
  povzetek?: string;
  // Gumb, ki spremeni ustrezno nastavitev
  akcija?: NoteAkcija;
}

export type NoteAkcija =
  | "prvoLetoSP"
  | "brezZnizanjaSP"
  | "imamZaposlitev"
  | "vnesiPlaco"
  | "brezZaposlitve";

// Polja rezultatov kalkulatorjev, ki jih pravila potrebujejo
export interface Rezultat {
  expenses?: number;
  dividendsNet?: number;
  dobicek?: number;
}

const DOO_STRATEGIJE = [
  "DOOMinimalnaPlaca",
  "DOONajvecjaPlaca",
  "DOOPoljubnaPlaca",
];

export function getNotes(
  modeId: string,
  rezultat: Rezultat,
  sharedInputs: SharedInputs,
  settings: YearSettings
): Note[] {
  const notes: Note[] = [];
  const { revenue, expenses } = sharedInputs;

  if (modeId === "NormiraniSP") {
    if (revenue > settings.normiranMaxRevenue) {
      notes.push({
        level: "izkljuceno",
        kratko: `Nad mejo ${evri(settings.normiranMaxRevenue)}`,
        besedilo: `Normirani s. p. lahko imaš le do ${evri(settings.normiranMaxRevenue)} prihodkov.`,
      });
    }
    if (rezultat.expenses !== undefined && expenses > rezultat.expenses) {
      notes.push({
        level: "namig",
        besedilo: `Tvoji stroški (${evri(expenses)}) so višji od normiranih odhodkov (${evri(rezultat.expenses)}). Normiranec dejanskih stroškov ne uveljavlja, zato je s. p. lahko ugodnejši.`,
      });
    }
  }

  if (modeId === "NormiraniSP" || modeId === "SP") {
    const znizanje = settings.spZnizaniPrispevki ?? "brez";
    notes.push(
      znizanje === "brez"
        ? {
            level: "namig",
            besedilo:
              "Če s. p. odpiraš prvič, plačaš prvo leto 50 % nižje prispevke za PIZ, drugo leto pa 30 % nižje.",
            akcija: "prvoLetoSP",
          }
        : {
            level: "namig",
            besedilo: `Upoštevani so znižani prispevki za PIZ v ${znizanje === "prvo" ? "prvem letu (50\u00a0% nižji)" : "drugem letu (30\u00a0% nižji)"}.`,
            akcija: "brezZnizanjaSP",
          }
    );
  }

  if (DOO_STRATEGIJE.includes(modeId)) {
    const izguba = -(rezultat.dividendsNet ?? 0);
    if (izguba >= 1) {
      notes.push(
        modeId === "DOOPoljubnaPlaca"
          ? {
              level: "opozorilo",
              kratko: "Posluje z izgubo",
              besedilo: `Pri izbrani plači ima d. o. o. ${evri(izguba)} izgube, ki jo pokriješ sam.`,
              povzetek: "pri izbrani plači posluje z izgubo",
            }
          : {
              level: "opozorilo",
              kratko: "Ne pokrije minimalne plače",
              besedilo: `Pri teh prihodkih d. o. o. ne zmore izplačati minimalne plače s prispevki in povračili, zato ima ${evri(izguba)} izgube, ki jo pokriješ sam.`,
              povzetek: "pri teh prihodkih ne pokrije minimalne plače",
            }
      );
    }
    const letnaMinimalnaPlaca = settings.minimalnaPlaca * 12;
    if (
      modeId === "DOOPoljubnaPlaca" &&
      settings.dooDruzbenikPoslovodja !== true &&
      sharedInputs.salaryGross1 > 0 &&
      sharedInputs.salaryGross1 < letnaMinimalnaPlaca
    ) {
      notes.push({
        level: "opozorilo",
        kratko: "Pod minimalno plačo",
        besedilo: `Zaposleni za polni delovni čas mora prejeti vsaj minimalno plačo, to je ${evri(letnaMinimalnaPlaca)} bruto na leto.`,
        povzetek: "je izbrana plača nižja od minimalne",
      });
    }
  }

  if (modeId === "SlovenskiDelodajalec") {
    // Pri najmanjšem strošku delodajalca (minimalna plača) je »izguba«
    // znesek, ki manjka do tega stroška
    const manjka = -(rezultat.dividendsNet ?? 0);
    notes.push(
      manjka >= 1
        ? {
            level: "izkljuceno",
            kratko: "Pod minimalno plačo",
            besedilo: `Zaposleni za polni delovni čas mora prejeti vsaj minimalno plačo. S prispevki, regresom, božičnico in povračili delodajalca stane okoli ${evri(revenue + manjka)} na leto.`,
          }
        : {
            level: "pogoj",
            kratko: "Le ob zaposlitvi v slovenskem podjetju",
            besedilo: `Velja, če te zaposli slovensko podjetje. Če imaš ponudbo z bruto plačo, k njej prištej še prispevke delodajalca (${stopnja(getDelodajalecRate(settings))}), regres, božičnico in malico.`,
            povzetek: "velja le, če te zaposli slovensko podjetje",
          }
    );
  }

  if (modeId === "PodjemnaPogodba") {
    notes.push({
      level: "opozorilo",
      kratko: "Le za občasno delo",
      besedilo:
        "Primerna je le za občasno delo. Če stalno delaš za istega naročnika, gre lahko za prikrito delovno razmerje.",
      povzetek: "je primerna le za občasno delo",
    });
  }

  if (modeId === "TujiDelodajalec") {
    notes.push({
      level: "pogoj",
      kratko: "Le ob zaposlitvi v tujem podjetju",
      besedilo:
        "Velja, če te tuje podjetje zaposli s pogodbo o zaposlitvi in v Sloveniji nima poslovne enote. Če izdajaš račune, ta oblika ni mogoča.",
      povzetek: "velja le, če te zaposli tuje podjetje",
    });
  }

  if (
    modeId === "NormiraniPopoldanskiSP" &&
    revenue > settings.normiranPopoldanskiMaxRevenue
  ) {
    notes.push({
      level: "izkljuceno",
      kratko: `Nad mejo ${evri(settings.normiranPopoldanskiMaxRevenue)}`,
      besedilo: `Normirani popoldanski s. p. lahko imaš le do ${evri(settings.normiranPopoldanskiMaxRevenue)} prihodkov.`,
    });
  }

  if (modeId === "DOOObZaposlitvi" && (rezultat.dobicek ?? 0) < 0) {
    notes.push({
      level: "opozorilo",
      kratko: "Posluje z izgubo",
      besedilo: `Stroški so višji od prihodkov, zato ima d. o. o. ${evri(-(rezultat.dobicek ?? 0))} izgube.`,
      povzetek: "posluje z izgubo",
    });
  }

  return notes;
}

// Oblika brez omejitev: nima opozorila, pogoja ali izključitve
export function brezOmejitev(notes: Note[]) {
  return notes.every((note) => note.level === "namig");
}

// Oblike, ki primerjajo dodatne prihodke ob redni zaposlitvi
const OBLIKE_OB_ZAPOSLITVI = [
  "PopoldanskiSP",
  "NormiraniPopoldanskiSP",
  "DOOObZaposlitvi",
];

const zakajBrezZaposlitve: Record<string, string> = {
  SP: "Če si zaposlen za polni delovni čas, je tvoj s.\u00a0p. popoldanski: zavarovan si iz zaposlitve in plačaš le pavšalne prispevke. Izračun najdeš v vrstici »Popoldanski s.\u00a0p.«.",
  NormiraniSP:
    "Če si zaposlen za polni delovni čas, je tvoj s.\u00a0p. popoldanski: zavarovan si iz zaposlitve in plačaš le pavšalne prispevke. Izračun najdeš v vrstici »Normirani popoldanski s.\u00a0p.«.",
  DOO: "Ob redni zaposlitvi primerjamo d.\u00a0o.\u00a0o., iz katerega ne prejemaš plače. Izračun najdeš v vrstici »D.\u00a0o.\u00a0o. ob zaposlitvi«.",
  TujiDelodajalec:
    "Izračun velja, če je zaposlitev pri tujem podjetju tvoja edina zaposlitev.",
  SlovenskiDelodajalec:
    "Izračun velja, če je zaposlitev v slovenskem podjetju tvoja edina zaposlitev.",
  PodjemnaPogodba:
    "Izračun velja, če nimaš druge zaposlitve: vključuje samoplačniško zdravstveno zavarovanje, dohodnina pa se ne računa skupaj s plačo.",
};

/*
  Ali oblika pride v poštev glede na odgovor »Že imaš redno zaposlitev?«.
  Oblike ob zaposlitvi primerjajo dodatne prihodke ob plači, ostale pa
  prihodke kot edini dohodek, zato se skupini med seboj izključujeta.
  Vrne izključitev z gumbom, ki odgovor spremeni, ali undefined.
*/
export function getPogojZaposlitve(
  modeId: string,
  { imaZaposlitev, imaPlaco }: { imaZaposlitev: boolean; imaPlaco: boolean }
): Note | undefined {
  const obZaposlitvi = OBLIKE_OB_ZAPOSLITVI.includes(modeId);
  if (obZaposlitvi && !imaZaposlitev) {
    return {
      level: "izkljuceno",
      kratko: "Le ob redni zaposlitvi",
      besedilo:
        modeId === "DOOObZaposlitvi"
          ? "Ta izračun velja, če si redno zaposlen drugje in iz d.\u00a0o.\u00a0o. ne prejemaš plače."
          : "Popoldanski s.\u00a0p. lahko odpreš, če si zaposlen za polni delovni čas. Za izračun potrebujemo tvojo plačo iz zaposlitve.",
      akcija: "imamZaposlitev",
    };
  }
  if (obZaposlitvi && !imaPlaco) {
    return {
      level: "izkljuceno",
      kratko: "Vnesi plačo iz zaposlitve",
      besedilo:
        "Za izračun potrebujemo tvojo letno bruto plačo iz zaposlitve.",
      akcija: "vnesiPlaco",
    };
  }
  if (!obZaposlitvi && imaZaposlitev) {
    const skupina = DOO_STRATEGIJE.includes(modeId) ? "DOO" : modeId;
    return {
      level: "izkljuceno",
      kratko: "Velja brez redne zaposlitve",
      besedilo: zakajBrezZaposlitve[skupina] ?? "Izračun velja brez redne zaposlitve.",
      akcija: "brezZaposlitve",
    };
  }
  return undefined;
}
