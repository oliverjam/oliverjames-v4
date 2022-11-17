export function Document({ title, children, styles, page_style, url }) {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>{`${title} | oliverjam.es`}</title>
        <link rel="icon" href="/assets/favicon.svg" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
        <link
          href="https://fonts.googleapis.com/css2?family=Spectral:ital,wght@0,400;0,700;1,400&display=swap"
          rel="stylesheet"
        />
        <style>{styles.get("main.css")}</style>
        {page_style && styles.has(page_style) && (
          <style>{styles.get(page_style)}</style>
        )}
      </head>
      <body>
        <a class="skip" href="#main">
          Skip to content
        </a>
        <main>{children}</main>
      </body>
    </html>
  );
}
