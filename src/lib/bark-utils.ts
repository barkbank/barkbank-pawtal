import { z } from "zod";

/**
 * Use this to define "enums".
 */
export type ObjectValues<T> = T[keyof T];

export function guaranteed<T>(arg: T | undefined | null): T {
  if (arg === undefined) {
    throw Error("arg is undefined");
  }
  if (arg === null) {
    throw Error("arg is null");
  }
  return arg;
}

export function isValidWeightKg(weightKg: string): boolean {
  const value = weightKg.trim();
  if (value === "") {
    return true;
  }
  const regex = /^\d+(\.\d+)?$/;
  if (!regex.test(value)) {
    return false;
  }
  const numericalValue = Number(value);
  return numericalValue > 0;
}

export function parseWeightKg(weightKg: string): number | null {
  if (!isValidWeightKg(weightKg)) {
    throw new Error(`Invalid weight: ${weightKg}`);
  }
  const value = weightKg.trim();
  if (value === "") {
    return null;
  }
  return Number(value);
}

export function isValidEmail(email: string): boolean {
  try {
    z.string().email().parse(email);
    return true;
  } catch {
    return false;
  }
}

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

export const BARK_UTC = {
  getDate: (year: number, month: number, day: number) => {
    return new Date(Date.UTC(year, month - 1, day));
  },
  parseDate: (yyyy_mm_dd: string) => {
    return new Date(`${yyyy_mm_dd}T00:00:00Z`);
  },
  formatDate: (utcDate: Date) => {
    return utcDate.toISOString().split("T")[0];
  },
};
