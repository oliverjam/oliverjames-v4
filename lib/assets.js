import { join, dirname, basename, walk, extname } from "./deps.js";
import { map_async } from "./iterables.js";
import { hash_file } from "./hash.js";

export let ASSETS = new Map();

export function hash_assets(indir, outdir) {
  let files = walk(indir, { includeDirs: false });
  return map_async(files, async ({ path }) => {
    let content = await Deno.readFile(path);
    let hash = await hash_file(content);
    let dir = dirname(path);
    let subdir = dir.replace(/assets\/?/, "");
    let ext = extname(path);
    let base = basename(path);
    let name = base.replace(ext, "");
    let hashed_name = name + "." + hash + ext;
    let out = join(outdir, dir, hashed_name);
    ASSETS.set(join(subdir, base), join("/", dir, hashed_name));
    return { name, content, path: out };
  });
}
