import { posts } from "../lib/data.js";
import { Profile, Feed } from "../components/profile.jsx";
import { Entry } from "../components/entry.jsx";

export default (data) => {
  return (
    <Profile {...data} size="lg" title="Articles" header={<h1>Articles</h1>}>
      <Feed>
        {posts
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
