import { Icon } from "../components/icon.jsx";

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
      <form action="https://duckduckgo.com" target="_blank" rel="noopener">
        <input type="hidden" name="ko" value="-2" />
        <input type="hidden" name="k1" value="-1" />
        <input type="hidden" name="kz" value="-1" />
        <input type="hidden" name="km" value="m" />
        <input type="hidden" name="k7" value="#fafef5" id="ddgbg" />
        <input type="hidden" name="sites" value="oliverjam.es" />
        <div class="grid pile items-center">
          <input
            type="search"
            name="q"
            aria-label="Search via DuckDuckGo"
            placeholder="Search"
            class="block w-100 mx-auto py-3 px-3 pl-8 bg-dim font-3"
            style="padding-inline-start: calc(var(--space-8) + var(--space-2))"
          />
          <svg
            id="search"
            class="color-bright"
            stroke="currentColor"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke-width="2"
            width="24"
            height="24"
            style="margin-inline-start: var(--space-3)"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z"
            />
          </svg>
        </div>
      </form>
      <script>{`
      ddgbg.value = getComputedStyle(document.documentElement).backgroundColor
    `}</script>
    </>
  );
}
