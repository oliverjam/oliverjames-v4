import { Layout } from "./base.jsx";
import { Card } from "../components/card.jsx";
import { Search } from "../components/search.jsx";
import { Icon } from "../components/icon.jsx";

export function Feed({ children, ...data }) {
  let { filter = "all", url } = data;
  return (
    <Layout {...data}>
      <div class="Profile">
        <header class="ProfileHeader">
          <div class="ProfileCover" />
          <img
            class="ProfileAvatar"
            src="/assets/me.jpg"
            alt="oli's profile picture"
            width="128"
            height="128"
          />
          <div class="flex wrap gap-2">
            <div class="flex-1">
              <h1>oli</h1>
              <a href="https://github.com/oliverjam">
                <Icon name="github" size="16" /> @oliverjam
              </a>
              <p>I do web stuff</p>
              <p>Previously @founderscoders</p>
              <p>Previously @ticketmaster</p>
            </div>
            <nav>
              <a class="ProfileButton" href="/feed.xml">
                Follow <Icon name="rss" size="24" />
              </a>
            </nav>
          </div>
        </header>
        <Search />
        <nav class="ProfileNav Sticky">
          <a class="ProfileNavLink" {...to(url, "/articles")}>
            <Icon size="16" name="article" />
            Articles
          </a>
          <a class="ProfileNavLink" title="Coming soon">
            <Icon size="16" name="note" />
            Notes
          </a>
          <a class="ProfileNavLink" title="Coming soon">
            <Icon size="16" name="bookmark" />
            Bookmarks
          </a>
          <a class="ProfileNavLink" title="Coming soon">
            <Icon size="16" name="like" />
            Likes
          </a>
        </nav>
        <ul class="Feed h-feed" id="main">
          {data.posts
            .filter((post) => filter === "all" || filter === post.kind)
            .map((post) => {
              return <Card {...post} />;
            })}
        </ul>
      </div>
    </Layout>
  );
}

function to(current, to) {
  let current_path = current.replace(".html", "").replace("index", "");
  const active = current_path === to;
  const active_parent = to !== "/" && current_path.includes(to);
  return {
    href: active ? "#main" : to,
    "aria-current": active ? "page" : active_parent ? "true" : "false",
  };
}
