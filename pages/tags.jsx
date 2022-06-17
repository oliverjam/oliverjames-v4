export { default as layout } from "../layouts/base.jsx";
export let url = `/blog/tags.html`;

export default ({ tags, slug }) => {
  return (
    <ul>
      {Array.from(tags).map(([tag, posts]) => (
        <li>
          <a href={`/blog/tags/${slug(tag)}`}>
            <b>{tag}</b> {posts.length}
          </a>
        </li>
      ))}
    </ul>
  );
};
