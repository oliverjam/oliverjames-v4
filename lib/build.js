import { parse, join, dirname, walk, emptyDir } from "./deps.js";
import { map_async } from "./iterables.js";
import { hash_assets } from "./assets.js";
import { render } from "../lib/jsx/render.js";
import get_data from "./data.js";

let options = {
  assets_dir: "assets",
  pages_dir: "pages",
  out_dir: "_site",
};

let start = performance.now();
let count = 0;

/**
 * [1] Ensure _site dir exists
 */
await emptyDir("_site");

let assets = await hash_assets(options.assets_dir, options.out_dir);
assets.forEach(write_binary);

/**
 * [2] Generate all global data (e.g. parse blog post markdown)
 */
let global_data = await get_data();

/**
 * [3] Read pages/ dir to find all templates
 */
let files = walk(options.pages_dir, { includeDirs: false, exts: [".jsx"] });

/**
 * [4] Run all templates to write all pages
 */
await map_async(files, write_page);

let end = performance.now();
let time = end - start;

console.log(`\x1b[34m
🛎  Wrote ${count} pages in ${time}ms\x1b[39m`);

async function write_page(entry) {
  let { dir, name } = parse(entry.path);
  try {
    let path = new URL(entry.path, join(import.meta.url, ".."));
    let { default: page, ...data } = await import(path);
    let url = data.url || "/" + name + ".html";
    let props = { ...data, ...global_data, url };
    let result = await page(props);
    if (Array.isArray(result)) {
      result.forEach(async ({ component, url }) => {
        let content = render(component);
        await write_text(get_page(dir, url, content));
      });
    } else {
      let content = render(result);
      await write_text(get_page(dir, url, content));
    }
  } catch (error) {
    console.error(`Error writing ${entry.path}`);
    console.error(error);
  }
}

function get_page(dir, url, content) {
  if (url.endsWith(".html")) {
    content = "<!doctype html>\n" + content;
  }
  let path = join(dir.replace(options.pages_dir, options.out_dir), url);
  count++;
  return { path, content };
}

async function write_binary({ path, content }) {
  await Deno.mkdir(dirname(path), { recursive: true });
  await Deno.writeFile(path, content);
}

async function write_text({ path, content }) {
  await Deno.mkdir(dirname(path), { recursive: true });
  await Deno.writeTextFile(path, content);
}
