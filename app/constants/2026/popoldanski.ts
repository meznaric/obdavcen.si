import { IncomeTaxBrackets, MesecniZneski } from "../types";

// Popoldanski s. p. — oseba je zavarovana na podlagi zaposlitve za polni delovni
// čas, zato plačuje le pavšalne prispevke (pokojninska doba iz s. p. ne teče).
// FURS, Davki za začetnike, 41. izdaja (marec 2026), poglavji 7 in 9:
// PIZ 52,05 € (od 1. 4. 2026, prej 49,15 €), ZZ in DO 60,96 € ((13,63 € + 40,90 €) + 6,43 €)
// https://fu.gov.si/fileadmin/Internet/Davki_in_druge_dajatve/Podrocja/Dohodnina/Dohodek_iz_dejavnosti/Opis/Davki_za_zacetnike_-_fizicne_osebe_ki_opravljajo_dejavnost.pdf

// PIZ pavšal (20. člen ZPIZ-2), usklajuje se 1. aprila (Sklep ZPIZ o določitvi
// prispevkov za posebne primere zavarovanja)
// https://pisrs.si/pregledPredpisa?id=SKLE11045
// https://www.fu.gov.si/fileadmin/Internet/Davki_in_druge_dajatve/Podrocja/Prispevki_za_socialno_varnost/Opis/Prispevki_za_osebe_ki_opravljajo_dejavnost_kot_postranski_poklic.doc
export const popoldanskiPIZ: MesecniZneski = [
  { odMeseca: 1, znesek: 49.15 },
  { odMeseca: 4, znesek: 52.05 },
];

// ZZZS, 10. točka 17. člena ZZVZZ: 0,53 % PP in 6,36 % od 25 % PP
// PP = povprečna bruto plača za oktober 2025 = 2.572,07 €
// https://zavezanec.zzzs.si/fileadmin/user_upload/dokumenti/preglednica_po_zavarovancih_-_17._in_18._clen_zzvzz_2026__2_.docx
export const popoldanskiZZPoskodbe: MesecniZneski = [
  { odMeseca: 1, znesek: 13.63 },
];
export const popoldanskiZZ: MesecniZneski = [{ odMeseca: 1, znesek: 40.9 }];

// Dolgotrajna oskrba: 1 % od 25 % PP = 6,43 €
// https://www.fu.gov.si/fileadmin/Internet/Davki_in_druge_dajatve/Podrocja/Prispevki_za_socialno_varnost/Opis/Prispevki_za_osebe_ki_opravljajo_dejavnost_kot_postranski_poklic.doc
export const popoldanskiDO: MesecniZneski = [{ odMeseca: 1, znesek: 6.43 }];

// Normirani odhodki za zavezance, ki niso zavarovani na podlagi samozaposlitve
// (2. odstavek 59. člena ZDoh-2 — ZPZR ga ni spremenil):
// 80 % prihodkov do 12.500 €, 40 % od 12.500 € do 30.000 €, 0 % nad 30.000 €
// https://pisrs.si/pregledPredpisa?id=ZAKO4697
// https://pisrs.si/api/uradni-list/objava/u2024104.pdf
// https://spot.gov.si/sl/teme/primerjava-med-navadnim-in-normiranim-s-p
export const normiranPopoldanskiOdhodki: IncomeTaxBrackets = [
  { percentage: 0.8, maxNumber: 12500 },
  { percentage: 0.4, maxNumber: 30000 },
  { percentage: 0 },
];
// ZPZR: 20 % do davčne osnove 33.000 €, 35 % nad tem (dokončen davek)
// https://www.gov.si/novice/2025-11-24-novosti-pri-ugotavljanju-davcne-osnove-z-upostevanjem-normiranih-odhodkov-v-letu-2026/
export const normiranPopoldanskiTaxBrackets: IncomeTaxBrackets = [
  { percentage: 0.2, maxNumber: 33000 },
  { percentage: 0.35 },
];
// ZPZR-A, 6. člen: povprečje prihodkov dveh predhodnih let do 50.000 €, če
// zavezanec ni bil zavarovan na podlagi samozaposlitve
// https://pisrs.si/api/uradni-list/objava/u20260032.pdf
// ZIURS (referendum 6. 12. 2026) ni upoštevan. Če bo potrjen, bi za leto 2026
// veljalo: normirani odhodki 80 % do 50.000 €, 70 % od 50.000 do 70.000 €,
// 0 % nad tem; enotna stopnja 20 %; meja vstopa 70.000 € (glej constants.ts).
export const normiranPopoldanskiMaxRevenue = 50000;
