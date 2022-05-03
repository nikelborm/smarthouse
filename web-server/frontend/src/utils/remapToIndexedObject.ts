type IndexKey = number | string;
type IndexKeyGetter<T> = (val: T) => IndexKey;
type IndexedObject<T> = {
  [key in IndexKey]: T;
};

export function remapToIndexedObject<T>(
  array: T[],
  getIndexKey: IndexKeyGetter<T> = (val) => val['id']
) {
  const map: IndexedObject<T> = Object.create(null);

  for (const element of array) {
    map[getIndexKey(element)] = element;
  }

  return map;
}
