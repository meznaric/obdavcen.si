import { useEffect, useId, useRef, useState } from "react";
import {
  Alert02Icon,
  InformationCircleIcon,
  UnavailableIcon,
} from "hugeicons-react";
import { twMerge } from "tailwind-merge";
import type { Note, NoteAkcija, NoteLevel } from "~/utils/eligibility";

type VidnaRaven = Exclude<NoteLevel, "namig">;

// Ikona in barva za vsako raven; rumena je rezervirana za opozorila
export const ikone: Record<
  VidnaRaven,
  { Icon: typeof Alert02Icon; barva: string }
> = {
  izkljuceno: { Icon: UnavailableIcon, barva: "text-muted" },
  opozorilo: {
    Icon: Alert02Icon,
    barva: "text-amber-700 dark:text-amber-400",
  },
  pogoj: { Icon: InformationCircleIcon, barva: "text-info" },
};

export const akcijaLabels: Record<NoteAkcija, string> = {
  prvoLetoSP: "Upoštevaj prvo leto",
  brezZnizanjaSP: "Izračunaj brez znižanja",
  imamZaposlitev: "Imam redno zaposlitev",
  vnesiPlaco: "Vnesi plačo",
  brezZaposlitve: "Izračunaj brez zaposlitve",
};

const prednost: VidnaRaven[] = ["izkljuceno", "opozorilo", "pogoj"];

/*
  Ikona na desni strani vrstice: pove, zakaj oblika ne pride v poštev ali
  kakšne omejitve ima, in ponudi gumb, ki zadevo razreši. Z miško se odpre ob
  prehodu in ostane odprta po kliku; na zaslonu na dotik se odpre ob dotiku.
  Zapre se ob kliku drugam ali s tipko Esc.
*/
export function StatusIcon({
  notes,
  onAkcija,
}: {
  notes: Note[];
  onAkcija: (akcija: NoteAkcija) => void;
}) {
  const [odprta, setOdprta] = useState(false);
  const [pripeta, setPripeta] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const panelId = useId();

  useEffect(() => {
    if (!odprta) return;
    const zapri = () => {
      setOdprta(false);
      setPripeta(false);
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!ref.current?.contains(event.target as Node)) zapri();
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") zapri();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [odprta]);

  const vidne = notes.filter(
    (note): note is Note & { level: VidnaRaven } => note.level !== "namig"
  );
  if (vidne.length === 0) {
    // Prazen prostor, da so trakovi vseh vrstic enako široki
    return <span className="size-8 shrink-0" aria-hidden="true" />;
  }
  const glavna = prednost
    .map((raven) => vidne.find((note) => note.level === raven))
    .find(Boolean)!;
  const { Icon, barva } = ikone[glavna.level];

  return (
    <div
      ref={ref}
      className="relative shrink-0"
      onPointerEnter={(event) => {
        if (event.pointerType === "mouse") setOdprta(true);
      }}
      onPointerLeave={(event) => {
        if (event.pointerType === "mouse" && !pripeta) setOdprta(false);
      }}
    >
      <button
        type="button"
        aria-expanded={odprta}
        aria-controls={panelId}
        aria-label={`${glavna.kratko} – zakaj?`}
        onClick={() => {
          setOdprta(!pripeta);
          setPripeta(!pripeta);
        }}
        className={twMerge(
          "grid size-8 cursor-pointer place-items-center rounded-full transition-colors hover:bg-base-200 focus-visible:outline-2 focus-visible:outline-accent",
          barva
        )}
      >
        <Icon className="size-5" aria-hidden="true" />
      </button>
      {odprta && (
        // pt namesto mt, da miška pri prehodu na ploščo ne zapusti ikone
        <div
          id={panelId}
          className="absolute top-full right-0 z-30 w-72 max-w-[calc(100vw-2rem)] pt-1.5"
        >
          <div className="space-y-3 rounded-box border border-base-300 bg-base-100 p-3 text-sm shadow-lg">
            {vidne.map((note) => {
              const { Icon: NoteIcon, barva: noteBarva } = ikone[note.level];
              return (
                <div key={note.besedilo} className="space-y-1">
                  {note.kratko && (
                    <p className="flex items-center gap-1.5 font-semibold">
                      <NoteIcon
                        className={twMerge("size-4 shrink-0", noteBarva)}
                        aria-hidden="true"
                      />
                      {note.kratko}
                    </p>
                  )}
                  <p>{note.besedilo}</p>
                  {note.akcija && (
                    <button
                      type="button"
                      className="btn mt-1 btn-sm btn-accent"
                      onClick={() => {
                        setOdprta(false);
                        setPripeta(false);
                        onAkcija(note.akcija!);
                      }}
                    >
                      {akcijaLabels[note.akcija]}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
