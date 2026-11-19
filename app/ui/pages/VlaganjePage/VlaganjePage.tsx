import type { ReactNode } from "react";
import {
  BankIcon,
  Calendar03Icon,
  ChartDecreaseIcon,
  Clock01Icon,
  Coins01Icon,
} from "hugeicons-react";
import {
  dividendeStopnja,
  inr,
  normiraniStroskiDelez,
  obrestiDepozitiOprostitev,
  obrestiStopnja,
  rokNapovedi,
  vlaganjeLeto,
  vlaganjePreverjeno,
  zdaDividendeKonvencija,
} from "~/constants/2026/vlaganje";
import { Card } from "~/ui/common/Card/Card";
import ExpandedNav from "~/ui/common/ExpandedNav/ExpandedNav";
import Footer from "~/ui/common/Footer/Footer";
import { Text } from "~/ui/common/Text/Text";
import WhatsNext from "~/ui/pages/IndexPage/WhatsNext";
import { faq } from "./Faq/faq";
import { FaqSeznam, SeznamVirov } from "./Faq/FaqSeznam";
import { viri } from "./Faq/viri";
import { zmote } from "./Faq/zmote";
import { ZmoteSeznam } from "./Faq/ZmoteSeznam";
import { evri, odstotek } from "./format";
import { Planer } from "./Planer/Planer";
import {
  lestvicaPuscice,
  lestvicaStavek,
  oprostitevPoLetih,
  pragoviBesedilo,
} from "./stopnje";

export function VlaganjePage() {
  return (
    <div className="p-4 gap-4 flex flex-col">
      <ChartDecreaseIcon className="size-12 text-error mx-auto" />
      <ExpandedNav />
      <main className="container max-w-6xl mx-auto space-y-16 mt-8">
        <Uvod />
        <Planer />
        <NaKratko />
        <FaqSeznam vnosi={faq} />
        <ZmoteSeznam zmote={zmote} />
        <VsiViri />
      </main>
      <WhatsNext />
      <Footer />
    </div>
  );
}

const izbire = [
  {
    naslov: "Šele začenjam",
    besedilo:
      "INR ali navadni borzni račun? Izračunaj, kje ti po plačilu davkov ostane več, in preveri, kaj moraš urediti ob odprtju računa.",
    href: "#kalkulator",
  },
  {
    naslov: "Prodajam",
    besedilo:
      "Koliko davka plačaš, kdaj se splača počakati in kako oddaš Doh-KDVP.",
    href: "#prodaja",
  },
  {
    naslov: "Dividende in obresti",
    besedilo:
      "Kako so obdavčene, čemu služi W-8BEN in kdaj oddaš Doh-Div in Doh-Obr.",
    href: "#dividende-obresti",
  },
];

function Uvod() {
  return (
    <header className="space-y-6 max-w-3xl mx-auto">
      <Text variant="h1" className="text-center">
        Davek na delnice in ETF v Sloveniji ({vlaganjeLeto})
      </Text>
      <Text variant="bodyLarge" className="text-center">
        Ko prodaš delnice ali ETF, plačaš davek od dobička: {lestvicaStavek}.
        Dividende in obresti so obdavčene po stopnji {odstotek(dividendeStopnja)}. Na
        individualnem naložbenem računu (INR) med varčevanjem ni davka, ob
        izplačilu plačaš {odstotek(inr.stopnja)} od donosa, po{" "}
        {inr.oprostitevPoLetih} letih nič.
      </Text>
      <nav aria-labelledby="kaj-te-zanima" className="space-y-3">
        <h2 id="kaj-te-zanima" className="text-lg font-semibold">
          Kaj te zanima?
        </h2>
        <ul className="grid gap-3 sm:grid-cols-3">
          {izbire.map((izbira) => (
            <li key={izbira.href} className="flex">
              <a
                href={izbira.href}
                className="card bg-base-200 hover:bg-base-300 p-4 gap-1 w-full"
              >
                <span className="font-semibold">{izbira.naslov}</span>
                <span className="text-sm">{izbira.besedilo}</span>
              </a>
            </li>
          ))}
        </ul>
      </nav>
      <Text variant="caption" as="p" className="text-center">
        Velja za fizične osebe, davčne rezidente Slovenije. Preverjeno{" "}
        {vlaganjePreverjeno}. Stran je informativne narave in ni davčni nasvet.
      </Text>
    </header>
  );
}

function NaKratko() {
  const ns = odstotek(normiraniStroskiDelez);
  return (
    <section aria-labelledby="na-kratko">
      <h2 id="na-kratko" className="text-2xl font-semibold tracking-tight mb-4">
        Na kratko
      </h2>
      <div className="grid gap-4 sm:grid-cols-2">
        <Dejstvo
          ikona={<Clock01Icon className="size-6 text-error" />}
          naslov={`Prodaja: ${lestvicaPuscice}`}
        >
          Stopnja se zniža po dopolnjenih {pragoviBesedilo} letih imetništva, za
          vsak nakup posebej. Od dobička se odštejejo normirani stroški: {ns}{" "}
          nabavne in {ns} prodajne vrednosti.
        </Dejstvo>
        <Dejstvo
          ikona={<Coins01Icon className="size-6 text-amber-700 dark:text-amber-400" />}
          naslov={`Dividende: ${odstotek(dividendeStopnja)} ob vsakem izplačilu`}
        >
          Velja ne glede na to, kako dolgo imaš vrednostni papir. Pri ameriških delnicah z obrazcem
          W-8BEN v ZDA plačaš {odstotek(zdaDividendeKonvencija)}, v Sloveniji
          doplačaš razliko.
        </Dejstvo>
        <Dejstvo
          ikona={<BankIcon className="size-6 text-info" />}
          naslov={`Obresti: ${odstotek(obrestiStopnja)}`}
        >
          Obresti na depozite pri bankah iz Slovenije ali EU so oproščene do{" "}
          {evri(obrestiDepozitiOprostitev)} na leto. Obresti pri
          posrednikih, ki niso banke (npr. IBKR), so obdavčene od prvega evra.
        </Dejstvo>
        <Dejstvo
          ikona={<Calendar03Icon className="size-6 text-indigo-500" />}
          naslov={`Napoved: do ${rokNapovedi}`}
        >
          Za preteklo leto oddaš Doh-KDVP za prodaje, Doh-Div za dividende in
          Doh-Obr za obresti, tudi če si bil v izgubi. Tuji posredniki tega ne
          storijo namesto tebe. Prodaj po {oprostitevPoLetih} letih imetništva ne
          napoveš.
        </Dejstvo>
      </div>
    </section>
  );
}

function Dejstvo({
  ikona,
  naslov,
  children,
}: {
  ikona: ReactNode;
  naslov: string;
  children: ReactNode;
}) {
  return (
    <Card className="card-body gap-2 p-5">
      <p className="flex items-center gap-3 font-semibold">
        {ikona}
        {naslov}
      </p>
      <p className="text-sm opacity-80">{children}</p>
    </Card>
  );
}

function VsiViri() {
  // Več vnosov (npr. členi ZDoh-2) vodi na isti URL; vsak URL pokažemo enkrat,
  // s prvim naslovom (splošnim, npr. »Zakon o dohodnini (ZDoh-2) – PISRS«).
  const vsi = Object.values(viri).filter(
    (v, i, seznam) => seznam.findIndex((w) => w.url === v.url) === i
  );
  return (
    <section id="viri" className="space-y-2">
      <Text variant="h2" as="h2" className="text-2xl">
        Viri
      </Text>
      <Text variant="bodySmall" className="opacity-80">
        Podatke smo nazadnje preverili {vlaganjePreverjeno} v uradnih virih: pri
        FURS, Ministrstvu za finance in ATVP ter v besedilih zakonov v registru
        PISRS.
      </Text>
      <Text variant="bodySmall" className="opacity-80">
        Stran je informativne narave in ni davčni nasvet. Pravila se spreminjajo in
        tvoj primer je lahko drugačen. Za zavezujoč odgovor se obrni na FURS ali
        davčnega svetovalca.
      </Text>
      <SeznamVirov viri={vsi} naslov={null} />
    </section>
  );
}
