import type { MetaFunction } from "react-router";
import { IndexPage } from "~/ui/pages/IndexPage/IndexPage";
import { SITE_NAME, SITE_URL, seo } from "~/utils/seo";

const description =
  "Primerjaj davke in prispevke za normirani s. p., s. p. in d. o. o. v letu 2026. Vnesi letne prihodke in stroške ter poglej, pri kateri obliki ti ostane največ.";

export const meta: MetaFunction = () => [
  ...seo({
    title: "Kalkulator davkov 2026: normirani s. p., s. p. ali d. o. o.?",
    description,
    path: "/",
  }),
  {
    name: "keywords",
    content:
      "kalkulator davkov, normirani sp, sp prispevki, doo dividende, izračun plače, dohodnina 2026, davki za freelancerje",
  },
  { name: "author", content: "Vito Meznaric" },
  {
    "script:ld+json": {
      "@context": "https://schema.org",
      "@type": "WebApplication",
      name: SITE_NAME,
      url: SITE_URL,
      description,
      inLanguage: "sl",
      applicationCategory: "FinanceApplication",
      operatingSystem: "Any",
      isAccessibleForFree: true,
      offers: { "@type": "Offer", price: "0", priceCurrency: "EUR" },
      author: { "@type": "Person", name: "Vito Meznaric" },
    },
  },
];

export default function Index() {
  return <IndexPage />;
}
