import { Layout } from "../layouts/list.jsx";
import { Search } from "../components/search.jsx";
import { Tag } from "../components/tag.jsx";
import { PostLink } from "../components/post.jsx";
import { slug } from "../lib/slug.js";

export default (data) => {
  let tags = Array.from(data.tags)
    .sort((a, b) => b[1].length - a[1].length)
    .slice(0, 4);
  return (
    <Layout {...data} title="All posts">
      <Search />
      <ul class="flex wrap gap-3 items-center">
        {tags.map(([tag]) => (
          <Tag size="md" slug={slug(tag)}>
            <b>{tag}</b>
          </Tag>
        ))}
        <a href="/tags" class="py-1 px-3">
          <b>All tags</b>
        </a>
      </ul>
      <ul class="grid gap-6">
        {data.posts
          .filter((p) => !p.draft)
          .map((post) => (
            <li>
              <PostLink size="md" {...post} />
            </li>
          ))}
      </ul>
    </Layout>
  );
};
