/// <reference types="@remix-run/node" />
/// <reference types="vite/client" />

declare module "*.mdx" {
  let MDXComponent: (props: object) => JSX.Element;
  export const frontmatter: object;
  export default MDXComponent;
}
