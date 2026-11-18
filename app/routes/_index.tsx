import type { MetaFunction } from "@remix-run/node";
import { IndexPage } from "~/ui/pages/IndexPage/IndexPage";

export const meta: MetaFunction = () => {
  return [
    { title: "Slovenski Davčni Pregled | Najboljša Izbira za Vaše Podjetje" },
    { name: "description", content: "Celovit pregled slovenskega davčnega sistema. Izračunajte najučinkovitejšo vrsto podjetja, pridobite ključne informacije in optimizirajte svoje davčne obveznosti." },
    { name: "keywords", content: "slovenski davčni sistem, optimizacija davkov, vrsta podjetja, davčni pregled, davčni nasveti, normirani sp izracun, sp izracun" },
    { name: "author", content: "Vito Meznaric" },
    { property: "og:title", content: "Slovenski Davčni Pregled | Najboljša Izbira za Vaše Podjetje" },
    { property: "og:description", content: "Odkrijte, kako optimizirati davčne obveznosti in izbrati najučinkovitejšo pravno obliko podjetja v Sloveniji." },
    { property: "og:type", content: "website" },
    { property: "og:url", content: "https://www.obdavcen.si" },
    { property: "og:image", content: "https://www.obdavcen.si/share_image.jpg" },
    { property: "og:image:alt", content: "Slovenski Davčni Pregled - Delite to stran" },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:title", content: "Slovenski Davčni Pregled | Najboljša Izbira za Vaše Podjetje" },
    { name: "twitter:description", content: "Odkrijte, kako optimizirati davčne obveznosti in izbrati najučinkovitejšo pravno obliko podjetja v Sloveniji." },
    { name: "twitter:creator", content: "@OtivDev" },

    { rel: "icon", type: "image/png", href: "https://www.obdavcen.si/favicon.png" },
    { rel: "apple-touch-icon", href: "https://www.obdavcen.si/favicon_180.png", sizes: "180x180" },
  ];
};

export default function Index() {
  return <IndexPage />;
}
