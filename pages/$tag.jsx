import { Layout } from "../layouts/list.jsx";
import { slug } from "../lib/slug.js";
import { PostLink } from "../components/post.jsx";

export default (data) => {
  let { tags } = data;
  return Array.from(tags).map(([tag, posts]) => {
    let url = `/tags/${slug(tag)}.html`;
    let title = `‘${tag}’ archive`;
    return {
      url,
      component: (
        <Layout {...data} url={url} title={title}>
          <ul class="grid gap-5">
            {posts.map((post) => (
              <li>
                <PostLink {...post} size="md" />
              </li>
            ))}
          </ul>
        </Layout>
      ),
    };
  });
};
