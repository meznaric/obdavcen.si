import { IncomeTaxBrackets } from "../types";

export const year = 2026;
// https://www.zvezarfr.si/pripomocki/uporabni-podatki/a-lestvica-za-odmero-dohodnine
export const generalTaxRelief = 5551.93;
export const averageIncomeLastYear = 2394.92;
export const minimalnaPlaca = 1481.88;
// Normirani
export const normiranSPAcceptedExpenses = 80; // 80%
// Progressive: 20% up to 72k, 35% above (full-time, 9+ months insurance)
// https://mladipodjetnik.si/novice-in-dogodki/novice/furs-pojasnjuje-novi-pogoji-za-normirance-in-progresivna-obdavcitev
export const normiranTaxBrackets: IncomeTaxBrackets = [
  { percentage: 0.2, maxNumber: 72000 },
  { percentage: 0.35 },
];
export const normiranMaxRevenue = 120000;

// Tax relief thresholds
export const taxReliefThreshold = 17766.18;
export const taxReliefFormulaConst = 20832.39;

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
// Vir: Obvestilo o uskladitvi olajšav za leto 2026, 114. člen ZDoh-2
// https://www.zvezarfr.si/pripomocki/uporabni-podatki/a-lestvica-za-odmero-dohodnine
export const olajsavaZaOtroka = [2995.83, 3256.77, 5432.02, 7607.27, 9782.51];
export const olajsavaZaDrugeClane = 2995.83;

// Prostovoljno dodatno pokojninsko zavarovanje (PDPZ)
// Vir: 117. člen ZDoh-2; 5,844 % bruto plače
// https://www.pokojninskad-a.si/428-visina-minimalne-in-maksimalne-premije-upravicene-do-davcne-olajsave-v-letu-2026
export const pdpzMaxZnesek = 3224.18;

// Božičnica / Zimski regres — od 2026 dalje skupen limit z nagrado
// Prispevki se obračunajo, dohodnina oproščena do skupnega limita (povprečna plača)
export const bozicnicaOprostPrispevkov = false;
export const bozicnicaLocenOdNagrade = false;

// DOO tax rates
// DDPO still 22% through 2028 per ZORZFS
export const ddpoTaxRate = 0.22;
export const dividendsTaxRate = 0.25;

// Percentage rates
export const zavarovanecPIZrate = 0.155;
export const zavarovanecZZZSrate = 0.0636;
export const zavarovanecStarsevsko = 0.001;
export const zavarovanecBrezposelnost = 0.0014;
// Dolgotrajne oskrbe - 1% employee, 1% employer (2% total for SP)
// https://www.finras.si/prispevek-za-dolgotrajno-oskrbo/
export const zavarovanecDOrate = 0.01;

export const delodajalecPIZrate = 0.0885;
export const delodajalecZZZSrate = 0.0656;
export const delodajalecStarsevsko = 0.001;
export const delodajalecBrezposelnost = 0.0006;
export const delodajalecPoskodbe = 0.0053;
export const delodajalecDOrate = 0.01;
