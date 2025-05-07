import { FSWatcher, watch } from "node:fs";
import { build } from "./build.ts";
import { statik } from "./statik.ts";

declare global {
  var watch_assets: FSWatcher;
  var watch_content: FSWatcher;
  var watch_styles: FSWatcher;
}

async function dev() {
  let result = await build();
  globalThis.watch_assets?.close();
  globalThis.watch_content?.close();
  globalThis.watch_styles?.close();
  globalThis.watch_assets = watch("assets", { recursive: true }, reload);
  globalThis.watch_content = watch("content", { recursive: true }, reload);
  globalThis.watch_styles = watch("styles", { recursive: true }, reload);
  await statik(result);
}

async function reload() {
  await build();
  globalThis.clients.forEach((c) => c.send(""));
}

if (import.meta.main) {
  await dev();
}
