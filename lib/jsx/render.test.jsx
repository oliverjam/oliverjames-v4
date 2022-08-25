import { assertEquals } from "https://deno.land/std@0.139.0/testing/asserts.ts";
import { render } from "./render.js";

Deno.test("render module renders JSX to string", () => {
  let content = <h1 class="test">Hello</h1>;
  let result = render(content);
  assertEquals(result, `<h1 class="test">Hello</h1>`);
});

Deno.test("render module renders void elements without closing tag", () => {
  let content = <input type="number" />;
  let result = render(content);
  assertEquals(result, `<input type="number" />`);
});

Deno.test("render module sets boolean attributes correctly", () => {
  let content = (
    <details open={true}>
      <summary>Toggle</summary>
    </details>
  );
  let result = render(content);
  assertEquals(result, `<details open><summary>Toggle</summary></details>`);
});

Deno.test("render module removes boolean attributes correctly", () => {
  let content = (
    <details open={false}>
      <summary>Toggle</summary>
    </details>
  );
  let result = render(content);
  assertEquals(result, `<details><summary>Toggle</summary></details>`);
});

Deno.test("render module renders nothing if passed false/null", () => {
  assertEquals(render(false), "");
  assertEquals(render(null), "");
});

Deno.test("render module renders primitive types directly", () => {
  assertEquals(render("test"), "test");
  assertEquals(render(true), "true");
  assertEquals(render(999), "999");
});

Deno.test("render module renders array directly", () => {
  let content = [<p>test</p>, <b>2</b>];
  assertEquals(render(content), `<p>test</p><b>2</b>`);
});

Deno.test("render module renders Fragment correctly", () => {
  let content = (
    <>
      <p>test</p>
      <b>2</b>
    </>
  );
  assertEquals(render(content), `<p>test</p><b>2</b>`);
});

Deno.test("render module renders multiple children", () => {
  let content = (
    <section>
      <h2 id="title">Title</h2>
      <p>test</p>
    </section>
  );
  let result = render(content);
  assertEquals(
    result,
    `<section><h2 id="title">Title</h2><p>test</p></section>`
  );
});

Deno.test("render module renders component functions", () => {
  let Title = ({ children }) => <h2 id={children.toLowerCase()}>{children}</h2>;
  let content = (
    <section>
      <Title>Title</Title>
      <p>test</p>
    </section>
  );
  let result = render(content);
  assertEquals(
    result,
    `<section><h2 id="title">Title</h2><p>test</p></section>`
  );
});
