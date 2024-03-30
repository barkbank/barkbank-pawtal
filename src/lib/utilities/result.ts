export type Result<T, E> =
  | {
      result: T;
      error?: undefined;
    }
  | {
      result?: undefined;
      error: E;
    };

export function Ok<T, E>(result: T): Result<T, E> {
  return { result };
}

export function Err<T, E>(error: E): Result<T, E> {
  return { error };
}
