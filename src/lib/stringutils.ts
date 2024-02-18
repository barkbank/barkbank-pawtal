export function guaranteed(arg: string | undefined): string {
  if (arg === undefined) {
    throw Error("arg is undefined");
  }
  return arg;
}
