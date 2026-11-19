export type SharedInputs = {
  // Prihodki
  revenue: number;
  // Stroski
  expenses: number;
  // DOO Placa
  salaryGross1: number;
  // Lanski prispevki override
  lanskiPrispevki?: number;
  // Letna bruto plača (Bruto I) iz redne zaposlitve za polni delovni čas.
  // Potrebna za popoldanski s. p.; 0 / ni nastavljeno = oseba ni zaposlena.
  zaposlitevBruto?: number;
};

// Dohodninska lestvica
export type IncomeTaxBrackets = {
  percentage: number;
  maxNumber?: number;
}[];

// Mesečni znesek, ki velja od meseca `odMeseca` (1 = januar) do naslednje spremembe
export type MesecniZneski = { odMeseca: number; znesek: number }[];

// Popoldanski s. p. — dejavnost kot postranski poklic ob zaposlitvi za polni delovni čas
// Podjemna / avtorska pogodba s tujim izplačevalcem
export type PogodbeSettings = {
  pogodbaNormiraniStroski: number;
  pogodbaPIZPrejemnik: number;
  pogodbaPIZIzplacevalec: number;
  pogodbaZZ: number;
  pogodbaDO: MesecniZneski;
  // Mesečni prispevek za zdravstveno zavarovanje osebe, ki ni zavarovana iz
  // drugega naslova in si prispevek plačuje sama (20. točka 15. člena ZZVZZ,
  // podlaga 048): 5,96 % od 25 % zadnje znane povprečne letne plače
  samoplacniskiZZ: MesecniZneski;
  // Mesečni prispevek za dolgotrajno oskrbo iste osebe: 1 % od iste osnove
  samoplacniskiDO: MesecniZneski;
};

export type PopoldanskiSettings = {
  // Pavšalni prispevek za PIZ za primer invalidnosti ali smrti zaradi
  // poškodbe pri delu ali poklicne bolezni (20. člen ZPIZ-2)
  popoldanskiPIZ: MesecniZneski;
  // Prispevek za ZZ za poškodbe pri delu in poklicne bolezni (0,53 % PP)
  popoldanskiZZPoskodbe: MesecniZneski;
  // Prispevek za ZZ (6,36 % od 25 % PP)
  popoldanskiZZ: MesecniZneski;
  // Prispevek za dolgotrajno oskrbo (1 % od 25 % PP), od 1. 7. 2025
  popoldanskiDO: MesecniZneski;

  // Normirani popoldanski s. p. (zavezanec ni zavarovan na podlagi samozaposlitve)
  // Pasovi normiranih odhodkov: percentage = delež prihodkov v pasu do maxNumber
  normiranPopoldanskiOdhodki: IncomeTaxBrackets;
  normiranPopoldanskiTaxBrackets: IncomeTaxBrackets;
  normiranPopoldanskiMaxRevenue: number;
};

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
  // Obvezni zdravstveni prispevek (OZP) — mesečni pavšal, usklajuje se 1. marca
  zavarovanecOZP: MesecniZneski;
  // Zadnji veljavni mesečni OZP (za prikaz, npr. v člankih)
  zavarovanecOZPEur: number;
};

export type ConstantSettings = {
  // Minimalna plača (Zakon o minimalni plači)
  // https://www.gov.si/teme/minimalna-placa/
  minimalnaPlaca: number;
  // Splošna davcna olajsava
  generalTaxRelief: number;
  // Zadnja znana povprečna letna plača (PP), preračunana na mesec — osnova za
  // najnižjo in najvišjo zavarovalno osnovo. Nova PP se uporablja od
  // obračuna za februar, zato januarja velja še prejšnja (averageIncomeJanuar).
  // https://www.fu.gov.si/novica_ajax/novica/najnizja_osnova_za_obracun_prispevkov_za_socialno_varnost_za_osebe_v_delovnem_razmerju_13049_1
  averageIncomeLastYear: number;
  averageIncomeJanuar: number;
  // Povprečna mesečna plača zaposlenih v RS za davčno leto — limit za
  // neobdavčen regres ter plačilo za poslovno uspešnost (44. člen ZDoh-2)
  povprecnaPlacaDavcnoLeto: number;

  // Normirani SP
  normiranSPAcceptedExpenses: number;
  // Prihodki, do katerih se priznajo normirani odhodki (59. člen ZDoh-2);
  // nad tem zneskom se normirani odhodki ne povečujejo
  normiranOdhodkiMaxPrihodki: number;
  normiranTaxBrackets: IncomeTaxBrackets;
  // Meja prihodkov za vstop v sistem normirancev in izstop iz njega
  normiranMaxRevenue: number;
  ddpoTaxRate: number;
  dividendsTaxRate: number;
  // Tax relief thresholds (for variable splošna olajšava)
  taxReliefThreshold: number;
  taxReliefFormulaConst: number;

  // Podlaga zavarovanja po ZPIZ-2 za s. p. izračune. S. p. je vedno
  // zavarovan po 15. členu (samozaposleni).
  // https://pisrs.si/pregledPredpisa?id=PRAV11769
  spZavarovanecClen?: 15 | 16 | 17;
  // Znižani prispevki za novo registrirane s. p. (ZPIZ-2, člen 145, odstavek 14)
  // 'prvo' = prvo leto (50% znižanje PIZ), 'drugo' = drugo leto (30% znižanje PIZ)
  spZnizaniPrispevki?: 'brez' | 'prvo' | 'drugo';
  // true = lastnik je poslovodja brez pogodbe o zaposlitvi (16. člen ZPIZ-2,
  // podlaga 040): najnižja osnova 90 % PP, najvišja 3,5-kratnik PP, brez
  // regresa, zimskega regresa in nagrade za poslovno uspešnost.
  // false ali ni nastavljeno (privzeto) = lastnik je v svoji družbi zaposlen
  // (14. člen, podlaga 001): najnižja osnova 60 % PP.
  dooDruzbenikPoslovodja?: boolean;

  // Povračilo stroškov prehrane med delom (malica)
  // Vir: Uredba o davčni obravnavi povračil stroškov in drugih dohodkov iz
  // delovnega razmerja; FURS, Povračila stroškov in drugi dohodki iz
  // delovnega razmerja
  // https://www.fu.gov.si/fileadmin/Internet/Davki_in_druge_dajatve/Podrocja/Dohodnina/Dohodek_iz_zaposlitve/Opis/Povracila_stroskov_in_drugi_dohodki_iz_delovnega_razmerja.docx
  malicaDnevniZnesek: number;
  // Ali d. o. o. izplačuje malico (privzeto: da)
  malica?: boolean;

  // Povračilo stroškov prevoza na delo in z dela
  // Neobdavčeno do 0,21 € za kilometer razdalje na dan prisotnosti na delu,
  // vsak mesec pa najmanj do 140 € (3. člen Uredbe)
  prevozniStroskiMesecniZnesek: number;
  // Ali d. o. o. izplačuje prevozne stroške (privzeto: ne — za remote delavce)
  prevozniStroski?: boolean;

  // Regres za letni dopust — neobdavčen do 100 % povprečne mesečne plače
  // (44. člen ZDoh-2), pravica delavca po 131. členu ZDR-1
  // Ali d. o. o. izplačuje regres (privzeto: da — obvezen za zaposlene)
  regres?: boolean;
  // Znesek regresa; privzeto 100 % povprečne plače (neobdavčeni del). Za
  // zaposlitev v slovenskem podjetju zakonski najmanj, minimalna plača.
  regresZnesek?: number;

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

  // Božičnica / zimski regres (ZPZR): pol minimalne plače, pravica delavca
  // 2025: brez dohodnine in prispevkov, ločeno od nagrade (12. člen ZPZR)
  // 2026: brez prispevkov (5. člen), brez dohodnine skupaj z nagrado do
  // 100 % povprečne plače (4. člen)
  bozicnica?: boolean;
  bozicnicaOprostPrispevkov: boolean;
  bozicnicaLocenOdNagrade: boolean; // true = ločen limit (2025), false = skupen limit z nagrado (2026)

  // Nagrada za poslovno uspešnost (plačilo za poslovno uspešnost)
  // Vir: 12. točka prvega odstavka 44. člena ZDoh-2 — neobdavčena do 100 %
  // povprečne plače, izplačana vsem upravičenim delavcem. Prispevki se
  // vedno obračunajo.
  nagradaPoslovnaUspesnost?: boolean;
  nagradaZnesek?: number;

  // Prostovoljno dodatno pokojninsko zavarovanje (PDPZ)
  // Vir: 117. člen ZDoh-2 (premija, ki jo plača zavarovanec) in 44. člen
  // ZDoh-2 (premija, ki jo plača delodajalec): največ 24 % obveznih
  // prispevkov za PIZ in ne več kot ta letni znesek
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
  PrispevkiSettings &
  PopoldanskiSettings &
  PogodbeSettings;
