import { celiOdstotki, delez, evri } from "~/utils/numberFormat";

interface ShareBarProps {
  prihodki: number;
  ostane: number;
  davki: number;
  stroski: number;
}

// Vzorec za stroške in za del, ki preseže prihodke (izguba)
const crte =
  "repeating-linear-gradient(135deg, rgb(255 255 255 / 0.14) 0 6px, transparent 6px 12px)";

/*
  Znesek se izpiše le, če je del traku dovolj širok zanj. Vsak del je vsebnik
  (container), zato pravilo velja pri vsaki širini zaslona. Razredi morajo
  biti zapisani v celoti, da jih Tailwind najde.
*/
function vidnostZneska(besedilo: string) {
  if (besedilo.length <= 7) return "hidden @min-[3.75rem]:inline";
  if (besedilo.length <= 8) return "hidden @min-[4.25rem]:inline";
  if (besedilo.length <= 9) return "hidden @min-[4.75rem]:inline";
  return "hidden @min-[6.5rem]:inline";
}

/*
  Trak kot na sliki za deljenje (public/og-image.png): »Ostane« zeleno,
  »Davki« rdeče, »Stroški« sivo, v vsakem delu je letni znesek. Širine so
  deleži prihodkov. Pri izgubi (ostane < 0) davki in stroški skupaj
  presežejo prihodke, zato trak napolnita sorazmerno in sta prečrtana.
*/
export function ShareBar({ prihodki, ostane, davki, stroski }: ShareBarProps) {
  const izguba = ostane < 0;
  const [ostaneOdstotek, davkiOdstotek, stroskiOdstotek] = izguba
    ? [
        0,
        Math.round((davki / prihodki) * 100),
        Math.round((stroski / prihodki) * 100),
      ]
    : celiOdstotki([ostane / prihodki, davki / prihodki, stroski / prihodki]);
  const skupaj = izguba ? davki + stroski : prihodki;
  const sirina = (znesek: number) => Math.max(0, (znesek / skupaj) * 100);

  const segmenti = [
    {
      key: "ostane",
      besedilo: evri(ostane),
      sirina: izguba ? 0 : sirina(ostane),
      className: "bg-(--bar-ostane) justify-start",
    },
    {
      key: "davki",
      // Pri izgubi je zelenega dela ni, zato izgubo izpišemo tu
      besedilo: izguba ? `Izguba ${evri(-ostane)}` : evri(davki),
      sirina: sirina(davki),
      className: "bg-(--bar-davki) justify-end",
      vzorec: izguba,
    },
    {
      key: "stroski",
      besedilo: evri(stroski),
      sirina: sirina(stroski),
      className: "bg-(--bar-stroski) justify-end",
      vzorec: true,
    },
  ];

  const opis = `Ostane ti ${evri(ostane)} (${izguba ? delez(ostane / prihodki) : `${ostaneOdstotek}\u00a0%`}), davki in prispevki ${evri(davki)} (${davkiOdstotek}\u00a0%)${stroski > 0 ? `, stroški ${evri(stroski)} (${stroskiOdstotek}\u00a0%)` : ""}`;

  return (
    <span
      role="img"
      aria-label={opis}
      title={opis}
      className="flex h-9 w-full overflow-hidden rounded-md text-sm font-semibold text-white tabular-nums"
    >
      {segmenti.map((segment) =>
        segment.sirina <= 0 ? null : (
          <span
            key={segment.key}
            className={`@container flex min-w-0 items-center overflow-hidden px-2 whitespace-nowrap sm:px-3 ${segment.className}`}
            style={{
              width: `${segment.sirina}%`,
              backgroundImage: segment.vzorec ? crte : undefined,
            }}
            aria-hidden="true"
          >
            <span className={vidnostZneska(segment.besedilo)}>
              {segment.besedilo}
            </span>
          </span>
        )
      )}
    </span>
  );
}
