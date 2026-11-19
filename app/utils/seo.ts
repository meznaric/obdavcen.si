import type { MetaDescriptor, MetaFunction } from "react-router";

export const SITE_URL = "https://obdavcen.si";
export const SITE_NAME = "obdavcen.si";

const OG_IMAGE = {
  url: `${SITE_URL}/og-image.png`,
  width: "1200",
  height: "630",
  alt: "obdavcen.si – primerjava davkov in prispevkov za normirani s. p., s. p. in d. o. o.",
};

interface SeoInput {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
}

/** Title, description, canonical URL and social share tags for a page. */
export function seo({
  title,
  description,
  path,
  type = "website",
}: SeoInput): MetaDescriptor[] {
  const url = new URL(path, SITE_URL).toString();
  return [
    { title },
    { name: "description", content: description },
    { tagName: "link", rel: "canonical", href: url },
    { property: "og:site_name", content: SITE_NAME },
    { property: "og:locale", content: "sl_SI" },
    { property: "og:type", content: type },
    { property: "og:url", content: url },
    { property: "og:title", content: title },
    { property: "og:description", content: description },
    { property: "og:image", content: OG_IMAGE.url },
    { property: "og:image:width", content: OG_IMAGE.width },
    { property: "og:image:height", content: OG_IMAGE.height },
    { property: "og:image:alt", content: OG_IMAGE.alt },
    { name: "twitter:card", content: "summary_large_image" },
    { name: "twitter:creator", content: "@OtivDev" },
  ];
}

/** Meta for MDX articles, built from their `title` and `description` frontmatter. */
export function articleMeta(frontmatter: {
  title: string;
  description: string;
}): MetaFunction {
  return ({ location }) =>
    seo({ ...frontmatter, path: location.pathname, type: "article" });
}
