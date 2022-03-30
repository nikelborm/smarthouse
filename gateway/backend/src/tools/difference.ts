export function differenceBetweenSetsInArray(
  setA: Set<number>,
  setB: Set<number>,
) {
  const _difference = new Set(setA);

  for (const elem of setB) {
    _difference.delete(elem);
  }

  return [..._difference.values()];
}
