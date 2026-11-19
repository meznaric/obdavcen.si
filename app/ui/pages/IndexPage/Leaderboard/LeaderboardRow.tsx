import { useId, type ComponentType } from "react";
import { Link } from "react-router";
import { AnimatePresence, motion } from "motion/react";
import {
  Alert02Icon,
  ArrowDown01Icon,
  ArrowRight01Icon,
  CancelCircleIcon,
  InformationCircleIcon,
} from "hugeicons-react";
import { twMerge } from "tailwind-merge";
import type { YearSettings } from "~/constants/types";
import type { Note, NoteAkcija, NoteLevel } from "~/utils/eligibility";
import { DOOBreakdown } from "../breakdowns/DOOBreakdown";
import { DOOObZaposlitviBreakdown } from "../breakdowns/DOOObZaposlitviBreakdown";
import { NormiraniPopoldanskiSPBreakdown } from "../breakdowns/NormiraniPopoldanskiSPBreakdown";
import { NormiraniSPBreakdown } from "../breakdowns/NormiraniSPBreakdown";
import { PodjemnaPogodbaBreakdown } from "../breakdowns/PodjemnaPogodbaBreakdown";
import { PopoldanskiSPBreakdown } from "../breakdowns/PopoldanskiSPBreakdown";
import { SPBreakdown } from "../breakdowns/SPBreakdown";
import { SlovenskiDelodajalecBreakdown } from "../breakdowns/SlovenskiDelodajalecBreakdown";
import { TujiDelodajalecBreakdown } from "../breakdowns/TujiDelodajalecBreakdown";
import type { BreakdownProps } from "../breakdowns/types";
import type { UpdateSharedInputs } from "../useSharedInputs";
import { DOOStrategyPicker } from "./DOOStrategyPicker";
import { ShareBar } from "./ShareBar";
import { akcijaLabels, StatusIcon } from "./StatusIcon";
import type { DOOIzbira, Vrstica } from "./useLeaderboard";

const breakdowns: Record<string, ComponentType<BreakdownProps>> = {
  NormiraniSP: NormiraniSPBreakdown,
  SP: SPBreakdown,
  TujiDelodajalec: TujiDelodajalecBreakdown,
  SlovenskiDelodajalec: SlovenskiDelodajalecBreakdown,
  PodjemnaPogodba: PodjemnaPogodbaBreakdown,
  PopoldanskiSP: PopoldanskiSPBreakdown,
  NormiraniPopoldanskiSP: NormiraniPopoldanskiSPBreakdown,
  DOOObZaposlitvi: DOOObZaposlitviBreakdown,
};

// Barve opozoril v razširjeni vrstici za svetli in temni način
const noteStyles: Record<
  Exclude<NoteLevel, "namig">,
  { callout: string; Icon: typeof Alert02Icon }
> = {
  izkljuceno: {
    callout:
      "border-red-600 bg-red-50 text-red-950 dark:border-red-500 dark:bg-red-950/50 dark:text-red-100",
    Icon: CancelCircleIcon,
  },
  opozorilo: {
    callout:
      "border-amber-500 bg-amber-50 text-amber-950 dark:border-amber-400 dark:bg-amber-950/50 dark:text-amber-100",
    Icon: Alert02Icon,
  },
  pogoj: {
    callout:
      "border-sky-600 bg-sky-50 text-sky-950 dark:border-sky-400 dark:bg-sky-950/50 dark:text-sky-100",
    Icon: InformationCircleIcon,
  },
};

function NoteCallout({
  note,
  onAkcija,
}: {
  note: Note;
  onAkcija: (akcija: NoteAkcija) => void;
}) {
  if (note.level === "namig") {
    return (
      <p className="flex items-start gap-2 text-sm text-muted">
        <InformationCircleIcon
          className="mt-0.5 size-4 shrink-0"
          aria-hidden="true"
        />
        <span>
          {note.besedilo}{" "}
          {note.akcija && (
            <button
              type="button"
              className="link link-accent font-medium whitespace-nowrap"
              onClick={() => onAkcija(note.akcija!)}
            >
              {akcijaLabels[note.akcija]}
            </button>
          )}
        </span>
      </p>
    );
  }
  const { callout, Icon } = noteStyles[note.level];
  return (
    <p
      className={twMerge(
        "flex items-start gap-2 rounded-md border-l-4 p-3 text-sm",
        callout
      )}
    >
      <Icon className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
      <span>{note.besedilo}</span>
    </p>
  );
}

interface LeaderboardRowProps {
  vrstica: Vrstica;
  prihodki: number;
  isExpanded: boolean;
  onToggle: () => void;
  onAkcija: (akcija: NoteAkcija) => void;
  currentSettings: YearSettings;
  sharedInputs: BreakdownProps["sharedInputs"];
  updateSharedInputs: UpdateSharedInputs;
  dooIzbira: DOOIzbira;
  onDOOIzbira: (izbira: DOOIzbira) => void;
}

// »D. o. o. – največ dividend« → ime »D. o. o.« in strategija »največ
// dividend«; zatemnjena vrstica d. o. o. strategije nima
function deliIme(vrstica: Vrstica) {
  const { mode, doo } = vrstica;
  if (mode.group !== "DOO" || !mode.strategy) return { ime: mode.shortName };
  return {
    ime: mode.shortName.split(" – ")[0],
    strategija: doo ? mode.strategy.toLowerCase() : undefined,
  };
}

export function LeaderboardRow({
  vrstica,
  prihodki,
  isExpanded,
  onToggle,
  onAkcija,
  currentSettings,
  sharedInputs,
  updateSharedInputs,
  dooIzbira,
  onDOOIzbira,
}: LeaderboardRowProps) {
  const buttonId = useId();
  const panelId = useId();
  const { mode, ostane, davki, stroski, notes, izkljucena, doo } = vrstica;
  const Breakdown = breakdowns[vrstica.modeId];
  const oznake = notes.filter((note) => note.level !== "namig");
  const namigi = notes.filter((note) => note.level === "namig");
  const razlog = notes.find((note) => note.level === "izkljuceno");
  const { ime, strategija } = deliIme(vrstica);
  const odprta = isExpanded && !izkljucena;

  /*
    Puščica in ime sta na telefonu nad trakom, na širšem zaslonu levo od
    njega. Zatemnjene vrstice imajo namesto puščice prazen prostor, da so
    imena in trakovi vseh vrstic poravnani.
  */
  const mreza =
    "grid min-w-0 flex-1 items-center gap-y-1.5 sm:grid-cols-[13rem_minmax(0,1fr)] sm:gap-x-3 lg:grid-cols-[20rem_minmax(0,1fr)]";
  const puscica = (
    <span
      aria-hidden="true"
      className={twMerge(
        "grid size-7 shrink-0 place-items-center rounded-full",
        izkljucena
          ? "invisible"
          : "bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-content",
        odprta && "bg-accent text-accent-content"
      )}
    >
      <ArrowDown01Icon
        className={twMerge(
          "size-4 transition-transform",
          odprta && "rotate-180"
        )}
      />
    </span>
  );
  const imeOblike = (
    <span className="flex min-w-0 items-center gap-2">
      {puscica}
      <span
        className={twMerge(
          "min-w-0 text-sm leading-tight sm:text-base",
          izkljucena && "opacity-60"
        )}
      >
        <span className="font-semibold">{ime}</span>
        {strategija && <span className="text-muted"> – {strategija}</span>}
      </span>
    </span>
  );

  return (
    <motion.li
      layout="position"
      className={twMerge(
        "rounded-lg border",
        izkljucena
          ? "border-transparent"
          : "border-base-300 bg-base-100 shadow-xs transition-colors hover:border-accent",
        odprta && "border-accent"
      )}
    >
      <div className="flex items-end gap-1 p-1.5 sm:items-center sm:gap-2 sm:p-2">
        {izkljucena ? (
          <div className={mreza}>
            {imeOblike}
            <span className="flex h-9 items-center rounded-md border border-dashed border-base-content/25 px-3 text-sm text-muted">
              {razlog?.kratko}
            </span>
          </div>
        ) : (
          <button
            id={buttonId}
            type="button"
            aria-expanded={odprta}
            aria-controls={panelId}
            onClick={onToggle}
            className={twMerge(
              mreza,
              "group cursor-pointer rounded-md text-left hover:[&_[role=img]]:brightness-110 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent"
            )}
          >
            {imeOblike}
            {prihodki > 0 ? (
              <ShareBar
                prihodki={prihodki}
                ostane={ostane}
                davki={davki}
                stroski={stroski}
              />
            ) : (
              <span className="block h-9 rounded-md bg-base-200" />
            )}
          </button>
        )}
        <StatusIcon notes={notes} onAkcija={onAkcija} />
      </div>
      <AnimatePresence initial={false}>
        {odprta && (
          <motion.div
            id={panelId}
            role="region"
            aria-labelledby={buttonId}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="space-y-3 px-1 pt-2 pb-3 sm:px-3">
              {oznake.map((note) => (
                <NoteCallout
                  key={note.besedilo}
                  note={note}
                  onAkcija={onAkcija}
                />
              ))}
              <p className="text-sm">
                {mode.about}{" "}
                {mode.articlePath && (
                  <Link
                    to={mode.articlePath}
                    className="link link-accent inline-flex items-center gap-0.5 font-medium whitespace-nowrap"
                  >
                    Več o obliki
                    <ArrowRight01Icon className="size-4" aria-hidden="true" />
                  </Link>
                )}
              </p>
              {doo && (
                <DOOStrategyPicker
                  doo={doo}
                  dooIzbira={dooIzbira}
                  onDOOIzbira={onDOOIzbira}
                  currentSettings={currentSettings}
                  sharedInputs={sharedInputs}
                  updateSharedInputs={updateSharedInputs}
                />
              )}
              {doo ? (
                <DOOBreakdown
                  strategija={doo.prikazana}
                  currentSettings={currentSettings}
                  sharedInputs={sharedInputs}
                />
              ) : (
                Breakdown && (
                  <Breakdown
                    currentSettings={currentSettings}
                    sharedInputs={sharedInputs}
                  />
                )
              )}
              {namigi.map((note) => (
                <NoteCallout
                  key={note.besedilo}
                  note={note}
                  onAkcija={onAkcija}
                />
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.li>
  );
}
