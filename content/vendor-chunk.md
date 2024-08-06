---
kind: article
title: Better JS bundle caching with vendor chunks
tags:
  - js
  - performance
date: 2024-08-06
intro: I just improved the performance of my Reddit app by splitting out 3rd party code from the main JS bundle so it can be cached for longer between updates.
---

Browser caching is an important part of web performance. You can tell the browser to keep a copy of a file around for later with the `cache-control` HTTP header. For example a response with this header set:

```
cache-control: max-age=3600
```

will be cached for one minute (3600 seconds)

A one minute cache is not going to improve performance much though, since most users will visit the site again more than one minute later, leading to them waiting for the file to re-download.

We can't just set a much longer cache time, because we want the user to receive updates to this file. If we set a one year cache time the user will be stuck with the old file for that long.

Moder build tooling generally supports cache-busting using file hashes. When your app builds each static file will have a hash of the contents added to the filename. For example `main.js` might become `main-50b6a13c.js`. This hash will be the same as long as the file's contents are the same, but will change if a single character is different.

This lets us set files to cache effectively forever, since every version of our file is unique and immutable. Browsers generally won't cache for longer than one year:

```
cache-control: max-age=604800, immutable
```

The `immutable` directive tells the browser to never even try to revalidate this response—it should never be different.

This is fantastic for performance, as now each user will only ever load each version of your app once. Every time they load the page the browser will instantly have access to all the static resources without having to wait for a response from your server.

There is still one downside: if _any_ of our code changes the browser must re-download the entire file. Luckily we can mitigate this by splitting out our dependency code from our own.

When building modern JS apps it's common to have a large quantity of your code come from 3rd party dependencies. For example my [Reddit app](https://rddit.netlify.app/r/all) requires 228kb of JS, 207kb of which is just React, React Router and Valibot. These dependencies rarely change, and I am in control of when I update them. If we split these into their own separate JS file we can avoid invalidating the cache for all this every time we change our own code. The dependencies will be cached until one of them is updated.

Each build tool has a different way of configuring "vendor chunks", but here's how to do it [in Vite](https://v3.vitejs.dev/guide/build.html#chunking-strategy):

```js
// vite.config.js
import { defineConfig, splitVendorChunkPlugin } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig({
	plugins: [react(), splitVendorChunkPlugin()],
	server: { port: 3000 },
	build: { target: "esnext" },
});
```

We import the `splitVendorChunkPlugin` and add it to the config's `plugins` array. That's it. Here's the output of `vite build` _before_ adding the plugin:

```
✓ 54 modules transformed.
dist/index.html                      0.69 kB │ gzip:  0.46 kB
dist/assets/index-e032778f.css      10.35 kB │ gzip:  3.25 kB
dist/assets/missing-c45c8138.js      0.28 kB │ gzip:  0.22 kB
dist/assets/media-05d37584.js        1.67 kB │ gzip:  0.87 kB
dist/assets/media-bb4a63f2.js        2.12 kB │ gzip:  0.94 kB
dist/assets/post-3a754864.js         2.32 kB │ gzip:  1.04 kB
dist/assets/subreddit-f9f8913a.js    3.10 kB │ gzip:  1.39 kB
dist/assets/error-b1adb144.js        5.45 kB │ gzip:  1.91 kB
dist/assets/comments-ca3ad949.js     7.23 kB │ gzip:  2.86 kB
dist/assets/index-75cd0051.js      212.78 kB │ gzip: 68.89 kB
✓ built in 899ms
```

Note the `index.js` file at the bottom that is 212.78kb.

Here's after adding the plugin:

```
✓ 54 modules transformed.
dist/index.html                      0.76 kB │ gzip:  0.48 kB
dist/assets/index-e032778f.css      10.35 kB │ gzip:  3.25 kB
dist/assets/missing-7ecbefcc.js      0.28 kB │ gzip:  0.22 kB
dist/assets/media-0f91f393.js        1.70 kB │ gzip:  0.89 kB
dist/assets/media-a9720384.js        2.16 kB │ gzip:  0.96 kB
dist/assets/post-65a175ad.js         2.36 kB │ gzip:  1.06 kB
dist/assets/subreddit-5fe07416.js    3.12 kB │ gzip:  1.41 kB
dist/assets/error-9e227f5f.js        5.46 kB │ gzip:  1.91 kB
dist/assets/index-f485a835.js        6.58 kB │ gzip:  2.64 kB
dist/assets/comments-af5f5540.js     7.26 kB │ gzip:  2.87 kB
dist/assets/vendor-fdd8423a.js     206.54 kB │ gzip: 66.64 kB
✓ built in 921ms
```

We now have a `vendor.js` that is 206.54kb. That's the vast majority of our original bundle split into a file that will never change until I update a dependency, meaning users will rarely have to re-download any of it.
