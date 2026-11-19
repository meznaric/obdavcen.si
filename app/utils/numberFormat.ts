// Oblike zapisa za primerjavo na prvi strani: zneski v celih evrih, deleži
// prihodkov v celih odstotkih, zakonske stopnje s toliko decimalkami, kot jih
// potrebujejo. Intl zapiše pravi minus (−) in nedeljivi presledek pred % in €.

const evriFormat = new Intl.NumberFormat("sl-SI", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 0,
  minimumFractionDigits: 0,
  // sl-SI privzeto ne loči štirimestnih števil (9721 €), na strani pišemo 9.721 €
  useGrouping: "always",
});

const centiFormat = new Intl.NumberFormat("sl-SI", {
  style: "currency",
  currency: "EUR",
  maximumFractionDigits: 2,
  minimumFractionDigits: 2,
  useGrouping: "always",
});

const delezFormat = new Intl.NumberFormat("sl-SI", {
  style: "percent",
  maximumFractionDigits: 0,
});

const stopnjaFormat = new Intl.NumberFormat("sl-SI", {
  style: "percent",
  maximumFractionDigits: 2,
});

// Zaokroži na cele evre in se izogne zapisu »−0 €«
function brezNegativneNicle(value: number, decimalke: number) {
  const faktor = 10 ** decimalke;
  const zaokrozeno = Math.round(value * faktor) / faktor;
  return zaokrozeno === 0 ? 0 : zaokrozeno;
}

/** Znesek v celih evrih, npr. »49.826 €«. */
export function evri(value: number) {
  return evriFormat.format(brezNegativneNicle(value, 0));
}

/** Znesek s centi, za mesečne zakonske zneske, npr. »37,17 €«. */
export function evriInCenti(value: number) {
  return centiFormat.format(brezNegativneNicle(value, 2));
}

/** Delež prihodkov v celih odstotkih, npr. »83 %«. */
export function delez(value: number) {
  return delezFormat.format(brezNegativneNicle(value, 2));
}

/** Zakonska stopnja brez odvečnih ničel, npr. »20 %«, »15,5 %«, »0,53 %«. */
export function stopnja(value: number) {
  return stopnjaFormat.format(value);
}

/** »10.174 € (17 %)« – znesek in njegov delež prihodkov. */
export function evriInDelez(value: number, prihodki: number) {
  return prihodki > 0
    ? `${evri(value)} (${delez(value / prihodki)})`
    : evri(value);
}

/**
 * Celi odstotki, ki se seštejejo v 100 (metoda največjih ostankov), da se
 * deleži v vrstici ne seštejejo v 99 ali 101 %.
 */
export function celiOdstotki(delezi: number[]): number[] {
  const odstotki = delezi.map((d) => Math.max(0, d) * 100);
  const vsota = odstotki.reduce((a, b) => a + b, 0);
  if (vsota <= 0) return odstotki.map(() => 0);
  const cilj = Math.round(vsota);
  const spodnji = odstotki.map(Math.floor);
  let manjka = cilj - spodnji.reduce((a, b) => a + b, 0);
  const poOstanku = odstotki
    .map((o, i) => ({ i, ostanek: o - Math.floor(o) }))
    .sort((a, b) => b.ostanek - a.ostanek);
  for (const { i } of poOstanku) {
    if (manjka <= 0) break;
    spodnji[i] += 1;
    manjka -= 1;
  }
  return spodnji;
}
