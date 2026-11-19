import { dobicekIzKapitalaStopnje } from "~/constants/2026/vlaganje";
import { odstotek, poLetih } from "./format";

// Besedila o stopnjah za dobiček iz kapitala, sestavljena iz konstant, da se
// ob spremembi zakona spremenijo povsod hkrati.

const st = dobicekIzKapitalaStopnje;

/** Leta, po katerih se stopnja zniža, npr. [5, 10, 15]. */
export const pragoviLet = st.filter((s) => s.odLet > 0).map((s) => s.odLet);

/** "5, 10 in 15" */
export const pragoviBesedilo = new Intl.ListFormat("sl", {
  type: "conjunction",
}).format(pragoviLet.map(String));

/** "25 % → 20 % → 15 % → 0 %" */
export const lestvicaPuscice = st.map((s) => odstotek(s.stopnja)).join(" → ");

/** "25/20/15/0 %" (za kratke opise, npr. meta description) */
export const lestvicaKratka = `${st.map((s) => s.stopnja * 100).join("/")}\u00a0%`;

/** "25 %, po 5 letih imetništva 20 %, po 10 letih 15 %, po 15 letih nič" */
export const lestvicaStavek = st
  .map((s, i) => {
    const stopnja = s.stopnja === 0 ? "nič" : odstotek(s.stopnja);
    if (i === 0) return stopnja;
    return `${poLetih(s.odLet)}${i === 1 ? " imetništva" : ""} ${stopnja}`;
  })
  .join(", ");

/** Leta, po katerih dobiček ni več obdavčen (15). */
export const oprostitevPoLetih = st[st.length - 1].odLet;
