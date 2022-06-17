import { join, parse } from "../deps.js";
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

  function slug(s) {
    return s.replace(/\W/g, "-");
  }

  return { posts, tags, slug };
}
