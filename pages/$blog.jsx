export { default as layout } from "../layouts/base.jsx";

export default ({ posts }) => {
  return posts.map(({ slug, content, ...rest }) => {
    return {
      url: `/blog/${slug}.html`,
      component: <Post title={rest.title}>{content}</Post>,
      ...rest,
    };
  });
};

function Post({ title, children }) {
  return (
    <main>
      <h1>{title}</h1>
      <div>{children}</div>
    </main>
  );
}
