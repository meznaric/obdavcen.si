import { useState } from "react";
import { Text } from "~/ui/common/Text/Text";
import { Assumptions } from "./Assumptions";
import { GeneralSettings } from "./GeneralSettings";
import { useSharedInputs } from "./useSharedInputs";
import { NormiraniSP } from "./NormiraniSP";
import { SP } from "./SP";
import { DOONajvecjaPlaca } from "./DOONajvecjaPlaca";
import { DOOMinimalnaPlaca } from "./DOOMinimalnaPlaca";
import OptionHolder from "./OptionHolder";
import { Alert01Icon, ChartDecreaseIcon } from "hugeicons-react";
import { ToggleOption } from "~/ui/common/ToggleOption/ToggleOption";
import GraphArea from "./GraphArea";
import { DOOPoljubnaPlaca } from "./DOOPoljubnaPlaca";
import Learnings from "./Learnings";
import WhatsNext from "./WhatsNext";
import Footer from "~/ui/common/Footer/Footer";
import ExpandedNav from "~/ui/common/ExpandedNav/ExpandedNav";
import { AnimatePresence, motion } from "framer-motion";

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
      <div className="p-4 gap-4 flex flex-col">
        <ChartDecreaseIcon className="size-12 text-red-500 mx-auto" />
        <ExpandedNav />
      </div>
      <div className="px-8 flex items-center justify-center">
        <div className="alert max-w-full bg-gray-900 w-auto">
          <Alert01Icon className="w-6 h-6 text-yellow-500" />
          <span className="text-yellow-500">
            To je začetna različica, ki lahko vsebuje napake ali netočnosti,
            zato priporočamo previdnost pri uporabi informacij.
          </span>
        </div>
      </div>
      <div className="container mx-auto p-4 space-y-4">
        <div className="text-center my-16 space-y-8">
          <Text variant="h1">Izračun davkov za leto 2026</Text>
          <Text>
            Delaš na daljavo za tuje podjetje in iščeš najbolj davčno efektiven
            način za tvoje prihodke?
          </Text>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-4">
          <Assumptions />
          <GeneralSettings
            currentSettings={currentSettings}
            updateCurrentSettings={updateCurrentSettings}
            haveSettingsChanged={haveSettingsChanged}
            updateSharedInputs={updateSharedInputs}
            sharedInputs={sharedInputs}
          />
        </div>
        <Text variant="h2" className="text-center pt-24 block" as="span">
          Kakšne so opcije?
        </Text>
        <Text className="text-center pb-16">
          Konec koncev nas zanima koliko davkov bomo{" "}
          <span className="text-red-500 font-bold">plačali</span> in koliko bo
          nam na koncu <span className="text-green-500 font-bold">ostalo</span>{" "}
          na računu
        </Text>
        <div className="grid grid-cols-1 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-4 mt-4">
          <OptionHolder>
            <NormiraniSP
              currentSettings={currentSettings}
              sharedInputs={sharedInputs}
            />
          </OptionHolder>
          <OptionHolder>
            <SP currentSettings={currentSettings} sharedInputs={sharedInputs} />
          </OptionHolder>
          <OptionHolder>
            <DOONajvecjaPlaca
              currentSettings={currentSettings}
              sharedInputs={sharedInputs}
            />
          </OptionHolder>
          <OptionHolder>
            <DOOMinimalnaPlaca
              currentSettings={currentSettings}
              sharedInputs={sharedInputs}
            />
          </OptionHolder>
          <OptionHolder>
            <DOOPoljubnaPlaca
              currentSettings={currentSettings}
              sharedInputs={sharedInputs}
              updateSharedInputs={updateSharedInputs}
            />
          </OptionHolder>
        </div>
        <div>
          <Text variant="h2" className="text-center pt-48 pb-4 block" as="span">
            Kaj se najbolj splača pri določenih prihodkih?
          </Text>
          <ToggleOption
            className="mx-auto"
            label="Pokaži samo najbolj efektivno davčno krivuljo"
            value={showOnlyBestRate}
            onValueChange={setShowOnlyBestRate}
          />
          <GraphArea
            showOnlyBestRate={showOnlyBestRate}
            currentRevenue={sharedInputs.revenue}
            sharedInputs={sharedInputs}
            currentSettings={currentSettings}
          />
        </div>
        <Learnings />
        <WhatsNext />
        <Footer />
        <AnimatePresence>
          {sharedInputs.revenue < 20000 && (
            <motion.div
              className="toast"
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
            >
              <div className="alert alert-warning whitespace-normal">
                Pri prihodkih pod 20.000€ letno kalkulator ni bil potestiran in
                ima večje možnosti za napake.
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </>
  );
}
