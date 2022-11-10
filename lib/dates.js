export function reading_time(content) {
  const raw = content.replace(/(<([^>]+)>)/gi, "");
  const words = raw.match(/[\u0400-\u04FF]+|\S+\s*/g);
  const count = words ? words.length : 0;
  const rate = 200 / 60;
  return count / rate;
}

export function readable(d, overrides = {}) {
  let current_year = d.getFullYear() === new Date().getFullYear();
  return d.toLocaleDateString("en-GB", {
    year: current_year ? undefined : "numeric",
    month: "long",
    day: "numeric",
    ...overrides,
  });
}
