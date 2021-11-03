const test = require("flug");
const { isArray, hasNext, getOrCreateIterator } = require("./index.js");

test("isArray", ({ eq }) => {
  eq(isArray([]), true);
  eq(isArray({}), false);
});

test("hasNext", ({ eq }) => {
  eq(hasNext([][Symbol.iterator]()), true);
  eq(hasNext({ next: null }), false);
  eq(hasNext({ next: () => ({}) }), true);
});

test("array iteration", ({ eq }) => {
  const data = [1, 2, 3, 4];
  const iter = getOrCreateIterator(data);
  eq(typeof iter.next, "function");
  eq(Array.from(iter), data);
});

test("for let", ({ eq }) => {
  // create a regular object
  // masquerading as an array
  let i = 0;
  const data = {
    next: function () {
      if (i < 10) return { value: i++, done: false };
      else return { done: true };
    }
  };

  const results = [];
  const iter = getOrCreateIterator(data);
  for (let n of iter) {
    results.push(n);
  }
  eq(results, [0, 1, 2, 3, 4, 5, 6, 7, 8, 9]);
});
