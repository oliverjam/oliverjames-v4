import { Profile, Feed } from "../layouts/feed.jsx";
import { Entry } from "../components/entry.jsx";

export default (data) => {
  return (
    <Profile {...data} size="lg" title="Articles" header={<h1>Articles</h1>}>
      <Feed>
        {data.posts
          .filter((post) => post.kind === "article")
          .map((post) => (
            <li>
              <Entry {...post} />
            </li>
          ))}
      </Feed>
    </Profile>
  );
};
