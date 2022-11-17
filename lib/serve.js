import { extname, join } from "./deps.js";

let mimes = new Map()
  .set(".txt", "text/plain; charset=UTF-8")
  .set(".html", "text/html; charset=UTF-8")
  .set(".xml", "text/xml; charset=UTF-8")
  .set(".xsl", "text/xsl; charset=UTF-8")
  .set(".css", "text/css; charset=UTF-8")
  .set(".js", "application/js; charset=UTF-8")
  .set(".svg", "image/svg+xml; charset=UTF-8")
  .set(".jpg", "image/jpeg; charset=UTF-8")
  .set(".jpeg", "image/jpeg; charset=UTF-8")
  .set(".png", "image/png; charset=UTF-8")
  .set(".ico", "image/x-icon");

function serve_static(dir) {
  return (request) => {
    let url = new URL(request.url);

    let time = new Date().toLocaleTimeString("en-GB");
    console.log(`${time} ${request.method} ${url.pathname}`);

    let path = url.pathname.endsWith("/")
      ? url.pathname + "index"
      : url.pathname;

    let ext = extname(path);
    if (!ext) {
      ext = ".html";
      path += ext;
    }

    return file(dir, path, ext)
      .then(send)
      .catch((e) => new Response(e, { status: 500 }));
  };
}

async function file(dir, path, ext) {
  try {
    let file = await Deno.open(join(dir, path), { read: true });
    let mime = mimes.get(ext) || mimes.get(".txt");
    return { mime, stream: file.readable, status: 200 };
  } catch (e) {
    let status = e.code === "ENOENT" ? 404 : 500;
    let file = await Deno.open(join(dir, status + ".html"), { read: true });
    return { mime: mimes.get(".html"), stream: file.readable, status };
  }
}

function send({ stream, mime, status }) {
  return new Response(stream, { status, headers: { "content-type": mime } });
}

const DIR = Deno.args[0];

if (!DIR) {
  console.error("Expected a directory argument");
  Deno.exit(1);
}

Deno.serve(serve_static(DIR));
