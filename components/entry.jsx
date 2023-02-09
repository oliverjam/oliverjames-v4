import { ReadableDate } from "./dates.jsx";
import { Icon } from "./icon.jsx";
import { ellipsis } from "../lib/ellipsis.js";
import { slugify } from "../lib/slugify.js";
import { ASSETS } from "../lib/assets.js";

export function Entry({
  slug,
  date,
  reason,
  kind = "article",
  intro,
  title,
  content,
  tags,
  media,
}) {
  let href = `/${kind}s/${slug}`;
  return (
    <article class="Entry h-entry">
      <Avatar />
      <Icon class="EntryIcon" name={kind} size="14" />
      <div class="EntryMeta">
        <a class="EntryLink u-uid u-url" href={href}>
          <ReadableDate month="short">{date}</ReadableDate>
        </a>
        <span aria-hidden="true">•</span>
        <a href={"/" + kind} class="EntryKind">
          {reason && <span>{reason} </span>}
          <span class="p-kind">{kind}</span>
        </a>
      </div>
      {title && <h2 class="EntryTitle p-name">{title}</h2>}
      {intro ? (
        <div class="EntryContent p-summary">{ellipsis(intro)}</div>
      ) : (
        <div class="EntryContent e-content">
          {content}
          {media && (
            <div class="EntryMedia">
              {media.map((m) => (
                <Media {...m} />
              ))}
            </div>
          )}
        </div>
      )}
      {tags && (
        <ul class="EntryTags">
          {tags.map((t) => (
            <a href={`/tags/${slugify(t)}`}>#{t}</a>
          ))}
        </ul>
      )}
    </article>
  );
}

export function Avatar() {
  return (
    <div class="EntryAvatar h-card p-author">
      <a class="u-url" href="/" tabindex="-1">
        <img
          class="u-photo p-name"
          src={ASSETS.get("me.jpg")}
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
      return <Lightbox src={ASSETS.get(url)} alt={alt} />;
    default:
      return null;
  }
}

function Lightbox({ src, alt = " " }) {
  return (
    <details data-lightbox>
      <summary>
        <img src={src} alt={alt} loading="lazy" />
      </summary>
      <img src={src} loading="lazy" />
    </details>
  );
}
