import { useMemo, useState } from "react";
import {
  izracunInr,
  izracunNavadnegaRacuna,
  potekPoLetih,
  type VlaganjeVnos,
} from "~/utils/vlaganje";
import { nastavitve2026 } from "../nastavitve";

export type TipEtf = "akumulacijski" | "distribucijski";

type OsnovniVnos = Omit<VlaganjeVnos, "dividendniDonos">;

export const NAJVEC_LET = 30;
// Najvišji dividendni donos na drsniku (v deležu).
export const NAJVEC_DIVIDEND = 0.05;

const privzetiVnos: OsnovniVnos = {
  enkratniVlozek: 10000,
  mesecniVlozek: 300,
  letniDonos: 0.07,
  leta: 10,
};

export function usePlaner() {
  const [vnos, setVnos] = useState<OsnovniVnos>(privzetiVnos);
  const [tipEtf, setTipEtf] = useState<TipEtf>("akumulacijski");
  const [izbraneDividende, setDividendniDonos] = useState(0.02);
  // Dividende so del skupnega donosa, zato ne morejo biti višje od njega.
  const dividendniDonos = Math.min(izbraneDividende, vnos.letniDonos);

  const izracunVnos = useMemo<VlaganjeVnos>(
    () => ({
      ...vnos,
      dividendniDonos: tipEtf === "distribucijski" ? dividendniDonos : 0,
    }),
    [vnos, tipEtf, dividendniDonos]
  );

  const navaden = useMemo(
    () => izracunNavadnegaRacuna(izracunVnos, nastavitve2026),
    [izracunVnos]
  );
  const inr = useMemo(() => izracunInr(izracunVnos, nastavitve2026), [izracunVnos]);
  const potek = useMemo(
    () => potekPoLetih(izracunVnos, nastavitve2026, NAJVEC_LET),
    [izracunVnos]
  );

  const posodobi = (sprememba: Partial<OsnovniVnos>) =>
    setVnos((prej) => ({ ...prej, ...sprememba }));

  return {
    vnos,
    posodobi,
    tipEtf,
    setTipEtf,
    dividendniDonos,
    setDividendniDonos,
    navaden,
    inr,
    potek,
  };
}
