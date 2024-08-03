/**
 * A utility for creating global singletons
 *
 * https://github.com/vercel/next.js/discussions/15054#discussioncomment-658138
 */
export class GlobalRef<T> {
  private readonly sym: symbol;

  constructor(uniqueName: string) {
    this.sym = Symbol.for(uniqueName);
  }

  get value(): T | undefined {
    return (global as any)[this.sym] as T | undefined;
  }

  set value(value: T) {
    (global as any)[this.sym] = value;
  }
}
