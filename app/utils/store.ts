import { createStore } from "@xstate/store";

type ContextType = {
  revenue: number;
  expenses: number;
  salaryGross1: number;
};

export const store = createStore({
  context: {
    revenue: 50000,
    expenses: 0,
    salaryGross1: 0,
  },
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
