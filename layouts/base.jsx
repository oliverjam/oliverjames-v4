import { Icon } from "../components/icon.jsx";

export function Layout({ title, children, styles, page_style, url }) {
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
        {/* <header class="w-100 max-w-home mx-auto flex gap-6 items-center justify-between py-8 gutter lh-1">
          <a {...to(url, "/")} aria-label="home" class="flex">
            <Logo size="44" />
          </a>
          <nav>
            <ul class="flex gap-1-5">
              <li>
                <a
                  {...to(url, "/blog")}
                  class="nav-link flex gap-1 items-center"
                >
                  <Icon size="20" name="document" class="color-bright" /> Blog
                </a>
              </li>
              <li>
                <a
                  {...to(url, "/tags")}
                  class="nav-link flex gap-1 items-center"
                >
                  <Icon size="20" name="tag" class="color-bright" /> Tags
                </a>
              </li>
              <li>
                <a
                  {...to(url, "/feed.xml")}
                  class="nav-link flex gap-1 items-center"
                >
                  <Icon size="20" name="rss" class="color-bright" /> RSS
                </a>
              </li>
            </ul>
          </nav>
        </header> */}
        <main>{children}</main>
        {/* <footer class="py-8 gutter">
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
        </footer> */}
      </body>
    </html>
  );
}

function to(current, to) {
  let current_path = current.replace(".html", "").replace("index", "");
  const active = current_path === to;
  const active_parent = to !== "/" && current_path.includes(to);
  return {
    href: active ? "#main" : to,
    "aria-current": active ? "page" : active_parent ? "true" : "false",
  };
}

function Logo({ size }) {
  return (
    <svg
      viewbox="0 0 32 32"
      fill="none"
      class="color-bright"
      stroke="currentcolor"
      stroke-width="3"
      width={size}
      height={size}
      aria-hidden="true"
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
