import { parse, join, dirname, walkSync } from "../deps.js";
import { render } from "../lib/jsx/render.js";
import { jsx, Fragment } from "../lib/jsx/jsx-runtime.js";
import get_data from "../data/data.js";

let start = performance.now();
let count = 0;

/**
 * [1] Ensure _site dir exists
 */
await Deno.mkdir("_site", { recursive: true });

/**
 * [2] Generate all global data (e.g. parse blog post markdown)
 */
let global_data = await get_data();

/**
 * [3] Read pages/ dir to find all templates
 */
let files = walkSync("pages", { includeDirs: false, exts: [".jsx"] });

/**
 * [4] Run all templates to write all pages
 */
await Promise.all(Array.from(files, write_page));

let end = performance.now();
let time = end - start;

console.log(`\x1b[34m
🛎  Wrote ${count} pages in ${time}ms\x1b[39m`);

/**
 *
 * @param {*} entry
 */
async function write_page(entry) {
  let { dir, name } = parse(entry.path);
  let path = new URL(entry.path, join(import.meta.url, ".."));
  let { default: page, layout = Fragment, ...data } = await import(path);
  let props = { ...data, ...global_data };
  let children = await page(props);
  if (Array.isArray(children)) {
    children.forEach(async ({ component, url, ...rest }) => {
      let child_props = { ...props, ...rest, children: component };
      let content = render(jsx(layout, child_props));
      await write_file(out_url(dir, url), content);
    });
  } else {
    let url = out_url(dir, data.url || name + ".html");
    let content = render(jsx(layout, { ...props, children }));
    await write_file(url, content);
  }
}

function out_url(dir, name) {
  return join(dir.replace("pages", "_site"), name);
}

async function write_file(url, content) {
  count++;
  await Deno.mkdir(dirname(url), { recursive: true });
  await Deno.writeTextFile(url, content);
}
