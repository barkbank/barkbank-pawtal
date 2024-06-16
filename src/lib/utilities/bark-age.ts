/**
 * Calculate year age in the way that humans do it. For example, if a dog's
 * birthday is 8 Oct 2020, then on 7 Oct 2022 the age is expected to be 1
 * because the dog will turn 2 only on 8 Oct 2022.
 */
export function getAgeYears(fromTime: Date, toTime: Date): number {
  // TODO: getAgeYears should have a timezone paramter
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
  // TODO: getAgeMonths should have a timezone paramter
  const dy = toTime.getUTCFullYear() - fromTime.getUTCFullYear();
  const dm = toTime.getUTCMonth() - fromTime.getUTCMonth();
  const ageMonths = dy * 12 + dm;
  if (toTime.getUTCDate() < fromTime.getUTCDate()) {
    return ageMonths - 1;
  }
  return ageMonths;
}

export function getAgeYearsAndMonths(
  fromTime: Date,
  toTime: Date,
): { years: number; months: number } {
  const ageMonths = getAgeMonths(fromTime, toTime);
  const years = Math.floor(ageMonths / 12);
  const months = ageMonths % 12;
  return { years, months };
}

export function getFormattedAge(fromTime: Date, toTime: Date): string {
  const { years, months } = getAgeYearsAndMonths(fromTime, toTime);
  const yearUnit = years === 1 ? "year" : "years";
  const monthUnit = months === 1 ? "month" : "months";
  if (months === 0) {
    return `${years} ${yearUnit}`;
  }
  return `${years} ${yearUnit} ${months} ${monthUnit}`;
}
