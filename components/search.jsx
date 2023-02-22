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
        <input type="hidden" name="sites" value="oliverjam.es" />
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
