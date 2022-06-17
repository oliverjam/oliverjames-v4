export default ({ title, children }) => (
  <html lang="en">
    <head>
      <meta charset="utf-8" />
      <title>{title || "oliverjam.es"}</title>
    </head>
    <body>{children}</body>
  </html>
);
