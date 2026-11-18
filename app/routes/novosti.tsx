import type { MetaFunction } from "@remix-run/node";
import { Link } from "@remix-run/react";
import {
  ArrowLeft02Icon,
  CheckmarkCircle01Icon,
  NewsIcon,
  AlertCircleIcon,
} from "hugeicons-react";
import Footer from "~/ui/common/Footer/Footer";

export const meta: MetaFunction = () => {
  return [
    {
      title: "Novosti 2026 | Obdavcen.si",
    },
    {
      name: "description",
      content:
        "Pregled vseh sprememb in novosti v davčnem kalkulatorju za leto 2026 — nove davčne stopnje, razširjen kalkulator in več možnosti optimizacije.",
    },
  ];
};

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

        <h2>Nove funkcionalnosti kalkulatorja</h2>

        <blockquote>
          Večina novih funkcionalnosti je na voljo pod &quot;Več nastavitev&quot; v kalkulatorju.
        </blockquote>


        <h3>D.O.O. — razširjene možnosti</h3>

        <Feature title="Malica">
          Povračilo stroškov prehrane med delom (7,96 €/dan). Neobdavčeno do
          zakonske meje — zmanjša stroške plače za podjetje.
        </Feature>

        <Feature title="Regres za letni dopust">
          Obvezno letno izplačilo — neobdavčen do 100% povprečne plače
          (2.394,92 €). Vključen v izračun skupnih stroškov.
        </Feature>

        <Feature title="Prevozni stroški">
          Povračilo stroškov prevoza na delo — neobdavčeno do 0,21 €/km.
          Nastavljiv mesečni znesek glede na dejansko razdaljo.
        </Feature>

        <Feature title="Božičnica / Zimski regres">
          Pol minimalne plače (740,94 €) — brez dohodnine. V 2026 se prispevki
          obračunajo (v 2025 bila popolnoma neobdavčena).
        </Feature>

        <Feature title="Nagrada za poslovno uspešnost">
          Neobdavčena do 100% povprečne plače (minus božičnica). Prispevki se
          obračunajo. Nastavljiv znesek.
        </Feature>

        <h3>S.P. — nove nastavitve</h3>

        <Feature title="Zavarovanec status">
          Izbira med členom 15 (samozaposlen), 16 (družbenik) in 17 (kmet).
          Vpliva na minimalno zavarovalno osnovo in množitelj za prispevke.
        </Feature>

        <Feature title="Znižani prispevki za nove S.P.">
          Prvo leto: 50% znižanje PIZ prispevkov. Drugo leto: 30% znižanje.
          Velja za novo registrirane s.p.
        </Feature>

        <h3>Olajšave — nove možnosti</h3>

        <Feature title="Vzdrževani otroci">
          Posebna olajšava za vzdrževane otroke — od 2.995,83 € za prvega do
          9.782,51 € za petega otroka. Zmanjša davčno osnovo za dohodnino.
        </Feature>

        <Feature title="Vzdrževan zakonec/partner">
          Olajšava 2.995,83 €/leto za vzdrževanega družinskega člana brez
          lastnih dohodkov.
        </Feature>

        <Feature title="Dodatno pokojninsko zavarovanje (PDPZ)">
          Prostovoljno dodatno pokojninsko zavarovanje — za S.P. zmanjša davčno
          osnovo, za D.O.O. je strošek podjetja. Največ 3.224,18 €/leto.
        </Feature>

        <hr />

        <div className="text-center not-prose">
          <Link to="/" className="btn btn-lg">
            Odpri kalkulator
          </Link>
        </div>

        <h2>Posodobljene davčne vrednosti</h2>

        <h3>Normirani S.P. — velika sprememba</h3>
        <div
          className="alert alert-warning not-prose mb-4"
          role="alert"
        >
          <AlertCircleIcon className="w-6 h-6" />
          <div>
            <strong>Progresivna obdavčitev za normirance</strong>
            <br />
            <span className="text-sm">
              Od 2026 velja progresivna lestvica: 20% do 72.000 € dobicka (oz. 120.000 EUR prihodkov),
              35% nad tem zneskom. Limit prihodkov se dvigne na 120.000 €.
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
              <td>Enotna 20%</td>
              <td>20% do 72k, 35% nad 72k</td>
            </tr>
            <tr>
              <td>Limit prihodkov</td>
              <td>60.000 €</td>
              <td>120.000 €</td>
            </tr>
          </tbody>
        </table>

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
            <tr>
              <td>16%</td>
              <td>do 9.210 €</td>
              <td>do 9.721 €</td>
            </tr>
            <tr>
              <td>26%</td>
              <td>do 27.089 €</td>
              <td>do 28.592 €</td>
            </tr>
            <tr>
              <td>33%</td>
              <td>do 54.178 €</td>
              <td>do 57.185 €</td>
            </tr>
            <tr>
              <td>39%</td>
              <td>do 78.016 €</td>
              <td>do 82.346 €</td>
            </tr>
            <tr>
              <td>50%</td>
              <td>nad 78.016 €</td>
              <td>nad 82.346 €</td>
            </tr>
          </tbody>
        </table>

        <h3>Ostale davčne vrednosti</h3>
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
              <td>Povprečna plača</td>
              <td>2.220,95 €</td>
              <td>2.394,92 €</td>
            </tr>
            <tr>
              <td>Minimalna plača</td>
              <td>1.297,79 €</td>
              <td>1.481,88 €</td>
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
            <strong>Nov prispevek od 2026</strong>
            <br />
            <span className="text-sm">
              Prispevek za dolgotrajno oskrbo — 1% zavarovanec + 1% delodajalec.
              Za S.P. skupaj 2%.
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
              <td>Božičnica — prispevki</td>
              <td>Popolnoma neobdavčena</td>
              <td>Prispevki se obračunajo</td>
            </tr>
            <tr>
              <td>Nagrada za posl. uspešnost</td>
              <td>Ločen limit od božičnice</td>
              <td>Skupen limit z božičnico</td>
            </tr>
          </tbody>
        </table>

        <hr />
      </article>

      <Footer />
    </div>
  );
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
      <CheckmarkCircle01Icon className="size-5 text-green-500 shrink-0 mt-0.5" />
      <div>
        <p className="font-semibold text-sm">{title}</p>
        <p className="text-sm opacity-70">{children}</p>
      </div>
    </div>
  );
}
