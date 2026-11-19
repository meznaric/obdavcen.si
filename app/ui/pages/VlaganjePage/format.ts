import formatCurrency from "~/utils/formatCurrency";

/** Znesek v evrih; brez centov, če je znesek cel. */
export function evri(znesek: number) {
  const zaokrozeno = Math.round(znesek * 100) / 100;
  return formatCurrency(zaokrozeno, Number.isInteger(zaokrozeno));
}

/** Znesek, zaokrožen na cele evre (za planer, kjer centi niso smiselni). */
export function evriCeli(znesek: number) {
  // + 0 pretvori −0 v 0, da ne izpišemo "−0 €".
  return formatCurrency(Math.round(znesek) + 0, true);
}

/** 0.25 → "25 %" (slovenski zapis z nedeljivim presledkom). */
export function odstotek(delez: number, decimalke = 0) {
  const stevilo = (delez * 100).toLocaleString("sl-SI", {
    maximumFractionDigits: decimalke,
  });
  return `${stevilo}\u00a0%`;
}

/** 1 leto, 2 leti, 3 leta, 5 let … */
export function let_(stevilo: number) {
  const ostanek = stevilo % 100;
  if (ostanek === 1) return `${stevilo} leto`;
  if (ostanek === 2) return `${stevilo} leti`;
  if (ostanek === 3 || ostanek === 4) return `${stevilo} leta`;
  return `${stevilo} let`;
}

/** "po 5 letih", "po 1 letu", "po 2 letih" (mestnik). */
export function poLetih(stevilo: number) {
  return stevilo % 100 === 1 ? `po ${stevilo} letu` : `po ${stevilo} letih`;
}
