import { Layout as Base } from "./base.jsx";

export function Layout({ children, ...data }) {
  return (
    <Base {...data}>
      <div class="max-w-content mx-auto grid gap-7 gutter">
        <h1 class="font-5-8 text-center">{data.title}</h1>
        {children}
      </div>
    </Base>
  );
}
