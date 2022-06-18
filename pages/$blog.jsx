export { default as layout } from "../layouts/base.jsx";

export default ({ posts }) => {
  return posts.map(({ slug, content, ...rest }) => {
    return {
      url: `/blog/${slug}.html`,
      component: <Post title={rest.title}>{content}</Post>,
      page_style: "blog.css",
      ...rest,
    };
  });
};

function Post({ title, children }) {
  return (
    <div class="wrapper">
      <header class="py-6">
        <h1>{title}</h1>
      </header>
      {children}
    </div>
  );
}
