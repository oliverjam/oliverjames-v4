import { ReadableDate } from "./dates.jsx";
import { Icon } from "./icon.jsx";

export function PostLink({ slug, title, date, rel, time, size = "sm" }) {
  return (
    <div class="grid gap-2 lh-1">
      <a href={`/blog/${slug}`} rel={rel} class={fz[size]}>
        {title}
      </a>
      <div class="flex gap-2">
        <span class="flex items-center gap-1 font-2">
          <Icon name="calendar" size="16" class="color-bright" />
          <ReadableDate month="short">{date}</ReadableDate>
        </span>
        <span class="flex items-center gap-1 font-2">
          <Icon name="clock" size="16" class="color-bright" />
          <span>{(time / 60).toFixed(1)} mins</span>
        </span>
      </div>
    </div>
  );
}

let fz = {
  sm: "font-3",
  md: "font-4",
};
