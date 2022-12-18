import { posts, tags } from "../lib/data.js";
import { Document } from "../components/document.jsx";
import { Avatar } from "../components/profile.jsx";
import { Icon } from "../components/icon.jsx";
import { ReadableDate } from "../components/dates.jsx";
import { Entry } from "../components/entry.jsx";
import { slugify } from "../lib/slugify.js";
import { related } from "../lib/related.js";

export default (data) => {
  return posts.map((post, index) => {
    let prev = posts[index + 1];
    let next = posts[index - 1];
    let url = `/articles/${post.slug}.html`;
    return {
      url,
      component: (
        <Document
          {...data}
          url={url}
          title={post.title}
          page_style="article.css"
        >
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
        </Document>
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
      <div class="Profile BorderBetween font-serif">
        <article class="BorderBetween h-entry">
          <header class="ProfileHeader">
            <Avatar />
            <div class="grid gap-2">
              <div class="flex items-center gap-3 font-2 color-bright font-sans">
                <a href="/articles" class="EntryKind flex items-center gap-1">
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
                    <span class="p-category" slug={slugify(tag)}>
                      {tag}
                    </span>
                  </a>
                ))}
              </ul>
            </div>
          </header>
          <div class="e-content BorderBetween">
            <p class="py-8 gutter font-4">{intro}</p>
            <div class="ArticleContent py-8 pb-9">{children}</div>
          </div>
        </article>
        <ul class="BorderBetween">
          {prev && (
            <li>
              <Entry reason="Previous" {...prev} />
            </li>
          )}
          {next && (
            <li>
              <Entry reason="Next" {...next} />
            </li>
          )}
          {related?.length &&
            related.map((post) => (
              <li>
                <Entry reason="Related" {...post} />
              </li>
            ))}
        </ul>
      </div>
    );
  }
};
