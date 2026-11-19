import * as year2025 from "./2025";
import * as year2026 from "./2026";
import type { YearSettings } from "./types";

export const settingsByYear = {
  [year2025.year]: year2025,
  [year2026.year]: year2026,
};

// Privzete uporabniške nastavitve kalkulatorja in člankov. Lastnik d. o. o. je
// privzeto zaposlen v svoji družbi (14. člen ZPIZ-2), zato so regres, zimski
// regres in nagrada za poslovno uspešnost lahko neobdavčeni.
export const privzeteNastavitve: Partial<YearSettings> = {
  spZavarovanecClen: 15,
  dooDruzbenikPoslovodja: false,
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

export function getPrivzeteNastavitve(year: keyof typeof settingsByYear) {
  return { ...settingsByYear[year], ...privzeteNastavitve } as YearSettings;
}
