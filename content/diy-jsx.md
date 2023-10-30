---
kind: article
title: Writing a simple JSX to HTML renderer
tags:
  - jsx
  - html
date: 2023-10-30
intro: Most people associate JSX with React, but I really like using it as a general server-side templating language for creating HTML strings.
---

I decided to write my own JSX renderer to better understand how it works (and to have a simple library I could use in side projects). You can skip all my rambling about why I like JSX and [jump straight to the code](#building-my-own).

## What is JSX?

JSX is an extension to JavaScript that lets you write HTML-like syntax, which would usually be invalid. This was invented for React, to make it easier to create DOM elements declaratively:

```jsx
<h1 id="my-title">Hello world</h1>
```

JSX also provides a nice developer experience. Since it's embedded within JS you just use JS features to generate elements. I like not really having to shift mindsets as I jump from business logic to UI code. The popularity of React means JSX has great tooling support. For example syntax highlighting, autocompletion, warnings about accessibility errors.

That said, as much as I like JSX I don't want to write all my apps as React SPAs. Nowadays I default to [simple server-rendered apps](https://oliverjam.es/articles/simple-web-apps-bun). However I do still like using JSX to render HTML strings. This is nicer than using template literals, since they're just unstructured strings with none of the benefits listed above. It's also harder to compose components together, since function calls don't look like HTML. For example:

```jsx
html`
  <header>
    ${Title({ children: "Hello" })}
    <p>world</p>
  </header>
`

<header>
  <Title>Hello</Title>
  <p>world</p>
</header>
```

## How JSX works

We need to understand what's actually going on before we can write our own renderer. JSX is one of those things that seems magical because several things combine to create a smooth experience. In a standard React app rendering is a 3-step process:

1. JSX is "transpiled" to regular JS functions by a bundler
1. The function calls return objects
1. A special render function converts the object tree to DOM

Here's an example:

```jsx
let title = <h1>hello</h1>;
console.log(title);
```

We can't run this in the browser since JSX isn't valid JS. So we'll use [esbuild](https://esbuild.github.io/try/#dAAwLjE5LjUAeyBsb2FkZXI6ICJqc3giLCAianN4IjogImF1dG9tYXRpYyIgfQA8aDE+aGVsbG88L2gxPjs) to transpile it (convert it to actual JS):

```js
import { jsx } from "react/jsx-runtime";
let title = jsx("h1", { children: "hello" });
console.log(title);
```

You can see that JSX directly converts to simple functions. We can configure exactly what library the import comes from if we like, but for now let's stick with React. If we run this code we get this log output:

```json
{
  "type": "h1",
  "key": null,
  "ref": null,
  "props": {
    "children": "hello"
  },
  "_owner": null,
  "_store": {}
}
```

All the `jsx` function does is scaffold a simple object describing the element. If we had a more complex UI this object would have more objects nested inside the `children` property.

You can see that [React's `jsx` implementation](https://github.com/facebook/react/blob/0965fbcab3616523086d05c1069492cc171cbb80/packages/react/src/jsx/ReactJSXElement.js#L148) really doesn't do much more than construct a simple object (plus a bunch of dev-only checks).

Finally to put DOM elements on the page we would use React's `render` method to convert this object tree to real DOM elements on the page:

```js
import { createRoot } from "react-dom/client";

let title = jsx("h1", { children: "hello" });
createRoot(document.querySelector("#root")).render(title);
```

If instead we wanted to render an HTML string on the server we could do this:

```js
import { renderToString } from "react-dom/server";

let title = jsx("h1", { children: "hello" });
let html = renderToString(title);
// "<h1>hello</h1>"
```

This two-step process is necessary because React uses a _virtual DOM_ for rendering. This lets it compare the previous and next object trees to figure out just the bits it needs to update, so it doesn't have to change more of the DOM than necessary.

However on the server this overhead is not necessary, since our responses are one-off strings that get sent and never change. I was inspired by [kitajs/html](https://github.com/kitajs/html), which skips the render step entirely and just has a `jsx` function produce a string directly. Their code looks pretty complex though (I imagine for good reason), so I did what I always do and wrote my own way simpler version.

## Building my own

Let's define our requirements by checking how different snippets of JSX are transpiled by esbuild. We can then write tests to make sure our code works, make the test pass, then add more features. TDD!

Here's the simple case:

```jsx
<h1>Hello</h1>;
// ↓
jsx("h1", { children: "Hello" });
```

We need a `jsx` function that takes the tag name as a string, then an object containing the children as a string. We want this to return a string of valid HTML. Here's a test:

```js
test("simple", () => {
  let actual = jsx("h1", { children: "Hello" });
  expect(actual).toBe(`<h1>Hello</h1>`);
});
```

Let's implement that as simply as we can to make the test pass:

```js
function jsx(tag, props) {
  let { children } = props;
  return `<${tag}>${children}</${tag}>`;
}

export { jsx };
```

### Void elements

That works great. However I've just remembered that some HTML tags are _void_ elements. This means they don't use a closing tag because they cannot contain anything. For example `<input>`, not `<input></input>`. We should write a test to cover this:

```js
test("void elements", () => {
  let actual = jsx("input");
  expect(actual).toBe(`<input>`);
});
```

Unfortunately there's no magic way to tell which elements are void; we'll have to check a list.

```js
const VOIDS = new Set([
  "area",
  "base",
  "br",
  "col",
  "embed",
  "hr",
  "img",
  "input",
  "link",
  "meta",
  "source",
  "track",
  "wbr",
]);

function jsx(tag, props) {
  let { children = "" } = props;
  if (VOIDS.has(tag)) return `<${tag}>`;
  return `<${tag}>${children}</${tag}>`;
}
```

Sidenote: I originally had a big regexp here, but I performance tested it and the `Set` was 4 times faster ✨.

### Multiple children

Cool, now we'll try a more complex example with multiple children:

```jsx
<header>
  <h1>Hello</h1>
  <p>world</p>
</header>;
// ↓
jsxs("header", {
  children: [jsx("h1", { children: "Hello" }), jsx("p", { children: "world" })],
});
```

Looks like this passes the children as an array, and transpiles to a different function called `jsxs`, to allow implementations to handle this case separately. I think we can probably use the same function for both, and just alias the export.

Here's the new test:

```js
test("array children", () => {
  let actual = jsxs("header", {
    children: [
      jsx("h1", { children: "Hello" }),
      jsx("p", { children: "world" }),
    ],
  });
  expect(actual).toBe(`<header><h1>Hello</h1><p>world</p></header>`);
});
```

We can make this pass by making sure we join any array children back to a string:

```js
function jsx(tag, props) {
  // ...
  return `<${tag}>${join(children)}</${tag}>`;
}

function join(x) {
  return Array.isArray(x) ? x.join("") : x;
}

export { jsx, jsx as jsxs };
```

### HTML attributes

Now what happens if our elements have attributes?

```jsx
<h1 id="x">Hello</h1>;
// ↓
jsx("h1", { id: "x", children: "Hello" });
```

Here's a new test:

```js
test("attributes", () => {
  let void = jsx("input", { id: "x", type: "text" });
  expect(void).toBe(`<input id="x" type="text">`);
  let kids = jsx("h1", { id: "x", foo: false, children: "Hello" });
  expect(kids).toBe(`<h1 id="x">Hello</h1>`);
});
```

We'll need to loop over the non-children props and turn them into `key=value` pairs, whilst filtering out any falsy/null/undefined values:

```js
function jsx(tag, props) {
  let { children = "", ...rest } = props;
  let attrs = "";
  for (let [key, val] of Object.entries(props)) {
    if (v !== false && v != null) attrs += ` ${key}="${val}"`;
  }
  if (VOIDS.has(tag)) return `<${tag}${attrs}>`;
  return `<${tag}${attrs}>${join(children)}</${tag}>`;
}
```

HTML also has ["boolean attributes"](https://developer.mozilla.org/en-US/docs/Glossary/Boolean/HTML). These are not key/value pairs, but instead are either just present or not present. This means any prop with a value of `true` should be set as just the key.

```jsx
<h1 hidden>Hello</h1>;
// ↓
jsx("h1", { hidden: true, children: "Hello" });
```

We'll write a test:

```js
test("boolean attributes", () => {
  let actual = jsx("h1", { hidden: true, foo: false, children: "Hello" });
  expect(actual).toBe(`<h1 hidden>Hello</h1>`);
});
```

We'll add a line into our attributes loop to handle this:

```js
function jsx(tag: Type, props: Props) {
  // ...
  for (let [key, val] of Object.entries(rest)) {
    if (v === true) attrs += " " + key;
    // ...
  }
  // ...
}
```

### Custom components

We've pretty much covered all regular HTML now. It would be great to handle custom components too, since that's what makes composing UIs with JSX feel so nice.

```jsx
function Title({ children }) {
  return <h1>{children}</h1>;
}
<Title>Hello</Title>;
// ↓
function Title({ children }) {
  return jsx("h1", { children: "Hello" });
}
jsx(Title, { children: "Hello" });
```

We can see that rather than a string as the tag name we get passed the component function itself. We'll need to call this function and return the resulting HTML.

Here's a test:

```js
test("component", () => {
  function Title({ children }) {
    return jsx("h1", { children: "Hello" });
  }
  let actual = jsx(Title, { children: "Hello" });
  expect(actual).toBe(`<h1>Hello</h1>`);
});
```

We can add a check to the start of our implementation to handle this:

```js
function jsx(tag: Type, props: Props) {
  if (typeof tag === "function") return tag(props);
  // ...
}
```

### Fragments

The final feature we're missing is "fragments". Since JSX transpiles to nested function calls it requires a single top-level element (unlike HTML). Fragments allow us to render multiple elements without a parent:

```jsx
<>
  <div>hello</div>
  <div>world</div>
</>;
// ↓
jsxs(Fragment, {
  children: [
    jsx("div", { children: "hello" }),
    jsx("div", { children: "world" }),
  ],
});
```

Here we expect the fragment to render nothing in the HTML:

```js
test("fragment", () => {
  let actual = jsxs(Fragment, {
    children: [
      jsx("h1", { children: "Hello" }),
      jsx("p", { children: "world" }),
    ],
  });
  expect(actual).toBe(`<h1>Hello</h1><p>world</p>`);
});
```

We need to create a separate export for this that just renders its children (which will either be a string or array of strings):

```js
function Fragment(props) {
  return join(props.children);
}

export { jsx, jsx as jsxs, Fragment };
```

## Wrapping up

That's it! Here's our entire JSX-to-HTML implementation in only 18 lines of code!

<!-- prettier-ignore-start -->
```js
const VOIDS = new Set([ "area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "source", "track", "wbr"]);

function jsx(tag, props) {
  if (typeof tag === "function") return tag(props);
  let attrs = "";
  let { children = "", ...rest } = props;
  for (let [key, val] of Object.entries(rest)) {
    if (v === true) attrs += " " + key;
    else if (v !== false && v != null) attrs += ` ${key}="${val}"`;
  }
  if (VOIDS.has(tag)) return `<${tag}${attrs}>`;
  return `<${tag}${attrs}>${join(children)}</${tag}>`;
}

function Fragment(props) {
  return join(props.children);
}

export { jsx, jsx as jsxs, Fragment };
```
<!-- prettier-ignore-end -->
