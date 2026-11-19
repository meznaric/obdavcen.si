import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import mdx from "@mdx-js/rollup";
import remarkFrontmatter from "remark-frontmatter";
import remarkMdxFrontmatter from "remark-mdx-frontmatter";

type MdastNode = { type: string; value?: string; children?: MdastNode[] };

// V besedilu člankov zamenja presledke v »s. p.« in »d. o. o.« z nedeljivimi,
// da se krajšava ne prelomi čez vrstico.
function remarkNedeljiveKrajsave() {
  const nedeljivo = (besedilo: string) =>
    besedilo
      .replace(/\b([sS])\. p\./g, "$1.\u00a0p.")
      .replace(/\b([dD])\. o\. o\./g, "$1.\u00a0o.\u00a0o.");
  const obdelaj = (node: MdastNode) => {
    if (node.type === "text" && node.value) node.value = nedeljivo(node.value);
    node.children?.forEach(obdelaj);
  };
  return (tree: MdastNode) => obdelaj(tree);
}

export default defineConfig({
  resolve: {
    tsconfigPaths: true,
  },
  plugins: [
    tailwindcss(),
    // MDX mora teči pred React Routerjem, da ta dobi že prevedene module poti
    { enforce: "pre", ...mdx({ remarkPlugins: [remarkFrontmatter, remarkMdxFrontmatter, remarkNedeljiveKrajsave] }) },
    reactRouter(),
  ],
});
