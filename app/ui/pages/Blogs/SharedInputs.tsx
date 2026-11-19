import { useSelector } from "@xstate/store-react";
import CurrencyInput from "~/ui/common/Input/CurrencyInput";
import { store } from "~/utils/store";

export default function SharedInputs() {
  const { revenue, expenses } = useSelector(store, (state) => state.context);
  return (
    <div
      className="flex flex-row gap-4
      bg-base-200
      pt-2 pb-4 px-8 max-w-full rounded-lg
      "
    >
      <CurrencyInput
        labelClassName="input-sm"
        label="Letni prihodki"
        inputClassName="max-w-12"
        value={revenue}
        onChange={(value) => store.send({ type: "updateRevenue", value })}
      />
      <CurrencyInput
        labelClassName="input-sm"
        label="Letni stroški"
        inputClassName="max-w-12"
        value={expenses}
        onChange={(value) => store.send({ type: "updateExpenses", value })}
      />
    </div>
  );
}
