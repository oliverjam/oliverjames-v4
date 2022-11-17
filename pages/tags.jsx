import { tags } from "../lib/data.js";
import { Profile } from "../components/profile.jsx";

export default (data) => {
  return (
    <Profile {...data} title="Tags" size="lg" header={<h1>Tags</h1>}>
      <ol class="grid gap-3 gutter py-6">
        {Array.from(tags)
          .sort((a, b) => b[1].length - a[1].length)
          .map(([tag, posts]) => (
            <li>
              <div>
                <a href={`/tags/${tag}`} class="">
                  <b>#{tag}</b>
                </a>
              </div>
              <div class="font-2 color-bright">{posts.length} posts</div>
            </li>
          ))}
      </ol>
    </Profile>
  );
};
