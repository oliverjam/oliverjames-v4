import { Layout } from "../layouts/base.jsx";
import { Avatar } from "../layouts/feed.jsx";
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
    let url = `/articles/${post.slug}.html`;
    return {
      url,
      component: (
        <Layout {...data} url={url} title={post.title} page_style="article.css">
          <Article
            prev={prev}
            next={next}
            title={post.title}
            date={post.date}
            time={post.time}
            tags={post.tags}
            intro={post.intro}
            related={related(post, tags, prev, next)}
          >
            {post.content}
          </Article>
        </Layout>
      ),
    };
  });

  function Article({
    title,
    intro,
    children,
    date,
    time,
    tags = [],
    prev,
    next,
    related,
  }) {
    return (
      <div class="Profile font-serif">
        <article class="BorderBetween h-entry">
          <header class="ProfileHeader">
            <Avatar />
            <div class="grid gap-2">
              <div class="flex items-center gap-3 font-2 color-bright font-sans">
                <a href="/articles" class="flex items-center gap-1">
                  <Icon name="article" size="16" />
                  <span class="p-kind">Article</span>
                </a>
                <span class="flex items-center gap-1">
                  <Icon name="calendar" size="16" />
                  <ReadableDate month="short">{date}</ReadableDate>
                </span>
                <span class="flex items-center gap-1">
                  <Icon name="clock" size="16" />
                  <span>{(time / 60).toFixed(1)} minute read</span>
                </span>
              </div>
              <h1 class="p-name font-5-8">{title}</h1>
              <ul class="flex wrap gap-2 color-bright font-sans">
                {tags.map((tag) => (
                  <a href={`/tags/${tag}`}>
                    #
                    <span class="p-category" slug={slug(tag)}>
                      {tag}
                    </span>
                  </a>
                ))}
              </ul>
            </div>
          </header>
          <div class="e-content BorderBetween">
            <p class="py-8 gutter font-4">{intro}</p>
            <div class="ArticleContent py-8">{children}</div>
          </div>
        </article>
        {/* <header class="grid gap-1 gutter">
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
        </header> */}
        {/* <article class="e-content pt-8 pb-9">{children}</article> */}
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
