type IndexKey = number | string;
type IndexKeyGetter<T> = (val: T) => IndexKey;
type IndexedObject<T> = {
  [key in IndexKey]: T;
};

export function remapToIndexedObject<T extends { id: IndexKey }>(
  array: T[],
  getIndexKey: IndexKeyGetter<T> = (val) => val.id,
) {
  return array.reduce((acc, val) => {
    acc[getIndexKey(val)] = val;
    return acc;
  }, Object.create(null) as IndexedObject<T>);
}
