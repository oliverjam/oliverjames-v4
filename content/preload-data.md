---
kind: article
title: Speed up your SPA by preloading data requests
tags:
  - html
  - preload
  - fetch
date: 2023-12-14
intro: You can speed up a single-page app by declaring static data dependencies ahead of time so the browser can preload them.
---

## Quick answer

If you just want the tl;dr solution: use [`<link rel="preload">`](https://developer.mozilla.org/en-US/docs/Web/HTML/Attributes/rel/preload) to make the browser kick off `fetch` requests before it even starts downloading your JS files. That way the responses are ready by the time your app code runs.

## The problem

One of the major downsides to a single-page app is that data fetching doesn't begin until your app's JavaScript runs. Depending on the size and complexity of the app it can be a non-trivial amount of time before your code actually calls `fetch`.

A typical "naive" client-side React app with a bunch of dependencies chosen by popularity (or at random) can easily end up loading over 1MB of JavaScript. If the first thing the app does is `fetch` some JSON from an API so that it can actually render content, that means the browser must:

1. Download and parse the (mostly empty) HTML
1. Find the script tag(s) containing the app's JavaScript code
1. Download, parse and execute all the JavaScript
1. Execute any `fetch` requests it finds
1. Update the DOM once the requests are complete

That 1MB+ of JS will take a while to download (especially on 3G), and potentially _even longer_ to run (especially on mobile, since lots of Android phones have terrible single-core CPU performance). The user will be staring at a blank white screen (or maybe a janky loading spinner) while they wait.

> "In fact, of the total time a page spends loading in a browser like Chrome, anywhere up to 30% of that time can be spent in JavaScript execution"  
> [The cost of JavaScript in 2019, V8 Blog](https://v8.dev/blog/cost-of-javascript-2019).

## The solution

Web browsers have a declarative API for preloading resources. You may have used this before for loading fonts or something to make sure your CSS doesn't block rendering. Well it turns out you can use the same API for preloading arbitrary JS `fetch` calls.

Here's a `fetch` to get the first 20 Pokémon from the PokéAPI:

```js
fetch("https://pokeapi.co/api/v2/pokemon");
```

Here's the exact same request triggered declaratively in HTML:

```html
<link
	rel="preload"
	href="https://pokeapi.co/api/v2/pokemon"
	as="fetch"
	crossorigin
/>
```

When the browser parses the `<link>` tag in the HTML it will queue a request for that resource, then cache the response. If your JS code requests the _same_ resource within a few seconds the browser will give it the cached version.

This means the browser can be fetching your API responses while it is still downloading your JS code, which can be a pretty big speedup if your JS is slow.

## Caveats

It's important not to abuse this. If you preload something but don't use it within a few seconds the browser will put a big warning in the console. You've just wasted the users bandwidth, and potentially slowed down the page load by having the browser spend time fetching something it didn't need.

The preload must match what you fetch _exactly_. If the requests are even a bit different the browser won't be able to match them and you'll see the same warning about not using a preloaded resource.

This is why we needed the `crossorigin` attribute in our example. The `<link>` tag doesn't use CORS by default because it's not needed for e.g. CSS files. However JS `fetch` requests have CORS enabled, so we need to specify it in the preload to match.

## Practical example

I built a quick example to try and get some data on exactly how much this might help. Here's a simple JS app that lists Pokémon from the PokéAPI:

```html
<ul id="list">
	<!-- pokemon go here -->
</ul>
<script>
	fetch("https://pokeapi.co/api/v2/pokemon")
		.then((res) => res.json())
		.then(async (json) => {
			let pokes = await Promise.all(
				json.results.map(async (p) => {
					let poke = await fetch(p.url).then((res) => res.json());
					let li = document.createElement("li");
					li.append(poke.name);
					return li;
				})
			);
			list.replaceChildren(...pokes);
		});
</script>
```

Here's how the page renders:

1. Browser downloads and starts parsing the HTML
1. Browser finds the script and starts parsing the JS
1. JS starts fetching the list of 20 Pokémon
1. JS waits for promise to resolve
1. JS starts fetching each of the 20 Pokémon
1. JS waits for all 20 to resolve
1. JS updates DOM

### Initial performance

In this case performance is pretty good. Our JS is inline, which means the browser doesn't have to make a separate HTTP request to download it. There's also hardly any of it, so it won't take long to parse and execute. We're also not accidentally fetching all the Pokémon serially, which is [easy to do with `await`](/articles/pitfalls-of-async-functions).

If I simulate a "Slow 3G" connection this page fully renders in **8.58s** in Edge. Here's a visualisation of the requests:

```
/index.html (2.01s)
                  └─ /pokemon (2.10s)
                                    ├─ /pokemon/1 (3.71s)
                                    ├─ /pokemon/2 (3.84s)
                                    ├─ /pokemon/1 (4.37s)
                                    ├─ ...etc
```

The HTML is done downloading in 2.01s, but the first `fetch` isn't queued until 2.05s after we start loading the page. That means it takes the browser 40ms to get ready to send the `fetch`, with this tiny amount of inlined JS.

### Make it realistic (slower!)

We can simulate slower loading JS by putting a 2s timeout in the code. This will act as if we have a larger JS file to download. Note that this is probably unrealistically fast: if the 670B (0.00067MB) HTML file is taking 2.01s to download imagine how long a 1MB JS bundle will take to download, parse and execute.

With a 2000ms `setTimeout` wrapped around the JS code the page now fully renders in **10.47s**. This is roughly 2s slower than previously, which is what we'd expect. The HTML still loads in 2.01s, but the first `fetch` now doesn't start until 4.05s in. This is exactly 2s slower than before.

### Fix it with preload

Now lets try preloading our fetch requests. We can do this by adding `<link>` tags for each request to the HTML. In this case we need 21: one for the initial list request and one for each of the 20 pokémon requests.

This page now fully renders in **6.69s**. This is not only 4s faster than the `setTimeout` example, but still 2s faster than the initial version. If we visualise the requests we can see why:

```
/index.html (2.06s)
                  ├─ /pokemon   (2.03s)
                  ├─ /pokemon/1 (3.82s)
                  ├─ /pokemon/2 (3.79s)
                  ├─ /pokemon/1 (3.89s)
                  ├─ ...etc
```

The initial HTML load took a bit longer because adding all those `<link>` tags made it grow from 670B to 2.7KB. However because the browser knows about all the data dependencies up front it can start downloading them all in parallel. This means that not only do we avoid the 2s delay waiting for the JS to execute, we also skip the 2.03s it took for the list of pokémon to download. That explains why the total load time was about 4s faster.

## In summary

Obviously this technique will only work if you can know your data dependencies statically ahead of time. If your page needs some dynamic information (like localStorage state) to render then this technique won't work. However if you can make it work it feels like a no-brainer to leverage built-in browser primitives to speed up your single-page apps.
