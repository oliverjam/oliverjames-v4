let encoder = new TextEncoder();

export async function hash_file(string) {
  let data = encoder.encode(string);
  let buffer = await crypto.subtle.digest("SHA-1", data);
  let array = Array.from(new Uint8Array(buffer));
  let hex = array.map((b) => b.toString(16).padStart(2, "0")).join("");
  return hex.slice(0, 8);
}
