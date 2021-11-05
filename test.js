const test = require("flug");
const {
  isArray,
  hasNext,
  isIterator,
  getOrCreateIterator,
  wrapNextFunction
} = require("./index.js");

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

test("array from wrapped next function", ({ eq }) => {
  let i = 0;
  const iter = wrapNextFunction(() =>
    i++ < 10 ? { value: i, done: false } : { done: true }
  );
  const results = Array.from(iter);
  eq(results, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
});

test("for let array iterator", async ({ eq }) => {
  const data = [1, 2, 3, 4];
  const it = data[Symbol.iterator]();
  eq(isIterator(it), true);
  const iter = getOrCreateIterator(it);
  eq(it, iter);
  const results = [];
  for (let value of iter) results.push(value);
  eq(results, [1, 2, 3, 4]);
});

test("for let wrapped next function", ({ eq }) => {
  let i = 0;
  const iter = wrapNextFunction(() =>
    i++ < 10 ? { value: i, done: false } : { done: true }
  );
  const results = [];
  for (let value of iter) results.push(value);
  eq(results, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
});

test("for let wrapped async next function", async ({ eq }) => {
  let i = 0;
  const iter = wrapNextFunction(() =>
    i++ < 10 ? { value: Promise.resolve(i), done: false } : { done: true }
  );
  const results = [];
  for await (let value of iter) results.push(value);
  eq(results, [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]);
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
