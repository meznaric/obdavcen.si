import { IncomeTaxBrackets } from "../types";

// FURS, Lestvica za odmero dohodnine za leto 2026
// https://www.fu.gov.si/fileadmin/Internet/Davki_in_druge_dajatve/Podrocja/Dohodnina/Letna_odmera_dohodnine/Opis/Lestvica_za_leto_2026.docx
export const incomeTaxBrackets: IncomeTaxBrackets = [
  {
    percentage: 0.16,
    maxNumber: 9721.43,
  },
  {
    percentage: 0.26,
    maxNumber: 28592.44,
  },
  {
    percentage: 0.33,
    maxNumber: 57184.88,
  },
  {
    percentage: 0.39,
    maxNumber: 82346.23,
  },
  {
    percentage: 0.5,
  },
];
