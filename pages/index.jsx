export { default as layout } from "../layouts/base.jsx";

export let title = "Home";

export default ({ posts }) => {
  return (
    <main>
      <h1>Hello world</h1>
      <ul>
        {posts.slice(0, 3).map((post) => (
          <li>
            <a href={`/blog/${post.slug}`}>{post.title}</a>
          </li>
        ))}
      </ul>
    </main>
  );
};
