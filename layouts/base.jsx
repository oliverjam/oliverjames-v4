export default ({ title, children, styles, page_style, url }) => {
  return (
    <html lang="en">
      <head>
        <meta charset="utf-8" />
        <title>{title || "oliverjam.es"}</title>
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
        <header class="flex gap-6 items-center justify-between py-6 gutter">
          <a href="/" aria-label="home" class="flex">
            <Logo size="44" />
          </a>
          <nav>
            <ul class="flex gap-5">
              <NavLink to="/blog" current={url}>
                <Icon size="24" name="document" class="color-bright" /> Blog
              </NavLink>
              <NavLink to="/blog/search" current={url}>
                <Icon size="24" name="search" class="color-bright" /> Search
              </NavLink>
            </ul>
          </nav>
        </header>
        <main>{children}</main>
        <footer class="py-8 gutter">
          <nav class="flex justify-center gap-2">
            <a
              href="https://twitter.com/_oliverjam"
              rel="me"
              aria-label="Twitter"
            >
              <Icon name="twitter" />
            </a>
            <a
              href="https://github.com/oliverjam/"
              rel="me"
              aria-label="GitHub"
            >
              <Icon name="github" />
            </a>
            <a
              href="https://www.linkedin.com/in/oliverjam"
              aria-label="LinkedIn"
            >
              <Icon name="linkedin" />
            </a>
          </nav>
          <a
            href="https://github.com/oliverjam/oliverjames-v4"
            target="_blank"
            rel="noopener"
            class="flex gap-1 items-center justify-center"
          >
            <small>View source</small>
            <Icon size="16" name="external" />
          </a>
        </footer>
      </body>
    </html>
  );
};

function NavLink({ current = "", to, children }) {
  let current_path = current.replace(".html", "");
  const active = current_path === to;
  const active_parent = to !== "/" && current_path.includes(to);
  return (
    <li>
      <a
        class="flex gap-1 items-center aria-current:font-bold"
        href={active ? "#main" : to}
        aria-current={active ? "page" : active_parent ? "true" : "false"}
      >
        {children}
      </a>
    </li>
  );
}

function Icon({ size = "20", name, ...rest }) {
  return (
    <svg {...rest} width={size} height={size}>
      <use href={`/assets/sprite.svg#${name}`} />
    </svg>
  );
}

function Logo({ size }) {
  return (
    <svg
      view-box="0 0 32 32"
      fill="none"
      class="color-bright"
      stroke="currentColor"
      stroke-width="3.5"
      width={size}
      height={size}
    >
      <defs>
        <mask id="mask">
          <rect x="-1" y="-1" width="34" height="34" fill="white" />
          <path d="M11.5 0 V32" stroke="black" stroke-width="2" />
          <path d="M20.5 0 V32" stroke="black" stroke-width="2" />
          <rect
            x="17.5"
            y="28"
            width="3"
            height="4"
            fill="black"
            stroke="none"
          />
          <rect
            x="24.5"
            y="17.5"
            width="9"
            height="16"
            fill="black"
            stroke="none"
          />
        </mask>
      </defs>
      <circle cx="16" cy="16" r="14" mask="url(#mask)" />

      <path d="M9 3 v26" />
      <path d="M16 1 V31" />
      <path d="M23 3 v26" />
      <path d="M22 16 H31" />
    </svg>
  );
}
