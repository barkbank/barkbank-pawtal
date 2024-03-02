export function guaranteed<T>(arg: T | undefined | null): T {
  if (arg === undefined) {
    throw Error("arg is undefined");
  }
  if (arg === null) {
    throw Error("arg is null");
  }
  return arg;
}
