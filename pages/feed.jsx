export let url = "feed.xml";

export default ({ posts }) => {
  let last_updated = new Date(posts[0].date);
  return /*xml*/ `
<?xml version="1.0" encoding="utf-8"?>
<?xml-stylesheet href="/rss.xsl" type="text/xsl"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>oli's rss feed</title>
  <subtitle>weird web person</subtitle>
  <link href="https://oliverjam.es/feed.xml" rel="self"/>
  <link href="https://oliverjam.es"/>
  <updated>${last_updated.toISOString()}</updated>
  <id>https://oliverjam.es</id>
  <author>
    <name>oli</name>
    <email>hello@oliverjam.es</email>
  </author>
  ${posts
    .map(
      (post) => /*xml*/ `
  <entry>
    <title>${post.title}</title>
    <link href="https://oliverjam.es/articles/${post.slug}"/>
    <updated>${new Date(post.date).toISOString()}</updated>
    <id>https://oliverjam.es/articles/${post.slug}</id>
    <content type="html"><![CDATA[${post.content}]]></content>
  </entry>
      `
    )
    .join("")}
</feed>
  `.trim();
};
