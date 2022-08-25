import { Layout } from "../layouts/base.jsx";
import { Icon } from "../components/icon.jsx";
import { Tag } from "../components/tag.jsx";
import { ReadableDate } from "../components/dates.jsx";
import { PostLink } from "../components/post.jsx";
import { slug } from "../lib/slug.js";
import { related } from "../lib/related.js";

export default (data) => {
  let { posts, tags } = data;
  return posts.map((post, index) => {
    let prev = posts[index + 1];
    let next = posts[index - 1];
    let url = `/blog/${post.slug}.html`;
    return {
      url,
      component: (
        <Layout {...data} url={url} title={post.title} page_style="blog.css">
          <Post
            prev={prev}
            next={next}
            title={post.title}
            date={post.date}
            time={post.time}
            tags={post.tags}
            related={related(post, tags, prev, next)}
          >
            {post.content}
          </Post>
        </Layout>
      ),
    };
  });

  function Post({
    title,
    children,
    date,
    time,
    tags = [],
    prev,
    next,
    related,
  }) {
    return (
      <div class="h-entry max-w-content mx-auto pb-9">
        <header class="grid gap-1 gutter">
          <h1 class="p-name font-5-8">{title}</h1>
          <span class="flex items-center gap-1 font-3">
            <Icon name="calendar" class="color-bright" />
            <ReadableDate>{date}</ReadableDate>
          </span>
          <span class="flex items-center gap-1 font-3">
            <Icon name="clock" class="color-bright" />
            {(time / 60).toFixed(1)} minute read
          </span>
          <ul class="flex wrap gap-2">
            {tags.map((tag) => (
              <Tag slug={slug(tag)}>
                <b>{tag}</b>
              </Tag>
            ))}
          </ul>
        </header>
        <article class="e-content pt-8 pb-9">{children}</article>
        <div
          class="bg-dim grid gap-5 py-8 gutter"
          style="border-top: var(--space-1) solid var(--contrast)"
        >
          {prev && (
            <div class="grid gap-3">
              <h3 class="font-3">Previous</h3>
              <PostLink rel="prev" {...prev} />
            </div>
          )}
          {next && (
            <div class="grid gap-3">
              <h3 class="font-3">Next</h3>
              <PostLink rel="next" {...next} />
            </div>
          )}
          {related?.length && (
            <div class="grid gap-3">
              <h3 class="font-3">Related</h3>
              <ul class="grid gap-3">
                {related.map((post) => (
                  <li>
                    <PostLink {...post} />
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    );
  }
};
