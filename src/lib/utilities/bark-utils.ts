import { z } from "zod";

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
