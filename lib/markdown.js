import { yaml, marked, prism } from "../deps.js";
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

let renderer = {
  heading(text, n, raw, slugger) {
    let slug = slugger.slug(raw);
    return `
    <h${n} id="${slug}"><a class="hash" href="#${slug}">${text}</a></h${n}>`;
  },
  code(code, lang) {
    let grammar = lang && prism.languages[lang];
    if (grammar) {
      let highlighted = prism.highlight(code, grammar, lang);
      return `<pre class="language-${lang}"><code>${highlighted}</code></pre>`;
    } else {
      return `<pre><code>${code}</code></pre>`;
    }
  },
};

marked.use({ renderer });

export function markdown(raw) {
  let { fm, md } = frontmatter(raw);
  return {
    data: yaml(fm),
    content: marked.parse(md),
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
