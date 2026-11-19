import { IncomeTaxBrackets, MesecniZneski } from "../types";

// Popoldanski s. p. — oseba je zavarovana na podlagi zaposlitve za polni delovni
// čas, zato plačuje le pavšalne prispevke (pokojninska doba iz s. p. ne teče).
// https://fu.gov.si/fileadmin/Internet/Davki_in_druge_dajatve/Podrocja/Dohodnina/Dohodek_iz_dejavnosti/Opis/Davki_za_zacetnike_-_fizicne_osebe_ki_opravljajo_dejavnost.pdf

// PIZ pavšal (20. člen ZPIZ-2), ki ga določi ZPIZ s Sklepom o določitvi
// prispevkov za posebne primere zavarovanja: 46,28 € od 1. 4. 2024,
// 49,15 € od 1. 4. 2025 (FURS, Davki za začetnike, 41. izdaja)
// https://pisrs.si/pregledPredpisa?id=SKLE11045
// https://www.fu.gov.si/fileadmin/Internet/Davki_in_druge_dajatve/Podrocja/Prispevki_za_socialno_varnost/Opis/Prispevki_za_osebe_ki_opravljajo_dejavnost_kot_postranski_poklic.doc
export const popoldanskiPIZ: MesecniZneski = [
  { odMeseca: 1, znesek: 46.28 },
  { odMeseca: 4, znesek: 49.15 },
];

// ZZZS, 10. točka 17. člena ZZVZZ: 0,53 % PP in 6,36 % od 25 % PP
// PP = povprečna bruto plača za oktober 2024 = 2.388,35 €
// https://zavezanec.zzzs.si/fileadmin/user_upload/dokumenti/zavezanec/preglednica_po_zavarovancih_17._in_18._clen_zzvzz_2025.docx
export const popoldanskiZZPoskodbe: MesecniZneski = [
  { odMeseca: 1, znesek: 12.66 },
];
export const popoldanskiZZ: MesecniZneski = [{ odMeseca: 1, znesek: 37.97 }];

// Dolgotrajna oskrba: 1 % od 25 % PP (1 % × 25 % × 2.388,35 €), plačuje se
// od 1. 7. 2025
// https://zavezanec.zzzs.si/fileadmin/user_upload/dokumenti/zavezanec/do/preglednica_zavarovanci__do_zzzs_v2.pdf
export const popoldanskiDO: MesecniZneski = [
  { odMeseca: 1, znesek: 0 },
  { odMeseca: 7, znesek: 5.97 },
];

// Normirani odhodki za zavezance, ki niso zavarovani na podlagi samozaposlitve
// (2. odstavek 59. člena ZDoh-2, ZDoh-2AB, v uporabi od 1. 1. 2025):
// 80 % prihodkov do 12.500 €, 40 % od 12.500 € do 30.000 €, 0 % nad 30.000 €
// https://pisrs.si/api/uradni-list/objava/u2024104.pdf
export const normiranPopoldanskiOdhodki: IncomeTaxBrackets = [
  { percentage: 0.8, maxNumber: 12500 },
  { percentage: 0.4, maxNumber: 30000 },
  { percentage: 0 },
];
// V letu 2025 še enotna 20 % stopnja (dokončen davek)
export const normiranPopoldanskiTaxBrackets: IncomeTaxBrackets = [
  { percentage: 0.2 },
];
// Vstopni prag za 2025 brez zavarovanja na podlagi samozaposlitve: 30.000 €
// https://www.gov.si/novice/2025-11-24-novosti-pri-ugotavljanju-davcne-osnove-z-upostevanjem-normiranih-odhodkov-v-letu-2026/
export const normiranPopoldanskiMaxRevenue = 30000;
