export const url = "_redirects";

export default () =>
  `
/blog/* /articles/:splat 301
  `.trim();
