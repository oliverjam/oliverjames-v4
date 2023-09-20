import { styles } from "../lib/data.js";
export let url = "rss.xsl";

export default () => {
  let css = styles.get("main.css");
  return /*xml*/ `
<xsl:stylesheet
  version="3.0"
  xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
  xmlns:atom="http://www.w3.org/2005/Atom"
  exclude-result-prefixes="atom"
>
  <xsl:output method="html" version="1.0" encoding="UTF-8" indent="yes" />
  <xsl:template match="/">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>
          <xsl:value-of select="atom:feed/atom:title" />
        </title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
        <style>${css}</style>
        <style>
          body {
            max-inline-size: 40rem;
            margin-inline: auto;
            border-inline: 1px solid var(--border-dim);
          }
          header, .Feed > * {
            padding-block: var(--space-8);
            padding-inline: var(--gutter);
          }
          body > * + *, .Feed > * + * {
            border-top: 1px solid var(--border-dim);
          }
          header {
            display: grid;
            gap: var(--space-3);
          }
          header a {
            text-decoration: underline;
          }
        </style>
      </head>
      <body>
        <header>
          <h1>
            <xsl:value-of select="atom:feed/atom:title" />
          </h1>
          <p>
            <xsl:value-of select="atom:feed/atom:subtitle" />
          </p>
          <p>
            This is an RSS feed—a list of all my articles that will be updated whenever I post.
            You can use an RSS reader like <a href="https://feedly.com/">Feedly</a>
            or <a href="https://netnewswire.com/">NetNewsWire</a> to follow this feed—just paste in this URL.
          </p>
        </header>
        <ul class="Feed">
          <xsl:for-each select="atom:feed/atom:entry">
            <li>
              <h2>
                <a>
                  <xsl:attribute name="href">
                    <xsl:value-of select="atom:link" />
                  </xsl:attribute>
                  <xsl:value-of select="atom:title" />
                </a>
              </h2>
              <p>
                <xsl:value-of select="atom:updated" />
              </p>
            </li>
          </xsl:for-each>
        </ul>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
`;
};
