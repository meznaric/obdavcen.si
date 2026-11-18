import { IncomeTaxBrackets } from "../types";

// https://www.zvezarfr.si/pripomocki/uporabni-podatki/a-lestvica-za-odmero-dohodnine
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
