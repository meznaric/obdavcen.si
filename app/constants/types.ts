export type SharedInputs = {
  // Prihodki
  revenue: number;
  // Stroski
  expenses: number;
  // DOO Placa
  salaryGross1: number;
  // Lanski prispevki override
  lanskiPrispevki?: number;
};

// Dohodninska lestvica
export type IncomeTaxBrackets = {
  percentage: number;
  maxNumber?: number;
}[];

// Prispevki
export type PrispevkiSettings = {
  zavarovanecPIZrate: number;
  zavarovanecZZZSrate: number;
  zavarovanecStarsevsko: number;
  zavarovanecBrezposelnost: number;
  // Dolgotrajne oskrbe (from July 2025)
  zavarovanecDOrate: number;
  delodajalecPIZrate: number;
  delodajalecZZZSrate: number;
  delodajalecStarsevsko: number;
  delodajalecBrezposelnost: number;
  delodajalecPoskodbe: number;
  delodajalecDOrate: number;
  zavarovanecOZPEur: number;
};

export type ConstantSettings = {
  // Minimalna placa na podlagi:
  // https://www.dnevnik.si/novice/slovenija/prejemniki-minimalne-place-na-pragu-tveganja-revscine-2705670/
  minimalnaPlaca: number;
  // Splošna davcna olajsava
  generalTaxRelief: number;
  // Povprecna slovenska placa v lanskem letu
  // https://www.fu.gov.si/novica_ajax/novica/najnizja_osnova_za_obracun_prispevkov_za_socialno_varnost_za_osebe_v_delovnem_razmerju_13049_1
  averageIncomeLastYear: number;

  // Normirani SP
  normiranSPAcceptedExpenses: number;
  normiranTaxBrackets: IncomeTaxBrackets;
  normiranMaxRevenue: number;
  ddpoTaxRate: number;
  dividendsTaxRate: number;
  // Tax relief thresholds (for variable splošna olajšava)
  taxReliefThreshold: number;
  taxReliefFormulaConst: number;

  // Zavarovanec člen po ZPIZ-2 za S.P. izračune
  // Vir: https://zakonodaja.com/pravilnik/zpiz-2-pdzo/2-clen-zavarovalna-osnova
  spZavarovanecClen?: 15 | 16 | 17;
  // Znižani prispevki za novo registrirane S.P. (ZPIZ-2, člen 145, odstavek 14)
  // 'prvo' = prvo leto (50% znižanje PIZ), 'drugo' = drugo leto (30% znižanje PIZ)
  spZnizaniPrispevki?: 'brez' | 'prvo' | 'drugo';
  // Ali je družbenik hkrati poslovodja (vpliva na min. osnovo prispevkov)
  dooDruzbenikPoslovodja?: boolean;

  // Povračilo stroškov prehrane med delom (malica)
  // Vir: Uredba o višini povračil stroškov v zvezi z delom
  // https://www.racunovodja.com/clanki.asp?clanek=1417
  malicaDnevniZnesek: number;
  // Ali D.O.O. izplačuje malico (privzeto: da)
  malica?: boolean;

  // Povračilo stroškov prevoza na delo in z dela
  // Neobdavčeno do 0,21 €/km dejanske razdalje
  // Vir: Uredba o višini povračil stroškov v zvezi z delom, 3. člen
  prevozniStroskiMesecniZnesek: number;
  // Ali D.O.O. izplačuje prevozne stroške (privzeto: ne — za remote delavce)
  prevozniStroski?: boolean;

  // Regres za letni dopust — neobdavčen do 100% povprečne mesečne plače
  // Vir: 44. člen ZDoh-2; ZUTD
  // Ali D.O.O. izplačuje regres (privzeto: da — obvezen za zaposlene)
  regres?: boolean;

  // Posebna olajšava za vzdrževane družinske člane
  // Vir: 114. člen ZDoh-2
  // Zneski na otroka (1., 2., 3., 4., 5. otrok)
  olajsavaZaOtroka: number[];
  // Znesek za drugega vzdrževanega družinskega člana (zakonec, partner)
  olajsavaZaDrugeClane: number;
  // Število vzdrževanih otrok (privzeto: 0)
  steviloOtrok?: number;
  // Ali ima vzdrževanega zakonca/partnerja (privzeto: ne)
  vzdrzevaniDrugiClani?: boolean;

  // Božičnica / Zimski regres
  // 2025: ZPZR — pol minimalne plače, brez dohodnine in prispevkov
  // 2026: Do povprečne plače (skupaj z nagrado), brez dohodnine, s prispevki
  bozicnica?: boolean;
  bozicnicaOprostPrispevkov: boolean; // true = 2025 (ZPZR izjema), false = 2026+
  bozicnicaLocenOdNagrade: boolean;  // true = 2025 (ločen limit), false = 2026+ (skupen limit)

  // Nagrada za poslovno uspešnost
  // Vir: 44. člen ZDoh-2, 1/12 — neobdavčena do 100% povprečne plače
  // Prispevki se vedno obračunajo
  nagradaPoslovnaUspesnost?: boolean;
  nagradaZnesek?: number;

  // Prostovoljno dodatno pokojninsko zavarovanje (PDPZ)
  // Vir: 117. člen ZDoh-2
  // Najvišji letni znesek za davčno olajšavo (5,844% bruto plače)
  pdpzMaxZnesek: number;
  // Ali plačuje PDPZ (privzeto: ne)
  pdpz?: boolean;
  // Letni znesek PDPZ vplačil
  pdpzZnesek?: number;
};

export type YearSettings = {
  year: number;
  // Dohodninska lestvica
  incomeTaxBrackets: IncomeTaxBrackets;
} & ConstantSettings &
  PrispevkiSettings;
