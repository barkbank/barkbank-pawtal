import { ReadonlyURLSearchParams } from "next/navigation";

/**
 * Map search params into query params.
 *
 * @param searchParams The return value of useSearchParams from
 * "next/navigation".
 *
 * @returns Query Parameters
 */
export function toQueryParams(
  searchParams: ReadonlyURLSearchParams,
): Record<string, string> {
  const queryParams: Record<string, string> = {};
  searchParams.forEach((value, key) => {
    queryParams[key] = value;
  });
  return queryParams;
}
