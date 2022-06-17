export { default as layout } from "../layouts/base.jsx";

export let title = "Blog";

export default ({ posts }) => (
  <main>
    <h1>Blogs</h1>
    <ul>
      {posts.map((post) => (
        <li>
          <a href={`/blog/${post.slug}`}>{post.title}</a>
        </li>
      ))}
    </ul>
  </main>
);
