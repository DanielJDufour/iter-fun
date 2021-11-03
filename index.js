function isArray(data) {
  try {
    return data.constructor.name.endsWith("Array");
  } catch {
    return false;
  }
}

function hasNext(data) {
  try {
    return typeof data.next === "function";
  } catch {
    return false;
  }
}

function hasIterator(data) {
  try {
    return "@@iterator" in data;
  } catch {
    return false;
  }
}

function hasSymbolIterator(data) {
  try {
    return Symbol.iterator in data.constructor.prototype;
  } catch {
    return false;
  }
}

function getIterator(data) {
  const iter = data["@@iterator"];
  if (hasNext(iter)) {
    return iter;
  } else if (typeof iter === "function") {
    return iter();
  }
}

function createIterator(data) {
  let i = 0;
  let len = data.length;
  return {
    next: () => (i++ < len ? { value: data[i], done: false } : { done: true })
  };
}

function getOrCreateIterator(data) {
  if (hasNext(data)) {
    return data;
  } else if (hasSymbolIterator(data)) {
    return data[Symbol.iterator]();
  } else if (hasIterator(data)) {
    return getIterator(data);
  } else if (typeof data === "string" || isArray(data)) {
    return createIterator(data);
  } else {
    throw "[iter-fun] unable to determine iterator";
  }
}

if (typeof module === "object") {
  module.exports = {
    isArray,
    hasNext,
    hasSymbolIterator,
    hasIterator,
    getIterator,
    createIterator,
    getOrCreateIterator
  };
}
