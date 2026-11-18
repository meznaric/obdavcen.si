import { InformationCircleIcon } from "hugeicons-react";
import { Text } from "~/ui/common/Text/Text";
import formatCurrency from "~/utils/formatCurrency";

export default function Learnings() {
  return (
    <>
      <Text variant="h2" as="span" className="text-center pt-24 block">
        Kaj lahko razberemo iz tega?
      </Text>
      <Text className="text-center italic">Posodobljeno za leto 2026</Text>
      <div className="alert alert-info text-sm max-w-xl mx-auto" role="alert">
        <InformationCircleIcon className="w-6 h-6 " />
        <div>
          <span className="font-bold">1. Mrtva cona se je prestavila</span>
          <br />
          Pri 0 € stroškov se bolj splača imeti pogodbo za{" "}
          {formatCurrency(120000, true)} / leto kot za{" "}
          {formatCurrency(144000, true)} / leto, kajti Normirani SP je toliko
          bolj efektiven, da z drugimi oblikami lahko dobiš ven več šele pri{" "}
          {formatCurrency(144000, true)}+ / leto.
          <br />
          <br />
          Če pa imaš {formatCurrency(10000, true)} stroškov, se ta razlika zniža
          iz {formatCurrency(144000, true)} na {formatCurrency(137000, true)}.
          Šele pri {formatCurrency(33000, true)} stroškov pa ta mrtva cona
          izgine.
        </div>
      </div>
      <div className="alert alert-info text-sm max-w-xl mx-auto" role="alert">
        <InformationCircleIcon className="w-6 h-6 " />
        <div>
          <span className="font-bold">
            2. Progresivna davčna lestvica skoraj ne obstaja
          </span>
          <br />
          Brez stroškov progresivna lestivca obstaja samo med {formatCurrency(60000, true)} in{" "}
          {formatCurrency(120000, true)}.
          <br />
          Lestvica postane bolj progresivna, več kot imamo stroškov.
        </div>
      </div>
      <div className="alert alert-info text-sm max-w-xl mx-auto" role="alert">
        <InformationCircleIcon className="w-6 h-6 " />
        <div>
          <span className="font-bold">
            3. Digitalni delavci na daljavo potegnejo kratko
          </span>
          <br />
          Ker imajo digitalni podjetniki na daljavo zelo nizke stroške, so
          prisiljeni plačati zelo visoke davke. Podjetnikom, ki pripeljejo denar
          v državo, se tako obeta najslabše.
        </div>
      </div>
    </>
  );
}
