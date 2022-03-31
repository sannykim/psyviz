export function findAllByKey(obj: any, keyToFind: any): any {
  return Object.entries(obj).reduce(
    (acc, [key, value]: any) =>
      key === keyToFind
        ? acc.concat(value)
        : typeof value === "object"
        ? acc.concat(findAllByKey(value, keyToFind))
        : acc,
    []
  );
}
