import { SharedInputs, YearSettings } from "~/constants/types";
import { getDelez } from "./getDelez";

/**
 * D. o. o. ob zaposlitvi: lastnik je zaposlen za polni delovni čas drugje,
 * zato mu d. o. o. ne izplačuje plače. Ves dobiček se obdavči z DDPO in
 * izplača kot dividende (dokončen davek, ne vpliva na dohodnino od plače).
 */
export function getDOOObZaposlitviData(
  sharedInputs: SharedInputs,
  currentSettings: YearSettings
) {
  const dobicek = sharedInputs.revenue - sharedInputs.expenses;

  const dobicekTax = Math.max(0, dobicek) * currentSettings.ddpoTaxRate;
  const dobicekNet = dobicek - dobicekTax;

  const dividendsTax =
    Math.max(0, dobicekNet) * currentSettings.dividendsTaxRate;
  const dividendsNet = dobicekNet - dividendsTax;

  const totalTax = dobicekTax + dividendsTax;
  const effectiveTaxRate = getDelez(totalTax, sharedInputs.revenue);
  // Stroški so že odšteti v dobičku podjetja
  const cistiPrihodki = dividendsNet;
  const cistiPrihodkiRate = getDelez(cistiPrihodki, sharedInputs.revenue);
  const expenseRate = getDelez(sharedInputs.expenses, sharedInputs.revenue);

  return {
    cistiPrihodki,
    cistiPrihodkiRate,
    effectiveTaxRate,
    expenseRate,
    totalTax,
    dobicek,
    dobicekTax,
    dividendsTax,
    dividendsNet,
  };
}
