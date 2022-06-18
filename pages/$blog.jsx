import { Icon } from "../components/icon.jsx";
import * as dates from "../lib/dates.js";
import { slug } from "../lib/slug.js";

export { default as layout } from "../layouts/base.jsx";

export default ({ posts }) => {
  return posts.map(({ slug, content, ...rest }) => {
    let time = dates.reading_time(content);
    return {
      url: `/blog/${slug}.html`,
      component: (
        <Post title={rest.title} date={rest.date} time={time} tags={rest.tags}>
          {content}
        </Post>
      ),
      page_style: "blog.css",
      reading_time: time,
      ...rest,
    };
  });

  function Post({ title, children, date, time, tags = [] }) {
    return (
      <div class="wrapper">
        <header class="py-6 grid gap-1">
          <h1>{title}</h1>
          <small class="flex items-center gap-1">
            <Icon name="calendar" class="color-bright" />
            <ReadableDate>{date}</ReadableDate>
          </small>
          <small class="flex items-center gap-1">
            <Icon name="clock" class="color-bright" />
            {(time / 60).toFixed(1)} minute read
          </small>
          <ul class="flex wrap gap-2">
            {tags.map((tag) => (
              <Tag>{tag}</Tag>
            ))}
          </ul>
        </header>
        {children}
      </div>
    );
  }
};

function ReadableDate({ children }) {
  return (
    <time datetime={children.toString()} title={children.toString()}>
      {dates.readable(children)}
    </time>
  );
}

function Tag({ children }) {
  return (
    <li class="text-small py-1 px-2 bg-dim">
      <a href={`/blog/tags/${slug(children)}`}>{children}</a>
    </li>
  );
}
