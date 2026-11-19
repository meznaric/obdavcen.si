import { useSelector } from "@xstate/store-react";
import { useCallback, useMemo, useState } from "react";
import { getPrivzeteNastavitve } from "~/constants";
import type { SharedInputs, YearSettings } from "~/constants/types";
import { store } from "~/utils/store";

// Zunaj hooka, da ostane ista referenca med renderji – sicer bi bile
// nastavitve ob vsakem renderju (npr. vnosu prihodkov) označene kot spremenjene.
// Privzeto je lastnik d. o. o. v svoji družbi zaposlen (najnižja osnova 60 %
// povprečne plače), zato so mu na voljo regres, božičnica in nagrada.
const defaultCurrentSettings: YearSettings = getPrivzeteNastavitve(2026);

// Regres, božičnica in nagrada so pravice delavcev. Poslovodja brez pogodbe
// o zaposlitvi (16. člen ZPIZ-2) jih nima, ne glede na izbiro v nastavitvah.
// Izbira se ohrani, da se vrne, ko poslovodja spet postane zaposlen.
function getVeljavneNastavitve(settings: YearSettings): YearSettings {
  if (settings.dooDruzbenikPoslovodja !== true) return settings;
  return {
    ...settings,
    regres: false,
    bozicnica: false,
    nagradaPoslovnaUspesnost: false,
  };
}

export function useSharedInputs() {
  const [izbraneNastavitve, setIzbraneNastavitve] = useState<YearSettings>(
    defaultCurrentSettings
  );
  const currentSettings = useMemo(
    () => getVeljavneNastavitve(izbraneNastavitve),
    [izbraneNastavitve]
  );

  const updateCurrentSettings = useCallback(
    (sprememba: Partial<YearSettings>) => {
      setIzbraneNastavitve((prej) => ({ ...prej, ...sprememba }));
    },
    []
  );

  const sharedInputs = useSelector(store, (state) => state.context);

  const updateSharedInputs = useCallback(
    (newSharedInputs: Partial<SharedInputs> & { imaZaposlitev?: boolean }) => {
      store.send({ type: "updateInputs", ...newSharedInputs });
    },
    []
  );

  return {
    sharedInputs,
    updateSharedInputs,
    currentSettings,
    // Nastavitve, kot jih je izbral uporabnik (za stikala v nastavitvah)
    izbraneNastavitve,
    updateCurrentSettings,
    haveSettingsChanged: izbraneNastavitve !== defaultCurrentSettings,
  };
}

export type UpdateSharedInputs = ReturnType<
  typeof useSharedInputs
>["updateSharedInputs"];
export type UpdateCurrentSettings = ReturnType<
  typeof useSharedInputs
>["updateCurrentSettings"];
