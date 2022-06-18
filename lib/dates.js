export function reading_time(content) {
  const raw = content.replace(/(<([^>]+)>)/gi, "");
  const words = raw.match(/[\u0400-\u04FF]+|\S+\s*/g);
  const count = words ? words.length : 0;
  const rate = 200 / 60;
  return count / rate;
}

export function readable(d) {
  return d.toLocaleDateString("en-GB", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}
