export type ChartData = Record<
  // Revenue
  string,
  TaxModelData[]
>;

export interface TaxModelData {
  expenseRate: number;
  cistiPrihodkiRate: number;
  effectiveTaxRate: number;
  taxModel: string;
}

export type DataPoint = {
  revenue: number;
  tax: number;
  net: number;
} & TaxModelData;

export interface TaxZone {
  start: number;
  end: number;
  model: string;
}

export interface ChartDimensions {
  width: number;
  height: number;
  margin: { top: number; right: number; bottom: number; left: number };
  xMax: number;
  yMax: number;
}
