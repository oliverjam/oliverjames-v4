# My place on the web

This is my personal website, [oliverjam.com](https://oliverjam.com). It's where I experiment with some fun stuff and write blog posts. It is almost certainly over-engineered for the task of turning Markdown into HTML, since I wrote almost all the code from scratch. Currently (other than the Deno standard library) it has 3 external dependencies: `marked`, `yaml` and `prismjs`. I have no interest in writing a Markdown parser from scratch.

## Docs

The below documentation is mostly so I don't forget how everything works.

### Local development

1. Make sure you have Git and Deno installed
1. Clone this repo and `cd` into the directory
1. Run `deno task dev` to generate the `_site/` directory
1. In another terminal tab run `deno task serve` to serve the site

### Deploying

The `deploy.sh` script is a self-contained way to install Deno and build the site into `_site/`. This is currently run on Cloudflare Pages, but could easily be used on Netlify or in a GitHub Action or something. You just need to configure the platform to serve the `_site/` directory after building.

### Creating pages

Any `.jsx` file in the `pages/` directory will be generated as an HTML page. The default export of the module should be a function that returns JSX. This JSX will be the content of the generated HTML file. The final HTML path matches the page file path. For example `pages/index.jsx`:

```jsx
export default () => <h1>Home</h1>;
```

will generate `_site/index.html`:

```html
<h1>Home</h1>
```

The page module can export a `url` variable to override the final path. For example `pages/feed.jsx`:

```jsx
export let url = "feed.xml";
export default () => ...;
```

will generate `_site/feed.xml`.

#### Multiple pages from one template

A page module can generate many HTML pages by returning an _array_ from its default export. Each array item should be an object with `url` and `component` properties. Each item will generate its own HTML page. For example:

```jsx
export default () => {
  return [1, 2, 3].map((num) => ({
    url: num + ".html",
    component: <h1>{num}</h1>,
  }));
};
```

will generate `_site/1.html` containing `<h1>1</h1>`, `_site/2.html` containing `<h1>2</h1>`, and `_site/3.html` containing `<h1>3</h1>`.

To make this more obvious I have prefixed files that generate multiple pages with a `$`. E.g. `pages/$article.jsx` generates all the article pages.

### Content

`lib/data.js` reads all the markdown files in `content/` and parses the content to metadata + HTML. It also reads all CSS files in `styles/` so pages can inline the correct styles. Pages can import these—module caching means it should only run once per build.

#### Markdown

All `content/` files are rendered with the renderer in `lib/markdown.js`, which uses the `marked` parser. Headings have links and IDs added so they can be linked to, and code blocks are syntax highlighted using `prismjs`. Metadata is extracted from frontmatter and parsed using the `yaml` parser.

### Assets

Each file in `/assets` is copied through to `_site/assets` with a hash of its contents added to its filename. E.g. `assets/me.jpg -> _site/me.f5fd402f.jpg`. This ensures the path will change if the file contents do, allowing us to cache these files forever in the browser.

Components can import a map of original file names to final hashed paths, since they otherwise cannot know the true path. For example:

```jsx
import { ASSETS } from "../lib/assets.js"

function Avatar {
  return <img src={ASSETS.get("me.jpg")} alt="Me!" />
}
```

### Dev server

There is a minimal streaming static file server in `lib/serve.js` for use in development. This expects to be passed a directory to serve and will attempt to resolve HTTP requests to files in that directory. If it encounters an error it will attempt to serve `404.html` or `500.html` files (for missing file or general errors respectively), to match how Cloudflare Pages handles errors in production.

### JSX

There is a minimal JSX runtime in `lib/jsx`. Deno is configured to use this via the `compilerOptions` in `deno.json` and the import map in `import-map.json`. The renderer in `lib/jsx/render.js` attempts to recursively render JSX objects to HTML strings, with support for things like boolean attributes and void elements.
