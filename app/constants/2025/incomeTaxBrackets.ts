import { IncomeTaxBrackets } from "../types";

// https://fu.gov.si/fileadmin/Internet/Davki_in_druge_dajatve/Podrocja/Dohodnina/Letna_odmera_dohodnine/Opis/Lestvica_za_leto_2025.docx
export const incomeTaxBrackets: IncomeTaxBrackets = [
  {
    percentage: 0.16,
    maxNumber: 9210.26,
  },
  {
    percentage: 0.26,
    maxNumber: 27089,
  },
  {
    percentage: 0.33,
    maxNumber: 54178,
  },
  {
    percentage: 0.39,
    maxNumber: 78016.32,
  },
  {
    percentage: 0.5,
  },
];
