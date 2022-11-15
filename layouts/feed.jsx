import { Layout as Base } from "./base.jsx";
import { Search } from "../components/search.jsx";
import { Icon } from "../components/icon.jsx";

let sizes = {
  md: 96,
  lg: 128,
};

export function Layout({ children, header, url, size = "md", ...data }) {
  return (
    <Base {...data} url={url}>
      <Profile>
        <Header>
          <Avatar size={sizes[size]} />
          {header}
        </Header>
        <Search />
        <Nav url={url} />
        {children}
      </Profile>
    </Base>
  );
}

export function Profile({ children }) {
  return <div class="Profile BorderBetween">{children}</div>;
}

export function Header({ children }) {
  return <div class="ProfileHeader">{children}</div>;
}

export function Avatar({ size = 96 }) {
  return (
    <>
      <div class="ProfileCover" style={`--overlap: -${size / 2}px`} />
      <a href="/" aria-label="Home" class="ProfileAvatar">
        <img
          src="/assets/me.jpg"
          alt="oli's profile picture"
          width={size}
          height={size}
        />
      </a>
    </>
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
