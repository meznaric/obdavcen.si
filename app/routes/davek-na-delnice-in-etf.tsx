import type { MetaFunction } from "react-router";
import { faq, faqJsonLd } from "~/ui/pages/VlaganjePage/Faq/faq";
import { lestvicaKratka } from "~/ui/pages/VlaganjePage/stopnje";
import { VlaganjePage } from "~/ui/pages/VlaganjePage/VlaganjePage";
import { vlaganjeLeto } from "~/constants/2026/vlaganje";
import { seo } from "~/utils/seo";

export const meta: MetaFunction = () => [
  ...seo({
    title: `Davek na delnice in ETF ${vlaganjeLeto}: kalkulator, Doh-KDVP, dividende in INR`,
    description: `Koliko davka plačaš ob prodaji delnic ali ETF? Kalkulator (${lestvicaKratka}), primerjava z INR in preverjeni odgovori o Doh-KDVP, Doh-Div, W-8BEN in prijavi tujih računov.`,
    path: "/davek-na-delnice-in-etf",
    type: "article",
  }),
  { "script:ld+json": faqJsonLd(faq) },
];

export default function DavekNaDelniceInEtf() {
  return <VlaganjePage />;
}
