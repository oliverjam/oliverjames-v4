import { ReadableDate } from "./dates.jsx";
import { Icon } from "./icon.jsx";

export function Card({
  slug,
  date,
  kind = "article",
  intro,
  title,
  content,
  tags,
  media,
}) {
  let href = `/blog/${slug}`;
  return (
    <li>
      <article class="Entry h-entry">
        <Icon class="EntryIcon" name={kind} size="14" />
        <Avatar />
        <div class="EntryMeta">
          <span class="EntryKind p-kind">{kind}</span>
          <span aria-hidden="true">•</span>
          <a class="EntryLink u-uid u-url" href={href}>
            <ReadableDate month="short">{date}</ReadableDate>
          </a>
        </div>
        {title && (
          <h2 class="EntryTitle">
            <a class="p-name u-url" href={href} tabindex="-1">
              {title}
            </a>
          </h2>
        )}
        <div
          class={intro ? "EntryContent p-summary" : "EntryContent e-content"}
        >
          {intro || content}
          {media && (
            <div class="EntryMedia">
              {media.map((m) => (
                <Media {...m} />
              ))}
            </div>
          )}
        </div>
        {tags && (
          <ul class="EntryTags">
            {tags.map((t) => (
              <a href={`/tags/${t}`}>#{t}</a>
            ))}
          </ul>
        )}
      </article>
    </li>
  );
}

function Avatar() {
  return (
    <div class="EntryAvatar h-card p-author">
      <a class="u-url" href="/" tabindex="-1">
        <img
          class="u-photo p-name"
          src="/assets/me.jpg"
          alt="Oliver Phillips"
          width="48"
          height="48"
          loading="lazy"
        />
      </a>
    </div>
  );
}

function Media({ type, url, alt }) {
  switch (type) {
    case "photo":
      return <img src={url} alt={alt || ""} loading="lazy" />;
    default:
      return null;
  }
}
