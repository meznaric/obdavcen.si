import { HelpCircleIcon, LinkSquare02Icon } from "hugeicons-react";
import { Card } from "~/ui/common/Card/Card";
import { Text } from "~/ui/common/Text/Text";
import { faqSkupine, type FaqVnos } from "./faq";
import { ZunanjaPovezava } from "./gradniki";
import type { Vir } from "./viri";

export function FaqSeznam({ vnosi }: { vnosi: FaqVnos[] }) {
  return (
    <section id="vprasanja" className="space-y-6 scroll-mt-4">
      <Text variant="h2" as="h2" className="text-2xl flex items-center gap-2">
        <HelpCircleIcon className="size-7 text-accent" />
        Pogosta vprašanja
      </Text>
      <Kazalo vnosi={vnosi} />
      {faqSkupine.map((skupina) => (
        <div
          key={skupina.id}
          id={skupina.id}
          className="space-y-4 scroll-mt-4"
        >
          <h3 className="text-xl font-semibold">{skupina.naslov}</h3>
          {vnosi
            .filter((v) => v.skupina === skupina.id)
            .map((v) => (
              <FaqKartica key={v.id} vnos={v} />
            ))}
        </div>
      ))}
    </section>
  );
}

function Kazalo({ vnosi }: { vnosi: FaqVnos[] }) {
  return (
    <nav aria-label="Kazalo vprašanj" className="grid gap-4 sm:grid-cols-3 text-sm">
      {faqSkupine.map((skupina) => (
        <div key={skupina.id}>
          <p className="font-semibold mb-1">
            <a href={`#${skupina.id}`} className="link link-hover">
              {skupina.naslov}
            </a>
          </p>
          <ul className="space-y-1">
            {vnosi
              .filter((v) => v.skupina === skupina.id)
              .map((v) => (
                <li key={v.id}>
                  <a href={`#${v.id}`} className="link link-hover">
                    {v.vprasanje}
                  </a>
                </li>
              ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function FaqKartica({ vnos }: { vnos: FaqVnos }) {
  return (
    <div id={vnos.id} className="scroll-mt-4">
      <Card className="card-body gap-3">
        <h4 className="text-lg font-semibold">{vnos.vprasanje}</h4>
        <p>{vnos.odgovor}</p>
        <details className="collapse collapse-arrow bg-base-200">
          <summary className="collapse-title font-medium">
            Natančno pravilo, primer in viri
          </summary>
          <div className="collapse-content space-y-5">
            <div>
              <h5 className="font-semibold mb-1">Natančno pravilo</h5>
              <div className="prose prose-sm max-w-none">{vnos.pravilo}</div>
            </div>
            <div>
              <h5 className="font-semibold mb-2">Primer</h5>
              {vnos.primer}
            </div>
            <SeznamVirov viri={vnos.viri} />
          </div>
        </details>
      </Card>
    </div>
  );
}

export function SeznamVirov({
  viri,
  naslov = "Viri",
}: {
  viri: Vir[];
  naslov?: string | null;
}) {
  return (
    <div>
      {naslov && <h5 className="font-semibold mb-1">{naslov}</h5>}
      <ul className="space-y-1 text-sm">
        {viri.map((vir) => (
          <li key={vir.naslov} className="flex gap-2 items-start">
            <LinkSquare02Icon className="size-4 shrink-0 mt-0.5 opacity-70" />
            <ZunanjaPovezava href={vir.url}>{vir.naslov}</ZunanjaPovezava>
          </li>
        ))}
      </ul>
    </div>
  );
}
