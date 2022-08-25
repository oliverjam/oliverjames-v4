import { Layout } from "../layouts/list.jsx";
import { Tag } from "../components/tag.jsx";
import { slug } from "../lib/slug.js";

export let url = `/tags.html`;

export default (data) => {
  return (
    <Layout {...data} title="All tags">
      <ul class="flex wrap gap-4">
        {Array.from(data.tags)
          .sort((a, b) => b[1].length - a[1].length)
          .map(([tag, posts]) => (
            <Tag slug={slug(tag)} size="md">
              <b>{tag}</b> {posts.length}
            </Tag>
          ))}
      </ul>
    </Layout>
  );
};
