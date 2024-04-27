import { MILLIS_PER_DAY, MILLIS_PER_WEEK } from "@/lib/utilities/bark-millis";

export function weeksAgo(numWeeks: number): Date {
  return dateAgo({ numWeeks });
}

export type Delta = {
  numYears?: number;
  numMonths?: number;
  numWeeks?: number;
  numDays?: number;
};

/**
 * @returns Date roughly the specified duration ago.
 */
export function dateAgo(delta: Delta): Date {
  return new Date(Date.now() - toMillis(delta));
}

export function futureDate(delta: Delta): Date {
  return new Date(Date.now() + toMillis(delta));
}

function toMillis(delta: Delta): number {
  const { numYears, numMonths, numWeeks, numDays } = delta;
  const dy = (numYears ?? 0) * 365 * MILLIS_PER_DAY;
  const dm = (numMonths ?? 0) * (365 / 12) * MILLIS_PER_DAY;
  const dw = (numWeeks ?? 0) * MILLIS_PER_WEEK;
  const dd = (numDays ?? 0) * MILLIS_PER_DAY;
  return dy + dm + dw + dd;
}
