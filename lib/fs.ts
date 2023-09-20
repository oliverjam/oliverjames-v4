import { exists, mkdir, readdir, rm } from "node:fs/promises";
import { dirname, join, parse, ParsedPath } from "node:path";
export { join };

export async function empty(dir: string) {
  if (await exists(dir)) {
    await rm(dir, { recursive: true });
  }
  await mkdir(dir);
}

type Dirent = { name: string; isDirectory(): boolean };
type Entry = ParsedPath & { path: string };

export async function walk(dir: string, cb: (entry: Entry) => Promise<void>) {
  let tasks: Array<Promise<void>> = [];
  async function _walk(_dir: typeof dir, _cb: typeof cb, _entry: Dirent) {
    if (!_entry.isDirectory()) {
      let result = parse(_dir);
      tasks.push(_cb({ ...result, path: _dir }));
    } else {
      let entries = await readdir(_dir, { withFileTypes: true });
      for (let e of entries) {
        await _walk(join(_dir, e.name), _cb, e);
      }
    }
  }
  await _walk(dir, cb, { name: dir, isDirectory: () => true });
  return Promise.all(tasks);
}

export async function write(path: string, content: string | ArrayBuffer) {
  await mkdir(dirname(path), { recursive: true });
  await Bun.write(path, content);
}
