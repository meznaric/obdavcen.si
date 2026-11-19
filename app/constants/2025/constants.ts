import { IncomeTaxBrackets, MesecniZneski } from "../types";
import { getLetniZnesek } from "../../utils/prispevki";

export const year = 2025;
// FURS, Lestvica za odmero dohodnine za leto 2025
// https://fu.gov.si/fileadmin/Internet/Davki_in_druge_dajatve/Podrocja/Dohodnina/Letna_odmera_dohodnine/Opis/Lestvica_za_leto_2025.docx
export const generalTaxRelief = 5260;
// PP 2024 (2.394,92 €) velja od februarja, januarja še PP 2023 (2.220,95 €)
// https://www.fu.gov.si/fileadmin/Internet/Davki_in_druge_dajatve/Podrocja/Prispevki_za_socialno_varnost/Samozaposleni/SZ_1_2025.xlsx
// https://www.fu.gov.si/fileadmin/Internet/Davki_in_druge_dajatve/Podrocja/Prispevki_za_socialno_varnost/Samozaposleni/SZ_2_2025.xlsx
export const averageIncomeLastYear = 2394.92;
export const averageIncomeJanuar = 2220.95;
// Limit za regres in nagrado pri letni odmeri: PP za leto 2025 (2.536,03 €)
// https://www.fu.gov.si/fileadmin/Internet/Davki_in_druge_dajatve/Podrocja/Dohodnina/Dohodek_iz_zaposlitve/Opis/Regres_za_letni_dopust.doc
// https://www.fu.gov.si/fileadmin/Internet/Davki_in_druge_dajatve/Podrocja/Prispevki_za_socialno_varnost/Samozaposleni/SZ_02_2026.xlsx
export const povprecnaPlacaDavcnoLeto = 2536.03;
// https://www.gov.si/teme/minimalna-placa/
export const minimalnaPlaca = 1277.72;
// Normirani s. p. (ZDoh-2AB): 80 % normiranih odhodkov do 60.000 € prihodkov
// (največ 48.000 €), dokončni davek 20 %. Vstop: prihodki preteklega leta do
// 60.000 € (zavarovan za polni čas vsaj 9 mesecev). Za leto 2025 velja
// prehodno pravilo (a) točka 23. člena ZDoh-2AB): izstop le, če povprečje
// prihodkov 2023 in 2024 preseže 150.000 €.
// https://pisrs.si/api/uradni-list/objava/u2024104.pdf
export const normiranSPAcceptedExpenses = 80; // 80%
export const normiranOdhodkiMaxPrihodki = 60000;
export const normiranTaxBrackets: IncomeTaxBrackets = [
  { percentage: 0.2 }, // flat 20%
];
export const normiranMaxRevenue = 60000;

// Tax relief thresholds
export const taxReliefThreshold = 16832;
export const taxReliefFormulaConst = 19736.99;

// Prispevki
// https://www.fu.gov.si/fileadmin/Internet/Davki_in_druge_dajatve/Podrocja/Prispevki_za_socialno_varnost/Opis/Brosura_o_placevanju_prispevkov_za_socialno_varnost.doc

// Obvezni zdravstveni prispevek (OZP): 35 € do februarja, 37,17 € od 1. 3. 2025
// https://fu.gov.si/fileadmin/Internet/Davki_in_druge_dajatve/Podrocja/Dohodnina/Dohodek_iz_dejavnosti/Opis/Davki_za_zacetnike_-_fizicne_osebe_ki_opravljajo_dejavnost.pdf
export const zavarovanecOZP: MesecniZneski = [
  { odMeseca: 1, znesek: 35 },
  { odMeseca: 3, znesek: 37.17 },
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
// Vir: 114. člen ZDoh-2
// https://fu.gov.si/fileadmin/Internet/Davki_in_druge_dajatve/Podrocja/Dohodnina/Letna_odmera_dohodnine/Opis/Lestvica_za_leto_2025.docx
export const olajsavaZaOtroka = [2838.30, 3085.52, 5146.39, 7207.26, 9268.12];
export const olajsavaZaDrugeClane = 2838.30;

// Prostovoljno dodatno pokojninsko zavarovanje (PDPZ)
// Največ 24 % obveznih prispevkov za PIZ in ne več kot 3.054,65 € na leto
// (117. člen ZDoh-2; za premijo, ki jo plača delodajalec, 44. člen ZDoh-2)
// https://fu.gov.si/fileadmin/Internet/Davki_in_druge_dajatve/Podrocja/Dohodnina/Letna_odmera_dohodnine/Opis/Lestvica_za_leto_2025.docx
export const pdpzMaxZnesek = 3054.65;

// Božičnica / Zimski regres — ZPZR, 5. in 12. člen
// V letu 2025 pol minimalne plače, popolnoma neobdavčeno (brez dohodnine in prispevkov)
// Ločeno od nagrade za poslovno uspešnost
// https://www.fu.gov.si/fileadmin/Internet/Davki_in_druge_dajatve/Podrocja/Dohodnina/Dohodek_iz_zaposlitve/Opis/Dohodek_iz_delovnega_razmerja.doc (3.1.2)
export const bozicnicaOprostPrispevkov = true;
export const bozicnicaLocenOdNagrade = true;

// DDPO 22 % (64. člen ZORZFS), davek od dividend 25 % (132. člen ZDoh-2)
// https://spot.gov.si/sl/teme/davek-od-dohodkov-pravnih-oseb
export const ddpoTaxRate = 0.22;
export const dividendsTaxRate = 0.25;

// Percentage rates
export const zavarovanecPIZrate = 0.155;
export const zavarovanecZZZSrate = 0.0636;
export const zavarovanecStarsevsko = 0.001;
export const zavarovanecBrezposelnost = 0.0014;
// Dolgotrajna oskrba (DO): od 1. 7. 2025 1 % zavarovanec + 1 % delodajalec
// (s. p. 2 %), pred tem 0. Ker se v izračunih uporablja letna stopnja, je tu
// povprečje mesecev (6 mesecev × 1 % / 12 = 0,5 %).
// https://www.fu.gov.si/fileadmin/Internet/Davki_in_druge_dajatve/Podrocja/Prispevki_za_socialno_varnost/Samozaposleni/SZ_7_2025.xlsx
// https://www.fu.gov.si/fileadmin/Internet/Davki_in_druge_dajatve/Podrocja/Prispevki_za_socialno_varnost/Opis/Brosura_o_placevanju_prispevkov_za_socialno_varnost.doc
export const doRateMesecno: MesecniZneski = [
  { odMeseca: 1, znesek: 0 },
  { odMeseca: 7, znesek: 0.01 },
];
export const zavarovanecDOrate = getLetniZnesek(doRateMesecno) / 12;

export const delodajalecPIZrate = 0.0885;
export const delodajalecZZZSrate = 0.0656;
export const delodajalecStarsevsko = 0.001;
export const delodajalecBrezposelnost = 0.0006;
export const delodajalecPoskodbe = 0.0053;
export const delodajalecDOrate = getLetniZnesek(doRateMesecno) / 12;
