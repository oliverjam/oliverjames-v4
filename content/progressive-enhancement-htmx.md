---
kind: article
title: Simple progressively enhanced web apps
tags:
  - htmx
  - html
  - js
date: 2023-10-18
intro: The HTMX library is getting a lot of hype lately. I thought I'd experiment with using a similar HTML-first API to progressively enhance server-rendered HTML.
---

This is a follow-up to my last article on [building simple server-rendered web apps](/articles/simple-web-apps-bun). We're going to enhance the user-experience of these apps with a little bit of client-side JS. If you want to skip the history lesson you can [jump to the fun code](#building-our-own-mini-htmx).

## The lost art of progressive enhancement

Progressive enhancement is the idea that you should layer more powerful features on top of functional basics. For example starting with a regular HTML form, then adding JS to intercept submits and update the page selectively rather than doing a full browser navigation.

A long time ago this was a pretty standard practice, since it was the only way to build more complex web apps. However as the JavaScript language and DOM APIs improved, full client-side frameworks like Knockout.js (2010), Ember.js (2011) and React (2013) emerged that allowed devs to build an entire app client-side. This paradigm became known as a "Single-Page App" (SPA), since the server only had to provide a single HTML page—the first one. Everything after that was rendered client-side by assembling fetched data with client-side templates.

Unfortunately the rise of SPAs meant the death of progressive enhancement. Almost by definition you can't progressively enhance without server-rendering. There is no "minimum viable experience" before JS loads, parses and runs—just a blank white page that eventually (hopefully) gets populated with content.

Developers got used to just slapping a click handler on a button (since `<button onClick={}>` is _so_ convenient in React), and collectively forgot that forms had helpful behaviour if you didn't `e.preventDefault()` them.

## What's old is new again

Progressive enhancement is making a comeback as frameworks like [Remix](https://remix.run/) and [SvelteKit](https://kit.svelte.dev/) provide simple APIs for interactivity where the easiest thing for devs to do is start with simple forms and links. For people not using JS metaframeworks as their backend the [HTMX](https://htmx.org/) library has leapt into the spotlight.

## HTMX

HTMX is a library for adding interactivity without writing your own JavaScript. It hooks into a set of declarative attributes in your HTML. These attributes coordinate behaviour like "fetch a fragment of HTML from this URL and insert it into this element". This is a surprisingly nice way to sprinkle enhancements into an app that is already functional the old-fashioned way.

Interestingly HTMX is not particularly focused on progressive enhancement. The docs encourage patterns that are entirely reliant on JS:

```html
<button hx-post="/clicked" hx-swap="outerHTML">Click Me</button>
```

However it has a subset of features for enhancing links and forms that are perfect for enhancement: [boosting](https://htmx.org/docs/#boosting). Adding `hx-boost` to links or forms opts in to a form of client-side routing (clicking/submitting will prevent the default behaviour and swap the new page into the `<body>`, avoiding a full page reload). Combining this with the [`hx-target`](https://htmx.org/attributes/hx-target/) attribute allows you to update specific subsets of the page following user interaction.

## Building our own mini-HTMX

HTMX is kind of huge and complex, because it supports a ton of features I don't need (and IE11!). My favourite way to learn something properly is to rebuild a small part of it in a simpler way, so lets see how we could recreate the bits of HTMX we need.

We'll start with the basic counter from [the previous article](/articles/simple-web-apps-bun#counter-app) and work our way up to full progressive enhancement. Here's the form we want to enhance:

```html
<form method="POST">
  <button name="diff" value="-1" aria-label="decrement">-</button>
  <output>{count}</output>
  <button name="diff" value="+1" aria-label="increment">+</button>
</form>
```

When the server receives the form's `POST` request it increments the count and redirects back to the same page. The browser reloads the entire page, which results in the new count showing in the `<output>`.

![](media/default-counter.mp4)

Note how the page refreshes after each click, resetting the timer and losing focus from the button.

### Boosting forms

First we need to recreate exactly what the browser does when the form is submitted, only using our own JavaScript. The first step is to listen for form submissions and prevent the default behaviour if there's a `data-boost` attribute set on the element.

```js
document.addEventListener("submit", async (event) => {
  let { boost } = event.target.dataset;
  if (boost !== undefined) {
    event.preventDefault();
  }
});
```

Since submit events bubble up we can just attach a single listener to the entire document to check all submissions. Any that aren't boosted will be ignored.

We now need to send a request to the server that matches what the browser would normally send. That means matching the `action` URL and `method` (we'll ignore `enctype` for simplicity). We'll write it as a separate function since this code is pretty self-contained:

```js
function submit(event) {
  let { action, method } = event.target;
  let headers = { "content-type": "application/x-www-form-urlencoded" };
  let data = new FormData(event.target, event.submitter);
  let body = new URLSearchParams(data);
  return fetch(action, { method, headers, body });
}
```

<details>
<summary>There are a few of fun sidenotes here.</summary>

First, I literally have to google the correct `content-type` for form submissions _every time_. I really hope there was a good reason `application/x-www-` was a necessary prefix.

Second, we can easily grab all the data from the form's inputs using the [`FormData` interface](https://developer.mozilla.org/en-US/docs/Web/API/FormData). I use this a lot, but I'd never used the second argument to the constructor—this is the button that _submitted_ the form. You have to pass this separately as there can be multiple buttons, but only the one used to submit is included in the payload, so this varies per submission event.

Third, although you _can_ pass an instance of `FormData` as the request body, TypeScript will complain since it can contain values that are strings _or_ blobs (because forms support file uploads). Blobs can't be encoded like this (we'd have to use a multipart form), so TS helpfully warns us. Since we are deliberately not supporting files we can use `URLSearchParams` to encode the data as `?key=value` pairs. If there were files we'd just end up with the file name strings as the values.

</details>

Finally we need to actually send the request, then update the page by swapping the body with the response's body. We can turn the textual HTML response into a DOM using `DOMParser`, then extract the body:

```js
// ...
event.preventDefault();
let res = await submit(event);
let body = await res.text();
let new_dom = new DOMParser().parseFromString(body, "text/html");
document.body.replaceChildren(...new_dom.body.childNodes);
// ...
```

Fantastic! We've written 18 lines of JS to achieve... the exact behaviour the browser already had (but with more bugs). However now that our code controls the process we can start to add enhancements.

### Targeting

Currently page state is lost on reload—if a keyboard user had focused a button they'll have to tab their way back to it to continue incrementing the count

Ideally we want to surgically update just the bit of the page we know has changed, so the user doesn't lose their place and the app feels more "dynamic". Lets implement a simple version of HTMX's [`hx-target`](https://htmx.org/attributes/hx-target/). It should let us specify a CSS selector for the element that should be updated, like this:

<!-- prettier-ignore-start -->
```html
<form method="POST" data-boost data-target="output">
```
<!-- prettier-ignore-end -->

```js
document.addEventListener("submit", async (event) => {
  let { boost, target } = event.target.dataset;
  if (boost !== undefined) {
    // ...
    let replacee = target ? document.querySelector(target) : document.body;
    replacee.replaceChildren(...new_dom.body.childNodes);
  }
});
```

Unfortunately this is now broken—we're replacing the content of the `<output>` with the _entire body_ of the response. There are two ways to fix this.

### Redundant responses

We don't _need_ to send the entire new page when we receive a `fetch` request. Our server knows that the `<output>` will be updated in-place, and can send the minimal content required for the update.

HTMX sets custom headers like `HX-Request` and `HX-Boosted` so your server can customise its responses. However nowadays we can use the [`sec-fetch-dest`](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Sec-Fetch-Dest) header. The browser will set this to `document` for navigations from links or forms, and `empty` for `fetch` requests. So we can send different responses for the JS vs no-JS cases:

```js
// ...
if (req.headers.get("sec-fetch-dest") === "empty") {
  return new Response(count, { headers: { "content-type": "text/html" } });
} else {
  return new Response("", { status: 303, headers: { location: "/" } });
}
```

The response is a bit of a hack here—we're sending invalid HTML (literally just a single digit), but browsers don't seem to care when parsing—the value of `new_dom.body` will be `"1"` (or whatever the count was).

### Selecting

If you aren't willing (or are unable) to change your server response, HTMX supports extracting a subset of the HTML response using [`hx-select`](https://htmx.org/attributes/hx-select/). Lets implement a simple version so we can grab the `<output>` from the response like this:

<!-- prettier-ignore-start -->
```html
<form method="POST" data-boost data-target="output" data-select="output">
```
<!-- prettier-ignore-end -->

```js
document.addEventListener("submit", async (event) => {
  let { boost, target, select } = event.target.dataset;
  if (boost !== undefined) {
    // ...
    let replacee = target ? document.querySelector(target) : document.body;
    let replacer = select ? new_dom.querySelector(select) : new_dom.body;
    replacee.replaceChildren(...replacer.childNodes);
  }
});
```

Either method here works—our client-side JS can now update just the parts of the DOM we need based on declarative attributes in the HTML. We don't even have to change anything about our server if we don't want to. This is a pretty powerful model!

![](media/boosted-counter.mp4)

Note how the timer keeps counting without interruption, and focus remains on the button.

### Swapping

HTMX has a couple more features that make it possible to build even more dynamic UIs. Let's use the [to-do list](/articles/simple-web-apps-bun#tasks-app) from the last post as an example. Here's the HTML:

```html
<h1>Tasks</h1>
<form method="POST">
  <input name="task" aria-label="Your task" />
  <button aria-label="Add task">+</button>
</form>
<ol>
  <li>
    <span>Do the thing</span>
    <form method="POST" action="/remove" style="display: inline">
      <button name="id" value="1">&times;</button>
    </form>
  </li>
</ol>
```

When the first form is submitted the backend stores the new task in the DB, then redirects back to the same page but with the new task added to the start of the `<ol>` (so the most recent tasks are listed first).

![](media/default-tasks.mp4)

We could enhance this form similarly to before. Our backend could return just the single new `<li>`, or we could use `data-select` to get just the first one from the full response:

```html
<form
  method="POST"
  data-boost
  data-target="ol"
  data-select="li:first-child"
></form>
```

Since our implementation of `data-select` used `document.querySelector` we can use any valid CSS selector, allowing us to grab exactly the element we need using `:first-child`.

Unfortunately this won't quite work—we currently always replace all of the content of the target element with the selected element. So this code will remove all the existing todos.

HTMX has a way to control this: [`hx-swap`](https://htmx.org/attributes/hx-swap/). This lets you specify _where_ in the target you want to put the new HTML. Our current implementation defaults to `innerHTML`—i.e. replace everything inside.

In this case we'd like to use what HTMX calls "afterbegin", which inserts the response before the first child of the target. Let's add support for this in our client-side code:

```js
document.addEventListener("submit", async (event) => {
  let { boost, target, select, swap = "innerHTML" } = event.target.dataset;
  // ...
  if (swap === "afterbegin") replacee.prepend(replacer);
  if (swap === "innerHTML") replacee.replaceChildren(...replacer.childNodes);
});
```

And finally update our form:

```html
<form
  method="POST"
  data-boost
  data-target="ol"
  data-select="li:first-child"
  data-swap="afterbegin"
></form>
```

Now our example should insert new tasks into the beginning of the list.

### Targeting revisited

Our to-do list also supports deleting tasks. Each task has a form like this:

```html
<li>
  <span>Do the thing</span>
  <form method="POST" action="/remove">
    <button name="id" value="1">&times;</button>
  </form>
</li>
```

The backend will receive POST requests to `/remove`, read the submitted `id` from the body, delete the corresponding task from the DB, then redirect back to the same page, which will re-render with the task removed.

We can't boost these forms right now because we have no way of deleting an element, and no way of easily targeting the parent `<li>` (without adding an ID to each one). Luckily HTMX supports both with `hx-swap="delete"` and `hx-target="closest li"`. The first will ignore the response and just remove the element; the second allows us to target _up_ the DOM tree from the form.

Let's add support for both to our client-side code:

```js
document.addEventListener("submit", async (event) => {
  // ...
  let replacee = target.startsWith("closest")
    ? event.target.closest(target.replace("closest ", ""))
    : target
    ? document.querySelector(target)
    : document.body;
  // ...
  if (swap === "delete") replacee.remove();
});
```

And finally update our task forms:

```html
<li>
  <span>Do the thing</span>
  <form
    method="POST"
    action="/remove"
    data-boost
    data-target="closest li"
    data-swap="delete"
  >
    <button name="id" value="1">&times;</button>
  </form>
</li>
```

![](media/boosted-tasks.mp4)

## Wrapping up

We've implemented a (very) small subset of HTMX in about 26 lines of JavaScript. This lets us enhance already functional server-side apps to make them feel more dynamic and improve their user-experience.

I think the HTMX model is a powerful alternative to both the old JQuery ad-hoc-DOM-manipulation model, _and_ the new React duplicate-everything-client-side model. HTMX makes the server the source of truth, so you don't end up with the UI out of sync from the data. HTML attributes are just to control how HTMX reconciles server responses with the current UI.

I'm probably going to expand the code we wrote here into a tiny library to use on side projects that don't need a full framework.
