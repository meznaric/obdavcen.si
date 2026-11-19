import { createStore } from "@xstate/store";

type ContextType = {
  revenue: number;
  expenses: number;
  salaryGross1: number;
  zaposlitevBruto: number;
  // Lanski prispevki s. p. (nastavitve); brez vrednosti jih oceni kalkulator
  lanskiPrispevki?: number;
  // Odgovor na vprašanje »Že imaš redno zaposlitev?« na prvi strani
  imaZaposlitev: boolean;
};

export const store = createStore({
  context: {
    revenue: 50000,
    expenses: 0,
    salaryGross1: 0,
    zaposlitevBruto: 0,
    imaZaposlitev: false,
  } as ContextType,
  on: {
    updateRevenue: (context: ContextType, event: { value: number }) => ({
      ...context,
      revenue: event.value,
    }),
    updateExpenses: (context: ContextType, event: { value: number }) => ({
      ...context,
      expenses: event.value,
    }),
    updateInputs: (context: ContextType, event: Partial<ContextType>) => ({
      ...context,
      ...event,
    }),
  },
});
