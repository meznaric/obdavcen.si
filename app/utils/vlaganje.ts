import type { StopnjaPoImetnistvu } from "~/constants/2026/vlaganje";

// Planer vlaganja v ETF za davčnega rezidenta Slovenije.
//
// Model: cena enote raste enakomerno (mesečno obrestovanje), vplačila so na
// začetku meseca, dividende (pri distribucijskem ETF) se izplačajo enkrat letno
// in se po plačilu davka znova vložijo kot nov nakup (nov "lot" z lastnim
// obdobjem imetništva). Ob prodaji se vsak lot obdavči po stopnji glede na
// svoje obdobje imetništva (FIFO), z normiranimi stroški in pobotom izgub v
// istem letu. Stroški posrednika in tuji davki znotraj sklada niso upoštevani.

export type VlaganjeVnos = {
  // Enkratni vložek na začetku.
  enkratniVlozek: number;
  // Mesečni vložek (na začetku vsakega meseca, vključno s prvim).
  mesecniVlozek: number;
  // Pričakovan skupni letni donos (rast cene + dividende), npr. 0.07.
  letniDonos: number;
  // Letni dividendni donos za distribucijski ETF; 0 za akumulacijski.
  dividendniDonos: number;
  // Čez koliko let prodaš (oz. dvigneš z INR).
  leta: number;
};

export type VlaganjeNastavitve = {
  dobicekIzKapitalaStopnje: StopnjaPoImetnistvu[];
  normiraniStroskiDelez: number;
  dividendeStopnja: number;
  inr: {
    stopnja: number;
    oprostitevPoLetih: number;
    prvoLetoLimit: number;
    letniLimit: number;
    skupniLimit: number;
  };
};

export type Vplacilo = { mesec: number; znesek: number };

type Lot = { mesec: number; vlozek: number; enote: number };

type Simulacija = {
  lots: Lot[];
  cenaObProdaji: number;
  vlozeno: number;
  bruttoDividende: number;
  davekNaDividende: number;
};

export type DavekPoStopnji = {
  stopnja: number;
  davcnaOsnova: number;
  davek: number;
};

export type DavekObProdaji = {
  prodajnaVrednost: number;
  nabavnaVrednost: number;
  // Prodajna minus nabavna vrednost vseh lotov (pred normiranimi stroški).
  dobicek: number;
  // Del dobička, ki je oproščen (loti, starejši od praga za 0 %).
  oproscenDobicek: number;
  normiraniStroski: number;
  davcnaOsnova: number;
  davek: number;
  poStopnjah: DavekPoStopnji[];
};

export type RezultatRacuna = {
  vlozeno: number;
  // Vrednost naložbe ob prodaji (pred davkom ob prodaji).
  vrednost: number;
  davekNaDividende: number;
  davekObProdaji: DavekObProdaji;
  skupajDavki: number;
  neto: number;
};

export type RezultatInr = {
  // Vplačano na INR (v okviru limitov).
  vlozenoInr: number;
  vrednostInr: number;
  donosInr: number;
  davekInr: number;
  oproscen: boolean;
  // Del vplačil nad limiti INR, ki gre na navaden račun (lahko je prazen).
  presezek: RezultatRacuna | null;
  vlozeno: number;
  skupajDavki: number;
  neto: number;
};

export type LetoPoteka = {
  leta: number;
  vlozeno: number;
  vrednost: number;
  davek: number;
  neto: number;
  // Vsi davki (dividende in prodaja) v deležu donosa pred davki.
  stopnjaNaDonos: number;
  inrNeto: number;
  inrStopnjaNaDonos: number;
};

const MESECEV_V_LETU = 12;

/** Davčna stopnja za lot, ki ga imaš `mesecev` mesecev. */
export function stopnjaZaImetnistvo(
  mesecev: number,
  stopnje: StopnjaPoImetnistvu[]
): number {
  let stopnja = stopnje[0].stopnja;
  for (const s of stopnje) {
    if (mesecev >= s.odLet * MESECEV_V_LETU) stopnja = s.stopnja;
  }
  return stopnja;
}

/**
 * Delež donosa pred davki, ki ga pojedo vsi davki. Donos pred davki je to,
 * kar ti ostane, plus plačani davki, minus vloženo. Enaka mera za navaden
 * račun (davek od dividend in ob prodaji) in za INR, da sta primerljiva.
 */
export function delezDavkovVDonosu({
  neto,
  skupajDavki,
  vlozeno,
}: Pick<RezultatRacuna, "neto" | "skupajDavki" | "vlozeno">): number {
  const donos = neto + skupajDavki - vlozeno;
  return donos > 0 ? skupajDavki / donos : 0;
}

/** Davek od enega posla (en nakup, ena prodaja) z normiranimi stroški. */
export function davekNaPosel({
  nabavnaVrednost,
  prodajnaVrednost,
  stopnja,
  normiraniStroskiDelez,
}: {
  nabavnaVrednost: number;
  prodajnaVrednost: number;
  stopnja: number;
  normiraniStroskiDelez: number;
}) {
  const dobicek = prodajnaVrednost - nabavnaVrednost;
  const normiraniStroski =
    dobicek > 0
      ? Math.min(
          normiraniStroskiDelez * (nabavnaVrednost + prodajnaVrednost),
          dobicek
        )
      : 0;
  const davcnaOsnova = Math.max(0, dobicek - normiraniStroski);
  return { dobicek, normiraniStroski, davcnaOsnova, davek: davcnaOsnova * stopnja };
}

/**
 * Dohodnina od tuje dividende: odbitek tujega davka se prizna največ po stopnji
 * iz konvencije in največ do slovenskega davka.
 */
export function davekNaTujoDividendo({
  dividenda,
  odtegnjenTujiDavek,
  stopnjaKonvencije,
  stopnjaSlo,
}: {
  dividenda: number;
  odtegnjenTujiDavek: number;
  stopnjaKonvencije: number;
  stopnjaSlo: number;
}) {
  const davekSlo = dividenda * stopnjaSlo;
  const priznanOdbitek = Math.min(
    odtegnjenTujiDavek,
    dividenda * stopnjaKonvencije,
    davekSlo
  );
  const doplacilo = davekSlo - priznanOdbitek;
  return {
    davekSlo,
    priznanOdbitek,
    doplacilo,
    skupajPlacano: odtegnjenTujiDavek + doplacilo,
  };
}

/** Vsa vplačila načrta po mesecih (enkratni vložek in prvi mesečni sta v mesecu 0). */
export function vplacilaIzVnosa(vnos: VlaganjeVnos): Vplacilo[] {
  const meseci = Math.round(vnos.leta * MESECEV_V_LETU);
  const vplacila: Vplacilo[] = [];
  if (vnos.enkratniVlozek > 0) {
    vplacila.push({ mesec: 0, znesek: vnos.enkratniVlozek });
  }
  if (vnos.mesecniVlozek > 0) {
    for (let mesec = 0; mesec < meseci; mesec++) {
      vplacila.push({ mesec, znesek: vnos.mesecniVlozek });
    }
  }
  return vplacila;
}

/**
 * Razdeli vplačila na del, ki gre na INR (osnovni podračun: limit v prvem letu,
 * nato letni limit, skupaj največ skupni limit), in presežek za navaden račun.
 * Predpostavka: INR odpreš na začetku načrta in prvo leto načrta je koledarsko
 * leto odprtja.
 */
export function razdeliNaInr(
  vplacila: Vplacilo[],
  limiti: VlaganjeNastavitve["inr"]
): { inr: Vplacilo[]; presezek: Vplacilo[] } {
  const inr: Vplacilo[] = [];
  const presezek: Vplacilo[] = [];
  const porabljenoPoLetih = new Map<number, number>();
  let porabljenoSkupaj = 0;

  for (const v of vplacila) {
    const leto = Math.floor(v.mesec / MESECEV_V_LETU);
    const letniLimit = leto === 0 ? limiti.prvoLetoLimit : limiti.letniLimit;
    const porabljenoLetos = porabljenoPoLetih.get(leto) ?? 0;
    const prosto = Math.max(
      0,
      Math.min(letniLimit - porabljenoLetos, limiti.skupniLimit - porabljenoSkupaj)
    );
    const naInr = Math.min(v.znesek, prosto);
    if (naInr > 0) {
      inr.push({ mesec: v.mesec, znesek: naInr });
      porabljenoPoLetih.set(leto, porabljenoLetos + naInr);
      porabljenoSkupaj += naInr;
    }
    if (v.znesek - naInr > 0) {
      presezek.push({ mesec: v.mesec, znesek: v.znesek - naInr });
    }
  }
  return { inr, presezek };
}

function simuliraj(
  vplacila: Vplacilo[],
  {
    letniDonos,
    dividendniDonos,
    mesecProdaje,
    davekNaDividende,
  }: {
    letniDonos: number;
    dividendniDonos: number;
    mesecProdaje: number;
    davekNaDividende: number;
  }
): Simulacija {
  // Skupni donos = rast cene × (1 + dividendni donos), da se pri ponovnem
  // vlaganju bruto dividend izide enako kot pri akumulacijskem ETF.
  const letnaRastCene = (1 + letniDonos) / (1 + dividendniDonos);
  const cena = (mesec: number) => letnaRastCene ** (mesec / MESECEV_V_LETU);

  const lots: Lot[] = [];
  let vlozeno = 0;
  let bruttoDividende = 0;
  let placanDavek = 0;
  let enot = 0;
  let i = 0;
  const urejena = [...vplacila].sort((a, b) => a.mesec - b.mesec);

  for (let mesec = 0; mesec <= mesecProdaje; mesec++) {
    // Dividenda ob koncu vsakega leta imetništva (preden so kupljena nova vplačila).
    if (mesec > 0 && mesec % MESECEV_V_LETU === 0 && dividendniDonos > 0) {
      const dividenda = enot * cena(mesec) * dividendniDonos;
      const davek = dividenda * davekNaDividende;
      bruttoDividende += dividenda;
      placanDavek += davek;
      const reinvest = dividenda - davek;
      if (reinvest > 0) {
        const kupljeneEnote = reinvest / cena(mesec);
        lots.push({ mesec, vlozek: reinvest, enote: kupljeneEnote });
        enot += kupljeneEnote;
      }
    }
    while (i < urejena.length && urejena[i].mesec === mesec) {
      const { znesek } = urejena[i];
      if (mesec < mesecProdaje && znesek > 0) {
        const kupljeneEnote = znesek / cena(mesec);
        lots.push({ mesec, vlozek: znesek, enote: kupljeneEnote });
        enot += kupljeneEnote;
        vlozeno += znesek;
      }
      i++;
    }
  }

  return {
    lots,
    cenaObProdaji: cena(mesecProdaje),
    vlozeno,
    bruttoDividende,
    davekNaDividende: placanDavek,
  };
}

/**
 * Dohodnina od dobička iz kapitala ob prodaji vseh lotov.
 * - Vsak lot ima svoje obdobje imetništva (FIFO) in s tem svojo stopnjo.
 * - Pozitivna razlika se zmanjša za normirane stroške (1 % nakupa + 1 % prodaje,
 *   največ do višine dobička).
 * - Izgube istega leta zmanjšajo pozitivno osnovo, sorazmerno po obdobjih imetništva.
 * - Loti nad pragom oprostitve (stopnja 0) se ne obdavčijo in ne pobotajo.
 */
export function davekObProdaji(
  lots: Lot[],
  cenaObProdaji: number,
  mesecProdaje: number,
  nastavitve: Pick<
    VlaganjeNastavitve,
    "dobicekIzKapitalaStopnje" | "normiraniStroskiDelez"
  >
): DavekObProdaji {
  const osnovaPoStopnjah = new Map<number, number>();
  let prodajnaVrednost = 0;
  let nabavnaVrednost = 0;
  let oproscenDobicek = 0;
  let normiraniStroski = 0;
  let izguba = 0;

  for (const lot of lots) {
    const prodaja = lot.enote * cenaObProdaji;
    const razlika = prodaja - lot.vlozek;
    prodajnaVrednost += prodaja;
    nabavnaVrednost += lot.vlozek;

    const stopnja = stopnjaZaImetnistvo(
      mesecProdaje - lot.mesec,
      nastavitve.dobicekIzKapitalaStopnje
    );
    if (stopnja === 0) {
      oproscenDobicek += Math.max(0, razlika);
      continue;
    }
    if (razlika > 0) {
      const stroski = Math.min(
        nastavitve.normiraniStroskiDelez * (lot.vlozek + prodaja),
        razlika
      );
      normiraniStroski += stroski;
      osnovaPoStopnjah.set(
        stopnja,
        (osnovaPoStopnjah.get(stopnja) ?? 0) + razlika - stroski
      );
    } else {
      izguba += -razlika;
    }
  }

  const pozitivnaOsnova = [...osnovaPoStopnjah.values()].reduce(
    (a, b) => a + b,
    0
  );
  const davcnaOsnova = Math.max(0, pozitivnaOsnova - izguba);
  const faktor = pozitivnaOsnova > 0 ? davcnaOsnova / pozitivnaOsnova : 0;

  const poStopnjah = [...osnovaPoStopnjah.entries()]
    .sort(([a], [b]) => b - a)
    .map(([stopnja, osnova]) => ({
      stopnja,
      davcnaOsnova: osnova * faktor,
      davek: osnova * faktor * stopnja,
    }));

  return {
    prodajnaVrednost,
    nabavnaVrednost,
    dobicek: prodajnaVrednost - nabavnaVrednost,
    oproscenDobicek,
    normiraniStroski,
    davcnaOsnova,
    davek: poStopnjah.reduce((sum, s) => sum + s.davek, 0),
    poStopnjah,
  };
}

function rezultatNavadnegaRacuna(
  vplacila: Vplacilo[],
  vnos: VlaganjeVnos,
  nastavitve: VlaganjeNastavitve
): RezultatRacuna {
  const mesecProdaje = Math.round(vnos.leta * MESECEV_V_LETU);
  const sim = simuliraj(vplacila, {
    letniDonos: vnos.letniDonos,
    dividendniDonos: vnos.dividendniDonos,
    mesecProdaje,
    davekNaDividende: nastavitve.dividendeStopnja,
  });
  const prodaja = davekObProdaji(
    sim.lots,
    sim.cenaObProdaji,
    mesecProdaje,
    nastavitve
  );
  return {
    vlozeno: sim.vlozeno,
    vrednost: prodaja.prodajnaVrednost,
    davekNaDividende: sim.davekNaDividende,
    davekObProdaji: prodaja,
    skupajDavki: sim.davekNaDividende + prodaja.davek,
    neto: prodaja.prodajnaVrednost - prodaja.davek,
  };
}

/** Navaden borzni račun (npr. pri tujem posredniku): Doh-KDVP ob prodaji, Doh-Div za dividende. */
export function izracunNavadnegaRacuna(
  vnos: VlaganjeVnos,
  nastavitve: VlaganjeNastavitve
): RezultatRacuna {
  return rezultatNavadnegaRacuna(vplacilaIzVnosa(vnos), vnos, nastavitve);
}

/**
 * Isti načrt prek INR: vplačila do limitov gredo na INR, presežek na navaden
 * račun. Na INR se dividende in prodaje ne obdavčijo sproti; ob izplačilu se
 * donos (vrednost − vplačila) obdavči po 15 %, prvo izplačilo po 15 letih od
 * odprtja pa je oproščeno.
 */
export function izracunInr(
  vnos: VlaganjeVnos,
  nastavitve: VlaganjeNastavitve
): RezultatInr {
  const mesecProdaje = Math.round(vnos.leta * MESECEV_V_LETU);
  const { inr, presezek } = razdeliNaInr(vplacilaIzVnosa(vnos), nastavitve.inr);

  const sim = simuliraj(inr, {
    letniDonos: vnos.letniDonos,
    dividendniDonos: vnos.dividendniDonos,
    mesecProdaje,
    davekNaDividende: 0,
  });
  const vrednostInr = sim.lots.reduce(
    (sum, lot) => sum + lot.enote * sim.cenaObProdaji,
    0
  );
  const donosInr = Math.max(0, vrednostInr - sim.vlozeno);
  const oproscen =
    mesecProdaje >= nastavitve.inr.oprostitevPoLetih * MESECEV_V_LETU;
  const davekInr = oproscen ? 0 : donosInr * nastavitve.inr.stopnja;

  const presezekRezultat =
    presezek.length > 0
      ? rezultatNavadnegaRacuna(presezek, vnos, nastavitve)
      : null;

  return {
    vlozenoInr: sim.vlozeno,
    vrednostInr,
    donosInr,
    davekInr,
    oproscen,
    presezek: presezekRezultat,
    vlozeno: sim.vlozeno + (presezekRezultat?.vlozeno ?? 0),
    skupajDavki: davekInr + (presezekRezultat?.skupajDavki ?? 0),
    neto: vrednostInr - davekInr + (presezekRezultat?.neto ?? 0),
  };
}

/** Rezultat prodaje po 1, 2, … `doLet` letih za graf. */
export function potekPoLetih(
  vnos: VlaganjeVnos,
  nastavitve: VlaganjeNastavitve,
  doLet: number
): LetoPoteka[] {
  return Array.from({ length: doLet }, (_, i) => {
    const leta = i + 1;
    const naLeto = { ...vnos, leta };
    const navaden = izracunNavadnegaRacuna(naLeto, nastavitve);
    const inr = izracunInr(naLeto, nastavitve);
    return {
      leta,
      vlozeno: navaden.vlozeno,
      vrednost: navaden.vrednost,
      davek: navaden.skupajDavki,
      neto: navaden.neto,
      stopnjaNaDonos: delezDavkovVDonosu(navaden),
      inrNeto: inr.neto,
      inrStopnjaNaDonos: delezDavkovVDonosu(inr),
    };
  });
}
