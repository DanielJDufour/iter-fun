export function isArray(data) {
  try {
    return data.constructor.name.endsWith("Array");
  } catch {
    return false;
  }
}

export function hasNext(data) {
  try {
    return typeof data.next === "function";
  } catch {
    return false;
  }
}

export function hasIterator(data) {
  try {
    return "@@iterator" in data;
  } catch {
    return false;
  }
}

export function hasSymbolIterator(data) {
  try {
    return Symbol.iterator in data.constructor.prototype;
  } catch {
    return false;
  }
}

export function getIterator(data) {
  const iter = data["@@iterator"];
  if (hasNext(iter)) {
    return iter;
  } else if (typeof iter === "function") {
    return iter();
  }
}

export function createIterator(data) {
  let i = 0;
  let len = data.length;
  return {
    next: () => (i++ < len ? { value: data[i], done: false } : { done: true })
  };
}

export function getOrCreateIterator(data) {
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
