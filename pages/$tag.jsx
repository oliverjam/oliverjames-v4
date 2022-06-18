import { slug } from "../lib/slug.js";

export { default as layout } from "../layouts/base.jsx";

export default ({ tags }) => {
  return Array.from(tags).map(([tag, posts]) => {
    return {
      url: `/blog/tags/${slug(tag)}.html`,
      component: <Tag name={tag} posts={posts} />,
      title: tag[0].toUpperCase() + tag.slice(1) + " posts",
    };
  });
};

function Tag({ name, posts }) {
  return (
    <main>
      <h1>Posts tagged with "{name}"</h1>
      <ul>
        {posts.map((post) => (
          <li>
            <a href={`/blog/${slug(post.slug)}`}>{post.title}</a>
          </li>
        ))}
      </ul>
    </main>
  );
}
