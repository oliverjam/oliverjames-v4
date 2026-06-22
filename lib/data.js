import { markdown } from "../lib/markdown.js";
import { reading_time } from "../lib/dates.js";
import { walk } from "./fs.js";

let DIR = "content";

export let posts = [];
await walk(DIR, async (entry) => {
  try {
    let raw_md = await Bun.file(entry.path).text();
    let { data, content, raw } = markdown(raw_md);
    let time = reading_time(content);
    posts.push({ slug: entry.name, time, ...data, content, raw });
  } catch (error) {
    console.error(`Error reading content '${entry.name}'`);
    console.error(error);
  }
});
posts = posts
  .filter((p) => !p.draft)
  .sort((a, b) => new Date(b.date) - new Date(a.date));

export let tags = new Map();
for (let post of posts) {
  if (post.tags) {
    for (let tag of post.tags) {
      if (tags.has(tag)) {
        tags.get(tag).push(post);
      } else {
        tags.set(tag, [post]);
      }
    }
  }
}

export let styles = new Map();
await walk("styles", async (entry) => {
  let content = await Bun.file(entry.path).text();
  styles.set(entry.base, content);
});
