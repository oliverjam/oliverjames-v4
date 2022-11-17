export const url = "_headers";

export default () =>
  `
/assets/*
  Cache-Control: public, max-age=604800, immutable
  `.trim();
