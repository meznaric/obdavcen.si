export type AnalyzableData = {
  effectiveTaxRate: number;
  expenseRate: number;
  // Ostane ti: prihodki − davki in prispevki − stroški (enako pri vseh oblikah)
  cistiPrihodki: number;
  // cistiPrihodki / prihodki
  cistiPrihodkiRate: number;
  // Vsi davki in prispevki
  totalTax: number;
};
