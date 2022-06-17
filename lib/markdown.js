import { yaml, marked } from "../deps.js";

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

// let renderer = new marked.Renderer();
// renderer.heading = (text) => {
//   return text;
// };
