import { ServerWebSocket } from "bun";
import { extname, join } from "node:path";

declare global {
  var clients: Set<ServerWebSocket<unknown>>;
}

// globalThis persists across hot reloads
// When an HTML page is rendered it connects to the socket server.
// It gets added to clients and told to reload every time this file re-runs
globalThis.clients ??= new Set();
globalThis.clients.forEach((c) => c.send(""));

export function statik(dir: string = ".") {
  let socket = Bun.serve({
    fetch(req, server) {
      if (server.upgrade(req)) return;
      return new Response("WebSocket error", { status: 500 });
    },
    websocket: {
      async open(ws) {
        clients.add(ws);
      },
      async close(ws) {
        clients.delete(ws);
      },
      async message(ws, message) {},
    },
    port: 0,
  });

  async function handle(url: URL) {
    let path = join(dir, url.pathname);
    let ext = extname(path);
    let isPage = ext === ".html" || ext === "";
    if (isPage) {
      if (path.endsWith("/")) path = join(path, "index.html");
      else if (ext !== ".html") path += ".html";
      let readable = Bun.file(path).stream();
      let transformer = inject_script(socket.port);
      return html(readable.pipeThrough(transformer));
    } else {
      let file = Bun.file(path);
      if (await file.exists()) return new Response(file);
      else return html("<h1>Not found</h1>", 404);
    }
  }

  let http = Bun.serve({
    async fetch(req) {
      let url = new URL(req.url);
      log(`⬆︎ ${req.method} ${url.pathname}`);
      let response = await handle(url);
      log(`⬇︎ ${response.status}`);
      return response;
    },
    error(e) {
      console.error(e);
      log(`⬇︎ 500`);
      return html("<!doctype html><h1>Server error</h1>", 500);
    },
  });
  console.log(`Running on http://localhost:${http.port}`);
  return http;
}

function inject_script(port: number) {
  return new TransformStream({
    // flush runs at the end of the writer
    flush(controller) {
      controller.enqueue(
        `<script>new WebSocket("ws://localhost:${port}").onmessage = () => location.reload()</script>`,
      );
    },
  });
}

function html(body: string | ReadableStream, status = 200) {
  return new Response(body, {
    status,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}

function log(msg: string) {
  let time = new Date().toLocaleTimeString("en-GB");
  console.log(time + " " + msg);
}

if (import.meta.main) {
  statik(process.argv[2]);
}
