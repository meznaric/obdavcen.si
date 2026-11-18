import { AlertDiamondIcon } from "hugeicons-react";
import { Card } from "~/ui/common/Card/Card";
import { Text } from "~/ui/common/Text/Text";

function Assumption({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4">
      <AlertDiamondIcon className="w-5 h-5 size-5 flex-shrink-0 text-accent" />
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
        Vsi izračuni so informativne narave; za točne informacije glede na vaše
        okoliščine priporočamo posvet pri strokovnjaku
      </Assumption>
      <Assumption>
        Izračun je na podlagi sprejetih sprememb v letu 2025{" "}
        <span className="font-bold text-accent">za poslovno leto 2026</span>
      </Assumption>
      <Assumption>
        Izračun D.O.O. upošteva{" "}
        <span className="font-bold text-accent">božičnico in nagrado za poslovno uspešnost</span>{" "}
        (nastavljivo v nastavitvah)
      </Assumption>
    </Card>
  );
}
