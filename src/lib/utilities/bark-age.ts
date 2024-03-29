/**
 * Calculate year age in the way that humans do it. For example, if a dog's
 * birthday is 8 Oct 2020, then on 7 Oct 2022 the age is expected to be 1
 * because the dog will turn 2 only on 8 Oct 2022.
 */
export function getAgeYears(fromTime: Date, toTime: Date): number {
  const ageYears = toTime.getUTCFullYear() - fromTime.getUTCFullYear();
  if (toTime.getUTCMonth() < fromTime.getUTCMonth()) {
    return ageYears - 1;
  }
  if (toTime.getUTCMonth() > fromTime.getUTCMonth()) {
    return ageYears;
  }
  if (toTime.getUTCDate() < fromTime.getUTCDate()) {
    return ageYears - 1;
  }
  return ageYears;
}

export function getAgeMonths(fromTime: Date, toTime: Date): number {
  const dy = toTime.getUTCFullYear() - fromTime.getUTCFullYear();
  const dm = toTime.getUTCMonth() - fromTime.getUTCMonth();
  const ageMonths = dy * 12 + dm;
  if (toTime.getUTCDate() < fromTime.getUTCDate()) {
    return ageMonths - 1;
  }
  return ageMonths;
}

