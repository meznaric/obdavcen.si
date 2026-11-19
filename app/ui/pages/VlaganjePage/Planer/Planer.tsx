import { Calculator01Icon, InformationCircleIcon } from "hugeicons-react";
import {
  dividendeStopnja,
  dobicekIzKapitalaStopnje,
  inr,
  normiraniStroskiDelez,
  vlaganjeLeto,
} from "~/constants/2026/vlaganje";
import { Card } from "~/ui/common/Card/Card";
import { Text } from "~/ui/common/Text/Text";
import { evri, odstotek } from "../format";
import { pragoviBesedilo } from "../stopnje";
import { GrafPoLetih } from "./GrafPoLetih";
import { PlanerRezultat } from "./PlanerRezultat";
import { PlanerVnos } from "./PlanerVnos";
import { usePlaner } from "./usePlaner";

const ns = odstotek(normiraniStroskiDelez);

export function Planer() {
  const planer = usePlaner();
  const { vnos, navaden, inr: rezultatInr, potek, posodobi } = planer;

  return (
    <section id="kalkulator" className="space-y-4 scroll-mt-4">
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-4">
        <Card className="card-body lg:col-span-2">
          <Text variant="h2" as="h2" className="text-2xl flex items-center gap-2">
            <Calculator01Icon className="size-7 text-accent" />
            Planer vlaganja
          </Text>
          {/* grow-0: daisyUI v card-body raztegne odstavke (flex-grow). */}
          <Text variant="bodySmall" className="grow-0">
            Vnesi, koliko boš vložil in kdaj boš denar potreboval. Planer izračuna,
            koliko ti po plačilu davkov ostane na navadnem borznem računu in koliko na INR.
          </Text>
          <PlanerVnos {...planer} />
          <Predpostavke />
        </Card>
        <Card className="card-body lg:col-span-3">
          <PlanerRezultat navaden={navaden} inr={rezultatInr} leta={vnos.leta} />
        </Card>
      </div>

      <Card className="card-body">
        <Text variant="h3" as="h3" className="text-xl">
          Koliko davka plačaš, če prodaš prej ali pozneje?
        </Text>
        <Text variant="bodySmall">
          Stolpci kažejo, kolikšen del donosa pojedo davki na navadnem računu, črta
          pa enako za INR. Pri enkratnem vložku se davek zniža po {pragoviBesedilo}{" "}
          letih, pri mesečnem vlaganju počasneje, ker so novejša vplačila še mlada.
          V prvih letih je davek pod {odstotek(dobicekIzKapitalaStopnje[0].stopnja)},
          ker normirani stroški zmanjšajo davčno osnovo. Klikni na stolpec, da
          izbereš leto.
        </Text>
        <GrafPoLetih
          potek={potek}
          izbranoLeto={vnos.leta}
          onIzberi={(leta) => posodobi({ leta })}
        />
      </Card>
    </section>
  );
}

function Predpostavke() {
  return (
    <details className="collapse collapse-arrow bg-base-200 text-sm">
      <summary className="collapse-title min-h-0 py-3 font-medium flex items-center gap-2">
        <InformationCircleIcon className="size-5 shrink-0" />
        Kaj planer predpostavlja
      </summary>
      <div className="collapse-content">
        <ul className="list-disc pl-5 space-y-1">
          <li>Enakomeren donos vsako leto (v resnici niha), vplačila na začetku meseca.</li>
          <li>
            Donos je razlika med tem, kar ti ostane pred davki, in tem, kar si
            vložil. Delež davkov je izračunan od tega donosa.
          </li>
          <li>
            Irski UCITS ETF: ob izplačilu dividende ni tujega davka, zato plačaš
            celih {odstotek(dividendeStopnja)}. Davek od dividend je plačan iz
            dividende, ostanek znova vložen kot nov nakup.
          </li>
          <li>
            Prodaš vse naenkrat. Vsak nakup ima svoje obdobje imetništva (FIFO).
            Upoštevani so normirani stroški {ns} + {ns}.
          </li>
          <li>Provizije posrednika in ponudnika INR niso upoštevane.</li>
          <li>
            INR odpreš ob prvem vplačilu, prvo leto načrta je koledarsko leto
            odprtja (limit {evri(inr.prvoLetoLimit)}), nato{" "}
            {evri(inr.letniLimit)} letno na osnovni podračun. Dodatnih{" "}
            {evri(inr.posebniPodracunLetniLimit)} letno za slovenske izdajatelje ni
            upoštevanih.
          </li>
          <li>
            Stopnje veljajo za leto {vlaganjeLeto} in se lahko do prodaje spremenijo.
          </li>
        </ul>
      </div>
    </details>
  );
}
