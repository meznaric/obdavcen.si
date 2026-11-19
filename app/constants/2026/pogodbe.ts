import { MesecniZneski } from "../types";

// Podjemna / avtorska pogodba s tujim izplačevalcem (edini dohodek)
// FURS: Dohodki iz drugega pogodbenega razmerja
// https://www.fu.gov.si/fileadmin/Internet/Davki_in_druge_dajatve/Podrocja/Dohodnina/Dohodek_iz_zaposlitve/Opis/Drugo_pogodbeno_razmerje.docx
// SPOT (zadnja sprememba 6. 10. 2026): https://spot.gov.si/sl/teme/podjemna-pogodba
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
// Dolgotrajna oskrba 1 %
export const pogodbaDO: MesecniZneski = [{ odMeseca: 1, znesek: 0.01 }];
// Dohodek iz pogodbe ne daje zdravstvenega zavarovanja. Kdor nima druge
// podlage, se zavaruje sam po 20. točki 15. člena ZZVZZ (podlaga 048):
// 5,96 % od 25 % zadnje znane povprečne letne plače, preračunane na mesec.
// Januarja 25 % × 2.394,92 € (PP 2024), od februarja 25 % × 2.536,03 €
// (PP 2025) = 37,79 € na mesec. (21. točka velja le za osebe, ki jim je
// pravico priznal center za socialno delo; prispevek zanje plača država.)
// https://zavezanec.zzzs.si/fileadmin/user_upload/dokumenti/preglednica_po_zavarovancih_-_15.clen_zzvzz_2026__2_.docx
// https://zavezanec.zzzs.si/prispevki-za-obvezno-zdravstveno-zavarovanje/preglednica-prispevkov/
export const samoplacniskiZZ: MesecniZneski = [
  { odMeseca: 1, znesek: 35.68 },
  { odMeseca: 2, znesek: 37.79 },
];
// Ista oseba plača še prispevek za dolgotrajno oskrbo: 1 % od iste osnove
// (25 % zadnje znane povprečne letne plače) = 6,34 € na mesec.
// https://zavezanec.zzzs.si/fileadmin/user_upload/dokumenti/zavezanec/do/preglednica_zavarovanci__do_zzzs_v2.pdf
export const samoplacniskiDO: MesecniZneski = [
  { odMeseca: 1, znesek: 5.99 },
  { odMeseca: 2, znesek: 6.34 },
];
