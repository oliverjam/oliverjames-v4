import { readable } from "../lib/dates.js";

export function ReadableDate({ children, ...overrides }) {
  return (
    <time
      datetime={children.toISOString()}
      title={children.toLocaleString("en-GB")}
      class="dt-published"
    >
      {readable(children, overrides)}
    </time>
  );
}
