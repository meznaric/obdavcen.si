import { useMemo } from "react";
import type { SharedInputs, YearSettings } from "~/constants/types";
import {
  brezOmejitev,
  getNotes,
  getPogojZaposlitve,
  type Note,
  type Rezultat,
} from "~/utils/eligibility";
import { hasZaposlitev } from "~/utils/taxCalculator/popoldanskiSp";
import type { TaxModeResult, TaxModeSettings } from "~/utils/taxModes";
import type { DOOStrategija } from "../breakdowns/DOOBreakdown";

// »samodejno« pokaže najugodnejšo strategijo d. o. o. pri trenutnih vnosih
export type DOOIzbira = "samodejno" | DOOStrategija;

export interface Vrstica {
  // »DOO« za združeno vrstico d. o. o., sicer ključ oblike v taxModes
  id: string;
  modeId: string;
  mode: TaxModeSettings;
  ostane: number;
  davki: number;
  stroski: number;
  notes: Note[];
  izkljucena: boolean;
  // Mesto v razvrstitvi (1 = največ ostane); izključene oblike ga nimajo
  mesto?: number;
  // Le za vrstico d. o. o.
  doo?: {
    prikazana: DOOStrategija;
    najugodnejsa: DOOStrategija;
    strategije: { modeId: DOOStrategija; ostane: number; notes: Note[] }[];
  };
}

interface Izracun {
  modeId: string;
  mode: TaxModeSettings;
  result: TaxModeResult & Rezultat;
  notes: Note[];
}

function izracunaj(
  modeId: string,
  mode: TaxModeSettings,
  sharedInputs: SharedInputs,
  settings: YearSettings
): Izracun {
  const result = mode.calculator(sharedInputs, settings) as TaxModeResult &
    Rezultat;
  return {
    modeId,
    mode,
    result,
    notes: getNotes(modeId, result, sharedInputs, settings),
  };
}

function vVrstico(
  { modeId, mode, result, notes }: Izracun,
  sharedInputs: SharedInputs
): Omit<Vrstica, "id"> {
  const ostane = result.cistiPrihodki;
  const davki = result.totalTax;
  const stroski = sharedInputs.expenses;
  // »Ostane ti« = prihodki − davki in prispevki − stroški za vse oblike
  if (
    import.meta.env.DEV &&
    sharedInputs.revenue > 0 &&
    Math.abs(sharedInputs.revenue - davki - stroski - ostane) > 1
  ) {
    console.warn(
      `${mode.shortName}: ostane + davki + stroški se ne seštejejo v prihodke`,
      { ostane, davki, stroski, prihodki: sharedInputs.revenue }
    );
  }
  return {
    modeId,
    mode,
    ostane,
    davki,
    stroski,
    notes,
    izkljucena: notes.some((note) => note.level === "izkljuceno"),
  };
}

// Najugodnejša izmed kandidatk; oblike brez omejitev imajo prednost
function najboljsa<T extends { ostane: number; notes: Note[] }>(seznam: T[]) {
  const poOstanku = [...seznam].sort((a, b) => b.ostane - a.ostane);
  return poOstanku.find((s) => brezOmejitev(s.notes)) ?? poOstanku[0];
}

// Vrstica za obliko, ki zaradi odgovora o zaposlitvi ne pride v poštev; ne
// računamo je, ker izračun pri teh vnosih nima pomena
function nedostopnaVrstica(
  id: string,
  modeId: string,
  mode: TaxModeSettings,
  pogoj: Note
): Vrstica {
  return {
    id,
    modeId,
    mode,
    ostane: 0,
    davki: 0,
    stroski: 0,
    notes: [pogoj],
    izkljucena: true,
  };
}

export function useLeaderboard({
  modes,
  sharedInputs,
  currentSettings,
  imaZaposlitev,
  dooIzbira = "samodejno",
}: {
  modes: Record<string, TaxModeSettings>;
  sharedInputs: SharedInputs;
  currentSettings: YearSettings;
  imaZaposlitev: boolean;
  dooIzbira?: DOOIzbira;
}) {
  return useMemo(() => {
    // Vrstice v vrstnem redu iz taxModes; d. o. o. je ena vrstica na mestu
    // prve strategije
    const vrstice: (Vrstica | null)[] = [];
    const dooIzracuni: Izracun[] = [];
    let dooMesto = -1;
    const zaposlitev = {
      imaZaposlitev,
      imaPlaco: hasZaposlitev(sharedInputs),
    };

    for (const [modeId, mode] of Object.entries(modes)) {
      const pogoj = getPogojZaposlitve(modeId, zaposlitev);
      if (mode.group === "DOO") {
        if (dooMesto === -1) {
          dooMesto = vrstice.length;
          // Brez pogoja jo nadomesti spodaj, ko so izračunane vse strategije
          vrstice.push(
            pogoj ? nedostopnaVrstica("DOO", modeId, mode, pogoj) : null
          );
        }
        if (!pogoj) {
          dooIzracuni.push(
            izracunaj(modeId, mode, sharedInputs, currentSettings)
          );
        }
        continue;
      }
      vrstice.push(
        pogoj
          ? nedostopnaVrstica(modeId, modeId, mode, pogoj)
          : {
              id: modeId,
              ...vVrstico(
                izracunaj(modeId, mode, sharedInputs, currentSettings),
                sharedInputs
              ),
            }
      );
    }

    if (dooIzracuni.length > 0) {
      const strategije = dooIzracuni.map(({ modeId, result, notes }) => ({
        modeId: modeId as DOOStrategija,
        ostane: result.cistiPrihodki,
        notes,
      }));
      // Plača po izbiri je kandidatka le, ko je plača vnesena – brez nje
      // lastnik ni zavarovan in primerjava ne bi bila poštena
      const kandidatke = strategije.filter(
        ({ modeId }) =>
          modeId !== "DOOPoljubnaPlaca" || sharedInputs.salaryGross1 > 0
      );
      const najugodnejsa = najboljsa(kandidatke).modeId;
      const prikazana = dooIzbira === "samodejno" ? najugodnejsa : dooIzbira;
      const izracun = dooIzracuni.find(({ modeId }) => modeId === prikazana)!;
      vrstice[dooMesto] = {
        id: "DOO",
        ...vVrstico(izracun, sharedInputs),
        doo: { prikazana, najugodnejsa, strategije },
      };
    }

    // Razvrstitev po tem, koliko ostane; sort je stabilen, zato imajo
    // enake vrednosti vrstni red iz taxModes. Oblike, ki ne pridejo v
    // poštev, so na koncu v vrstnem redu iz taxModes.
    const vseVrstice = vrstice.filter((v): v is Vrstica => v !== null);
    const razvrscene = vseVrstice
      .filter((v) => !v.izkljucena)
      .sort((a, b) => b.ostane - a.ostane)
      .map((v, index) => ({ ...v, mesto: index + 1 }));
    const izkljucene = vseVrstice.filter((v) => v.izkljucena);

    const prva = razvrscene[0];
    const prvaBrezOmejitev = razvrscene.find((v) => brezOmejitev(v.notes));

    return {
      razvrscene,
      izkljucene,
      prva,
      // Le če prva vrstica ima omejitev (opozorilo ali pogoj)
      prvaBrezOmejitev:
        prva && prvaBrezOmejitev && prvaBrezOmejitev !== prva
          ? prvaBrezOmejitev
          : undefined,
      manjkaPlaca: imaZaposlitev && !zaposlitev.imaPlaco,
    };
  }, [modes, sharedInputs, currentSettings, imaZaposlitev, dooIzbira]);
}
