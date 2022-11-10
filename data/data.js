import { join, parse, walkSync } from "../deps.js";
import { markdown } from "../lib/markdown.js";
import { reading_time } from "../lib/dates.js";

export default async function () {
  let files = Array.from(Deno.readDirSync("blog"));
  let posts = await Promise.all(
    files.map(async (entry) => {
      try {
        let raw = await Deno.readTextFile(join("blog", entry.name));
        let { data, content } = markdown(raw);
        let { name } = parse(entry.name);
        let time = reading_time(content);
        let intro = ellipsis(data.intro);
        return { slug: name, time, ...data, intro, content };
      } catch (error) {
        console.error(`Error reading blog '${entry.name}'`);
        console.error(error);
      }
    })
  );
  posts = posts
    .filter((p) => !p.draft)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  let tags = new Map();
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

  let style_files = walkSync("styles", { includeDirs: false, exts: [".css"] });
  let styles = await Promise.all(Array.from(style_files, read_style));

  return { posts, tags, styles: new Map(styles) };
}

async function read_style(entry) {
  return [entry.name, await Deno.readTextFile(entry.path)];
}

function ellipsis(intro) {
  if (!intro) return undefined;
  let trimmed = intro.trim();
  if (trimmed.endsWith(".")) {
    return trimmed.slice(0, -1) + "…";
  } else {
    return trimmed + "…";
  }
}
