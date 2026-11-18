import { useMemo } from "react";
import { DataPoint, TaxZone, ChartData } from "./types";
import { SharedInputs, YearSettings } from "~/constants/types";
import taxModes from "~/utils/taxModes";

export function useChartData(
  sharedInputs: SharedInputs,
  currentSettings: YearSettings
) {
  /**
   * Calculate data for all revenue points and models
   */
  const data: ChartData = useMemo(() => {
    const d: ChartData = {};
    Object.values(taxModes).forEach((mode) => {
      const { calculator } = mode;

      for (let i = 10000; i <= 220000; i += 1000) {
        const maxRevenue = mode.getMaxRevenue?.(currentSettings);
        if (maxRevenue && i > maxRevenue) {
          continue;
        }

        const data = calculator(
          {
            revenue: i,
            expenses: Math.min(sharedInputs.expenses, i),
            salaryGross1: sharedInputs.salaryGross1,
            lanskiPrispevki: sharedInputs.lanskiPrispevki,
          },
          currentSettings
        );

        if (!d[i]) {
          d[i] = [];
        }
        d[i].push({
          taxModel: mode.shortName,
          effectiveTaxRate: data.effectiveTaxRate,
          expenseRate: data.expenseRate,
          cistiPrihodkiRate: data.cistiPrihodkiRate,
        });
      }
    });

    return d;
  }, [sharedInputs, currentSettings]);

  return useMemo(() => {
    const processedData = Object.entries(data)
      .map(([revenue, models]) => {
        const lowestRateModel = models.reduce((prev, curr) =>
          prev.effectiveTaxRate < curr.effectiveTaxRate ? prev : curr
        );
        const numericRevenue = parseFloat(revenue);
        return {
          revenue: numericRevenue,
          effectiveTaxRate: lowestRateModel.effectiveTaxRate * 100,
          tax: numericRevenue * lowestRateModel.effectiveTaxRate,
          net: numericRevenue * (1 - lowestRateModel.effectiveTaxRate),
          taxModel: lowestRateModel.taxModel,
          expenseRate: lowestRateModel.expenseRate * 100,
          cistiPrihodkiRate: lowestRateModel.cistiPrihodkiRate * 100,
        };
      })
      .sort((a, b) => a.revenue - b.revenue);

    const taxZones: TaxZone[] = [];
    let currentZone = {
      start: processedData[0].revenue,
      model: processedData[0].taxModel,
    };

    processedData.forEach((point, index) => {
      if (
        point.taxModel !== currentZone.model ||
        index === processedData.length - 1
      ) {
        taxZones.push({
          start: currentZone.start,
          end: point.revenue,
          model: currentZone.model,
        });
        currentZone = { start: point.revenue, model: point.taxModel };
      }
    });

    // Process data for all tax models
    const allModelsData = Object.entries(data as ChartData)
      .map(([revenue, models]) => {
        const numericRevenue = parseFloat(revenue);
        return models.map(
          (model) =>
            ({
              revenue: numericRevenue,
              taxModel: model.taxModel,
              effectiveTaxRate: model.effectiveTaxRate * 100,
              expenseRate: model.expenseRate * 100,
              cistiPrihodkiRate: model.cistiPrihodkiRate * 100,
              tax: numericRevenue * model.effectiveTaxRate,
              net: numericRevenue * (1 - model.effectiveTaxRate),
            } satisfies DataPoint)
        );
      })
      .flat();

    // Group by tax model
    const taxModelLines = allModelsData.reduce((acc, curr) => {
      if (!acc[curr.taxModel]) {
        acc[curr.taxModel] = [];
      }
      acc[curr.taxModel].push(curr);
      return acc;
    }, {} as Record<string, typeof allModelsData>);

    // Sort each model's data points by revenue
    // Object.values(taxModelLines).forEach((modelData) => {
    //   modelData.sort((a, b) => a.revenue - b.revenue);
    // });

    const modelsByRevenue = allModelsData.reduce((acc, curr) => {
      // acc[curr.revenue] = curr;
      if (!acc[curr.revenue]) {
        acc[curr.revenue] = {};
      }
      acc[curr.revenue][curr.taxModel] = curr;
      return acc;
    }, {} as Record<number, Record<string, DataPoint>>);

    return {
      chartData: processedData,
      taxZones,
      taxModelLines,
      modelsByRevenue,
    };
  }, [data]);
}

export const getRevenue = (d: DataPoint) => d.revenue;
export const getTax = (d: DataPoint) => d.tax;
export const getNet = (d: DataPoint) => d.net;
export const getTaxRate = (d: DataPoint) => d.effectiveTaxRate;
export const getExpenseRate = (d: DataPoint) => d.expenseRate;
export const getCistiPrihodkiRate = (d: DataPoint) => d.cistiPrihodkiRate;
export const getExpenses = (d: DataPoint) => (d.revenue * d.expenseRate) / 100;
export const getCistiPrihodki = (d: DataPoint) =>
  (d.revenue * d.cistiPrihodkiRate) / 100;
