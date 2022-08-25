import { readable } from "../lib/dates.js";

export function ReadableDate({ children, ...overrides }) {
  return (
    <time
      datetime={children.toString()}
      title={children.toString()}
      class="dt-published"
    >
      {readable(children, overrides)}
    </time>
  );
}
