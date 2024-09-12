export type Result<T, E> =
  | {
      result: T;
      error?: undefined;
    }
  | {
      result?: undefined;
      error: E;
    };

export function Ok<T>(result: T): Result<T, never> {
  return { result };
}

export function Err<E>(error: E): Result<never, E> {
  return { error };
}
