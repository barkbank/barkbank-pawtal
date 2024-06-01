export function pickOne<T>(values: T[]): T {
  const n = values.length;
  const i = Math.floor(Math.random() * n) % n;
  return values[i];
}
