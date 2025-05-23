import { posts } from "../lib/data.js";

export let url = "feed.xml";

export default () => {
  let last_updated = new Date(posts[0].date);
  let articles = posts.filter((post) => post.kind === "article");
  return /*xml*/ `
<?xml version="1.0" encoding="utf-8"?>
<?xml-stylesheet href="/rss.xsl" type="text/xsl"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>oli's rss feed</title>
  <subtitle>weird web person</subtitle>
  <link href="https://oliverjam.com/feed.xml" rel="self"/>
  <link href="https://oliverjam.com"/>
  <updated>${last_updated.toISOString()}</updated>
  <id>https://oliverjam.com</id>
  <author>
    <name>oli</name>
    <email>hello@oliverjam.com</email>
  </author>
  ${articles
    .map(
      (post) => /*xml*/ `
  <entry>
    <title>${post.title}</title>
    <link href="https://oliverjam.com/articles/${post.slug}"/>
    <updated>${new Date(post.date).toISOString()}</updated>
    <id>https://oliverjam.com/articles/${post.slug}</id>
    <content type="html"><![CDATA[${post.content}]]></content>
  </entry>
      `
    )
    .join("")}
</feed>
  `.trim();
};
