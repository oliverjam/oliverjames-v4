import { yaml, marked, prism } from "./deps.js";
import "https://esm.sh/prismjs@1.27.0/components/prism-bash";
import "https://esm.sh/prismjs@1.27.0/components/prism-css";
import "https://esm.sh/prismjs@1.27.0/components/prism-css-extras";
import "https://esm.sh/prismjs@1.27.0/components/prism-diff";
import "https://esm.sh/prismjs@1.27.0/components/prism-git";
import "https://esm.sh/prismjs@1.27.0/components/prism-ignore";
import "https://esm.sh/prismjs@1.27.0/components/prism-javascript";
import "https://esm.sh/prismjs@1.27.0/components/prism-js-templates";
import "https://esm.sh/prismjs@1.27.0/components/prism-json";
import "https://esm.sh/prismjs@1.27.0/components/prism-jsx";
import "https://esm.sh/prismjs@1.27.0/components/prism-markdown";
import "https://esm.sh/prismjs@1.27.0/components/prism-toml";
import "https://esm.sh/prismjs@1.27.0/components/prism-tsx";
import "https://esm.sh/prismjs@1.27.0/components/prism-typescript";
import "https://esm.sh/prismjs@1.27.0/components/prism-yaml";
import { ASSETS } from "../lib/assets.js";

let sprite = ASSETS.get("sprite.svg");

let renderer = {
  heading(text, n, raw, slugger) {
    let slug = slugger.slug(raw);
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
    data: yaml(fm),
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
