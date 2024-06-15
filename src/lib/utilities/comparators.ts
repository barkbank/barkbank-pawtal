export function compare<T>(x: T, y: T): number {
  if (x < y) return -1;
  if (x > y) return +1;
  return 0;
}

export function compareNullableWithNullFirst<T>(
  x: T | null | undefined,
  y: T | null | undefined,
): number {
  const xIsPresent = x !== null && x !== undefined;
  const yIsPresent = y !== null && y !== undefined;
  if (!xIsPresent && yIsPresent) return -1;
  if (xIsPresent && !yIsPresent) return +1;
  if (xIsPresent && yIsPresent) {
    if (x < y) return -1;
    if (x > y) return +1;
  }
  return 0;
}
