export async function map_async(iter, cb) {
  let promises = [];
  for await (let value of iter) {
    promises.push(cb(value));
  }
  return Promise.all(promises);
}
