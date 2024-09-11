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
  preview = true,
}) {
  let href = preview && `/${kind}s/${slug}`;
  return (
    <article class="Entry h-entry">
      <span class="EntryIcon">
        <Icon name={kind} size="24" />
      </span>
      <div class="grid gap-2">
        <Meta>
          <Kind reason={reason}>{kind}</Kind>
          <Dot />
          <Permalink href={href}>
            <ReadableDate month="short">{date}</ReadableDate>
          </Permalink>
        </Meta>
        <Title href={href}>{title}</Title>
        <Summary intro={intro}>
          {content}
          <Media content={media} />
        </Summary>
        <Tags content={tags} />
      </div>
    </article>
  );
}

function Meta({ children }) {
  return <div class="EntryMeta">{children}</div>;
}

function Permalink({ href, children }) {
  if (href) {
    return (
      <a class="EntryLink u-uid u-url" href={href}>
        {children}
      </a>
    );
  } else {
    return <div class="u-uid">{children}</div>;
  }
}

function Dot() {
  return <span aria-hidden="true">•</span>;
}

function Kind({ reason, children }) {
  return (
    <a href={"/" + children} class="EntryKind">
      {reason && <span>{reason} </span>}
      <span class="p-kind">{children}</span>
    </a>
  );
}
function Title({ href, children }) {
  if (!children) return null;
  if (!href) return <h2 class="EntryTitle p-name">{children}</h2>;
  return (
    <h2 class="EntryTitle">
      <a class="p-name" href={href}>
        {children}
      </a>
    </h2>
  );
}

function Summary({ intro, children }) {
  if (intro) {
    return <div class="EntryContent p-summary">{ellipsis(intro)}</div>;
  } else {
    return <div class="EntryContent e-content">{children}</div>;
  }
}

function Media({ content }) {
  if (!content) return null;
  return (
    <div class="EntryMedia">
      {content.map(({ type, url, alt }) => {
        switch (type) {
          case "photo":
            return <Lightbox src={ASSETS.get(url)} alt={alt} />;
          default:
            return null;
        }
      })}
    </div>
  );
}

function Lightbox({ src, alt = " " }) {
  return (
    <details data-lightbox onkeydown="if (event.key === 'Escape') this.removeAttribute('open')">
      <summary>
        <img src={src} alt={alt} loading="lazy" />
      </summary>
      <img src={src} loading="lazy" alt="" />
    </details>
  );
}

function Tags({ content }) {
  if (!content) return null;
  return (
    <ul class="EntryTags">
      {content.map((t) => (
        <li><a href={`/tags/${slugify(t)}`}>#{t}</a></li>
      ))}
    </ul>
  );
}
