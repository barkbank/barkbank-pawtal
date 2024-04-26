import { MILLIS_PER_DAY, MILLIS_PER_WEEK } from "@/lib/utilities/bark-millis";

export function weeksAgo(numWeeks: number): Date {
  return dateAgo({ numWeeks });
}

/**
 * @returns Date roughly the specified duration ago.
 */
export function dateAgo(args: {
  numYears?: number;
  numMonths?: number;
  numWeeks?: number;
  numDays?: number;
}): Date {
  const { numYears, numMonths, numWeeks, numDays } = args;
  const dy = (numYears ?? 0) * 365 * MILLIS_PER_DAY;
  const dm = (numMonths ?? 0) * (365 / 12) * MILLIS_PER_DAY;
  const dw = (numWeeks ?? 0) * MILLIS_PER_WEEK;
  const dd = (numDays ?? 0) * MILLIS_PER_DAY;
  return new Date(Date.now() - dy - dm - dw - dd);
}
