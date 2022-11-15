import { Layout, Feed } from "../layouts/feed.jsx";
import { Entry } from "../components/entry.jsx";
import { Icon } from "../components/icon.jsx";

export default (data) => {
  return (
    <Layout {...data} title="Home" size="lg" header={<Bio />}>
      <Feed>
        {data.posts.map((post) => (
          <li>
            <Entry {...post} />
          </li>
        ))}
      </Feed>
    </Layout>
  );
};

function Bio() {
  return (
    <div class="flex wrap gap-2">
      <div class="flex-1 grid gap-1">
        <h1>oli</h1>
        <ul class="grid gap-1">
          <li>weird web person</li>
          <li>
            previously{" "}
            <A href="https://foundersandcoders.com" class="color-contrast">
              @founderscoders
            </A>
          </li>
          <li>
            previously{" "}
            <A href="https://ticketmaster/co.uk" class="color-contrast">
              @ticketmaster
            </A>
          </li>
          <li>he/him</li>
        </ul>
      </div>
      <nav class="grid gap-2" style="align-content: start">
        <a class="ProfileButton" href="/feed.xml">
          Follow <Icon name="rss" size="24" />
        </a>
        <div class="flex gap-2 justify-center">
          <Link href="https://github.com/oliverjam" aria-label="GitHub">
            <Icon name="github" size="24" />
          </Link>
          <Link href="https://twitter.com/_oliverjam" aria-label="Twitter">
            <Icon name="twitter" size="24" />
          </Link>
          <Link href="mailto://hello@oliverjam.es" aria-label="Email">
            <Icon name="mail" size="24" />
          </Link>
        </div>
      </nav>
    </div>
  );
}

function Link(props) {
  return <a {...props} target="_blank" rel="noopener" />;
}
