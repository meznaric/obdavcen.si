import { MesecniZneski } from "../types";

// Podjemna / avtorska pogodba s tujim izplačevalcem (edini dohodek)
// FURS: Dohodki iz drugega pogodbenega razmerja
// https://www.fu.gov.si/fileadmin/Internet/Davki_in_druge_dajatve/Podrocja/Dohodnina/Dohodek_iz_zaposlitve/Opis/Drugo_pogodbeno_razmerje.docx
// SPOT: https://spot.gov.si/sl/teme/podjemna-pogodba
// SPOT: https://spot.gov.si/sl/teme/avtorska-pogodba

// Normirani stroški 10 % dohodka (enako za podjemno in avtorsko pogodbo)
export const pogodbaNormiraniStroski = 0.1;
// PIZ po 18. členu ZPIZ-2: 15,5 % prejemnik + 8,85 % izplačevalec. Ker tuji
// izplačevalec ni plačnik davka, oba prispevka plača prejemnik sam
// (114. člen ZMEPIZ-1, FURS Drugo pogodbeno razmerje, 4.1).
export const pogodbaPIZPrejemnik = 0.155;
export const pogodbaPIZIzplacevalec = 0.0885;
// Zdravstveno zavarovanje prejemnika 6,36 % (55.a člen ZZVZZ). Prispevek
// 0,53 % za poškodbe pri delu pri tujem izplačevalcu ne nastane.
// https://www.fu.gov.si/fileadmin/Internet/Davki_in_druge_dajatve/Podrocja/Mednarodno_obdavcenje/Opis/Obdavcitev_tujcev_z_dovoljenjem_za_zacasno_prebivanje_za_digitalnega_nomada_po_ZDoh-2_in_mednarodnih_pogodbah.doc
export const pogodbaZZ = 0.0636;
// Dolgotrajna oskrba 1 % od 1. 7. 2025
export const pogodbaDO: MesecniZneski = [
  { odMeseca: 1, znesek: 0 },
  { odMeseca: 7, znesek: 0.01 },
];
// Dohodek iz pogodbe ne daje zdravstvenega zavarovanja. Kdor nima druge
// podlage, se zavaruje sam po 20. točki 15. člena ZZVZZ (podlaga 048):
// 5,96 % od 25 % zadnje znane povprečne letne plače, preračunane na mesec.
// Januarja 25 % × 2.220,95 € (PP 2023) = 33,09 €, od februarja
// 25 % × 2.394,92 € (PP 2024) = 35,68 € na mesec.
// https://zavezanec.zzzs.si/prispevki-za-obvezno-zdravstveno-zavarovanje/preglednica-prispevkov/
export const samoplacniskiZZ: MesecniZneski = [
  { odMeseca: 1, znesek: 33.09 },
  { odMeseca: 2, znesek: 35.68 },
];
// Ista oseba od 1. 7. 2025 plača še prispevek za dolgotrajno oskrbo: 1 % od
// iste osnove (25 % × 2.394,92 €) = 5,99 € na mesec.
// https://zavezanec.zzzs.si/fileadmin/user_upload/dokumenti/zavezanec/do/preglednica_zavarovanci__do_zzzs_v2.pdf
export const samoplacniskiDO: MesecniZneski = [
  { odMeseca: 1, znesek: 0 },
  { odMeseca: 7, znesek: 5.99 },
];
