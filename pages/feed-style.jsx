export let url = "rss.xsl";

export default () => /*xml*/ `
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
          <xsl:value-of select="atom:feed/atom:title" /> web feed
        </title>
        <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1, maximum-scale=1"
        />
      </head>
      <body>
        <header>
          <h1>
            <xsl:value-of select="atom:feed/atom:title" />
          </h1>
          <p>
            <xsl:value-of select="atom:feed/atom:subtitle" />
          </p>
        </header>
        <h2>Blog posts</h2>
        <xsl:for-each select="atom:feed/atom:entry">
          <div>
            <h3>
              <a target="_blank">
                <xsl:attribute name="href">
                  <xsl:value-of select="atom:link" />
                </xsl:attribute>
                <xsl:value-of select="atom:title" />
              </a>
            </h3>
            <small>
              Published: <xsl:value-of select="atom:updated" />
            </small>
          </div>
        </xsl:for-each>
      </body>
    </html>
  </xsl:template>
</xsl:stylesheet>
`;
