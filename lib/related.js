export function related(current, tags, prev, next) {
  let related = new Map();
  for (let tag of current.tags || []) {
    for (let post of tags.get(tag)) {
      if (related.size === 3) {
        break;
      }
      if (![prev, current, next].includes(post) && !related.has(post.slug)) {
        related.set(post.slug, post);
      }
    }
  }
  return Array.from(related.values());
}
