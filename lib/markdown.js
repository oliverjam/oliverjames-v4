import yaml from "js-yaml";
import { marked } from "marked";
import prism from "prismjs";
import "prismjs/components/prism-bash";
import "prismjs/components/prism-css";
import "prismjs/components/prism-css-extras";
import "prismjs/components/prism-diff";
import "prismjs/components/prism-git";
import "prismjs/components/prism-ignore";
import "prismjs/components/prism-javascript";
import "prismjs/components/prism-js-templates";
import "prismjs/components/prism-json";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-markdown";
import "prismjs/components/prism-toml";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-yaml";
import { ASSETS } from "./assets.js";
import { slugify } from "./slugify.js";

let sprite = ASSETS.get("sprite.svg");

let renderer = {
  heading(text, n, raw, slugger) {
    let slug = slugify(raw);
    return `
      <h${n} id="${slug}"><a class="hash" href="#${slug}" aria-label="Link to heading"></a>${text}</h${n}>
    `;
  },
  code(code, info = "") {
    let [lang, file] = info.split(" ");
    let grammar = lang && prism.languages[lang];
    let highlighted = grammar ? prism.highlight(code, grammar, lang) : code;
    return `<div class="Code">
      ${
        file
          ? `<p class="CodeFile">
        <svg width="12" height="12" aria-hidden="true">
          <use href="${sprite}#file" />
        </svg>
        ${file}
      </p>`
          : ""
      }
      <pre><code class="CodeSyntax">${highlighted}</code></pre>
    </div>`;
  },
  image(_src, _title, _alt) {
    let motion = _src.endsWith(".mp4");
    let src = ASSETS.get(_src);
    if (motion) {
      return `<video src=${src} controls autoplay muted loop playsinline></video>`;
    } else {
      let title = _title ? ` title="${_title}"` : "";
      let alt = _alt ? ` alt="${_alt}"` : "";
      return `<img src="${src}"${alt}${title}>`;
    }
  },
};

marked.use({ renderer });

export function markdown(raw) {
  let { fm, md } = frontmatter(raw);
  return {
    data: yaml.load(fm),
    content: marked.parse(md),
    raw: md,
  };
}

function frontmatter(raw) {
  const [first, ...lines] = raw.split(/\n/);
  if (first !== "---") return "";
  let fm = "";
  let md = "";
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (line === "---") {
      md = lines.slice(i + 1).join("\n");
      break;
    }
    fm += line + "\n";
  }
  return { fm, md };
}
