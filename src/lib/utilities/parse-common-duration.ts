import { Duration } from "date-fns";
import { z } from "zod";

export function parseCommonDuration(durationText: string): Duration {
  const durationRegex = /(\d+)\s*(\w+)/;
  const match = durationText.match(durationRegex);
  if (!match) {
    throw new Error(`Cannot understand duration: ${durationText}`);
  }
  const value = parseInt(match[1]);
  const unitText = match[2].toLowerCase();
  const unit = toUnit(unitText);

  return { [unit]: value };
}

const UnitEnum = {
  years: "years",
  months: "months",
  weeks: "weeks",
  days: "days",
  hours: "hours",
  minutes: "minutes",
  seconds: "seconds",
} as const;

const UnitSchema = z.nativeEnum(UnitEnum);
type UnitType = z.infer<typeof UnitSchema>;

const unitMap: Record<string, UnitType> = {
  years: UnitEnum.years,
  year: UnitEnum.years,
  yrs: UnitEnum.years,
  yr: UnitEnum.years,
  y: UnitEnum.years,
  months: UnitEnum.months,
  month: UnitEnum.months,
  mths: UnitEnum.months,
  mth: UnitEnum.months,
  weeks: UnitEnum.weeks,
  week: UnitEnum.weeks,
  wks: UnitEnum.weeks,
  wk: UnitEnum.weeks,
  w: UnitEnum.weeks,
  days: UnitEnum.days,
  day: UnitEnum.days,
  d: UnitEnum.days,
  hours: UnitEnum.hours,
  hour: UnitEnum.hours,
  hrs: UnitEnum.hours,
  hr: UnitEnum.hours,
  minutes: UnitEnum.minutes,
  minute: UnitEnum.minutes,
  mins: UnitEnum.minutes,
  min: UnitEnum.minutes,
  seconds: UnitEnum.seconds,
  second: UnitEnum.seconds,
  secs: UnitEnum.seconds,
  sec: UnitEnum.seconds,
};

function toUnit(text: string): UnitType {
  const unit = unitMap[text];
  if (unit === undefined) {
    throw new Error(`Cannot understand unit: ${text}`);
  }
  return unit;
}
