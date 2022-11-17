import { Profile, Feed } from "../components/profile.jsx";
import { slug } from "../lib/slug.js";
import { Entry } from "../components/entry.jsx";

export default (data) => {
  let { tags } = data;
  return Array.from(tags).map(([tag, posts]) => {
    let url = `/tags/${slug(tag)}.html`;
    return {
      url,
      component: (
        <Profile
          {...data}
          url={url}
          title={"#" + tag}
          size="lg"
          header={<Title>{tag}</Title>}
        >
          <Feed>
            {posts.map((post) => (
              <li>
                <Entry {...post} />
              </li>
            ))}
          </Feed>
        </Profile>
      ),
    };
  });
};

function Title({ children }) {
  return (
    <h1>
      <span aria-hidden="true">#</span>
      {children}
      <span class="vh"> tags</span>
    </h1>
  );
}
