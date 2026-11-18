import { IncomeTaxBrackets } from "../types";

export const year = 2025;
//https://fu.gov.si/fileadmin/Internet/Davki_in_druge_dajatve/Podrocja/Dohodnina/Letna_odmera_dohodnine/Opis/Lestvica_za_leto_2025.docx
export const generalTaxRelief = 5260;
export const averageIncomeLastYear = 2220.95;
export const minimalnaPlaca = 1297.79;
// Normirani
export const normiranSPAcceptedExpenses = 80; // 80%
export const normiranTaxBrackets: IncomeTaxBrackets = [
  { percentage: 0.2 }, // flat 20%
];
export const normiranMaxRevenue = 60000;

// Tax relief thresholds
export const taxReliefThreshold = 16832;
export const taxReliefFormulaConst = 19736.99;

// Prispevki
// https://www.fu.gov.si/fileadmin/Internet/Davki_in_druge_dajatve/Podrocja/Prispevki_za_socialno_varnost/Opis/Brosura_o_placevanju_prispevkov_za_socialno_varnost.doc

// Every month fixed rate
export const zavarovanecOZPEur = 35;

// Povračilo stroškov prehrane med delom (malica)
// Vir: Uredba o višini povračil stroškov v zvezi z delom
// https://podjetnik.aktualno.si/malica-2025-povracilo-stroska-prehrane-med-delom/
export const malicaDnevniZnesek = 7.96;

// Povračilo stroškov prevoza na delo in z dela
// Neobdavčeno do 0,21 €/km dejanske razdalje (od 1.7.2022)
// Vir: Uredba o višini povračil stroškov v zvezi z delom, 3. člen
// Privzeta vrednost: ~23 km v eno smer × 0,21 €/km × 21 dni
export const prevozniStroskiMesecniZnesek = 100;

// Posebna olajšava za vzdrževane družinske člane
// Vir: 114. člen ZDoh-2
// https://www.zvezarfr.si/pripomocki/uporabni-podatki/b-lestvica-za-odmero-dohodnine-lansko-leto
export const olajsavaZaOtroka = [2838.30, 3085.52, 5146.39, 7207.26, 9268.12];
export const olajsavaZaDrugeClane = 2838.30;

// Prostovoljno dodatno pokojninsko zavarovanje (PDPZ)
// Vir: 117. člen ZDoh-2; 5,844 % bruto plače
// https://www.prva.si/maksimalna-premija-in-minimalna-priporocena-premija-dodatnega-pokojninskega-zavarovanja-za-leto-2025/
export const pdpzMaxZnesek = 3224.18;

// Božičnica / Zimski regres — ZPZR, 12. člen
// V letu 2025 pol minimalne plače, popolnoma neobdavčeno (brez dohodnine in prispevkov)
// Ločeno od nagrade za poslovno uspešnost
export const bozicnicaOprostPrispevkov = true;
export const bozicnicaLocenOdNagrade = true;

// DOO tax rates
export const ddpoTaxRate = 0.22;
export const dividendsTaxRate = 0.25;

// Percentage rates
export const zavarovanecPIZrate = 0.155;
export const zavarovanecZZZSrate = 0.0636;
export const zavarovanecStarsevsko = 0.001;
export const zavarovanecBrezposelnost = 0.0014;
// Dolgotrajne oskrbe - introduced July 2025, not included for 2025 calculations
export const zavarovanecDOrate = 0;

export const delodajalecPIZrate = 0.0885;
export const delodajalecZZZSrate = 0.0656;
export const delodajalecStarsevsko = 0.001;
export const delodajalecBrezposelnost = 0.0006;
export const delodajalecPoskodbe = 0.0053;
export const delodajalecDOrate = 0;
