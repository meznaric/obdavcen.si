import { useState } from "react";
import {
  AlertDiamondIcon,
  ChartDecreaseIcon,
} from "hugeicons-react";
import { Text } from "~/ui/common/Text/Text";
import { ToggleOption } from "~/ui/common/ToggleOption/ToggleOption";
import Footer from "~/ui/common/Footer/Footer";
import ExpandedNav from "~/ui/common/ExpandedNav/ExpandedNav";
import { allTaxModes } from "~/utils/taxModes";
import { Assumptions } from "./Assumptions";
import { GeneralSettings } from "./GeneralSettings";
import GraphArea from "./GraphArea";
import { Leaderboard } from "./Leaderboard/Leaderboard";
import WhatsNext from "./WhatsNext";
import { useSharedInputs } from "./useSharedInputs";

function Opomba({ children }: { children: React.ReactNode }) {
  return (
    <li className="flex items-start gap-4">
      <AlertDiamondIcon
        className="mt-0.5 size-5 shrink-0 text-accent"
        aria-hidden="true"
      />
      <Text variant="body">{children}</Text>
    </li>
  );
}

export function IndexPage() {
  const {
    updateSharedInputs,
    sharedInputs,
    currentSettings,
    updateCurrentSettings,
    haveSettingsChanged,
  } = useSharedInputs();
  const [showOnlyBestRate, setShowOnlyBestRate] = useState(true);

  return (
    <>
      <div className="flex flex-col gap-4 p-4">
        <ChartDecreaseIcon
          className="mx-auto size-12 text-error"
          aria-hidden="true"
        />
        <ExpandedNav />
      </div>
      {/*
        Razmik kot `space-y-4` v Tailwind CSS v3: zgornji rob vseh otrok razen
        prvega je 1rem in prevlada nad njihovimi `mt-*` razredi (npr. v nogi).
      */}
      <div className="container mx-auto max-w-5xl p-4 [&>:not([hidden])~:not([hidden])]:mt-4">
        <header className="mx-auto max-w-3xl space-y-2 pb-4 text-center sm:pb-6">
          <Text variant="h1">Normirani s.&nbsp;p., s.&nbsp;p. ali d.&nbsp;o.&nbsp;o.?</Text>
          <Text className="text-lg">
            Vnesi svoje letne prihodke in poglej, pri kateri obliki ti po
            plačilu davkov in prispevkov za leto 2026 ostane največ.
          </Text>
          <Text variant="caption" className="hidden sm:block">
            Namenjeno predvsem tistim, ki delajo na daljavo za tuje naročnike
            ali delodajalce.
          </Text>
        </header>

        <GeneralSettings
          currentSettings={currentSettings}
          updateCurrentSettings={updateCurrentSettings}
          haveSettingsChanged={haveSettingsChanged}
          updateSharedInputs={updateSharedInputs}
          sharedInputs={sharedInputs}
        />

        <div className="pt-4">
          <Leaderboard
            imaZaposlitev={sharedInputs.imaZaposlitev}
            modes={allTaxModes}
            sharedInputs={sharedInputs}
            currentSettings={currentSettings}
            updateSharedInputs={updateSharedInputs}
            updateCurrentSettings={updateCurrentSettings}
          />
        </div>

        <section aria-labelledby="graf" className="pt-16">
          <Text variant="h2" id="graf" className="block text-center">
            Pri katerih prihodkih se splača katera oblika?
          </Text>
          <Text variant="caption" className="mt-2 block text-center">
            Graf velja za primer, ko nimaš redne zaposlitve.
          </Text>
          <ToggleOption
            className="mx-auto mt-2"
            label="Pokaži samo najugodnejšo obliko"
            value={showOnlyBestRate}
            onValueChange={setShowOnlyBestRate}
          />
          <GraphArea
            showOnlyBestRate={showOnlyBestRate}
            currentRevenue={sharedInputs.revenue}
            sharedInputs={sharedInputs}
            currentSettings={currentSettings}
          />
        </section>

        <section aria-labelledby="kaj-upostevamo" className="space-y-4 pt-16">
          <Text variant="h2" id="kaj-upostevamo" className="block text-center">
            Kaj upoštevamo
          </Text>
          <Assumptions />
          <ul className="space-y-4 rounded-md bg-base-100 p-4 shadow-xl">
            <Opomba>
              To je začetna različica, ki lahko vsebuje napake ali netočnosti,
              zato priporočamo previdnost pri uporabi informacij.
            </Opomba>
            <Opomba>
              Pri prihodkih pod 20.000&nbsp;€ izračun predpostavlja, da si vse
              leto zavarovan oziroma zaposlen za polni delovni čas. Ne upošteva
              krajšega delovnega časa, začetka poslovanja med letom,
              zdravstvenega zavarovanja, ki ga plača občina, in znižanja
              najnižje osnove za prispevke s.&nbsp;p. po ZIURS, ki še ne velja.
            </Opomba>
            <Opomba>
              Stroški računovodstva niso všteti – vpiši jih med stroške (pri
              d.&nbsp;o.&nbsp;o. so običajno višji).
            </Opomba>
          </ul>
        </section>

        <WhatsNext />
        <Footer />
      </div>
    </>
  );
}
