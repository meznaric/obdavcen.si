// Delež zneska v prihodkih (npr. efektivna davčna stopnja). Pri prihodkih 0 €
// vrne 0, da se namesto NaN ali Infinity prikaže 0 %.
export function getDelez(znesek: number, prihodki: number) {
  return prihodki > 0 ? znesek / prihodki : 0;
}
