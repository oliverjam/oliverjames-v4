export function ellipsis(intro) {
  if (!intro) return undefined;
  let trimmed = intro.trim();
  if (trimmed.endsWith(".")) {
    return trimmed.slice(0, -1) + "…";
  } else {
    return trimmed + "…";
  }
}
