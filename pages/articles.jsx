import { Feed } from "../layouts/feed.jsx";

export default (data) => {
  return <Feed {...data} title="Articles" filter="article" />;
};
