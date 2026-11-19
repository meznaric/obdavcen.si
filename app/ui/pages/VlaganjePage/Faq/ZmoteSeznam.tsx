import { Alert02Icon, Cancel01Icon, Tick02Icon } from "hugeicons-react";
import { Card } from "~/ui/common/Card/Card";
import { Text } from "~/ui/common/Text/Text";
import { ZunanjaPovezava } from "./gradniki";
import type { Zmota } from "./zmote";

export function ZmoteSeznam({ zmote }: { zmote: Zmota[] }) {
  return (
    <section id="zmote" className="space-y-4 scroll-mt-4">
      <Text variant="h2" as="h2" className="text-2xl flex items-center gap-2">
        <Alert02Icon className="size-7 text-amber-700 dark:text-amber-400" />
        Pogoste zmote
      </Text>
      <Text variant="bodySmall" className="opacity-80">
        Nasveti, ki jih pogosto srečaš na forumih in v starejših člankih, in kaj o
        tem pravijo FURS in zakoni.
      </Text>
      <div className="grid gap-4 md:grid-cols-2">
        {zmote.map((z) => (
          <ZmotaKartica key={z.id} zmota={z} />
        ))}
      </div>
    </section>
  );
}

function ZmotaKartica({ zmota }: { zmota: Zmota }) {
  return (
    <Card className="card-body gap-3 p-5">
      <p className="flex gap-2 items-start font-semibold">
        <Cancel01Icon className="size-5 shrink-0 mt-0.5 text-error" />
        <span>
          <span className="sr-only">Zmota: </span>
          {zmota.zmota}
        </span>
      </p>
      <p className="flex gap-2 items-start text-sm">
        <Tick02Icon className="size-5 shrink-0 text-green-600" />
        <span>
          <span className="sr-only">Resnica: </span>
          {zmota.resnica}
        </span>
      </p>
      <p className="text-xs flex flex-wrap gap-x-3 gap-y-1">
        {zmota.viri.map((vir) => (
          <ZunanjaPovezava key={vir.naslov} href={vir.url}>
            {vir.naslov}
          </ZunanjaPovezava>
        ))}
      </p>
    </Card>
  );
}
