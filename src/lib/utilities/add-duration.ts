import {
  Duration,
  addDays,
  addHours,
  addMinutes,
  addMonths,
  addSeconds,
  addWeeks,
  addYears,
} from "date-fns";

export function addDuration(reference: Date, duration: Duration): Date {
  let result = reference;
  result = addYears(result, duration?.years ?? 0);
  result = addMonths(result, duration?.months ?? 0);
  result = addWeeks(result, duration?.weeks ?? 0);
  result = addDays(result, duration?.days ?? 0);
  result = addHours(result, duration?.hours ?? 0);
  result = addMinutes(result, duration?.minutes ?? 0);
  result = addSeconds(result, duration?.seconds ?? 0);
  return result;
}
