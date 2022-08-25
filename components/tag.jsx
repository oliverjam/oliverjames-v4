export function Tag({ size = "sm", slug, children }) {
  return (
    <li>
      <a class={`block bg-dim p-category ${cn[size]}`} href={`/tags/${slug}`}>
        {children}
      </a>
    </li>
  );
}

let cn = {
  sm: "px-2 text-small ",
  md: "py-1 px-3",
};
