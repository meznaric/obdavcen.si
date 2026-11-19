import type { ReactNode } from "react";
import { Link } from "react-router";
import {
  dividendeStopnja,
  dobicekIzKapitalaStopnje,
  inr,
  eOddajaObveznaNad,
  globe,
  izvedeniInstrumentiPrvoLeto2025,
  izvedeniInstrumentiStopnja2026,
  navideznaOdsvojitevDni,
  normiraniStroskiDelez,
  obrestiDepozitiOprostitev,
  obrestiStopnja,
  prijavaTujegaRacunaDni,
  rokNapovedi,
  rokOdlocbe,
  rokPlacilaDni,
  samoprijavaObresti,
  vlaganjeLeto,
  vlaganjePreverjeno,
  zdaDividendeKonvencija,
} from "~/constants/2026/vlaganje";
import {
  davekNaPosel,
  davekNaTujoDividendo,
  izracunNavadnegaRacuna,
  stopnjaZaImetnistvo,
} from "~/utils/vlaganje";
import { evri, let_, odstotek, poLetih } from "../format";
import { nastavitve2026 } from "../nastavitve";
import { Primer } from "./gradniki";
import { viri, type Vir } from "./viri";

export type FaqSkupina = "zacetek" | "prodaja" | "dividende-obresti";

// Skupine v vrstnem redu prikaza. Vprašanja v skupini so v vrstnem redu seznama `faq`.
export const faqSkupine: { id: FaqSkupina; naslov: string }[] = [
  { id: "zacetek", naslov: "Začetek: INR ali navadni račun" },
  { id: "prodaja", naslov: "Prodaja in napoved" },
  { id: "dividende-obresti", naslov: "Dividende, obresti in drugo" },
];

export type FaqVnos = {
  id: string;
  skupina: FaqSkupina;
  vprasanje: string;
  // Odgovor v enem ali dveh stavkih. Prikazan na strani in uporabljen v FAQPage JSON-LD.
  odgovor: string;
  pravilo: ReactNode;
  primer: ReactNode;
  viri: Vir[];
};

const st = dobicekIzKapitalaStopnje;
const prag = (i: number) => st[i].odLet;
const stopnjaPoLetih = (leta: number) =>
  stopnjaZaImetnistvo(leta * 12, dobicekIzKapitalaStopnje);
const posel = (nabavna: number, prodajna: number, stopnja: number) =>
  davekNaPosel({
    nabavnaVrednost: nabavna,
    prodajnaVrednost: prodajna,
    stopnja,
    normiraniStroskiDelez,
  });
const ns = odstotek(normiraniStroskiDelez);
const oprostitevLet = prag(st.length - 1);

// Primer 1: osnovni izračun.
const p1 = { nakup: 10000, prodaja: 15000, leta: 6 };
const p1r = posel(p1.nakup, p1.prodaja, stopnjaPoLetih(p1.leta));

// Primer 2: dan pred / po 5. obletnici.
const p2 = { nakup: 10000, prodaja: 14000 };
const p2prej = posel(p2.nakup, p2.prodaja, st[0].stopnja);
const p2po = posel(p2.nakup, p2.prodaja, st[1].stopnja);

// Primer 3: pobot izgube v istem letu.
const p3 = { nakup: 6000, prodaja: 9000, izguba: 1000 };
const p3a = posel(p3.nakup, p3.prodaja, st[0].stopnja);
const p3izguba = p3.izguba;
const p3osnova = p3a.davcnaOsnova - p3izguba;

// Primer 4: pravilo 30 dni (FURS ga uporablja količinsko).
const p4 = { enot: 100, prodanih: 50, izgubaNaEnoto: 16, kupljenih: 10, osnovaDrugje: 2000 };
const p4izguba = p4.prodanih * p4.izgubaNaEnoto;
const p4nepriznana = Math.min(p4.kupljenih, p4.prodanih) * p4.izgubaNaEnoto;
const p4priznana = p4izguba - p4nepriznana;
const N = navideznaOdsvojitevDni;

// Primer 6: tečaj.
const p6 = { usd: 1000, tecajNakup: 1.1, tecajProdaja: 1.0 };
const p6r = posel(p6.usd / p6.tecajNakup, p6.usd / p6.tecajProdaja, st[0].stopnja);

// Primer 7: dividenda iz ZDA.
const p7dividenda = 92;
const p7z = davekNaTujoDividendo({
  dividenda: p7dividenda,
  odtegnjenTujiDavek: p7dividenda * zdaDividendeKonvencija,
  stopnjaKonvencije: zdaDividendeKonvencija,
  stopnjaSlo: dividendeStopnja,
});
const p7brez = davekNaTujoDividendo({
  dividenda: p7dividenda,
  odtegnjenTujiDavek: p7dividenda * 0.3,
  stopnjaKonvencije: zdaDividendeKonvencija,
  stopnjaSlo: dividendeStopnja,
});

// Primer 8: akumulacijski proti distribucijskemu (isti model kot planer).
const p8vnos = {
  enkratniVlozek: 10000,
  mesecniVlozek: 0,
  letniDonos: 0.07,
  leta: 10,
};
const p8dividende = 0.02;
const p8acc = izracunNavadnegaRacuna({ ...p8vnos, dividendniDonos: 0 }, nastavitve2026);
const p8dist = izracunNavadnegaRacuna({ ...p8vnos, dividendniDonos: p8dividende }, nastavitve2026);

// Primer 9: obresti.
const p9 = { ibkr: 300, n26: 800, n26vec: 1300 };

// Primer 11: INR, primer FURS (vplačila 32.000 €, vrednost 55.000 €).
const p11 = { vplacila: 32000, vrednost: 55000, izplacilo1: 15000, izplacilo2: 25000 };
const p11donos = p11.vrednost - p11.vplacila;
const p11osnova1 = Math.min(p11.izplacilo1, p11donos);
const p11osnova2 = Math.min(p11.izplacilo2, p11donos);

// Primer 12/13: kripto in CFD.
const p12 = { nakup: 5000, prodaja: 12000 };
const p13 = { cfd: 2000, izgubaDelnice: 2000 };

// Primer 14: zamenjava ETF.
const p14v = { nakup: 8000, prodaja: 10000, leta: 2 };
const p14 = posel(p14v.nakup, p14v.prodaja, stopnjaPoLetih(p14v.leta));

// Primer 16: dokončni davek.
const p16v = { nakup: 10000, prodaja: 15000, leta: 3 };
const p16 = posel(p16v.nakup, p16v.prodaja, stopnjaPoLetih(p16v.leta));

export const faq: FaqVnos[] = [
  {
    id: "inr",
    skupina: "zacetek",
    vprasanje: "Kaj je individualni naložbeni račun (INR) in kdaj se mi splača?",
    odgovor: `INR je nov račun (od ${inr.veljaOd}), na katerem dividende in prodaje sproti niso obdavčene. Ob izplačilu plačaš ${odstotek(inr.stopnja)} od donosa, prvo izplačilo vsaj ${let_(inr.oprostitevPoLetih)} po odprtju pa je neobdavčeno. Vplačila so omejena: ${evri(inr.prvoLetoLimit)} v letu odprtja, nato ${evri(inr.letniLimit)} letno, skupaj največ ${evri(inr.skupniLimit)}.`,
    pravilo: (
      <ul>
        <li>
          Odpre ga lahko fizična oseba, rezident Slovenije, le enkrat v življenju in
          le enega (tudi podjetnik, a kot fizična oseba, ne za dejavnost). Ponudnik
          mora biti vpisan v javni register ponudnikov INR pri Agenciji za trg
          vrednostnih papirjev (lahko je tudi iz druge države EU).
        </li>
        <li>
          Na seznamu ponudnikov (stanje {vlaganjePreverjeno}) ni tujih spletnih
          posrednikov, kot sta IBKR in Trade Republic. Vsak ponudnik sam določi
          cenik in nabor papirjev. INR lahko preneseš k drugemu ponudniku.
        </li>
        <li>
          Dovoljene so delnice, obveznice, zakladne menice in ETF na trgih EU, EGP
          ali OECD. Skladi morajo vlagati v izdajatelje iz teh držav, zato ETF z
          deležem razvijajočih se trgov (npr. Kitajska, Indija) praviloma ne
          ustreza. O tem presodi ponudnik.
        </li>
        <li>
          Od drugega leta lahko vplačaš še do {evri(inr.posebniPodracunLetniLimit)}{" "}
          letno na posebni podračun, a samo za slovenske izdajatelje.
        </li>
        <li>
          Napovedi ne oddajaš, davek ob izplačilu odtegne ponudnik. Osnova je donos
          (vrednost − vplačila). Pri delnem izplačilu se šteje, da najprej
          izplačuješ donos.
        </li>
        <li>
          Z vsakim izplačilom začne {inr.oprostitevPoLetih}-letno obdobje teči znova. Če nisi
          več rezident, moraš INR zapreti ali ga izprazniti in dati v mirovanje
          (največ 10 let).
        </li>
        <li>
          INR ni vedno boljši: pri enkratnem vložku, ki ga prodaš po {prag(2)} do{" "}
          {prag(3)} letih, je navadni račun ({odstotek(st[2].stopnja)}{" "}
          minus normirani stroški) enako dober ali celo malo boljši (brez upoštevanja
          provizij). Pri mesečnem vlaganju
          in pri distribucijskih ETF je INR praviloma boljši. Planer zgoraj pokaže
          obe možnosti.
        </li>
      </ul>
    ),
    primer: (
      <Primer
        uvod={`Primer FURS: v 10 letih vplačaš ${evri(p11.vplacila)}, vrednost INR je ${evri(p11.vrednost)} (donos ${evri(p11donos)}).`}
        vrstice={[
          {
            oznaka: `Izplačaš ${evri(p11.izplacilo1)}: vse je donos, davek ${odstotek(inr.stopnja)}`,
            vrednost: evri(p11osnova1 * inr.stopnja),
            poudarek: "davek",
          },
          {
            oznaka: `Izplačaš ${evri(p11.izplacilo2)}: donos ${evri(p11osnova2)}, preostanek je vračilo vplačil`,
            vrednost: evri(p11osnova2 * inr.stopnja),
            poudarek: "davek",
          },
          {
            oznaka: `Isto izplačilo po ${inr.oprostitevPoLetih} letih od odprtja (prvo izplačilo)`,
            vrednost: evri(0),
            poudarek: "ostane",
          },
        ]}
      />
    ),
    viri: [viri.inrPojasnila, viri.inrRegister, viri.inrZlozenka, viri.fursOpis, viri.inrZakon],
  },
  {
    id: "akumulacijski-distribucijski",
    skupina: "zacetek",
    vprasanje: "Akumulacijski ali distribucijski ETF – kateri je davčno ugodnejši?",
    odgovor: `Pri akumulacijskem ETF dividende ostanejo v skladu, zato sproti ni davka in ne oddajaš Doh-Div; vse se obdavči šele ob prodaji, po ${oprostitevLet} letih pa nič. Pri distribucijskem je vsako izplačilo obdavčeno po stopnji ${odstotek(dividendeStopnja)}, ne glede na to, kako dolgo imaš ETF.`,
    pravilo: (
      <ul>
        <li>
          Davek od dividende nastane, ko je dividenda izplačana tebi. Pri
          akumulacijskem ETF sklad dohodek vloži sam, kar se pokaže v višji ceni
          enote. Obdavči se ob prodaji kot dobiček iz kapitala, po stopnji, ki je
          odvisna od obdobja imetništva.
        </li>
        <li>
          Irski UCITS ETF-ji ob izplačilu ne odtegnejo davka, zato pri
          distribucijskem v Sloveniji plačaš celih {odstotek(dividendeStopnja)}.
        </li>
      </ul>
    ),
    primer: (
      <Primer
        uvod={`Enkratni vložek ${evri(p8vnos.enkratniVlozek)}, ${odstotek(p8vnos.letniDonos)} letnega donosa (pri distribucijskem od tega ${odstotek(p8dividende)} dividend), prodaja ${poLetih(p8vnos.leta)}. Izračun je enak kot v planerju zgoraj.`}
        vrstice={[
          { oznaka: "Akumulacijski: davek ob prodaji", vrednost: evri(p8acc.skupajDavki) },
          { oznaka: "Akumulacijski: ostane ti", vrednost: evri(p8acc.neto), poudarek: "ostane" },
          {
            oznaka: "Distribucijski: davek od dividend + ob prodaji",
            vrednost: `${evri(p8dist.davekNaDividende)} + ${evri(p8dist.davekObProdaji.davek)}`,
          },
          { oznaka: "Distribucijski: ostane ti", vrednost: evri(p8dist.neto), poudarek: "ostane" },
        ]}
        opomba={`Razlika ${evri(p8acc.neto - p8dist.neto)} je posledica tega, da pri distribucijskem davek plačuješ sproti in denar, ki ga plačaš za davek, ne raste naprej.`}
      />
    ),
    viri: [viri.fursOpis, viri.javniPoziv, viri.revenueSkladi],
  },
  {
    id: "prijava-racuna",
    skupina: "zacetek",
    vprasanje: "Ali moram FURS prijaviti račun pri tujem posredniku?",
    odgovor: `V ${prijavaTujegaRacunaDni} dneh od odprtja moraš FURS prijaviti plačilni račun v tujini (obrazec DR-Račun v eDavkih). Računa, ki ni plačilni, ne prijaviš. FURS je pojasnil, da računov pri Trade Republic za zdaj ni treba prijaviti, investicijskih podračunov pri Revolutu ali N26 pa ne prijaviš posebej, ker spadajo k osnovnemu plačilnemu računu.`,
    pravilo: (
      <ul>
        <li>
          Plačilni račun je račun, s katerega lahko nakazuješ denar drugim, nanj
          prejemaš nakazila ali ga uporabljaš s kartico ali za trajnike (npr.
          Revolut ali N26). Prijaviš IBAN, ne številke kartice. V {prijavaTujegaRacunaDni} dneh
          sporočiš tudi spremembe in zaprtje.
        </li>
        <li>Varčevalnih računov v tujini ne prijavljaš.</li>
        <li>
          Za druge posrednike (npr. IBKR) FURS ni objavil stališča. Če račun omogoča
          zgornje plačilne storitve, ga prijavi.
        </li>
        <li>
          Obveznost določa Zakon o finančni upravi (ZFU). Za neprijavljen plačilni
          račun je zagrožena globa od {evri(globe.prijavaRacuna.od)} do{" "}
          {evri(globe.prijavaRacuna.do)}.
        </li>
        <li>
          Prijava računa ni napoved dohodkov. Dobičke, dividende in obresti napoveš
          posebej.
        </li>
        <li>
          FURS podatke o tujih računih dobiva z mednarodno izmenjavo: za leto 2024
          je prejel podatke o 648.265 računih 293.505 imetnikov. Od 16. 3. 2026 jih
          vidiš tudi v eDavkih.
        </li>
      </ul>
    ),
    primer: (
      <Primer
        uvod="Račun pri Revolutu (IBAN LT…) odpreš 3. 5."
        vrstice={[
          { oznaka: "Prijava DR-Račun najpozneje", vrednost: "11. 5.", poudarek: "krepko" },
          { oznaka: "Zaprtje računa sporočiš v", vrednost: `${prijavaTujegaRacunaDni} dneh` },
        ]}
      />
    ),
    viri: [viri.prijavaRacuna, viri.tujiRacuniNovica, viri.fursRacuniVprasanja, viri.zfu],
  },
  {
    id: "kdaj-nastane-davek",
    skupina: "zacetek",
    vprasanje: "Ali plačam davek, če samo kupujem in ne prodajam?",
    odgovor:
      "Ne. Nakup, imetništvo in rast vrednosti niso obdavčeni. Davek nastane ob prodaji (tudi ob zamenjavi enega ETF za drugega ali ob podaritvi), za dividende in obresti pa ob izplačilu.",
    pravilo: (
      <ul>
        <li>
          Obdavčljiva odsvojitev je vsaka prodaja, podaritev in zamenjava (tudi ETF A
          za ETF B pri istem posredniku) ter unovčitev kupona sklada.
        </li>
        <li>
          Ni obdavčeno: dedovanje in zamenjava za istovrstne papirje istega
          izdajatelja brez denarnega toka (npr. razdelitev delnic, &raquo;split&laquo;).
        </li>
        <li>
          Pri darilu zakoncu ali otroku se ugotavljanje davka lahko odloži, dokler
          obdarjeni papirjev ne proda. Odlog priglasiš do {rokNapovedi}.
        </li>
        <li>
          Odlog velja tudi pri prehodu med podskladi krovnega sklada (upravljavec iz
          Slovenije ali EU). Pri zamenjavi ETF-jev na borzi odloga ni.
        </li>
      </ul>
    ),
    primer: (
      <Primer
        uvod={`ETF A si kupil pred ${p14v.leta} letoma za ${evri(p14v.nakup)}, zdaj je vreden ${evri(p14v.prodaja)} in ga zamenjaš za ETF B.`}
        vrstice={[
          { oznaka: "Dobiček pri ETF A", vrednost: evri(p14.dobicek) },
          { oznaka: "Davčna osnova po odbitku normiranih stroškov", vrednost: evri(p14.davcnaOsnova) },
          { oznaka: `Davek ${odstotek(stopnjaPoLetih(p14v.leta))}`, vrednost: evri(p14.davek), poudarek: "davek" },
        ]}
        opomba="Za ETF B obdobje imetništva začne teči znova."
      />
    ),
    viri: [viri.fursOpis],
  },
  {
    id: "koliko-davka",
    skupina: "prodaja",
    vprasanje: "Koliko davka plačam, ko prodam delnice ali ETF?",
    odgovor: `Od dobička plačaš ${odstotek(st[0].stopnja)}, če prodaš v prvih ${prag(1)} letih, ${odstotek(st[1].stopnja)} po ${prag(1)}, ${odstotek(st[2].stopnja)} po ${prag(2)} in nič po ${prag(3)} letih imetništva. Davek plačaš samo od dobička in šele, ko prodaš.`,
    pravilo: (
      <>
        <p>
          Davčna osnova je razlika med prodajno in nabavno vrednostjo (97. člen
          ZDoh-2). Če je pozitivna, jo zmanjšajo <strong>normirani stroški</strong>:{" "}
          {ns} nabavne vrednosti + {ns} prodajne vrednosti, a največ do višine
          dobička. Dejanskih provizij ne uveljavljaš posebej. Normirane stroške FURS
          upošteva sam.
        </p>
        <table>
          <thead>
            <tr>
              <th>Imetništvo</th>
              <th>Stopnja</th>
            </tr>
          </thead>
          <tbody>
            {st.map((s, i) => (
              <tr key={s.odLet}>
                <td>
                  {i === 0
                    ? `manj kot ${let_(prag(1))}`
                    : st[i + 1]
                      ? `${s.odLet} do ${let_(st[i + 1].odLet)}`
                      : `${let_(s.odLet)} ali več`}
                </td>
                <td>{s.stopnja === 0 ? "oproščeno" : odstotek(s.stopnja)}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p>
          Davek je <strong>dokončen</strong>: ne prišteva se k dohodnini od plače ali
          s.&nbsp;p. in zanj ne veljajo olajšave.
        </p>
      </>
    ),
    primer: (
      <Primer
        uvod={`Kupiš ETF za ${evri(p1.nakup)} in ga ${poLetih(p1.leta)} prodaš za ${evri(p1.prodaja)}.`}
        vrstice={[
          { oznaka: "Dobiček", vrednost: evri(p1r.dobicek) },
          {
            oznaka: `Normirani stroški (${ns} × ${evri(p1.nakup)} + ${ns} × ${evri(p1.prodaja)})`,
            vrednost: `−${evri(p1r.normiraniStroski)}`,
          },
          { oznaka: "Davčna osnova", vrednost: evri(p1r.davcnaOsnova), poudarek: "krepko" },
          {
            oznaka: `Davek ${odstotek(stopnjaPoLetih(p1.leta))} (${let_(p1.leta)} imetništva)`,
            vrednost: evri(p1r.davek),
            poudarek: "davek",
          },
        ]}
      />
    ),
    viri: [viri.fursOpis, viri.zdoh132, viri.fursOdsvojitev],
  },
  {
    id: "obdobje-imetnistva",
    skupina: "prodaja",
    vprasanje: `Kako se šteje obdobje imetništva (${prag(1)}, ${prag(2)}, ${prag(3)} let)?`,
    odgovor:
      "Za vsak nakup posebej, od datuma nakupa do datuma prodaje. Ko prodajaš, se vedno najprej prodajo najstarejše enote (FIFO), nižja stopnja pa velja šele, ko je obdobje v celoti dopolnjeno.",
    pravilo: (
      <ul>
        <li>
          Za čas nakupa in prodaje šteje datum sklenitve posla (datum trgovanja), ne
          datum poravnave.
        </li>
        <li>
          Zaloge istega papirja moraš voditi po metodi <strong>FIFO</strong>. Ne
          moreš izbrati, da najprej prodaš mlajše ali dražje enote.
        </li>
        <li>
          Pri mesečnem vlaganju ima vsak nakup svoj rok. Po {oprostitevLet} letih je
          neobdavčen le del, ki si ga kupil pred vsaj {oprostitevLet} leti.
          Reinvestirane dividende so nov nakup z novim rokom.
        </li>
        <li>
          FURS ne pojasni izrecno, ali se na sam dan obletnice obdobje že šteje za
          dopolnjeno. Po pravilu za štetje rokov v letih (100. člen ZUP) se obdobje
          izteče šele s koncem dneva, ki se z datumom ujema z dnem nakupa. Varneje
          je, da prodaš dan po obletnici.
        </li>
      </ul>
    ),
    primer: (
      <Primer
        uvod={`Delnice kupiš 10. 3. 2021 za ${evri(p2.nakup)}, prodaš jih za ${evri(p2.prodaja)}.`}
        vrstice={[
          {
            oznaka: `Prodaja 9. 3. 2026 (še ni ${let_(prag(1))}): ${odstotek(st[0].stopnja)}`,
            vrednost: evri(p2prej.davek),
            poudarek: "davek",
          },
          {
            oznaka: `Prodaja 11. 3. 2026 (dopolnjenih ${let_(prag(1))}): ${odstotek(st[1].stopnja)}`,
            vrednost: evri(p2po.davek),
            poudarek: "davek",
          },
          {
            oznaka: "Dva dneva čakanja ti prihranita",
            vrednost: evri(p2prej.davek - p2po.davek),
            poudarek: "ostane",
          },
        ]}
        opomba={`Davčna osnova je v obeh primerih ${evri(p2po.davcnaOsnova)} (dobiček ${evri(p2po.dobicek)} minus normirani stroški ${evri(p2po.normiraniStroski)}).`}
      />
    ),
    viri: [viri.fursOpis, viri.kdvpNavodilo, viri.zup],
  },
  {
    id: "izguba",
    skupina: "prodaja",
    vprasanje: "Ali moram prodajo prijaviti, tudi če sem bil v izgubi?",
    odgovor:
      "Da. Doh-KDVP oddaš za vsako leto, v katerem si kaj prodal, tudi če si imel le izgubo ali zelo majhen dobiček. Izguba zmanjša dobiček iz istega leta, v naslednja leta pa je ne moreš prenesti.",
    pravilo: (
      <ul>
        <li>
          FURS: napoved je obvezna ne glede na to, ali si dosegel dobiček ali
          izgubo. Praga, pod katerim dobiček ne bi bil obdavčen, ni.
        </li>
        <li>
          Izjema: prodaje po {oprostitevLet} letih imetništva ne prijavljaš
          (navodilo za Doh-KDVP).
        </li>
        <li>
          Izgubo pobotaš z dobički od vseh vrst kapitala v istem letu (delnice, ETF,
          skladi, tudi nepremičnine), ne pa z dobički od CFD-jev in opcij, ki imajo
          svojo napoved.
        </li>
        <li>
          Prenos neizkoriščene izgube v naslednja leta ni mogoč (razen redke izjeme
          pri delnicah, pridobljenih pred povečanjem kapitala iz sredstev družbe).
        </li>
        <li>
          Če so dobički iz različnih obdobij imetništva, se osnova po pobotu
          sorazmerno razdeli po stopnjah.
        </li>
      </ul>
    ),
    primer: (
      <Primer
        uvod={`V istem letu prodaš ETF A (kupljen pred dvema letoma za ${evri(p3.nakup)}, prodan za ${evri(p3.prodaja)}) in delnico B z izgubo ${evri(p3.izguba)}.`}
        vrstice={[
          { oznaka: "Osnova od ETF A (po normiranih stroških)", vrednost: evri(p3a.davcnaOsnova) },
          { oznaka: "Izguba pri delnici B", vrednost: `−${evri(p3izguba)}` },
          { oznaka: "Skupna davčna osnova", vrednost: evri(p3osnova), poudarek: "krepko" },
          {
            oznaka: `Davek ${odstotek(st[0].stopnja)}`,
            vrednost: evri(p3osnova * st[0].stopnja),
            poudarek: "davek",
          },
        ]}
        opomba={`Brez prijave izgube bi plačal ${evri(p3a.davek)}. Če bi delnico B prodal januarja naslednjega leta, ti ta izguba ne bi pomagala.`}
      />
    ),
    viri: [viri.fursOpis, viri.kdvpNavodilo, viri.zdoh97],
  },
  {
    id: "pravilo-30-dni",
    skupina: "prodaja",
    vprasanje: `Kaj je pravilo ${N} dni in kdaj velja pri mesečnem vlaganju?`,
    odgovor: `Če v ${N} dneh pred prodajo z izgubo ali po njej kupiš isti vrednostni papir, se izguba ne prizna za toliko enot, kolikor si jih v tem času kupil. Pri mesečnem varčevalnem načrtu v istem ETF zato del izgube skoraj vedno propade.`,
    pravilo: (
      <ul>
        <li>
          97. člen ZDoh-2 (&raquo;navidezna odsvojitev&laquo;): upošteva se obdobje{" "}
          {N * 2 + 1} dni ({N} dni pred prodajo, dan prodaje in {N} dni po njej).
        </li>
        <li>
          FURS pravilo uporablja količinsko: izguba se ne prizna le za toliko
          prodanih enot, kolikor si jih v tem obdobju kupil. Za preostale enote se
          prizna.
        </li>
        <li>
          Nepriznana izguba ne preide na nove enote (ne poveča njihove nabavne
          vrednosti, kot se to zgodi v ZDA).
        </li>
        <li>
          Če prodaš vse enote in v {N} dneh po prodaji istega papirja ne kupiš
          znova, se izguba prizna v celoti, tudi če si kupoval pred prodajo.
        </li>
        <li>
          Izguba se prav tako ne prizna, če isti papir kupi tvoj družinski član ali
          družba, v kateri imaš vsaj 25 %. Zakon za ta primer ne določa roka {N}{" "}
          dni.
        </li>
        <li>Pravilo velja samo za izgube, ne za dobičke.</li>
      </ul>
    ),
    primer: (
      <Primer
        uvod={`Imaš ${p4.enot} enot ETF in 15. 3. prodaš ${p4.prodanih} enot z izgubo ${evri(p4izguba)} (${evri(p4.izgubaNaEnoto)} na enoto). Z mesečnima nakupoma 1. 3. in 1. 4. kupiš skupaj ${p4.kupljenih} enot. V istem letu imaš še ${evri(p4.osnovaDrugje)} davčne osnove od drugega ETF.`}
        vrstice={[
          {
            oznaka: `Izguba, ki se ne prizna (${p4.kupljenih} enot × ${evri(p4.izgubaNaEnoto)})`,
            vrednost: evri(p4nepriznana),
          },
          {
            oznaka: `Izguba, ki se prizna (${p4.prodanih - p4.kupljenih} enot × ${evri(p4.izgubaNaEnoto)})`,
            vrednost: evri(p4priznana),
          },
          {
            oznaka: `Davek brez pravila: ${odstotek(st[0].stopnja)} × (${evri(p4.osnovaDrugje)} − ${evri(p4izguba)})`,
            vrednost: evri((p4.osnovaDrugje - p4izguba) * st[0].stopnja),
          },
          {
            oznaka: `Davek s pravilom: ${odstotek(st[0].stopnja)} × (${evri(p4.osnovaDrugje)} − ${evri(p4priznana)})`,
            vrednost: evri((p4.osnovaDrugje - p4priznana) * st[0].stopnja),
            poudarek: "davek",
          },
        ]}
        opomba={`Če želiš izgubo izkoristiti v celoti, ${N} dni pred prodajo in po njej ne kupuj istega papirja ali pa prodaj vse enote in ${N} dni po prodaji ne kupuj znova.`}
      />
    ),
    viri: [viri.navideznaOdsvojitev, viri.zdoh97],
  },
  {
    id: "doh-kdvp-rok",
    skupina: "prodaja",
    vprasanje: "Kdaj in kako oddam Doh-KDVP?",
    odgovor: `Do ${rokNapovedi} za preteklo leto, prek eDavkov (pri več kot ${eOddajaObveznaNad.kdvpPoslov} transakcijah je elektronska oddaja obvezna). FURS izda odločbo do ${rokOdlocbe}, davek pa plačaš v ${rokPlacilaDni} dneh od vročitve.`,
    pravilo: (
      <ul>
        <li>
          Za vsak vrednostni papir izpolniš popisni list z vsemi nakupi (tudi iz
          prejšnjih let, če še niso prodani) in vsemi prodajami v letu.
        </li>
        <li>
          Tuji posredniki FURS ne pošiljajo podatkov za to napoved, zato vse vneseš
          sam.
        </li>
        <li>
          Za elektronsko oddajo moraš biti prijavljen v storitev eVročanje.
        </li>
        <li>
          Če rok pade na soboto ali nedeljo, se prestavi na naslednji delovni dan
          (za leto 2025 je bil rok 2. 3. 2026).
        </li>
        <li>
          Napoved oddaš v roku, tudi če davka še ne moreš plačati. Plačilo je šele
          po odločbi.
        </li>
      </ul>
    ),
    primer: (
      <Primer
        uvod="Prodaš ETF 5. 9. 2026."
        vrstice={[
          { oznaka: "Rok za napoved (28. 2. 2027 je nedelja)", vrednost: "1. 3. 2027", poudarek: "krepko" },
          { oznaka: "FURS izda odločbo", vrednost: "do 30. 4. 2027" },
          { oznaka: "Plačilo davka", vrednost: `${rokPlacilaDni} dni od vročitve` },
        ]}
      />
    ),
    viri: [viri.fursOdsvojitev, viri.javniPoziv, viri.kdvpEdavki, viri.evrocanje],
  },
  {
    id: "tecaj",
    skupina: "prodaja",
    vprasanje: "Kateri tečaj uporabim, če kupujem v dolarjih?",
    odgovor:
      "Tečaj Banke Slovenije (referenčni tečaj ECB) na dan nakupa za nabavno vrednost in na dan prodaje za prodajno vrednost. Ne tečaja posrednika in ne tečaja na dan oddaje napovedi.",
    pravilo: (
      <ul>
        <li>
          Navodilo za Doh-KDVP: vrednost v tuji valuti se preračuna v evre po
          tečaju, ki ga objavlja Banka Slovenije in velja na dan pridobitve oziroma
          odsvojitve.
        </li>
        <li>
          Pri dividendah (Doh-Div) uporabiš tečaj na dan prejema dividende. Po
          istem tečaju preračunaš tudi tuji davek.
        </li>
        <li>
          Sprememba tečaja je zato del dobička ali izgube, tudi če se cena v
          dolarjih ni spremenila.
        </li>
      </ul>
    ),
    primer: (
      <Primer
        uvod={`Kupiš delnico za ${p6.usd.toLocaleString("sl-SI", { useGrouping: "always" })} USD pri tečaju 1 € = ${p6.tecajNakup.toLocaleString("sl-SI", { minimumFractionDigits: 2 })} USD in jo prodaš za ${p6.usd.toLocaleString("sl-SI", { useGrouping: "always" })} USD pri tečaju 1 € = ${p6.tecajProdaja.toLocaleString("sl-SI", { minimumFractionDigits: 2 })} USD.`}
        vrstice={[
          { oznaka: "Nabavna vrednost v evrih", vrednost: evri(p6.usd / p6.tecajNakup) },
          { oznaka: "Prodajna vrednost v evrih", vrednost: evri(p6.usd / p6.tecajProdaja) },
          { oznaka: "Dobiček za FURS (v dolarjih je 0)", vrednost: evri(p6r.dobicek), poudarek: "krepko" },
          { oznaka: "Davčna osnova po normiranih stroških", vrednost: evri(p6r.davcnaOsnova) },
          { oznaka: `Davek ${odstotek(st[0].stopnja)}`, vrednost: evri(p6r.davek), poudarek: "davek" },
        ]}
      />
    ),
    viri: [viri.kdvpNavodilo, viri.divNavodilo],
  },
  {
    id: "zamuda",
    skupina: "prodaja",
    vprasanje: "Kaj, če sem pozabil oddati napoved?",
    odgovor:
      `Čim prej oddaj napoved kot samoprijavo, preden ti FURS vroči odločbo ali začne nadzor. Če plačaš odmerjeni davek, te za prekršek ne kaznujejo, plačaš pa ${odstotek(samoprijavaObresti)} letnih obresti za čas od izteka roka do oddaje.`,
    pravilo: (
      <ul>
        <li>
          <strong>Samoprijava</strong> (63. člen ZDavP-2): na napovedi označiš status
          2. Mogoča je do vročitve odmerne odločbe ali do začetka nadzora oziroma
          postopka o prekršku. Od davka plačaš {odstotek(samoprijavaObresti)}{" "}
          letnih obresti za čas od izteka roka do oddaje samoprijave. Če odmerjeni davek
          plačaš, globe ni (396. člen ZDavP-2). Za isto obveznost lahko samoprijavo
          vložiš le enkrat.
        </li>
        <li>
          <strong>Naknadna predložitev</strong> (62. člen): če si rok zamudil iz
          opravičljivih razlogov, predlog vložiš v 8 dneh po prenehanju razloga,
          najpozneje pa v treh mesecih po izteku roka.
        </li>
        <li>
          <strong>Popravek</strong> že oddane napovedi (64. člen) je mogoč do
          vročitve odločbe.
        </li>
        <li>
          Kdor napovedi ne odda ali jo odda prepozno, stori prekršek, za katerega je
          zagrožena globa od {evri(globe.napoved.od)} do {evri(globe.napoved.do)}.
          Za nepravilne podatke v napovedi je globa od{" "}
          {evri(globe.napacniPodatki.od)} do {evri(globe.napacniPodatki.do)} (394.
          in 395. člen ZDavP-2).
        </li>
      </ul>
    ),
    primer: (
      <Primer
        uvod="Pozabil si oddati Doh-KDVP za leto 2025 (rok je bil 2. 3. 2026) in to opaziš oktobra 2026."
        vrstice={[
          { oznaka: "Oddaš", vrednost: "samoprijavo (status 2)" },
          { oznaka: "Obresti od 3. 3. 2026 do oddaje", vrednost: `${odstotek(samoprijavaObresti)} letno` },
          { oznaka: "Globa, če plačaš v roku", vrednost: "ni", poudarek: "ostane" },
        ]}
      />
    ),
    viri: [viri.kdvpNavodilo, viri.javniPoziv, viri.divNavodilo, viri.zdavp],
  },
  {
    id: "dohodnina",
    skupina: "prodaja",
    vprasanje: "Ali se dobiček od delnic prišteje k moji dohodnini (plača, s. p.)?",
    odgovor:
      "Ne. Dividende, obresti in dobiček iz kapitala so obdavčeni po fiksni stopnji kot dokončni davek in se ne vštevajo v letno davčno osnovo. Ne dvignejo tvojega dohodninskega razreda, olajšave pa zanje ne veljajo.",
    pravilo: (
      <ul>
        <li>
          FURS: dohodki iz kapitala se ne vključujejo v letno odmero dohodnine
          (izjema je bilo le leto 2022, ko si lahko izbral drugače).
        </li>
        <li>
          Če vlagaš kot fizična oseba, vlaganje ne vpliva na prispevke ali davek
          tvojega s.&nbsp;p. Če trguješ v okviru dejavnosti ali prek d.&nbsp;o.&nbsp;o., veljajo druga
          pravila.
        </li>
        <li>
          Kako je obdavčeno delo prek s.&nbsp;p. ali d.&nbsp;o.&nbsp;o., primerjaš v{" "}
          <Link to="/" className="link">
            glavnem kalkulatorju
          </Link>
          .
        </li>
      </ul>
    ),
    primer: (
      <Primer
        uvod={`Imaš plačo in ${poLetih(p16v.leta)} prodaš ETF, kupljen za ${evri(p16v.nakup)}, za ${evri(p16v.prodaja)}.`}
        vrstice={[
          { oznaka: "Davčna osnova od ETF", vrednost: evri(p16.davcnaOsnova) },
          {
            oznaka: `Davek ${odstotek(stopnjaPoLetih(p16v.leta))}, ne glede na višino plače`,
            vrednost: evri(p16.davek),
            poudarek: "davek",
          },
          { oznaka: "Vpliv na dohodnino od plače", vrednost: evri(0) },
        ]}
      />
    ),
    viri: [viri.fursOpis],
  },
  {
    id: "dividende",
    skupina: "dividende-obresti",
    vprasanje: "Kako so obdavčene dividende in čemu služi W-8BEN?",
    odgovor: `Dividende so v Sloveniji obdavčene s ${odstotek(dividendeStopnja)}. Davek, ki ga je odtegnila tuja država, odšteješ, a največ do stopnje iz konvencije: za ZDA je to ${odstotek(zdaDividendeKonvencija)}, kar dosežeš z obrazcem W-8BEN pri posredniku. V Sloveniji doplačaš razliko do ${odstotek(dividendeStopnja)}.`,
    pravilo: (
      <ul>
        <li>
          Napoved Doh-Div oddaš do {rokNapovedi} za vse dividende, ki ti jih ni
          izplačal slovenski plačnik davka (prek tujih posrednikov praktično vse), ne
          glede na znesek. Pri več kot {eOddajaObveznaNad.divIzplacil} izplačilih je
          elektronska oddaja obvezna.
        </li>
        <li>
          Vpišeš bruto dividendo in tuji davek v evrih ter priložiš dokazilo
          posrednika o odtegnjenem davku.
        </li>
        <li>
          Odbitek tujega davka se prizna po stopnji iz mednarodne pogodbe in največ
          do slovenskega davka. Kar je bilo odtegnjeno nad to stopnjo (npr. 30 % brez
          W-8BEN), se v Sloveniji ne prizna. Vračilo bi moral zahtevati v tujini.
        </li>
        <li>
          Prijaviš tudi dividende, ki jih ti ali posrednik samodejno znova vložita.
        </li>
      </ul>
    ),
    primer: (
      <Primer
        uvod={`Ameriška delnica izplača dividendo 100 USD, kar je na dan izplačila ${evri(p7dividenda)}.`}
        vrstice={[
          { oznaka: `Slovenski davek ${odstotek(dividendeStopnja)}`, vrednost: evri(p7z.davekSlo) },
          {
            oznaka: `Z W-8BEN: v ZDA odtegnjeno ${odstotek(zdaDividendeKonvencija)}, v Sloveniji doplačaš`,
            vrednost: evri(p7z.doplacilo),
          },
          { oznaka: "Z W-8BEN skupaj", vrednost: evri(p7z.skupajPlacano), poudarek: "davek" },
          {
            oznaka: `Brez W-8BEN: odtegnjeno 30 % (${evri(p7brez.skupajPlacano - p7brez.doplacilo)}), v Sloveniji doplačaš`,
            vrednost: evri(p7brez.doplacilo),
          },
          { oznaka: "Brez W-8BEN skupaj", vrednost: evri(p7brez.skupajPlacano), poudarek: "davek" },
        ]}
      />
    ),
    viri: [viri.mednarodnaBrosura, viri.divNavodilo, viri.fursDividende, viri.irsKonvencija, viri.irsW8ben],
  },
  {
    id: "obresti",
    skupina: "dividende-obresti",
    vprasanje: "Kako so obdavčene obresti na denar pri posredniku ali v spletni banki?",
    odgovor: `Obresti so obdavčene s ${odstotek(obrestiStopnja)}. Oprostitev do ${evri(obrestiDepozitiOprostitev)} na leto velja samo za obresti na depozite pri bankah iz Slovenije ali EU, ne pa za obresti pri borznih posrednikih (npr. IBKR, eToro) ali v skladih denarnega trga (npr. Revolut Savings).`,
    pravilo: (
      <ul>
        <li>
          <strong>Depoziti pri bankah iz SLO ali EU</strong> (FURS kot primere
          navaja Revolut Bank UAB &raquo;Instant Access Savings&laquo;, N26 in Trade
          Republic od 6. 12. 2023): seštevek obresti se zmanjša za{" "}
          {evri(obrestiDepozitiOprostitev)}. Napoved oddaš le, če skupaj presežeš to
          mejo. Za leta 2024–2026 se vanjo štejejo tudi obresti od obveznic RS za
          prebivalstvo.
        </li>
        <li>
          <strong>Ustanove, ki niso banke</strong> (FURS navaja IBKR Ireland, IBKR
          Central Europe, eToro, Mintos): {odstotek(obrestiStopnja)} od prvega evra,
          napoved za druge obresti (Doh-Obr) do {rokNapovedi}.
        </li>
        <li>
          <strong>Revolut &raquo;Savings Flexible&laquo;</strong> je naložba v
          sklad denarnega trga: obresti so obdavčene s {odstotek(obrestiStopnja)}{" "}
          brez oprostitve.
        </li>
        <li>
          Za druge ponudnike (npr. obresti na denar pri Trading 212) preveri, kdo jih
          izplača. Oprostitev velja le za obresti banke s sedežem v Sloveniji ali
          EU.
        </li>
      </ul>
    ),
    primer: (
      <Primer
        uvod={`Pri IBKR dobiš ${evri(p9.ibkr)} obresti, na varčevalnem računu pri N26 pa ${evri(p9.n26)}.`}
        vrstice={[
          { oznaka: `IBKR: ${odstotek(obrestiStopnja)} × ${evri(p9.ibkr)}`, vrednost: evri(p9.ibkr * obrestiStopnja), poudarek: "davek" },
          { oznaka: `N26: pod ${evri(obrestiDepozitiOprostitev)}, napovedi ni`, vrednost: evri(0) },
          {
            oznaka: `Če bi pri N26 dobil ${evri(p9.n26vec)}: ${odstotek(obrestiStopnja)} × ${evri(p9.n26vec - obrestiDepozitiOprostitev)}`,
            vrednost: evri((p9.n26vec - obrestiDepozitiOprostitev) * obrestiStopnja),
          },
        ]}
      />
    ),
    viri: [viri.fursOpis, viri.zdoh133],
  },
  {
    id: "cfd",
    skupina: "dividende-obresti",
    vprasanje: "Kako so obdavčeni CFD-ji, opcije in terminske pogodbe?",
    odgovor: `Kot izvedeni finančni instrumenti, z ločeno napovedjo. Od 1. 1. 2026 velja enotna stopnja ${odstotek(izvedeniInstrumentiStopnja2026)} ne glede na čas imetništva (do konca leta 2025 je bila v prvem letu ${odstotek(izvedeniInstrumentiPrvoLeto2025)}). Izgub iz CFD-jev ne moreš pobotati z dobički od delnic in obratno.`,
    pravilo: (
      <>
        <p>
          Napoved za odmero davka od dobička od odsvojitve izvedenih finančnih
          instrumentov oddaš do {rokNapovedi}. Dobički in izgube iz izvedenih
          instrumentov se pobotajo le med seboj, v istem letu.
        </p>
      </>
    ),
    primer: (
      <Primer
        uvod={`V letu ${vlaganjeLeto} imaš ${evri(p13.cfd)} dobička s CFD-ji in ${evri(p13.izgubaDelnice)} izgube pri delnicah.`}
        vrstice={[
          {
            oznaka: `Davek od CFD (${odstotek(izvedeniInstrumentiStopnja2026)})`,
            vrednost: evri(p13.cfd * izvedeniInstrumentiStopnja2026),
            poudarek: "davek",
          },
          { oznaka: "Izguba pri delnicah ga ne zmanjša", vrednost: evri(0) },
        ]}
      />
    ),
    viri: [viri.ifi],
  },
  {
    id: "kripto",
    skupina: "dividende-obresti",
    vprasanje: "Ali so kriptovalute obdavčene?",
    odgovor:
      `Če kriptovalute kupuješ in prodajaš kot zasebnik (ne v okviru dejavnosti), dobiček v letu ${vlaganjeLeto} ni obdavčen. Ministrstvo za finance je leta 2025 pripravilo predlog zakona o davku od dobička iz odsvojitve kriptosredstev, a zakon do ${vlaganjePreverjeno} še ni bil sprejet.`,
    pravilo: (
      <ul>
        <li>
          FURS: dobiček fizične osebe od prodaje virtualnih valut ni obdavčen z
          dohodnino, razen če ga dosega v okviru dejavnosti. Takrat gre za dohodek iz
          dejavnosti, od katerega se plačajo tudi prispevki.
        </li>
        <li>
          Žetoni, ki so po vsebini vrednostni papirji ali izvedeni instrumenti, se
          obdavčijo kot taki. CFD-ji in terminske pogodbe na kripto so izvedeni
          instrumenti, od leta 2026 obdavčeni po stopnji{" "}
          {odstotek(izvedeniInstrumentiStopnja2026)}.
        </li>
        <li>
          Od 1. 1. 2026 ponudniki kriptostoritev po direktivi DAC8 zbirajo podatke
          o uporabnikih in poslih. Podatke za leto 2026 morajo FURS sporočiti do
          31. 5. 2027.
        </li>
      </ul>
    ),
    primer: (
      <Primer
        uvod={`Kupiš BTC za ${evri(p12.nakup)} in ga v letu ${vlaganjeLeto} prodaš za ${evri(p12.prodaja)}.`}
        vrstice={[
          { oznaka: "Kot zasebnik (BTC imaš neposredno)", vrednost: evri(0), poudarek: "ostane" },
          {
            oznaka: `Enak dobiček s CFD na BTC: ${odstotek(izvedeniInstrumentiStopnja2026)} × ${evri(p12.prodaja - p12.nakup)}`,
            vrednost: evri((p12.prodaja - p12.nakup) * izvedeniInstrumentiStopnja2026),
            poudarek: "davek",
          },
        ]}
      />
    ),
    viri: [viri.kripto, viri.kriptoPredlogVlade, viri.dac8, viri.ifi],
  },
];

export function faqJsonLd(vnosi: FaqVnos[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    inLanguage: "sl",
    mainEntity: vnosi.map((v) => ({
      "@type": "Question",
      name: v.vprasanje,
      acceptedAnswer: { "@type": "Answer", text: v.odgovor },
    })),
  };
}

