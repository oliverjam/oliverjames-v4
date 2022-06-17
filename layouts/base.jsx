export default ({ title, children, styles, page_style }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>{title || "oliverjam.es"}</title>
        <style>{styles.get("main.css")}</style>
        {page_style && styles.has(page_style) && (
          <style>{styles.get(page_style)}</style>
        )}
      </head>
      <body>{children}</body>
    </html>
  );
};
