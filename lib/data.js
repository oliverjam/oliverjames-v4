import { join, parse, walkSync } from "../deps.js";
import { markdown } from "../lib/markdown.js";
import { reading_time } from "../lib/dates.js";

let DIR = "content";

export default async function () {
  let files = Array.from(Deno.readDirSync(DIR));
  let posts = await Promise.all(
    files.map(async (entry) => {
      try {
        let raw = await Deno.readTextFile(join(DIR, entry.name));
        let { data, content } = markdown(raw);
        let { name } = parse(entry.name);
        let time = reading_time(content);
        return { slug: name, time, ...data, content };
      } catch (error) {
        console.error(`Error reading content '${entry.name}'`);
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
