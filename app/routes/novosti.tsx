import type { MetaFunction } from "react-router";
import { Link } from "react-router";
import {
  ArrowLeft02Icon,
  CheckmarkCircle01Icon,
  NewsIcon,
  AlertCircleIcon,
} from "hugeicons-react";
import Footer from "~/ui/common/Footer/Footer";
import { incomeTaxBrackets as incomeTaxBrackets2025 } from "~/constants/2025/incomeTaxBrackets";
import { incomeTaxBrackets as incomeTaxBrackets2026 } from "~/constants/2026/incomeTaxBrackets";
import formatCurrency from "~/utils/formatCurrency";
import { seo } from "~/utils/seo";

export const meta: MetaFunction = () =>
  seo({
    title: "Novosti 2026 v davčnem kalkulatorju | obdavcen.si",
    description:
      "Pregled vseh sprememb in novosti v davčnem kalkulatorju za leto 2026 – nove davčne stopnje, razširjen kalkulator in več možnosti optimizacije.",
    path: "/novosti",
  });

export default function Novosti() {
  return (
    <div className="p-4 gap-4 flex flex-col">
      <div className="flex justify-center">
        <Link to="/" className="btn btn-sm btn-ghost gap-2">
          <ArrowLeft02Icon className="size-4" />
          Nazaj na kalkulator
        </Link>
      </div>

      <article className="prose mx-auto mt-8 max-md:max-w-full">
        <h1>Novosti 2026</h1>
        <p className="lead">
          Pregled vseh sprememb davčnega kalkulatorja za leto 2026.
        </p>

        <div className="alert alert-success not-prose mb-4" role="alert">
          <NewsIcon className="w-6 h-6" />
          <div>
            <strong>Projekt je odprtokoden</strong>
            <br />
            <span className="text-sm">
              Izvorna koda kalkulatorja je javno dostopna na{" "}
              <a
                href="https://github.com/meznaric/obdavcen.si"
                className="link"
                target="_blank"
                rel="noopener noreferrer"
              >
                github.com/meznaric/obdavcen.si
              </a>{" "}
              pod licenco AGPL-3.0. Če opaziš napako v izračunu ali besedilu, si
              vabljen, da prijaviš težavo (issue) ali oddaš predlog sprememb
              (pull request).
            </span>
          </div>
        </div>

        <h2>Nove oblike v kalkulatorju</h2>

        <Feature title="Zaposlitev pri tujem delodajalcu">
          Prihodki so letna bruto plača. Ker tuji delodajalec v Sloveniji ne
          obračunava plač, sam plačaš prispevke delavca in delodajalca (skupaj
          40,20 %) ter OZP, dohodnino pa po odločbi FURS. Prikazana je tudi v
          grafu.
        </Feature>

        <Feature title="Podjemna ali avtorska pogodba">
          Pogodba s tujim naročnikom kot edini dohodek: 10 % normiranih
          stroškov, vse prispevke (od 90 % dohodka) plačaš sam, poleg tega pa
          še zdravstveno zavarovanje samoplačnika (37,79 € na mesec),
          prispevek za dolgotrajno oskrbo samoplačnika (6,34 € na mesec) in
          OZP. Dohodek se obdavči z letno dohodnino. Prikazana je tudi v grafu.
          Popravek: prej je kalkulator za samoplačnika uporabljal napačno
          kategorijo zavarovanja in zato prikazoval previsoke prispevke.
        </Feature>

        <h3>Ob redni zaposlitvi</h3>
        <p>
          Ko pri vprašanju{" "}
          <Link to="/#zaposlitev">»Že imaš redno zaposlitev?«</Link> izbereš
          »Da« in vneseš letno bruto plačo iz zaposlitve, se prikaže primerjava
          oblik, ki jih lahko imaš ob zaposlitvi. Primerjava upošteva samo
          dodatne davke in prispevke ob plači, zato te oblike niso vključene v
          graf.{" "}
          <Link to="/izplacilo/popoldanski-sp">Več o popoldanskem s.&nbsp;p.</Link>
        </p>

        <Feature title="Popoldanski s.&nbsp;p.">
          s.&nbsp;p. kot postranski poklic ob zaposlitvi za polni delovni čas. Plačaš
          le pavšalne prispevke (leta 2026 okoli 1.347 € na leto), dobiček pa se
          prišteje plači in obdavči po tvoji mejni dohodninski stopnji.
        </Feature>

        <Feature title="Normirani popoldanski s.&nbsp;p.">
          Normirani odhodki 80 % do 12.500 €, 40 % do 30.000 € in 0 % nad tem.
          Dokončen davek 20 % do 33.000 € davčne osnove in 35 % nad tem; plača
          nanj ne vpliva. Meja: povprečje prihodkov zadnjih dveh let do 50.000 €.
          Zakon ZIURS bi to spremenil (glej spodaj).
        </Feature>

        <Feature title="D.&nbsp;o.&nbsp;o. ob zaposlitvi">
          Ker si zavarovan prek zaposlitve, ti d.&nbsp;o.&nbsp;o. ne izplačuje plače in ne
          plačuje prispevkov. Dobiček se obdavči z 22 % DDPO, izplačilo pa s
          25 % davka od dividend – skupaj 41,5 %, ne glede na višino plače.
        </Feature>

        <h2>Nove funkcije kalkulatorja</h2>

        <blockquote>
          Večina novih funkcij je na voljo v razdelku »Več nastavitev« v kalkulatorju.
        </blockquote>


        <h3>D.&nbsp;o.&nbsp;o. – razširjene možnosti</h3>

        <Feature title="Status lastnika">
          Privzeto si v svoji d.&nbsp;o.&nbsp;o. zaposlen: prispevke plačaš najmanj od
          60 % povprečne plače, prejmeš pa lahko tudi regres, zimski regres in
          nagrado za poslovno uspešnost. Izbereš lahko tudi status poslovodje
          brez pogodbe o zaposlitvi (16. člen ZPIZ-2): osnova za prispevke je
          najmanj 90 % in največ 3,5-kratnik povprečne plače, prispevka za
          zavarovanje za primer brezposelnosti pa ne plačaš. Regresa, zimskega
          regresa in nagrade za poslovno uspešnost poslovodja ne more prejeti.
        </Feature>

        <Feature title="Malica">
          Povračilo stroškov prehrane med delom (7,96 €/dan). Neobdavčeno do
          zakonske meje – zmanjša stroške plače za podjetje.
        </Feature>

        <Feature title="Regres za letni dopust">
          Obvezno letno izplačilo za zaposlene – neobdavčeno do 100 % povprečne
          plače (2.536,03 €). Vključeno v izračun skupnih stroškov. Poslovodja
          brez pogodbe o zaposlitvi do regresa ni upravičen.
        </Feature>

        <Feature title="Prevozni stroški">
          Povračilo stroškov prevoza na delo – neobdavčeno do 0,21 € na
          kilometer, vsak mesec pa najmanj do 140 €. Mesečni znesek lahko
          prilagodiš dejanski razdalji.
        </Feature>

        <Feature title="Božičnica / zimski regres">
          Le za zaposlene. Pol minimalne plače (740,94 €) – brez dohodnine in
          prispevkov. Od leta 2026 ima z nagrado za poslovno uspešnost skupno
          mejo, do katere je neobdavčena.
        </Feature>

        <Feature title="Nagrada za poslovno uspešnost">
          Le za zaposlene. Neobdavčena do 100 % povprečne plače, zmanjšane za
          božičnico. Prispevki se obračunajo. Znesek lahko nastaviš sam.
        </Feature>

        <h3>S.&nbsp;p. – nove nastavitve</h3>

        <Feature title="Status zavarovanca">
          S.&nbsp;p. je zavarovan po 15. členu ZPIZ-2: zavarovalna osnova je 75 %
          dobička, vendar najmanj 60 % in največ 3,5-kratnik povprečne plače.
        </Feature>

        <Feature title="Znižani prispevki za nove s.&nbsp;p.">
          Prvo leto: 50-odstotno znižanje prispevkov za PIZ. Drugo leto:
          30-odstotno znižanje. Velja za tiste, ki se samozaposlijo prvič.
        </Feature>

        <h3>Olajšave – nove možnosti</h3>

        <Feature title="Vzdrževani otroci">
          Posebna olajšava za vzdrževane otroke – od 2.995,83 € za prvega do
          9.782,51 € za petega otroka. Zmanjša davčno osnovo za dohodnino.
        </Feature>

        <Feature title="Vzdrževani zakonec/partner">
          Olajšava 2.995,83 € na leto za vzdrževanega zakonca ali partnerja, ki ni
          zaposlen, ne opravlja dejavnosti in ima lastne dohodke nižje od
          zneska olajšave.
        </Feature>

        <Feature title="Dodatno pokojninsko zavarovanje (PDPZ)">
          Prostovoljno dodatno pokojninsko zavarovanje – pri s.&nbsp;p. zmanjša davčno
          osnovo, pri d.&nbsp;o.&nbsp;o. je strošek podjetja. Največ 24 % obveznih
          prispevkov za PIZ in ne več kot 3.224,18 € na leto.
        </Feature>

        <hr />

        <div className="text-center not-prose">
          <Link to="/" className="btn btn-lg">
            Odpri kalkulator
          </Link>
        </div>

        <h2>Posodobljene davčne vrednosti</h2>

        <h3>Normirani s.&nbsp;p. – velika sprememba</h3>
        <div
          className="alert alert-warning not-prose mb-4"
          role="alert"
        >
          <AlertCircleIcon className="w-6 h-6" />
          <div>
            <strong>Progresivna obdavčitev za normirance</strong>
            <br />
            <span className="text-sm">
              Od leta 2026 velja progresivna lestvica: 20 % do 72.000 € davčne osnove (oziroma 120.000 € prihodkov),
              35 % nad tem zneskom. Limit prihodkov se dvigne na 120.000 € (povprečje zadnjih dveh let).
            </span>
          </div>
        </div>

        <table>
          <thead>
            <tr>
              <th></th>
              <th>2025</th>
              <th>2026</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Davčna stopnja</td>
              <td>Enotna 20 %</td>
              <td>20 % do 72.000 €, 35 % nad tem</td>
            </tr>
            <tr>
              <td>Limit prihodkov</td>
              <td>60.000 € (prihodki preteklega leta)</td>
              <td>120.000 € (povprečje zadnjih dveh let)</td>
            </tr>
          </tbody>
        </table>

        <div
          className="alert alert-warning not-prose mb-4"
          role="alert"
        >
          <AlertCircleIcon className="w-6 h-6" />
          <div>
            <strong>Zakon ZIURS še ni upoštevan</strong>
            <br />
            <span className="text-sm">
              Zakon ZIURS, o katerem bo 6. 12. 2026 potekal zakonodajni referendum, bi za
              leto 2026 normirancem spremenil normirane odhodke (80 %, 70 % in
              40 % po prihodkovnih razredih) in odpravil 35-odstotni razred.
              Kalkulator upošteva veljavni zakon (ZPZR); če bo ZIURS potrjen, bomo
              izračune posodobili.{" "}
              <a
                href="https://www.gov.si/novice/2026-10-16-ugotavljanje-davcne-osnove-z-normiranimi-odhodki-v-letu-2026-v-povezavi-z-interventnim-zakonom-ziurs/"
                className="link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Več na gov.si
              </a>
            </span>
          </div>
        </div>

        <h3>Dohodninska lestvica</h3>
        <p>Razredi so se uskladili z inflacijo:</p>
        <table>
          <thead>
            <tr>
              <th>Stopnja</th>
              <th>2025</th>
              <th>2026</th>
            </tr>
          </thead>
          <tbody>
            {incomeTaxBrackets2026.map((razred, i) => (
              <tr key={razred.percentage}>
                <td>{Math.round(razred.percentage * 100)} %</td>
                <td>{opisRazreda(incomeTaxBrackets2025, i)}</td>
                <td>{opisRazreda(incomeTaxBrackets2026, i)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <h3>Druge davčne vrednosti</h3>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>2025</th>
              <th>2026</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Splošna olajšava</td>
              <td>5.260,00 €</td>
              <td>5.551,93 €</td>
            </tr>
            <tr>
              <td>Povprečna plača (osnova za prispevke)</td>
              <td>2.394,92 € (januarja 2.220,95 €)</td>
              <td>2.536,03 € (januarja 2.394,92 €)</td>
            </tr>
            <tr>
              <td>Minimalna plača</td>
              <td>1.277,72 €</td>
              <td>1.481,88 €</td>
            </tr>
            <tr>
              <td>OZP (mesečno)</td>
              <td>35,00 €, od 1. 3. 37,17 €</td>
              <td>37,17 €, od 1. 3. 39,36 €</td>
            </tr>
            <tr>
              <td>Najvišja olajšava za PDPZ</td>
              <td>3.054,65 €</td>
              <td>3.224,18 €</td>
            </tr>
          </tbody>
        </table>

        <h3>Prispevek za dolgotrajno oskrbo</h3>
        <div
          className="alert alert-info not-prose mb-4"
          role="alert"
        >
          <NewsIcon className="w-6 h-6" />
          <div>
            <strong>Nov prispevek od 1. 7. 2025</strong>
            <br />
            <span className="text-sm">
              Prispevek za dolgotrajno oskrbo – 1 % zavarovanec + 1 % delodajalec.
              Za s.&nbsp;p. skupaj 2 %. V letu 2026 velja celo leto.
            </span>
          </div>
        </div>

        <h3>Božičnica in nagrada</h3>
        <table>
          <thead>
            <tr>
              <th></th>
              <th>2025</th>
              <th>2026</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Božičnica – prispevki</td>
              <td>Brez prispevkov do ½ minimalne plače</td>
              <td>Brez prispevkov do ½ minimalne plače</td>
            </tr>
            <tr>
              <td>Nagrada za posl. uspešnost</td>
              <td>Ločena meja od božičnice</td>
              <td>Skupna meja z božičnico</td>
            </tr>
          </tbody>
        </table>

        <hr />
      </article>

      <Footer />
    </div>
  );
}

// »do 9.721 €« oziroma »nad 82.346 €« za zadnji razred
function opisRazreda(
  razredi: { percentage: number; maxNumber?: number }[],
  i: number
) {
  const meja = razredi[i]?.maxNumber;
  if (meja !== undefined) return `do ${formatCurrency(meja, true)}`;
  const prejsnja = razredi[i - 1]?.maxNumber ?? 0;
  return `nad ${formatCurrency(prejsnja, true)}`;
}

function Feature({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex gap-3 not-prose my-3">
      <CheckmarkCircle01Icon className="size-5 text-success shrink-0 mt-0.5" />
      <div>
        <p className="font-semibold text-sm">{title}</p>
        <p className="text-sm text-muted">{children}</p>
      </div>
    </div>
  );
}
