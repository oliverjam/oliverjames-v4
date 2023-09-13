---
kind: article
title: Build simpler web apps using Bun
tags:
  - bun
  - html
  - js
date: 2023-09-13
intro: Modern JavaScript runtimes make it quick to throw together server-rendered web apps using almost no external dependencies, relying on web standard APIs.
---

[Bun](https://bun.sh/) is a new JavaScript runtime that aims to be more fully-featured and compliant with web standards than Node has historically been. For example it comes with a [test runner](https://bun.sh/docs/cli/test), [JSX](https://bun.sh/docs/runtime/jsx) & [TypeScript](https://bun.sh/docs/runtime/typescript) support, an [HTTP server](https://bun.sh/docs/api/http#bun-serve) based on `fetch`, [SQLite storage](https://bun.sh/docs/api/sqlite), [password hashing](https://bun.sh/docs/api/hashing), and other [convenient](https://bun.sh/docs/api/utils#bun-escapehtml) tools.

It's worth noting that although I'm focusing on Bun here, [Deno](https://deno.com/) has most of these features (as does [Cloudflare Workers](https://workers.cloudflare.com/), if you don't mind being locked into a platform). Also this competition has pushed Node to improve, so as of Node 18 it has a built-in [test runner](https://nodejs.org/api/test.html) and support for [`fetch`](https://nodejs.org/api/globals.html#fetch).

## Hello world

Lets do a quick comparison between Node and Bun to render an HTML page. We'll use ES Modules since that's the modern standard (and Node supports it fine now). I'll try to write the most minimal version of each, just for fun.

Here's Node:

```js
import { createServer } from "node:http";

let server = createServer((req, res) => res.end(`<h1>Hello</h1>`));
server.listen(3000, () => console.log(`Running http://localhost:3000`));
```

Here's Bun:

```js
let server = Bun.serve({ fetch: (req) => new Response(`<h1>Hello</h1>`) });
console.log(`Running http://localhost:${server.port}`);
```

We can see that Bun uses modern web standards (like returning a JS `Response` object), rather than relying on APIs that only work in one specific runtime.

It's a good idea to define your application code separately from the server config (e.g. so you can test the app without starting the server), so from here on I'll be defining the app as a separate function without the `Bun.serve()` bit. All the following code will be executed like this:

```js entry.js
import { app } from "./app.jsx";

let server = Bun.serve({ fetch: app });
console.log(`Running http://localhost:${server.port}`);
```

## JSX is nice

Template literal strings are honestly pretty decent for throwing together HTML, but can get frustrating for non-trivial UIs that you want to break up into smaller components. Template literals require you to just chuck a bunch of function calls into your HTML, which sort of ruins my flow when my brain is in "HTML-mode".

```js
function app(req) {
  return new Response(`
    <nav>
      <ul>
        <li>
          ${NavLink({ children: "Home", href: "/" })}
        </li>
        <li>
          ${NavLink({ children: "About", href: "/about" })}
        </li>
        <li>
          ${NavLink({ children: "Contact", href: "/contact" })}
        </li>
      </ul>
    </nav>
  `);
}
```

JSX makes this a lot cleaner, and in my experience encourages better structure for your UI code.

```jsx
function app(req) {
  return new Response(
    (
      <nav>
        <ul>
          <li>
            <NavLink href="/">Home</NavLink>
          </li>
          <li>
            <NavLink href="/about">About</NavLink>
          </li>
          <li>
            <NavLink href="/contact">Contact</NavLink>
          </li>
        </ul>
      </nav>
    )
  );
}
```

JSX also allows you to benefit from the wonderful world of JS-tooling. Since your HTML is defined as JS functions it can be checked by a linter or type system, which helps you avoid mistakes or accessibility problems. Template literals are just opaque strings from the perspective of your tooling.

(I know you could use a traditional templating language like Handlebars or Mustache and probably some kind of separate HTML linter, but honestly now that I've tasted "just use JS for templating" I can't go back.)

### Configuring JSX

To use JSX in Node you pretty much have to transpile your server code back to regular JS with something like Babel, ESBuild or SWC. There are libraries like [`@babel/node`](https://babeljs.io/docs/babel-node) but they aren't great for production usage. This ends up being such a faff that I never bother.

Bun supports JSX syntax _natively_, however by default it expects you to be using React, converting JSX like `<h1>Hello</h1>` into `React.createElement("h1", {}, "hello")`.

For simple server-side apps I prefer [`@kitajs/html`](https://github.com/kitajs/html). Rather than constructing your UI as objects that must be converted to strings when you send a response, this turns the JSX directly into a string, saving a step.

JSX conversion is configured either in the specific config file for the runtime (`bunfig.toml`), or in a `tsconfig.json`/`jsconfig.json`. We'll use the latter since we want to keep this project runtime agnostic.

```json jsconfig.json
{
  "compilerOptions": {
    "jsx": "react",
    "jsxFactory": "Html.createElement",
    "jsxFragmentFactory": "Html.Fragment"
  }
}
```

Now `<h1>Hello</h1>` will be converted to `Html.createElement("h1", {}, "hello")` (which returns an HTML string). We need to install the dependency with `bun add @kitajs/html`, then import `Html` wherever we use JSX.

```jsx
import Html from "@kitajs/html";

export function app(req) {
  return new Response(<h1>Hello</h1>);
}
```

## Counter app

Lets make something _slightly_ more involved. The traditional example for client-side frameworks seems to be a basic counter, so lets make one of those server-side.

### Basic routing

Our app needs at least two routes: the home page should show the counter UI, and all other requests should get a 404 for now.

```jsx
import Html from "@kitajs/html";

export function app(req) {
  let { pathname } = new URL(req.url);
  switch (pathname) {
    case "/":
      return new Response("<!doctype html>" + <h1>Hello</h1>, {
        headers: { "content-type": "text/html; charset=utf-8" },
      });
    default:
      return new Response("<!doctype html>" + <h1>Not found</h1>, {
        status: 404,
        headers: { "content-type": "text/html; charset=utf-8" },
      });
  }
}
```

(we need the `<!doctype html>` in our response to avoid browsers rendering the page in [quirks mode](https://developer.mozilla.org/en-US/docs/Web/HTML/Quirks_Mode_and_Standards_Mode).)

There's a lot of boilerplate for rendering HTML responses being repeated, so lets extract a quick helper function:

```jsx
import Html from "@kitajs/html";

export function app(req) {
  let { pathname } = new URL(req.url);
  switch (pathname) {
    case "/":
      return send(<h1>Hello</h1>);
    default:
      return send(<h1>Not found</h1>, 404);
  }
}

function send(body, status = 200) {
  return new Response("<!doctype html>" + body, {
    status,
    headers: { "content-type": "text/html; charset=utf-8" },
  });
}
```

### Counter UI

Okay, now we can actually start building our app. Since this is entirely server-rendered we can't rely on client-side JS, which means we need to use `<form>`s for any interactivity. In the React world it's so easy to forget how much the browser can handle for us.

```jsx
let count = 0;

export function app(req) {
  let { pathname } = new URL(req.url);
  switch (pathname) {
    case "/":
      return send(
        <form method="POST">
          <button name="diff" value="-1" aria-label="decrement">
            -
          </button>
          <output>{count}</output>
          <button name="diff" value="+1" aria-label="increment">
            +
          </button>
        </form>
      );
    // ...
  }
}
```

This form contains two different submit buttons. This means the form can send two different requests depending on which button is clicked. The decrement button will send a `POST` request to `/` with a body of `diff=-1`, whereas the increment button will send a body of `diff=+1`.

We'll just store the count in a variable for now. It will get reset whenever our server restarts, but that's fine for a demo. If we wanted it to persist we could store it in a cookie.

### Count updates

Now we need to handle POST requests. The server should update the `count` variable by the amount specified in the request body, then redirect back to the home page so the user sees the updated UI.

```jsx
let count = 0;

export async function app(req) {
  switch (req.url) {
    case "/":
      if (req.method === "GET") return send(/*...*/);
      if (req.method === "POST") {
        let body = await req.formData();
        let diff = body.get("diff");
        count += Number(diff ?? 0);
        return new Response("", {
          status: 303,
          headers: { location: "/" },
        });
      }
    // ...
  }
}
```

Note that we had to make `app` an async function, since the methods for parsing request bodies return promises. Note also that this is an entirely standardised and built-in way to extract the body—no middleware or external dependencies required.

We return a redirect using the exact same API as the other responses, just specifying the right status code and location header so the browser knows how to handle it.

And that's it! A robust server-rendered counter app in under 50 lines of JS(X). Let's see if we can do something a bit more complicated.

## Tasks app

The next step for every framework demo after a counter is tasks. This will be a little more complex and stateful.

### SQLite storage

We need somewhere to store tasks. We could just keep them in memory like the count in the previous example, but lets push ourselves to do something more robust. SQLite is a great database, and Bun just so happens to have a driver built in.

We'll create a database and execute some SQL to create a table for storing tasks:

```js
import { Database } from "bun:sqlite";

const db = new Database("tasks.sqlite");
db.run(`
  create table if not exists tasks (
    id integer primary key autoincrement,
    task text not null,
    created text default current_timestamp
  )
`);
```

Running this will create a new file named `tasks.sqlite` in our working directory.

We can now write SQL statements to create, list and remove tasks:

```js
let _create_ = db.query(`insert into tasks (task) values (?)`);
let create = (task) => _create.run(task);

let _list = db.query(`select * from tasks order by created desc`);
let list = () => _list.all();

let _remove = db.query(`delete from tasks where id = ?`);
let remove = (id) => _remove.run(id);
```

We create the statements outside the functions, so they can be cached and reused for better performance.

### Tasks UI

Now lets put together a nice HTML form for adding new tasks. We'll stick to the rough routing structure from the counter example.

```jsx
export async function app(req) {
  let { pathname } = new URL(req.url);
  switch (pathname) {
    case "/":
      if (req.method === "GET") {
        return send(
          <main>
            <h1>Tasks</h1>
            <form method="POST">
              <input name="task" aria-label="Your task" />
              <button aria-label="Add task">+</button>
            </form>
          </main>
        );
      }
      if (req.method === "POST") {
        // @todo
      }
    default:
      return send(<h1>Not found</h1>, 404);
  }
}
```

### Task updates

Now we need to handle the form submission, read the POST body, then save the task to the DB:

```jsx
export async function app(req) {
  // ...
  switch (pathname) {
    case "/":
      // ...
      if (req.method === "POST") {
        let body = await req.formData();
        let task = body.get("task");
        create(task);
        return new Response("", {
          status: 303,
          headers: { location: "/" },
        });
      }
    // ...
  }
}
```

We can now save tasks, but they don't show up in the UI. We need to read them from the DB, then render as a list:

```jsx
export async function app(req) {
  // ...
  switch (pathname) {
    case "/":
      if (req.method === "GET") {
        let tasks = list();
        return send(
          <main>
            <h1>Tasks</h1>
            <form method="POST">
              <input name="task" aria-label="Your task" />
              <button aria-label="Add task">+</button>
            </form>
            <ol>
              {tasks.map((t) => (
                <li>{t.task}</li>
              ))}
            </ol>
          </main>
        );
      }
    // ...
  }
}
```

### Task removal

Finally we need to add a delete button to each task. There are a couple of ways we could structure this:

1. Add a form with its own submit button to each list item
1. Add a single form around the entire list

I'm going to do the second, purely because it'll have a bit less repetition.

```jsx
export async function app(req: Request) {
  // ...
  switch (pathname) {
    case "/":
      if (req.method === "GET") {
        let tasks = list();
        return send(
          <main>
            {/* ... */}
            <form method="POST" action="/remove">
              <ol>
                {tasks.map((t) => (
                  <li>
                    <span>{t.task}</span>
                    <button name="id" value={t.id} aria-label="Remove task">
                      &times;
                    </button>
                  </li>
                ))}
              </ol>
            </form>
          </main>
        );
      }
    // ...
  }
}
```

Clicking the delete button next to each task will send a POST request to `/remove`. The body will be `id=1`, with the value changing for each task depending on what button was clicked.

Finally we need to handle the POST request on the server. We should read the body, get the ID of the task to be deleted, then remove it from the DB and redirect back to the home page.

```jsx
export async function app(req: Request) {
  // ...
  switch (pathname) {
    case "/":
      // ...
    case "/remove":
      if (req.method === "POST") {
        let body = await req.formData();
        let id = body.get("id");
        remove(id as string);
        return new Response("", {
          status: 303,
          headers: { location: "/" },
        });
      }
    // ...
  }
}
```

And that's it! A speedy server-rendered tasks app that persists information to a proper database in under 100 lines of JS(X).

## A simpler world

I honestly love building apps like this. A fast, simple, batteries-included runtime plus SQLite can make quickly a breeze. You obviously lose out on dynamic client-side interactivity, so look out for my next post when we start progressively enhancing these forms.
