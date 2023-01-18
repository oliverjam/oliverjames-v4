---
kind: article
title: Simple icon systems using SVG sprites
date: 2023-01-17
tags:
  - svg
  - icons
intro: SVG sprites are a native way to group all your icons together and reference them from HTML without needing a templating system.
---

I recently rebuilt both my own site and my designer buddy [Jared's](https://jaredhill.co). Both required a few icons, which meant I had to decide how to handle lots of small images. There are quite a few options, but I think SVG sprites are the best solution for most projects.

I'll start with the solution, then talk about alternatives afterwards.

## Building a sprite sheet

Historically a "sprite sheet" was a single file containing lots of images, often for use in videogames. Storing all the images in one file helped with performance on under-powered systems. To display a specific image the program would crop the coordinates for that part, hiding the rest of the file.

SVG has this capability built in via the [`<use>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/use) element. This takes a node from within an SVG and duplicates it for display. Usually this is used _within_ the same SVG as the source node, but crucially it doesn't have to be.

You can use the `href` attribute to copy a node from _any_ SVG, even one loaded as a separate file. For example:

```html index.html
<svg width="20" height="20">
  <use href="/icons.svg#circle" />
</svg>
```

This will load `/icons.svg`, then find the node with ID "circle" and duplicate that here. The other half of the puzzle is to ensure that file contains an SVG with each icon specified as a [`<symbol>`](https://developer.mozilla.org/en-US/docs/Web/SVG/Element/symbol).

```xml /assets/icons.svg
<svg xmlns="http://www.w3.org/2000/svg">
  <symbol id="circle" viewBox="0 0 20 20">
    <circle cx="10" cy="10" r="10" />
  </symbol>
  <symbol id="square" viewBox="0 0 20 20">
    <rect width="20" height="20" />
  </symbol>
</svg>
```

The SVG file can contain as many icons as you like as long as you give each symbol a unique ID.

That's it! My process for adding a new icon is:

1. Find an SVG (usually on [Heroicons](https://heroicons.com))
1. Copy/paste it into my `icons.svg` file
1. Change the `<svg>` tag to `<symbol>` and add an ID

The advantage of this technique is that you can cache the sprite sheet so each visitor to your site only has to download it once. The _downside_ is that they must download every icon even if the page they view only uses a single SVG. Unless you have a _ton_ of icons I don't think this is a big deal (my entire sprite sheet is 2.67KB gzipped).

## Alternatives

There are only really two viable ways to use SVGs:

1. Reference the SVG file with an image element (`<img src="circle.svg">`)
1. Put the SVG markup directly in your HTML (`<svg><circle .../></svg>`)

Storing each SVG as a separate file and just using image elements is relatively simple, but loses you one of the best benefits of SVGs: styling them with CSS. Icons usually want to inherit their colour from the surrounding text, which doesn't work with a self-contained image file. The colour is just whatever is hard-coded inside the file, and that's it.

Putting the SVG markup in your HTML works great. If you only need to use an icon once or twice I highly recommend just pasting it in there. However you will eventually feel the pain of duplication. Also larger icons look messy taking up a bunch of space in your HTML with all their random path data:

```html
<article>
  <h2>Some nice neat HTML</h2>
  <p>
    Published at
    <svg id="clock" viewBox="0 0 24 24">
      <path
        d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM12.75 6a.75.75 0 00-1.5 0v6c0 .414.336.75.75.75h4.5a.75.75 0 000-1.5h-3.75V6z"
      />
    </svg>
  </p>
</article>
```

In this case you either need to use a sprite sheet as above, or a component system as below.

### React components

If you're using a component/templating system (like React) you may have solved this duplication problem by making each icon a separate component. For example:

```jsx components/icons/circle.jsx
export default function CircleIcon() {
  return (
    <svg viewBox="0 0 20 20">
      <circle cx="10" cy="10" r="10" />
    </svg>
  );
}
```

Some framework/bundler setups even support importing SVG files directly (like [Create React App does](https://create-react-app.dev/docs/adding-images-fonts-and-files/#adding-svgs)) to get a component.

There are downsides to this. First, JSX is different to HTML and so requires you to camelCase SVG attributes. This is annoying enough that Heroicons offers icons in either standard SVG or JSX format.

Second if you server-render and hydrate your HTML (as frameworks like Next.js and Remix do by default), you will end up with your icons duplicated in both the HTML page _and_ your JavaScript bundle.

This is true of _all_ your markup, not only the icons, as it's a currently unavoidable side-effect of hydration. It's just more annoying here since icons are almost always static markup with no interactivity. If there are no event handlers or state attached to the icon then there's no need for it to be embedded in your JS.

### Best of both

If you're working with a component system you can build an abstraction for rendering the `<use href="">` elements, but let the browser handle actually rendering the SVG. Here's the one I wrote for this site:

```jsx components/icon.jsx
export function Icon({ size = "20", name, ...rest }) {
  return (
    <svg {...rest} width={size} height={size} aria-hidden="true">
      <use href={`/assets/icons.svg#${name}`} />
    </svg>
  );
}
```

Now I don't have to worry about typing out the width/height etc every time I use an icon, I can just do `<Icon name="article" />`.
