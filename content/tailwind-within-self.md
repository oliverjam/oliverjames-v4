---
kind: article
title: Styling an element nested within itself in Tailwind
date: 2023-07-26
intro: This is pretty niche and weird, but I sometimes end up writing CSS that needs to target an element nested inside an instance of itself. This is not obvious to do in Tailwind, so I thought I'd blog about it.
tags:
  - css
  - tailwind
---

tl;dr here's the magic: `[&_&]`. Isn't he great? I'm gonna call him Gill.

This "arbitrary variant" lets you apply styles when this element is nested inside another element with this class. For example:

```html
<ul class="[&_&]:pl-4">
  ...
</ul>
```

This list will only have `padding-left` applied if it inside another such list.

## Why would you do this

I've been building a simple app for reading Reddit because the native UI is awful and they killed all the good 3rd party apps. Reddit comments are _nested_. That is, unlike other platforms like ~~Twitter~~ 𝕏, every comment can have multiple separate threads of replies nested within.

These nested comment trees are usually rendered with progressively more space on the left, so that its obvious which parent the comments belong to. Here's a visualisation:

```
Parent 1
├─ 1st reply to parent 1
└─ 2nd reply to parent 1
   └─ 1st reply to 2nd reply to parent 1
      └─ 1st reply to 1st reply to 2nd reply to parent 1
Parent 2
├─ 1st reply to parent 2
└─ 2nd reply to parent 2
```

## Creating the nested UI

I found this UI was best expressed with a recursive component. Using JSX:

```jsx
function Comments({ comments }) {
  if (comments.length === 1) {
    return null; // Reddit's API has a "More" object at the end of the tree
  }
  return (
    <ul className="List">
      {comments.map((child) => {
        return (
          <li key={child.id}>
            {/* Lots of comment markup removed for brevity*/}
            {child.replies && <Comments comments={child.replies} />}
          </li>
        );
      })}
    </ul>
  );
}
```

This component renders a list of comments, and inside of each comment (if there are replies) renders another copy of itself. Here's an example of the resulting markup:

```html
<ul class="List">
  <li><p>A comment with no replies</p></li>
  <li>
    <p>A comment with one reply</p>
    <ul class="List">
      <li><p>First reply</p></li>
    </ul>
  </li>
</ul>
```

## Styling with vanilla CSS

This works great for rendering the nested lists, but we still need to style them. Ideally nested comments have the correct border and spacing to make it obvious which parent they are replies to.

This isn't too hard with vanilla CSS:

```css
.List .List {
  margin-top: 1rem;
  border-left: 1px solid;
  padding-left: 1.5rem;
}
```

CSS selectors work left-to-right. So the selector `.List .List` means "find all elements with the classname "List", then check if they're inside an element with the classname "List". This is exactly what our UI needs: top-level comments won't get any extra spacing or border, but _all_ nested comments will.

## The big refactor

Once I had a functioning prototype I decided to refactor the styling to use the Tailwind library. I had a vague justification that it was getting a little bit unwieldy just raw-dogging CSS, but really I was just bored. What else are side-projects for? I did also feel like I owed Tailwind a fair try since I've been pretty vocally critical of it in the past. I'm working on a full write-up of my thoughts, but here's a sneak preview: Tailwind is pretty good now!

Most of the styles were easy to port over to Tailwind's "just bung it all in the classname and never think about it again" approach. However a few _CSS tricks_ like the nested comments had me stumped for a while.

Tailwind only lets us apply classes to an element directly. There are some special-cased things for parent/sibling relationships, but nothing for something nested within itself. I was tempted to just hack this with JS by passing down a prop indicating the nesting level of the recursion, but no way was I letting a utility-CSS library beat me.

After a little experimentation (and reading all the Tailwind release blog posts), I found the answer.

## Arbitrary variants

This feature really needs a more exciting name, because it's really cool. Tailwind has supported arbitrary _values_ since [version 2.2](https://tailwindcss.com/blog/tailwindcss-2-2#extended-arbitrary-value-support). This is where you put any value you like in square brackets, and Tailwind just injects it into the generated CSS class. For example:

```html
<p class="mt-[476px]">Hello</p>
```

That will generate this class in your CSS:

```css
.mt-\[476px\] {
  margin-top: 476px;
}
```

This is great for one off things that don't fit into your wider design system.

However in [version 3.1](https://tailwindcss.com/blog/tailwindcss-v3-1#arbitrary-values-but-for-variants) Tailwind added arbitrary _variants_, and they're fantastic. Quick recap: variants are how you express things like hover states and media queries within a classname. For example:

```css
<button class="hover:bg-red-100 xl:text-lg">Click me</button>
```

Arbitrary variants let you put _anything you like_ as the modifier. You can basically put whatever regular CSS you want inside the square brackets to create your own variants on the fly. For example:

```css
<p class="[&:nth-child(3):font-bold]">Hello</p>
```

This will make the text bold only if the element is the third child of its parent.

So the `&` (ampersand) character refers to the class itself, which is pretty mind-bending. This is a similar concept to how its used in [CSS Nesting](https://www.w3.org/TR/css-nesting-1/) (and its inspirations in Sass/Less).

This means you can do fun stuff like:

```html
<div class="[&>h2]:mt-4">...</div>
```

This will apply margin above any `h2` elements within the div.

## Bringing it all together

Now we have everything we need to adapt the nested list styles. We can use `&` as a reference to the current class (and therefore the element). This means we can use it _twice_ to indicate the current class nested within the current class 🤯. Behold Gill, the inside-himself variant: `[&_&]`.

```html
<ul class="[&_&]:mt-4 [&_&]:border-l [&_&]:pl-5"></ul>
```

The underscore represents a space, as you can't use spaces inside variants (the pitfalls of writing all your styles inside a single attribute).

This generates the CSS we're looking for (with a lot of backslashes to escape the special characters):

```css
.\[\&_\&\]\:mt-4 .\[\&_\&\]\:mt-4 {
  margin-top: 1rem;
}

.\[\&_\&\]\:border-l .\[\&_\&\]\:border-l {
  border-left-width: 1px;
}

.\[\&_\&\]\:pl-5 .\[\&_\&\]\:pl-5 {
  padding-left: 1.25rem;
}
```

I only needed a few rules in a single place, so I was fine leaving it like this. If you were going to need this variant again you could create a custom variant using a plugin in your Tailwind config:

```js
const plugin = require("tailwindcss/plugin");

module.exports = {
  plugins: [
    plugin(function ({ addVariant }) {
      addVariant("inside-self", "&_&");
    }),
  ],
};
```

Using this would technically be more typing, but it's more explicit and saves characters compared to linking to this blog post in a comment every time you use `[&_&]`.
