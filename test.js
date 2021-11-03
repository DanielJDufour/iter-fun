const test = require("flug");
const { isArray, hasNext, getOrCreateIterator } = require("./index.js");

test("isArray", ({ eq }) => {
  eq(isArray([]), true);
  eq(isArray({}), false);
});

test("hasNext", ({ eq }) => {
  eq(hasNext([][Symbol.iterator]()), true);
  eq(hasNext({next: null}), false);
  eq(hasNext({next: () => ({})}), true);
});

test("array iteration", ({ eq }) => {
  const data = [1, 2, 3, 4];
  const iter = getOrCreateIterator(data);
  eq(typeof iter.next, "function");
  eq(Array.from(iter), data);
});
