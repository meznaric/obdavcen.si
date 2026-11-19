// Obdavčitev vlaganj fizičnih oseb (rezidentov RS) — delnice, ETF, skladi, obresti, INR.
//
// Stopnje za dobiček iz kapitala, dividende in obresti so bile v letu 2025 enake
// kot v letu 2026 (25 % / 20 % / 15 % / 0 % po 15 letih), zato ločene datoteke za
// 2025 ni. Razlikujeta se le izvedeni finančni instrumenti (CFD, opcije) in INR,
// ki je na voljo šele od 5. 3. 2026 — oboje je zapisano spodaj.
//
// Glavni vir za vse spodnje vrednosti (če ni navedeno drugače):
// FURS, Dohodek iz kapitala – podrobnejši opis, 15. izdaja, avgust 2026
// https://www.fu.gov.si/fileadmin/Internet/Davki_in_druge_dajatve/Podrocja/Dohodnina/Dohodek_iz_kapitala/Opis/Obresti_dividende_in_dobicek_iz_kapitala.doc

export const vlaganjeLeto = 2026;
// Datum, ko so bili podatki na strani nazadnje preverjeni.
export const vlaganjePreverjeno = "18. 11. 2026";

export type StopnjaPoImetnistvu = {
  // Število dopolnjenih let imetništva, od katerega velja stopnja.
  odLet: number;
  stopnja: number;
};

// Dobiček iz kapitala (delnice, ETF, investicijski kuponi): 25 %, po vsakih
// dopolnjenih 5 letih imetništva nižje; po 15 letih oproščeno (96. člen ZDoh-2).
// 132. člen ZDoh-2 (ZDoh-2 na PISRS): https://pisrs.si/pregledPredpisa?id=ZAKO4697
// FURS: https://www.fu.gov.si/zivljenjski_dogodki_prebivalci/odsvojil_sem_vrednostne_papirje_druge_deleze_ali_investicijske_kupone/
export const dobicekIzKapitalaStopnje: StopnjaPoImetnistvu[] = [
  { odLet: 0, stopnja: 0.25 },
  { odLet: 5, stopnja: 0.2 },
  { odLet: 10, stopnja: 0.15 },
  { odLet: 15, stopnja: 0 },
];

// Normirani stroški (od 1. 1. 2020): davčna osnova se zmanjša za 1 % nabavne
// vrednosti + 1 % vrednosti ob odsvojitvi, a največ do višine dobička
// (97. člen ZDoh-2; FURS podrobnejši opis, točka 4.2).
export const normiraniStroskiDelez = 0.01;

// Izguba se ne prizna, če v 30 dneh pred ali po prodaji z izgubo kupiš
// vsebinsko istovrsten kapital (97. člen ZDoh-2, "navidezna odsvojitev").
// FURS pravilo uporablja količinsko: izguba se ne prizna le za toliko enot,
// kolikor si jih v tem obdobju kupil.
// https://www.fu.gov.si/fileadmin/Internet/Davki_in_druge_dajatve/Podrocja/Dohodnina/Dohodek_iz_kapitala/Opis/Dobicek_iz_kapitala_-_pravilo_navidezne_odsvojitve_kapitala.docx
export const navideznaOdsvojitevDni = 30;

// Dividende in obresti: 25 %, dokončni davek (132. člen ZDoh-2).
export const dividendeStopnja = 0.25;
export const obrestiStopnja = 0.25;

// Obresti na denarne depozite pri bankah v SLO in EU: seštevek se zmanjša za
// 1.000 € (133. člen ZDoh-2). Za 2024–2026 se v ta limit štejejo tudi obresti
// od obveznic RS za prebivalstvo (ZORZFS). Ne velja za obresti pri borznih
// posrednikih, ki niso banke (IBKR, eToro), ali za sklade denarnega trga
// (Revolut Savings Flexible). ZDoh-2: https://pisrs.si/pregledPredpisa?id=ZAKO4697
export const obrestiDepozitiOprostitev = 1000;

// Konvencija SLO–ZDA: davek na dividende v ZDA največ 15 % (z obrazcem W-8BEN),
// v Sloveniji se prizna odbitek tujega davka največ po stopnji iz konvencije.
// https://www.irs.gov/businesses/international-businesses/slovenia-treasury-explanation
// https://www.fu.gov.si/fileadmin/Internet/Davki_in_druge_dajatve/Podrocja/Mednarodno_obdavcenje/Opis/Brosura_Mednarodna_obdavcitev_posameznikov.docx
export const zdaDividendeKonvencija = 0.15;

// Rok za Doh-KDVP, Doh-Div, Doh-Obr in napoved za IFI: 28. februar za preteklo
// leto (če je to sobota ali nedelja, naslednji delovni dan; za 2025 je bil rok 2. 3. 2026).
// https://www.gov.si/assets/organi-v-sestavi/FURS/Novice-2026/Javni-poziv-rok-je-2.3.2026.pdf
// Oblika za rabo v stavku "do 28. februarja".
export const rokNapovedi = "28. februarja";

// Plačilni račun v tujini je treba prijaviti FURS v 8 dneh od odprtja (DR-Račun),
// 49. in 55. člen ZFU (https://pisrs.si/pregledPredpisa?id=ZAKO6792).
// https://www.fu.gov.si/zivljenjski_dogodki_prebivalci/prijava_racuna_v_tujini
export const prijavaTujegaRacunaDni = 8;

// Elektronska oddaja je obvezna pri več kot 10 poslih v Doh-KDVP oziroma več
// kot 5 izplačilih v Doh-Div (FURS, navodili za Doh-KDVP in Doh-Div).
export const eOddajaObveznaNad = { kdvpPoslov: 10, divIzplacil: 5 };
// Odločbo FURS izda do 30. aprila, davek plačaš v 30 dneh od vročitve.
export const rokOdlocbe = "30. aprila";
export const rokPlacilaDni = 30;

// Samoprijava (63. člen ZDavP-2): obresti 3 % letno od izteka roka do oddaje.
// Globe za posameznika: 394. člen ZDavP-2 (napoved ni oddana ali je prepozna),
// 395. člen ZDavP-2 (nepravilni podatki), 96. člen ZFU (neprijavljen plačilni
// račun v tujini). ZDavP-2: https://pisrs.si/pregledPredpisa?id=ZAKO4703
export const samoprijavaObresti = 0.03;
export const globe = {
  napoved: { od: 250, do: 400 },
  napacniPodatki: { od: 400, do: 5000 },
  prijavaRacuna: { od: 200, do: 1200 },
};

// Izvedeni finančni instrumenti (CFD, opcije, terminske pogodbe), ZDDOIFI.
// Od 1. 1. 2026 enotna stopnja 25 % ne glede na imetništvo (ZDDOIFI-B, Ur. l. RS 85/2025).
// https://www.fu.gov.si/zivljenjski_dogodki_prebivalci/odsvojil_sem_izvedene_financne_instrumente/
export const izvedeniInstrumentiStopnja2026 = 0.25;
// Do vključno leta 2025: 40 % v prvih 12 mesecih, nato 27,5 % / 20 % / 15 % / 10 %
// po 1 / 5 / 10 / 15 letih in 0 % po 20 letih (vir kot zgoraj). Na strani
// navajamo le stopnjo v prvem letu.
export const izvedeniInstrumentiPrvoLeto2025 = 0.4;

// Individualni naložbeni račun (INR), Zakon o individualnih naložbenih računih
// (ZINR, Ur. l. RS 40/25), uporablja se od 5. 3. 2026.
// https://pisrs.si/pregledPredpisa?id=ZAKO9154
// https://www.gov.si/assets/ministrstva/MF/Financni-sistem/DOKUMENTI/Dodatna-pojasnila-o-Zakonu-o-individualnih-nalozbenih-racunih.pdf
export const inr = {
  veljaOd: "5. 3. 2026",
  // Donos (vrednost − vplačila) se obdavči ob izplačilu z INR.
  stopnja: 0.15,
  // Prvo izplačilo po vsaj 15 letih od odprtja (brez vmesnih izplačil) je oproščeno.
  oprostitevPoLetih: 15,
  // Osnovni podračun: 20.000 € v koledarskem letu odprtja, nato 5.000 € letno.
  prvoLetoLimit: 20000,
  letniLimit: 5000,
  // Posebni podračun: dodatnih 5.000 € letno (od 2. leta) samo za slovenske izdajatelje.
  posebniPodracunLetniLimit: 5000,
  // Vsa vplačila skupaj v celotnem obdobju imetništva.
  skupniLimit: 150000,
};
