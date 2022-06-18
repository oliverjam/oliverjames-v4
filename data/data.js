import { join, parse, walkSync } from "../deps.js";
import { markdown } from "../lib/markdown.js";

export default async function () {
  let files = Array.from(Deno.readDirSync("blog"));
  let posts = await Promise.all(
    files.map(async (entry) => {
      try {
        let raw = await Deno.readTextFile(join("blog", entry.name));
        let { data, content } = markdown(raw);
        let { name } = parse(entry.name);
        return { slug: name, ...data, content };
      } catch (error) {
        console.error(`Error reading blog '${entry.name}'`);
        console.error(error);
      }
    })
  );
  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

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
