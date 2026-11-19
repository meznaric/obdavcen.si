import { AlertDiamondIcon } from "hugeicons-react";
import { Card } from "~/ui/common/Card/Card";
import { Text } from "~/ui/common/Text/Text";

function Assumption({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <AlertDiamondIcon className="w-5 h-5 size-5 shrink-0 text-accent" />
      <Text variant="body">{children}</Text>
    </div>
  );
}

export function Assumptions() {
  return (
    <Card className="flex flex-col gap-4 p-4 justify-center">
      <Assumption>
        Izračuni so namenjeni freelancerjem, ki v glavnem delajo za tuja
        podjetja in sklepajo letne pogodbe
      </Assumption>
      <Assumption>
        Vsi izračuni so informativne narave; za točne informacije glede na tvoje
        okoliščine priporočamo posvet pri strokovnjaku
      </Assumption>
      <Assumption>
        Izračun upošteva predpise{" "}
        <span className="font-bold text-accent">za davčno leto 2026</span>,
        vključno z ZPZR-A iz marca 2026, ne pa tudi zakona ZIURS (referendum
        6. 12. 2026)
      </Assumption>
      <Assumption>
        Izračun d.&nbsp;o.&nbsp;o. predpostavlja, da si v svoji družbi zaposlen, in
        upošteva{" "}
        <span className="font-bold text-accent">regres, božičnico in nagrado za poslovno uspešnost</span>{" "}
        (to lahko spremeniš v nastavitvah)
      </Assumption>
    </Card>
  );
}
