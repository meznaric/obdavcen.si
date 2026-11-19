import { useState } from "react";
import { MotionConfig } from "motion/react";
import { InformationCircleIcon } from "hugeicons-react";
import type { SharedInputs, YearSettings } from "~/constants/types";
import type { NoteAkcija } from "~/utils/eligibility";
import { evri } from "~/utils/numberFormat";
import type { TaxModeSettings } from "~/utils/taxModes";
import type {
  UpdateCurrentSettings,
  UpdateSharedInputs,
} from "../useSharedInputs";
import { PLACA_INPUT_ID } from "../GeneralSettings";
import { LeaderboardRow } from "./LeaderboardRow";
import { useLeaderboard, type DOOIzbira, type Vrstica } from "./useLeaderboard";

export type LeaderboardVariant = "samostojno" | "zaposlitev";

interface LeaderboardProps {
  imaZaposlitev: boolean;
  modes: Record<string, TaxModeSettings>;
  sharedInputs: SharedInputs;
  currentSettings: YearSettings;
  updateSharedInputs: UpdateSharedInputs;
  updateCurrentSettings: UpdateCurrentSettings;
}

// Barve traku (ShareBar) in legende za svetli in temni način
const barColors =
  "[--bar-ostane:var(--color-green-800)] [--bar-davki:var(--color-red-800)] [--bar-stroski:var(--color-gray-500)] dark:[--bar-ostane:var(--color-green-700)] dark:[--bar-davki:var(--color-red-700)] dark:[--bar-stroski:var(--color-gray-600)]";

function Ime({ vrstica }: { vrstica: Vrstica }) {
  return (
    <strong className="font-semibold">»{vrstica.mode.shortName}«</strong>
  );
}

function Summary({
  variant,
  prihodki,
  prva,
  prvaBrezOmejitev,
  manjkaPlaca,
}: {
  variant: LeaderboardVariant;
  prihodki: number;
  prva?: Vrstica;
  prvaBrezOmejitev?: Vrstica;
  manjkaPlaca: boolean;
}) {
  if (manjkaPlaca) {
    return (
      <p className="text-lg">
        Vnesi letno bruto plačo iz zaposlitve, da primerjamo oblike ob
        zaposlitvi.
      </p>
    );
  }
  if (prihodki <= 0 || !prva) {
    return <p className="text-lg">Vnesi prihodke, da primerjamo oblike.</p>;
  }
  const povzetek = prva.notes.find((note) => note.povzetek)?.povzetek;

  if (prvaBrezOmejitev && povzetek) {
    return (
      <p className="text-lg">
        Največ ti ostane pri obliki <Ime vrstica={prva} /> ({evri(prva.ostane)}
        ), vendar {povzetek}. Med oblikami brez omejitev ti največ ostane pri
        obliki <Ime vrstica={prvaBrezOmejitev} />:{" "}
        <strong className="whitespace-nowrap">
          {evri(prvaBrezOmejitev.ostane)}
        </strong>{" "}
        na leto.
      </p>
    );
  }

  if (variant === "zaposlitev") {
    return (
      <p className="text-lg">
        Od {evri(prihodki)} dodatnih prihodkov ti ob plači največ ostane pri
        obliki <Ime vrstica={prva} />:{" "}
        <strong className="whitespace-nowrap">{evri(prva.ostane)}</strong> na
        leto.
      </p>
    );
  }

  return (
    <p className="text-lg">
      Pri {evri(prihodki)} prihodkov ti največ ostane pri obliki{" "}
      <Ime vrstica={prva} />:{" "}
      <strong className="whitespace-nowrap">{evri(prva.ostane)}</strong> na
      leto oziroma{" "}
      <strong className="whitespace-nowrap">{evri(prva.ostane / 12)}</strong>{" "}
      na mesec.
    </p>
  );
}

function InfoNote({ children }: { children: React.ReactNode }) {
  return (
    <p className="flex items-start gap-2 rounded-md bg-base-200 p-3 text-sm">
      <InformationCircleIcon
        className="mt-0.5 size-4 shrink-0 text-info"
        aria-hidden="true"
      />
      <span>{children}</span>
    </p>
  );
}

export function Leaderboard({
  imaZaposlitev,
  modes,
  sharedInputs,
  currentSettings,
  updateSharedInputs,
  updateCurrentSettings,
}: LeaderboardProps) {
  const [odprte, setOdprte] = useState<Set<string>>(() => new Set());
  const [dooIzbira, setDOOIzbira] = useState<DOOIzbira>("samodejno");
  const { razvrscene, izkljucene, prva, prvaBrezOmejitev, manjkaPlaca } =
    useLeaderboard({
      modes,
      sharedInputs,
      currentSettings,
      imaZaposlitev,
      dooIzbira,
    });
  const variant: LeaderboardVariant = imaZaposlitev
    ? "zaposlitev"
    : "samostojno";
  const prihodki = sharedInputs.revenue;

  function preklopi(id: string) {
    setOdprte((prej) => {
      const nove = new Set(prej);
      if (nove.has(id)) {
        nove.delete(id);
      } else {
        nove.add(id);
      }
      return nove;
    });
  }

  // Polje za plačo se ob odgovoru »Da« pokaže z animacijo, zato počakamo nanj
  function fokusirajPlaco() {
    window.setTimeout(() => {
      const polje = document.getElementById(PLACA_INPUT_ID);
      polje?.scrollIntoView({ behavior: "smooth", block: "center" });
      polje?.focus({ preventScroll: true });
    }, 250);
  }

  function onAkcija(akcija: NoteAkcija) {
    switch (akcija) {
      case "prvoLetoSP":
        updateCurrentSettings({ spZnizaniPrispevki: "prvo" });
        break;
      case "brezZnizanjaSP":
        updateCurrentSettings({ spZnizaniPrispevki: "brez" });
        break;
      case "imamZaposlitev":
        updateSharedInputs({ imaZaposlitev: true });
        fokusirajPlaco();
        break;
      case "vnesiPlaco":
        fokusirajPlaco();
        break;
      case "brezZaposlitve":
        updateSharedInputs({ imaZaposlitev: false });
        break;
    }
  }

  const rowProps = (vrstica: Vrstica) => ({
    vrstica,
    prihodki,
    isExpanded: odprte.has(vrstica.id),
    onToggle: () => preklopi(vrstica.id),
    onAkcija,
    currentSettings,
    sharedInputs,
    updateSharedInputs,
    dooIzbira,
    onDOOIzbira: setDOOIzbira,
  });

  return (
    <MotionConfig reducedMotion="user">
      <section
        className={`space-y-4 ${barColors}`}
        aria-labelledby={`primerjava-${variant}`}
      >
        <h2 id={`primerjava-${variant}`} className="sr-only">
          {variant === "zaposlitev"
            ? "Primerjava oblik ob redni zaposlitvi"
            : "Primerjava oblik"}
        </h2>
        {/* Najugodnejšo obliko vidiš na traku; povzetek je le za bralnike
            zaslona, ki ob spremembi vnosov preberejo novo razvrstitev */}
        <div aria-live="polite" className="sr-only">
          <Summary
            variant={variant}
            prihodki={prihodki}
            prva={prva}
            prvaBrezOmejitev={prvaBrezOmejitev}
            manjkaPlaca={manjkaPlaca}
          />
        </div>
        {variant === "zaposlitev" && !manjkaPlaca && (
          <InfoNote>
            Upoštevani so le davki in prispevki od dodatnih prihodkov, ne pa
            tudi tisti od plače.
          </InfoNote>
        )}
        {variant === "samostojno" && prihodki > 0 && prihodki < 20000 && (
          <InfoNote>
            Pri prihodkih pod 20.000&nbsp;€ izračun predpostavlja, da si vse
            leto zavarovan oziroma zaposlen za polni delovni čas. Ne upošteva
            krajšega delovnega časa, začetka poslovanja med letom,
            zdravstvenega zavarovanja, ki ga plača občina, in znižanja
            najnižje osnove za prispevke s.&nbsp;p. po ZIURS, ki še ne velja.
          </InfoNote>
        )}
        {/* Vse oblike so vedno na seznamu; tiste, ki ne pridejo v poštev,
            so na koncu zatemnjene, ikona pove zakaj */}
        <ol className="space-y-2">
          {[...razvrscene, ...izkljucene].map((vrstica) => (
            <LeaderboardRow key={vrstica.id} {...rowProps(vrstica)} />
          ))}
        </ol>
      </section>
    </MotionConfig>
  );
}
