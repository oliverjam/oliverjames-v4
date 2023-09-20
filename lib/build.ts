import { empty, join, walk, write } from "./fs.js";
import { render } from "./jsx/render.js";
import { ASSETS } from "./assets.js";
// import "./data.js"; // preload to avoid unitialised variable errors

let opts = {
  assets_dir: "assets",
  pages_dir: "pages",
  out_dir: "_site",
};

try {
  console.log("testing");

  throw new Error("also testing");
  // let start = performance.now();
  // let count = 0;

  await empty("_site");

  // let assets = walk(opts.assets_dir, async ({ path, dir, name, ext, base }) => {
  //   let content = await Bun.file(path).arrayBuffer();
  //   let hash = Bun.hash(content);
  //   let subdir = dir.replace(/assets\/?/, "");
  //   let hashed_name = name + "." + hash + ext;
  //   let out = join(opts.out_dir, dir, hashed_name);
  //   ASSETS.set(join(subdir, base), join("/", dir, hashed_name));
  //   await write(out, content);
  // });

  // let pages = walk(opts.pages_dir, async (entry) => {
  //   try {
  //     let path = new URL(entry.path, join(import.meta.url, ".."));
  //     let { default: page, ...data } = await import(path.toString());
  //     let url = data.url || "/" + entry.name + ".html";
  //     let props = { ...data, url };
  //     let result = await page(props);
  //     if (Array.isArray(result)) {
  //       result.forEach(async ({ component, url }) => {
  //         let content = render(component);
  //         await write_page(entry.dir, url, content);
  //       });
  //     } else {
  //       let content = render(result);
  //       await write_page(entry.dir, url, content);
  //     }
  //   } catch (error) {
  //     console.error(`Error writing ${entry.path}`);
  //     console.error(error);
  //   }
  // });

  // let icon_in = Bun.file("favicon.ico");
  // let icon_out = Bun.file(join(opts.out_dir, "favicon.ico"));
  // let icon = Bun.write(icon_out, icon_in);

  // function write_page(dir: string, url: string, content: string) {
  //   if (url.endsWith(".html")) {
  //     content = "<!doctype html>\n" + content;
  //   }
  //   let path = join(dir.replace(opts.pages_dir, opts.out_dir), url);
  //   count++;
  //   return write(path, content);
  // }

  // await Promise.all([assets, pages, icon]);
  // let end = performance.now();
  // let time = Math.round(end - start);
  // console.log(`\x1b[34m🛎  Wrote ${count} pages in ${time}ms\x1b[39m`);
} catch (e) {
  if (e instanceof Error) console.log(e.message);
  console.log("Can I log inside a catch?");
  console.error("\x1b[31m🚨 Failed to complete build");
  console.error(e);
  process.exit(1);
}
