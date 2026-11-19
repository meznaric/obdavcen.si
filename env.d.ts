/// <reference types="@react-router/node" />
/// <reference types="vite/client" />

declare module "*.mdx" {
  let MDXComponent: (props: object) => import("react").JSX.Element;
  export const frontmatter: object;
  export default MDXComponent;
}
