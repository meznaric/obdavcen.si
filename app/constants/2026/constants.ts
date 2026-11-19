import { IncomeTaxBrackets, MesecniZneski } from "../types";

export const year = 2026;
// FURS, Lestvica za odmero dohodnine za leto 2026
// https://www.fu.gov.si/fileadmin/Internet/Davki_in_druge_dajatve/Podrocja/Dohodnina/Letna_odmera_dohodnine/Opis/Lestvica_za_leto_2026.docx
export const generalTaxRelief = 5551.93;
// PP 2025 (2.536,03 €) velja od februarja, januarja še PP 2024 (2.394,92 €)
// https://www.fu.gov.si/fileadmin/Internet/Davki_in_druge_dajatve/Podrocja/Prispevki_za_socialno_varnost/Samozaposleni/SZ_01_2026.xlsx
// https://www.fu.gov.si/fileadmin/Internet/Davki_in_druge_dajatve/Podrocja/Prispevki_za_socialno_varnost/Samozaposleni/SZ_02_2026.xlsx
export const averageIncomeLastYear = 2536.03;
export const averageIncomeJanuar = 2394.92;
// Limit za regres in nagrado pri letni odmeri je PP za leto 2026, ki bo
// objavljena v začetku 2027 — do takrat zadnja znana letna PP (2.536,03 €)
// https://www.fu.gov.si/fileadmin/Internet/Davki_in_druge_dajatve/Podrocja/Dohodnina/Dohodek_iz_zaposlitve/Opis/Regres_za_letni_dopust.doc
export const povprecnaPlacaDavcnoLeto = 2536.03;
// https://www.gov.si/teme/minimalna-placa/
export const minimalnaPlaca = 1481.88;
// Normirani s. p., zavarovan za polni delovni čas neprekinjeno vsaj 9 mesecev
// (ali najmanj 75 % minimalnega letnega sklada ur)
// Normirani odhodki: 80 % prihodkov, a le do 60.000 € prihodkov, torej
// največ 48.000 € (prvi odstavek 59. člena ZDoh-2, ZDoh-2AB)
// https://pisrs.si/api/uradni-list/objava/u2024104.pdf
export const normiranSPAcceptedExpenses = 80; // 80%
export const normiranOdhodkiMaxPrihodki = 60000;
// Dokončni davek: 20 % do 72.000 € davčne osnove, 35 % nad tem (7. člen ZPZR)
// Meja: povprečje prihodkov zadnjih dveh let do 120.000 € (6. člen ZPZR,
// kot ga je spremenil ZPZR-A; brez zavarovanja za polni čas 50.000 €,
// mešano 85.000 €)
// ZPZR (NPB1 z ZPZR-A): https://pisrs.si/api/datoteke/integracije/486867871
// ZPZR-A: https://pisrs.si/api/uradni-list/objava/u20260032.pdf
// https://www.gov.si/novice/2025-11-24-novosti-pri-ugotavljanju-davcne-osnove-z-upostevanjem-normiranih-odhodkov-v-letu-2026/
export const normiranTaxBrackets: IncomeTaxBrackets = [
  { percentage: 0.2, maxNumber: 72000 },
  { percentage: 0.35 },
];
export const normiranMaxRevenue = 120000;
// ZIURS (sprejel DZ 11. 5. 2026, zakonodajni referendum 6. 12. 2026) ni
// upoštevan. Če bo potrjen, velja za davčno leto 2026 (50. člen ZIURS):
// - zavarovani za polni čas vsaj 5 mesecev: normirani odhodki 80 % do
//   100.000 €, 70 % od 100.000 do 120.000 €, 40 % od 120.000 do 150.000 €,
//   0 % nad tem; vstop: prihodki preteklega leta do 150.000 €
// - ostali: 80 % do 50.000 €, 70 % od 50.000 do 70.000 €, 0 % nad tem;
//   vstop: prihodki preteklega leta do 70.000 €
// - izstop: povprečje dveh let nad 150.000 € / 70.000 € / 110.000 € (mešano)
// - 6. in 7. člen ZPZR se črtata, zato velja enotna stopnja 20 %
// - najvišja osnova za vse prispevke 7.500 € na mesec (nov 6.a člen ZPSV)
// Besedilo, ki ga je sprejel DZ (EPA 15-X):
// https://imss.dz-rs.si/IMiS/ImisAdmin.nsf/ImisnetAgent?OpenAgent&2&DZ-MSS-01/b5d73d8413dd5f766248e08d4128c8a966e7e9057e661727a203a1be586d97bb
// https://www.gov.si/novice/2026-10-16-ugotavljanje-davcne-osnove-z-normiranimi-odhodki-v-letu-2026-v-povezavi-z-interventnim-zakonom-ziurs/

// Tax relief thresholds
export const taxReliefThreshold = 17766.18;
export const taxReliefFormulaConst = 20832.39;

// Prispevki
// https://www.fu.gov.si/fileadmin/Internet/Davki_in_druge_dajatve/Podrocja/Prispevki_za_socialno_varnost/Opis/Brosura_o_placevanju_prispevkov_za_socialno_varnost.doc

// Obvezni zdravstveni prispevek (OZP): 37,17 € do februarja, 39,36 € od 1. 3. 2026
// https://fu.gov.si/fileadmin/Internet/Davki_in_druge_dajatve/Podrocja/Dohodnina/Dohodek_iz_dejavnosti/Opis/Davki_za_zacetnike_-_fizicne_osebe_ki_opravljajo_dejavnost.pdf
export const zavarovanecOZP: MesecniZneski = [
  { odMeseca: 1, znesek: 37.17 },
  { odMeseca: 3, znesek: 39.36 },
];
export const zavarovanecOZPEur = zavarovanecOZP[zavarovanecOZP.length - 1].znesek;

// Povračilo stroškov prehrane med delom (malica)
// Vir: Uredba o davčni obravnavi povračil stroškov in drugih dohodkov iz delovnega razmerja, 2. člen
// https://www.fu.gov.si/fileadmin/Internet/Davki_in_druge_dajatve/Podrocja/Dohodnina/Dohodek_iz_zaposlitve/Opis/Povracila_stroskov_in_drugi_dohodki_iz_delovnega_razmerja.docx
export const malicaDnevniZnesek = 7.96;

// Povračilo stroškov prevoza na delo in z dela
// Neobdavčeno do 0,21 €/km dejanske razdalje (od 1.7.2022), vsak mesec pa
// najmanj do 140 € (drugi odstavek 3. člena Uredbe)
// Vir: Uredba o davčni obravnavi povračil stroškov in drugih dohodkov iz delovnega razmerja, 3. člen
// https://www.fu.gov.si/fileadmin/Internet/Davki_in_druge_dajatve/Podrocja/Dohodnina/Dohodek_iz_zaposlitve/Opis/Povracila_stroskov_in_drugi_dohodki_iz_delovnega_razmerja.docx
// Privzeta vrednost: ~23 km v eno smer × 0,21 €/km × 21 dni
export const prevozniStroskiMesecniZnesek = 100;

// Posebna olajšava za vzdrževane družinske člane
// Vir: Obvestilo o uskladitvi olajšav za leto 2026, 114. člen ZDoh-2
// https://www.fu.gov.si/fileadmin/Internet/Davki_in_druge_dajatve/Podrocja/Dohodnina/Letna_odmera_dohodnine/Opis/Lestvica_za_leto_2026.docx
export const olajsavaZaOtroka = [2995.83, 3256.77, 5432.02, 7607.27, 9782.51];
export const olajsavaZaDrugeClane = 2995.83;

// Prostovoljno dodatno pokojninsko zavarovanje (PDPZ)
// Največ 24 % obveznih prispevkov za PIZ in ne več kot 3.224,18 € na leto
// (117. člen ZDoh-2; za premijo, ki jo plača delodajalec, 44. člen ZDoh-2)
// https://www.fu.gov.si/fileadmin/Internet/Davki_in_druge_dajatve/Podrocja/Dohodnina/Letna_odmera_dohodnine/Opis/Lestvica_za_leto_2026.docx
export const pdpzMaxZnesek = 3224.18;

// Božičnica / Zimski regres — od 2026 dalje skupen limit z nagrado za
// dohodnino (100 % PP). Do 1/2 minimalne plače se ne všteva v osnovo za
// prispevke (5. člen ZPZR), tudi v 2026.
// https://www.fu.gov.si/fileadmin/Internet/Davki_in_druge_dajatve/Podrocja/Dohodnina/Dohodek_iz_zaposlitve/Opis/Dohodek_iz_delovnega_razmerja.doc (3.1.2.2 in 3.1.2.4)
export const bozicnicaOprostPrispevkov = true;
export const bozicnicaLocenOdNagrade = false;

// DDPO 22 % za davčna leta 2024–2028 (64. člen ZORZFS)
// https://spot.gov.si/sl/teme/davek-od-dohodkov-pravnih-oseb
// Davek od dividend 25 % (132. člen ZDoh-2)
export const ddpoTaxRate = 0.22;
export const dividendsTaxRate = 0.25;

// Percentage rates
export const zavarovanecPIZrate = 0.155;
export const zavarovanecZZZSrate = 0.0636;
export const zavarovanecStarsevsko = 0.001;
export const zavarovanecBrezposelnost = 0.0014;
// Dolgotrajna oskrba: 1 % zavarovanec, 1 % delodajalec (s. p. skupaj 2 %)
// Zakon o dolgotrajni oskrbi (ZDOsk-1): https://pisrs.si/pregledPredpisa?id=ZAKO8819
export const zavarovanecDOrate = 0.01;

export const delodajalecPIZrate = 0.0885;
export const delodajalecZZZSrate = 0.0656;
export const delodajalecStarsevsko = 0.001;
export const delodajalecBrezposelnost = 0.0006;
export const delodajalecPoskodbe = 0.0053;
export const delodajalecDOrate = 0.01;
