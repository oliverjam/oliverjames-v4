import { posts } from "../lib/data.js";
import { Profile, Feed } from "../components/profile.jsx";
import { Entry } from "../components/entry.jsx";

export default (data) => {
  return posts
    .filter((post) => post.kind === "note")
    .map((post) => {
      let url = `/notes/${post.slug}.html`;
      let raw = post.raw;
      let title = raw.length <= 140 ? raw : raw.slice(0, 140).concat("...");
      return {
        url,
        component: (
          <Profile {...data} url={url} title={title} page_style="article.css">
            <Feed>
              <Entry {...post} preview={false} />
            </Feed>
          </Profile>
        ),
      };
    });
};
