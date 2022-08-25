import { assertEquals } from "https://deno.land/std@0.139.0/testing/asserts.ts";
import { related } from "./related.js";

Deno.test("handles post without tags", () => {
  let result = related({ url: "/test.html" });
  assertEquals(result.length, 0);
});

Deno.test("related gets 3 posts with matching tag", () => {
  let posts = [
    { slug: "/test.html", tags: ["js"] },
    { slug: "/other.html", tags: ["js", "other"] },
    { slug: "/other2.html", tags: ["js", "other"] },
    { slug: "/other3.html", tags: ["other"] },
    { slug: "/other4.html", tags: ["js", "other"] },
  ];

  let tags = new Map().set("js", [posts[0], posts[1], posts[2], posts[4]]);
  let result = related(posts[0], tags);
  assertEquals(result.length, 3);
  assertEquals(result[0], posts[1]);
  assertEquals(result[1], posts[2]);
  assertEquals(result[2], posts[4]);
});

Deno.test("related ignores prev/next posts", () => {
  let posts = [
    { slug: "/other.html", tags: ["js"] },
    { slug: "/test.html", tags: ["js"] },
    { slug: "/other2.html", tags: ["js"] },
    { slug: "/other3.html", tags: ["js"] },
    { slug: "/other4.html", tags: ["js"] },
    { slug: "/other5.html", tags: ["js"] },
  ];

  let tags = new Map().set("js", posts);
  let result = related(posts[1], tags, posts[0], posts[2]);
  assertEquals(result.length, 3);
  assertEquals(result[0], posts[3]);
  assertEquals(result[1], posts[4]);
  assertEquals(result[2], posts[5]);
});

Deno.test("related gets 3 posts with many matching tags", () => {
  let posts = [
    { slug: "/test.html", tags: ["js", "other", "third"] },
    { slug: "/other.html", tags: ["js", "other"] },
    { slug: "/other2.html", tags: ["fourth"] },
    { slug: "/other3.html", tags: ["third"] },
    { slug: "/other4.html", tags: ["js", "other"] },
  ];

  let tags = new Map()
    .set("js", [posts[0], posts[1], posts[4]])
    .set("other", [posts[0], posts[1], posts[4]])
    .set("third", [posts[3]]);
  let result = related(posts[0], tags);
  assertEquals(result.length, 3);
  assertEquals(result[0], posts[1]);
  assertEquals(result[1], posts[4]);
  assertEquals(result[2], posts[3]);
});

Deno.test("no related if no posts have matching tag", () => {
  let posts = [
    { slug: "/test.html", tags: ["js"] },
    { slug: "/other.html", tags: ["other"] },
    { slug: "/other2.html", tags: ["other"] },
    { slug: "/other3.html", tags: ["other"] },
    { slug: "/other4.html", tags: ["other"] },
  ];

  let tags = new Map().set("js", []);
  tags.get("js").push(posts[0]);
  let result = related(posts[0], tags);
  assertEquals(result.length, 0);
});
