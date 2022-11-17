import {
  assertEquals,
  assertNotEquals,
} from "https://deno.land/std@0.139.0/testing/asserts.ts";
import { hash_file } from "./hash.js";

Deno.test("produces stable content hashes", async () => {
  let hash1 = await hash_file("abcdefg");
  let hash2 = await hash_file("abcdefg");
  assertEquals(hash1.length, 8);
  assertEquals(hash1, hash2);
});

Deno.test("produces different hashes for different content", async () => {
  let hash1 = await hash_file("abcdefg");
  let hash2 = await hash_file("abcdefgh");
  assertNotEquals(hash1, hash2);
});
