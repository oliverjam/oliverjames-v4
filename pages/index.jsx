import { Profile, Feed } from "../layouts/feed.jsx";
import { Entry } from "../components/entry.jsx";

export default (data) => {
  return (
    <Profile {...data} title="Home" size="lg">
      <Feed>
        {data.posts.map((post) => (
          <li>
            <Entry {...post} />
          </li>
        ))}
      </Feed>
    </Profile>
  );
};
