const test = require("flug");
const { getOrCreateIterator } = require("./index.js");

test("array iteration", ({ eq }) => {
  const data = [1, 2, 3, 4];
  const iter = getOrCreateIterator(data);
  eq(typeof iter.next, "function");
  eq(Array.from(iter), data);
});
