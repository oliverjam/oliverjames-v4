import { posts } from "../lib/data.js";
import { Profile, Feed } from "../components/profile.jsx";
import { Entry } from "../components/entry.jsx";

export default (data) => {
  return (
    <Profile {...data} title="Notes" size="lg" header={<h1>Notes</h1>}>
      <Feed>
        {posts
          .filter((post) => post.kind === "note")
          .map((post) => (
            <li>
              <Entry {...post} />
            </li>
          ))}
      </Feed>
    </Profile>
  );
};
