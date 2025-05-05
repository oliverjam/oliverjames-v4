---
kind: article
title: Custom site search with DuckDuckGo
date: 2023-02-22
intro: DuckDuckGo's customisable search results made it super easy to add search to my site without any JS
tags:
  - search
  - html
---

My site's new design has a searchbar front-and-centre. I don't have a _ton_ of articles published, but as I start to add more shortform notes and bookmarks it will get harder to track down specific blog posts, so a search feature felt helpful.

I didn't want to spend much time on this, and I definitely didn't want to change my site's architecture or goals (fully static HTML/CSS with as little JS as humanly possible). Luckily the DuckDuckGo search engine made it super easy to add custom site search.

## Summary

This article goes into a lot of detail about how I built this feature. If you just want the code you can [see it on GitHub](https://github.com/oliverjam/oliverjames-v4/blob/a6e8ba868981fb9cb99f3c15fad212f903a73ad5/components/search.jsx).

## Long live the URL

Most search engines (including Google) take search queries as part of the URL. More specifically they extract them from the [search parameters](https://developer.mozilla.org/en-US/docs/Web/API/URL/searchParams) (the bit after a `?`). For example if you search for `css` on google.com the browser sends a `GET` request to `google.com/search?q=css&abunchoftrackingjunk` (this is how form submissions work). The cool thing about this is that by default _any form_ can submit to this URL (this is also how [CSRF attacks](https://owasp.org/www-community/attacks/csrf) happen unfortunately).

We can craft a form that submits a `GET` request to Google like this:

```html
<form action="https://google.com">
  <label for="search">Search</label>
  <input name="q" id="search" />
</form>
```

If a visitor to my site enters "css" into this form they'll be sent off to Google to see the results, exactly as if they'd clicked a link to `google.com?q=css`.

This is great, but there were two big reasons I couldn't use Google in the end. The first is that I respect my visitors' privacy. Google does a lot of tracking that many people wish to avoid—I'm uncomfortable semi-tricking people into using a Google service. The second is that Google just wouldn't work.

## Searching a single site

You may be aware that the only way to get decent results out of Google nowadays is to add `site:reddit.com` to your search. This relies on Google's ability to search a single site rather than the whole web.

This seemed perfect for my use-case. I could limit the results to `site:oliverjam.com` so visitors would only see my articles. Unfortunately as far as I can tell there's no way to configure this without adding it to the search query itself. I could have used JS to append it to the query on submit, but that goes against my "no JS unless absolutely necessary" goal.

This is when I discovered that DuckDuckGo has a way more robust set of search parameters for configuring results. They also use the `q` param for setting the query, but also support a `sites` param for specifying the domain to search.

Here's a form that searches this site on DuckDuckGo:

```html
<form action="https://duckduckgo.com">
  <label for="search">Search</label>
  <input name="q" id="search" />
  <input type="hidden" name="sites" value="oliverjam.com" />
</form>
```

## Customising the results page

It seems like DuckDuckGo actually _want_ people to use this feature (shocking). They provide a [plethora of parameters](https://duckduckgo.com/params) for making the search results page fit your brand better.

1. You can remove the branded DDG header from the top by setting `k0=-2`
1. You can remove all the adverts (!!!) by setting `k1=-1`
1. You can remove "related searches" with `kz=-1`
1. You can center the results with `km=m`
1. You can set a background colour with `k7=#000`

```html
<form action="https://duckduckgo.com">
  <label for="search">Search</label>
  <input name="q" id="search" />
  <input type="hidden" name="sites" value="oliverjam.com" />
  <input type="hidden" name="ko" value="-2" />
  <input type="hidden" name="k1" value="-1" />
  <input type="hidden" name="kz" value="-1" />
  <input type="hidden" name="km" value="m" />
  <input type="hidden" name="k7" value="#fafef5" />
</form>
```

It honestly blew me away how far DuckDuckGo have gone in making this feature user-friendly.

## Matching my site's theme

Although I could set a custom background colour, this wouldn't necessarily match my site. The param had to be hard-coded into the HTML for the form, which meant I had to pick either the light or dark background. It was quite a jarring experience going from dark-mode site to bright search results.

This was a scenario where I was willing to add a tiny bit of JS to improve the user-experience of this feature, since I couldn't think of any other way to have the value of a hidden input match the current document background.

I added a single line of JS to run when the form was submitted:

```html
<form
  action="https://duckduckgo.com"
  onsubmit="this.k7.value = getComputedStyle(document.documentElement).backgroundColor"
></form>
```

This sets the value of the hidden input to whatever the `<html>` element's background currently is. Since it happens on submit it should always match the user's theme preference, even if this changed as they were searching.

## Opening results in a new tab

I'm still on the fence about this feature. I generally dislike links that forcibly open in a new tab (sometimes I don't want this! let me choose!), but for search results on another domain entirely I felt like a new tab was a sensible choice.

This blew my mind when I learnt it—you can make a form submit to a new tab using the exact same attributes as a link. It makes sense when you think about how links and forms are both just ways to navigate.

```html
<form action="https://duckduckgo.com" target="_blank" rel="noopener"></form>
```

## Conclusion

I wrapped all this code up into a reusable component with comments so I wouldn't forget what the inscrutable search parameters did in the future (they came in handy writing this post). You can also see the source [on GitHub](https://github.com/oliverjam/oliverjames-v4/blob/a6e8ba868981fb9cb99f3c15fad212f903a73ad5/components/search.jsx).

```jsx
/**
 * DuckDuckGo offers a lot of customisation via URL params
 * https://duckduckgo.com/params
 * ko=-2 Remove header
 * k1=-1 Remove adverts
 * kz=-1 Remove instant answers/related searches
 * km=m  Center results
 * k7=#  Set background colour
 */

export function Search() {
  return (
    <>
      <form
        class="Search"
        action="https://duckduckgo.com"
        target="_blank"
        rel="noopener"
        onsubmit="this.k7.value = getComputedStyle(document.documentElement).backgroundColor"
      >
        <input type="hidden" name="ko" value="-2" />
        <input type="hidden" name="k1" value="-1" />
        <input type="hidden" name="kz" value="-1" />
        <input type="hidden" name="km" value="m" />
        <input type="hidden" name="k7" value="#fafef5" />
        <input type="hidden" name="sites" value="oliverjam.com" />
        <div class="grid pile items-center">
          <input
            type="search"
            name="q"
            aria-label="Search via DuckDuckGo"
            placeholder="Search"
            class="SearchInput"
          />
          <Icon name="search" size="20" />
        </div>
      </form>
    </>
  );
}
```
