import { useSelector } from "@xstate/store/react";
import { useCallback, useState } from "react";
import { settingsByYear } from "~/constants";
import type { SharedInputs, YearSettings } from "~/constants/types";
import { store } from "~/utils/store";

export function useSharedInputs() {
  const defaultCurrentSettings: YearSettings = {
    ...settingsByYear[2026],
    spZavarovanecClen: 15,
    dooDruzbenikPoslovodja: true,
    malica: true,
    prevozniStroski: false,
    regres: true,
    bozicnica: true,
    nagradaPoslovnaUspesnost: true,
    steviloOtrok: 0,
    vzdrzevaniDrugiClani: false,
    pdpz: false,
    pdpzZnesek: 2400,
  };
  const [currentSettings, updateCurrentSettings] = useState<YearSettings>(
    defaultCurrentSettings
  );

  const sharedInputs = useSelector(store, (state) => state.context);

  const updateSharedInputs = useCallback(
    (newSharedInputs: Partial<SharedInputs>) => {
      store.send({ type: "updateInputs", ...newSharedInputs });
    },
    []
  );

  return {
    sharedInputs,
    updateSharedInputs,
    currentSettings,
    updateCurrentSettings,
    haveSettingsChanged: currentSettings !== defaultCurrentSettings,
  };
}
