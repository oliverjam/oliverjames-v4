import { Layout } from "./base.jsx";
import { Search } from "../components/search.jsx";
import { Icon } from "../components/icon.jsx";

let sizes = {
  md: 96,
  lg: 128,
};

export function Profile({
  children,
  header = <Bio />,
  url,
  size = "md",
  ...data
}) {
  return (
    <Layout {...data} url={url}>
      <div class="Profile BorderBetween">
        <header class="ProfileHeader">
          <Avatar size={sizes[size]} />
          {header}
        </header>
        <Search />
        <Nav url={url} />
        {children}
      </div>
    </Layout>
  );
}

export function Header({ children }) {
  return <div class="ProfileHeader">{children}</div>;
}

export function Avatar({ size = 96 }) {
  return (
    <>
      <div class="ProfileCover" style={`--overlap: -${size / 2}px`} />
      <a href="/" aria-label="Home">
        <img
          class="ProfileAvatar"
          src="/assets/me.jpg"
          alt="oli's profile picture"
          width={size}
          height={size}
        />
      </a>
    </>
  );
}

export function Bio() {
  return (
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
  );
}

export function Nav({ url }) {
  return (
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
  );
}

export { Search };

export function Feed({ children }) {
  return (
    <ul class="Feed BorderBetween h-feed" id="main">
      {children}
    </ul>
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
